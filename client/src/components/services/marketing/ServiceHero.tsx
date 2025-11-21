import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Award, 
  Users, 
  ArrowDown,
  Star,
  CheckCircle,
  Target,
  Zap,
  Megaphone,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceHeroProps {
  onStartWizard: () => void;
  className?: string;
}

export function ServiceHero({ onStartWizard, className }: ServiceHeroProps) {
  const { lang, dir } = useLanguage();

  const stats = [
    {
      value: "300+",
      label: lang === 'ar' ? 'حملة تسويقية ناجحة' : 'Successful Campaigns',
      icon: TrendingUp
    },
    {
      value: "95%",
      label: lang === 'ar' ? 'معدل رضا العملاء' : 'Client Satisfaction',
      icon: Star
    },
    {
      value: "12+",
      label: lang === 'ar' ? 'سنة خبرة' : 'Years Experience',
      icon: Award
    },
    {
      value: "150+",
      label: lang === 'ar' ? 'عميل راضي' : 'Happy Clients',
      icon: Users
    }
  ];

  const highlights = [
    {
      icon: Target,
      text: lang === 'ar' ? 'استراتيجيات تسويقية مدروسة' : 'Strategic Marketing Plans'
    },
    {
      icon: Megaphone,
      text: lang === 'ar' ? 'إدارة شاملة للحملات الإعلانية' : 'Complete Ad Campaign Management'
    },
    {
      icon: BarChart3,
      text: lang === 'ar' ? 'تحليلات وتقارير مفصلة' : 'Detailed Analytics & Reports'
    },
    {
      icon: Zap,
      text: lang === 'ar' ? 'نتائج قابلة للقياس' : 'Measurable Results'
    }
  ];

  return (
    <section className={cn("relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-900 dark:to-cyan-900 py-20 lg:py-32", className)}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230ea5e9' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge variant="outline" className="text-sky-600 border-sky-200 bg-sky-50 dark:text-sky-400 dark:border-sky-800 dark:bg-sky-950/20 px-4 py-2">
                <Megaphone className="w-4 h-4 mr-2" />
                {lang === 'ar' ? 'التسويق الرقمي والإعلانات' : 'Digital Marketing & Advertising'}
              </Badge>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-6"
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                {lang === 'ar' ? (
                  <>
                    اجعل علامتك التجارية{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                      تتصدر
                    </span>{' '}
                    المشهد الرقمي
                  </>
                ) : (
                  <>
                    Make Your Brand{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                      Dominate
                    </span>{' '}
                    the Digital Space
                  </>
                )}
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                {lang === 'ar' ? 
                  'حلول تسويقية متكاملة تشمل إدارة وسائل التواصل الاجتماعي، الإعلانات المدفوعة، تحسين محركات البحث، وتحليل الأداء لضمان نمو مستدام لأعمالك' :
                  'Comprehensive marketing solutions including social media management, paid advertising, SEO optimization, and performance analytics to ensure sustainable business growth'
                }
              </p>
            </motion.div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <div className="flex-shrink-0 w-8 h-8 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center">
                    <highlight.icon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {highlight.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={onStartWizard}
                size="lg"
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group px-8 py-3"
                data-testid="button-start-wizard"
              >
                {lang === 'ar' ? 'احصل على خطة تسويقية' : 'Get Marketing Plan'}
                <ArrowDown className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform duration-300" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-sky-200 text-sky-700 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-400 dark:hover:bg-sky-950/20 px-8 py-3"
                data-testid="button-view-portfolio"
              >
                {lang === 'ar' ? 'عرض أعمالنا' : 'View Our Work'}
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-100 dark:border-sky-900/30"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}