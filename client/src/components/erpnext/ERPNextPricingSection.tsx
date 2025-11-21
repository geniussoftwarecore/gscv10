import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/i18n/lang";
import { cn } from "@/lib/utils";
import { 
  Check, 
  Star, 
  Users, 
  Database, 
  Shield, 
  Globe, 
  Smartphone,
  Clock,
  Award,
  Zap,
  Crown,
  Building,
  ArrowRight
} from "lucide-react";

interface PricingTier {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: React.ComponentType<any>;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyDiscount: number;
  users: string;
  usersEn: string;
  popular?: boolean;
  enterprise?: boolean;
  features: string[];
  featuresEn: string[];
  technicalSpecs: string[];
  technicalSpecsEn: string[];
  includes: string[];
  includesEn: string[];
}

const pricingTiers: PricingTier[] = [
  {
    id: "essential",
    name: "باقة الأعمال الصغيرة",
    nameEn: "Small Business Package",
    description: "مثالية للشركات الناشئة والأعمال الصغيرة",
    descriptionEn: "Perfect for startups and small businesses",
    icon: Users,
    monthlyPrice: 2500,
    yearlyPrice: 24000,
    yearlyDiscount: 20,
    users: "حتى 10 مستخدمين",
    usersEn: "Up to 10 users",
    features: [
      "إدارة المحاسبة الأساسية",
      "إدارة العملاء والموردين", 
      "إدارة المخزون الأساسية",
      "تقارير مالية شهرية",
      "إدارة المبيعات والمشتريات",
      "دعم فني أساسي"
    ],
    featuresEn: [
      "Basic Accounting Management",
      "Customer & Supplier Management",
      "Basic Inventory Management", 
      "Monthly Financial Reports",
      "Sales & Purchase Management",
      "Basic Technical Support"
    ],
    technicalSpecs: [
      "2 vCPU، 4-8 جيجا RAM",
      "40+ جيجا SSD",
      "ويب + تطبيق جوال أساسي",
      "SSL أساسي + نسخ احتياطية يومية"
    ],
    technicalSpecsEn: [
      "2 vCPU, 4-8 GB RAM",
      "40+ GB SSD", 
      "Web + Basic Mobile App",
      "Basic SSL + Daily Backups"
    ],
    includes: [
      "تنفيذ وإعداد النظام",
      "تدريب أساسي للفريق",
      "دعم فني لمدة 3 أشهر"
    ],
    includesEn: [
      "System Implementation & Setup",
      "Basic Team Training",
      "3 Months Technical Support"
    ]
  },
  {
    id: "professional", 
    name: "باقة الأعمال المتوسطة",
    nameEn: "Growing Business Package",
    description: "مناسبة للشركات المتوسطة النمو",
    descriptionEn: "Suitable for medium-sized growing companies",
    icon: Building,
    monthlyPrice: 6500,
    yearlyPrice: 62400,
    yearlyDiscount: 20,
    users: "11-50 مستخدم",
    usersEn: "11-50 users",
    popular: true,
    features: [
      "جميع مميزات الباقة الأساسية",
      "إدارة الموارد البشرية",
      "إدارة المشاريع وتتبع المهام",
      "تقارير متقدمة وتحليلات ذكية",
      "إدارة الجودة والمطابقة",
      "نظام نقاط البيع (POS)",
      "التكامل مع البنوك",
      "أتمتة سير العمل",
      "دعم فني محسن (24/5)"
    ],
    featuresEn: [
      "All Basic Package Features",
      "Human Resource Management",
      "Project Management & Task Tracking",
      "Advanced Reports & Smart Analytics", 
      "Quality Management & Compliance",
      "Point of Sale (POS) System",
      "Bank Integration",
      "Workflow Automation",
      "Enhanced Technical Support (24/5)"
    ],
    technicalSpecs: [
      "4 vCPU، 8-16 جيجا RAM",
      "80+ جيجا SSD",
      "ويب + تطبيق جوال متقدم + API",
      "SSL متقدم + تشفير البيانات"
    ],
    technicalSpecsEn: [
      "4 vCPU, 8-16 GB RAM",
      "80+ GB SSD",
      "Web + Advanced Mobile App + API", 
      "Advanced SSL + Data Encryption"
    ],
    includes: [
      "تنفيذ شامل ومخصص",
      "تدريب متقدم للفريق",
      "دعم فني لمدة 6 أشهر",
      "استشارة مجانية شهرية"
    ],
    includesEn: [
      "Comprehensive Custom Implementation",
      "Advanced Team Training", 
      "6 Months Technical Support",
      "Free Monthly Consultation"
    ]
  },
  {
    id: "enterprise",
    name: "باقة المؤسسات",
    nameEn: "Enterprise Package", 
    description: "للمؤسسات الكبيرة والشركات متعددة الفروع",
    descriptionEn: "For large organizations and multi-branch companies",
    icon: Crown,
    monthlyPrice: 15000,
    yearlyPrice: 144000,
    yearlyDiscount: 20,
    users: "50+ مستخدم",
    usersEn: "50+ users",
    enterprise: true,
    features: [
      "جميع مميزات الباقات السابقة",
      "إدارة متعددة الشركات والفروع",
      "تحليلات الأعمال المتقدمة (BI)",
      "تكامل مع أنظمة خارجية",
      "إدارة سلسلة التوريد المتقدمة",
      "التخطيط والتنبؤ المالي",
      "تسجيل الدخول الموحد (SSO)",
      "إدارة الصلاحيات المتقدمة",
      "تخصيصات حسب الطلب",
      "دعم فني مخصص (24/7)",
      "مدير حساب مخصص",
      "اتفاقية مستوى الخدمة (SLA)"
    ],
    featuresEn: [
      "All Previous Package Features",
      "Multi-Company & Branch Management",
      "Advanced Business Intelligence (BI)",
      "Integration with External Systems",
      "Advanced Supply Chain Management", 
      "Financial Planning & Forecasting",
      "Single Sign-On (SSO)",
      "Advanced Permission Management",
      "Custom Development",
      "Dedicated Technical Support (24/7)",
      "Dedicated Account Manager",
      "Service Level Agreement (SLA)"
    ],
    technicalSpecs: [
      "8+ vCPU، 16-32 جيجا RAM",
      "160+ جيجا SSD",
      "ويب + تطبيق جوال مخصص + API كامل",
      "أمان مؤسسي متقدم + تشفير شامل",
      "99.9% uptime مضمون"
    ],
    technicalSpecsEn: [
      "8+ vCPU, 16-32 GB RAM",
      "160+ GB SSD",
      "Web + Custom Mobile App + Full API",
      "Advanced Enterprise Security + Complete Encryption",
      "99.9% guaranteed uptime"
    ],
    includes: [
      "تنفيذ مؤسسي شامل",
      "تدريب إداري متخصص",
      "دعم فني مدى الحياة",
      "استشارات أسبوعية",
      "تطويرات مخصصة",
      "تكامل أنظمة خارجية"
    ],
    includesEn: [
      "Comprehensive Enterprise Implementation",
      "Specialized Administrative Training",
      "Lifetime Technical Support", 
      "Weekly Consultations",
      "Custom Development",
      "External Systems Integration"
    ]
  }
];

