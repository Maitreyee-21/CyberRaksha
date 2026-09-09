'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  DEFAULT_LANGUAGE,
  getLanguage,
  isLanguageCode,
  LANGUAGES,
  LANGUAGE_STORAGE_KEY,
  type LanguageCode,
} from '@/lib/languages';

import { translations } from '@/lib/translations';

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  languages: typeof LANGUAGES;
  currentLanguage: ReturnType<typeof getLanguage>;
  translations: typeof translations;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  /*
   * Always start with English during the first render.
   * This keeps server and client markup identical and avoids
   * hydration errors when a saved language exists in localStorage.
   */
  const [language, setLanguageState] =
    useState<LanguageCode>(DEFAULT_LANGUAGE);

  /*
   * Read the saved language only after hydration.
   */
  useEffect(() => {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (isLanguageCode(saved)) {
      setLanguageState(saved);
    }
  }, []);

  /*
   * Keep the document language and RTL direction synchronized
   * with the selected language.
   */
  useEffect(() => {
    const current = getLanguage(language);

    document.documentElement.lang = current.code;
    document.documentElement.dir = current.rtl ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (nextLanguage: LanguageCode) => {
    if (!isLanguageCode(nextLanguage)) {
      return;
    }

    setLanguageState(nextLanguage);

    window.localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      nextLanguage
    );

    const current = getLanguage(nextLanguage);

    document.documentElement.lang = current.code;
    document.documentElement.dir = current.rtl ? 'rtl' : 'ltr';

    /*
     * Keep compatibility with components that listen for the
     * global CyberRaksha language-change event.
     */
    window.dispatchEvent(
      new CustomEvent('cyberraksha-language-change', {
        detail: nextLanguage,
      })
    );
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      languages: LANGUAGES,
      currentLanguage: getLanguage(language),
      translations,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLanguage must be used inside LanguageProvider'
    );
  }

  return context;
}
