import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { MessageCircle, Calendar, ArrowRight } from "lucide-react";

export function CTAStrip() {
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
            <pattern id="cta-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <motion.div
            className={cn(
              "text-center lg:text-start",
              dir === "rtl" && "lg:text-right"
            )}
            initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
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
              {t('cta.title')}
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {dir === 'rtl' 
                ? 'دعنا نساعدك في تحويل فكرتك إلى منتج رقمي ناجح. احجز استشارة مجانية اليوم'
                : 'Let us help you transform your idea into a successful digital product. Book a free consultation today'
              }
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold group"
                data-testid="cta-primary-button"
              >
                <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                {t('cta.primary')}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-xl transition-all duration-300 text-base font-semibold group"
                data-testid="cta-secondary-button"
              >
                <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                {t('cta.secondary')}
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-white/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                {dir === 'rtl' ? 'استشارة مجانية' : 'Free Consultation'}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                {dir === 'rtl' ? 'رد خلال ساعة' : 'Reply within 1 hour'}
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Section */}
          <motion.div
            className="relative lg:block hidden"
            initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Main Visual Container */}
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Calendar Icon */}
                  <motion.div
                    className="bg-white/20 rounded-2xl p-6 flex items-center justify-center"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Calendar className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  {/* Message Icon */}
                  <motion.div
                    className="bg-white/20 rounded-2xl p-6 flex items-center justify-center"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <MessageCircle className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  {/* Combined Action */}
                  <motion.div
                    className="col-span-2 bg-white/20 rounded-2xl p-6 flex items-center justify-center gap-3"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <ArrowRight className="w-6 h-6 text-white" />
                    <span className="text-white font-medium">
                      {dir === 'rtl' ? 'ابدأ الآن' : 'Get Started'}
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-400 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-3 -left-3 w-4 h-4 bg-green-400 rounded-full"
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}