export default function ERPNextPricingSection() {
  const { dir, lang } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPrice = (tier: PricingTier) => {
    if (isYearly) {
      const monthlyEquivalent = tier.yearlyPrice / 12;
      return {
        price: formatPrice(monthlyEquivalent),
        total: formatPrice(tier.yearlyPrice),
        savings: tier.yearlyDiscount
      };
    }
    return {
      price: formatPrice(tier.monthlyPrice),
      total: null,
      savings: 0
    };
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" dir={dir}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {lang === 'ar' ? 'باقات ERPNext الاحترافية' : 'Professional ERPNext Packages'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {lang === 'ar' 
              ? 'اختر الباقة المناسبة لحجم عملك واحتياجاتك. جميع الباقات تشمل تنفيذ كامل وتدريب شامل'
              : 'Choose the right package for your business size and needs. All packages include complete implementation and comprehensive training'
            }
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={cn(
              "text-sm font-medium transition-colors",
              !isYearly ? "text-primary" : "text-gray-500"
            )}>
              {lang === 'ar' ? 'شهري' : 'Monthly'}
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <span className={cn(
              "text-sm font-medium transition-colors",
              isYearly ? "text-primary" : "text-gray-500"
            )}>
              {lang === 'ar' ? 'سنوي' : 'Annual'}
            </span>
            {isYearly && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {lang === 'ar' ? 'وفر 20%' : 'Save 20%'}
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier, index) => {
            const pricing = getPrice(tier);
            const IconComponent = tier.icon;
            
            return (
              <motion.div
                key={tier.id}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-white px-4 py-1 text-sm font-medium">
                      <Star className="w-4 h-4 mr-1" />
                      {lang === 'ar' ? 'الأكثر شيوعاً' : 'Most Popular'}
                    </Badge>
                  </div>
                )}

                <Card className={cn(
                  "h-full transition-all duration-300 hover:shadow-xl",
                  tier.popular && "ring-2 ring-primary shadow-lg scale-105",
                  tier.enterprise && "bg-gradient-to-b from-slate-900 to-slate-800 text-white border-slate-700"
                )}>
                  <CardHeader className="text-center pb-4">
                    <div className="mb-4">
                      <div className={cn(
                        "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4",
                        tier.enterprise 
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                          : tier.popular 
                            ? "bg-gradient-to-r from-primary to-blue-600"
                            : "bg-gradient-to-r from-gray-400 to-gray-600"
                      )}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <CardTitle className={cn(
                      "text-2xl font-bold mb-2",
                      tier.enterprise ? "text-white" : "text-gray-900 dark:text-white"
                    )}>
                      {lang === 'ar' ? tier.name : tier.nameEn}
                    </CardTitle>

                    <p className={cn(
                      "text-sm mb-4",
                      tier.enterprise ? "text-gray-300" : "text-gray-600 dark:text-gray-300"
                    )}>
                      {lang === 'ar' ? tier.description : tier.descriptionEn}
                    </p>

                    <div className="mb-4">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className={cn(
                          "text-3xl font-bold",
                          tier.enterprise ? "text-yellow-400" : "text-primary"
                        )}>
                          {pricing.price}
                        </span>
                        <span className={cn(
                          "text-sm",
                          tier.enterprise ? "text-gray-300" : "text-gray-600 dark:text-gray-400"
                        )}>
                          /{lang === 'ar' ? 'شهر' : 'month'}
                        </span>
                      </div>
                      
                      {isYearly && pricing.total && (
                        <div className="mt-2">
                          <p className={cn(
                            "text-sm",
                            tier.enterprise ? "text-gray-300" : "text-gray-600 dark:text-gray-400"
                          )}>
                            {pricing.total} {lang === 'ar' ? 'سنوياً' : 'annually'}
                          </p>
                          <p className="text-green-600 font-medium text-sm">
                            {lang === 'ar' ? `وفر ${pricing.savings}%` : `Save ${pricing.savings}%`}
                          </p>
                        </div>
                      )}
                    </div>

                    <Badge variant="outline" className={cn(
                      "mb-4",
                      tier.enterprise ? "border-yellow-400 text-yellow-400" : ""
                    )}>
                      {lang === 'ar' ? tier.users : tier.usersEn}
                    </Badge>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Features */}
                    <div>
                      <h4 className={cn(
                        "font-semibold mb-3 text-sm uppercase tracking-wide",
                        tier.enterprise ? "text-yellow-400" : "text-primary"
                      )}>
                        {lang === 'ar' ? 'المميزات الأساسية' : 'Core Features'}
                      </h4>
                      <ul className="space-y-2">
                        {(lang === 'ar' ? tier.features : tier.featuresEn).slice(0, 6).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Check className={cn(
                              "w-4 h-4 mt-0.5 flex-shrink-0",
                              tier.enterprise ? "text-yellow-400" : "text-green-500"
                            )} />
                            <span className={tier.enterprise ? "text-gray-300" : "text-gray-700 dark:text-gray-300"}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                      
                      {(lang === 'ar' ? tier.features : tier.featuresEn).length > 6 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2 p-0 h-auto font-normal text-xs"
                          onClick={() => setSelectedTier(selectedTier === tier.id ? null : tier.id)}
                        >
                          {selectedTier === tier.id 
                            ? (lang === 'ar' ? 'إخفاء التفاصيل' : 'Hide Details')
                            : lang === 'ar' 
                              ? `+${tier.features.length - 6} مميزات أخرى` 
                              : `+${tier.featuresEn.length - 6} more features`
                          }
                        </Button>
                      )}
                      
                      <AnimatePresence>
                        {selectedTier === tier.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ul className="space-y-2 mt-3">
                              {(lang === 'ar' ? tier.features : tier.featuresEn).slice(6).map((feature, idx) => (
                                <li key={idx + 6} className="flex items-start gap-2 text-sm">
                                  <Check className={cn(
                                    "w-4 h-4 mt-0.5 flex-shrink-0",
                                    tier.enterprise ? "text-yellow-400" : "text-green-500"
                                  )} />
                                  <span className={tier.enterprise ? "text-gray-300" : "text-gray-700 dark:text-gray-300"}>
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* CTA Button */}
                    <Button 
                      className={cn(
                        "w-full",
                        tier.enterprise 
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
                          : tier.popular
                            ? "bg-primary hover:bg-primary/90"
                            : "bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                      )}
                      size="lg"
                    >
                      {lang === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                      <ArrowRight className={cn(
                        "w-4 h-4",
                        dir === 'rtl' ? "mr-2 rotate-180" : "ml-2"
                      )} />
                    </Button>

                    <p className={cn(
                      "text-xs text-center",
                      tier.enterprise ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
                    )}>
                      {lang === 'ar' ? 'تنفيذ مجاني • دعم فني • ضمان 30 يوم' : 'Free Setup • Technical Support • 30-day Guarantee'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Special Offers Section */}
        <motion.div 
          className="bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {lang === 'ar' ? '🎁 عروض إطلاق محدودة' : '🎁 Limited Launch Offers'}
          </h3>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center justify-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              <span className="font-medium">
                {lang === 'ar' ? 'خصم 25% للدفع المقدم' : '25% Early Payment Discount'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              <span className="font-medium">
                {lang === 'ar' ? '3 أشهر مجانية' : '3 Free Months'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-medium">
                {lang === 'ar' ? 'تنفيذ مجاني بقيمة 10,000 ريال' : 'Free Setup Worth SAR 10,000'}
              </span>
            </div>
          </div>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            {lang === 'ar' ? 'احجز استشارة مجانية' : 'Book Free Consultation'}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}