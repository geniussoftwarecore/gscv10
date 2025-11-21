import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { 
  TrendingUp,
  Users,
  DollarSign,
  Heart,
  BarChart3,
  Zap,
  Cloud,
  Shield,
  Cog,
  Headphones,
  Play,
  ExternalLink,
  Target,
  Rocket,
  Award,
  CheckCircle,
  TrendingDown,
  Clock,
  RefreshCw,
  FileText,
  Database,
  Lock
} from "lucide-react";
import { useState } from "react";

export function CRMShowcase() {
  const { dir } = useLanguage();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('features');

  // Statistics cards (top row)
  const statsCards = [
    {
      icon: TrendingUp,
      value: '+100%',
      label: dir === 'rtl' ? 'معدل النمو' : 'Growth Rate',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500'
    },
    {
      icon: BarChart3,
      value: '+85%',
      label: dir === 'rtl' ? 'نمو حجم العمليات' : 'Operations Growth',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500'
    },
    {
      icon: DollarSign,
      value: '50%',
      label: dir === 'rtl' ? 'نمو في الإيرادات' : 'Revenue Growth',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500'
    },
    {
      icon: Heart,
      value: '70%',
      label: dir === 'rtl' ? 'رضا العملاء' : 'Customer Satisfaction',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500'
    }
  ];

  // Content for each tab
  const tabContent = {
    features: {
      cards: [
        {
          icon: BarChart3,
          title: dir === 'rtl' ? 'تقارير تفاعلية متقدمة' : 'Advanced Interactive Reports',
          description: dir === 'rtl' ? 'رؤى شاملة لأداء عملك بتقارير مرئية تفاعلية وتحليلات عميقة' : 'Comprehensive insights with interactive visual reports and deep analytics',
          details: dir === 'rtl' ? [
            'تقارير مخصصة حسب احتياجاتك',
            'رسوم بيانية تفاعلية وديناميكية',
            'تصدير البيانات بصيغ متعددة',
            'تحديث لحظي للبيانات'
          ] : [
            'Custom reports for your needs',
            'Interactive dynamic charts',
            'Export data in multiple formats',
            'Real-time data updates'
          ],
          color: 'from-pink-500 to-pink-600',
          bgColor: 'bg-pink-500'
        },
        {
          icon: Zap,
          title: dir === 'rtl' ? 'تكامل سريع وسلس' : 'Fast & Seamless Integration',
          description: dir === 'rtl' ? 'اتصال فوري مع أنظمتك الحالية وتبادل البيانات بسلاسة تامة' : 'Instant connection with existing systems and smooth data exchange',
          details: dir === 'rtl' ? [
            'ربط مع أكثر من 50 نظام',
            'API موحد ومرن',
            'مزامنة تلقائية للبيانات',
            'إعداد سريع في دقائق'
          ] : [
            'Connect with 50+ systems',
            'Unified flexible API',
            'Automatic data sync',
            'Quick setup in minutes'
          ],
          color: 'from-green-500 to-green-600',
          bgColor: 'bg-green-500'
        },
        {
          icon: Cloud,
          title: dir === 'rtl' ? 'قواعد بيانات سحابية ذكية' : 'Smart Cloud Database',
          description: dir === 'rtl' ? 'تخزين آمن واسترجاع سريع لبياناتك من أي مكان في العالم' : 'Secure storage and fast retrieval from anywhere in the world',
          details: dir === 'rtl' ? [
            'نسخ احتياطي تلقائي يومي',
            'تشفير متقدم للبيانات',
            'وصول من أي جهاز',
            'سعة تخزين غير محدودة'
          ] : [
            'Daily automatic backups',
            'Advanced data encryption',
            'Access from any device',
            'Unlimited storage capacity'
          ],
          color: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-500'
        },
        {
          icon: Shield,
          title: dir === 'rtl' ? 'أمان بيانات متعدد المستويات' : 'Multi-Level Data Security',
          description: dir === 'rtl' ? 'حماية قوية متعددة الطبقات مع أعلى معايير الأمان العالمية' : 'Strong multi-layered protection with highest global security standards',
          details: dir === 'rtl' ? [
            'مصادقة ثنائية 2FA',
            'صلاحيات مخصصة للمستخدمين',
            'سجل كامل للأنشطة',
            'شهادات أمان دولية'
          ] : [
            'Two-factor authentication',
            'Custom user permissions',
            'Complete activity log',
            'International security certificates'
          ],
          color: 'from-purple-500 to-purple-600',
          bgColor: 'bg-purple-500'
        },
        {
          icon: Cog,
          title: dir === 'rtl' ? 'أتمتة ذكية للعمليات' : 'Smart Process Automation',
          description: dir === 'rtl' ? 'أتمتة كاملة للمهام المتكررة وتوفير الوقت والجهد والتكاليف' : 'Complete automation of repetitive tasks saving time, effort, and costs',
          details: dir === 'rtl' ? [
            'سير عمل قابل للتخصيص',
            'إشعارات تلقائية ذكية',
            'جدولة المهام المتقدمة',
            'توزيع العمل الآلي'
          ] : [
            'Customizable workflows',
            'Smart automatic notifications',
            'Advanced task scheduling',
            'Automatic work distribution'
          ],
          color: 'from-orange-500 to-orange-600',
          bgColor: 'bg-orange-500'
        },
        {
          icon: Headphones,
          title: dir === 'rtl' ? 'دعم فني محترف 24/7' : 'Professional 24/7 Support',
          description: dir === 'rtl' ? 'فريق دعم متخصص ومحترف متاح على مدار الساعة لمساعدتك' : 'Specialized professional support team available around the clock',
          details: dir === 'rtl' ? [
            'رد فوري على الاستفسارات',
            'فريق عربي متخصص',
            'تدريب مجاني شامل',
            'قاعدة معرفية واسعة'
          ] : [
            'Instant response to inquiries',
            'Specialized Arabic team',
            'Free comprehensive training',
            'Extensive knowledge base'
          ],
          color: 'from-orange-600 to-orange-700',
          bgColor: 'bg-orange-600'
        }
      ]
    },
    benefits: {
      cards: [
        {
          icon: Target,
          title: dir === 'rtl' ? 'زيادة الإنتاجية' : 'Increased Productivity',
          description: dir === 'rtl' ? 'تحسين كفاءة العمل وزيادة الإنتاجية بنسبة تصل إلى 200%' : 'Improve work efficiency and increase productivity up to 200%',
          details: dir === 'rtl' ? [
            'توفير 15 ساعة عمل أسبوعياً',
            'تقليل الأخطاء البشرية 90%',
            'سرعة إنجاز المعاملات 3x',
            'تحسين جودة العمل'
          ] : [
            'Save 15 work hours weekly',
            'Reduce human errors by 90%',
            'Transaction speed 3x faster',
            'Improved work quality'
          ],
          color: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-500'
        },
        {
          icon: DollarSign,
          title: dir === 'rtl' ? 'خفض التكاليف' : 'Cost Reduction',
          description: dir === 'rtl' ? 'تقليل التكاليف التشغيلية وزيادة العائد على الاستثمار' : 'Reduce operational costs and increase ROI',
          details: dir === 'rtl' ? [
            'توفير 40% من التكاليف',
            'لا حاجة لموظفين إضافيين',
            'تقليل استهلاك الموارد',
            'عائد استثمار خلال 6 أشهر'
          ] : [
            'Save 40% of costs',
            'No need for additional staff',
            'Reduced resource consumption',
            'ROI within 6 months'
          ],
          color: 'from-green-500 to-green-600',
          bgColor: 'bg-green-500'
        },
        {
          icon: Users,
          title: dir === 'rtl' ? 'تحسين تجربة العملاء' : 'Enhanced Customer Experience',
          description: dir === 'rtl' ? 'رفع مستوى رضا العملاء وبناء علاقات طويلة الأمد' : 'Elevate customer satisfaction and build long-term relationships',
          details: dir === 'rtl' ? [
            'استجابة أسرع للعملاء',
            'خدمة مخصصة لكل عميل',
            'متابعة دقيقة ومستمرة',
            'زيادة ولاء العملاء 60%'
          ] : [
            'Faster customer response',
            'Personalized service',
            'Accurate continuous follow-up',
            'Increase customer loyalty 60%'
          ],
          color: 'from-purple-500 to-purple-600',
          bgColor: 'bg-purple-500'
        },
        {
          icon: BarChart3,
          title: dir === 'rtl' ? 'قرارات مبنية على البيانات' : 'Data-Driven Decisions',
          description: dir === 'rtl' ? 'اتخاذ قرارات استراتيجية صحيحة بناءً على بيانات دقيقة' : 'Make strategic decisions based on accurate data',
          details: dir === 'rtl' ? [
            'تحليلات شاملة ومفصلة',
            'توقعات دقيقة للمستقبل',
            'رؤى استراتيجية واضحة',
            'تقليل المخاطر بنسبة 70%'
          ] : [
            'Comprehensive detailed analytics',
            'Accurate future predictions',
            'Clear strategic insights',
            'Reduce risks by 70%'
          ],
          color: 'from-pink-500 to-pink-600',
          bgColor: 'bg-pink-500'
        },
        {
          icon: Clock,
          title: dir === 'rtl' ? 'توفير الوقت' : 'Time Savings',
          description: dir === 'rtl' ? 'تسريع العمليات وتوفير وقت ثمين لفريق العمل' : 'Accelerate processes and save valuable team time',
          details: dir === 'rtl' ? [
            'أتمتة المهام الروتينية',
            'سير عمل مبسط وسريع',
            'تقليل وقت التدريب',
            'إنجاز أسرع بـ 5 مرات'
          ] : [
            'Automate routine tasks',
            'Simplified fast workflow',
            'Reduced training time',
            'Complete tasks 5x faster'
          ],
          color: 'from-orange-500 to-orange-600',
          bgColor: 'bg-orange-500'
        },
        {
          icon: Rocket,
          title: dir === 'rtl' ? 'نمو مستدام' : 'Sustainable Growth',
          description: dir === 'rtl' ? 'دعم نمو أعمالك بشكل مستدام وقابل للتوسع' : 'Support sustainable and scalable business growth',
          details: dir === 'rtl' ? [
            'قابلية توسع غير محدودة',
            'دعم النمو السريع',
            'مرونة في التطوير',
            'جاهز للمستقبل'
          ] : [
            'Unlimited scalability',
            'Support rapid growth',
            'Development flexibility',
            'Future-ready'
          ],
          color: 'from-indigo-500 to-indigo-600',
          bgColor: 'bg-indigo-500'
        }
      ]
    },
    results: {
      cards: [
        {
          icon: Award,
          title: dir === 'rtl' ? 'تحقيق الأهداف بنجاح' : 'Successfully Achieve Goals',
          description: dir === 'rtl' ? 'وصول سريع لأهدافك التجارية مع نتائج قابلة للقياس' : 'Rapidly reach business objectives with measurable results',
          details: dir === 'rtl' ? [
            'تحقيق الأهداف خلال 3 أشهر',
            'نمو سنوي مضاعف',
            'تحسن ملموس في الأداء',
            'رضا العملاء +95%'
          ] : [
            'Achieve goals within 3 months',
            'Double annual growth',
            'Tangible performance improvement',
            'Customer satisfaction +95%'
          ],
          color: 'from-yellow-500 to-yellow-600',
          bgColor: 'bg-yellow-500'
        },
        {
          icon: CheckCircle,
          title: dir === 'rtl' ? 'عمليات أكثر كفاءة' : 'More Efficient Operations',
          description: dir === 'rtl' ? 'تحسين جميع العمليات التشغيلية وتبسيط سير العمل' : 'Improve all operational processes and streamline workflow',
          details: dir === 'rtl' ? [
            'كفاءة تشغيلية +80%',
            'تقليل الهدر والفاقد',
            'تنظيم محكم للعمل',
            'جودة عالية مستمرة'
          ] : [
            'Operational efficiency +80%',
            'Reduced waste and loss',
            'Tight work organization',
            'Consistent high quality'
          ],
          color: 'from-green-500 to-green-600',
          bgColor: 'bg-green-500'
        },
        {
          icon: TrendingUp,
          title: dir === 'rtl' ? 'زيادة الأرباح' : 'Increased Profits',
          description: dir === 'rtl' ? 'تحسين الأرباح وزيادة العائدات بشكل ملحوظ ومستدام' : 'Improve profits and significantly increase sustainable revenues',
          details: dir === 'rtl' ? [
            'زيادة الإيرادات 50%+',
            'هامش ربح أفضل',
            'تدفق نقدي محسّن',
            'ربحية مستدامة'
          ] : [
            'Revenue increase 50%+',
            'Better profit margins',
            'Improved cash flow',
            'Sustainable profitability'
          ],
          color: 'from-emerald-500 to-emerald-600',
          bgColor: 'bg-emerald-500'
        },
        {
          icon: Heart,
          title: dir === 'rtl' ? 'ولاء العملاء' : 'Customer Loyalty',
          description: dir === 'rtl' ? 'بناء قاعدة عملاء مخلصين وزيادة معدل الاحتفاظ بهم' : 'Build loyal customer base and increase retention rate',
          details: dir === 'rtl' ? [
            'معدل احتفاظ 85%+',
            'عملاء دائمون ومخلصون',
            'توصيات إيجابية',
            'سمعة ممتازة'
          ] : [
            'Retention rate 85%+',
            'Permanent loyal customers',
            'Positive recommendations',
            'Excellent reputation'
          ],
          color: 'from-red-500 to-red-600',
          bgColor: 'bg-red-500'
        },
        {
          icon: Database,
          title: dir === 'rtl' ? 'بيانات منظمة ودقيقة' : 'Organized Accurate Data',
          description: dir === 'rtl' ? 'قاعدة بيانات شاملة ومنظمة بدقة عالية وسهلة الوصول' : 'Comprehensive organized database with high accuracy and easy access',
          details: dir === 'rtl' ? [
            'دقة بيانات 99.9%',
            'سهولة استرجاع المعلومات',
            'تنظيم احترافي',
            'تقارير شاملة فورية'
          ] : [
            'Data accuracy 99.9%',
            'Easy information retrieval',
            'Professional organization',
            'Instant comprehensive reports'
          ],
          color: 'from-cyan-500 to-cyan-600',
          bgColor: 'bg-cyan-500'
        },
        {
          icon: RefreshCw,
          title: dir === 'rtl' ? 'تحسين مستمر' : 'Continuous Improvement',
          description: dir === 'rtl' ? 'نمو وتطور مستمر مع تحديثات دورية وميزات جديدة' : 'Continuous growth with regular updates and new features',
          details: dir === 'rtl' ? [
            'تحديثات شهرية مجانية',
            'ميزات جديدة باستمرار',
            'تحسينات دورية',
            'مواكبة أحدث التقنيات'
          ] : [
            'Free monthly updates',
            'Continuous new features',
            'Regular improvements',
            'Latest technology updates'
          ],
          color: 'from-violet-500 to-violet-600',
          bgColor: 'bg-violet-500'
        }
      ]
    }
  };

  const tabs = [
    { 
      id: 'features', 
      label: dir === 'rtl' ? 'الميزات' : 'Features',
      icon: Zap
    },
    { 
      id: 'benefits', 
      label: dir === 'rtl' ? 'الفائدة' : 'Benefits',
      icon: Target
    },
    { 
      id: 'results', 
      label: dir === 'rtl' ? 'النتائج' : 'Results',
      icon: Award
    }
  ];

  const currentCards = tabContent[activeTab as keyof typeof tabContent].cards;

  return (
    <section className="py-20 bg-gradient-to-br from-[#2d4a7c] via-[#3d5a8c] to-[#4d6a9c] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg width="60" height="60" viewBox="0 0 60 60" className="absolute top-0 left-0 fill-current text-white">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Users className="w-4 h-4" />
            {dir === 'rtl' ? 'نظام إدارة متكامل' : 'Integrated Management System'}
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {dir === 'rtl' 
              ? 'نظام إدارة العملاء الذي نسرّع نمو أعمالك'
              : 'The CRM System That Accelerates Your Business Growth'
            }
          </motion.h2>
          <motion.p
            className="text-lg text-white/80"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {dir === 'rtl' 
              ? 'حلول شاملة لإدارة أعمالك ومعلوماتك وعملائك، مع أفضل المعايير التقنية'
              : 'Comprehensive solutions for managing your business, data, and customers with the best technical standards'
            }
          </motion.p>
        </motion.div>

        {/* Statistics Cards (Top Row) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {statsCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 overflow-hidden group hover:bg-white/15 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`stat-card-${index}`}
              >
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                    stat.bgColor
                  )}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <motion.div
          className="flex justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {tabs.map((tab, tabIndex) => {
            const TabIcon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 overflow-hidden",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#2d4a7c] shadow-lg shadow-yellow-500/30"
                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + tabIndex * 0.1 }}
                viewport={{ once: true }}
                data-testid={`tab-${tab.id}`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500"
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className="w-2 h-2 bg-[#2d4a7c] rounded-full"
                    />
                  )}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Feature Cards Grid (Bottom Section) - Animated content change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="grid md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {currentCards.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={`${activeTab}-${index}`}
                  className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 overflow-hidden group"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  data-testid={`feature-card-${index}`}
                >
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                      feature.color
                    )}
                    initial={false}
                  />

                  {/* Animated corner decoration */}
                  <motion.div
                    className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  />

                  {/* Icon */}
                  <motion.div 
                    className="relative z-10 mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300",
                      feature.bgColor
                    )}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-white/90 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300 mb-4">
                      {feature.description}
                    </p>
                    
                    {/* Details list */}
                    <div className="space-y-2 mt-4">
                      {feature.details.map((detail, detailIndex) => (
                        <motion.div
                          key={detailIndex}
                          className="flex items-start gap-2 text-white/60 text-xs"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 + detailIndex * 0.05 }}
                        >
                          <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-400" />
                          <span className="leading-relaxed">{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom indicator dot */}
                  <motion.div
                    className={cn("absolute bottom-4 left-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300", feature.bgColor)}
                    initial={false}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            className="bg-white text-[#2d4a7c] hover:bg-white/90 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            data-testid="crm-primary-cta"
          >
            <Play className={cn(
              "w-5 h-5 group-hover:scale-110 transition-transform",
              dir === 'rtl' ? 'ml-2' : 'mr-2'
            )} />
            {dir === 'rtl' ? 'ابدأ تجربتك المجانية' : 'Start Free Trial'}
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl transition-all duration-300 group backdrop-blur-sm"
            data-testid="crm-secondary-cta"
          >
            <ExternalLink className={cn(
              "w-5 h-5 group-hover:scale-110 transition-transform",
              dir === 'rtl' ? 'ml-2' : 'mr-2'
            )} />
            {dir === 'rtl' ? 'تواصل معنا' : 'Contact Us'}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
