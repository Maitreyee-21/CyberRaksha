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
  ShieldAlert,
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
  history?: ScanHistoryItem[];
  currentId?: string | null;
  onSelectScan?: (item: ScanHistoryItem) => void;
  onNewScan?: () => void;
  onDeleteScan?: (id: string, e: React.MouseEvent) => void;
  onClearHistory?: () => void;
}

export function Sidebar({
  mobileOpen,
  onCloseMobile,
  collapsed,
  onToggleCollapse,
  history: propHistory,
  onSelectScan,
  onNewScan,
  onDeleteScan,
  onClearHistory,
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

  const historyItems = propHistory ?? history;

  const [safetyLockEnabled, setSafetyLockEnabled] =
    useState(true);

  useEffect(() => {
    setHistory(
      loadScanHistory()
    );

    const updateFromStorage = () => {
      try {
        const savedLock =
          window.localStorage.getItem(
            'cyberraksha-safety-lock'
          );

        if (savedLock !== null) {
          setSafetyLockEnabled(
            savedLock === 'true'
          );
        } else {
          setSafetyLockEnabled(true);
        }
      } catch {
        // Keep default
      }
    };

    updateFromStorage();

    const handleLockChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled?: boolean }>;
      if (typeof customEvent.detail?.enabled === 'boolean') {
        setSafetyLockEnabled(customEvent.detail.enabled);
      } else {
        updateFromStorage();
      }
    };

    window.addEventListener('cyberraksha-safety-lock-changed', handleLockChanged);
    window.addEventListener('storage', updateFromStorage);

    return () => {
      window.removeEventListener('cyberraksha-safety-lock-changed', handleLockChanged);
      window.removeEventListener('storage', updateFromStorage);
    };
  }, [pathname]);

  const handleToggleSafetyLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !safetyLockEnabled;
    setSafetyLockEnabled(next);
    try {
      window.localStorage.setItem('cyberraksha-safety-lock', String(next));
      window.dispatchEvent(
        new CustomEvent('cyberraksha-safety-lock-changed', {
          detail: { enabled: next },
        })
      );
    } catch {
      // ignore
    }
  };

  const navigate = (
    path: string
  ) => {
    router.push(path);
    onCloseMobile();
  };

  const navigation = [
    {
      label: navigationText.home,
      path: '/scan',
      icon: Home,
    },
    {
      label: navigationText.history,
      path: '/history',
      icon: History,
    },
    {
      label: language === 'en' ? 'Safety Log' : navigationText.safetyLock,
      path: '/safety-lock',
      icon: ShieldCheck,
    },
    {
      label: navigationText.safetyTips,
      path: '/safety-tips',
      icon: Lightbulb,
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
    if (path === '/scan') {
      return pathname === '/scan' || pathname === '/';
    }

    return pathname.startsWith(path);
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
            flex h-[76px] shrink-0
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
              navigate('/scan')
            }
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00E6D0]/10">
              <ShieldCheck
                size={26}
                strokeWidth={1.8}
                className="text-[#00E6D0]"
              />
            </div>

            {!collapsed && (
              <div className="text-left">
                <div className="text-[20px] font-extrabold tracking-tight">
                  Cyber
                  <span className="text-[#00E6D0]">
                    Raksha
                  </span>
                </div>

                <div className="text-[10px] text-slate-500">
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

        {/* NEW CHECK BUTTON */}
        <div
          className={
            collapsed
              ? 'px-3 pt-3'
              : 'px-5 pt-3'
          }
        >
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('cyberraksha-new-scan'));
              }
              if (onNewScan) {
                onNewScan();
              }
              navigate('/scan');
            }}
            title={
              collapsed
                ? "New Check"
                : undefined
            }
            className={`
              flex h-10 w-full
              items-center rounded-xl
              bg-[#00E6D0]/10
              text-[#00E6D0]
              transition
              hover:bg-[#00E6D0]/15
              ${
                collapsed
                  ? 'justify-center'
                  : 'gap-3 px-3.5'
              }
            `}
          >
            <Plus size={18} />

            {!collapsed && (
              <span className="text-xs font-bold">
                New Check
              </span>
            )}
          </button>
        </div>

        {/* COLLAPSE TOGGLE - Cleanly positioned ABOVE the Home navigation item */}
        <div
          className={
            collapsed
              ? 'mt-2.5 px-3'
              : 'mt-2.5 px-5'
          }
        >
          <button
            type="button"
            onClick={onToggleCollapse}
            title={
              collapsed
                ? 'Expand sidebar'
                : 'Collapse sidebar'
            }
            className={`
              flex h-9 w-full
              items-center rounded-xl
              text-slate-500
              transition
              hover:bg-white/[0.04]
              hover:text-slate-200
              ${
                collapsed
                  ? 'justify-center'
                  : 'gap-3 px-3.5'
              }
            `}
          >
            {collapsed ? (
              <PanelLeftOpen
                size={17}
              />
            ) : (
              <>
                <PanelLeftClose
                  size={17}
                />

                <span className="text-xs font-medium">
                  Collapse
                </span>
              </>
            )}
          </button>
        </div>

        {/* NAVIGATION (Home, History, Safety Log, Safety Tips, Settings) */}
        <nav
          className={`
            mt-2 flex-1
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
                    relative mb-1
                    flex h-10 w-full
                    items-center
                    rounded-xl
                    transition-all

                    ${
                      collapsed
                        ? 'justify-center'
                        : 'gap-3.5 px-3.5'
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
                    size={19}
                    strokeWidth={
                      isCurrent
                        ? 2.3
                        : 1.8
                    }
                  />

                  {!collapsed && (
                    <span className="text-[13px] font-medium">
                      {item.label}
                    </span>
                  )}

                </button>
              );
            }
          )}

        </nav>

        {/* PROTECTED FOOTER */}
        <div
          className={
            collapsed
              ? 'p-2.5 shrink-0'
              : 'p-4 shrink-0'
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
                ? (safetyLockEnabled ? 'Protection ON (Active)' : 'Protection OFF (Paused)')
                : undefined
            }
            className={`
              w-full rounded-xl transition-all duration-200
              ${
                safetyLockEnabled
                  ? 'border border-[#00E6D0]/20 bg-[#00E6D0]/[0.05] hover:bg-[#00E6D0]/[0.08]'
                  : 'border border-amber-500/20 bg-amber-500/[0.04] hover:bg-amber-500/[0.08]'
              }
              ${
                collapsed
                  ? 'flex h-10 items-center justify-center'
                  : 'p-2.5'
              }
            `}
          >

            {collapsed ? (
              safetyLockEnabled ? (
                <ShieldCheck
                  size={21}
                  className="text-[#00E6D0]"
                />
              ) : (
                <ShieldAlert
                  size={21}
                  className="text-amber-400"
                />
              )
            ) : (
              <div className="flex items-center gap-3">

                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                    safetyLockEnabled
                      ? 'bg-[#00E6D0]/10 text-[#00E6D0]'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}
                >
                  {safetyLockEnabled ? (
                    <ShieldCheck
                      size={18}
                      className="text-[#00E6D0]"
                    />
                  ) : (
                    <ShieldAlert
                      size={18}
                      className="text-amber-400"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1 text-left">

                  <div
                    className={`text-xs font-bold transition-colors ${
                      safetyLockEnabled ? 'text-zinc-100' : 'text-amber-300'
                    }`}
                  >
                    {safetyLockEnabled ? 'Protected (ON)' : 'Protection OFF'}
                  </div>

                  <div className="mt-0.5 text-[9px] text-slate-500">
                    {safetyLockEnabled
                      ? 'Protection Active'
                      : 'Protection Paused'}
                  </div>

                </div>

                <span
                  onClick={handleToggleSafetyLock}
                  title={safetyLockEnabled ? 'Click to pause protection' : 'Click to activate protection'}
                  className={`cursor-pointer rounded-full px-2 py-0.5 text-[8px] font-bold transition-all hover:scale-105 active:scale-95 ${
                    safetyLockEnabled
                      ? 'bg-[#00D394] text-black shadow-[0_0_8px_rgba(0,211,148,0.4)]'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
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