import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from "@/i18n/lang";
import { cn } from '@/lib/utils';
import { MetaTags } from '@/components/seo/meta-tags';
import { 
  Heart,
  Target,
  Shield,
  Lightbulb,
  Users,
  Zap,
  Globe,
  Award
} from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: { ar: 'الشغف والالتزام', en: 'Passion & Commitment' },
    description: { 
      ar: 'نؤمن بأن الشغف هو المحرك الأساسي للإبداع والتميز في كل ما نقوم به',
      en: 'We believe passion is the fundamental driver of creativity and excellence in everything we do'
    },
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: Target,
    title: { ar: 'التركيز على النتائج', en: 'Results-Driven' },
    description: { 
      ar: 'نركز على تحقيق نتائج ملموسة وقابلة للقياس تحقق أهداف عملائنا',
      en: 'We focus on achieving tangible, measurable results that fulfill our clients\' objectives'
    },
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Shield,
    title: { ar: 'الجودة والموثوقية', en: 'Quality & Reliability' },
    description: { 
      ar: 'نلتزم بأعلى معايير الجودة ونضمن الموثوقية في جميع حلولنا التقنية',
      en: 'We commit to the highest quality standards and ensure reliability in all our technical solutions'
    },
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Lightbulb,
    title: { ar: 'الابتكار المستمر', en: 'Continuous Innovation' },
    description: { 
      ar: 'نسعى لاستكشاف أحدث التقنيات وتطبيق أساليب مبتكرة في حل المشاكل',
      en: 'We strive to explore the latest technologies and apply innovative methods in problem-solving'
    },
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Users,
    title: { ar: 'العمل الجماعي', en: 'Teamwork' },
    description: { 
      ar: 'نؤمن بقوة العمل الجماعي والتعاون لتحقيق أفضل النتائج',
      en: 'We believe in the power of teamwork and collaboration to achieve the best results'
    },
    color: 'from-purple-500 to-violet-500'
  },
  {
    icon: Zap,
    title: { ar: 'السرعة والكفاءة', en: 'Speed & Efficiency' },
    description: { 
      ar: 'نقدم خدمات سريعة وفعالة دون المساومة على الجودة',
      en: 'We deliver fast and efficient services without compromising on quality'
    },
    color: 'from-indigo-500 to-blue-600'
  },
  {
    icon: Globe,
    title: { ar: 'التفكير العالمي', en: 'Global Mindset' },
    description: { 
      ar: 'نفكر بطريقة عالمية ونطبق أفضل الممارسات الدولية',
      en: 'We think globally and apply international best practices'
    },
    color: 'from-teal-500 to-cyan-600'
  },
  {
    icon: Award,
    title: { ar: 'التميز في الخدمة', en: 'Service Excellence' },
    description: { 
      ar: 'نسعى لتقديم خدمة عملاء استثنائية تتجاوز توقعاتهم',
      en: 'We strive to deliver exceptional customer service that exceeds expectations'
    },
    color: 'from-rose-500 to-pink-600'
  }
];

const vision = {
  title: { ar: 'رؤيتنا', en: 'Our Vision' },
  description: { 
    ar: 'أن نكون الشريك التقني الموثوق الأول في المنطقة، نمكن الشركات من تحقيق التحول الرقمي بنجاح',
    en: 'To be the premier trusted technology partner in the region, empowering companies to achieve successful digital transformation'
  }
};

const mission = {
  title: { ar: 'مهمتنا', en: 'Our Mission' },
  description: { 
    ar: 'نقدم حلول برمجية مبتكرة ومخصصة تساعد عملائنا على النمو والازدهار في العصر الرقمي',
    en: 'We deliver innovative and customized software solutions that help our clients grow and thrive in the digital age'
  }
};

