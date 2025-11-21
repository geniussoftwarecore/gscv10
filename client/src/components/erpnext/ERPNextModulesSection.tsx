import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/lang";
import { 
  DollarSign, 
  Users, 
  Package, 
  ShoppingCart, 
  Factory, 
  BarChart3,
  Clock,
  FileText,
  Truck,
  Building,
  Smartphone,
  Globe,
  Shield,
  Zap,
  Award,
  Target,
  Settings
} from "lucide-react";

interface ERPModule {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: React.ComponentType<any>;
  features: string[];
  featuresEn: string[];
  color: string;
}

const erpModules: ERPModule[] = [
  {
    id: "accounting",
    name: "المحاسبة والمالية",
    nameEn: "Accounting & Finance",
    description: "إدارة شاملة للمحاسبة والتقارير المالية",
    descriptionEn: "Comprehensive accounting and financial reporting management",
    icon: DollarSign,
    color: "from-green-500 to-emerald-600",
    features: [
      "دفتر الحسابات العام",
      "إدارة الفواتير والمدفوعات",
      "التقارير المالية والضريبية", 
      "إدارة الأصول الثابتة",
      "المحاسبة التحليلية",
      "إدارة التكاليف"
    ],
    featuresEn: [
      "General Ledger",
      "Invoice & Payment Management",
      "Financial & Tax Reports",
      "Fixed Asset Management", 
      "Cost Accounting",
      "Budget Management"
    ]
  },
  {
    id: "hr",
    name: "إدارة الموارد البشرية",
    nameEn: "Human Resources",
    description: "إدارة كاملة للموظفين والرواتب والحضور",
    descriptionEn: "Complete employee, payroll and attendance management",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    features: [
      "إدارة الموظفين والملفات الشخصية",
      "نظام الرواتب والبدلات",
      "إدارة الحضور والانصراف",
      "إدارة الإجازات والطلبات",
      "تقييم الأداء والمهام",
      "التدريب والتطوير"
    ],
    featuresEn: [
      "Employee & Profile Management",
      "Payroll & Allowances System",
      "Attendance & Time Tracking",
      "Leave & Request Management",
      "Performance & Task Assessment",
      "Training & Development"
    ]
  },
  {
    id: "inventory",
    name: "إدارة المخزون",
    nameEn: "Inventory Management",
    description: "تتبع شامل للمخزون والمستودعات",
    descriptionEn: "Comprehensive inventory and warehouse tracking",
    icon: Package,
    color: "from-purple-500 to-purple-600",
    features: [
      "إدارة المستودعات المتعددة",
      "تتبع المخزون الفوري",
      "إدارة الباركود والرموز",
      "تحليل حركة المخزون",
      "تنبيهات إعادة الطلب",
      "تقارير الجرد الشاملة"
    ],
    featuresEn: [
      "Multi-Warehouse Management",
      "Real-time Inventory Tracking",
      "Barcode & Serial Management",
      "Inventory Movement Analysis",
      "Reorder Alerts",
      "Comprehensive Stock Reports"
    ]
  },
  {
    id: "sales",
    name: "إدارة المبيعات",
    nameEn: "Sales Management",
    description: "إدارة دورة المبيعات من العرض إلى التحصيل",
    descriptionEn: "Complete sales cycle management from quote to collection",
    icon: ShoppingCart,
    color: "from-orange-500 to-red-500",
    features: [
      "إدارة العملاء والعلاقات",
      "عروض الأسعار والطلبات",
      "متابعة الفرص التجارية",
      "إدارة قنوات البيع",
      "تحليل أداء المبيعات",
      "أتمتة عمليات البيع"
    ],
    featuresEn: [
      "Customer & Relationship Management",
      "Quotes & Order Processing",
      "Sales Opportunity Tracking",
      "Sales Channel Management",
      "Sales Performance Analysis",
      "Sales Process Automation"
    ]
  },
  {
    id: "manufacturing",
    name: "الإنتاج والتصنيع",
    nameEn: "Manufacturing",
    description: "تخطيط ومراقبة عمليات الإنتاج",
    descriptionEn: "Production planning and manufacturing process control",
    icon: Factory,
    color: "from-indigo-500 to-indigo-600",
    features: [
      "تخطيط الإنتاج والجدولة",
      "إدارة أوامر التصنيع",
      "مراقبة جودة الإنتاج",
      "إدارة المواد الخام",
      "تتبع التكاليف الإنتاجية",
      "تحليل كفاءة الإنتاج"
    ],
    featuresEn: [
      "Production Planning & Scheduling",
      "Manufacturing Order Management",
      "Production Quality Control",
      "Raw Material Management",
      "Production Cost Tracking",
      "Production Efficiency Analysis"
    ]
  },
  {
    id: "projects",
    name: "إدارة المشاريع",
    nameEn: "Project Management",
    description: "تخطيط وتنفيذ ومتابعة المشاريع",
    descriptionEn: "Project planning, execution and tracking",
    icon: BarChart3,
    color: "from-teal-500 to-teal-600",
    features: [
      "تخطيط المشاريع والمهام",
      "إدارة الفرق والموارد",
      "متابعة التقدم والإنجاز",
      "إدارة الميزانيات والتكاليف",
      "جدولة المشاريع الزمنية",
      "تقارير الأداء والإنتاجية"
    ],
    featuresEn: [
      "Project & Task Planning",
      "Team & Resource Management",
      "Progress & Completion Tracking",
      "Budget & Cost Management",
      "Project Timeline Scheduling",
      "Performance & Productivity Reports"
    ]
  }
];

