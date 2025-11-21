import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/lang";
import { SEOHead } from "@/components/SEOHead";
import ERPNextPricingSection from "@/components/erpnext/ERPNextPricingSection";
import ERPNextModulesSection from "@/components/erpnext/ERPNextModulesSection";
import { useLocation } from "wouter";
import { 
  ArrowRight, 
  CheckCircle, 
  Star,
  Users,
  Globe,
  Shield,
  Zap,
  Award,
  TrendingUp,
  BarChart3,
  Building,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const highlights = {
  ar: [
    {
      icon: TrendingUp,
      title: "أداء محسّن بنسبة 40%",
      description: "تسريع توليد التقارير المالية والعمليات الحسابية"
    },
    {
      icon: Shield,
      title: "أمان عالي المستوى",
      description: "تشفير البيانات ونسخ احتياطية آمنة متقدمة"
    },
    {
      icon: Globe,
      title: "واجهة Espresso الجديدة",
      description: "تصميم أكثر وضوحاً وسرعة في التنقل"
    },
    {
      icon: BarChart3,
      title: "تحليلات ذكية متقدمة",
      description: "إحصائيات وتقارير تفاعلية في الوقت الفعلي"
    }
  ],
  en: [
    {
      icon: TrendingUp,
      title: "40% Performance Boost",
      description: "Faster financial report generation and calculations"
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "Advanced data encryption and secure backups"
    },
    {
      icon: Globe,
      title: "New Espresso UI",
      description: "Cleaner design with faster navigation"
    },
    {
      icon: BarChart3,
      title: "Advanced Smart Analytics",
      description: "Interactive statistics and real-time reports"
    }
  ]
};

const statsData = {
  ar: [
    { value: "500+", label: "شركة تثق بنا", icon: Building },
    { value: "99.9%", label: "وقت التشغيل", icon: Clock },
    { value: "24/7", label: "دعم فني", icon: Users },
    { value: "15+", label: "سنة خبرة", icon: Award }
  ],
  en: [
    { value: "500+", label: "Companies Trust Us", icon: Building },
    { value: "99.9%", label: "Uptime", icon: Clock },
    { value: "24/7", label: "Technical Support", icon: Users },
    { value: "15+", label: "Years Experience", icon: Award }
  ]
};

export default function ERPNextPage() {
  const { dir, lang } = useLanguage();
  const [, setLocation] = useLocation();

  const handleContactUs = () => {
    setLocation('/contact?service=erpnext');
  };

  const handleBookDemo = () => {
    setLocation('/contact?service=erpnext&type=demo');
  };

  return (
    <>
      <SEOHead 
        title={lang === 'ar' ? 'نظام ERPNext v15 - إدارة موارد المؤسسات' : 'ERPNext v15 - Enterprise Resource Planning'}
        description={lang === 'ar' 
          ? 'نظام تخطيط موارد مؤسسي شامل مع باقات احترافية ومميزات متقدمة. اشتراكات شهرية وسنوية مع خصومات مميزة.'
          : 'Comprehensive enterprise resource planning system with professional packages and advanced features. Monthly and annual subscriptions with attractive discounts.'
        }
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" dir={dir}>
        
        {/* Hero Section */}
        <section className="relative py-12 lg:py-16 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-gray-100/30 bg-[size:32px_32px] opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-blue-600/5" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              
              {/* Content */}
              <motion.div
                className="text-center lg:text-left space-y-6"
                initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    ERPNext v15
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {lang === 'ar' ? 'الإصدار الأحدث' : 'Latest Version'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    {lang === 'ar' 
                      ? 'نظام ERPNext المتكامل'
                      : 'Complete ERPNext System'
                    }
                  </motion.h1>
                  
                  <motion.p
                    className="text-xl md:text-2xl text-primary font-medium leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    {lang === 'ar' 
                      ? 'حلول متكاملة لإدارة موارد المؤسسات'
                      : 'Integrated Enterprise Resource Planning Solutions'
                    }
                  </motion.p>
                  
                  <motion.p
                    className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    {lang === 'ar'
                      ? 'أحدث إصدار من ERPNext مع تحسينات جذرية وباقات شاملة تناسب جميع أحجام الأعمال من الشركات الناشئة إلى المؤسسات الكبيرة.'
                      : 'Latest ERPNext version with revolutionary improvements and comprehensive packages suitable for all business sizes, from startups to large enterprises.'
                    }
                  </motion.p>
                </div>

                {/* CTA Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={handleContactUs}
                  >
                    {lang === 'ar' ? 'احصل على عرض سعر' : 'Get Quote'}
                    <ArrowRight className={cn(
                      "w-5 h-5",
                      dir === 'rtl' ? "mr-2 rotate-180" : "ml-2"
                    )} />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleBookDemo}
                  >
                    {lang === 'ar' ? 'حجز عرض تجريبي' : 'Book Demo'}
                  </Button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div 
                  className="flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-600 dark:text-gray-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{lang === 'ar' ? 'ضمان 30 يوم' : '30-day Guarantee'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{lang === 'ar' ? 'تنفيذ مجاني' : 'Free Setup'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{lang === 'ar' ? 'دعم 24/7' : '24/7 Support'}</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Statistics */}
              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {(lang === 'ar' ? statsData.ar : statsData.en).map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50 dark:border-slate-700/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    >
                      <IconComponent className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {stat.label}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {lang === 'ar' ? '✨ مميزات ERPNext v15 الجديدة' : '✨ New ERPNext v15 Features'}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {lang === 'ar'
                  ? 'تحسينات جذرية وميزات متطورة تجعل إدارة أعمالك أكثر سهولة وفعالية'
                  : 'Revolutionary improvements and advanced features making your business management easier and more effective'
                }
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(lang === 'ar' ? highlights.ar : highlights.en).map((highlight, index) => {
                const IconComponent = highlight.icon;
                
                return (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {highlight.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <ERPNextModulesSection />

        {/* Pricing Section */}
        <ERPNextPricingSection />

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-blue-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {lang === 'ar' ? 'ابدأ رحلتك الرقمية اليوم' : 'Start Your Digital Journey Today'}
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                {lang === 'ar'
                  ? 'احصل على استشارة مجانية من خبراء ERPNext لتحديد الباقة المناسبة وخطة التنفيذ'
                  : 'Get free consultation from ERPNext experts to determine the right package and implementation plan'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={handleContactUs}
                >
                  {lang === 'ar' ? 'احجز استشارة مجانية' : 'Book Free Consultation'}
                  <ArrowRight className={cn(
                    "w-5 h-5",
                    dir === 'rtl' ? "mr-2 rotate-180" : "ml-2"
                  )} />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                  onClick={handleBookDemo}
                >
                  {lang === 'ar' ? 'شاهد عرض تجريبي' : 'Watch Demo'}
                </Button>
              </div>
              <p className="text-blue-100 mt-6 text-sm">
                {lang === 'ar' ? '✅ عرض سعر مخصص خلال 24 ساعة • ✅ ضمان استرداد 30 يوم • ✅ دعم فني مجاني' : '✅ Custom quote within 24 hours • ✅ 30-day money back guarantee • ✅ Free technical support'}
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}