export default function OurValues() {
  const { lang, dir } = useLanguage();

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800")}>
      <MetaTags 
        title={language === 'ar' ? 'قيمنا ورؤيتنا - جينيوس سوفت وير كور' : 'Our Values & Vision - Genius Software Core'}
        description={language === 'ar' 
          ? 'تعرف على قيم ورؤية ومهمة جينيوس سوفت وير كور في مجال تطوير البرمجيات'
          : 'Learn about Genius Software Core\'s values, vision, and mission in software development'
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold mb-6",
              "bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent",
              dir ? "font-cairo" : "font-inter"
            )}>
              {language === 'ar' ? 'قيمنا ورؤيتنا' : 'Our Values & Vision'}
            </h1>
            <p className={cn(
              "text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto",
              dir ? "font-cairo" : "font-inter"
            )}>
              {language === 'ar' 
                ? 'المبادئ والقيم التي توجه عملنا وتشكل هويتنا كشركة رائدة في التكنولوجيا'
                : 'The principles and values that guide our work and shape our identity as a leading technology company'
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: dir ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full bg-gradient-to-br from-sky-500 to-blue-600 text-white border-0">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Target className="h-8 w-8 mr-3" />
                    <h2 className={cn(
                      "text-2xl md:text-3xl font-bold",
                      dir ? "font-cairo" : "font-inter"
                    )}>
                      {vision.title[language]}
                    </h2>
                  </div>
                  <p className={cn(
                    "text-lg leading-relaxed",
                    dir ? "font-cairo" : "font-inter"
                  )}>
                    {vision.description[language]}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: dir ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Lightbulb className="h-8 w-8 mr-3" />
                    <h2 className={cn(
                      "text-2xl md:text-3xl font-bold",
                      dir ? "font-cairo" : "font-inter"
                    )}>
                      {mission.title[language]}
                    </h2>
                  </div>
                  <p className={cn(
                    "text-lg leading-relaxed",
                    dir ? "font-cairo" : "font-inter"
                  )}>
                    {mission.description[language]}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={cn(
              "text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white",
              dir ? "font-cairo" : "font-inter"
            )}>
              {language === 'ar' ? 'قيمنا الأساسية' : 'Our Core Values'}
            </h2>
            <p className={cn(
              "text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto",
              dir ? "font-cairo" : "font-inter"
            )}>
              {language === 'ar' 
                ? 'القيم التي نؤمن بها وتوجه قراراتنا وتفاعلنا مع عملائنا وشركائنا'
                : 'The values we believe in that guide our decisions and interactions with clients and partners'
              }
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  <CardContent className="p-0">
                    {/* Icon Section */}
                    <div className={cn(
                      "p-6 bg-gradient-to-r",
                      value.color
                    )}>
                      <value.icon className="h-12 w-12 text-white mx-auto" />
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-6">
                      <h3 className={cn(
                        "text-lg font-semibold text-slate-900 dark:text-white mb-3 text-center",
                        dir ? "font-cairo" : "font-inter"
                      )}>
                        {value.title[language]}
                      </h3>
                      <p className={cn(
                        "text-sm text-slate-600 dark:text-slate-300 text-center leading-relaxed",
                        dir ? "font-cairo" : "font-inter"
                      )}>
                        {value.description[language]}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={cn(
              "text-3xl md:text-4xl font-bold text-white mb-6",
              dir ? "font-cairo" : "font-inter"
            )}>
              {language === 'ar' ? 'تشاركنا نفس القيم؟' : 'Share the Same Values?'}
            </h2>
            <p className={cn(
              "text-lg text-slate-300 mb-8 max-w-2xl mx-auto",
              dir ? "font-cairo" : "font-inter"
            )}>
              {language === 'ar' 
                ? 'إذا كنت تشاركنا نفس الرؤية والقيم، فلنعمل معاً لتحقيق النجاح'
                : 'If you share our vision and values, let\'s work together to achieve success'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                className="inline-flex items-center px-8 py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="button-contact-us"
              >
                {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </motion.a>
              <motion.a
                href="/our-team"
                className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-slate-900 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="button-meet-team"
              >
                {language === 'ar' ? 'تعرف على فريقنا' : 'Meet Our Team'}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}