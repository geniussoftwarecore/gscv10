import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Smartphone, 
  Database, 
  Bot, 
  ArrowRight, 
  Eye,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Link } from 'wouter';
import { BrandGlow } from '@/components/brand/BrandGlow';
import { BrandParticles } from '@/components/brand/BrandParticles';
import { DigitalGrid } from '@/components/brand/DigitalGrid';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from "@/i18n/lang";

interface ServiceHighlight {
  id: string;
  icon: React.ReactNode;
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
}

const SERVICE_HIGHLIGHTS: ServiceHighlight[] = [
  {
    id: 'web',
    icon: <Monitor className="w-8 h-8" />,
    title_ar: 'تطوير المواقع',
    title_en: 'Web Development',
    desc_ar: 'مواقع سريعة وآمنة وسهلة الاستخدام',
    desc_en: 'Fast, secure and user-friendly websites'
  },
  {
    id: 'mobile',
    icon: <Smartphone className="w-8 h-8" />,
    title_ar: 'تطبيقات الهاتف',
    title_en: 'Mobile Apps',
    desc_ar: 'تطبيقات Android و iOS احترافية',
    desc_en: 'Professional Android and iOS applications'
  },
  {
    id: 'erp',
    icon: <Database className="w-8 h-8" />,
    title_ar: 'أنظمة ERP/CRM',
    title_en: 'ERP/CRM Solutions',
    desc_ar: 'أنظمة إدارة شاملة لعملك',
    desc_en: 'Complete management systems for your business'
  },
  {
    id: 'ai',
    icon: <Bot className="w-8 h-8" />,
    title_ar: 'الذكاء الاصطناعي والأتمتة',
    title_en: 'AI & Automation',
    desc_ar: 'حلول ذكية لتحسين كفاءة العمل',
    desc_en: 'Smart solutions to improve work efficiency'
  }
];

interface HomeHeroProps {
  language?: 'ar' | 'en';
}

