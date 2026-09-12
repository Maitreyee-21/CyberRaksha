'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import {
  ChevronDown,
  FileText,
  Flag,
  Globe,
  History,
  Home,
  Image as ImageIcon,
  Lightbulb,
  Link2,
  LockKeyhole,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  QrCode,
  Search,
  Settings,
  ShieldCheck,
  User,
  UserCircle,
  X,
} from 'lucide-react';

import {
  runImageScan,
  runTextScan,
  runUrlScan,
  runDocumentScan,
} from '@/lib/api';

import { saveScanHistoryItem } from '@/lib/history';

import type { ScanResult } from '@/lib/types';

import {
  LANGUAGES,
  type LanguageCode,
} from '@/lib/languages';

import { translations } from '@/lib/translations';

import {
  useLanguage,
} from '@/components/providers/LanguageProvider';

import ResultsPanel from '@/components/analysis/ResultsPanel';
import { LandingPage } from '@/components/home/LandingPage';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { RegisterScreen } from '@/components/auth/RegisterScreen';
import { ProfileModal } from '@/components/layout/ProfileModal';

type InputType =
  | 'text'
  | 'url'
  | 'qr'
  | 'image'
  | 'document';

type ViewType = 'home' | 'login' | 'register' | 'scan';

interface Identity {
  name: string;
  guest: boolean;
}

