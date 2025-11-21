import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Sparkles, 
  Award, 
  Users, 
  ArrowDown,
  Star,
  CheckCircle,
  Eye,
  Target,
  Zap
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
      value: "500+",
      label: lang === 'ar' ? 'هوية بصرية تم تصميمها' : 'Visual Identities Created',
      icon: Palette
    },
    {
      value: "98%",
      label: lang === 'ar' ? 'رضا العملاء' : 'Client Satisfaction',
      icon: Star
    },
    {
      value: "15+",
      label: lang === 'ar' ? 'سنة خبرة' : 'Years Experience',
      icon: Award
    },
    {
      value: "200+",
      label: lang === 'ar' ? 'عميل راضي' : 'Happy Clients',
      icon: Users
    }
  ];

  const highlights = [
    {
      icon: Eye,
      text: lang === 'ar' ? 'تصاميم احترافية تلفت الأنظار' : 'Professional Eye-Catching Designs'
    },
    {
      icon: Target,
      text: lang === 'ar' ? 'استراتيجية علامة تجارية متكاملة' : 'Complete Brand Strategy'
    },
    {
      icon: Zap,
      text: lang === 'ar' ? 'تسليم سريع وجودة عالية' : 'Fast Delivery & High Quality'
    },
    {
      icon: CheckCircle,
      text: lang === 'ar' ? 'دعم فني مستمر' : 'Ongoing Technical Support'
    }
  ];

  return (
    <section className={cn("relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-20 lg:py-32", className)}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
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
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                {lang === 'ar' ? 'خدمة مميزة' : 'Premium Service'}
              </Badge>
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight"
              >
                {lang === 'ar' ? (
                  <>
                    تصميم الجرافيكس والهوية 
                    <span className="block">البصرية</span>
                  </>
                ) : (
                  <>
                    Graphics Design &
                    <span className="block">Visual Identity</span>
                  </>
                )}
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-light"
              >
                {lang === 'ar' ? 
                  'نصنع هويات بصرية مميزة تعبر عن قيم علامتك التجارية وتترك انطباعاً لا يُنسى لدى عملائك' :
                  'We create distinctive visual identities that express your brand values and leave an unforgettable impression on your customers'
                }
              </motion.p>
            </div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <highlight.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-sm font-medium">{highlight.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                onClick={onStartWizard}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                data-testid="button-start-wizard"
              >
                {lang === 'ar' ? 'ابدأ مشروعك الآن' : 'Start Your Project Now'}
                <ArrowDown className={cn("w-5 h-5 ml-2", dir === 'rtl' && "mr-2 ml-0 rotate-180")} />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300"
                onClick={() => {
                  document.getElementById('portfolio-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                data-testid="button-view-portfolio"
              >
                {lang === 'ar' ? 'شاهد أعمالنا' : 'View Our Work'}
              </Button>
            </motion.div>
          </motion.div>

          {/* Visual Stats */}
          <motion.div
            initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl mb-4 shadow-lg">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-tight">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 dark:text-gray-500"
      >
        <ArrowDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
}