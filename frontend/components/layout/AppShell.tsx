'use client';

import { useEffect, useState } from 'react';

import {
  Check,
  ChevronDown,
  Globe,
  Menu,
  UserCircle,
  Volume2,
} from 'lucide-react';

import { LANGUAGES } from '@/lib/languages';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Sidebar } from './Sidebar';

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [listenEnabled, setListenEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const {
    language,
    setLanguage,
    currentLanguage,
    translations: allTranslations,
  } = useLanguage();

  /*
   * The translation file stores shared top-bar text inside
   * the `home` section. Always select the specific string
   * instead of rendering the whole translation object.
   */
  const currentTranslation =
    allTranslations[language] ?? allTranslations.en;

  const listenLabel =
    currentTranslation.home.listen;

  const selectLanguageLabel =
    currentTranslation.home.selectLanguage;

  /*
   * Keep the shell synchronized with the Settings page.
   *
   * Settings stores these preferences in localStorage and emits
   * CyberRaksha-specific events. Reading them here makes the
   * top-level shell react immediately without requiring a reload.
   */
  useEffect(() => {
    const readPreferences = () => {
      const savedListen = window.localStorage.getItem(
        'cyberraksha-listen'
      );
      const savedTheme = window.localStorage.getItem(
        'cyberraksha-theme'
      );

      setListenEnabled(
        savedListen === null
          ? true
          : savedListen === 'true'
      );

      setDarkMode(
        savedTheme === null
          ? true
          : savedTheme === 'dark'
      );
    };

    readPreferences();

    const handleListenChange = (event: Event) => {
      const customEvent = event as CustomEvent<boolean>;
      setListenEnabled(Boolean(customEvent.detail));
    };

    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setDarkMode(customEvent.detail !== 'light');
    };

    window.addEventListener(
      'cyberraksha-listen-change',
      handleListenChange
    );

    window.addEventListener(
      'cyberraksha-theme-change',
      handleThemeChange
    );

    window.addEventListener('storage', readPreferences);

    return () => {
      window.removeEventListener(
        'cyberraksha-listen-change',
        handleListenChange
      );

      window.removeEventListener(
        'cyberraksha-theme-change',
        handleThemeChange
      );

      window.removeEventListener(
        'storage',
        readPreferences
      );
    };
  }, []);

  /*
   * Keep the document/body theme state synchronized even when
   * the preference is changed from another component.
   */
  useEffect(() => {
    document.documentElement.dataset.theme =
      darkMode ? 'dark' : 'light';

    document.documentElement.classList.toggle(
      'dark',
      darkMode
    );

    document.body.classList.toggle(
      'cyberraksha-dark',
      darkMode
    );

    document.body.classList.toggle(
      'cyberraksha-light',
      !darkMode
    );
  }, [darkMode]);

  const speakHomeSummary = () => {
    if (
      !listenEnabled ||
      typeof window === 'undefined' ||
      !('speechSynthesis' in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const text =
      `${currentTranslation.home.safePrefix} ` +
      `${currentTranslation.home.safeHighlight}. ` +
      `${currentTranslation.home.subtitle}`;

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = currentLanguage.code;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? 'bg-[#070B0F] text-white'
          : 'bg-slate-100 text-slate-900'
      }`}
      data-theme={darkMode ? 'dark' : 'light'}
    >

      {/* SIDEBAR */}
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() =>
          setMobileOpen(false)
        }
        collapsed={collapsed}
        onToggleCollapse={() =>
          setCollapsed((value) => !value)
        }
      />

      <div
        className={`
          min-h-screen
          transition-all
          duration-300
          ${
            collapsed
              ? 'lg:ml-[82px]'
              : 'lg:ml-[290px]'
          }
        `}
      >

        {/* TOP BAR */}
        <header
          className="
            sticky
            top-0
            z-40

            flex
            h-[82px]
            items-center
            justify-between

            border-b
            px-5

            backdrop-blur-xl

            sm:px-8
          "
          style={{
            backgroundColor: darkMode
              ? 'rgba(7, 11, 15, 0.95)'
              : 'rgba(248, 250, 252, 0.95)',
            borderColor: darkMode
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(15,23,42,0.08)',
            color: darkMode ? '#ffffff' : '#0f172a',
          }}
        >

          {/* MOBILE MENU */}
          <button
            type="button"
            onClick={() =>
              setMobileOpen(true)
            }
            className={`
              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-xl

              border
              border-white/10

              lg:hidden
              ${
                darkMode
                  ? 'bg-[#10161C] text-white'
                  : 'bg-white text-slate-900'
              }
            `}
            aria-label="Open menu"
          >
            <Menu size={21} />
          </button>

          <div
            className="
              ml-auto
              flex
              items-center
              gap-2
            "
          >

            {/* LANGUAGE SELECTOR */}
            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setLanguageOpen(
                    (value) => !value
                  )
                }
                aria-haspopup="listbox"
                aria-expanded={
                  languageOpen
                }
                className={`
                  flex
                  h-10
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-white/[0.08]

                  px-3

                  text-sm

                  transition
                  ${
                    darkMode
                      ? 'bg-[#0D1319] text-white'
                      : 'bg-white text-slate-900'
                  }

                  hover:border-[#00E6D0]/30

                  sm:px-4
                `}
              >

                <Globe
                  size={17}
                  className="text-[#00E6D0]"
                />

                <span
                  className="
                    max-w-[100px]
                    truncate
                  "
                >
                  {
                    currentLanguage.nativeName
                  }
                </span>

                <ChevronDown
                  size={15}
                  className={`
                    text-slate-500
                    transition-transform

                    ${
                      languageOpen
                        ? 'rotate-180'
                        : ''
                    }
                  `}
                />

              </button>

              {languageOpen && (
                <>
                  {/* CLICK OUTSIDE */}
                  <button
                    type="button"
                    aria-label="Close language menu"
                    className="
                      fixed
                      inset-0
                      z-40
                      cursor-default
                    "
                    onClick={() =>
                      setLanguageOpen(
                        false
                      )
                    }
                  />

                  {/* LANGUAGE MENU */}
                  <div
                    dir={currentLanguage.rtl ? 'rtl' : 'ltr'}
                    role="listbox"
                    aria-labelledby="language-menu-label"
                    className="
                      absolute
                      right-0
                      top-12
                      z-50

                      w-[285px]

                      overflow-hidden

                      rounded-2xl

                      border
                      border-white/[0.08]

                      p-2

                      shadow-2xl
                    "
                    style={{
                      backgroundColor: darkMode
                        ? '#10161C'
                        : '#ffffff',
                      borderColor: darkMode
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(15,23,42,0.10)',
                    }}
                  >

                    <div
                      className="
                        px-3
                        pb-3
                        pt-2
                      "
                    >

                      <div
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.16em]
                          text-slate-500
                        "
                      >
                        {selectLanguageLabel}
                      </div>

                      <div
                        className={`mt-1 text-[11px] ${
                          darkMode ? 'text-slate-600' : 'text-slate-500'
                        }`}
                      >
                        22 Indian Languages
                      </div>

                    </div>

                    <div
                      className="
                        custom-scrollbar
                        max-h-[430px]
                        overflow-y-auto
                      "
                    >

                      {LANGUAGES.map(
                        (item) => {
                          const isActive =
                            language ===
                            item.code;

                          return (
                            <button
                              key={
                                item.code
                              }
                              type="button"
                              role="option"
                              aria-selected={
                                isActive
                              }
                              aria-label={`${item.nativeName} (${item.name})`}
                              dir={item.rtl ? 'rtl' : 'ltr'}
                              onClick={() => {
                                setLanguage(
                                  item.code
                                );

                                setLanguageOpen(
                                  false
                                );
                              }}
                              className={`
                                flex
                                w-full
                                items-center
                                gap-3

                                rounded-xl

                                px-3
                                py-3

                                text-left

                                transition

                                ${
                                  isActive
                                    ? 'bg-[#00E6D0]/10 text-[#00E6D0]'
                                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                                }
                              `}
                            >

                              <span className="flex-1">

                                <span
                                  className="
                                    block
                                    text-sm
                                    font-semibold
                                  "
                                >
                                  {
                                    item.nativeName
                                  }
                                </span>

                                <span
                                  className={`mt-0.5 block text-[10px] ${
                                    darkMode ? 'text-slate-600' : 'text-slate-500'
                                  }`}
                                >
                                  {
                                    item.name
                                  }
                                </span>

                              </span>

                              {isActive && (
                                <Check
                                  size={17}
                                />
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

            {/* LISTEN */}
            <button
              type="button"
              onClick={speakHomeSummary}
              disabled={!listenEnabled}
              className={`
                flex
                h-10
                items-center
                gap-2

                rounded-full

                border
                border-white/[0.08]

                px-3

                text-[#00E6D0]

                transition

                ${
                  darkMode
                    ? 'bg-[#0D1319] text-[#00E6D0]'
                    : 'bg-white text-teal-600'
                }

                hover:border-[#00E6D0]/30

                disabled:cursor-not-allowed
                disabled:opacity-40

                sm:px-4
              `}
              aria-label={listenLabel}
              title={listenLabel}
            >
              <Volume2 size={17} />

              <span
                className="
                  hidden
                  text-sm
                  sm:block
                "
              >
                {listenLabel}
              </span>
            </button>

            {/* PROFILE */}
            <button
              type="button"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center

                rounded-full

                border
                border-white/[0.08]

              "
              style={{
                backgroundColor: darkMode
                  ? '#182027'
                  : '#ffffff',
                color: darkMode
                  ? '#ffffff'
                  : '#0f172a',
                borderColor: darkMode
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(15,23,42,0.10)',
              }}
              aria-label="Profile"
              title="Profile"
            >
              <UserCircle size={24} />
            </button>

          </div>

        </header>

        {/* PAGE CONTENT */}
        {children}

      </div>

    </div>
  );
}
