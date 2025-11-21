import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  Award, 
  Calendar,
  Building2,
  Zap,
  Globe,
  Target,
  ArrowDown
} from "lucide-react";

interface EnhancedPortfolioHeroProps {
  totalProjects: number;
  totalIndustries: number;
  yearsExperience: number;
  satisfaction: number;
  totalClients?: number;
  totalTechnologies?: number;
}

export default function EnhancedPortfolioHero({
  totalProjects,
  totalIndustries,
  yearsExperience,
  satisfaction,
  totalClients = 150,
  totalTechnologies = 25
}: EnhancedPortfolioHeroProps) {
  
  const stats = [
    {
      id: 'projects',
      icon: Target,
      value: totalProjects.toString(),
      label: 'مشروع مكتمل',
      labelEn: 'Completed Projects',
      description: 'مشاريع متنوعة عبر قطاعات مختلفة',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      id: 'clients',
      icon: Building2,
      value: `${totalClients}+`,
      label: 'عميل سعيد',
      labelEn: 'Happy Clients',
      description: 'عملاء يثقون في خدماتنا',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100'
    },
    {
      id: 'industries',
      icon: Globe,
      value: totalIndustries.toString(),
      label: 'قطاع متنوع',
      labelEn: 'Industries Served',
      description: 'تغطية شاملة للقطاعات',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    {
      id: 'satisfaction',
      icon: Award,
      value: `${satisfaction}%`,
      label: 'رضا العملاء',
      labelEn: 'Client Satisfaction',
      description: 'معدل رضا استثنائي',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100'
    },
    {
      id: 'experience',
      icon: Calendar,
      value: `${yearsExperience}+`,
      label: 'سنة خبرة',
      labelEn: 'Years Experience',
      description: 'خبرة عميقة في التطوير',
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100'
    },
    {
      id: 'technologies',
      icon: Zap,
      value: `${totalTechnologies}+`,
      label: 'تقنية متقدمة',
      labelEn: 'Technologies',
      description: 'أحدث التقنيات والأدوات',
      gradient: 'from-cyan-500 to-cyan-600',
      bgGradient: 'from-cyan-50 to-cyan-100'
    }
  ];

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects-grid');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-brand-bg via-brand-sky-light/30 to-brand-sky-base/40 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -left-40 w-80 h-80 bg-brand-sky-accent/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-brand-sky-accent/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating geometric shapes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-brand-sky-accent/20 rounded-full"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i * 10)}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col justify-center min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <Badge 
                variant="outline" 
                className="bg-brand-sky-light border-brand-sky-accent text-brand-sky-accent px-4 py-2 text-sm font-medium"
              >
                <Award className="w-4 h-4 mr-2" />
                معرض أعمالنا المتميزة
              </Badge>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl lg:text-6xl xl:text-7xl font-bold text-brand-text-primary mb-6 leading-tight"
            >
              مشاريع تحكي قصص
              <motion.span
                className="text-transparent bg-gradient-to-r from-brand-sky-accent to-blue-600 bg-clip-text block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                النجاح والتميز
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl lg:text-2xl text-brand-text-muted max-w-4xl mx-auto leading-relaxed mb-12"
            >
              استكشف مجموعة متنوعة من المشاريع التي طورناها بعناية فائقة، من التطبيقات المحمولة إلى الأنظمة المعقدة، 
              كل مشروع يحمل بصمة الإبداع والتكنولوgia المتقدمة
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button
                onClick={scrollToProjects}
                size="lg"
                className="bg-brand-sky-accent hover:bg-brand-sky-accent/90 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                استعرض المشاريع
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="ml-2"
                >
                  <ArrowDown className="w-5 h-5" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced Statistics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1.2 + (index * 0.1),
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <Card className={`border-2 border-brand-sky-base bg-gradient-to-br ${stat.bgGradient} hover:border-brand-sky-accent hover:shadow-xl transition-all duration-400 overflow-hidden group`}>
                  <CardContent className="p-6 relative">
                    {/* Icon */}
                    <motion.div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} text-white mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <stat.icon className="w-6 h-6" />
                    </motion.div>

                    {/* Value */}
                    <motion.div
                      className="text-2xl lg:text-3xl font-bold text-brand-text-primary mb-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 1.5 + (index * 0.1),
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      {stat.value}
                    </motion.div>

                    {/* Label */}
                    <div className="text-sm font-medium text-brand-text-primary mb-1">
                      {stat.label}
                    </div>

                    {/* Description */}
                    <div className="text-xs text-brand-text-muted leading-relaxed">
                      {stat.description}
                    </div>

                    {/* Hover Effect Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-sky-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Animated Border */}
                    <motion.div
                      className="absolute inset-0 border-2 border-brand-sky-accent rounded-lg opacity-0 group-hover:opacity-100"
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <motion.button
          onClick={scrollToProjects}
          className="flex flex-col items-center gap-2 text-brand-text-muted hover:text-brand-sky-accent transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm font-medium">تصفح المشاريع</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 border-2 border-brand-sky-accent rounded-full flex items-center justify-center"
          >
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </motion.div>
    </section>
  );
}