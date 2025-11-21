import termMap from '@/config/term-map.json';

/**
 * Converts input service key or name to canonical key
 * @param inputKeyOrName - The service key or name to normalize
 * @returns The canonical key for the service
 */
export function toCanonicalKey(inputKeyOrName: string): string {
  // First try direct key lookup
  if (isCanonicalKey(inputKeyOrName)) {
    return inputKeyOrName;
  }
  
  // Try case-insensitive lookup in term map
  const normalizedInput = inputKeyOrName.toLowerCase().trim();
  const canonicalKey = termMap[normalizedInput as keyof typeof termMap];
  
  if (canonicalKey) {
    return canonicalKey;
  }
  
  // Fallback: return original input if no mapping found
  console.warn(`No canonical mapping found for service: "${inputKeyOrName}"`);
  return inputKeyOrName;
}

/**
 * Checks if the given key is one of the canonical service keys
 * @param key - The key to check
 * @returns True if the key is canonical, false otherwise
 */
export function isCanonicalKey(key: string): boolean {
  const canonicalKeys = [
    'mobileApps',
    'webApps', 
    'desktopApps',
    'designGraphics',
    'paidAdsMarketing',
    'erpnextV15',
    'mobileSolutions'
  ];
  
  return canonicalKeys.includes(key);
}

/**
 * Gets all canonical service keys
 * @returns Array of all canonical service keys
 */
export function getCanonicalServiceKeys(): string[] {
  return [
    'mobileApps',
    'webApps',
    'desktopApps', 
    'designGraphics',
    'paidAdsMarketing',
    'erpnextV15',
    'mobileSolutions'
  ];
}

/**
 * Gets service metadata for a canonical key
 * @param key - The canonical service key
 * @returns Service metadata including slug and titles
 */
export function getServiceMetadata(key: string) {
  const metadata = {
    mobileApps: {
      key: 'mobileApps',
      slug: 'mobile-apps',
      title_en: 'Mobile App Development',
      title_ar: 'تطوير تطبيقات الموبايل'
    },
    webApps: {
      key: 'webApps',
      slug: 'web-apps', 
      title_en: 'Web Application Development',
      title_ar: 'تطوير تطبيقات الويب'
    },
    desktopApps: {
      key: 'desktopApps',
      slug: 'desktop-apps',
      title_en: 'Desktop Software Development', 
      title_ar: 'تطوير برمجيات سطح المكتب'
    },
    designGraphics: {
      key: 'designGraphics',
      slug: 'design-brand',
      title_en: 'UI/UX & Brand Design',
      title_ar: 'تصميم UI/UX وهوية العلامة'
    },
    paidAdsMarketing: {
      key: 'paidAdsMarketing',
      slug: 'performance-marketing',
      title_en: 'Performance Marketing & Paid Media',
      title_ar: 'التسويق الأدائي والإعلانات الممولة'
    },
    erpnextV15: {
      key: 'erpnextV15',
      slug: 'erpnext-v15',
      title_en: 'ERPNext v15 Implementation & Customization',
      title_ar: 'تنفيذ وتخصيص ERPNext v15'
    },
    mobileSolutions: {
      key: 'mobileSolutions',
      slug: 'mobile-solutions',
      title_en: 'Smart Mobile Solutions & Device Integrations',
      title_ar: 'الحلول الذكية وتكاملات الهواتف'
    }
  };
  
  return metadata[key as keyof typeof metadata] || null;
}