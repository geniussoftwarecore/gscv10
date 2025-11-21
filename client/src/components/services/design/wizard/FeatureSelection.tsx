import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Video, 
  Palette, 
  FileText, 
  Package, 
  Smartphone, 
  Globe,
  ChevronLeft,
  ChevronRight,
  Info,
  Zap,
  Star,
  Crown,
  Sparkles,
  Clock,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  price: number;
  duration?: string;
  isRecommended?: boolean;
  isPremium?: boolean;
  packageCompatibility: string[]; // which packages support this feature
}

interface FeatureSelectionProps {
  selectedPackage: string;
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function FeatureSelection({ 
  selectedPackage, 
  selectedFeatures, 
  onFeaturesChange, 
  onNext, 
  onBack 
}: FeatureSelectionProps) {
  const { lang, dir } = useLanguage();
  const [featuresWithDependencies, setFeaturesWithDependencies] = useState<string[]>(selectedFeatures);

  const getPackageFeatures = (): Feature[] => {
    const allFeatures: Feature[] = [
      // Animation & Motion
      {
        id: 'animated_logo',
        name: lang === 'ar' ? 'الشعار المتحرك' : 'Animated Logo',
        description: lang === 'ar' ? 
          'إضافة حركة احترافية لشعارك للاستخدام في الفيديو والمواقع الإلكترونية' :
          'Add professional animation to your logo for video and website use',
        icon: Video,
        category: 'animation',
        price: lang === 'ar' ? 800 : 213,
        duration: lang === 'ar' ? '+3 أيام' : '+3 days',
        isRecommended: true,
        packageCompatibility: ['business', 'premium', 'enterprise']
      },
      {
        id: 'logo_variations',
        name: lang === 'ar' ? 'تنويعات إضافية للشعار' : 'Additional Logo Variations',
        description: lang === 'ar' ? 
          'المزيد من الأشكال والتنويعات لشعارك (أحادي اللون، مبسط، أيقونة منفصلة)' :
          'More logo shapes and variations (monochrome, simplified, separate icon)',
        icon: Palette,
        category: 'branding',
        price: lang === 'ar' ? 400 : 107,
        duration: lang === 'ar' ? '+2 يوم' : '+2 days',
        packageCompatibility: ['starter', 'business', 'premium', 'enterprise']
      },

      // Documentation & Guidelines
      {
        id: 'extended_brand_guide',
        name: lang === 'ar' ? 'دليل هوية موسع' : 'Extended Brand Guide',
        description: lang === 'ar' ? 
          'دليل شامل يتضمن استراتيجية العلامة التجارية وأمثلة تطبيقية متقدمة' :
          'Comprehensive guide including brand strategy and advanced application examples',
        icon: FileText,
        category: 'documentation',
        price: lang === 'ar' ? 600 : 160,
        duration: lang === 'ar' ? '+2 يوم' : '+2 days',
        packageCompatibility: ['business', 'premium', 'enterprise']
      },

      // Product & Packaging
      {
        id: 'packaging_design',
        name: lang === 'ar' ? 'تصميم التغليف' : 'Packaging Design',
        description: lang === 'ar' ? 
          'تصاميم تغليف احترافية لمنتجاتك (علب، أكياس، ملصقات)' :
          'Professional packaging designs for your products (boxes, bags, labels)',
        icon: Package,
        category: 'product',
        price: lang === 'ar' ? 1200 : 320,
        duration: lang === 'ar' ? '+5 أيام' : '+5 days',
        isPremium: true,
        packageCompatibility: ['premium', 'enterprise']
      },

      // Digital Applications
      {
        id: 'mobile_app_kit',
        name: lang === 'ar' ? 'طقم تطبيق المحمول' : 'Mobile App Kit',
        description: lang === 'ar' ? 
          'أيقونات وعناصر واجهة المستخدم مخصصة لتطبيقك المحمول' :
          'Custom icons and UI elements for your mobile application',
        icon: Smartphone,
        category: 'digital',
        price: lang === 'ar' ? 900 : 240,
        duration: lang === 'ar' ? '+4 أيام' : '+4 days',
        packageCompatibility: ['business', 'premium', 'enterprise']
      },
      {
        id: 'web_elements',
        name: lang === 'ar' ? 'عناصر الموقع الإلكتروني' : 'Website Elements',
        description: lang === 'ar' ? 
          'أيقونات وعناصر مخصصة لموقعك الإلكتروني وواجهة المستخدم' :
          'Custom icons and elements for your website and user interface',
        icon: Globe,
        category: 'digital',
        price: lang === 'ar' ? 700 : 187,
        duration: lang === 'ar' ? '+3 أيام' : '+3 days',
        packageCompatibility: ['business', 'premium', 'enterprise']
      },

      // Premium Features
      {
        id: 'brand_photography',
        name: lang === 'ar' ? 'استشارة التصوير التجاري' : 'Brand Photography Consultation',
        description: lang === 'ar' ? 
          'إرشادات وتوجيهات لتصوير محتوى يتماشى مع هويتك البصرية' :
          'Guidelines and directions for shooting content that aligns with your visual identity',
        icon: Star,
        category: 'premium',
        price: lang === 'ar' ? 500 : 133,
        duration: lang === 'ar' ? '+1 يوم' : '+1 day',
        isPremium: true,
        packageCompatibility: ['premium', 'enterprise']
      },
      {
        id: 'brand_strategy',
        name: lang === 'ar' ? 'استراتيجية العلامة التجارية' : 'Brand Strategy',
        description: lang === 'ar' ? 
          'وضع استراتيجية شاملة للعلامة التجارية وتحديد الرسائل الأساسية' :
          'Develop comprehensive brand strategy and define key messaging',
        icon: Crown,
        category: 'strategy',
        price: lang === 'ar' ? 1500 : 400,
        duration: lang === 'ar' ? '+5 أيام' : '+5 days',
        isPremium: true,
        packageCompatibility: ['enterprise']
      },

      // Support & Training
      {
        id: 'team_training',
        name: lang === 'ar' ? 'تدريب الفريق' : 'Team Training',
        description: lang === 'ar' ? 
          'جلسة تدريبية للفريق على كيفية تطبيق الهوية البصرية بشكل صحيح' :
          'Training session for the team on how to apply visual identity correctly',
        icon: Zap,
        category: 'support',
        price: lang === 'ar' ? 800 : 213,
        duration: lang === 'ar' ? '+1 يوم' : '+1 day',
        packageCompatibility: ['premium', 'enterprise']
      }
    ];

    return allFeatures.filter(feature => 
      feature.packageCompatibility.includes(selectedPackage)
    );
  };

  const features = getPackageFeatures();
  
  const categories = [
    { id: 'animation', name: lang === 'ar' ? 'الحركة والتفاعل' : 'Animation & Motion', icon: Video },
    { id: 'branding', name: lang === 'ar' ? 'الهوية البصرية' : 'Visual Branding', icon: Palette },
    { id: 'documentation', name: lang === 'ar' ? 'التوثيق' : 'Documentation', icon: FileText },
    { id: 'product', name: lang === 'ar' ? 'المنتج والتغليف' : 'Product & Packaging', icon: Package },
    { id: 'digital', name: lang === 'ar' ? 'التطبيقات الرقمية' : 'Digital Applications', icon: Globe },
    { id: 'premium', name: lang === 'ar' ? 'الخدمات المميزة' : 'Premium Services', icon: Star },
    { id: 'strategy', name: lang === 'ar' ? 'الاستراتيجية' : 'Strategy', icon: Crown },
    { id: 'support', name: lang === 'ar' ? 'الدعم والتدريب' : 'Support & Training', icon: Zap }
  ];

  // Calculate additional cost
  const additionalCost = selectedFeatures.reduce((total, featureId) => {
    const feature = features.find(f => f.id === featureId);
    return total + (feature ? feature.price : 0);
  }, 0);

  // Calculate additional time
  const additionalDays = features
    .filter(f => selectedFeatures.includes(f.id))
    .reduce((total, feature) => {
      const days = parseInt(feature.duration?.replace(/[^\d]/g, '') || '0');
      return total + days;
    }, 0);

  const handleFeatureToggle = (featureId: string) => {
    const newFeatures = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(f => f !== featureId)
      : [...selectedFeatures, featureId];
    
    onFeaturesChange(newFeatures);
    setFeaturesWithDependencies(newFeatures);
  };

  useEffect(() => {
    setFeaturesWithDependencies(selectedFeatures);
  }, [selectedFeatures]);

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
          {lang === 'ar' ? 'الخطوة الثانية' : 'Step 2'}
        </Badge>
        
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {lang === 'ar' ? 'أضف المزيد من الميزات' : 'Add More Features'}
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {lang === 'ar' ? 
            'اختر الميزات الإضافية التي تريد إضافتها لباقتك لتحصل على هوية أكثر تميزاً' :
            'Choose additional features to add to your package for a more distinctive identity'
          }
        </p>
      </motion.div>

      {/* Additional cost summary */}
      {(additionalCost > 0 || additionalDays > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4" />
            <AlertDescription className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="font-semibold">
                  {lang === 'ar' ? 'التكلفة الإضافية:' : 'Additional Cost:'}
                </span>
                <span className="text-blue-600 font-bold">
                  {lang === 'ar' ? `${additionalCost} ر.س` : `$${additionalCost}`}
                </span>
              </div>
              {additionalDays > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="font-semibold">
                    {lang === 'ar' ? 'وقت إضافي:' : 'Additional Time:'}
                  </span>
                  <span className="text-orange-600 font-bold">
                    {additionalDays} {lang === 'ar' ? 'يوم' : 'days'}
                  </span>
                </div>
              )}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Features by category */}
      <div className="space-y-8">
        {categories.map((category, categoryIndex) => {
          const categoryFeatures = features.filter(f => f.category === category.id);
          
          if (categoryFeatures.length === 0) return null;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <category.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: (categoryIndex * 0.1) + (index * 0.05) }}
                  >
                    <Card 
                      className={cn(
                        "group cursor-pointer transition-all duration-300 border-2 hover:shadow-lg",
                        selectedFeatures.includes(feature.id)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                          : "border-gray-200 dark:border-gray-700",
                        feature.isPremium && "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950"
                      )}
                      onClick={() => handleFeatureToggle(feature.id)}
                      data-testid={`card-feature-${feature.id}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                              <feature.icon className="w-5 h-5" />
                            </div>
                            
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {feature.name}
                                {feature.isRecommended && (
                                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 text-xs">
                                    {lang === 'ar' ? 'موصى' : 'Recommended'}
                                  </Badge>
                                )}
                                {feature.isPremium && (
                                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 text-xs">
                                    <Crown className="w-3 h-3 mr-1" />
                                    {lang === 'ar' ? 'مميز' : 'Premium'}
                                  </Badge>
                                )}
                              </CardTitle>
                              
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                  +{lang === 'ar' ? `${feature.price} ر.س` : `$${feature.price}`}
                                </span>
                                {feature.duration && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {feature.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <Checkbox
                            checked={selectedFeatures.includes(feature.id)}
                            className="ml-2 pointer-events-none"
                          />
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex justify-between items-center pt-6"
      >
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="font-semibold px-6 py-3 rounded-xl"
          data-testid="button-back-package"
        >
          <ChevronLeft className={cn("w-5 h-5 mr-2", dir === 'rtl' && "ml-2 mr-0 rotate-180")} />
          {lang === 'ar' ? 'العودة للباقات' : 'Back to Packages'}
        </Button>

        <Button
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          data-testid="button-next-details"
        >
          {lang === 'ar' ? 'التالي: تفاصيل المشروع' : 'Next: Project Details'}
          <ChevronRight className={cn("w-5 h-5 ml-2", dir === 'rtl' && "mr-2 ml-0 rotate-180")} />
        </Button>
      </motion.div>
    </div>
  );
}