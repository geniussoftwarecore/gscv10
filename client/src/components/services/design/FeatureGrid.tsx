import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Palette,
  FileText,
  Globe,
  Printer,
  Package,
  Smartphone,
  Video,
  Layout,
  Brush,
  Target,
  Zap,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureGridProps {
  className?: string;
}

export function FeatureGrid({ className }: FeatureGridProps) {
  const { lang, dir } = useLanguage();

  const features = [
    {
      icon: Palette,
      title: lang === 'ar' ? 'تصميم الشعار' : 'Logo Design',
      description: lang === 'ar' ? 
        'شعارات احترافية ومميزة تعبر عن هوية علامتك التجارية بأشكال متعددة ومرونة في الاستخدام' :
        'Professional and distinctive logos that express your brand identity in multiple formats with flexible usage',
      features: lang === 'ar' ? 
        ['شعار أساسي', 'نسخة أفقية وعمودية', 'ملفات متعددة الأشكال', 'دليل الاستخدام'] :
        ['Primary logo', 'Horizontal & vertical versions', 'Multiple file formats', 'Usage guidelines'],
      category: 'essential',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    {
      icon: FileText,
      title: lang === 'ar' ? 'دليل الهوية البصرية' : 'Brand Guidelines',
      description: lang === 'ar' ? 
        'دليل شامل يحدد قواعد وإرشادات استخدام هويتك البصرية بطريقة صحيحة ومتسقة' :
        'Comprehensive guide defining rules and guidelines for using your visual identity correctly and consistently',
      features: lang === 'ar' ? 
        ['قواعد الألوان', 'الخطوط المعتمدة', 'استخدامات الشعار', 'الأمثلة التطبيقية'] :
        ['Color rules', 'Approved fonts', 'Logo usage', 'Application examples'],
      category: 'professional',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      icon: Globe,
      title: lang === 'ar' ? 'تطبيقات رقمية' : 'Digital Applications',
      description: lang === 'ar' ? 
        'تطبيق هويتك البصرية على المنصات الرقمية والمواقع الإلكترونية ووسائل التواصل الاجتماعي' :
        'Applying your visual identity to digital platforms, websites, and social media',
      features: lang === 'ar' ? 
        ['غلاف وسائل التواصل', 'صور البروفايل', 'قوالب المنشورات', 'أيقونات الويب'] :
        ['Social media covers', 'Profile pictures', 'Post templates', 'Web icons'],
      category: 'digital',
      color: 'bg-gradient-to-br from-green-500 to-emerald-500'
    },
    {
      icon: Printer,
      title: lang === 'ar' ? 'المطبوعات' : 'Print Materials',
      description: lang === 'ar' ? 
        'تصميم جميع المواد المطبوعة من بطاقات الأعمال إلى البروشورات والكتيبات التسويقية' :
        'Design all printed materials from business cards to brochures and marketing booklets',
      features: lang === 'ar' ? 
        ['بطاقات الأعمال', 'الأوراق الرسمية', 'بروشورات', 'مجلدات الشركة'] :
        ['Business cards', 'Letterheads', 'Brochures', 'Company folders'],
      category: 'print',
      color: 'bg-gradient-to-br from-orange-500 to-red-500'
    },
    {
      icon: Package,
      title: lang === 'ar' ? 'تصميم التغليف' : 'Packaging Design',
      description: lang === 'ar' ? 
        'تصاميم تغليف مبتكرة وجذابة تجعل منتجك يبرز في السوق ويجذب انتباه العملاء' :
        'Innovative and attractive packaging designs that make your product stand out in the market and attract customers',
      features: lang === 'ar' ? 
        ['تصميم العلبة', 'الملصقات', 'أكياس التسوق', 'عبوات المنتجات'] :
        ['Box design', 'Labels', 'Shopping bags', 'Product containers'],
      category: 'product',
      color: 'bg-gradient-to-br from-violet-500 to-purple-500'
    },
    {
      icon: Smartphone,
      title: lang === 'ar' ? 'هوية المحمول' : 'Mobile Identity',
      description: lang === 'ar' ? 
        'تطبيق هويتك البصرية على تطبيقات الهاتف المحمول والأجهزة اللوحية بأناقة واحترافية' :
        'Apply your visual identity to mobile applications and tablets with elegance and professionalism',
      features: lang === 'ar' ? 
        ['أيقونات التطبيق', 'شاشات البداية', 'واجهات المستخدم', 'عناصر التفاعل'] :
        ['App icons', 'Splash screens', 'User interfaces', 'Interactive elements'],
      category: 'mobile',
      color: 'bg-gradient-to-br from-indigo-500 to-blue-500'
    },
    {
      icon: Video,
      title: lang === 'ar' ? 'الشعار المتحرك' : 'Animated Logo',
      description: lang === 'ar' ? 
        'إضفاء الحيوية على شعارك من خلال الرسوم المتحركة الاحترافية للاستخدام في الفيديو والمواقع' :
        'Bring your logo to life with professional animations for video and website use',
      features: lang === 'ar' ? 
        ['حركة الشعار', 'انتقالات ناعمة', 'ملفات فيديو', 'ملفات GIF'] :
        ['Logo animation', 'Smooth transitions', 'Video files', 'GIF files'],
      category: 'premium',
      color: 'bg-gradient-to-br from-pink-500 to-rose-500'
    },
    {
      icon: Layout,
      title: lang === 'ar' ? 'قوالب التقديم' : 'Presentation Templates',
      description: lang === 'ar' ? 
        'قوالب عروض تقديمية احترافية تحمل هويتك البصرية لتقديم مشاريعك وخدماتك بطريقة مثالية' :
        'Professional presentation templates carrying your visual identity to showcase your projects and services perfectly',
      features: lang === 'ar' ? 
        ['شرائح PowerPoint', 'قوالب Keynote', 'ملفات Google Slides', 'الرسوم البيانية'] :
        ['PowerPoint slides', 'Keynote templates', 'Google Slides files', 'Infographics'],
      category: 'business',
      color: 'bg-gradient-to-br from-teal-500 to-cyan-500'
    },
    {
      icon: Brush,
      title: lang === 'ar' ? 'العناصر المرئية' : 'Visual Elements',
      description: lang === 'ar' ? 
        'مجموعة من العناصر المرئية المساعدة مثل الأنماط والأيقونات والرسوم التوضيحية' :
        'A collection of supporting visual elements such as patterns, icons, and illustrations',
      features: lang === 'ar' ? 
        ['أنماط وخلفيات', 'أيقونات مخصصة', 'رسوم توضيحية', 'عناصر تصميمية'] :
        ['Patterns & backgrounds', 'Custom icons', 'Illustrations', 'Design elements'],
      category: 'creative',
      color: 'bg-gradient-to-br from-amber-500 to-yellow-500'
    }
  ];

  const categoryLabels: Record<string, { ar: string; en: string }> = {
    essential: { ar: 'أساسي', en: 'Essential' },
    professional: { ar: 'احترافي', en: 'Professional' },
    digital: { ar: 'رقمي', en: 'Digital' },
    print: { ar: 'طباعة', en: 'Print' },
    product: { ar: 'منتج', en: 'Product' },
    mobile: { ar: 'محمول', en: 'Mobile' },
    premium: { ar: 'مميز', en: 'Premium' },
    business: { ar: 'أعمال', en: 'Business' },
    creative: { ar: 'إبداعي', en: 'Creative' }
  };

  return (
    <section className={cn("py-20 bg-gray-50 dark:bg-gray-900", className)} id="features-section">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge 
            variant="secondary" 
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-4 py-2 text-sm font-medium mb-4"
          >
            {lang === 'ar' ? 'خدماتنا المتكاملة' : 'Our Comprehensive Services'}
          </Badge>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {lang === 'ar' ? 'حلول تصميم شاملة' : 'Complete Design Solutions'}
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {lang === 'ar' ? 
              'نقدم مجموعة شاملة من خدمات التصميم الجرافيكي والهوية البصرية لتلبية جميع احتياجات علامتك التجارية' :
              'We offer a comprehensive range of graphic design and visual identity services to meet all your brand needs'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-none shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                      "inline-flex items-center justify-center w-14 h-14 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300",
                      feature.color
                    )}>
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-xs font-medium px-2 py-1"
                    >
                      {lang === 'ar' ? categoryLabels[feature.category].ar : categoryLabels[feature.category].en}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                      {lang === 'ar' ? 'يشمل:' : 'Includes:'}
                    </h4>
                    <ul className="space-y-1">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Target className="w-6 h-6" />
              <h3 className="text-2xl font-bold">
                {lang === 'ar' ? 'هل تحتاج تخصيص إضافي؟' : 'Need Additional Customization?'}
              </h3>
            </div>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {lang === 'ar' ? 
                'يمكننا تخصيص أي من خدماتنا لتناسب احتياجاتك الخاصة وميزانيتك. فريقنا جاهز لمناقشة متطلباتك الفريدة' :
                'We can customize any of our services to fit your specific needs and budget. Our team is ready to discuss your unique requirements'
              }
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-100">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">
                {lang === 'ar' ? 'استشارة مجانية لمدة 30 دقيقة' : 'Free 30-minute consultation'}
              </span>
              <Shield className="w-5 h-5" />
              <span className="font-semibold">
                {lang === 'ar' ? 'ضمان الجودة 100%' : '100% quality guarantee'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}