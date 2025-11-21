import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  BookOpen, 
  ShoppingBag, 
  GraduationCap, 
  Calendar, 
  Building, 
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  examples: string[];
  isPopular?: boolean;
}

interface TypeStepProps {
  selectedType: string | null;
  onSelectType: (typeId: string) => void;
  onNext: () => void;
}

export function TypeStep({ selectedType, onSelectType, onNext }: TypeStepProps) {
  const { lang, dir } = useLanguage();

  const getSiteTypes = (): SiteType[] => [
    {
      id: 'company_profile',
      name: lang === 'ar' ? 'موقع تعريفي/بورتفوليو' : 'Company Profile/Portfolio',
      description: lang === 'ar' ? 'مواقع تعريفية للشركات والأفراد' : 'Professional company and personal websites',
      icon: Building,
      features: lang === 'ar' ? 
        ['صفحات مؤسسية احترافية', 'عرض أعمال وخدمات', 'نماذج تواصل', 'شهادات وتقييمات'] :
        ['Professional corporate pages', 'Portfolio showcase', 'Contact forms', 'Testimonials & reviews'],
      examples: lang === 'ar' ? 
        ['موقع شركة استشارية', 'بورتفوليو مصمم', 'موقع عيادة طبية'] :
        ['Consulting company site', 'Designer portfolio', 'Medical clinic website'],
      isPopular: true
    },
    {
      id: 'blog_magazine',
      name: lang === 'ar' ? 'مدوّنة/مجلة' : 'Blog/Magazine',
      description: lang === 'ar' ? 'منصات نشر المحتوى والمقالات' : 'Content publishing platforms',
      icon: BookOpen,
      features: lang === 'ar' ? 
        ['إدارة المقالات', 'تصنيفات وعلامات', 'تعليقات القراء', 'اشتراكات نشرة بريدية'] :
        ['Article management', 'Categories & tags', 'Reader comments', 'Newsletter subscriptions'],
      examples: lang === 'ar' ? 
        ['مدونة تقنية', 'مجلة إخبارية', 'موقع محتوى تعليمي'] :
        ['Tech blog', 'News magazine', 'Educational content site'],
    },
    {
      id: 'ecommerce',
      name: lang === 'ar' ? 'متجر إلكتروني' : 'E-commerce Store',
      description: lang === 'ar' ? 'منصات التجارة الإلكترونية والمبيعات' : 'Online sales and e-commerce platforms',
      icon: ShoppingBag,
      features: lang === 'ar' ? 
        ['كتالوج منتجات', 'سلة تسوق ودفع', 'إدارة مخزون', 'كوبونات وعروض'] :
        ['Product catalog', 'Shopping cart & payment', 'Inventory management', 'Coupons & offers'],
      examples: lang === 'ar' ? 
        ['متجر أزياء', 'متجر إلكترونيات', 'متجر منتجات رقمية'] :
        ['Fashion store', 'Electronics shop', 'Digital products store'],
      isPopular: true
    },
    {
      id: 'elearning',
      name: lang === 'ar' ? 'منصّة تعليمية' : 'E-learning Platform',
      description: lang === 'ar' ? 'منصات التعلم والتدريب الإلكتروني' : 'Online learning and training platforms',
      icon: GraduationCap,
      features: lang === 'ar' ? 
        ['كورسات تفاعلية', 'اختبارات وتقييمات', 'تتبع التقدم', 'شهادات معتمدة'] :
        ['Interactive courses', 'Quizzes & assessments', 'Progress tracking', 'Certificates'],
      examples: lang === 'ar' ? 
        ['أكاديمية تعلم لغات', 'منصة دورات مهنية', 'مدرسة افتراضية'] :
        ['Language learning academy', 'Professional courses platform', 'Virtual school'],
    },
    {
      id: 'booking',
      name: lang === 'ar' ? 'منصّة حجز/خدمات' : 'Booking/Services Platform',
      description: lang === 'ar' ? 'مواقع الحجوزات والخدمات عند الطلب' : 'Booking and on-demand services websites',
      icon: Calendar,
      features: lang === 'ar' ? 
        ['نظام حجز مواعيد', 'إدارة مقدمي خدمات', 'دفع آمن', 'تقييمات عملاء'] :
        ['Appointment booking', 'Service provider management', 'Secure payment', 'Customer reviews'],
      examples: lang === 'ar' ? 
        ['حجز مطاعم', 'موقع صيانة منزلية', 'منصة استشارات'] :
        ['Restaurant booking', 'Home maintenance site', 'Consultation platform'],
    },
    {
      id: 'custom_platform',
      name: lang === 'ar' ? 'منصّة مخصّصة/SaaS' : 'Custom Platform/SaaS',
      description: lang === 'ar' ? 'منصات مخصصة ونظم إدارة متقدمة' : 'Custom platforms and advanced management systems',
      icon: Globe,
      features: lang === 'ar' ? 
        ['وظائف مخصصة', 'لوحة إدارة متقدمة', 'API تكامل', 'تقارير تحليلية'] :
        ['Custom functionality', 'Advanced admin panel', 'API integration', 'Analytics reports'],
      examples: lang === 'ar' ? 
        ['نظام إدارة مدرسة', 'منصة CRM', 'نظام إدارة مشاريع'] :
        ['School management system', 'CRM platform', 'Project management system'],
      isPopular: true
    }
  ];

  const siteTypes = getSiteTypes();

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
          {lang === 'ar' ? 'اختر نوع الموقع/المنصّة' : 'Choose Website/Platform Type'}
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {lang === 'ar' ? 'اختر النوع الأقرب لفكرتك. يمكن تخصيص أي خيار لاحقاً.' : 'Choose the closest option to your idea. Any option can be customized later.'}
        </motion.p>
      </div>

      {/* Site Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {siteTypes.map((siteType, index) => {
          const Icon = siteType.icon;
          const isSelected = selectedType === siteType.id;
          
          return (
            <motion.div
              key={siteType.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-300 h-full relative",
                  isSelected 
                    ? "ring-2 ring-primary border-primary bg-primary/5" 
                    : "hover:shadow-lg border-gray-200 dark:border-gray-800",
                  "hover:border-primary/50"
                )}
                onClick={() => onSelectType(siteType.id)}
                data-testid={`type-card-${siteType.id}`}
              >
                {siteType.isPopular && (
                  <Badge 
                    className="absolute -top-2 right-4 bg-orange-500 text-white"
                    data-testid={`popular-badge-${siteType.id}`}
                  >
                    {lang === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
                  </Badge>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-gray-100 dark:bg-gray-800"
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        {siteType.name}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {siteType.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {lang === 'ar' ? 'الميزات الأساسية:' : 'Key Features:'}
                    </h4>
                    <ul className="space-y-1">
                      {siteType.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Examples */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {lang === 'ar' ? 'أمثلة:' : 'Examples:'}
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {siteType.examples.map((example, i) => (
                        <Badge 
                          key={i} 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Next Button */}
      <motion.div 
        className="flex justify-center pt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button
          onClick={onNext}
          disabled={!selectedType}
          size="lg"
          className={cn(
            "px-8 py-3 text-lg font-medium",
            dir === 'rtl' ? 'flex-row-reverse' : ''
          )}
          data-testid="next-btn"
        >
          {lang === 'ar' ? 'المتابعة إلى الميزات' : 'Continue to Features'}
          <ChevronRight className={cn("w-5 h-5", dir === 'rtl' ? 'rotate-180 mr-2' : 'ml-2')} />
        </Button>
      </motion.div>
    </div>
  );
}