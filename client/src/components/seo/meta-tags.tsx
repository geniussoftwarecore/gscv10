import { useEffect } from "react";
import { useLocation } from "wouter";

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
}

const siteDefaults = {
  siteName: "Genius Software Core",
  baseUrl: "https://geniuscore.dev",
  description: "شركة تطوير البرمجيات والحلول التقنية المبتكرة في اليمن",
  image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630",
};

const routeMeta: Record<string, Omit<MetaTagsProps, "type">> = {
  "/": {
    title: "الرئيسية - Genius Software Core",
    description: "شركة تطوير البرمجيات الرائدة في اليمن. نقدم خدمات تطوير التطبيقات والمواقع والحلول التقنية المتكاملة",
    keywords: "تطوير البرمجيات, تطبيقات الجوال, مواقع الويب, اليمن, تقنية",
  },
  "/about": {
    title: "من نحن - Genius Software Core",
    description: "تعرف على فريقنا المحترف وقصة نجاحنا في مجال تطوير البرمجيات والحلول التقنية",
    keywords: "من نحن, فريق العمل, تاريخ الشركة, خبرة تقنية",
  },
  "/services": {
    title: "خدماتنا - Genius Software Core", 
    description: "خدمات شاملة في تطوير التطبيقات والمواقع والتسويق الرقمي وأنظمة ERPNext",
    keywords: "خدمات تقنية, تطوير تطبيقات, تصميم مواقع, تسويق رقمي, ERPNext",
  },
  "/portfolio": {
    title: "أعمالنا - Genius Software Core",
    description: "استكشف مشاريعنا المميزة والحلول التقنية التي طورناها لعملائنا",
    keywords: "مشاريع تقنية, أعمال سابقة, portfolio, تطبيقات ناجحة",
  },
  "/frameworks": {
    title: "أطرنا التقنية - Genius Software Core",
    description: "أدواتنا ومكتباتنا التقنية المفتوحة المصدر للمطورين ومجتمع البرمجة",
    keywords: "مكتبات مفتوحة, أدوات تطوير, frameworks, open source",
  },
  "/contact": {
    title: "تواصل معنا - Genius Software Core",
    description: "تواصل مع فريقنا المحترف لمناقشة مشروعك التقني والحصول على استشارة مجانية",
    keywords: "تواصل, استشارة تقنية, مشروع تقني, خدمة عملاء",
  },
};

export function MetaTags({ title, description, keywords, image, type = "website" }: MetaTagsProps) {
  const [location] = useLocation();
  
  useEffect(() => {
    const routeData = routeMeta[location] || {};
    const finalTitle = title || routeData.title || siteDefaults.siteName;
    const finalDescription = description || routeData.description || siteDefaults.description;
    const finalKeywords = keywords || routeData.keywords || "";
    const finalImage = image || routeData.image || siteDefaults.image;
    const url = `${siteDefaults.baseUrl}${location}`;

    // Update document title
    document.title = finalTitle;

    // Helper function to update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    // Standard meta tags
    updateMetaTag("description", finalDescription);
    updateMetaTag("keywords", finalKeywords);
    updateMetaTag("author", siteDefaults.siteName);

    // Open Graph tags
    updateMetaTag("og:title", finalTitle, true);
    updateMetaTag("og:description", finalDescription, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:url", url, true);
    updateMetaTag("og:image", finalImage, true);
    updateMetaTag("og:site_name", siteDefaults.siteName, true);
    updateMetaTag("og:locale", "ar_YE", true);

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", finalTitle);
    updateMetaTag("twitter:description", finalDescription);
    updateMetaTag("twitter:image", finalImage);

    // Additional SEO tags
    updateMetaTag("robots", "index, follow");
    updateMetaTag("language", "Arabic");
    updateMetaTag("revisit-after", "7 days");

  }, [location, title, description, keywords, image, type]);

  return null;
}

export default MetaTags;