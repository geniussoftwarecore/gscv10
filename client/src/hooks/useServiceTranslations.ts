import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/lang';

export interface ServiceData {
  ui: {
    services: string;
    viewDetails: string;
    whatYouGet: string;
    whatWeNeed: string;
    interactiveIdeas: string;
    startRequest: string;
    chooseLocation: string;
    country: string;
    city: string;
    mode: string;
    onsite: string;
    remote: string;
    hybrid: string;
    sendRequest: string;
    backToServices: string;
  };
  services: Array<{
    id: string;
    slug?: string;
    name: string;
    tagline: string;
    description: string;
    features: string[];
    deliverables: string[];
    inputsNeeded: string[];
    interactiveIdeas: string[];
    category: string;
    ctaLabel: string;
    detailPage?: {
      heroCta: string;
      slides: {
        slide1: { overline: string; title: string; body: string; };
        slide2: { overline: string; title: string; body: string; };
        slide3: { overline: string; title: string; body: string; };
        slide4: { overline: string; title: string; body: string; };
        slide5: { overline: string; title: string; body: string; };
      };
    };
  }>;
}

export function useServiceTranslations() {
  const { lang } = useLanguage();
  const [servicesData, setServicesData] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServiceTranslations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/locales/${lang}/services.json`);
        
        if (!response.ok) {
          throw new Error(`Failed to load services translations: ${response.status}`);
        }
        
        const data = await response.json();
        setServicesData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load service translations:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadServiceTranslations();
  }, [lang]);

  return { servicesData, loading, error };
}