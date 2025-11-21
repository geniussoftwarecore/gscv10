import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  lang: Language;
  dir: 'rtl' | 'ltr';
  setLang: (language: Language) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Storage key for persistence
const STORAGE_KEY = 'gsc-language';

/**
 * Get initial language from localStorage with fallback to Arabic
 * This runs before React hydration to prevent FOUC
 */
function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'ar';
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as Language) || 'ar';
  } catch {
    return 'ar';
  }
}

/**
 * Update HTML attributes and body classes immediately
 * This prevents FOUC by updating DOM before React renders
 */
function updateDocumentLanguage(lang: Language) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  // Update HTML attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = dir;
  
  // Update body font classes for Arabic/English
  if (lang === 'ar') {
    document.body.classList.add('font-cairo');
    document.body.classList.remove('font-inter');
  } else {
    document.body.classList.add('font-inter');
    document.body.classList.remove('font-cairo');
  }
}

/**
 * Initialize language on first load (before React hydration)
 * Call this in index.html or main.tsx to prevent FOUC
 */
export function initializeLanguage() {
  if (typeof window === 'undefined') return;
  
  const initialLang = getInitialLanguage();
  updateDocumentLanguage(initialLang);
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [lang, setLangState] = useState<Language>(() => getInitialLanguage());
  
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Update document and persist to storage when language changes
  useEffect(() => {
    updateDocumentLanguage(lang);
    
    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }
  }, [lang]);

  const setLang = (newLang: Language) => {
    if (newLang !== lang) {
      setLangState(newLang);
    }
  };

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  return React.createElement(
    LanguageContext.Provider,
    {
      value: {
        lang,
        dir,
        setLang,
        toggleLang
      }
    },
    children
  );
}

/**
 * Hook to access language context
 * Must be used within LanguageProvider
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Export additional utilities for backward compatibility
export const useLanguageContext = useLanguage;
export type { LanguageContextType };