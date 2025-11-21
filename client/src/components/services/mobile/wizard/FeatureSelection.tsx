import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ShoppingCart, 
  CreditCard, 
  BarChart3, 
  Users, 
  Bell, 
  MapPin, 
  Star, 
  Shield,
  Video,
  BookOpen,
  Calendar,
  FileText,
  Download,
  Cloud,
  Smartphone,
  Globe,
  ChevronLeft,
  ChevronRight,
  Info,
  Zap,
  Database,
  Settings
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
  dependencies?: string[]; // Features that this feature requires
  conflicts?: string[]; // Features that conflict with this one
}

interface FeatureSelectionProps {
  appType: string;
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function FeatureSelection({ 
  appType, 
  selectedFeatures, 
  onFeaturesChange, 
  onNext, 
  onBack 
}: FeatureSelectionProps) {
  const { lang, dir } = useLanguage();
  const [featuresWithDependencies, setFeaturesWithDependencies] = useState<string[]>(selectedFeatures);

  // Get features based on app type
  const getAppTypeFeatures = (): Feature[] => {
    const baseFeatures: Feature[] = [
      // User Management & Authentication
      {
        id: 'user_auth',
        name: lang === 'ar' ? 'تسجيل دخول المستخدمين' : 'User Authentication',
        description: lang === 'ar' ? 'تسجيل دخول آمن وإدارة الحسابات' : 'Secure login and account management',
        icon: Users,
        category: 'core',
        isEssential: true
      },
      {
        id: 'push_notifications',
        name: lang === 'ar' ? 'الإشعارات الفورية' : 'Push Notifications',
        description: lang === 'ar' ? 'تنبيهات فورية للمستخدمين' : 'Instant alerts to users',
        icon: Bell,
        category: 'communication'
      },
      {
        id: 'offline_support',
        name: lang === 'ar' ? 'دعم العمل بدون انترنت' : 'Offline Support',
        description: lang === 'ar' ? 'يعمل التطبيق بدون اتصال بالإنترنت' : 'App works without internet connection',
        icon: Download,
        category: 'technical'
      },
      {
        id: 'multi_language',
        name: lang === 'ar' ? 'دعم متعدد اللغات' : 'Multi-Language Support',
        description: lang === 'ar' ? 'العربية والإنجليزية والمزيد' : 'Arabic, English and more languages',
        icon: Globe,
        category: 'localization'
      },
      {
        id: 'dark_mode',
        name: lang === 'ar' ? 'الوضع المظلم' : 'Dark Mode',
        description: lang === 'ar' ? 'واجهة مظلمة مريحة للعين' : 'Eye-comfortable dark interface',
        icon: Settings,
        category: 'ui'
      },
    ];

    // App-specific features
    const appSpecificFeatures: Record<string, Feature[]> = {
      ecommerce: [
        {
          id: 'shopping_cart',
          name: lang === 'ar' ? 'سلة التسوق المتقدمة' : 'Advanced Shopping Cart',
          description: lang === 'ar' ? 'إدارة المنتجات والكميات' : 'Product and quantity management',
          icon: ShoppingCart,
          category: 'commerce',
          isEssential: true
        },
        {
          id: 'payment_gateway',
          name: lang === 'ar' ? 'بوابات الدفع' : 'Payment Gateways',
          description: lang === 'ar' ? 'فيزا، مدى، أبل باي والمزيد' : 'Visa, Mada, Apple Pay and more',
          icon: CreditCard,
          category: 'commerce',
          isEssential: true
        },
        {
          id: 'inventory_management',
          name: lang === 'ar' ? 'إدارة المخزون' : 'Inventory Management',
          description: lang === 'ar' ? 'تتبع المخزون والتنبيهات' : 'Stock tracking and alerts',
          icon: Database,
          category: 'management'
        },
        {
          id: 'order_tracking',
          name: lang === 'ar' ? 'تتبع الطلبات' : 'Order Tracking',
          description: lang === 'ar' ? 'متابعة حالة الطلبات' : 'Track order status',
          icon: MapPin,
          category: 'logistics'
        },
        {
          id: 'reviews_ratings',
          name: lang === 'ar' ? 'التقييمات والمراجعات' : 'Reviews & Ratings',
          description: lang === 'ar' ? 'تقييم المنتجات والخدمات' : 'Rate products and services',
          icon: Star,
          category: 'social'
        },
        {
          id: 'wishlist',
          name: lang === 'ar' ? 'قائمة الرغبات' : 'Wishlist',
          description: lang === 'ar' ? 'حفظ المنتجات المفضلة' : 'Save favorite products',
          icon: Bell,
          category: 'social'
        },
        {
          id: 'sales_analytics',
          name: lang === 'ar' ? 'تحليلات المبيعات' : 'Sales Analytics',
          description: lang === 'ar' ? 'تقارير وإحصائيات مفصلة' : 'Detailed reports and statistics',
          icon: BarChart3,
          category: 'analytics',
          dependencies: ['inventory_management']
        },
      ],
      services: [
        {
          id: 'appointment_booking',
          name: lang === 'ar' ? 'حجز المواعيد' : 'Appointment Booking',
          description: lang === 'ar' ? 'جدولة وإدارة المواعيد' : 'Schedule and manage appointments',
          icon: Calendar,
          category: 'booking',
          isEssential: true
        },
        {
          id: 'gps_tracking',
          name: lang === 'ar' ? 'تتبع GPS' : 'GPS Tracking',
          description: lang === 'ar' ? 'تتبع موقع مقدم الخدمة' : 'Track service provider location',
          icon: MapPin,
          category: 'location'
        },
        {
          id: 'video_calls',
          name: lang === 'ar' ? 'مكالمات فيديو' : 'Video Calls',
          description: lang === 'ar' ? 'استشارات عن بُعد' : 'Remote consultations',
          icon: Video,
          category: 'communication'
        },
        {
          id: 'service_reviews',
          name: lang === 'ar' ? 'تقييم مقدمي الخدمة' : 'Service Provider Reviews',
          description: lang === 'ar' ? 'تقييم جودة الخدمة' : 'Rate service quality',
          icon: Star,
          category: 'social'
        },
        {
          id: 'payment_processing',
          name: lang === 'ar' ? 'معالجة المدفوعات' : 'Payment Processing',
          description: lang === 'ar' ? 'دفع آمن للخدمات' : 'Secure payment for services',
          icon: CreditCard,
          category: 'commerce'
        },
        {
          id: 'service_history',
          name: lang === 'ar' ? 'سجل الخدمات' : 'Service History',
          description: lang === 'ar' ? 'سجل جميع الخدمات السابقة' : 'Record of all past services',
          icon: FileText,
          category: 'management'
        }
      ],
      education: [
        {
          id: 'course_management',
          name: lang === 'ar' ? 'إدارة الكورسات' : 'Course Management',
          description: lang === 'ar' ? 'إنشاء وتنظيم المحتوى التعليمي' : 'Create and organize educational content',
          icon: BookOpen,
          category: 'content',
          isEssential: true
        },
        {
          id: 'live_streaming',
          name: lang === 'ar' ? 'البث المباشر' : 'Live Streaming',
          description: lang === 'ar' ? 'دروس مباشرة تفاعلية' : 'Interactive live lessons',
          icon: Video,
          category: 'communication'
        },
        {
          id: 'interactive_quizzes',
          name: lang === 'ar' ? 'اختبارات تفاعلية' : 'Interactive Quizzes',
          description: lang === 'ar' ? 'اختبارات وتقييمات ذكية' : 'Smart tests and assessments',
          icon: FileText,
          category: 'assessment'
        },
        {
          id: 'progress_tracking',
          name: lang === 'ar' ? 'تتبع التقدم' : 'Progress Tracking',
          description: lang === 'ar' ? 'مراقبة تقدم الطلاب' : 'Monitor student progress',
          icon: BarChart3,
          category: 'analytics'
        },
        {
          id: 'certificates',
          name: lang === 'ar' ? 'الشهادات المعتمدة' : 'Certified Certificates',
          description: lang === 'ar' ? 'إصدار شهادات رسمية' : 'Issue official certificates',
          icon: Shield,
          category: 'certification',
          dependencies: ['interactive_quizzes', 'progress_tracking']
        },
        {
          id: 'discussion_forums',
          name: lang === 'ar' ? 'منتديات النقاش' : 'Discussion Forums',
          description: lang === 'ar' ? 'تفاعل بين الطلاب والمدرسين' : 'Student-teacher interaction',
          icon: Users,
          category: 'social'
        }
      ],
      health: [
        {
          id: 'appointment_system',
          name: lang === 'ar' ? 'نظام المواعيد الطبية' : 'Medical Appointment System',
          description: lang === 'ar' ? 'حجز مواعيد مع الأطباء' : 'Book appointments with doctors',
          icon: Calendar,
          category: 'medical',
          isEssential: true
        },
        {
          id: 'telemedicine',
          name: lang === 'ar' ? 'الطب عن بُعد' : 'Telemedicine',
          description: lang === 'ar' ? 'استشارات طبية عن بُعد' : 'Remote medical consultations',
          icon: Video,
          category: 'medical'
        },
        {
          id: 'health_records',
          name: lang === 'ar' ? 'السجلات الطبية' : 'Medical Records',
          description: lang === 'ar' ? 'حفظ وإدارة السجلات الطبية' : 'Store and manage medical records',
          icon: FileText,
          category: 'records'
        },
        {
          id: 'symptom_tracker',
          name: lang === 'ar' ? 'متتبع الأعراض' : 'Symptom Tracker',
          description: lang === 'ar' ? 'تسجيل ومراقبة الأعراض' : 'Log and monitor symptoms',
          icon: BarChart3,
          category: 'tracking'
        },
        {
          id: 'medication_reminders',
          name: lang === 'ar' ? 'تذكير الأدوية' : 'Medication Reminders',
          description: lang === 'ar' ? 'تنبيهات مواعيد الدواء' : 'Medicine schedule alerts',
          icon: Bell,
          category: 'reminders'
        },
        {
          id: 'fitness_tracking',
          name: lang === 'ar' ? 'تتبع اللياقة' : 'Fitness Tracking',
          description: lang === 'ar' ? 'مراقبة النشاط البدني' : 'Monitor physical activity',
          icon: Zap,
          category: 'fitness'
        }
      ],
      fintech: [
        {
          id: 'digital_wallet',
          name: lang === 'ar' ? 'المحفظة الرقمية' : 'Digital Wallet',
          description: lang === 'ar' ? 'حفظ الأموال والبطاقات' : 'Store money and cards',
          icon: CreditCard,
          category: 'wallet',
          isEssential: true
        },
        {
          id: 'money_transfers',
          name: lang === 'ar' ? 'تحويل الأموال' : 'Money Transfers',
          description: lang === 'ar' ? 'تحويلات آمنة وسريعة' : 'Secure and fast transfers',
          icon: Smartphone,
          category: 'transfers'
        },
        {
          id: 'expense_tracking',
          name: lang === 'ar' ? 'تتبع المصروفات' : 'Expense Tracking',
          description: lang === 'ar' ? 'مراقبة الإنفاق والميزانية' : 'Monitor spending and budget',
          icon: BarChart3,
          category: 'budgeting'
        },
        {
          id: 'bill_payments',
          name: lang === 'ar' ? 'دفع الفواتير' : 'Bill Payments',
          description: lang === 'ar' ? 'دفع فواتير الخدمات' : 'Pay utility bills',
          icon: FileText,
          category: 'payments'
        },
        {
          id: 'financial_reports',
          name: lang === 'ar' ? 'التقارير المالية' : 'Financial Reports',
          description: lang === 'ar' ? 'تقارير مفصلة للمعاملات' : 'Detailed transaction reports',
          icon: BarChart3,
          category: 'analytics',
          dependencies: ['expense_tracking']
        },
        {
          id: 'investment_tracking',
          name: lang === 'ar' ? 'تتبع الاستثمارات' : 'Investment Tracking',
          description: lang === 'ar' ? 'مراقبة محفظة الاستثمار' : 'Monitor investment portfolio',
          icon: BarChart3,
          category: 'investment',
          isPremium: true
        }
      ],
      logistics: [
        {
          id: 'live_tracking',
          name: lang === 'ar' ? 'التتبع المباشر' : 'Live Tracking',
          description: lang === 'ar' ? 'تتبع الطلبات في الوقت الفعلي' : 'Real-time order tracking',
          icon: MapPin,
          category: 'tracking',
          isEssential: true
        },
        {
          id: 'route_optimization',
          name: lang === 'ar' ? 'تحسين المسارات' : 'Route Optimization',
          description: lang === 'ar' ? 'أفضل مسارات التوصيل' : 'Best delivery routes',
          icon: MapPin,
          category: 'optimization'
        },
        {
          id: 'fleet_management',
          name: lang === 'ar' ? 'إدارة الأسطول' : 'Fleet Management',
          description: lang === 'ar' ? 'إدارة السائقين والمركبات' : 'Manage drivers and vehicles',
          icon: Users,
          category: 'management'
        },
        {
          id: 'delivery_proof',
          name: lang === 'ar' ? 'إثبات التسليم' : 'Delivery Proof',
          description: lang === 'ar' ? 'صور وتوقيع عند التسليم' : 'Photos and signature on delivery',
          icon: Shield,
          category: 'verification'
        },
        {
          id: 'inventory_sync',
          name: lang === 'ar' ? 'مزامنة المخزون' : 'Inventory Sync',
          description: lang === 'ar' ? 'ربط مع أنظمة المخازن' : 'Connect with warehouse systems',
          icon: Database,
          category: 'integration'
        },
        {
          id: 'customer_notifications',
          name: lang === 'ar' ? 'تنبيهات العملاء' : 'Customer Notifications',
          description: lang === 'ar' ? 'إشعارات SMS وواتساب' : 'SMS and WhatsApp notifications',
          icon: Bell,
          category: 'communication'
        }
      ],
      media: [
        {
          id: 'content_upload',
          name: lang === 'ar' ? 'رفع المحتوى' : 'Content Upload',
          description: lang === 'ar' ? 'رفع الفيديوهات والصور' : 'Upload videos and images',
          icon: Cloud,
          category: 'content',
          isEssential: true
        },
        {
          id: 'live_streaming_media',
          name: lang === 'ar' ? 'البث المباشر' : 'Live Streaming',
          description: lang === 'ar' ? 'بث مباشر عالي الجودة' : 'High-quality live broadcasting',
          icon: Video,
          category: 'streaming'
        },
        {
          id: 'social_features',
          name: lang === 'ar' ? 'ميزات اجتماعية' : 'Social Features',
          description: lang === 'ar' ? 'تعليقات وإعجابات ومشاركة' : 'Comments, likes and sharing',
          icon: Users,
          category: 'social'
        },
        {
          id: 'content_moderation',
          name: lang === 'ar' ? 'إدارة المحتوى' : 'Content Moderation',
          description: lang === 'ar' ? 'فلترة ومراجعة المحتوى' : 'Content filtering and review',
          icon: Shield,
          category: 'moderation'
        },
        {
          id: 'media_analytics',
          name: lang === 'ar' ? 'تحليلات المحتوى' : 'Content Analytics',
          description: lang === 'ar' ? 'إحصائيات المشاهدة والتفاعل' : 'View and engagement statistics',
          icon: BarChart3,
          category: 'analytics'
        },
        {
          id: 'monetization',
          name: lang === 'ar' ? 'تحقيق الدخل' : 'Monetization',
          description: lang === 'ar' ? 'إعلانات واشتراكات مدفوعة' : 'Ads and paid subscriptions',
          icon: CreditCard,
          category: 'revenue',
          isPremium: true
        }
      ]
    };

    return [...baseFeatures, ...(appSpecificFeatures[appType] || [])];
  };

  const features = getAppTypeFeatures();

  // Handle feature selection with dependency checking
  const handleFeatureToggle = (featureId: string, checked: boolean) => {
    let newSelection = [...featuresWithDependencies];

    if (checked) {
      // Add feature
      if (!newSelection.includes(featureId)) {
        newSelection.push(featureId);
      }

      // Add dependencies
      const feature = features.find(f => f.id === featureId);
      if (feature?.dependencies) {
        feature.dependencies.forEach(depId => {
          if (!newSelection.includes(depId)) {
            newSelection.push(depId);
          }
        });
      }
    } else {
      // Remove feature
      newSelection = newSelection.filter(id => id !== featureId);

      // Remove features that depend on this one
      features.forEach(f => {
        if (f.dependencies?.includes(featureId) && newSelection.includes(f.id)) {
          newSelection = newSelection.filter(id => id !== f.id);
        }
      });
    }

    setFeaturesWithDependencies(newSelection);
    onFeaturesChange(newSelection);
  };

  // Group features by category
  const featuresByCategory = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  const getCategoryName = (category: string) => {
    const names: Record<string, { ar: string; en: string }> = {
      core: { ar: 'أساسيات', en: 'Core Features' },
      commerce: { ar: 'التجارة', en: 'Commerce' },
      communication: { ar: 'التواصل', en: 'Communication' },
      management: { ar: 'الإدارة', en: 'Management' },
      analytics: { ar: 'التحليلات', en: 'Analytics' },
      social: { ar: 'اجتماعي', en: 'Social' },
      technical: { ar: 'تقني', en: 'Technical' },
      localization: { ar: 'اللغات', en: 'Localization' },
      ui: { ar: 'واجهة', en: 'User Interface' },
      booking: { ar: 'الحجوزات', en: 'Booking' },
      location: { ar: 'الموقع', en: 'Location' },
      content: { ar: 'المحتوى', en: 'Content' },
      assessment: { ar: 'التقييم', en: 'Assessment' },
      certification: { ar: 'الشهادات', en: 'Certification' },
      medical: { ar: 'طبي', en: 'Medical' },
      records: { ar: 'السجلات', en: 'Records' },
      tracking: { ar: 'التتبع', en: 'Tracking' },
      reminders: { ar: 'التذكير', en: 'Reminders' },
      fitness: { ar: 'اللياقة', en: 'Fitness' },
      wallet: { ar: 'المحفظة', en: 'Wallet' },
      transfers: { ar: 'التحويلات', en: 'Transfers' },
      budgeting: { ar: 'الميزانية', en: 'Budgeting' },
      payments: { ar: 'المدفوعات', en: 'Payments' },
      investment: { ar: 'الاستثمار', en: 'Investment' },
      optimization: { ar: 'التحسين', en: 'Optimization' },
      verification: { ar: 'التحقق', en: 'Verification' },
      integration: { ar: 'التكامل', en: 'Integration' },
      streaming: { ar: 'البث', en: 'Streaming' },
      moderation: { ar: 'المراجعة', en: 'Moderation' },
      revenue: { ar: 'الإيرادات', en: 'Revenue' },
      logistics: { ar: 'اللوجستيات', en: 'Logistics' }
    };
    return lang === 'ar' ? names[category]?.ar || category : names[category]?.en || category;
  };

  const essentialCount = featuresWithDependencies.filter(id => 
    features.find(f => f.id === id)?.isEssential
  ).length;
  const totalSelected = featuresWithDependencies.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          {lang === 'ar' ? 'اختر الميزات المطلوبة' : 'Choose Required Features'}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {lang === 'ar' 
            ? 'حدد الميزات التي تحتاجها في تطبيقك. الميزات الأساسية مُختارة تلقائياً'
            : 'Select the features you need in your app. Essential features are selected automatically'
          }
        </p>
        
        {/* Selection Summary */}
        <div className="flex justify-center gap-4">
          <Badge variant="outline" className="text-sm">
            {lang === 'ar' ? `المجموع: ${totalSelected}` : `Total: ${totalSelected}`}
          </Badge>
          <Badge variant="default" className="text-sm">
            {lang === 'ar' ? `أساسية: ${essentialCount}` : `Essential: ${essentialCount}`}
          </Badge>
        </div>
      </motion.div>

      {/* Features by Category */}
      <div className="space-y-8">
        {Object.entries(featuresByCategory).map(([category, categoryFeatures], index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              {getCategoryName(category)}
              <Badge variant="secondary" className="text-xs">
                {categoryFeatures.length}
              </Badge>
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryFeatures.map((feature) => {
                const IconComponent = feature.icon;
                const isSelected = featuresWithDependencies.includes(feature.id);
                const isDisabled = feature.isEssential;
                const hasDependencies = feature.dependencies && feature.dependencies.length > 0;

                return (
                  <Card 
                    key={feature.id}
                    className={cn(
                      "transition-all duration-300",
                      isSelected && "ring-1 ring-primary border-primary/50",
                      isDisabled && "bg-gray-50 dark:bg-gray-800/50"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Checkbox
                            checked={isSelected}
                            disabled={isDisabled}
                            onCheckedChange={(checked) => 
                              handleFeatureToggle(feature.id, checked as boolean)
                            }
                            data-testid={`checkbox-feature-${feature.id}`}
                          />
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                            isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                          )}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                        </div>
                        
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 leading-tight">
                              {feature.name}
                            </h4>
                            {feature.isEssential && (
                              <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                {lang === 'ar' ? 'أساسي' : 'Essential'}
                              </Badge>
                            )}
                            {feature.isPremium && (
                              <Badge className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                                {lang === 'ar' ? 'مميز' : 'Premium'}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
                            {feature.description}
                          </p>
                          
                          {hasDependencies && (
                            <div className="flex items-center gap-1 mt-2">
                              <Info className="w-3 h-3 text-blue-500" />
                              <span className="text-xs text-blue-600 dark:text-blue-400">
                                {lang === 'ar' ? 'يتطلب ميزات أخرى' : 'Requires other features'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alert for dependencies */}
      {featuresWithDependencies.length > selectedFeatures.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {lang === 'ar' 
                ? 'تم إضافة ميزات مطلوبة تلقائياً لضمان عمل التطبيق بشكل صحيح'
                : 'Required features have been automatically added to ensure proper app functionality'
              }
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          className="px-6 py-3 rounded-2xl"
          data-testid="button-back-step2"
        >
          <ChevronLeft className={cn(
            "w-5 h-5 mr-2",
            dir === 'rtl' && "rotate-180 mr-0 ml-2"
          )} />
          {lang === 'ar' ? 'العودة' : 'Back'}
        </Button>

        <Button
          size="lg"
          onClick={onNext}
          disabled={totalSelected === 0}
          className="px-8 py-3 rounded-2xl bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl transition-all duration-300"
          data-testid="button-continue-step2"
        >
          {lang === 'ar' ? 'متابعة للتفاصيل' : 'Continue to Details'}
          <ChevronRight className={cn(
            "w-5 h-5 ml-2",
            dir === 'rtl' && "rotate-180 ml-0 mr-2"
          )} />
        </Button>
      </motion.div>
    </div>
  );
}