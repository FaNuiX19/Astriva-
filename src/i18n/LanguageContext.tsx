import React, { createContext, useContext, useState, useEffect } from 'react';
import { speechNarrator } from '../utils/audio';

export type Language = 'en' | 'ur';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isUrdu: boolean;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'astriva_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'ur' || saved === 'en') {
        return saved;
      }
    }
    return 'en';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, language);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    if (lang !== language) {
      speechNarrator.stop();
      setLanguageState(lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  const isUrdu = language === 'ur';
  const dir = isUrdu ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, isUrdu, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
