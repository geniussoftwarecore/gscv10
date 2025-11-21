import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
}

export function SEOHead({ 
  title, 
  description, 
  image = "/brand/logo-gsc-hero.png",
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = "website",
  keywords
}: SEOHeadProps) {
  const { lang } = useLanguage();
  const { t } = useTranslation();

  // Clean site title and page data
  const siteTitle = "Genius Software Core";
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const pageDescription = description || (lang === 'ar' 
    ? "شركة رائدة في تطوير البرمجيات والحلول التقنية المتطورة"
    : "Leading software development company providing advanced technical solutions"
  );
  
  // Clean keywords
  const defaultKeywords = lang === 'ar' 
    ? "جينيوس سوفت وير كور، تطوير تطبيقات، نظام CRM، ERP، تطبيقات الويب، تطبيقات الجوال، تصميم مواقع، التسويق الرقمي"
    : "Genius Software Core, app development, CRM system, ERP, web applications, mobile apps, website design, digital marketing";
  
  const pageKeywords = keywords || defaultKeywords;

  // Clean URL handling
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://geniussoftwarecore.com';
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : baseUrl);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content="Genius Software Core" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content={lang === 'ar' ? 'ar_SA' : 'en_US'} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="theme-color" content="#3b9ff3" />
      <meta name="msapplication-TileColor" content="#3b9ff3" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/brand/logo-gsc-32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/brand/logo-gsc-16.png" />
      <link rel="apple-touch-icon" sizes="192x192" href="/brand/logo-gsc-192.png" />
      <link rel="shortcut icon" href="/brand/logo-gsc-32.png" />
      
      {/* Preload Critical Resources */}
      <link rel="preload" href="/brand/logo-gsc-hero.png" as="image" />
      {/* Local fonts are now handled in CSS */}
      
      {/* Prevent any unwanted styling or scripts injection */}
      <style type="text/css">
        {`
          /* Reset any debugging tool styles */
          .eruda-search-highlight-block,
          .eruda-keyword,
          [class*="eruda"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
        `}
      </style>
      
      {/* Clean JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": siteTitle,
          "description": pageDescription,
          "url": baseUrl,
          "logo": {
            "@type": "ImageObject",
            "url": fullImageUrl,
            "width": 512,
            "height": 512
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["Arabic", "English"],
            "url": `${baseUrl}/contact`
          },
          "foundingDate": "2020",
          "sameAs": [
            // Social media URLs can be added here
          ],
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "YE",
            "addressLocality": "Sana'a"
          }
        }, null, 0)}
      </script>
    </Helmet>
  );
}