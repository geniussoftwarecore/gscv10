import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  GraduationCap, 
  Heart, 
  Banknote, 
  Truck, 
  Play, 
  Wrench, 
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  examples: string[];
  isPopular?: boolean;
}

interface AppTypeSelectionProps {
  selectedType: string | null;
  onSelectType: (typeId: string) => void;
  onNext: () => void;
}

export function AppTypeSelection({ selectedType, onSelectType, onNext }: AppTypeSelectionProps) {
  const { lang, dir } = useLanguage();

  const getAppTypes = (): AppType[] => [
    {
      id: 'ecommerce',
      name: lang === 'ar' ? 'تجارة إلكترونية' : 'E-commerce',
      description: lang === 'ar' ? 'متاجر أونلاين، مدفوعات، إدارة مخزون' : 'Online stores, payments, inventory management',
      icon: ShoppingBag,
      features: lang === 'ar' ? 
        ['سلة تسوق متقدمة', 'بوابات دفع آمنة', 'إدارة المخزون', 'تقارير المبيعات'] :
        ['Advanced Shopping Cart', 'Secure Payment Gateways', 'Inventory Management', 'Sales Reports'],
      examples: lang === 'ar' ? 
        ['متجر متعدد البائعين', 'متجر D2C سريع', 'تطبيق توصيل طعام'] :
        ['Multi-vendor Marketplace', 'Quick D2C Store', 'Food Delivery App'],
      isPopular: true
    },
    {
      id: 'services',
      name: lang === 'ar' ? 'خدمات عند الطلب' : 'On-Demand Services',
      description: lang === 'ar' ? 'حجوزات، تتبع مزودين، مدفوعات' : 'Bookings, provider tracking, payments',
      icon: Wrench,
      features: lang === 'ar' ? 
        ['حجز مواعيد', 'تتبع GPS', 'تقييم مزودين', 'دفع آمن'] :
        ['Appointment Booking', 'GPS Tracking', 'Provider Reviews', 'Secure Payment'],
      examples: lang === 'ar' ? 
        ['صيانة منزلية', 'خدمات تنظيف', 'استشارات مهنية'] :
        ['Home Maintenance', 'Cleaning Services', 'Professional Consulting'],
    },
    {
      id: 'education',
      name: lang === 'ar' ? 'تعليم وتدريب' : 'Education & Training',
      description: lang === 'ar' ? 'كورسات، اختبارات، شهادات' : 'Courses, exams, certificates',
      icon: GraduationCap,
      features: lang === 'ar' ? 
        ['بث مباشر', 'اختبارات تفاعلية', 'تتبع التقدم', 'شهادات معتمدة'] :
        ['Live Streaming', 'Interactive Exams', 'Progress Tracking', 'Certified Certificates'],
      examples: lang === 'ar' ? 
        ['منصة تعلم إلكتروني', 'مدرسة افتراضية', 'تعلم لغات'] :
        ['E-Learning Platform', 'Virtual School', 'Language Learning'],
      isPopular: true
    },
    {
      id: 'health',
      name: lang === 'ar' ? 'صحة ولياقة' : 'Health & Fitness',
      description: lang === 'ar' ? 'مواعيد طبية، متابعة صحية، لياقة' : 'Medical appointments, health tracking, fitness',
      icon: Heart,
      features: lang === 'ar' ? 
        ['مكالمات فيديو طبية', 'تتبع الأعراض', 'برامج تدريب', 'تذكير بالأدوية'] :
        ['Medical Video Calls', 'Symptom Tracking', 'Training Programs', 'Medicine Reminders'],
      examples: lang === 'ar' ? 
        ['عيادة عن بُعد', 'متتبع لياقة', 'متابعة صحية'] :
        ['Telemedicine Clinic', 'Fitness Tracker', 'Health Monitoring'],
    },
    {
      id: 'fintech',
      name: lang === 'ar' ? 'مالية ومدفوعات' : 'Fintech & Payments',
      description: lang === 'ar' ? 'محافظ رقمية، تحويلات، محاسبة' : 'Digital wallets, transfers, accounting',
      icon: Banknote,
      features: lang === 'ar' ? 
        ['محفظة رقمية', 'تحويلات آمنة', 'تتبع المصروفات', 'تقارير مالية'] :
        ['Digital Wallet', 'Secure Transfers', 'Expense Tracking', 'Financial Reports'],
      examples: lang === 'ar' ? 
        ['محفظة ومدفوعات', 'محاسبة شخصية', 'تحويلات مالية'] :
        ['Wallet & Payments', 'Personal Finance', 'Money Transfer'],
    },
    {
      id: 'logistics',
      name: lang === 'ar' ? 'لوجستيات ونقل' : 'Logistics & Transport',
      description: lang === 'ar' ? 'توصيل، تتبع أسطول، مخازن' : 'Delivery, fleet tracking, warehouses',
      icon: Truck,
      features: lang === 'ar' ? 
        ['تتبع GPS حي', 'إدارة السائقين', 'تحسين المسارات', 'إدارة المخازن'] :
        ['Live GPS Tracking', 'Driver Management', 'Route Optimization', 'Warehouse Management'],
      examples: lang === 'ar' ? 
        ['توصيل طلبات', 'نقل ركاب', 'إدارة مخازن'] :
        ['Package Delivery', 'Ride Sharing', 'Warehouse Management'],
    },
    {
      id: 'media',
      name: lang === 'ar' ? 'وسائط وترفيه' : 'Media & Entertainment',
      description: lang === 'ar' ? 'بث، محتوى، تفاعل اجتماعي' : 'Streaming, content, social interaction',
      icon: Play,
      features: lang === 'ar' ? 
        ['رفع وسائط', 'بث مباشر', 'تعليقات وتفاعل', 'قوائم تشغيل'] :
        ['Media Upload', 'Live Streaming', 'Comments & Interaction', 'Playlists'],
      examples: lang === 'ar' ? 
        ['منصة محتوى', 'تطبيق بودكاست', 'شبكة اجتماعية'] :
        ['Content Platform', 'Podcast App', 'Social Network'],
    }
  ];

  const appTypes = getAppTypes();

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
          {lang === 'ar' ? 'اختر نوع التطبيق' : 'Choose Your App Type'}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {lang === 'ar' 
            ? 'حدد نوع التطبيق المناسب لمشروعك لنتمكن من تخصيص الميزات المطلوبة'
            : 'Select the app type that best fits your project so we can customize the right features for you'
          }
        </p>
      </motion.div>

      {/* App Types Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appTypes.map((appType, index) => {
          const IconComponent = appType.icon;
          const isSelected = selectedType === appType.id;

          return (
            <motion.div
              key={appType.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                  isSelected && "ring-2 ring-primary border-primary shadow-lg"
                )}
                onClick={() => onSelectType(appType.id)}
                data-testid={`card-app-type-${appType.id}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                        isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                      )}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      {appType.isPopular && (
                        <Badge variant="secondary" className="text-xs">
                          {lang === 'ar' ? 'شائع' : 'Popular'}
                        </Badge>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-xl">{appType.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {appType.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Features */}
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-2">
                      {lang === 'ar' ? 'الميزات الرئيسية:' : 'Key Features:'}
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {appType.features.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {appType.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{appType.features.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Examples */}
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-2">
                      {lang === 'ar' ? 'أمثلة:' : 'Examples:'}
                    </h4>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {appType.examples.slice(0, 2).map((example, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-gray-400" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Continue Button */}
      {selectedType && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            size="lg"
            onClick={onNext}
            className="px-8 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl transition-all duration-300"
            data-testid="button-continue-step1"
          >
            {lang === 'ar' ? 'متابعة للميزات' : 'Continue to Features'}
            <ChevronRight className={cn(
              "w-5 h-5 ml-2 transition-transform",
              dir === 'rtl' && "rotate-180 ml-0 mr-2"
            )} />
          </Button>
        </motion.div>
      )}
    </div>
  );
}