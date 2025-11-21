import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/i18n/lang';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

export function LanguageToggle() {
  const { lang, toggleLang, dir } = useLanguage();
  const { t } = useTranslation();

  return (
    <motion.button
      onClick={toggleLang}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
        "text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400",
        "hover:bg-slate-100 dark:hover:bg-slate-800",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2",
        "dark:focus-visible:ring-offset-slate-900"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      data-testid="button-language-toggle"
      aria-label={lang === 'ar' ? 'تبديل اللغة إلى الإنجليزية' : 'Switch to Arabic'}
      title={lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
    >
      <Globe className="h-4 w-4" />
      <span className={cn(dir === 'rtl' ? "font-cairo" : "font-inter")}>
        {lang === 'ar' ? 'EN' : 'عربي'}
      </span>
    </motion.button>
  );
}