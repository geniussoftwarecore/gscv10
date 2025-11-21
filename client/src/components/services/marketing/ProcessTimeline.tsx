import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle,
  Target,
  Megaphone,
  BarChart3,
  CheckCircle,
  Sparkles,
  Clock,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessTimelineProps {
  className?: string;
}

interface ProcessStep {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  duration: string;
  durationAr: string;
  color: string;
  bgColor: string;
}

export function ProcessTimeline({ className }: ProcessTimelineProps) {
  const { lang, dir } = useLanguage();

  const steps: ProcessStep[] = [
    {
      id: 1,
      icon: MessageCircle,
      title: "Discovery & Consultation",
      titleAr: "الاستكشاف والاستشارة",
      description: "We analyze your business, target audience, and current marketing efforts to understand your unique needs",
      descriptionAr: "نحلل أعمالك والجمهور المستهدف والجهود التسويقية الحالية لفهم احتياجاتك الفريدة",
      duration: "1-2 Days",
      durationAr: "1-2 يوم",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      id: 2,
      icon: Target,
      title: "Strategy Development",
      titleAr: "تطوير الاستراتيجية",
      description: "Create a comprehensive marketing strategy with clear objectives, target audience, and KPIs",
      descriptionAr: "إنشاء استراتيجية تسويقية شاملة بأهداف واضحة والجمهور المستهدف ومؤشرات الأداء",
      duration: "3-5 Days",
      durationAr: "3-5 أيام",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    {
      id: 3,
      icon: Megaphone,
      title: "Campaign Creation",
      titleAr: "إنشاء الحملات",
      description: "Design and launch targeted campaigns across selected platforms with compelling content",
      descriptionAr: "تصميم وإطلاق حملات مستهدفة عبر المنصات المختارة مع محتوى جذاب",
      duration: "5-7 Days",
      durationAr: "5-7 أيام",
      color: "text-sky-600",
      bgColor: "bg-sky-100 dark:bg-sky-900/30"
    },
    {
      id: 4,
      icon: BarChart3,
      title: "Monitoring & Optimization",
      titleAr: "المراقبة والتحسين",
      description: "Continuously track performance, analyze data, and optimize campaigns for better results",
      descriptionAr: "مراقبة الأداء باستمرار وتحليل البيانات وتحسين الحملات للحصول على نتائج أفضل",
      duration: "Ongoing",
      durationAr: "مستمر",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      id: 5,
      icon: CheckCircle,
      title: "Results & Reporting",
      titleAr: "النتائج والتقارير",
      description: "Provide detailed reports on campaign performance and recommendations for future improvements",
      descriptionAr: "تقديم تقارير مفصلة عن أداء الحملات وتوصيات للتحسينات المستقبلية",
      duration: "Monthly",
      durationAr: "شهرياً",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30"
    },
    {
      id: 6,
      icon: Sparkles,
      title: "Scale & Expand",
      titleAr: "التوسع والنمو",
      description: "Scale successful campaigns and explore new marketing channels for continued growth",
      descriptionAr: "توسيع الحملات الناجحة واستكشاف قنوات تسويقية جديدة للنمو المستمر",
      duration: "3+ Months",
      durationAr: "3+ أشهر",
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/30"
    }
  ];

  return (
    <section className={cn("py-20 lg:py-32 bg-white dark:bg-gray-900", className)} id="process">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="text-sky-600 border-sky-200 bg-sky-50 dark:text-sky-400 dark:border-sky-800 dark:bg-sky-950/20 mb-4">
            <Clock className="w-4 h-4 mr-2" />
            {lang === 'ar' ? 'عملية العمل' : 'Our Process'}
          </Badge>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {lang === 'ar' ? 
              'كيف نحقق نجاحك التسويقي' :
              'How We Deliver Marketing Success'
            }
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {lang === 'ar' ? 
              'عملية مدروسة ومجربة لضمان تحقيق أفضل النتائج لحملاتك التسويقية' :
              'A proven, systematic process to ensure the best results for your marketing campaigns'
            }
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-200 via-blue-200 to-cyan-200 dark:from-sky-800 dark:via-blue-800 dark:to-cyan-800 hidden lg:block" />

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="relative"
              >
                {/* Step Number Circle */}
                <div className="absolute left-0 lg:left-6 w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm lg:text-base">
                    {step.id}
                  </span>
                </div>

                {/* Content Card */}
                <div className="ml-16 lg:ml-24">
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        {/* Icon */}
                        <div className={cn(
                          "flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center",
                          step.bgColor
                        )}>
                          <step.icon className={cn("w-7 h-7", step.color)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                              {lang === 'ar' ? step.titleAr : step.title}
                            </h3>
                            <Badge variant="secondary" className="ml-4">
                              <Clock className="w-3 h-3 mr-1" />
                              {lang === 'ar' ? step.durationAr : step.duration}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {lang === 'ar' ? step.descriptionAr : step.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">150+</div>
            <div className="text-gray-600 dark:text-gray-400">
              {lang === 'ar' ? 'عميل راضي' : 'Satisfied Clients'}
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">300+</div>
            <div className="text-gray-600 dark:text-gray-400">
              {lang === 'ar' ? 'حملة ناجحة' : 'Successful Campaigns'}
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">95%</div>
            <div className="text-gray-600 dark:text-gray-400">
              {lang === 'ar' ? 'معدل نجاح' : 'Success Rate'}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}