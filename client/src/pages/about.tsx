import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { COMPANY_INFO, STATS } from "@/lib/constants";
import { motion } from "framer-motion";
import { Users, User, Palette, Smartphone, TrendingUp, MessageCircle, Eye, Heart, Target, Lightbulb, Shield, Zap } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/i18n/lang";
import logoGSC from "@assets/logo_1761853687120.webp";

export default function About() {
  const { t } = useTranslation();
  const { lang, dir } = useLanguage();
  const isRTL = dir === 'rtl';
  
  const workProcess = [
    {
      title: "الاستماع والفهم",
      description: "نبدأ بفهم عميق لاحتياجاتك وأهدافك، ونستمع لرؤيتك بعناية لضمان تقديم الحل الأمثل",
      icon: Users,
    },
    {
      title: "التخطيط الاستراتيجي",
      description: "نضع خطة عمل مفصلة ومدروسة تضمن تحقيق أهدافك ضمن الميزانية والوقت المحددين",
      icon: Target,
    },
    {
      title: "التصميم الإبداعي",
      description: "نصمم حلولاً مبتكرة وجذابة تجمع بين الجمالية والوظائف العملية لتجربة مستخدم استثنائية",
      icon: Palette,
    },
    {
      title: "التطوير التقني",
      description: "نستخدم أحدث التقنيات والأدوات لتطوير حلول قوية وموثوقة تلبي أعلى معايير الجودة",
      icon: Zap,
    },
    {
      title: "الاختبار والجودة",
      description: "نختبر كل جزء من المشروع بدقة لضمان الأداء الأمثل وخلوه من الأخطاء",
      icon: Shield,
    },
    {
      title: "التسليم والدعم",
      description: "نسلم المشروع في الوقت المحدد ونوفر دعماً فنياً مستمراً لضمان نجاح واستمرارية الحل",
      icon: Heart,
    },
  ];

  const timeline = [
    {
      year: "01",
      title: "الاستماع للعميل",
      description: "نبدأ كل مشروع بالاستماع الجيد لاحتياجات عملائنا وفهم رؤيتهم بعمق لنضمن تقديم حلول تتجاوز توقعاتهم",
    },
    {
      year: "02",
      title: "الشفافية الكاملة",
      description: "نحافظ على تواصل مستمر وشفاف مع عملائنا، نُطلعهم على كل تفصيل ونضمن لهم المشاركة الكاملة في جميع مراحل المشروع",
    },
    {
      year: "03",
      title: "الجودة أولاً",
      description: "لا نقبل إلا بالأفضل، نُخضع كل عمل لمعايير جودة صارمة ونختبر كل جزئية لضمان التميز والإتقان",
    },
    {
      year: "04",
      title: "الدعم الدائم",
      description: "علاقتنا مع عملائنا لا تنتهي عند التسليم، نوفر دعماً فنياً متواصلاً ونظل شركاء في النجاح على المدى الطويل",
    },
  ];

  return (
    <>
      <PageHeader 
        title={dir === 'rtl' ? 'معلومات عنا' : 'About Us'}
        subtitle={dir === 'rtl' 
          ? 'نحن شركة رائدة في مجال تطوير البرمجيات، نقدم حلولاً تقنية مبتكرة تساعد الشركات على النمو والازدهار في العصر الرقمي'
          : 'We are a leading software development company providing innovative technical solutions to help businesses grow and thrive in the digital age'
        }
        background="light"
      />

      <Section size="xl" background="white">
        <Container size="lg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection delay={0.3}>
              <h2 className={`text-4xl lg:text-5xl font-bold text-secondary mb-6 ${dir ? 'text-right' : 'text-left'}`}>
                {t('about.storyTitle')}
              </h2>
              <p className={`text-lg text-gray-600 mb-6 leading-relaxed ${dir ? 'text-right' : 'text-left'}`}>
                {t('about.storyParagraph1').replace('{companyName}', COMPANY_INFO.name)}
              </p>
              <p className={`text-lg text-gray-600 mb-8 leading-relaxed ${dir ? 'text-right' : 'text-left'}`}>
                {t('about.storyParagraph2')}
              </p>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl text-base font-semibold"
                >
                  <i className="fas fa-handshake mr-2"></i>
                  {t('about.partnership')}
                </Button>
              </Link>
            </AnimatedSection>
            <AnimatedSection delay={0.5}>
              <div className="flex flex-col items-center justify-center space-y-8">
                <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    <svg className="w-full h-full" viewBox="0 0 400 400">
                      <defs>
                        <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="rgba(25, 194, 240, 0.1)" />
                          <stop offset="100%" stopColor="rgba(147, 51, 234, 0.1)" />
                        </linearGradient>
                      </defs>
                      {[...Array(8)].map((_, i) => (
                        <motion.circle
                          key={`circle-${i}`}
                          cx="200"
                          cy="200"
                          r={40 + i * 20}
                          fill="none"
                          stroke="url(#grid-gradient)"
                          strokeWidth="1"
                          opacity="0.3"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: 1, 
                            opacity: [0.1, 0.3, 0.1],
                            rotate: i % 2 === 0 ? 360 : -360
                          }}
                          transition={{
                            scale: { duration: 1, delay: i * 0.1 },
                            opacity: { duration: 3, repeat: Infinity, delay: i * 0.2 },
                            rotate: { duration: 20 + i * 2, repeat: Infinity, ease: "linear" }
                          }}
                          style={{ transformOrigin: "center" }}
                        />
                      ))}
                      {[...Array(12)].map((_, i) => {
                        const angle = (i * 30 * Math.PI) / 180;
                        const x1 = 200 + Math.cos(angle) * 60;
                        const y1 = 200 + Math.sin(angle) * 60;
                        const x2 = 200 + Math.cos(angle) * 180;
                        const y2 = 200 + Math.sin(angle) * 180;
                        return (
                          <motion.line
                            key={`line-${i}`}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="rgba(25, 194, 240, 0.15)"
                            strokeWidth="1"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ 
                              pathLength: [0, 1, 0],
                              opacity: [0, 0.3, 0]
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: i * 0.15,
                              ease: "easeInOut"
                            }}
                          />
                        );
                      })}
                    </svg>
                  </motion.div>

                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                  >
                    <motion.div
                      className="absolute w-72 h-72 bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10 rounded-full blur-3xl"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>

                  <motion.div 
                    className="relative z-20 group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <motion.div
                      className="absolute -inset-6 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.5 }}
                    />
                    
                    <motion.div
                      className="relative"
                      animate={{
                        y: [0, -15, 0],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full"
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      
                      <motion.img 
                        src={logoGSC} 
                        alt="Genius Software Core Logo" 
                        className="w-72 h-72 object-contain relative z-10"
                        style={{
                          filter: "drop-shadow(0 20px 60px rgba(25, 194, 240, 0.3))"
                        }}
                        whileHover={{
                          filter: "drop-shadow(0 30px 80px rgba(25, 194, 240, 0.5))",
                          rotate: [0, -3, 3, -3, 0],
                        }}
                        transition={{
                          filter: { duration: 0.3 },
                          rotate: { duration: 0.5 }
                        }}
                      />
                    </motion.div>

                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={`particle-${i}`}
                        className="absolute w-1 h-1 bg-primary rounded-full"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [0, -30, 0],
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.5,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-center space-y-4 max-w-2xl px-4"
                >
                  <motion.div
                    className="inline-block"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent mb-2">
                      جينيس سوفت وير كور
                    </h1>
                    <motion.div 
                      className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                    />
                  </motion.div>
                  
                  <motion.h2 
                    className="text-xl lg:text-2xl font-semibold text-primary tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    Genius Software Core
                  </motion.h2>

                  <motion.div 
                    className="flex items-center justify-center gap-3 py-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <motion.div 
                      className="h-px w-12 bg-gradient-to-r from-transparent to-primary"
                      animate={{ scaleX: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <motion.div 
                      className="h-px w-12 bg-gradient-to-l from-transparent to-primary"
                      animate={{ scaleX: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  <motion.p 
                    className="text-xl lg:text-2xl font-bold text-primary leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    نبتكر الحلول… ونحقق النمو
                  </motion.p>
                  
                  <motion.p 
                    className="text-base lg:text-lg text-gray-600 italic font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    We Innovate Solutions… We Drive Growth
                  </motion.p>

                  <motion.div
                    className="flex justify-center gap-3 pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </Section>

      <Section size="xl" background="light">
        <Container size="md">
          <AnimatedText className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
              رحلتنا عبر الزمن
            </h2>
            <p className="text-xl text-gray-600">
              المحطات المهمة في تطور شركتنا
            </p>
          </AnimatedText>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <AnimatedCard key={index} delay={index * 0.1} className="p-6" hover={true}>
                <CardContent className="p-0">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {item.year}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-secondary mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </AnimatedCard>
            ))}
          </div>
        </Container>
      </Section>

      <Section size="xl" background="light">
        <Container size="lg">
          <AnimatedText className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
              منهجية عملنا
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نتبع نهجاً احترافياً ومنظماً في كل مشروع لضمان تقديم أفضل النتائج
            </p>
          </AnimatedText>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workProcess.map((step, index) => (
              <AnimatedCard key={index} delay={index * 0.1} className="p-8 text-center" hover={true}>
                <CardContent className="p-0">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="relative mb-6"
                  >
                    <div className="w-20 h-20 rounded-2xl mx-auto bg-gradient-to-br from-primary/20 to-primary/40 shadow-lg flex items-center justify-center">
                      <step.icon className="text-primary" size={40} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                      {index + 1}
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold text-secondary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </AnimatedCard>
            ))}
          </div>
        </Container>
      </Section>

      <Section size="xl" background="gradient">
        <Container size="md" className="text-center">
          <AnimatedSection delay={0.3}>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              جاهزون للعمل معك
            </h2>
            <p className="text-xl mb-8 leading-relaxed opacity-90">
              دعنا نتعاون معاً لتحويل رؤيتك إلى واقع رقمي مبهر
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 shadow-lg hover:shadow-xl px-8 py-4 rounded-xl text-base font-semibold"
                >
                  <MessageCircle size={20} className="mr-2" />
                  ابدأ محادثة
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-xl text-base font-semibold"
                >
                  <Eye size={20} className="mr-2" />
                  اطلع على أعمالنا
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </Container>
      </Section>
    </>
  );
}