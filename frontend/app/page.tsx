'use client';

import { useRef, useState, useEffect } from 'react';
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
  Menu,
  MessageSquare,
  QrCode,
  Search,
  Settings,
  ShieldCheck,
  UserCircle,
  Volume2,
  X,
} from 'lucide-react';

import {
  runImageScan,
  runTextScan,
  runUrlScan,
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

  // VIEW & AUTH STATE
  const [view, setView] = useState<ViewType>('home');
  const [identity, setIdentity] = useState<Identity | null>(null);

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

  const [
    languageOpen,
    setLanguageOpen,
  ] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setIdentity({
            name: data.user?.fullName || 'User',
            guest: false,
          });
          setView('scan');
        }
      } catch (err) {
        // Not authenticated, stay on home
        setView('home');
      }
    };
    checkAuth();
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
    setIdentity(null);
    setView('home');
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
      setError(homeText.documentUnavailable);
      return;
    }

    if (type === 'qr' || type === 'image') {
      if (fileInputRef.current) {
        fileInputRef.current.accept = 'image/*';
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

    void handleScan({
      type: selectedType,
      file,
    });

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
    if (type === 'document') {
      setError(
        homeText.documentUnavailable
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

    const scanFile =
      file ?? selectedFile;

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
            file!,
            'qr'
          );
      }

      /* IMAGE */

      else {
        previewText =
          scanFile?.name ||
          'Image';

        response =
          await runImageScan(
            file!,
            'image'
          );
      }

      setResult(response);

      /* SAVE HISTORY */

      saveScanHistoryItem(
        type === 'url'
          ? 'url'
          : type === 'qr'
            ? 'qr'
            : type === 'image'
              ? 'image'
              : 'text',

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
        onGoToLogin={() => setView('login')}
        onRegistered={() => setView('login')}
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
        onGoToRegister={() => setView('register')}
      />
    );
  }

  /* =====================================================
     VIEW: REGISTER
  ===================================================== */

  if (view === 'register') {
    return (
      <RegisterScreen
        onGoToLogin={() => setView('login')}
        onGoToHome={() => setView('home')}
        onRegistered={() => setView('login')}
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
        onGoToRegister={() => setView('register')}
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

        {/* =========================
            NAVIGATION
        ========================= */}

        <nav
          className="
            flex-1
            px-4
            pt-5
          "
        >

          <SidebarItem
            icon={
              <Home size={19} />
            }
            label={navigationText.home}
            active
            onClick={() => {
              router.push('/');

              setMobileMenu(
                false
              );
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
            label={
              navigationText.safetyLock
            }
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
              <Flag size={19} />
            }
            label={
              navigationText.reportScam
            }
            onClick={() => {
              router.push(
                '/report'
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
              LISTEN
          ========================= */}

          <button
            type="button"
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
              text-[#00E6D0]

              transition

              hover:border-[#00E6D0]/30
              hover:bg-[#121A21]
            "
          >
            <Volume2
              size={16}
            />

            <span
              className="
                hidden
                sm:inline
              "
            >
              {homeText.listen}
            </span>
          </button>

          {/* =========================
              LOGOUT BUTTON
          ========================= */}

          <button
            type="button"
            aria-label="Logout"
            onClick={handleLogout}
            className="
              flex h-10 w-10
              items-center
              justify-center

              rounded-full

              border
              border-white/[0.08]

              bg-[#182027]

              transition

              hover:bg-red-500/20
              hover:text-red-400
            "
            title="Logout"
          >
            <UserCircle
              size={21}
            />
          </button>

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
                    disabled={
                      option.type ===
                      'document'
                    }
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

                      ${
                        option.type ===
                        'document'
                          ? 'cursor-not-allowed opacity-60'
                          : 'cursor-pointer'
                      }
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

                <button
                  type="button"
                  onClick={
                    handleSubmit
                  }
                  disabled={
                    loading
                  }
                  className="
                    flex
                    h-[46px]

                    items-center
                    justify-center

                    gap-2

                    rounded-[12px]

                    bg-gradient-to-r
                    from-[#00E6D0]
                    to-[#00CBB9]

                    px-5

                    text-[13px]
                    font-bold

                    text-[#031310]

                    shadow-[0_0_18px_rgba(0,230,208,0.10)]

                    transition

                    hover:brightness-110

                    disabled:
                    cursor-not-allowed

                    disabled:
                    opacity-50

                    lg:w-[132px]
                    lg:self-center
                  "
                >

                  <Search
                    size={16}
                    strokeWidth={2.3}
                  />

                  {loading
                    ? homeText.checking
                    : homeText.checkNow}

                </button>

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
              className="
                mx-auto
                mt-8
                max-w-[1180px]
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
