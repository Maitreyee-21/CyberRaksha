'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Search,
  Trash2,
  MessageSquare,
  Link2,
  QrCode,
  Image as ImageIcon,
  FileText,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  BarChart3,
  ScanSearch,
} from 'lucide-react';

import AppShell from '@/components/layout/AppShell';

import {
  loadScanHistory,
  deleteScanHistoryItem,
  clearAllScanHistory,
} from '@/lib/history';

import type { ScanHistoryItem } from '@/lib/types';

type RiskStatus = {
  text: string;
  className: string;
  icon: typeof ShieldCheck;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(loadScanHistory());
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return history;

    return history.filter((item) => {
      const result = item.result;

      const searchable = [
        item.snippet,
        item.inputType,
        getScanTypeLabel(item.inputType),
        result.scam_category,
        result.summary,
        result.risk_level,
        ...(result.red_flags ?? []),
        result.scam_fingerprint?.primary_tactic,
        result.variant_detection?.scam_family,
        result.variant_detection?.match_type,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(q);
    });
  }, [history, search]);

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'url':
      case 'link':
        return <Link2 size={20} />;
      case 'qr':
      case 'qrcode':
        return <QrCode size={20} />;
      case 'image':
        return <ImageIcon size={20} />;
      case 'document':
        return <FileText size={20} />;
      default:
        return <MessageSquare size={20} />;
    }
  };

  const getScanTypeLabel = (type: string): string => {
    switch (type?.toLowerCase()) {
      case 'url':
      case 'link':
        return 'Link Scan';
      case 'qr':
      case 'qrcode':
        return 'QR Code Scan';
      case 'image':
        return 'Image Scan';
      case 'document':
        return 'Document Scan';
      case 'text':
      case 'message':
      default:
        return 'Message Scan';
    }
  };

  const getStatus = (risk: string): RiskStatus => {
    const value = String(risk).toUpperCase();

    if (value === 'HIGH') {
      return {
        text: 'Not Safe',
        className: 'bg-red-400/10 text-red-400',
        icon: XCircle,
      };
    }

    if (value === 'MEDIUM') {
      return {
        text: 'Be Careful',
        className: 'bg-amber-400/10 text-amber-400',
        icon: AlertTriangle,
      };
    }

    return {
      text: 'Looks Safe',
      className: 'bg-emerald-400/10 text-emerald-400',
      icon: ShieldCheck,
    };
  };

  const removeItem = (id: string) => {
    setHistory(deleteScanHistoryItem(id));

    if (openId === id) {
      setOpenId(null);
    }
  };

  const clearHistory = () => {
    if (history.length === 0) return;

    const confirmed = window.confirm(
      'Clear all saved safety checks? This cannot be undone.'
    );

    if (!confirmed) return;

    clearAllScanHistory();
    setHistory([]);
    setOpenId(null);
  };

  return (
    <AppShell>
      <section className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
        <div className="mx-auto max-w-[1000px]">
          {/* HEADER */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">
                Your Checks
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Review, search and understand your recent safety checks.
              </p>
            </div>

            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-red-400/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-400/10"
              >
                <Trash2 size={15} />
                Clear all
              </button>
            )}
          </div>

          {/* SEARCH */}
          <div className="mt-7 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#10161C] px-4">
            <Search size={18} className="shrink-0 text-slate-600" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search checks, scam types or warnings..."
              aria-label="Search your safety checks"
              className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-xs font-medium text-slate-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* SUMMARY */}
          {history.length > 0 && (
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
              <ScanSearch size={14} />
              <span>
                Showing {filtered.length} of {history.length} checks
              </span>
            </div>
          )}

          {/* LIST */}
          <div className="mt-3 space-y-3">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.07] bg-[#10161C] p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#00E6D0]/10 text-[#00E6D0]">
                  <Search size={21} />
                </div>

                <div className="mt-4 text-sm font-semibold text-white">
                  {history.length === 0
                    ? 'No checks yet'
                    : 'No matching checks'}
                </div>

                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-600">
                  {history.length === 0
                    ? 'Your completed safety checks will appear here.'
                    : 'Try a different keyword such as banking, UPI, job, URL or a warning.'}
                </p>
              </div>
            ) : (
              filtered.map((item) => {
                const result = item.result;
                const status = getStatus(result.risk_level);
                const StatusIcon = status.icon;
                const isOpen = openId === item.id;

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#10161C] transition hover:border-white/[0.11]"
                  >
                    {/* MAIN ROW */}
                    <div className="flex items-center gap-3 p-3 sm:p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#182129] text-slate-400">
                        {getIcon(item.inputType)}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setOpenId(isOpen ? null : item.id)
                        }
                        className="min-w-0 flex-1 text-left"
                        aria-expanded={isOpen}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-sm font-semibold text-white">
                            {getScanTypeLabel(item.inputType)}
                          </span>

                          {result.scam_category && !result.scam_category.toLowerCase().includes('benign') && (
                            <span className="rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-red-400">
                              {result.scam_category}
                            </span>
                          )}
                        </div>

                        <div className="mt-1 truncate text-xs text-slate-600">
                          {item.snippet || result.summary || 'No preview available'}
                        </div>
                      </button>

                      <span
                        className={`hidden shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold sm:flex ${status.className}`}
                      >
                        <StatusIcon size={12} />
                        {status.text}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setOpenId(isOpen ? null : item.id)
                        }
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.04] hover:text-white"
                        aria-label={
                          isOpen ? 'Hide check details' : 'View check details'
                        }
                      >
                        <ChevronDown
                          size={17}
                          className={`transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-red-500/10 hover:text-red-400"
                        aria-label="Delete this check"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* MOBILE STATUS */}
                    <div className="px-4 pb-3 sm:hidden">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ${status.className}`}
                      >
                        <StatusIcon size={12} />
                        {status.text}
                      </span>
                    </div>

                    {/* DETAILS */}
                    {isOpen && (
                      <div className="border-t border-white/[0.06] px-4 pb-5 pt-4 sm:px-5">
                        <div className="grid gap-3 sm:grid-cols-3">
                          <DetailCard
                            icon={<BarChart3 size={16} />}
                            label="Risk score"
                            value={`${result.risk_score ?? 0}/100`}
                          />

                          <DetailCard
                            icon={<ScanSearch size={16} />}
                            label="Analysis"
                            value={
                              result.api_mode
                                ? String(result.api_mode)
                                : 'Safety engine'
                            }
                          />

                          <DetailCard
                            icon={<ExternalLink size={16} />}
                            label="Category"
                            value={
                              result.scam_category && !result.scam_category.toLowerCase().includes('benign')
                                ? result.scam_category
                                : getScanTypeLabel(item.inputType)
                            }
                          />
                        </div>

                        {result.summary && (
                          <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/10 p-4">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Summary
                            </div>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                              {result.summary}
                            </p>
                          </div>
                        )}

                        {result.red_flags?.length > 0 && (
                          <div className="mt-3 rounded-xl border border-amber-400/10 bg-amber-400/[0.025] p-4">
                            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                              <AlertTriangle size={15} />
                              Red flags
                            </div>

                            <ul className="mt-3 space-y-2">
                              {result.red_flags.map((flag) => (
                                <li
                                  key={flag}
                                  className="flex gap-2 text-sm leading-5 text-slate-400"
                                >
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                                  <span>{flag}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          {result.scam_fingerprint?.primary_tactic && (
                            <div className="rounded-xl border border-white/[0.06] bg-black/10 p-4">
                              <div className="text-xs font-semibold text-slate-600">
                                Primary tactic
                              </div>
                              <div className="mt-1 text-sm font-semibold text-white">
                                {result.scam_fingerprint.primary_tactic}
                              </div>
                            </div>
                          )}

                          {result.variant_detection?.scam_family && (
                            <div className="rounded-xl border border-white/[0.06] bg-black/10 p-4">
                              <div className="text-xs font-semibold text-slate-600">
                                Scam family
                              </div>
                              <div className="mt-1 text-sm font-semibold text-white">
                                {result.variant_detection.scam_family}
                              </div>
                            </div>
                          )}

                          {result.variant_detection?.match_type && result.variant_detection.match_type !== 'none' && (
                            <div className="rounded-xl border border-white/[0.06] bg-black/10 p-4">
                              <div className="text-xs font-semibold text-slate-600">
                                Detected variant
                              </div>
                              <div className="mt-1 text-sm font-semibold text-white">
                                {result.variant_detection.match_type}
                              </div>
                            </div>
                          )}

                          {result.detected_urls?.length > 0 && (
                            <div className="rounded-xl border border-white/[0.06] bg-black/10 p-4">
                              <div className="text-xs font-semibold text-slate-600">
                                Detected URL
                              </div>
                              <div className="mt-1 break-all text-sm text-slate-400">
                                {result.detected_urls[0]}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="text-xs text-slate-600">
                            Saved locally on this device.
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-400/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-400/10"
                          >
                            <Trash2 size={14} />
                            Delete this check
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/10 p-4">
      <div className="flex items-center gap-2 text-slate-600">
        {icon}
        <span className="text-xs font-semibold">{label}</span>
      </div>

      <div className="mt-2 truncate text-sm font-semibold text-white">
        {value}
      </div>
    </div>
  );
}
