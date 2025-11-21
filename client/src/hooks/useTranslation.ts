import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/lang';

type TranslationKey = string;
type Translations = Record<string, any>;

let cachedTranslations: Record<string, Translations> = {};

export function useTranslation() {
  const { lang } = useLanguage();
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Check if translations are already cached
        if (cachedTranslations[lang]) {
          setTranslations(cachedTranslations[lang]);
          setIsLoading(false);
          return;
        }

        // Load translations from public folder
        const response = await fetch(`/locales/${lang}.json`);
        const data = await response.json();
        
        // Cache the translations
        cachedTranslations[lang] = data;
        setTranslations(data);
        setIsLoading(false);
      } catch (error) {
        console.error(`Failed to load translations for ${lang}:`, error);
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    loadTranslations();
  }, [lang]);

  const t = (key: TranslationKey, fallback?: string): string => {
    if (isLoading) return fallback || key;
    
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }

    return typeof value === 'string' ? value : fallback || key;
  };

  return { t, isLoading, language: lang };
}