import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Megaphone, 
  Star, 
  Crown, 
  Zap, 
  Award,
  CheckCircle,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Package {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  duration: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  isPopular?: boolean;
  isPremium?: boolean;
  color: string;
}

interface PackageSelectionProps {
  selectedPackage: string | null;
  onSelectPackage: (packageId: string) => void;
  onNext: () => void;
}

export function PackageSelection({ selectedPackage, onSelectPackage, onNext }: PackageSelectionProps) {
  const { lang, dir } = useLanguage();

  const packages: Package[] = [
    {
      id: 'starter',
      name: lang === 'ar' ? 'باقة البداية' : 'Starter Marketing',
      price: lang === 'ar' ? '2,500 ر.س' : '$667',
      originalPrice: lang === 'ar' ? '3,000 ر.س' : '$800',
      duration: lang === 'ar' ? '30 يوم' : '30 Days',
      description: lang === 'ar' ? 
        'مثالية للشركات الناشئة والمشاريع الصغيرة التي تريد البدء في التسويق الرقمي' :
        'Perfect for startups and small projects looking to get started with digital marketing',
      icon: Megaphone,
      features: lang === 'ar' ? [
        'إعداد وإدارة منصة واحدة',
        'إنشاء 12 منشور شهرياً',
        'تصميم 3 إعلانات',
        'تقرير أداء شهري',
        'استشارة أسبوعية',
        'دعم فني عبر البريد'
      ] : [
        'Setup & manage 1 platform',
        'Create 12 posts monthly',
        'Design 3 ad campaigns',
        'Monthly performance report',
        'Weekly consultation',
        'Email technical support'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'business',
      name: lang === 'ar' ? 'باقة الأعمال' : 'Business Growth',
      price: lang === 'ar' ? '4,500 ر.س' : '$1,200',
      originalPrice: lang === 'ar' ? '5,500 ر.س' : '$1,467',
      duration: lang === 'ar' ? '30 يوم' : '30 Days',
      description: lang === 'ar' ? 
        'حل متكامل للشركات المتنامية التي تريد توسيع نطاق وصولها وزيادة مبيعاتها' :
        'Complete solution for growing businesses looking to expand reach and increase sales',
      icon: Star,
      features: lang === 'ar' ? [
        'إدارة 3 منصات اجتماعية',
        'إنشاء 20 منشور شهرياً',
        'تصميم 5 حملات إعلانية',
        'تحليلات وتقارير مفصلة',
        'استشارة نصف أسبوعية',
        'إعلانات مدفوعة (500 ر.س)',
        'تحسين محركات البحث الأساسي',
        'دعم هاتفي'
      ] : [
        'Manage 3 social platforms',
        'Create 20 posts monthly',
        'Design 5 ad campaigns',
        'Detailed analytics & reports',
        'Bi-weekly consultation',
        'Paid ads ($133 included)',
        'Basic SEO optimization',
        'Phone support'
      ],
      isPopular: true,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'premium',
      name: lang === 'ar' ? 'الباقة المتقدمة' : 'Premium Enterprise',
      price: lang === 'ar' ? '8,500 ر.س' : '$2,267',
      originalPrice: lang === 'ar' ? '10,000 ر.س' : '$2,667',
      duration: lang === 'ar' ? '30 يوم' : '30 Days',
      description: lang === 'ar' ? 
        'حل شامل للمؤسسات الكبيرة التي تريد هيمنة كاملة على السوق الرقمي' :
        'Comprehensive solution for large enterprises seeking complete digital market dominance',
      icon: Crown,
      features: lang === 'ar' ? [
        'إدارة 5+ منصات',
        'إنشاء 40 منشور شهرياً',
        'حملات إعلانية غير محدودة',
        'تحليلات وذكاء أعمال متقدم',
        'مدير حساب مخصص',
        'إعلانات مدفوعة (1,500 ر.س)',
        'تحسين محركات البحث المتقدم',
        'تسويق المؤثرين',
        'إنشاء فيديوهات (4 شهرياً)',
        'دعم VIP على مدار الساعة'
      ] : [
        'Manage 5+ platforms',
        'Create 40 posts monthly',
        'Unlimited ad campaigns',
        'Advanced analytics & BI',
        'Dedicated account manager',
        'Paid ads ($400 included)',
        'Advanced SEO optimization',
        'Influencer marketing',
        'Video creation (4 monthly)',
        '24/7 VIP support'
      ],
      isPremium: true,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <Badge variant="outline" className="text-sky-600 border-sky-200 bg-sky-50 dark:text-sky-400 dark:border-sky-800 dark:bg-sky-950/20 mb-4">
          <Sparkles className="w-4 h-4 mr-2" />
          {lang === 'ar' ? 'الخطوة الأولى' : 'Step 1'}
        </Badge>
        
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {lang === 'ar' ? 'اختر الباقة المناسبة' : 'Choose Your Marketing Package'}
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {lang === 'ar' ? 
            'اختر الباقة التي تناسب حجم أعمالك وأهدافك التسويقية' :
            'Select the package that fits your business size and marketing goals'
          }
        </p>
      </div>

      {/* Packages Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {packages.map((pkg) => (
          <motion.div
            key={pkg.id}
            variants={itemVariants}
            className="relative"
          >
            {/* Popular Badge */}
            {pkg.isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  {lang === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
                </Badge>
              </div>
            )}

            {/* Premium Badge */}
            {pkg.isPremium && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                  <Crown className="w-3 h-3 mr-1" />
                  {lang === 'ar' ? 'متقدم' : 'Premium'}
                </Badge>
              </div>
            )}

            <Card 
              className={cn(
                "relative h-full cursor-pointer transition-all duration-300 hover:shadow-xl border-2",
                selectedPackage === pkg.id 
                  ? "border-sky-500 shadow-lg scale-105" 
                  : "border-gray-200 dark:border-gray-700 hover:border-sky-300"
              )}
              onClick={() => onSelectPackage(pkg.id)}
            >
              <CardHeader className="text-center pb-4">
                {/* Icon */}
                <div className={cn(
                  "w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r flex items-center justify-center mb-4 shadow-lg",
                  pkg.color
                )}>
                  <pkg.icon className="w-8 h-8 text-white" />
                </div>

                {/* Package Name */}
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {pkg.name}
                </CardTitle>

                {/* Pricing */}
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {pkg.price}
                    </span>
                    {pkg.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        {pkg.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {pkg.duration}
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                  {pkg.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Features List */}
                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Select Button */}
                <Button
                  className={cn(
                    "w-full transition-all duration-300",
                    selectedPackage === pkg.id
                      ? "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-orange-700 hover:to-red-700 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPackage(pkg.id);
                  }}
                  data-testid={`button-select-package-${pkg.id}`}
                >
                  {selectedPackage === pkg.id ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {lang === 'ar' ? 'محدد' : 'Selected'}
                    </>
                  ) : (
                    lang === 'ar' ? 'اختيار هذه الباقة' : 'Select This Package'
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Continue Button */}
      <div className="flex justify-center pt-8">
        <Button
          onClick={onNext}
          disabled={!selectedPackage}
          size="lg"
          className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-orange-700 hover:to-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 group"
          data-testid="button-continue-to-features"
        >
          {lang === 'ar' ? 'متابعة للميزات الإضافية' : 'Continue to Additional Features'}
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </div>
    </motion.div>
  );
}