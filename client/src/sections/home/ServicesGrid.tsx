import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { 
  Globe, 
  Smartphone, 
  Database, 
  Link as LinkIcon, 
  Palette, 
  Server,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Zap
} from "lucide-react";
import { Link } from "wouter";

export function ServicesGrid() {
  const { dir } = useLanguage();
  const { t } = useTranslation();

  // Enhanced service items with more details and features
  const serviceItems = [
    {
      title: dir === 'rtl' ? "تطبيقات الويب" : "Web Applications",
      desc: dir === 'rtl' ? "حلول ويب متطورة وسريعة الاستجابة تواكب أحدث التقنيات" : "Advanced and responsive web solutions with latest technologies",
      features: dir === 'rtl' ? [
        "واجهات تفاعلية سريعة",
        "تصميم متجاوب لجميع الأجهزة",
        "أداء عالي وسرعة تحميل",
        "تجربة مستخدم احترافية"
      ] : [
        "Fast interactive interfaces",
        "Responsive design for all devices",
        "High performance & speed",
        "Professional user experience"
      ],
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500",
      link: "/services/562fce34-abbd-4ba9-abc5-bc6b4afe61c7"
    },
    {
      title: dir === 'rtl' ? "تطبيقات الجوال" : "Mobile Applications",
      desc: dir === 'rtl' ? "تطبيقات ذكية ومبتكرة لأندرويد و iOS بتقنيات عالمية" : "Smart innovative applications for Android & iOS with global technologies",
      features: dir === 'rtl' ? [
        "تطوير أصلي وهجين",
        "واجهات سلسة وجذابة",
        "تكامل مع الأنظمة الخلفية",
        "دعم جميع الإصدارات"
      ] : [
        "Native & hybrid development",
        "Smooth attractive interfaces",
        "Backend system integration",
        "All versions supported"
      ],
      icon: Smartphone,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500",
      link: "/services/66b131cc-ccec-49a7-b832-972f4ba29a7b"
    },
    {
      title: dir === 'rtl' ? "أنظمة ERP/CRM" : "ERP/CRM Systems",
      desc: dir === 'rtl' ? "حلول شاملة ومتكاملة لإدارة الأعمال والعملاء بكفاءة" : "Comprehensive integrated solutions for efficient business and customer management",
      features: dir === 'rtl' ? [
        "إدارة كاملة للموارد",
        "تتبع ذكي للعملاء",
        "تقارير وتحليلات متقدمة",
        "أتمتة سير العمل"
      ] : [
        "Complete resource management",
        "Smart customer tracking",
        "Advanced reports & analytics",
        "Workflow automation"
      ],
      icon: Database,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500",
      link: "/erpnext"
    },
    {
      title: dir === 'rtl' ? "التكاملات والربط" : "Integration & Connectivity",
      desc: dir === 'rtl' ? "ربط الأنظمة المختلفة وتبادل البيانات بسلاسة وأمان" : "Connect different systems and exchange data smoothly and securely",
      features: dir === 'rtl' ? [
        "API متقدمة ومرنة",
        "مزامنة تلقائية للبيانات",
        "ربط مع خدمات خارجية",
        "أمان وموثوقية عالية"
      ] : [
        "Advanced flexible API",
        "Automatic data sync",
        "External services integration",
        "High security & reliability"
      ],
      icon: LinkIcon,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-500",
      link: "/services"
    },
    {
      title: dir === 'rtl' ? "التصميم وتجربة المستخدم" : "Design & UX",
      desc: dir === 'rtl' ? "واجهات جذابة ومبتكرة مع تجارب استخدام مميزة" : "Attractive innovative interfaces with distinctive user experiences",
      features: dir === 'rtl' ? [
        "تصميم عصري واحترافي",
        "سهولة الاستخدام",
        "هوية بصرية متميزة",
        "تجربة سلسة وممتعة"
      ] : [
        "Modern professional design",
        "Easy to use",
        "Distinctive visual identity",
        "Smooth enjoyable experience"
      ],
      icon: Palette,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500",
      link: "/services/9a6c839d-2a5c-4418-832a-2a5bd14dcf7e"
    },
    {
      title: dir === 'rtl' ? "DevOps والبنية التحتية" : "DevOps & Infrastructure",
      desc: dir === 'rtl' ? "حلول بنية تحتية موثوقة وقابلة للتوسع والتطوير" : "Reliable scalable and developable infrastructure solutions",
      features: dir === 'rtl' ? [
        "استضافة سحابية قوية",
        "نشر مستمر وآلي",
        "مراقبة وأداء متقدم",
        "نسخ احتياطي تلقائي"
      ] : [
        "Powerful cloud hosting",
        "Continuous automated deployment",
        "Advanced monitoring & performance",
        "Automatic backups"
      ],
      icon: Server,
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-500",
      link: "/services"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-sky-accent/20 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-brand-sky-accent/10 backdrop-blur-sm rounded-full text-sm font-medium text-primary mb-6 border border-primary/20"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4" />
            {dir === 'rtl' ? 'خدمات متخصصة' : 'Specialized Services'}
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-brand-text-primary to-primary bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('services.title')}
          </motion.h2>
          <motion.p
            className="text-lg text-brand-text-muted leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {t('services.subtitle')}
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {serviceItems.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <Link key={index} href={service.link}>
                <motion.div
                  className="group relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 dark:border-slate-700 hover:border-transparent overflow-hidden cursor-pointer h-full"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  data-testid={`service-card-${index}`}
                >
                  {/* Gradient Background Animation */}
                  <motion.div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                      service.color
                    )}
                    initial={false}
                  />

                  {/* Decorative Corner Gradient */}
                  <motion.div
                    className={cn(
                      "absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
                      service.color
                    )}
                    initial={false}
                  />

                  {/* Icon with Enhanced Animation */}
                  <motion.div
                    className="relative z-10 mb-6"
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={cn(
                      "w-20 h-20 bg-gradient-to-br rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-500",
                      service.color
                    )}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-brand-text-primary dark:text-white mb-3 group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-brand-text-muted dark:text-slate-400 mb-6 leading-relaxed text-sm">
                      {service.desc}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, fIndex) => (
                        <motion.div
                          key={fIndex}
                          className="flex items-start gap-2 text-brand-text-muted dark:text-slate-400 text-xs"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 + fIndex * 0.05 }}
                          viewport={{ once: true }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-green-500 mt-0.5" />
                          <span className="leading-relaxed">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Learn More Link with Enhanced Interaction */}
                    <motion.div
                      className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all duration-300"
                      whileHover={{ x: dir === 'rtl' ? -5 : 5 }}
                    >
                      <span>{t('services.learnMore')}</span>
                      <motion.div
                        animate={{ 
                          x: dir === 'rtl' ? [-2, 2, -2] : [2, -2, 2],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <ArrowRight 
                          className={cn(
                            "w-4 h-4 transition-transform duration-300",
                            dir === 'rtl' && "rotate-180"
                          )} 
                        />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Decorative Elements */}
                  <motion.div
                    className={cn(
                      "absolute top-6 right-6 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                      service.bgColor
                    )}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  />
                  <motion.div
                    className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-brand-sky-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                  />

                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.7 }}
                  />
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Enhanced CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Link href="/services">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-2xl hover:shadow-primary/50 px-10 py-6 rounded-2xl transition-all duration-300 text-base font-bold group relative overflow-hidden"
              data-testid="view-all-services"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              
              <span className="relative z-10 flex items-center gap-3">
                <Zap className="w-5 h-5" />
                {t('services.viewAll')}
                <ArrowRight 
                  className={cn(
                    "w-5 h-5 transition-transform duration-300 group-hover:translate-x-1",
                    dir === 'rtl' && "rotate-180 group-hover:-translate-x-1"
                  )} 
                />
              </span>
            </Button>
          </Link>
          
          {/* Success Stats under button */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
          >
            {[
              { icon: CheckCircle2, value: '99%', label: dir === 'rtl' ? 'رضا العملاء' : 'Client Satisfaction' },
              { icon: Zap, value: '24/7', label: dir === 'rtl' ? 'دعم فني' : 'Technical Support' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
                  idx === 0 ? "from-green-500 to-emerald-500" :
                  "from-orange-500 to-amber-500"
                )}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-brand-text-primary dark:text-white">{stat.value}</div>
                  <div className="text-xs text-brand-text-muted dark:text-slate-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
