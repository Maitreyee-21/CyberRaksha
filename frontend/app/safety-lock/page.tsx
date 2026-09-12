'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  ShieldCheck,
  LockKeyhole,
  Link2,
  ArrowRight,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Info,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  History,
} from 'lucide-react';

import AppShell from '@/components/layout/AppShell';
import { runUrlScan } from '@/lib/api';
import type { ScanResult } from '@/lib/types';

type BlockedLink = {
  id: string;
  url: string;
  risk: string;
  score: number;
  category?: string;
  createdAt: string;
};

const BLOCKED_LINKS_KEY = 'cyberraksha-blocked-links';

export default function SafetyLockPage() {
  const [enabled, setEnabled] = useState(true);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [blockedLinks, setBlockedLinks] = useState<BlockedLink[]>([]);
  const [showBlocked, setShowBlocked] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BLOCKED_LINKS_KEY);

      if (saved) {
        setBlockedLinks(JSON.parse(saved) as BlockedLink[]);
      }

      const savedLock = localStorage.getItem('cyberraksha-safety-lock');

      if (savedLock !== null) {
        setEnabled(savedLock === 'true');
      }
    } catch {
      // Ignore invalid local browser data.
    }

    const handleLockChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled?: boolean }>;
      if (typeof customEvent.detail?.enabled === 'boolean') {
        setEnabled(customEvent.detail.enabled);
      }
    };

    window.addEventListener('cyberraksha-safety-lock-changed', handleLockChanged);
    return () => {
      window.removeEventListener('cyberraksha-safety-lock-changed', handleLockChanged);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        'cyberraksha-safety-lock',
        String(enabled)
      );
      window.dispatchEvent(
        new CustomEvent('cyberraksha-safety-lock-changed', {
          detail: { enabled },
        })
      );
    } catch {
      // Ignore storage errors.
    }
  }, [enabled]);

  const risk = String(
    result?.risk_level || ''
  ).toUpperCase();

  const riskLabel =
    risk === 'HIGH'
      ? 'Not Safe'
      : risk === 'MEDIUM'
      ? 'Be Careful'
      : 'Looks Safe';

  const riskStyles =
    risk === 'HIGH'
      ? {
          border: 'border-red-500/20',
          background: 'bg-red-500/10',
          text: 'text-red-300',
          icon: 'text-red-400',
        }
      : risk === 'MEDIUM'
      ? {
          border: 'border-amber-500/20',
          background: 'bg-amber-500/10',
          text: 'text-amber-300',
          icon: 'text-amber-400',
        }
      : {
          border: 'border-emerald-500/20',
          background: 'bg-emerald-500/10',
          text: 'text-emerald-300',
          icon: 'text-emerald-400',
        };

  const normalizedUrl = useMemo(() => url.trim(), [url]);

  const isValidUrl = (value: string) => {
    try {
      const parsed = new URL(value);

      return (
        parsed.protocol === 'http:' ||
        parsed.protocol === 'https:'
      );
    } catch {
      return false;
    }
  };

  const saveBlockedLink = (response: ScanResult, checkedUrl: string) => {
    const level = String(
      response.risk_level || ''
    ).toUpperCase();

    if (level !== 'HIGH') return;

    const entry: BlockedLink = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      url: checkedUrl,
      risk: level,
      score: Number(response.risk_score ?? 0),
      category: response.scam_category,
      createdAt: new Date().toISOString(),
    };

    setBlockedLinks((current) => {
      const next = [
        entry,
        ...current.filter(
          (item) => item.url !== checkedUrl
        ),
      ].slice(0, 50);

      try {
        localStorage.setItem(
          BLOCKED_LINKS_KEY,
          JSON.stringify(next)
        );
      } catch {
        // Keep the in-memory list even if storage is unavailable.
      }

      return next;
    });
  };

  const check = async () => {
    const value = normalizedUrl;

    setError('');
    setResult(null);
    setCopied(false);

    if (!value) {
      setError('Paste a link before checking it.');
      return;
    }

    if (!isValidUrl(value)) {
      setError(
        'Enter a complete HTTP or HTTPS URL, for example https://example.com'
      );
      return;
    }

    setLoading(true);

    try {
      const response = await runUrlScan(value);

      setResult(response);
      saveBlockedLink(response, value);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'The link could not be checked right now.';

      setError(
        message.length > 180
          ? 'The safety check could not be completed. Please try again.'
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError('');
  };

  const copyCheckedUrl = async () => {
    if (!normalizedUrl) return;

    try {
      await navigator.clipboard.writeText(normalizedUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      setCopied(false);
    }
  };

  const removeBlockedLink = (id: string) => {
    setBlockedLinks((current) => {
      const next = current.filter(
        (item) => item.id !== id
      );

      try {
        localStorage.setItem(
          BLOCKED_LINKS_KEY,
          JSON.stringify(next)
        );
      } catch {
        // Ignore storage errors.
      }

      return next;
    });
  };

  const clearBlockedLinks = () => {
    if (blockedLinks.length === 0) return;

    if (
      !window.confirm(
        'Clear all locally saved blocked links?'
      )
    ) {
      return;
    }

    setBlockedLinks([]);

    try {
      localStorage.removeItem(BLOCKED_LINKS_KEY);
    } catch {
      // Ignore storage errors.
    }
  };

  const openOfficialCybercrimePortal = () => {
    window.open(
      'https://cybercrime.gov.in/',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <AppShell>
      <section className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
        <div className="mx-auto max-w-[850px]">
          {/* HERO */}
          <div className="text-center">
            <div
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full transition ${
                enabled
                  ? 'bg-[#00E6D0]/10'
                  : 'bg-slate-500/10'
              }`}
            >
              <ShieldCheck
                size={44}
                className={
                  enabled
                    ? 'text-[#00E6D0]'
                    : 'text-slate-500'
                }
              />
            </div>

            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
              Safety Lock
            </h1>

            <p
              className={`mt-1.5 font-semibold ${
                enabled
                  ? 'text-[#00E6D0]'
                  : 'text-slate-500'
              }`}
            >
              Protection is {enabled ? 'ON' : 'OFF'}
            </p>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Check suspicious links before opening them.
              CyberRaksha analyzes the link first and warns
              you when a high-risk threat is detected.
            </p>
          </div>

          {/* PROTECTION SWITCH */}
          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#10161C] p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00E6D0]/10">
              <LockKeyhole
                size={21}
                className="text-[#00E6D0]"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="font-semibold">
                Protection
              </div>

              <div className="mt-1 text-xs leading-5 text-slate-600">
                {enabled
                  ? 'Safety Lock is ready to check suspicious links.'
                  : 'Protection is paused. Turn it on before checking a link.'}
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              aria-label="Toggle Safety Lock protection"
              onClick={() => {
                setEnabled((value) => !value);
                setResult(null);
                setError('');
              }}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                enabled
                  ? 'bg-[#00D394]'
                  : 'bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                  enabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {enabled && (
            <>
              {/* LINK CHECKER */}
              <div className="mt-4 rounded-2xl border border-white/[0.07] bg-[#10161C] p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00E6D0]/10">
                    <Link2
                      size={20}
                      className="text-[#00E6D0]"
                    />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Check a link
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-600">
                      Paste it here instead of opening it first.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !loading) {
                        void check();
                      }
                    }}
                    placeholder="https://example.com"
                    inputMode="url"
                    autoComplete="off"
                    className="h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0B1116] px-4 text-sm outline-none placeholder:text-slate-600 focus:border-[#00E6D0]/40"
                  />

                  <button
                    type="button"
                    onClick={() => void check()}
                    disabled={loading}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#00E6D0] px-6 font-bold text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                        Checking...
                      </>
                    ) : (
                      <>
                        Check
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/15 bg-red-500/[0.05] p-4">
                    <AlertTriangle
                      size={18}
                      className="mt-0.5 shrink-0 text-red-400"
                    />

                    <div className="min-w-0 text-sm leading-5 text-red-300">
                      {error}
                    </div>
                  </div>
                )}

                {/* RESULT */}
                {result && (
                  <div
                    className={`mt-5 overflow-hidden rounded-2xl border ${riskStyles.border} ${riskStyles.background}`}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-3">
                        {risk === 'HIGH' ? (
                          <XCircle
                            size={25}
                            className={`mt-0.5 shrink-0 ${riskStyles.icon}`}
                          />
                        ) : risk === 'MEDIUM' ? (
                          <AlertTriangle
                            size={25}
                            className={`mt-0.5 shrink-0 ${riskStyles.icon}`}
                          />
                        ) : (
                          <CheckCircle2
                            size={25}
                            className={`mt-0.5 shrink-0 ${riskStyles.icon}`}
                          />
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              className={`font-bold ${riskStyles.text}`}
                            >
                              {risk === 'HIGH'
                                ? 'Dangerous link detected'
                                : risk === 'MEDIUM'
                                ? 'Be careful with this link'
                                : 'No high-risk threat detected'}
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${riskStyles.text} bg-black/10`}
                            >
                              {riskLabel}
                            </span>
                          </div>

                          <div className="mt-2 break-all text-xs text-slate-500">
                            {normalizedUrl}
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                            <span>
                              Risk score:{' '}
                              <strong className="text-slate-300">
                                {result.risk_score ?? 0}/100
                              </strong>
                            </span>

                            {result.scam_category && (
                              <span className="rounded-full bg-black/10 px-2 py-1">
                                {result.scam_category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* HIGH RISK ACTION */}
                      {risk === 'HIGH' && (
                        <div className="mt-5 rounded-xl border border-red-500/15 bg-red-950/20 p-4">
                          <div className="flex gap-3">
                            <ShieldAlert
                              size={19}
                              className="mt-0.5 shrink-0 text-red-400"
                            />

                            <div>
                              <div className="text-sm font-semibold text-red-300">
                                Safety Lock recommendation
                              </div>

                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                Do not open, log in, enter payment
                                details, download files, or share
                                OTPs on this link.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SUMMARY */}
                      {result.summary && (
                        <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/10 p-4">
                          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                            Why this result?
                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {result.summary}
                          </p>
                        </div>
                      )}

                      {/* RED FLAGS */}
                      {result.red_flags?.length > 0 && (
                        <div className="mt-3 rounded-xl border border-amber-400/10 bg-amber-400/[0.025] p-4">
                          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                            <AlertTriangle size={15} />
                            Red flags
                          </div>

                          <ul className="mt-3 space-y-2">
                            {result.red_flags.slice(0, 5).map((flag) => (
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

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void copyCheckedUrl()}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.04]"
                        >
                          {copied ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                          {copied ? 'Copied' : 'Copy link'}
                        </button>

                        <button
                          type="button"
                          onClick={clearResult}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                        >
                          Check another
                        </button>

                        {risk === 'HIGH' && (
                          <button
                            type="button"
                            onClick={openOfficialCybercrimePortal}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-400/15 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/10"
                          >
                            Report scam
                            <ExternalLink size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BLOCKED LINKS */}
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#10161C]">
                <button
                  type="button"
                  onClick={() => setShowBlocked((value) => !value)}
                  className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-white/[0.02]"
                  aria-expanded={showBlocked}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
                    <Link2 size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">
                      Blocked Links
                    </div>

                    <div className="mt-1 text-xs text-slate-600">
                      {blockedLinks.length === 0
                        ? 'No high-risk links saved yet.'
                        : `${blockedLinks.length} high-risk link${
                            blockedLinks.length === 1 ? '' : 's'
                          } saved on this device.`}
                    </div>
                  </div>

                  <ArrowRight
                    size={17}
                    className={`shrink-0 text-slate-600 transition-transform ${
                      showBlocked ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {showBlocked && (
                  <div className="border-t border-white/[0.06]">
                    {blockedLinks.length === 0 ? (
                      <div className="p-6 text-center">
                        <History
                          size={25}
                          className="mx-auto text-slate-700"
                        />

                        <p className="mt-2 text-sm text-slate-500">
                          High-risk links you check will appear here.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="divide-y divide-white/[0.05]">
                          {blockedLinks.map((item) => (
                            <div
                              key={item.id}
                              className="flex gap-3 p-4"
                            >
                              <div className="mt-0.5 shrink-0 text-red-400">
                                <ShieldAlert size={18} />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="break-all text-xs font-medium text-slate-300">
                                  {item.url}
                                </div>

                                <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-slate-600">
                                  <span>
                                    Risk {item.score}/100
                                  </span>

                                  {item.category && (
                                    <span>
                                      {item.category}
                                    </span>
                                  )}

                                  <span>
                                    {new Date(
                                      item.createdAt
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeBlockedLink(item.id)
                                }
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-red-500/10 hover:text-red-400"
                                aria-label="Remove blocked link"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-white/[0.06] p-4">
                          <button
                            type="button"
                            onClick={clearBlockedLinks}
                            className="inline-flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} />
                            Clear blocked links
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* HOW IT WORKS */}
              <button
                type="button"
                onClick={() =>
                  setShowHowItWorks((value) => !value)
                }
                className="mt-3 flex w-full items-center gap-4 rounded-xl border border-white/[0.07] bg-[#10161C] p-4 text-left transition hover:border-white/15"
                aria-expanded={showHowItWorks}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-400">
                  <Info size={16} />
                </span>

                <span className="flex-1 text-sm font-semibold">
                  How it works
                </span>

                <ArrowRight
                  size={17}
                  className={`text-slate-600 transition-transform ${
                    showHowItWorks ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {showHowItWorks && (
                <div className="mt-2 rounded-xl border border-white/[0.07] bg-[#10161C] p-5">
                  <div className="grid gap-3 sm:grid-cols-4">
                    <HowStep
                      number="1"
                      title="Paste"
                      text="Paste a suspicious URL without opening it."
                    />

                    <HowStep
                      number="2"
                      title="Analyze"
                      text="CyberRaksha sends the URL through its safety analysis pipeline."
                    />

                    <HowStep
                      number="3"
                      title="Understand"
                      text="Review the risk level, score, category and warning signs."
                    />

                    <HowStep
                      number="4"
                      title="Act"
                      text="Avoid high-risk links and use official reporting channels when needed."
                    />
                  </div>

                  <div className="mt-4 flex gap-3 rounded-xl border border-[#00E6D0]/10 bg-[#00E6D0]/[0.04] p-4">
                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-[#00E6D0]"
                    />

                    <p className="text-xs leading-5 text-slate-500">
                      Safety Lock does not disable your device internet
                      connection or automatically open suspicious URLs.
                      It is designed to help you check first and act safely.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* OFF STATE */}
          {!enabled && (
            <div className="mt-5 rounded-2xl border border-white/[0.07] bg-[#10161C] p-6 text-center">
              <LockKeyhole
                size={30}
                className="mx-auto text-slate-600"
              />

              <h2 className="mt-3 font-semibold">
                Safety Lock is paused
              </h2>

              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-600">
                Turn protection back on whenever you want to check a
                suspicious link before opening it.
              </p>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}

function HowStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/10 p-4">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00E6D0]/10 text-xs font-bold text-[#00E6D0]">
        {number}
      </div>

      <div className="mt-3 text-sm font-semibold text-white">
        {title}
      </div>

      <p className="mt-1 text-xs leading-5 text-slate-600">
        {text}
      </p>
    </div>
  );
}
