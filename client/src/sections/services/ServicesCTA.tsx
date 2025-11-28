import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";
import { Link } from "wouter";

export function ServicesCTA() {
  const { dir } = useLanguage();
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 bg-brand-sky-accent/20 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg width="60" height="60" viewBox="0 0 60 60" className="absolute top-0 left-0 fill-current text-white w-full h-full">
          <defs>
            <pattern id="services-cta-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#services-cta-grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Content Section */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              هل أنت جاهز للبدء؟
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              دعنا نناقش مشروعك ونقدم لك استشارة مجانية حول أفضل الحلول التقنية المناسبة لاحتياجاتك
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-base font-semibold group"
                  data-testid="services-cta-primary"
                >
                  <Phone className={cn(
                    "w-5 h-5 group-hover:scale-110 transition-transform",
                    dir === 'rtl' ? 'ml-2' : 'mr-2'
                  )} />
                  احصل على استشارة مجانية
                </Button>
              </Link>
              
              <Link href="/portfolio">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-xl transition-all duration-300 text-base font-semibold group"
                  data-testid="services-cta-secondary"
                >
                  <i className="fas fa-briefcase w-5 h-5 group-hover:scale-110 transition-transform mr-2"></i>
                  شاهد مشاريعنا السابقة
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="mt-8 flex items-center justify-center gap-6 text-sm text-white/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                استشارة مجانية
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                رد خلال ساعة
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}