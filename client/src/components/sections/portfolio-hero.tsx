
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Star, TrendingUp, Zap, Users, Clock, Target, Heart } from "lucide-react";

export default function PortfolioHero() {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  const stats = [
    { icon: Award, value: "50+", label: "مشروع مكتمل", color: "from-yellow-400 to-orange-500" },
    { icon: Star, value: "98%", label: "رضا العملاء", color: "from-blue-400 to-purple-500" },
    { icon: TrendingUp, value: "200%", label: "نمو الأداء", color: "from-green-400 to-emerald-500" },
    { icon: Zap, value: "24/7", label: "دعم مستمر", color: "from-purple-400 to-pink-500" },
    { icon: Users, value: "100k+", label: "مستخدم نشط", color: "from-indigo-400 to-blue-500" },
    { icon: Clock, value: "48hrs", label: "متوسط التسليم", color: "from-red-400 to-pink-500" },
    { icon: Target, value: "95%", label: "دقة التسليم", color: "from-teal-400 to-cyan-500" },
    { icon: Heart, value: "4.9/5", label: "تقييم العملاء", color: "from-rose-400 to-red-500" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl"
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <motion.div 
          className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tl from-secondary/8 to-secondary/4 rounded-full blur-2xl"
          animate={{ 
            rotate: -360,
            scale: [1, 0.9, 1.1, 1],
            x: [0, -25, 0],
            y: [0, 25, 0]
          }}
          transition={{ 
            rotate: { duration: 35, repeat: Infinity, ease: "linear" },
            scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 14, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 16, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 4 === 0 ? 'bg-primary/20' : 
              i % 4 === 1 ? 'bg-secondary/25' : 
              i % 4 === 2 ? 'bg-yellow-400/20' :
              'bg-gradient-to-r from-primary/15 to-secondary/20'
            }`}
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
            }}
            animate={{
              y: [0, -40 - Math.random() * 20, 0],
              x: [0, (Math.random() - 0.5) * 30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5 + Math.random() * 0.8, 1]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
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
              معرض أعمالنا
            </motion.span>
            <br />
            <motion.span
              className="text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              المميزة
            </motion.span>
          </motion.h1>

          <motion.p 
            className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            مجموعة مختارة من مشاريعنا الناجحة عبر مختلف الصناعات، كل مشروع يحكي قصة نجاح وابتكار حقق نتائج استثنائية لعملائنا
          </motion.p>
        </motion.div>

        {/* Dynamic Stats Counter */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100/50 p-8 sm:p-12 max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStatIndex}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <motion.div
                  className={`inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${stats[currentStatIndex].color} rounded-full mb-6 shadow-lg`}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 4, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <stats[currentStatIndex].icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </motion.div>
                
                <motion.div 
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-4"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {stats[currentStatIndex].value}
                </motion.div>
                
                <div className="text-lg sm:text-xl text-gray-600 font-medium">
                  {stats[currentStatIndex].label}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress indicators */}
            <div className="flex justify-center mt-8 gap-2">
              {stats.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStatIndex ? 'bg-primary shadow-lg' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentStatIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>

          {/* Floating mini stats */}
          <motion.div
            className="absolute -left-8 top-1/4 hidden lg:block"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="text-2xl font-bold text-primary">8+</div>
              <div className="text-sm text-gray-600">صناعات مختلفة</div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -right-8 bottom-1/4 hidden lg:block"
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="text-2xl font-bold text-secondary">3M+</div>
              <div className="text-sm text-gray-600">مستخدم استفاد</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
