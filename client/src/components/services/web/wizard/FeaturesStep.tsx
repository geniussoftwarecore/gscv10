import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Layout, 
  Zap, 
  Search, 
  Shield,
  Settings,
  ShoppingCart,
  Link,
  Cloud,
  Brain,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  isEssential?: boolean;
  isPremium?: boolean;
  dependencies?: string[];
  conflicts?: string[];
}

interface FeaturesStepProps {
  siteType: string;
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function FeaturesStep({ 
  siteType, 
  selectedFeatures, 
  onFeaturesChange, 
  onNext, 
  onBack 
}: FeaturesStepProps) {
  const { lang, dir } = useLanguage();
  const [featuresWithDependencies, setFeaturesWithDependencies] = useState<string[]>(selectedFeatures);

  // Get features based on site type
  const getSiteTypeFeatures = (): Feature[] => {
    const baseFeatures: Feature[] = [
      // Basics Package
      {
        id: 'basics',
        name: lang === 'ar' ? 'الصفحات الأساسية' : 'Basic Pages',
        description: lang === 'ar' ? 'صفحات رئيسية/عنّا/خدمات/اتصل، RTL، متعدد اللغات، نماذج تواصل، خريطة' : 'Home/About/Services/Contact pages, RTL, multilingual, contact forms, map',
        icon: Layout,
        category: 'basics',
        isEssential: true
      },
      
      // Performance Package
      {
        id: 'performance',
        name: lang === 'ar' ? 'تحسين الأداء' : 'Performance Optimization',
        description: lang === 'ar' ? 'تحسين الأداء، ضغط الصور، كاشينغ، SSG/SSR عند الحاجة' : 'Performance optimization, image compression, caching, SSG/SSR when needed',
        icon: Zap,
        category: 'performance'
      },
      
      // SEO & Analytics Package
      {
        id: 'seo_analytics',
        name: lang === 'ar' ? 'SEO والتحليلات' : 'SEO & Analytics',
        description: lang === 'ar' ? 'Meta/Sitemap/Robots/Schema، ربط GA4/Tag Manager' : 'Meta/Sitemap/Robots/Schema markup, GA4/Tag Manager integration',
        icon: Search,
        category: 'seo'
      },
      
      // Security Package
      {
        id: 'security',
        name: lang === 'ar' ? 'الأمان المتقدم' : 'Advanced Security',
        description: lang === 'ar' ? 'HTTPS headers، CSRF/Rate limiting/ReCAPTCHA، سياسات تحميل' : 'HTTPS headers, CSRF/Rate limiting/ReCAPTCHA, content security policies',
        icon: Shield,
        category: 'security'
      },
      
      // CMS & Admin Package
      {
        id: 'cms_admin',
        name: lang === 'ar' ? 'نظام إدارة المحتوى' : 'CMS & Admin Panel',
        description: lang === 'ar' ? 'ربط CMS Headless (مثلاً Strapi/Directus) أو لوحة إدارة مخصّصة، صلاحيات، Workflow' : 'Headless CMS integration (Strapi/Directus) or custom admin panel, permissions, workflow',
        icon: Settings,
        category: 'cms'
      },
      
      // Integrations Package
      {
        id: 'integrations',
        name: lang === 'ar' ? 'التكاملات الخارجية' : 'External Integrations',
        description: lang === 'ar' ? 'بريد/CRM، ERP/POS، محافظ رقمية، SMS/WhatsApp' : 'Email/CRM, ERP/POS, digital wallets, SMS/WhatsApp',
        icon: Link,
        category: 'integrations'
      },
      
      // Scalability Package
      {
        id: 'scalability',
        name: lang === 'ar' ? 'القابلية للتوسع' : 'Scalability & DevOps',
        description: lang === 'ar' ? 'رفع إلى S3، CDN، CI/CD، مراقبة Logs' : 'S3 uploads, CDN, CI/CD pipelines, log monitoring',
        icon: Cloud,
        category: 'scalability'
      },
      
      // AI & Smart Features Package
      {
        id: 'ai_smart',
        name: lang === 'ar' ? 'الذكاء الاصطناعي والميزات الذكية' : 'AI & Smart Features',
        description: lang === 'ar' ? 'بحث ذكي، توصيات، شات بوت دعم' : 'Smart search, recommendations, support chatbot',
        icon: Brain,
        category: 'ai'
      }
    ];

    // Site-specific features
    const siteSpecificFeatures: Record<string, Feature[]> = {
      ecommerce: [
        {
          id: 'ecommerce',
          name: lang === 'ar' ? 'ميزات التجارة الإلكترونية' : 'E-commerce Features',
          description: lang === 'ar' ? 'سلة، بوابات دفع، مخزون/شحن، فواتير/ضرائب' : 'Shopping cart, payment gateways, inventory/shipping, invoices/taxes',
          icon: ShoppingCart,
          category: 'ecommerce',
          isEssential: true
        }
      ],
      blog_magazine: [
        {
          id: 'blog_features',
          name: lang === 'ar' ? 'ميزات المدونة والمجلة' : 'Blog & Magazine Features',
          description: lang === 'ar' ? 'إدارة مقالات، تصنيفات، تعليقات، اشتراكات نشرة بريدية' : 'Article management, categories, comments, newsletter subscriptions',
          icon: Layout,
          category: 'content'
        }
      ],
      elearning: [
        {
          id: 'learning_features',
          name: lang === 'ar' ? 'ميزات التعلم الإلكتروني' : 'E-learning Features',
          description: lang === 'ar' ? 'كورسات، اختبارات، تتبع تقدم، شهادات، مدفوعات كورسات' : 'Courses, quizzes, progress tracking, certificates, course payments',
          icon: Layout,
          category: 'learning'
        }
      ],
      booking: [
        {
          id: 'booking_features',
          name: lang === 'ar' ? 'ميزات الحجز والمواعيد' : 'Booking & Appointment Features',
          description: lang === 'ar' ? 'نظام حجز، تقويم، دفع، تأكيدات، تذكيرات' : 'Booking system, calendar, payments, confirmations, reminders',
          icon: Layout,
          category: 'booking'
        }
      ]
    };

    // Combine base features with site-specific features
    const features = [...baseFeatures];
    if (siteSpecificFeatures[siteType]) {
      features.push(...siteSpecificFeatures[siteType]);
    }

    return features;
  };

  const features = getSiteTypeFeatures();

  // Group features by category
  const featuresByCategory = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  // Category display names and order
  const getCategoryInfo = (category: string) => {
    const categoryMap: Record<string, { name: string; order: number; color: string }> = {
      basics: { 
        name: lang === 'ar' ? 'الأساسيات' : 'Basics', 
        order: 1, 
        color: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' 
      },
      performance: { 
        name: lang === 'ar' ? 'الأداء' : 'Performance', 
        order: 2, 
        color: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
      },
      seo: { 
        name: lang === 'ar' ? 'SEO والتحليلات' : 'SEO & Analytics', 
        order: 3, 
        color: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800' 
      },
      security: { 
        name: lang === 'ar' ? 'الأمان' : 'Security', 
        order: 4, 
        color: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' 
      },
      cms: { 
        name: lang === 'ar' ? 'إدارة المحتوى' : 'Content Management', 
        order: 5, 
        color: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800' 
      },
      ecommerce: { 
        name: lang === 'ar' ? 'التجارة الإلكترونية' : 'E-commerce', 
        order: 6, 
        color: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' 
      },
      content: { 
        name: lang === 'ar' ? 'المحتوى والنشر' : 'Content & Publishing', 
        order: 6, 
        color: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' 
      },
      learning: { 
        name: lang === 'ar' ? 'التعلم الإلكتروني' : 'E-learning', 
        order: 6, 
        color: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' 
      },
      booking: { 
        name: lang === 'ar' ? 'الحجز والمواعيد' : 'Booking & Appointments', 
        order: 6, 
        color: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' 
      },
      integrations: { 
        name: lang === 'ar' ? 'التكاملات' : 'Integrations', 
        order: 7, 
        color: 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800' 
      },
      scalability: { 
        name: lang === 'ar' ? 'التوسع والتطوير' : 'Scalability & DevOps', 
        order: 8, 
        color: 'bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800' 
      },
      ai: { 
        name: lang === 'ar' ? 'الذكاء الاصطناعي' : 'AI & Smart Features', 
        order: 9, 
        color: 'bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-800' 
      }
    };
    return categoryMap[category] || { name: category, order: 10, color: 'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800' };
  };

  // Sort categories by order
  const sortedCategories = Object.keys(featuresByCategory).sort((a, b) => {
    return getCategoryInfo(a).order - getCategoryInfo(b).order;
  });

  // Handle feature selection with dependencies
  const handleFeatureToggle = (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    let newSelectedFeatures = [...selectedFeatures];

    if (newSelectedFeatures.includes(featureId)) {
      // Remove feature
      newSelectedFeatures = newSelectedFeatures.filter(id => id !== featureId);
      
      // Remove features that depend on this one
      const dependentFeatures = features.filter(f => f.dependencies?.includes(featureId));
      dependentFeatures.forEach(depFeature => {
        newSelectedFeatures = newSelectedFeatures.filter(id => id !== depFeature.id);
      });
    } else {
      // Add feature
      newSelectedFeatures.push(featureId);
      
      // Add dependencies
      if (feature.dependencies) {
        feature.dependencies.forEach(depId => {
          if (!newSelectedFeatures.includes(depId)) {
            newSelectedFeatures.push(depId);
          }
        });
      }
      
      // Remove conflicting features
      if (feature.conflicts) {
        feature.conflicts.forEach(conflictId => {
          newSelectedFeatures = newSelectedFeatures.filter(id => id !== conflictId);
        });
      }
    }

    setFeaturesWithDependencies(newSelectedFeatures);
    onFeaturesChange(newSelectedFeatures);
  };

  // Get site type name for display
  const getSiteTypeName = () => {
    const types: Record<string, { ar: string; en: string }> = {
      company_profile: { ar: 'موقع تعريفي/بورتفوليو', en: 'Company Profile/Portfolio' },
      blog_magazine: { ar: 'مدوّنة/مجلة', en: 'Blog/Magazine' },
      ecommerce: { ar: 'متجر إلكتروني', en: 'E-commerce Store' },
      elearning: { ar: 'منصّة تعليمية', en: 'E-learning Platform' },
      booking: { ar: 'منصّة حجز/خدمات', en: 'Booking/Services Platform' },
      custom_platform: { ar: 'منصّة مخصّصة/SaaS', en: 'Custom Platform/SaaS' }
    };
    return lang === 'ar' ? types[siteType]?.ar || siteType : types[siteType]?.en || siteType;
  };

  useEffect(() => {
    setFeaturesWithDependencies(selectedFeatures);
  }, [selectedFeatures]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h2 
          className="text-3xl font-bold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {lang === 'ar' ? 'اختر الميزات المطلوبة' : 'Select Required Features'}
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {lang === 'ar' ? 'اختر ما تحتاجه الآن. يمكن إضافة ميزات لاحقاً.' : 'Choose what you need now. Features can be added later.'}
        </motion.p>
        <Badge variant="outline" className="text-sm">
          {lang === 'ar' ? `نوع الموقع: ${getSiteTypeName()}` : `Site Type: ${getSiteTypeName()}`}
        </Badge>
      </div>

      {/* Essential Features Alert */}
      {features.some(f => f.isEssential) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {lang === 'ar' 
                ? 'الميزات المميزة بـ "أساسي" مُختارة تلقائياً ومطلوبة لهذا النوع من المواقع.'
                : 'Features marked as "Essential" are automatically selected and required for this type of website.'
              }
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Features by Category */}
      <div className="space-y-8">
        {sortedCategories.map((category, categoryIndex) => {
          const categoryInfo = getCategoryInfo(category);
          const categoryFeatures = featuresByCategory[category];
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 + 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {categoryInfo.name}
                <Badge variant="secondary" className="text-xs">
                  {categoryFeatures.length} {lang === 'ar' ? 'ميزة' : 'features'}
                </Badge>
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {categoryFeatures.map((feature, featureIndex) => {
                  const Icon = feature.icon;
                  const isSelected = featuresWithDependencies.includes(feature.id);
                  const isDisabled = feature.isEssential;
                  
                  return (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: featureIndex * 0.05 }}
                      whileHover={!isDisabled ? { scale: 1.02 } : {}}
                    >
                      <Card 
                        className={cn(
                          "transition-all duration-300 cursor-pointer",
                          categoryInfo.color,
                          isSelected && "ring-2 ring-primary",
                          isDisabled && "opacity-75 cursor-not-allowed"
                        )}
                        onClick={() => !isDisabled && handleFeatureToggle(feature.id)}
                        data-testid={`feature-chip-${feature.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Checkbox 
                              checked={isSelected}
                              disabled={isDisabled}
                              className="mt-1"
                              data-testid={`feature-checkbox-${feature.id}`}
                            />
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {feature.name}
                                </h4>
                                {feature.isEssential && (
                                  <Badge size="sm" variant="default">
                                    {lang === 'ar' ? 'أساسي' : 'Essential'}
                                  </Badge>
                                )}
                                {feature.isPremium && (
                                  <Badge size="sm" variant="secondary">
                                    {lang === 'ar' ? 'متقدم' : 'Premium'}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <motion.div 
        className="flex justify-between pt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className={cn(
            "px-8 py-3 text-lg font-medium",
            dir === 'rtl' ? 'flex-row-reverse' : ''
          )}
          data-testid="back-btn"
        >
          <ChevronLeft className={cn("w-5 h-5", dir === 'rtl' ? 'rotate-180 ml-2' : 'mr-2')} />
          {lang === 'ar' ? 'العودة' : 'Back'}
        </Button>
        
        <Button
          onClick={onNext}
          disabled={featuresWithDependencies.length === 0}
          size="lg"
          className={cn(
            "px-8 py-3 text-lg font-medium",
            dir === 'rtl' ? 'flex-row-reverse' : ''
          )}
          data-testid="next-btn"
        >
          {lang === 'ar' ? 'المتابعة إلى التفاصيل' : 'Continue to Details'}
          <ChevronRight className={cn("w-5 h-5", dir === 'rtl' ? 'rotate-180 mr-2' : 'ml-2')} />
        </Button>
      </motion.div>
    </div>
  );
}