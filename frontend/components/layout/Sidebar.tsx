'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  usePathname,
  useRouter,
} from 'next/navigation';

import {
  Home,
  History,
  ShieldCheck,
  Lightbulb,
  Flag,
  Settings,
  Plus,
  X,
  Trash2,
  MessageSquare,
  Link2,
  QrCode,
  Image as ImageIcon,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

import {
  loadScanHistory,
  deleteScanHistoryItem,
  clearAllScanHistory,
} from '@/lib/history';

import type {
  ScanHistoryItem,
} from '@/lib/types';

import {
  useLanguage,
} from '@/components/providers/LanguageProvider';

import {
  translations,
} from '@/lib/translations';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  mobileOpen,
  onCloseMobile,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const {
    language,
  } = useLanguage();

  const t =
    translations[language] ?? translations.en;

  // Current translations are grouped as `nav` and `home`.
  // Keeping these aliases here prevents objects from being rendered as React children.
  const navigationText = t.nav;
  const homeText = t.home;

  const [history, setHistory] =
    useState<ScanHistoryItem[]>(
      []
    );

  const [safetyLockEnabled, setSafetyLockEnabled] =
    useState(true);

  useEffect(() => {
    setHistory(
      loadScanHistory()
    );

    try {
      const savedLock =
        window.localStorage.getItem(
          'cyberraksha-safety-lock'
        );

      if (savedLock !== null) {
        setSafetyLockEnabled(
          savedLock === 'true'
        );
      }
    } catch {
      // Keep the default protected state if browser storage is unavailable.
    }
  }, [pathname]);

  const navigate = (
    path: string
  ) => {
    router.push(path);
    onCloseMobile();
  };

  const navigation = [
    {
      label: navigationText.home,
      path: '/',
      icon: Home,
    },
    {
      label: navigationText.history,
      path: '/history',
      icon: History,
    },
    {
      label: navigationText.safetyLock,
      path: '/safety-lock',
      icon: ShieldCheck,
    },
    {
      label: navigationText.safetyTips,
      path: '/safety-tips',
      icon: Lightbulb,
    },
    {
      label: navigationText.reportScam,
      path: '/report',
      icon: Flag,
    },
    {
      label: navigationText.settings,
      path: '/settings',
      icon: Settings,
    },
  ];

  const active = (
    path: string
  ) => {
    if (path === '/') {
      return pathname === '/';
    }

    return pathname.startsWith(path);
  };

  const historyIcon = (
    type: string
  ) => {
    switch (type) {
      case 'url':
        return (
          <Link2 size={14} />
        );

      case 'qr':
        return (
          <QrCode size={14} />
        );

      case 'image':
        return (
          <ImageIcon size={14} />
        );

      default:
        return (
          <MessageSquare
            size={14}
          />
        );
    }
  };

  const riskColor = (
    risk: string
  ) => {
    switch (
      String(risk).toUpperCase()
    ) {
      case 'HIGH':
        return 'bg-red-400';

      case 'MEDIUM':
        return 'bg-amber-400';

      default:
        return 'bg-emerald-400';
    }
  };

  const removeHistory = (
    id: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    const updated =
      deleteScanHistoryItem(id);

    setHistory(updated);
  };

  const clearHistory = () => {
    clearAllScanHistory();
    setHistory([]);
  };

  return (
    <>
      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-[70]
          flex h-screen flex-col
          border-r border-white/[0.06]
          bg-[#090E13]
          shadow-2xl
          transition-all duration-300

          ${
            mobileOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }

          lg:translate-x-0

          ${
            collapsed
              ? 'lg:w-[82px]'
              : 'w-[290px] lg:w-[290px]'
          }
        `}
      >

        {/* BRAND */}
        <div
          className={`
            flex h-[92px] shrink-0
            items-center
            border-b border-white/[0.06]

            ${
              collapsed
                ? 'justify-center px-3'
                : 'px-5'
            }
          `}
        >

          <button
            type="button"
            onClick={() =>
              navigate('/')
            }
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00E6D0]/10">
              <ShieldCheck
                size={30}
                strokeWidth={1.8}
                className="text-[#00E6D0]"
              />
            </div>

            {!collapsed && (
              <div className="text-left">
                <div className="text-[22px] font-extrabold tracking-tight">
                  Cyber
                  <span className="text-[#00E6D0]">
                    Raksha
                  </span>
                </div>

                <div className="text-[10px] text-slate-600">
                  Be Aware. Be Safer.
                </div>
              </div>
            )}

          </button>

          <button
            type="button"
            onClick={onCloseMobile}
            className="ml-auto text-slate-500 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={21} />
          </button>

        </div>

        {/* NEW CHECK */}
        <div
          className={
            collapsed
              ? 'px-3 pt-4'
              : 'px-5 pt-4'
          }
        >
          <button
            type="button"
            onClick={() =>
              navigate('/scan')
            }
            title={
              collapsed
                ? "New Check"
                : undefined
            }
            className={`
              flex h-11 w-full
              items-center rounded-xl
              bg-[#00E6D0]/10
              text-[#00E6D0]
              transition
              hover:bg-[#00E6D0]/15
              ${
                collapsed
                  ? 'justify-center'
                  : 'gap-3 px-4'
              }
            `}
          >
            <Plus size={19} />

            {!collapsed && (
              <span className="font-bold">
                New Check
              </span>
            )}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav
          className={`
            mt-4
            ${
              collapsed
                ? 'px-3'
                : 'px-5'
            }
          `}
        >

          {navigation.map(
            (item) => {
              const Icon =
                item.icon;

              const isCurrent =
                active(
                  item.path
                );

              return (
                <button
                  key={
                    item.path
                  }
                  type="button"
                  onClick={() =>
                    navigate(
                      item.path
                    )
                  }
                  title={
                    collapsed
                      ? item.label
                      : undefined
                  }
                  className={`
                    relative mb-1.5
                    flex h-11 w-full
                    items-center
                    rounded-xl
                    transition-all

                    ${
                      collapsed
                        ? 'justify-center'
                        : 'gap-4 px-4'
                    }

                    ${
                      isCurrent
                        ? 'bg-[#00CDBB]/15 text-[#00E6D0]'
                        : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                    }
                  `}
                >

                  {isCurrent && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#00E6D0]" />
                  )}

                  <Icon
                    size={21}
                    strokeWidth={
                      isCurrent
                        ? 2.4
                        : 1.8
                    }
                  />

                  {!collapsed && (
                    <span className="text-[14px] font-medium">
                      {item.label}
                    </span>
                  )}

                </button>
              );
            }
          )}

        </nav>

        {/* COLLAPSE BUTTON */}
        <div
          className={
            collapsed
              ? 'mt-2 px-3'
              : 'mt-2 px-5'
          }
        >
          <button
            type="button"
            onClick={
              onToggleCollapse
            }
            title={
              collapsed
                ? 'Expand sidebar'
                : 'Collapse sidebar'
            }
            className={`
              flex h-10 w-full
              items-center rounded-xl
              text-slate-600
              transition
              hover:bg-white/[0.04]
              hover:text-slate-300

              ${
                collapsed
                  ? 'justify-center'
                  : 'gap-3 px-4'
              }
            `}
          >
            {collapsed ? (
              <PanelLeftOpen
                size={18}
              />
            ) : (
              <>
                <PanelLeftClose
                  size={18}
                />

                <span className="text-xs">
                  Collapse
                </span>
              </>
            )}
          </button>
        </div>

        {/* RECENT CHECKS */}
        {!collapsed && (
          <div className="mt-4 flex min-h-0 flex-1 flex-col px-5">

            <div className="flex items-center justify-between">

              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                Recent Checks
              </span>

              {history.length >
                0 && (
                <button
                  type="button"
                  onClick={
                    clearHistory
                  }
                  className="text-[10px] text-slate-600 hover:text-red-400"
                >
                  Clear
                </button>
              )}

            </div>

            <div className="custom-scrollbar mt-2 flex-1 overflow-y-auto">

              {history.length ===
              0 ? (
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 text-center text-[11px] leading-5 text-slate-600">
                  No recent checks.
                  <br />
                  Start a new check.
                </div>
              ) : (
                <div className="space-y-1">

                  {history
                    .slice(0, 5)
                    .map(
                      (item) => (
                        <div
                          key={item.id}
                          className="group flex w-full items-center gap-2 rounded-lg p-1.5 text-left hover:bg-white/[0.035]"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/history?id=${item.id}`
                              )
                            }
                            className="flex min-w-0 flex-1 items-center gap-2 rounded-lg p-1.5 text-left"
                            title="Open this check"
                          >

                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${riskColor(
                              item
                                .result
                                .risk_level
                            )}`}
                          />

                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#121A21] text-slate-500">
                            {historyIcon(
                              item.inputType
                            )}
                          </span>

                          <span className="min-w-0 flex-1">

                            <span className="block truncate text-[10px] font-semibold text-slate-400">
                              {
                                item
                                  .result
                                  .scam_category
                              }
                            </span>

                            <span className="block truncate text-[9px] text-slate-600">
                              {
                                item.snippet
                              }
                            </span>

                          </span>

                          </button>

                          <button
                            type="button"
                            onClick={(event) =>
                              removeHistory(item.id, event)
                            }
                            className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-600 hover:bg-red-500/10 hover:text-red-400 group-hover:flex"
                            aria-label="Delete this recent check"
                            title="Delete check"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )
                    )}

                </div>
              )}

            </div>
          </div>
        )}

        {/* PROTECTED */}
        <div
          className={
            collapsed
              ? 'p-3'
              : 'p-5'
          }
        >

          <button
            type="button"
            onClick={() =>
              navigate(
                '/safety-lock'
              )
            }
            title={
              collapsed
                ? navigationText.safetyLock
                : undefined
            }
            className={`
              w-full rounded-xl
              border border-[#00E6D0]/10
              bg-[#00E6D0]/[0.04]

              ${
                collapsed
                  ? 'flex h-11 items-center justify-center'
                  : 'p-3'
              }
            `}
          >

            {collapsed ? (
              <ShieldCheck
                size={21}
                className="text-[#00E6D0]"
              />
            ) : (
              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00E6D0]/10">
                  <ShieldCheck
                    size={18}
                    className="text-[#00E6D0]"
                  />
                </div>

                <div className="min-w-0 flex-1 text-left">

                  <div className="text-xs font-bold">
                    Protected
                  </div>

                  <div className="mt-0.5 text-[9px] text-slate-500">
                    {safetyLockEnabled
                      ? "Protection Active"
                      : 'Protection paused'}
                  </div>

                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${
                    safetyLockEnabled
                      ? 'bg-[#00D394] text-black'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {safetyLockEnabled ? 'ON' : 'OFF'}
                </span>

              </div>
            )}

          </button>

        </div>

      </aside>
    </>
  );
}