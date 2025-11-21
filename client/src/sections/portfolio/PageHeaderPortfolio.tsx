import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";

export function PageHeaderPortfolio() {
  const { dir } = useLanguage();
  const { t } = useTranslation();

  return (
    <section className="relative py-20 bg-gradient-to-br from-brand-bg via-brand-sky-light to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 rtl:right-10 ltr:left-10 w-72 h-72 bg-brand-sky-accent rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 rtl:left-10 ltr:right-10 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-15"
          animate={{
            y: [0, 30, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Header */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-primary mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {dir === 'rtl' ? 'معرض أعمالنا' : 'Our Portfolio'}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-brand-text-muted max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {dir === 'rtl' 
              ? 'استكشف مجموعة متنوعة من المشاريع التي طورناها بعناية فائقة، من التطبيقات المحمولة إلى الأنظمة المعقدة'
              : 'Explore our carefully crafted projects, from mobile applications to complex systems'
            }
          </motion.p>
        </div>
      </div>
    </section>
  );
}