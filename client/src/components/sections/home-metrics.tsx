import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MetricCard } from '@/components/metrics/metric-card';
import type { Metric } from '@/data/home-metrics';

interface HomeMetricsProps {
  metrics: Metric[];
  language?: 'ar' | 'en';
}

export function HomeMetrics({ metrics, language = 'ar' }: HomeMetricsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <section 
      id="metrics" 
      ref={ref} 
      className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden"
      style={{ position: 'relative' }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-24 -left-24 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-sky-100/30 to-sky-200/20 rounded-full blur-3xl"
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
            x: [0, 15, 0],
            y: [0, -15, 0]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 12, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        <motion.div 
          className="absolute -bottom-32 -right-32 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-tl from-sky-200/25 to-sky-100/15 rounded-full blur-3xl"
          animate={{ 
            rotate: -360,
            scale: [1, 0.9, 1.1, 1],
            x: [0, -20, 0],
            y: [0, 20, 0]
          }}
          transition={{ 
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 14, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 16, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Floating elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 2 === 0 ? 'bg-sky-300/20' : 'bg-sky-400/15'
            }`}
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -20 - Math.random() * 10, 0],
              x: [0, (Math.random() - 0.5) * 15, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2 + Math.random() * 0.3, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-sky-600 via-slate-800 to-sky-600 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
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
              className="bg-gradient-to-r from-sky-600 via-slate-800 to-sky-600 bg-clip-text text-transparent"
            >
              {language === 'ar' ? 'أرقامنا' : 'Our Numbers'}
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 15 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {language === 'ar' 
              ? 'مؤشرات أداء مختصرة تعكس أثر حلولنا وتميز خدماتنا في تحقيق نتائج استثنائية'
              : 'A quick snapshot of impact KPIs from recent work and our service excellence'
            }
          </motion.p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {metrics.map((metric, index) => (
            <MetricCard 
              key={metric.id}
              metric={metric}
              index={index}
              language={language}
            />
          ))}
        </motion.div>

        {/* Optional divider */}
        <motion.div
          className="mt-16 pt-8 border-t border-sky-100"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="text-center">
            <motion.p 
              className="text-sm text-slate-500"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {language === 'ar' 
                ? 'البيانات محدثة في الوقت الفعلي وتعكس الأداء الفعلي لمشاريعنا'
                : 'Data updated in real-time reflecting actual project performance'
              }
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}