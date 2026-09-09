'use client';

import * as React from 'react';
import { Menu, Shield, LogOut } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { UnifiedInput } from '@/components/scan/UnifiedInput';
import ResultsPanel from '@/components/analysis/ResultsPanel';
import { runImageScan, runTextScan, runUrlScan } from '@/lib/api';
import { loadScanHistory, saveScanHistoryItem, deleteScanHistoryItem, clearAllScanHistory } from '@/lib/history';
import type { ScanResult, ScanHistoryItem } from '@/lib/types';

interface ScanAppProps {
  /** Called when the user clicks Logout. Parent clears session and redirects to Homepage. */
  onLogout?: () => void;
  userName?: string;
}

export function ScanApp({ onLogout, userName }: ScanAppProps = {}) {
  const [result, setResult] = React.useState<ScanResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<ScanHistoryItem[]>([]);
  const [currentScanId, setCurrentScanId] = React.useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const mainScrollRef = React.useRef<HTMLDivElement>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // Load history on mount
  React.useEffect(() => {
    setHistory(loadScanHistory());
  }, []);

  // Smooth scroll to top when new scan starts or result is loaded
  React.useEffect(() => {
    if (result || loading) {
      mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [result, loading]);

  const handleNewScan = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setResult(null);
    setCurrentScanId(null);
    setError(null);
    setMobileSidebarOpen(false);
    mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const onNewScanEvent = () => handleNewScan();
    window.addEventListener('cyberraksha-new-scan', onNewScanEvent);
    return () => window.removeEventListener('cyberraksha-new-scan', onNewScanEvent);
  }, []);

  const handleSubmit = async (args: {
    type: 'text' | 'image' | 'url' | 'qr';
    text?: string;
    url?: string;
    file?: File;
  }) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentScanId(null);

    try {
      let res: ScanResult;
      let previewText = '';

      if (args.type === 'text' || (args.type === 'qr' && !args.file)) {
        previewText = args.text || '';
        res = await runTextScan(args.text || '');
      } else if (args.type === 'url') {
        previewText = args.url || '';
        res = await runUrlScan(args.url || '');
      } else if (args.file) {
        previewText = args.file.name;
        res = await runImageScan(args.file, args.type === 'qr' ? 'qr' : 'image');
      } else {
        throw new Error('No analysable content provided.');
      }

      if (controller.signal.aborted) {
        return;
      }

      setResult(res);
      const savedItem = saveScanHistoryItem(args.type, previewText, res);
      setHistory(loadScanHistory());
      setCurrentScanId(savedItem.id);
    } catch (err: any) {
      if (controller.signal.aborted) {
        return;
      }
      setError(err?.message || 'Unknown error occurred during threat scan');
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
        setLoading(false);
      }
    }
  };

  const handleSelectHistoryItem = (item: ScanHistoryItem) => {
    setResult(item.result);
    setCurrentScanId(item.id);
    setError(null);
    setMobileSidebarOpen(false);
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteScanHistoryItem(id);
    setHistory(updated);
    if (currentScanId === id) {
      setResult(null);
      setCurrentScanId(null);
    }
  };

  const handleClearHistory = () => {
    clearAllScanHistory();
    setHistory([]);
    setResult(null);
    setCurrentScanId(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        history={history}
        currentId={currentScanId}
        onSelectScan={handleSelectHistoryItem}
        onNewScan={handleNewScan}
        onDeleteScan={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area: Single dedicated vertical scroll viewport */}
      <div className="flex-1 flex flex-col h-full min-w-0 min-h-0 overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-14 border-b border-white/10 px-4 md:px-6 flex items-center justify-between shrink-0 bg-zinc-950/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition"
              title="Open history"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/15 text-cyan-400">
                <Shield size={15} />
              </div>
              <h1 className="text-sm font-bold tracking-tight text-zinc-100 truncate">
                CyberRaksha Analysis
              </h1>
            </div>
          </div>

          {/* Right side group: User info, Helpline & prominent Logout button */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{userName || 'Active User'}</span>
            </div>

            <span className="hidden lg:inline font-mono text-[11px] text-zinc-400">
              Helpline:{' '}
              <a
                href="https://cybercrime.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition"
                title="National Cybercrime Reporting Portal (1930)"
              >
                1930
              </a>
            </span>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-200 transition shadow-sm"
                title="Logout from CyberRaksha"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </header>

        {/* Stable Scrollable Results Viewport */}
        <main
          ref={mainScrollRef}
          className="flex-1 overflow-y-auto overscroll-y-contain custom-scrollbar px-4 py-6 md:px-8 md:py-8 scroll-smooth"
        >
          <ResultsPanel result={result} loading={loading} error={error} onReset={handleNewScan} />
        </main>

        {/* Floating Unified Input Bar at Bottom */}
        <footer className="p-3 md:p-4 pb-5 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent shrink-0 z-10">
          <UnifiedInput onSubmit={handleSubmit} loading={loading} />
        </footer>
      </div>
    </div>
  );
}
