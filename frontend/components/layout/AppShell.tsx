'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Check,
  ChevronDown,
  Globe,
  Menu,
  UserCircle,
  User,
  LogOut,
} from 'lucide-react';

import { LANGUAGES } from '@/lib/languages';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Sidebar } from './Sidebar';
import { ProfileModal } from './ProfileModal';

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string>('Active User');

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

  const selectLanguageLabel =
    currentTranslation.home.selectLanguage;

  const applyThemeToDom = (isDark: boolean) => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('cyberraksha-dark', isDark);
    document.body.classList.toggle('cyberraksha-light', !isDark);
  };

  /*
   * Keep the shell synchronized with Settings & local storage.
   */
  useEffect(() => {
    const readPreferences = () => {
      const savedTheme = window.localStorage.getItem('cyberraksha-theme');
      const isDark = savedTheme === null ? true : savedTheme === 'dark';
      setDarkMode(isDark);
      applyThemeToDom(isDark);
    };

    readPreferences();

    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const isDark = customEvent.detail !== 'light';
      setDarkMode((prev) => {
        if (prev !== isDark) {
          applyThemeToDom(isDark);
          return isDark;
        }
        return prev;
      });
    };

    window.addEventListener('cyberraksha-theme-change', handleThemeChange);
    window.addEventListener('storage', readPreferences);

    return () => {
      window.removeEventListener('cyberraksha-theme-change', handleThemeChange);
      window.removeEventListener('storage', readPreferences);
    };
  }, []);

  /*
   * Load user profile info to display name next to profile avatar
   */
  useEffect(() => {
    const loadUserProfile = () => {
      try {
        const storedProfile = localStorage.getItem('cyberraksha-profile');
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          if (parsed.name && parsed.name.trim()) {
            setUserName(parsed.name.trim());
            return;
          }
        }
        const storedUser = localStorage.getItem('cyberraksha-user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed.fullName || parsed.username || parsed.name) {
            setUserName(parsed.fullName || parsed.username || parsed.name);
            return;
          }
        }
      } catch {
        // ignore
      }

      fetch('/api/auth/me')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user?.fullName) {
            setUserName(data.user.fullName);
          } else if (data?.user?.username) {
            setUserName(data.user.username);
          } else if (data?.user?.email) {
            setUserName(data.user.email.split('@')[0]);
          } else {
            setUserName('Active User');
          }
        })
        .catch(() => {
          setUserName('Active User');
        });
    };

    loadUserProfile();

    const handleProfileUpdate = () => loadUserProfile();
    window.addEventListener('cyberraksha-profile-updated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);

    return () => {
      window.removeEventListener('cyberraksha-profile-updated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);


  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Silent error
    }
    setProfileMenuOpen(false);
    router.push('/');
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
          flex h-screen flex-col overflow-hidden
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
            h-[74px]
            shrink-0
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

            {/* PROFILE DROPDOWN MENU WITH USER NAME */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className={`
                  flex
                  h-10
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
                aria-label={`Profile: ${userName}`}
                title={`Logged in as ${userName}`}
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00E6D0]/10 text-[#00E6D0]">
                  <User size={15} strokeWidth={2.4} />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className={`max-w-[130px] truncate text-xs font-semibold leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {userName}
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
                      w-52
                      overflow-hidden
                      rounded-2xl
                      border
                      p-2
                      shadow-2xl
                      transition-all
                      ${
                        darkMode
                          ? 'border-white/[0.08] bg-[#0E141A] text-white'
                          : 'border-slate-200 bg-white text-slate-900 shadow-slate-200/60'
                      }
                    `}
                  >
                    {/* User Identity Banner in dropdown */}
                    <div className="border-b border-white/[0.06] px-3 pb-2.5 pt-1.5 sm:hidden">
                      <p className={`text-xs font-semibold truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {userName}
                      </p>
                      <p className="text-[10px] text-[#00E6D0]">Logged In</p>
                    </div>

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

          </div>

        </header>

        {/* PAGE CONTENT - Clean viewport scrolling */}
        <main className="flex-1 overflow-y-auto min-h-0 scroll-smooth">
          {children}
        </main>

      </div>

      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        darkMode={darkMode}
      />

    </div>
  );
}
