'use client';

import * as React from 'react';
import { Menu, Shield, Plus, Sparkles } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { UnifiedInput } from '@/components/scan/UnifiedInput';
import { ResultsPanel } from '@/components/analysis/ResultsPanel';
import { runImageScan, runTextScan, runUrlScan } from '@/lib/api';
import { loadScanHistory, saveScanHistoryItem, deleteScanHistoryItem, clearAllScanHistory } from '@/lib/history';
import type { ScanResult, ScanHistoryItem } from '@/lib/types';

export default function HomePage() {
  const [result, setResult] = React.useState<ScanResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<ScanHistoryItem[]>([]);
  const [currentScanId, setCurrentScanId] = React.useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  // Load history on mount
  React.useEffect(() => {
    setHistory(loadScanHistory());
  }, []);

  const handleSubmit = async (args: { 
    type: 'text' | 'image' | 'url' | 'qr'; 
    text?: string; 
    url?: string; 
    file?: File 
  }) => {
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

      setResult(res);
      const savedItem = saveScanHistoryItem(args.type, previewText, res);
      setHistory(loadScanHistory());
      setCurrentScanId(savedItem.id);
    } catch (err: any) {
      setError(err?.message || 'Unknown error occurred during threat scan');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistoryItem = (item: ScanHistoryItem) => {
    setResult(item.result);
    setCurrentScanId(item.id);
    setError(null);
    setMobileSidebarOpen(false);
  };

  const handleNewScan = () => {
    setResult(null);
    setCurrentScanId(null);
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Minimal Navbar */}
        <header className="h-12 border-b border-zinc-800/80 px-4 flex items-center justify-between shrink-0 bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              title="Open history"
            >
              <Menu size={18} />
            </button>
            <div className="text-xs font-medium text-zinc-300 truncate">
              {result ? result.scam_category : 'CyberRaksha Analysis'}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="hidden sm:inline font-mono text-[11px] text-zinc-400">
              National Helpline: <b className="text-zinc-300">1930</b>
            </span>
          </div>
        </header>

        {/* Scrollable Results Viewport */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
          <ResultsPanel result={result} loading={loading} error={error} />
        </main>

        {/* Floating Unified Input Bar at Bottom (Claude/ChatGPT style) */}
        <footer className="p-3 md:p-4 pb-5 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent shrink-0">
          <UnifiedInput onSubmit={handleSubmit} loading={loading} />
        </footer>
      </div>
    </div>
  );
}