export function HomeHero({ language = 'ar' }: HomeHeroProps) {
  const { t } = useTranslation();
  const { dir } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const serviceVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section 
      ref={ref}
      className="bg-white py-16 lg:py-24 relative overflow-hidden"
      style={{ position: 'relative' }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Digital Grid Background */}
      <DigitalGrid />
      
      {/* Background decorations with White + Sky Blue theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-sky-100/40 to-sky-200/20 rounded-full blur-3xl"
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        <motion.div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tl from-sky-200/30 to-sky-100/15 rounded-full blur-3xl"
          animate={{ 
            rotate: -360,
            scale: [1, 0.9, 1.1, 1],
            x: [0, -15, 0],
            y: [0, 15, 0]
          }}
          transition={{ 
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 16, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 14, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Floating sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-sky-300/40"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -25 - Math.random() * 15, 0],
              x: [0, (Math.random() - 0.5) * 20, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2 + Math.random() * 0.3, 1]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.6
            }}
          >
            <Sparkles size={16 + Math.random() * 8} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center"
        >




          {/* Top Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <Badge 
              className="bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors duration-300 text-sm px-4 py-2 rounded-full font-semibold"
              variant="secondary"
            >
              <Sparkles className="w-4 h-4 ml-2" />
              {t('hero.badge', language === 'ar' ? 'منصة رقمية متكاملة' : 'Complete Digital Platform')}
            </Badge>
          </motion.div>

          

          {/* Main Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="text-slate-900">
              {t('hero.titlePrefix', language === 'ar' ? 'نُحوّل أفكارك إلى ' : 'We turn ideas into ')}
            </span>
            <motion.span
              className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 bg-clip-text text-transparent relative"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 6,
                ease: 'linear',
                repeat: Infinity,
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              {t('hero.titleHighlight', language === 'ar' ? 'منتجات رقمية فعّالة' : 'effective digital products')}
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            {t('hero.description', 
              language === 'ar' 
                ? 'نقدم حلول تطوير الويب وتطبيقات الجوال وأنظمة ERP والذكاء الاصطناعي والأتمتة لتحويل رؤيتك إلى واقع رقمي متطور'
                : 'We provide web development, mobile apps, ERP systems, AI and automation solutions to transform your vision into advanced digital reality'
            )}
          </motion.p>

          {/* CTA Buttons - RTL/LTR responsive ordering */}
          <motion.div 
            variants={itemVariants}
            className={`flex flex-col lg:flex-row gap-4 justify-center items-center mb-16 ${
              language === 'ar' ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Subscribe Now Button */}
            <Link href="/services">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-sky-600 hover:text-sky-700 px-6 py-3 text-lg font-medium transition-all duration-300 group"
                  aria-label={language === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
                  data-testid="button-subscribe"
                >
                  <div className="flex items-center gap-2">
                    {language === 'ar' ? (
                      <>
                        <ArrowRight className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                        {t('hero.cta.subscribe')}
                      </>
                    ) : (
                      <>
                        {t('hero.cta.subscribe')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </Button>
              </motion.div>
            </Link>

            {/* Start Free Trial Button */}
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                  aria-label={language === 'ar' ? 'ابدأ تجربتك المجانية' : 'Start Your Free Trial'}
                  data-testid="button-free-trial"
                >
                  <motion.div 
                    className="flex items-center gap-2"
                    whileHover={{ x: language === 'ar' ? -3 : 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {language === 'ar' ? (
                      <>
                        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        {t('hero.cta.freeTrial', 'ابدأ تجربتك المجانية')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        {t('hero.cta.freeTrial', 'Start Your Free Trial')}
                      </>
                    )}
                  </motion.div>
                </Button>
              </motion.div>
            </Link>

            {/* Start Your Project Button */}
            <Link href="/contact">
              <motion.div
                whileHover={{ y: -2, x: language === 'ar' ? 2 : -2 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                  aria-label={language === 'ar' ? 'ابدأ مشروعك' : 'Start Your Project'}
                  data-testid="button-start-project"
                >
                  <motion.div 
                    className="flex items-center gap-2"
                    whileHover={{ x: language === 'ar' ? -3 : 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {language === 'ar' ? (
                      <>
                        <ArrowRight className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                        {t('hero.cta.startProject')}
                      </>
                    ) : (
                      <>
                        {t('hero.cta.startProject')}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.div>
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 text-slate-600"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-sky-500" />
              <span className="text-sm font-medium">
                {t('hero.trustedBy', language === 'ar' ? 'موثوق من قبل الشركات الرائدة' : 'Trusted by leading companies')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-500" />
              <span className="text-sm font-medium">
                {t('hero.response24h', language === 'ar' ? 'استجابة خلال 24 ساعة' : 'Response within 24 hours')}
              </span>
            </div>
          </motion.div>

          {/* Service Highlights Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {SERVICE_HIGHLIGHTS.map((service, index) => (
              <motion.div
                key={service.id}
                variants={serviceVariants}
                whileHover={{ 
                  y: -8,
                  scale: 1.05,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="group"
              >
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-sky-200 shadow-md hover:shadow-xl transition-all duration-500 h-full relative overflow-hidden">
                  {/* Card background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-sky-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  />

                  <CardContent className="p-0 relative z-10 text-center">
                    {/* Icon */}
                    <motion.div 
                      className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 text-sky-600 group-hover:bg-sky-200 transition-colors duration-300"
                      whileHover={{ 
                        rotate: 360,
                        transition: { duration: 0.6 }
                      }}
                    >
                      {service.icon}
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors duration-300">
                      {language === 'ar' ? service.title_ar : service.title_en}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {language === 'ar' ? service.desc_ar : service.desc_en}
                    </p>
                  </CardContent>

                  {/* Hover border effect */}
                  <motion.div
                    className="absolute inset-0 border-2 border-sky-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Optional scroll indicator */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 flex justify-center"
          >
            <motion.button
              onClick={() => {
                const ourWorkSection = document.getElementById('our-work');
                if (ourWorkSection) {
                  ourWorkSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-slate-400 hover:text-sky-500 transition-colors duration-300 group"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              aria-label={language === 'ar' ? 'انتقل إلى أعمالنا' : 'Scroll to our work'}
            >
              <ArrowRight 
                className={`w-6 h-6 ${language === 'ar' ? 'rotate-90' : 'rotate-90'} group-hover:translate-y-1 transition-transform`} 
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}