import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { ArrowRight, MessageCircle, Lightbulb } from "lucide-react";

export function PortfolioCTA() {
  const { dir } = useLanguage();
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 rtl:right-10 ltr:left-10 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 rtl:left-10 ltr:right-10 w-72 h-72 bg-brand-sky-accent rounded-full mix-blend-overlay filter blur-2xl opacity-20"
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Lightbulb className="w-5 h-5 text-white" />
              <span className="text-white font-medium">
                {dir === 'rtl' ? 'لديك فكرة مشروع؟' : 'Have a Project Idea?'}
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {dir === 'rtl' 
                ? 'لنحول فكرتك إلى واقع رقمي'
                : 'Let\'s Turn Your Idea Into Digital Reality'
              }
            </h2>
            
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {dir === 'rtl'
                ? 'نحن هنا لمساعدتك في تطوير مشروعك القادم. تواصل معنا واحصل على استشارة مجانية'
                : 'We\'re here to help you build your next project. Contact us for a free consultation'
              }
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold group"
              data-testid="portfolio-primary-cta"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {dir === 'rtl' ? 'تواصل معنا الآن' : 'Contact Us Now'}
              <ArrowRight 
                className={cn(
                  "w-5 h-5 transition-transform duration-300 group-hover:translate-x-1",
                  dir === 'rtl' ? 'mr-2 group-hover:-translate-x-1' : 'ml-2'
                )} 
              />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-xl transition-all duration-300 text-base font-semibold backdrop-blur-sm"
              data-testid="portfolio-secondary-cta"
            >
              {dir === 'rtl' ? 'عرض الخدمات' : 'View Services'}
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-12 flex items-center justify-center gap-8 text-sm text-white/80"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              {dir === 'rtl' ? 'استجابة فورية' : 'Quick Response'}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              {dir === 'rtl' ? 'استشارة مجانية' : 'Free Consultation'}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-sky-accent rounded-full"></div>
              {dir === 'rtl' ? 'دعم مستمر' : 'Ongoing Support'}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}