import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle,
  FileText,
  Palette,
  Eye,
  CheckCircle,
  Sparkles,
  Clock,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessTimelineProps {
  className?: string;
}

export function ProcessTimeline({ className }: ProcessTimelineProps) {
  const { lang, dir } = useLanguage();

  const steps = [
    {
      icon: MessageCircle,
      title: lang === 'ar' ? 'الاستشارة والتخطيط' : 'Consultation & Planning',
      duration: lang === 'ar' ? '1-2 يوم' : '1-2 Days',
      description: lang === 'ar' ? 
        'نبدأ بجلسة استشارية شاملة لفهم رؤيتك وأهدافك، ونضع استراتيجية واضحة للمشروع' :
        'We start with a comprehensive consultation session to understand your vision and goals, setting a clear project strategy',
      activities: lang === 'ar' ? 
        ['تحليل السوق والمنافسين', 'تحديد الجمهور المستهدف', 'وضع الميزانية والجدول الزمني', 'جمع المراجع والإلهام'] :
        ['Market and competitor analysis', 'Target audience identification', 'Budget and timeline setting', 'Reference and inspiration gathering'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FileText,
      title: lang === 'ar' ? 'البحث والمفهوم' : 'Research & Concept',
      duration: lang === 'ar' ? '2-3 أيام' : '2-3 Days',
      description: lang === 'ar' ? 
        'نطور المفاهيم الأولية والمود بورد، ونضع الأسس الإبداعية للمشروع' :
        'We develop initial concepts and mood boards, establishing the creative foundation for the project',
      activities: lang === 'ar' ? 
        ['تطوير المود بورد', 'اختيار لوحة الألوان', 'تحديد النمط البصري', 'إنشاء المفاهيم الأولية'] :
        ['Mood board development', 'Color palette selection', 'Visual style determination', 'Initial concept creation'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Palette,
      title: lang === 'ar' ? 'التصميم والتطوير' : 'Design & Development',
      duration: lang === 'ar' ? '5-7 أيام' : '5-7 Days',
      description: lang === 'ar' ? 
        'نبدأ في تصميم العناصر الأساسية للهوية البصرية بناءً على المفاهيم المعتمدة' :
        'We begin designing the core elements of the visual identity based on approved concepts',
      activities: lang === 'ar' ? 
        ['تصميم الشعار الأساسي', 'تطوير الهوية البصرية', 'إنشاء التطبيقات المختلفة', 'إعداد ملفات العمل'] :
        ['Primary logo design', 'Visual identity development', 'Various applications creation', 'Working files preparation'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Eye,
      title: lang === 'ar' ? 'المراجعة والتعديل' : 'Review & Refinement',
      duration: lang === 'ar' ? '2-3 أيام' : '2-3 Days',
      description: lang === 'ar' ? 
        'نعرض عليك التصاميم للمراجعة، ونجري التعديلات اللازمة حتى الوصول للنتيجة المثالية' :
        'We present the designs for your review and make necessary adjustments until achieving the perfect result',
      activities: lang === 'ar' ? 
        ['عرض التصاميم النهائية', 'استقبال الملاحظات', 'إجراء التعديلات', 'التأكد من جودة العمل'] :
        ['Final design presentation', 'Feedback collection', 'Implementing adjustments', 'Quality assurance'],
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: CheckCircle,
      title: lang === 'ar' ? 'التسليم والتوثيق' : 'Delivery & Documentation',
      duration: lang === 'ar' ? '1-2 يوم' : '1-2 Days',
      description: lang === 'ar' ? 
        'نسلم جميع الملفات النهائية مع دليل شامل للهوية البصرية وإرشادات الاستخدام' :
        'We deliver all final files with a comprehensive visual identity guide and usage instructions',
      activities: lang === 'ar' ? 
        ['تحضير الملفات النهائية', 'إنشاء دليل الهوية', 'تسليم جميع التطبيقات', 'تدريب الفريق (اختياري)'] :
        ['Final file preparation', 'Brand guide creation', 'All applications delivery', 'Team training (optional)'],
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  return (
    <section className={cn("py-20 bg-white dark:bg-gray-800", className)} id="process-section">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge 
            variant="secondary" 
            className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 px-4 py-2 text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {lang === 'ar' ? 'منهجية العمل' : 'Work Methodology'}
          </Badge>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {lang === 'ar' ? 'كيف نعمل معك؟' : 'How Do We Work With You?'}
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {lang === 'ar' ? 
              'نتبع منهجية واضحة ومنظمة لضمان تسليم مشروعك في الوقت المحدد وبأعلى معايير الجودة' :
              'We follow a clear and organized methodology to ensure your project is delivered on time with the highest quality standards'
            }
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 hidden lg:block"></div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute left-6 top-8 w-4 h-4 bg-white dark:bg-gray-800 border-4 border-blue-500 rounded-full hidden lg:block z-10"></div>
                
                <Card className="lg:ml-20 shadow-lg hover:shadow-xl transition-all duration-300 border-none bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Icon and header */}
                      <div className="flex-shrink-0">
                        <div className={cn(
                          "inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br text-white shadow-lg mb-4",
                          `bg-gradient-to-br ${step.color}`
                        )}>
                          <step.icon className="w-8 h-8" />
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs font-semibold">
                            {lang === 'ar' ? `المرحلة ${index + 1}` : `Step ${index + 1}`}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {step.duration}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-grow space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            {step.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                            {step.description}
                          </p>
                        </div>

                        {/* Activities */}
                        <div className="bg-white/50 dark:bg-gray-700/50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {lang === 'ar' ? 'الأنشطة الرئيسية:' : 'Key Activities:'}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {step.activities.map((activity, idx) => (
                              <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 flex-shrink-0" />
                                {activity}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                {lang === 'ar' ? 'مدة التنفيذ الإجمالية: 10-15 يوم عمل' : 'Total Execution Time: 10-15 Working Days'}
              </h3>
              <p className="text-indigo-100 leading-relaxed">
                {lang === 'ar' ? 
                  'نضمن لك تسليم مشروعك في الوقت المحدد مع إمكانية المتابعة والدعم لمدة شهر كامل بعد التسليم مجاناً' :
                  'We guarantee your project delivery on time with the possibility of follow-up and support for a full month after delivery for free'
                }
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}