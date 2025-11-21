import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Palette, 
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
      name: lang === 'ar' ? 'باقة البداية' : 'Starter Brand Kit',
      price: lang === 'ar' ? '1,500 ر.س' : '$400',
      originalPrice: lang === 'ar' ? '2,000 ر.س' : '$533',
      duration: lang === 'ar' ? '7-10 أيام' : '7-10 Days',
      description: lang === 'ar' ? 
        'مثالية للشركات الناشئة والمشاريع الصغيرة التي تحتاج هوية بصرية أساسية وجذابة' :
        'Perfect for startups and small projects that need a basic yet attractive visual identity',
      icon: Palette,
      features: lang === 'ar' ? [
        'تصميم الشعار (3 مفاهيم)',
        'لوحة الألوان الأساسية',
        'اختيار الخطوط المناسبة',
        'بطاقة أعمال واحدة',
        'ملفات عالية الجودة (PNG, JPG)',
        'دليل استخدام مبسط'
      ] : [
        'Logo Design (3 concepts)',
        'Primary Color Palette',
        'Font Selection',
        'One Business Card Design',
        'High-resolution files (PNG, JPG)',
        'Basic Usage Guidelines'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'business',
      name: lang === 'ar' ? 'الهوية التجارية' : 'Business Identity',
      price: lang === 'ar' ? '3,500 ر.س' : '$933',
      originalPrice: lang === 'ar' ? '4,500 ر.س' : '$1,200',
      duration: lang === 'ar' ? '10-12 يوم' : '10-12 Days',
      description: lang === 'ar' ? 
        'حل متكامل للشركات المتنامية التي تريد هوية مهنية شاملة تغطي جميع احتياجاتها' :
        'Complete solution for growing businesses that want a comprehensive professional identity covering all their needs',
      icon: Star,
      features: lang === 'ar' ? [
        'تصميم الشعار (5 مفاهيم)',
        'لوحة ألوان موسعة',
        'خطوط أساسية ومساعدة',
        '3 تصاميم بطاقات أعمال',
        'ورق رسمي وظرف',
        'غلاف فيسبوك وإنستغرام',
        'ملفات بجميع الصيغ',
        'دليل هوية متوسط'
      ] : [
        'Logo Design (5 concepts)',
        'Extended Color Palette',
        'Primary & Secondary Fonts',
        '3 Business Card Designs',
        'Letterhead & Envelope',
        'Facebook & Instagram Covers',
        'Files in All Formats',
        'Medium Brand Guide'
      ],
      isPopular: true,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'premium',
      name: lang === 'ar' ? 'النظام المتقدم' : 'Premium Brand System',
      price: lang === 'ar' ? '6,500 ر.س' : '$1,733',
      originalPrice: lang === 'ar' ? '8,000 ر.س' : '$2,133',
      duration: lang === 'ar' ? '12-15 يوم' : '12-15 Days',
      description: lang === 'ar' ? 
        'نظام هوية متكامل للشركات المتوسطة والكبيرة مع جميع التطبيقات والمواد التسويقية' :
        'Integrated identity system for medium and large companies with all applications and marketing materials',
      icon: Crown,
      features: lang === 'ar' ? [
        'تصميم الشعار (7 مفاهيم)',
        'نظام ألوان شامل',
        'عائلة خطوط كاملة',
        '5 تصاميم بطاقات مختلفة',
        'مجموعة أوراق رسمية',
        'تصاميم جميع منصات التواصل',
        'بروشور ومجلد الشركة',
        'قوالب عروض تقديمية',
        'أنماط وخلفيات مخصصة',
        'دليل هوية شامل'
      ] : [
        'Logo Design (7 concepts)',
        'Comprehensive Color System',
        'Complete Font Family',
        '5 Different Business Card Designs',
        'Complete Stationery Set',
        'All Social Media Designs',
        'Brochure & Company Folder',
        'Presentation Templates',
        'Custom Patterns & Backgrounds',
        'Comprehensive Brand Guide'
      ],
      isPremium: true,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'enterprise',
      name: lang === 'ar' ? 'النظام المؤسسي' : 'Enterprise Brand Ecosystem',
      price: lang === 'ar' ? '12,000 ر.س' : '$3,200',
      originalPrice: lang === 'ar' ? '15,000 ر.س' : '$4,000',
      duration: lang === 'ar' ? '15-20 يوم' : '15-20 Days',
      description: lang === 'ar' ? 
        'نظام هوية مؤسسي متطور مع جميع التطبيقات والحلول المتقدمة بما في ذلك الشعار المتحرك' :
        'Advanced enterprise identity system with all applications and advanced solutions including animated logo',
      icon: Award,
      features: lang === 'ar' ? [
        'تصميم الشعار (10 مفاهيم)',
        'نظام هوية متعدد الطبقات',
        'مجموعة خطوط حصرية',
        'تصاميم لا محدودة للقرطاسية',
        'تطبيقات رقمية شاملة',
        'تصميم تغليف المنتجات',
        'الشعار المتحرك',
        'قوالب مواقع وتطبيقات',
        'دليل استخدام تفاعلي',
        'تدريب الفريق',
        'دعم لمدة 6 أشهر'
      ] : [
        'Logo Design (10 concepts)',
        'Multi-layered Identity System',
        'Exclusive Font Collection',
        'Unlimited Stationery Designs',
        'Comprehensive Digital Applications',
        'Product Packaging Design',
        'Animated Logo',
        'Website & App Templates',
        'Interactive Brand Guide',
        'Team Training',
        '6 Months Support'
      ],
      isPremium: true,
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <Badge 
          variant="secondary" 
          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 px-4 py-2 text-sm font-medium mb-4"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {lang === 'ar' ? 'الخطوة الأولى' : 'Step 1'}
        </Badge>
        
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {lang === 'ar' ? 'اختر الباقة المناسبة لك' : 'Choose Your Perfect Package'}
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {lang === 'ar' ? 
            'اختر من بين باقاتنا المصممة خصيصاً لتناسب حجم مشروعك وميزانيتك' :
            'Choose from our specially designed packages to fit your project size and budget'
          }
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card 
              className={cn(
                "relative group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border-2",
                selectedPackage === pkg.id 
                  ? "border-blue-500 shadow-xl bg-blue-50 dark:bg-blue-950" 
                  : "border-gray-200 dark:border-gray-700 hover:shadow-lg",
                pkg.isPremium && "bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-950"
              )}
              onClick={() => onSelectPackage(pkg.id)}
              data-testid={`card-package-${pkg.id}`}
            >
              {/* Popular badge */}
              {pkg.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-green-500 text-white px-4 py-1 text-xs font-semibold shadow-lg">
                    {lang === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
                  </Badge>
                </div>
              )}

              {/* Premium badge */}
              {pkg.isPremium && (
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                    <Crown className="w-3 h-3 mr-1" />
                    {lang === 'ar' ? 'مميز' : 'Premium'}
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn(
                    "inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br text-white shadow-lg",
                    `bg-gradient-to-br ${pkg.color}`
                  )}>
                    <pkg.icon className="w-8 h-8" />
                  </div>
                  
                  <div className="flex-grow">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {pkg.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {pkg.price}
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {pkg.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span>{lang === 'ar' ? 'مدة التنفيذ:' : 'Delivery:'} {pkg.duration}</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {pkg.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3">
                    {lang === 'ar' ? 'يتضمن:' : 'Includes:'}
                  </h4>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Selection indicator */}
                {selectedPackage === pkg.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mt-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {lang === 'ar' ? 'تم الاختيار' : 'Selected'}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Next button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex justify-center pt-6"
      >
        <Button
          onClick={onNext}
          disabled={!selectedPackage}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          data-testid="button-next-features"
        >
          {lang === 'ar' ? 'التالي: اختيار الميزات الإضافية' : 'Next: Choose Additional Features'}
          <ChevronRight className={cn("w-5 h-5 ml-2", dir === 'rtl' && "mr-2 ml-0 rotate-180")} />
        </Button>
      </motion.div>
    </div>
  );
}