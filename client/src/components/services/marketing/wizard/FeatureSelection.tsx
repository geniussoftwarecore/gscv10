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
  BarChart3, 
  Search, 
  Mail, 
  Users,
  Target,
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
      // Advanced Social Media
      {
        id: 'social_media_premium',
        name: lang === 'ar' ? 'إدارة متقدمة لوسائل التواصل' : 'Advanced Social Media Management',
        description: lang === 'ar' ? 
          'إدارة احترافية لجميع منصات التواصل مع جدولة ذكية وردود تفاعلية' :
          'Professional management of all social platforms with smart scheduling and interactive responses',
        icon: Users,
        category: 'social',
        price: 320,
        duration: lang === 'ar' ? '+5 أيام' : '+5 days',
        isRecommended: true,
        packageCompatibility: ['business', 'premium']
      },
      {
        id: 'seo_optimization',
        name: lang === 'ar' ? 'تحسين محركات البحث المتقدم' : 'Advanced SEO Optimization',
        description: lang === 'ar' ? 
          'تحسين شامل لموقعك ومحتواك لتصدر نتائج البحث' :
          'Comprehensive optimization of your website and content to dominate search results',
        icon: Search,
        category: 'seo',
        price: 240,
        duration: lang === 'ar' ? '+7 أيام' : '+7 days',
        isRecommended: true,
        packageCompatibility: ['starter', 'business', 'premium']
      },
      {
        id: 'content_creation',
        name: lang === 'ar' ? 'إنشاء محتوى إبداعي' : 'Creative Content Creation',
        description: lang === 'ar' ? 
          'إنتاج محتوى بصري ومكتوب عالي الجودة يجذب ويحتفظ بجمهورك' :
          'Produce high-quality visual and written content that attracts and retains your audience',
        icon: Video,
        category: 'content',
        price: 213,
        duration: lang === 'ar' ? '+4 أيام' : '+4 days',
        packageCompatibility: ['starter', 'business', 'premium']
      },
      {
        id: 'paid_advertising',
        name: lang === 'ar' ? 'إدارة الإعلانات المدفوعة' : 'Paid Advertising Management',
        description: lang === 'ar' ? 
          'إدارة وتحسين حملات إعلانية مدفوعة على جوجل وفيسبوك وإنستغرام' :
          'Manage and optimize paid ad campaigns on Google, Facebook, and Instagram',
        icon: Target,
        category: 'advertising',
        price: 400,
        duration: lang === 'ar' ? '+3 أيام' : '+3 days',
        isPremium: true,
        packageCompatibility: ['business', 'premium']
      },
      {
        id: 'email_marketing',
        name: lang === 'ar' ? 'التسويق عبر البريد الإلكتروني' : 'Email Marketing Campaigns',
        description: lang === 'ar' ? 
          'تصميم وتنفيذ حملات بريد إلكتروني مؤثرة تزيد من التحويلات' :
          'Design and execute effective email campaigns that increase conversions',
        icon: Mail,
        category: 'email',
        price: 160,
        duration: lang === 'ar' ? '+3 أيام' : '+3 days',
        packageCompatibility: ['business', 'premium']
      },
      {
        id: 'analytics_reporting',
        name: lang === 'ar' ? 'تحليلات وتقارير متقدمة' : 'Advanced Analytics & Reporting',
        description: lang === 'ar' ? 
          'تحليل شامل لأداء حملاتك مع تقارير مفصلة وتوصيات للتحسين' :
          'Comprehensive analysis of your campaign performance with detailed reports and improvement recommendations',
        icon: BarChart3,
        category: 'analytics',
        price: 187,
        duration: lang === 'ar' ? '+2 يوم' : '+2 days',
        isRecommended: true,
        packageCompatibility: ['starter', 'business', 'premium']
      },
      {
        id: 'influencer_marketing',
        name: lang === 'ar' ? 'تسويق المؤثرين' : 'Influencer Marketing',
        description: lang === 'ar' ? 
          'التواصل مع المؤثرين المناسبين وإدارة حملات تسويقية معهم' :
          'Connect with relevant influencers and manage marketing campaigns with them',
        icon: Star,
        category: 'influencer',
        price: 533,
        duration: lang === 'ar' ? '+10 أيام' : '+10 days',
        isPremium: true,
        packageCompatibility: ['premium']
      },
      {
        id: 'video_production',
        name: lang === 'ar' ? 'إنتاج الفيديوهات التسويقية' : 'Marketing Video Production',
        description: lang === 'ar' ? 
          'إنتاج فيديوهات تسويقية احترافية لمنصات التواصل والإعلانات' :
          'Produce professional marketing videos for social media and advertising',
        icon: Video,
        category: 'video',
        price: 480,
        duration: lang === 'ar' ? '+7 أيام' : '+7 days',
        isPremium: true,
        packageCompatibility: ['business', 'premium']
      },
      {
        id: 'brand_strategy',
        name: lang === 'ar' ? 'استراتيجية العلامة التجارية' : 'Brand Strategy Development',
        description: lang === 'ar' ? 
          'تطوير استراتيجية شاملة للعلامة التجارية وهويتها في السوق' :
          'Develop comprehensive brand strategy and market positioning',
        icon: Crown,
        category: 'branding',
        price: 267,
        duration: lang === 'ar' ? '+5 أيام' : '+5 days',
        packageCompatibility: ['business', 'premium']
      },
      {
        id: 'competitor_analysis',
        name: lang === 'ar' ? 'تحليل المنافسين' : 'Competitor Analysis',
        description: lang === 'ar' ? 
          'تحليل شامل لاستراتيجيات المنافسين واكتشاف الفرص السوقية' :
          'Comprehensive analysis of competitor strategies and market opportunities discovery',
        icon: Zap,
        category: 'research',
        price: 133,
        duration: lang === 'ar' ? '+3 أيام' : '+3 days',
        packageCompatibility: ['starter', 'business', 'premium']
      }
    ];

    return allFeatures.filter(feature => 
      feature.packageCompatibility.includes(selectedPackage)
    );
  };

  const features = getPackageFeatures();

  // Format price for display based on language
  const formatPrice = (usdPrice: number) => {
    if (lang === 'ar') {
      const sarPrice = Math.round(usdPrice * 3.75); // USD to SAR conversion
      return `${sarPrice} ر.س`;
    } else {
      return `$${usdPrice}`;
    }
  };
  
  const categories = [
    { id: 'social', name: lang === 'ar' ? 'وسائل التواصل' : 'Social Media', color: 'from-blue-500 to-cyan-500' },
    { id: 'seo', name: lang === 'ar' ? 'محركات البحث' : 'SEO', color: 'from-green-500 to-emerald-500' },
    { id: 'content', name: lang === 'ar' ? 'المحتوى' : 'Content', color: 'from-purple-500 to-violet-500' },
    { id: 'advertising', name: lang === 'ar' ? 'الإعلانات' : 'Advertising', color: 'from-sky-500 to-blue-600' },
    { id: 'email', name: lang === 'ar' ? 'البريد الإلكتروني' : 'Email', color: 'from-teal-500 to-cyan-500' },
    { id: 'analytics', name: lang === 'ar' ? 'التحليلات' : 'Analytics', color: 'from-indigo-500 to-blue-500' },
    { id: 'influencer', name: lang === 'ar' ? 'المؤثرين' : 'Influencer', color: 'from-pink-500 to-rose-500' },
    { id: 'video', name: lang === 'ar' ? 'الفيديو' : 'Video', color: 'from-amber-500 to-orange-500' },
    { id: 'branding', name: lang === 'ar' ? 'العلامة التجارية' : 'Branding', color: 'from-violet-500 to-purple-500' },
    { id: 'research', name: lang === 'ar' ? 'البحث والتحليل' : 'Research', color: 'from-emerald-500 to-teal-500' }
  ];

  const handleFeatureToggle = (featureId: string) => {
    const newFeatures = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(id => id !== featureId)
      : [...selectedFeatures, featureId];
    
    onFeaturesChange(newFeatures);
  };

  const calculateTotal = () => {
    return selectedFeatures.reduce((total, featureId) => {
      const feature = features.find(f => f.id === featureId);
      return total + (feature?.price || 0);
    }, 0);
  };

  const totalPrice = calculateTotal();

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
          {lang === 'ar' ? 'الخطوة الثانية' : 'Step 2'}
        </Badge>
        
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {lang === 'ar' ? 'اختر الميزات الإضافية' : 'Choose Additional Features'}
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {lang === 'ar' ? 
            'عزز باقتك بميزات إضافية لتحقيق أفضل النتائج' :
            'Enhance your package with additional features for optimal results'
          }
        </p>
      </div>

      {/* Pricing Summary */}
      {totalPrice > 0 && (
        <Alert className="border-sky-200 bg-sky-50 dark:bg-sky-950/20">
          <DollarSign className="w-4 h-4" />
          <AlertDescription>
            {lang === 'ar' ? 
              `إجمالي الميزات الإضافية: ${formatPrice(totalPrice)}` :
              `Additional features total: ${formatPrice(totalPrice)}`
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Features by Category */}
      <div className="space-y-8">
        {categories.map(category => {
          const categoryFeatures = features.filter(f => f.category === category.id);
          if (categoryFeatures.length === 0) return null;

          return (
            <div key={category.id}>
              <div className="flex items-center gap-3 mb-6">
                <div className={cn(
                  "w-8 h-8 rounded-lg bg-gradient-to-r flex items-center justify-center",
                  category.color
                )}>
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {category.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryFeatures.map((feature) => (
                  <Card 
                    key={feature.id}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-lg border-2",
                      selectedFeatures.includes(feature.id)
                        ? "border-sky-500 bg-sky-50 dark:bg-sky-950/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-sky-300"
                    )}
                    onClick={() => handleFeatureToggle(feature.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Checkbox
                            checked={selectedFeatures.includes(feature.id)}
                            onChange={() => handleFeatureToggle(feature.id)}
                            className="mt-1"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <feature.icon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                              {feature.isRecommended && (
                                <Badge variant="secondary" className="text-xs">
                                  {lang === 'ar' ? 'مُوصى' : 'Recommended'}
                                </Badge>
                              )}
                              {feature.isPremium && (
                                <Badge className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                  {lang === 'ar' ? 'متقدم' : 'Premium'}
                                </Badge>
                              )}
                            </div>
                            
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {feature.name}
                            </CardTitle>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          {feature.duration}
                        </div>
                        
                        <div className="text-lg font-bold text-sky-600 dark:text-sky-400">
                          {formatPrice(feature.price)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="px-8 py-3"
          data-testid="button-back-to-packages"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          {lang === 'ar' ? 'العودة للباقات' : 'Back to Packages'}
        </Button>
        
        <Button
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 group"
          data-testid="button-continue-to-contact"
        >
          {lang === 'ar' ? 'متابعة لمعلومات التواصل' : 'Continue to Contact Info'}
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </div>
    </motion.div>
  );
}