const technicalFeatures = {
  ar: [
    {
      icon: Globe,
      title: "متاح على جميع المنصات",
      description: "يعمل على الويب والجوال وجميع أنظمة التشغيل"
    },
    {
      icon: Shield,
      title: "أمان متقدم",
      description: "تشفير البيانات ونسخ احتياطية آمنة"
    },
    {
      icon: Zap,
      title: "أداء سريع",
      description: "استجابة فورية وتحميل سريع للصفحات"
    },
    {
      icon: Settings,
      title: "قابلية التخصيص",
      description: "مرونة كاملة في التخصيص والتطوير"
    },
    {
      icon: Award,
      title: "معايير دولية",
      description: "يتبع أفضل الممارسات والمعايير الدولية"
    },
    {
      icon: Target,
      title: "تكامل شامل",
      description: "يتكامل مع جميع الأنظمة الخارجية"
    }
  ],
  en: [
    {
      icon: Globe,
      title: "Cross-Platform Available",
      description: "Works on web, mobile and all operating systems"
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Data encryption and secure backups"
    },
    {
      icon: Zap,
      title: "High Performance",
      description: "Instant response and fast page loading"
    },
    {
      icon: Settings,
      title: "Highly Customizable",
      description: "Complete flexibility in customization and development"
    },
    {
      icon: Award,
      title: "International Standards",
      description: "Follows best practices and international standards"
    },
    {
      icon: Target,
      title: "Complete Integration",
      description: "Integrates with all external systems"
    }
  ]
};

export default function ERPNextModulesSection() {
  const { dir, lang } = useLanguage();

  return (
    <section className="py-20 bg-white dark:bg-slate-900" dir={dir}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {lang === 'ar' ? '📊 وحدات ERPNext الشاملة' : '📊 Comprehensive ERPNext Modules'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {lang === 'ar' 
              ? 'نظام متكامل يغطي جميع احتياجات شركتك من المحاسبة إلى إدارة المشاريع'
              : 'Integrated system covering all your business needs from accounting to project management'
            }
          </p>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {erpModules.map((module, index) => {
            const IconComponent = module.icon;
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${module.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {lang === 'ar' ? module.name : module.nameEn}
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {lang === 'ar' ? module.description : module.descriptionEn}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(lang === 'ar' ? module.features : module.featuresEn).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${module.color} mt-2 flex-shrink-0`} />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Technical Features */}
        <motion.div 
          className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-3xl p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {lang === 'ar' ? '⚡ المميزات التقنية المتقدمة' : '⚡ Advanced Technical Features'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {lang === 'ar' 
                ? 'تقنيات حديثة ومتطورة تضمن الأداء الأمثل والأمان العالي'
                : 'Modern and advanced technologies ensuring optimal performance and high security'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(lang === 'ar' ? technicalFeatures.ar : technicalFeatures.en).map((feature, index) => {
              const IconComponent = feature.icon;
              
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Implementation Process */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            {lang === 'ar' ? '🛠️ عملية التنفيذ المتكاملة' : '🛠️ Comprehensive Implementation Process'}
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { 
                step: "1", 
                title: lang === 'ar' ? "تحليل المتطلبات" : "Requirements Analysis",
                description: lang === 'ar' ? "دراسة شاملة لاحتياجات شركتكم" : "Comprehensive study of your business needs"
              },
              { 
                step: "2", 
                title: lang === 'ar' ? "التنفيذ والإعداد" : "Implementation & Setup",
                description: lang === 'ar' ? "تهيئة النظام وفقاً لسير عملكم" : "System configuration according to your workflow"
              },
              { 
                step: "3", 
                title: lang === 'ar' ? "التدريب والتأهيل" : "Training & Qualification",
                description: lang === 'ar' ? "تدريب شامل لفريق العمل" : "Comprehensive team training"
              },
              { 
                step: "4", 
                title: lang === 'ar' ? "الدعم المستمر" : "Ongoing Support",
                description: lang === 'ar' ? "دعم فني وتحديثات مستمرة" : "Technical support and continuous updates"
              }
            ].map((phase, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                  {phase.step}
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {phase.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {phase.description}
                </p>
                
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent" 
                       style={{ width: 'calc(100% - 32px)', marginLeft: '16px' }} />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}