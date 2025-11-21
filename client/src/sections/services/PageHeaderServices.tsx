import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";

export function PageHeaderServices() {
  const { dir } = useLanguage();
  const { t } = useTranslation();

  return (
    <section className="relative py-20 bg-gradient-to-br from-brand-bg via-brand-sky-light to-brand-sky-base overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 rtl:right-10 ltr:left-10 w-80 h-80 bg-brand-sky-accent rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 rtl:left-10 ltr:right-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            y: [0, 20, 0],
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
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main Title */}
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-brand-text-primary mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {dir === 'rtl' ? 'خدماتنا المتخصصة' : 'Our Specialized Services'}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-brand-text-muted max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {dir === 'rtl' 
              ? 'نقدم مجموعة شاملة من الخدمات التقنية المتطورة لتلبية جميع احتياجاتك الرقمية وتحقيق نجاح أعمالك'
              : 'We offer a comprehensive range of advanced technical services to meet all your digital needs and achieve business success'
            }
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            className="mt-12 flex items-center justify-center gap-6 text-sm text-brand-text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {dir === 'rtl' ? '150+ مشروع ناجح' : '150+ Successful Projects'}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              {dir === 'rtl' ? '5+ سنوات خبرة' : '5+ Years Experience'}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              {dir === 'rtl' ? 'دعم 24/7' : '24/7 Support'}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-brand-text-muted rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-brand-text-muted rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}