export default function HomePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resultContainerRef = useRef<HTMLDivElement | null>(null);

  // VIEW & AUTH STATE
  // Always start with 'home' view - landing page first
  const [view, setView] = useState<ViewType>('home');
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [registeredCreds, setRegisteredCreds] = useState<{
    identifier?: string;
    password?: string;
    successMessage?: string;
  } | null>(null);

  // Restore authenticated session on mount if available
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data?.user) {
          setIdentity({
            name: data.user.fullName || data.user.username || data.user.email,
            guest: false,
          });
        }
      })
      .catch(() => {
        // Not authenticated
      });
  }, []);

  const {
    language,
    setLanguage,
    currentLanguage,
  } = useLanguage();

  const currentTranslation =
    translations[language] ?? translations.en;

  const homeText =
    currentTranslation.home;

  const navigationText =
    currentTranslation.nav;

  const brandText =
    currentTranslation.brand;

  // SCAN STATE
  const [selectedType, setSelectedType] =
    useState<InputType>('text');

  const [text, setText] =
    useState('');

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [result, setResult] =
    useState<ScanResult | null>(null);

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [collapsed, setCollapsed] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(true);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [profileMenuOpen, setProfileMenuOpen] =
    useState(false);

  const [
    languageOpen,
    setLanguageOpen,
  ] = useState(false);

  // Auto-scroll to result container when analysis completes
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        resultContainerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [result]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedTheme = window.localStorage.getItem('cyberraksha-theme');
    setDarkMode(savedTheme === null ? true : savedTheme === 'dark');

    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setDarkMode(customEvent.detail !== 'light');
    };

    window.addEventListener('cyberraksha-theme-change', handleThemeChange);
    return () => window.removeEventListener('cyberraksha-theme-change', handleThemeChange);
  }, []);



  /* =====================================================
     HANDLERS
  ===================================================== */

  const handleAuthenticated = (newIdentity: Identity) => {
    setIdentity(newIdentity);
    setView('scan');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Silent error
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('cyberraksha-user');
        localStorage.removeItem('cyberraksha-profile');
        window.dispatchEvent(new CustomEvent('cyberraksha-profile-updated'));
      } catch {
        // ignore
      }
    }
    setProfileMenuOpen(false);
    setIdentity(null);
    setRegisteredCreds(null);
    setView('home');
  };

  const handleRegistrationComplete = (creds?: { identifier?: string; password?: string }) => {
    if (creds?.identifier) {
      setRegisteredCreds({
        identifier: creds.identifier,
        password: creds.password,
        successMessage: 'Account registered successfully! Please log in with your credentials.',
      });
    }
    setView('login');
  };

  const changeLanguage = (
    nextLanguage: LanguageCode
  ) => {
    setLanguage(nextLanguage);
    setLanguageOpen(false);
  };

  /* =====================================================
     HOME INPUT OPTIONS
  ===================================================== */

  const inputOptions = [
    {
      type: 'text' as InputType,
      title: homeText.message,
      subtitle: homeText.messageSubtitle,
      icon: MessageSquare,
    },

    {
      type: 'url' as InputType,
      title: homeText.link,
      subtitle: homeText.linkSubtitle,
      icon: Link2,
    },

    {
      type: 'qr' as InputType,
      title: homeText.qrCode,
      subtitle: homeText.qrSubtitle,
      icon: QrCode,
    },

    {
      type: 'image' as InputType,
      title: homeText.image,
      subtitle: homeText.imageSubtitle,
      icon: ImageIcon,
    },

    {
      type: 'document' as InputType,
      title: homeText.document,
      subtitle: homeText.documentSubtitle,
      icon: FileText,
    },
  ];

  /* =====================================================
     INPUT TYPE SELECTION
  ===================================================== */

  const handleTypeSelect = (
    type: InputType
  ) => {
    setSelectedType(type);
    setError('');
    setResult(null);
    setSelectedFile(null);

    if (type === 'document') {
      if (fileInputRef.current) {
        fileInputRef.current.accept = '.pdf,.doc,.docx,.txt,.rtf,.odt,.csv,.log,text/*,application/pdf';
        fileInputRef.current.click();
      }
      return;
    }

    if (type === 'qr' || type === 'image') {
      if (fileInputRef.current) {
        fileInputRef.current.accept = 'image/*,image/png,image/jpeg,image/webp';
        fileInputRef.current.click();
      }
    }
  };

  /* =====================================================
     FILE INPUT
  ===================================================== */

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setText('');
    setError('');
    setResult(null);

    // Allow selecting same file again later without auto-triggering output
    event.target.value = '';
  };

  /* =====================================================
     SCAN
  ===================================================== */

  const handleScan = async ({
    type,
    file,
  }: {
    type: InputType;
    file?: File;
  }) => {
    const scanFile =
      file ?? selectedFile;

    if (type === 'document' && !scanFile) {
      setError(
        language === 'hi'
          ? 'कृपया जाँच के लिए एक दस्तावेज़ चुनें।'
          : language === 'mr'
            ? 'कृपया तपासण्यासाठी एक दस्तऐवज निवडा.'
            : 'Please choose a document to check.'
      );
      return;
    }

    if (
      (type === 'text' ||
        type === 'url') &&
      !text.trim()
    ) {
      setError(
        type === 'url'
          ? homeText.urlRequired
          : homeText.textRequired
      );

      return;
    }

    if (
      (type === 'qr' ||
        type === 'image') &&
      !scanFile
    ) {
      setError(homeText.imageRequired);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      let response: ScanResult;
      let previewText = '';

      /* TEXT */

      if (type === 'text') {
        previewText =
          text.trim();

        response =
          await runTextScan(
            text.trim()
          );
      }

      /* URL */

      else if (type === 'url') {
        previewText =
          text.trim();

        response =
          await runUrlScan(
            text.trim()
          );
      }

      /* QR */

      else if (type === 'qr') {
        previewText =
          scanFile?.name ||
          'QR Code';

        response =
          await runImageScan(
            scanFile!,
            'qr'
          );
      }

      /* IMAGE */

      else if (type === 'image') {
        previewText =
          scanFile?.name ||
          'Image';

        response =
          await runImageScan(
            scanFile!,
            'image'
          );
      }

      /* DOCUMENT */

      else {
        previewText =
          scanFile?.name ||
          'Document';

        response =
          await runDocumentScan(
            scanFile!
          );
      }

      setResult(response);

      /* SAVE HISTORY */

      saveScanHistoryItem(
        type,
        previewText,
        response
      );
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message
      ) {
        setError(err.message);
      } else {
        setError(
          homeText.scanError
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     CHECK NOW
  ===================================================== */

  const handleSubmit = () => {
    void handleScan({
      type: selectedType,
      file: selectedFile ?? undefined,
    });
  };

  /* =====================================================
     VIEW: HOME/LANDING
  ===================================================== */

  if (view === 'home') {
    return (
      <LandingPage
        onGoToLogin={() => {
          setRegisteredCreds(null);
          setView('login');
        }}
        onRegistered={handleRegistrationComplete}
      />
    );
  }

  /* =====================================================
     VIEW: LOGIN
  ===================================================== */

  if (view === 'login') {
    return (
      <LoginScreen
        onAuthenticated={handleAuthenticated}
        onGoToHome={() => setView('home')}
        onGoToRegister={() => {
          setRegisteredCreds(null);
          setView('register');
        }}
        initialIdentifier={registeredCreds?.identifier}
        initialPassword={registeredCreds?.password}
        successMessage={registeredCreds?.successMessage}
      />
    );
  }

  /* =====================================================
     VIEW: REGISTER
  ===================================================== */

  if (view === 'register') {
    return (
      <RegisterScreen
        onGoToLogin={() => {
          setRegisteredCreds(null);
          setView('login');
        }}
        onGoToHome={() => setView('home')}
        onRegistered={handleRegistrationComplete}
      />
    );
  }

  /* =====================================================
     VIEW: SCAN (PROTECTED)
  ===================================================== */

  if (!identity) {
    return (
      <LoginScreen
        onAuthenticated={handleAuthenticated}
        onGoToHome={() => setView('home')}
        onGoToRegister={() => {
          setRegisteredCreds(null);
          setView('register');
        }}
        initialIdentifier={registeredCreds?.identifier}
        initialPassword={registeredCreds?.password}
        successMessage={registeredCreds?.successMessage}
      />
    );
  }

  /* =====================================================
     SCAN PAGE UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#070B0F] text-white">

      {/* =========================
          HIDDEN FILE INPUT
      ========================= */}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* =========================
          MOBILE MENU BUTTON
      ========================= */}

      <button
        type="button"
        onClick={() =>
          setMobileMenu(true)
        }
        aria-label="Open menu"
        className="
          fixed left-4 top-4
          z-50
          flex h-10 w-10
          items-center justify-center
          rounded-xl
          border border-white/10
          bg-[#10161C]
          text-white
          shadow-lg
          lg:hidden
        "
      >
        <Menu size={19} />
      </button>

      {/* =========================
          MOBILE BACKDROP
      ========================= */}

      {mobileMenu && (
        <button
          type="button"
          aria-label="Close menu"
          className="
            fixed inset-0
            z-40
            bg-black/70
            lg:hidden
          "
          onClick={() =>
            setMobileMenu(false)
          }
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed left-0 top-0
          z-50
          flex h-screen
          w-[280px]
          flex-col

          border-r
          border-white/[0.06]

          bg-[#090E13]

          transition-transform
          duration-300

          lg:translate-x-0

          ${
            mobileMenu
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >

        {/* =========================
            BRAND
        ========================= */}

        <div
          className="
            flex h-[92px]
            items-center
            border-b
            border-white/[0.05]
            px-6
          "
        >
          <div className="flex items-center gap-3">

            <div
              className="
                relative
                flex h-11 w-11
                items-center
                justify-center
              "
            >
              <div
                className="
                  absolute inset-0
                  rounded-xl
                  bg-[#00E6D0]/10
                  blur-lg
                "
              />

              <ShieldCheck
                size={36}
                strokeWidth={1.8}
                className="
                  relative
                  text-[#00E6D0]
                "
              />
            </div>

            <div>

              <div
                className="
                  text-[22px]
                  font-bold
                  tracking-tight
                "
              >
                Cyber

                <span
                  className="
                    text-[#00E6D0]
                  "
                >
                  Raksha
                </span>
              </div>

              <div
                className="
                  mt-0.5
                  text-[12px]
                  text-slate-400
                "
              >
                {brandText.tagline}
              </div>

            </div>
          </div>

          <button
            type="button"
            aria-label="Close menu"
            onClick={() =>
              setMobileMenu(false)
            }
            className="
              ml-auto
              lg:hidden
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* COLLAPSE TOGGLE - Positioned cleanly ABOVE Home */}
        <div className="px-4 pt-3 pb-1">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="flex h-9 w-full items-center gap-3 rounded-xl px-3 text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-200"
            title="Toggle Collapse"
          >
            <PanelLeftClose size={17} />
            <span className="text-xs font-medium">Collapse</span>
          </button>
        </div>

        {/* =========================
            NAVIGATION (Home, History, Safety Log, Safety Tips, Settings)
        ========================= */}

        <nav
          className="
            flex-1
            px-4
            pt-2
          "
        >

          <SidebarItem
            icon={
              <Home size={19} />
            }
            label={navigationText.home}
            active
            onClick={() => {
              setView('scan');
              setText('');
              setSelectedFile(null);
              setResult(null);
              setMobileMenu(false);
            }}
          />

          <SidebarItem
            icon={
              <History size={19} />
            }
            label={
              navigationText.history
            }
            onClick={() => {
              router.push(
                '/history'
              );

              setMobileMenu(
                false
              );
            }}
          />

          <SidebarItem
            icon={
              <ShieldCheck
                size={19}
              />
            }
            label="Safety Log"
            onClick={() => {
              router.push(
                '/safety-lock'
              );

              setMobileMenu(
                false
              );
            }}
          />

          <SidebarItem
            icon={
              <Lightbulb
                size={19}
              />
            }
            label={
              navigationText.safetyTips
            }
            onClick={() => {
              router.push(
                '/safety-tips'
              );

              setMobileMenu(
                false
              );
            }}
          />

          <SidebarItem
            icon={
              <Settings
                size={19}
              />
            }
            label={
              navigationText.settings
            }
            onClick={() => {
              router.push(
                '/settings'
              );

              setMobileMenu(
                false
              );
            }}
          />

        </nav>

        {/* =========================
            DIGITAL INDIA
        ========================= */}

        <div className="px-6 pb-7">

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                relative
                h-8
                w-16
                shrink-0
              "
            >

              <div
                className="
                  absolute
                  left-0
                  top-2
                  h-1.5
                  w-14
                  -rotate-12
                  rounded-full
                  bg-[#FF9D00]
                "
              />

              <div
                className="
                  absolute
                  left-1
                  top-4
                  h-1.5
                  w-14
                  -rotate-12
                  rounded-full
                  bg-white
                "
              />

              <div
                className="
                  absolute
                  left-2
                  top-6
                  h-1.5
                  w-14
                  -rotate-12
                  rounded-full
                  bg-[#19A974]
                "
              />

            </div>

            <div
              className="
                max-w-[120px]
                text-[12px]
                leading-4
                text-slate-300
              "
            >
              {brandText.digitalIndia}
            </div>

          </div>

        </div>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          min-h-screen
          lg:ml-[280px]
        "
      >

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header
          className="
            flex h-[76px]
            items-center
            justify-end
            gap-2.5
            px-5
            sm:px-7
            lg:px-8
          "
        >

          {/* =========================
              LANGUAGE
          ========================= */}

          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setLanguageOpen(
                  (open) =>
                    !open
                )
              }
              aria-haspopup="listbox"
              aria-expanded={
                languageOpen
              }
              className="
                flex h-10
                items-center
                gap-2

                rounded-xl

                border
                border-white/[0.08]

                bg-[#0E141A]

                px-3

                text-[13px]
                text-white

                transition

                hover:border-white/[0.16]
                hover:bg-[#121A21]
              "
            >

              <Globe
                size={16}
                className="
                  text-[#00E6D0]
                "
              />

              <span
                className="
                  max-w-[120px]
                  truncate
                "
              >
                {
                  currentLanguage.nativeName
                }
              </span>

              <ChevronDown
                size={14}
                className={`
                  text-slate-400
                  transition-transform

                  ${
                    languageOpen
                      ? 'rotate-180'
                      : ''
                  }
                `}
              />

            </button>

            {/* LANGUAGE DROPDOWN */}

            {languageOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close language selector"
                  onClick={() =>
                    setLanguageOpen(
                      false
                    )
                  }
                  className="
                    fixed inset-0
                    z-[90]
                    cursor-default
                  "
                />

                <div
                  role="listbox"
                  aria-label={
                    homeText.selectLanguage
                  }
                  className="
                    absolute
                    right-0
                    top-[calc(100%+8px)]

                    z-[100]

                    w-[250px]

                    overflow-hidden

                    rounded-2xl

                    border
                    border-white/[0.10]

                    bg-[#0D1319]

                    p-2

                    shadow-2xl
                  "
                >

                  <div
                    className="
                      px-3
                      py-2

                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-wider

                      text-slate-500
                    "
                  >
                    {
                      homeText.selectLanguage
                    }
                  </div>

                  <div
                    className="
                      max-h-[400px]
                      overflow-y-auto
                    "
                  >

                    {LANGUAGES.map(
                      (item) => {
                        const active =
                          item.code ===
                          language;

                        return (
                          <button
                            key={
                              item.code
                            }
                            type="button"
                            role="option"
                            aria-selected={
                              active
                            }
                            onClick={() =>
                              changeLanguage(
                                item.code
                              )
                            }
                            className={`
                              flex
                              w-full

                              items-center
                              justify-between

                              rounded-xl

                              px-3
                              py-2.5

                              text-left

                              transition

                              ${
                                active
                                  ? 'bg-[#00E6D0]/10 text-[#00E6D0]'
                                  : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                              }
                            `}
                          >

                            <div
                              className="
                                min-w-0
                              "
                            >

                              <div
                                className="
                                  truncate
                                  text-[13px]
                                  font-medium
                                "
                              >
                                {
                                  item.nativeName
                                }
                              </div>

                              {item.name !==
                                item.nativeName && (
                                <div
                                  className="
                                    mt-0.5
                                    truncate
                                    text-[10px]
                                    text-slate-500
                                  "
                                >
                                  {
                                    item.name
                                  }
                                </div>
                              )}

                            </div>

                            {active && (
                              <span
                                className="
                                  ml-3
                                  shrink-0
                                  text-xs
                                  font-bold
                                "
                              >
                                ✓
                              </span>
                            )}

                          </button>
                        );
                      }
                    )}

                  </div>

                </div>
              </>
            )}

          </div>

          {/* =========================
              PROFILE DROPDOWN MENU
          ========================= */}

          <div className="relative">
            <button
              type="button"
              aria-label={`Profile: ${identity?.name || 'Active User'}`}
              title={`Logged in as ${identity?.name || 'Active User'}`}
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
              className={`
                flex h-10
                items-center
                gap-2.5
                rounded-full
                border
                px-3
                py-1.5
                transition-all
                duration-200
                ${
                  darkMode
                    ? 'border-white/[0.08] bg-[#10171E] text-white hover:border-[#00E6D0]/40 hover:bg-[#151E27]'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-teal-500/40 hover:bg-slate-50 shadow-sm'
                }
              `}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00E6D0]/10 text-[#00E6D0]">
                <User size={15} strokeWidth={2.4} />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className={`max-w-[130px] truncate text-xs font-semibold leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {identity?.name || 'Active User'}
                </span>
                <span className="text-[9px] font-medium text-[#00E6D0] leading-none">
                  Logged In
                </span>
              </div>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 ${
                  profileMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {profileMenuOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close profile menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setProfileMenuOpen(false)}
                />

                <div
                  role="menu"
                  className={`
                    absolute
                    right-0
                    top-12
                    z-50
                    w-48
                    overflow-hidden
                    rounded-2xl
                    border
                    p-1.5
                    shadow-2xl
                    transition-all
                    ${
                      darkMode
                        ? 'border-white/[0.08] bg-[#0E141A] text-white'
                        : 'border-slate-200 bg-white text-slate-900 shadow-slate-200/60'
                    }
                  `}
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setProfileOpen(true);
                    }}
                    className={`
                      flex
                      w-full
                      items-center
                      gap-2.5
                      rounded-xl
                      px-3
                      py-2.5
                      text-xs
                      font-semibold
                      transition
                      text-left
                      ${
                        darkMode
                          ? 'text-slate-200 hover:bg-white/[0.06] hover:text-[#00E6D0]'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-teal-700'
                      }
                    `}
                  >
                    <User size={15} />
                    <span>View Profile</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className={`
                      flex
                      w-full
                      items-center
                      gap-2.5
                      rounded-xl
                      px-3
                      py-2.5
                      text-xs
                      font-semibold
                      transition
                      text-left
                      ${
                        darkMode
                          ? 'text-red-400 hover:bg-red-500/10'
                          : 'text-red-600 hover:bg-red-50'
                      }
                    `}
                  >
                    <LogOut size={15} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <section
          className="
            px-4
            pb-12

            sm:px-6
            lg:px-8
          "
        >

          {/* =========================
              HERO
          ========================= */}

          <div
            className="
              mx-auto
              max-w-[1180px]
              pt-5
              text-center
            "
          >

            <h1
              className="
                text-[40px]
                font-extrabold
                tracking-[-1.5px]

                text-white

                sm:text-[48px]
                lg:text-[54px]
              "
            >
              {homeText.safePrefix}{' '}

              <span
                className="
                  bg-gradient-to-r
                  from-[#00E6D0]
                  to-[#00BFAF]

                  bg-clip-text
                  text-transparent
                "
              >
                {homeText.safeHighlight}
              </span>
            </h1>

            <p
              className="
                mt-2

                text-[14px]
                text-slate-300

                sm:text-[16px]
              "
            >
              {homeText.subtitle}
            </p>

          </div>

          {/* =================================================
              CHECK TYPE CARDS
          ================================================= */}

          <div
            className="
              mx-auto
              mt-7

              grid
              max-w-[1180px]

              grid-cols-2
              gap-3

              sm:grid-cols-3
              lg:grid-cols-5
            "
          >

            {inputOptions.map(
              (option) => {
                const Icon =
                  option.icon;

                const selected =
                  selectedType ===
                  option.type;

                return (
                  <button
                    key={
                      option.type
                    }
                    type="button"
                    onClick={() =>
                      handleTypeSelect(
                        option.type
                      )
                    }
                    className={`
                      group
                      relative

                      min-h-[145px]

                      rounded-[15px]

                      border

                      p-3.5

                      text-center

                      transition-all
                      duration-200

                      ${
                        selected
                          ? 'border-[#00E6D0]/60 bg-[#10191E] shadow-[0_0_22px_rgba(0,230,208,0.07)]'
                          : 'border-white/[0.08] bg-[#10151B] hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#131A20]'
                      }

                      cursor-pointer
                    `}
                  >

                    {/* ICON */}

                    <div
                      className={`
                        mx-auto

                        flex
                        h-[44px]
                        w-[44px]

                        items-center
                        justify-center

                        rounded-full

                        ${getIconBackground(
                          option.type
                        )}
                      `}
                    >
                      <Icon
                        size={21}
                        strokeWidth={2}
                        className="text-white"
                      />
                    </div>

                    {/* TITLE */}

                    <h2
                      className="
                        mt-3

                        text-[15px]
                        font-semibold

                        text-white
                      "
                    >
                      {
                        option.title
                      }
                    </h2>

                    {/* SUBTITLE */}

                    <p
                      className="
                        mt-1

                        whitespace-pre-line

                        text-[11px]
                        leading-4

                        text-slate-400
                      "
                    >
                      {
                        option.subtitle
                      }
                    </p>

                  </button>
                );
              }
            )}

          </div>

          {/* =================================================
              INPUT AREA
          ================================================= */}

          <div
            className="
              mx-auto
              mt-6
              max-w-[1180px]
            "
          >

            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
              className="
                rounded-[15px]

                border
                border-white/[0.08]

                bg-[#0E141A]

                p-2.5

                shadow-xl
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-2.5

                  lg:flex-row
                "
              >

                {/* INPUT */}

                <div
                  className="
                    flex
                    min-h-[60px]
                    flex-1

                    items-center

                    rounded-[12px]

                    border
                    border-white/[0.08]

                    bg-[#11181F]

                    px-3
                  "
                >

                  <div
                    className="
                      mr-3

                      flex
                      h-8
                      w-8

                      shrink-0

                      items-center
                      justify-center

                      rounded-full

                      bg-[#1D252D]
                    "
                  >

                    {selectedType ===
                    'url' ? (
                      <Link2
                        size={16}
                      />
                    ) : (
                      <MessageSquare
                        size={16}
                      />
                    )}

                  </div>

                  <textarea
                    value={
                      selectedType === 'text' ||
                      selectedType === 'url'
                        ? text
                        : selectedFile?.name ?? ''
                    }
                    readOnly={
                      selectedType === 'qr' ||
                      selectedType === 'image'
                    }
                    onChange={(e) => {
                      setText(e.target.value);
                      if (error) setError('');
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter' &&
                        !e.shiftKey &&
                        (selectedType === 'text' ||
                          selectedType === 'url')
                      ) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    rows={1}
                    placeholder={
                      selectedType === 'url'
                        ? homeText.urlPlaceholder
                        : selectedType === 'qr' || selectedType === 'image'
                          ? homeText.imageRequired
                          : homeText.textPlaceholder
                    }
                    className="
                      h-[40px]
                      flex-1

                      resize-none

                      bg-transparent

                      py-2

                      text-[13px]
                      text-white

                      outline-none

                      placeholder:text-slate-500
                    "
                  />

                </div>

                {(selectedType === 'qr' ||
                  selectedType === 'image') && (
                  <button
                    type="button"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = 'image/*';
                        fileInputRef.current.click();
                      }
                    }}
                    className="
                      flex h-[46px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-[12px]
                      border border-white/[0.08]
                      bg-[#151D24]
                      px-4
                      text-[12px]
                      font-semibold
                      text-slate-200
                      transition
                      hover:border-white/20
                      hover:bg-[#1B252D]
                    "
                  >
                    {selectedFile ? 'Change file' : 'Choose file'}
                  </button>
                )}

                {/* CHECK NOW */}

                {(() => {
                  const hasValidInput = Boolean(
                    (selectedType === 'text' || selectedType === 'url')
                      ? text.trim().length > 0
                      : selectedFile !== null
                  );

                  return (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading || !hasValidInput}
                      className={`
                        flex
                        h-[46px]
                        items-center
                        justify-center
                        gap-2
                        rounded-[12px]
                        px-5
                        text-[13px]
                        font-bold
                        transition-all
                        duration-300
                        lg:w-[132px]
                        lg:self-center
                        ${
                          hasValidInput && !loading
                            ? 'bg-gradient-to-r from-[#00E6D0] via-[#24edd9] to-[#00CBB9] text-[#031310] shadow-[0_0_25px_rgba(0,230,208,0.55)] ring-2 ring-[#00E6D0]/80 hover:brightness-110 active:scale-[0.98]'
                            : 'border border-white/[0.08] bg-white/[0.04] text-slate-400 opacity-50 cursor-not-allowed shadow-none'
                        }
                      `}
                    >
                      <Search
                        size={16}
                        strokeWidth={2.3}
                      />

                      {loading
                        ? homeText.checking
                        : homeText.checkNow}
                    </button>
                  );
                })()}

              </div>

            </form>

            {/* PRIVACY */}

            <div
              className="
                mt-3

                flex
                items-center
                justify-center

                gap-2

                text-center
                text-[11px]

                text-slate-500
              "
            >

              <LockKeyhole
                size={13}
              />

              <span>
                {homeText.privacy}
              </span>

            </div>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div
              className="
                mx-auto
                mt-5

                max-w-[1180px]

                rounded-xl

                border
                border-red-500/20

                bg-red-500/10

                px-4
                py-3

                text-center
                text-[12px]

                text-red-300
              "
            >
              {error}
            </div>
          )}

          {/* =================================================
              RESULTS
          ================================================= */}

          {result && (
            <div
              ref={resultContainerRef}
              id="scan-result-container"
              className="
                mx-auto
                mt-8
                max-w-[1180px]
                scroll-mt-6
              "
            >
              <ResultsPanel
                result={
                  result
                }
                loading={
                  loading
                }
                error={null}
              />
            </div>
          )}

        </section>

      </main>

      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        darkMode={darkMode}
      />

    </div>
  );
}

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        mb-2

        flex
        w-full

        items-center

        gap-3.5

        rounded-[12px]

        px-4
        py-2.5

        text-left

        transition-all

        ${
          active
            ? 'bg-gradient-to-r from-[#00BFAF]/20 to-[#008F86]/10 text-[#00E6D0]'
            : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
        }
      `}
    >

      <span
        className="
          flex
          shrink-0
          items-center
        "
      >
        {icon}
      </span>

      <span
        className="
          text-[13px]
          font-medium
        "
      >
        {label}
      </span>

    </button>
  );
}

/* =========================================================
   INPUT CARD ICON COLORS
========================================================= */

function getIconBackground(
  type: InputType
) {
  switch (type) {
    case 'text':
      return 'bg-gradient-to-br from-[#1CA9FF] to-[#1684E5]';

    case 'url':
      return 'bg-gradient-to-br from-[#9A58FF] to-[#6B32DC]';

    case 'qr':
      return 'bg-gradient-to-br from-[#FFA92E] to-[#F47A00]';

    case 'image':
      return 'bg-gradient-to-br from-[#14D978] to-[#069B55]';

    case 'document':
      return 'bg-gradient-to-br from-[#FF536F] to-[#E62D50]';

    default:
      return 'bg-[#1CA9FF]';
  }
}
