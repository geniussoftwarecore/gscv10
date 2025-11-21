import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Megaphone,
  BarChart3,
  Target,
  Search,
  Users,
  TrendingUp,
  Globe,
  Smartphone,
  Video,
  Mail,
  MessageCircle,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  categoryAr: string;
  color: string;
}

export function FeatureGrid() {
  const { lang, dir } = useLanguage();

  const features: Feature[] = [
    {
      icon: Target,
      title: "Strategic Planning",
      titleAr: "التخطيط الاستراتيجي",
      description: "Comprehensive marketing strategies tailored to your business goals and target audience",
      descriptionAr: "استراتيجيات تسويقية شاملة مصممة خصيصاً لأهداف أعمالك والجمهور المستهدف",
      category: "Strategy",
      categoryAr: "الاستراتيجية",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Megaphone,
      title: "Social Media Management",
      titleAr: "إدارة وسائل التواصل",
      description: "Professional management of your social media presence across all platforms",
      descriptionAr: "إدارة احترافية لحضورك على وسائل التواصل الاجتماعي عبر جميع المنصات",
      category: "Social Media",
      categoryAr: "وسائل التواصل",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Search,
      title: "SEO Optimization",
      titleAr: "تحسين محركات البحث",
      description: "Improve your website's visibility and ranking on search engines",
      descriptionAr: "تحسين ظهور موقعك وترتيبه في محركات البحث",
      category: "SEO",
      categoryAr: "السيو",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Paid Advertising",
      titleAr: "الإعلانات المدفوعة",
      description: "Strategic ad campaigns on Google, Facebook, Instagram, and other platforms",
      descriptionAr: "حملات إعلانية استراتيجية على جوجل وفيسبوك وإنستغرام والمنصات الأخرى",
      category: "Advertising",
      categoryAr: "الإعلانات",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Video,
      title: "Content Creation",
      titleAr: "إنشاء المحتوى",
      description: "High-quality visual and written content that engages your audience",
      descriptionAr: "محتوى بصري ومكتوب عالي الجودة يجذب جمهورك",
      category: "Content",
      categoryAr: "المحتوى",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: TrendingUp,
      title: "Analytics & Reporting",
      titleAr: "التحليلات والتقارير",
      description: "Detailed performance tracking and insights to optimize your campaigns",
      descriptionAr: "تتبع شامل للأداء ورؤى لتحسين حملاتك التسويقية",
      category: "Analytics",
      categoryAr: "التحليلات",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Mail,
      title: "Email Marketing",
      titleAr: "التسويق عبر البريد",
      description: "Targeted email campaigns that convert prospects into customers",
      descriptionAr: "حملات بريد إلكتروني مستهدفة تحول العملاء المحتملين إلى عملاء فعليين",
      category: "Email",
      categoryAr: "البريد الإلكتروني",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Influencer Marketing",
      titleAr: "تسويق المؤثرين",
      description: "Connect with relevant influencers to expand your brand reach",
      descriptionAr: "التواصل مع المؤثرين المناسبين لتوسيع نطاق علامتك التجارية",
      category: "Influencer",
      categoryAr: "المؤثرين",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Globe,
      title: "Website Optimization",
      titleAr: "تحسين الموقع الإلكتروني",
      description: "Optimize your website for better user experience and conversions",
      descriptionAr: "تحسين موقعك الإلكتروني لتجربة مستخدم أفضل ومعدلات تحويل أعلى",
      category: "Web",
      categoryAr: "الويب",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Smartphone,
      title: "Mobile Marketing",
      titleAr: "التسويق عبر الجوال",
      description: "Mobile-first marketing strategies for the modern consumer",
      descriptionAr: "استراتيجيات تسويق تركز على الجوال للمستهلك العصري",
      category: "Mobile",
      categoryAr: "الجوال",
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: MessageCircle,
      title: "Community Management",
      titleAr: "إدارة المجتمع",
      description: "Build and nurture an engaged online community around your brand",
      descriptionAr: "بناء ورعاية مجتمع متفاعل عبر الإنترنت حول علامتك التجارية",
      category: "Community",
      categoryAr: "المجتمع",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: Share2,
      title: "Brand Awareness",
      titleAr: "الوعي بالعلامة التجارية",
      description: "Increase brand visibility and recognition across digital channels",
      descriptionAr: "زيادة ظهور العلامة التجارية والتعرف عليها عبر القنوات الرقمية",
      category: "Branding",
      categoryAr: "العلامة التجارية",
      color: "from-cyan-500 to-blue-500"
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
    <section className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-900/50" id="features">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="text-sky-600 border-sky-200 bg-sky-50 dark:text-sky-400 dark:border-sky-800 dark:bg-sky-950/20 mb-4">
            {lang === 'ar' ? 'خدماتنا التسويقية' : 'Our Marketing Services'}
          </Badge>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {lang === 'ar' ? 
              'حلول تسويقية شاملة لنمو أعمالك' :
              'Comprehensive Marketing Solutions for Your Growth'
            }
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {lang === 'ar' ? 
              'نقدم مجموعة متكاملة من الخدمات التسويقية الرقمية لمساعدتك في الوصول إلى جمهورك وتحقيق أهدافك التجارية' :
              'We offer a complete suite of digital marketing services to help you reach your audience and achieve your business goals'
            }
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <CardHeader className="pb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-r mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300",
                    feature.color
                  )}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <Badge variant="secondary" className="w-fit text-xs mb-2">
                    {lang === 'ar' ? feature.categoryAr : feature.category}
                  </Badge>
                  
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300">
                    {lang === 'ar' ? feature.titleAr : feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {lang === 'ar' ? feature.descriptionAr : feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {lang === 'ar' ? 
              'مستعد لتطوير استراتيجيتك التسويقية؟' :
              'Ready to elevate your marketing strategy?'
            }
          </p>
          
          <a 
            href="#get-started" 
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            data-testid="button-get-started"
          >
            {lang === 'ar' ? 'ابدأ خطتك التسويقية' : 'Start Your Marketing Plan'}
          </a>
        </motion.div>
      </div>
    </section>
  );
}