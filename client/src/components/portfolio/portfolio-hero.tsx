import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Calendar, Zap } from "lucide-react";

interface PortfolioHeroProps {
  totalProjects: number;
  totalIndustries: number;
  yearsExperience: number;
  satisfaction: number;
}

export default function PortfolioHero({
  totalProjects = 50,
  totalIndustries = 8,
  yearsExperience = 5,
  satisfaction = 98
}: PortfolioHeroProps) {
  const counters = [
    {
      icon: Award,
      value: `${totalProjects}+`,
      label: "مشروع مكتمل",
      description: "مشاريع ناجحة ومميزة"
    },
    {
      icon: Users,
      value: `${totalIndustries}`,
      label: "قطاع متنوع",
      description: "خبرة واسعة في المجالات"
    },
    {
      icon: Calendar,
      value: `${yearsExperience}+`,
      label: "سنوات خبرة",
      description: "في تطوير البرمجيات"
    },
    {
      icon: Zap,
      value: `${satisfaction}%`,
      label: "رضا العملاء",
      description: "تقييم ممتاز من عملائنا"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-white to-secondary/5 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge 
              variant="secondary" 
              className="mb-4 text-sm font-medium px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20"
            >
              ✨ معرض أعمالنا المميزة
            </Badge>
            
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 8,
                  ease: 'linear',
                  repeat: Infinity,
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
                className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent"
              >
                نتائج مثبتة
              </motion.span>
              <br />
              <span className="text-gray-800">وخبرة متميزة</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              اكتشف مجموعة مختارة من أفضل مشاريعنا التي حققت نتائج استثنائية وتفوقت على التوقعات.
              من التطبيقات المبتكرة إلى المنصات المتطورة، كل مشروع يحكي قصة نجاح مميزة.
            </motion.p>
          </motion.div>
        </div>

        {/* Success Metrics Grid */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {counters.map((counter, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-4"
                    whileHover={{ rotate: 12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <counter.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <motion.div 
                    className="text-3xl lg:text-4xl font-bold text-secondary mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 1 + index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    {counter.value}
                  </motion.div>
                  
                  <div className="text-lg font-semibold text-gray-800 mb-1">
                    {counter.label}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {counter.description}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <p className="text-lg text-gray-600 mb-6">
            هل تريد أن يكون مشروعك القادم ضمن هذه المجموعة المميزة؟
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge 
              variant="outline" 
              className="text-primary border-primary hover:bg-primary hover:text-white transition-all duration-300 px-6 py-3 text-base cursor-pointer"
            >
              🚀 ابدأ مشروعك معنا
            </Badge>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}