import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useCountUp } from '@/hooks/use-count-up';
import { Sparkline } from './sparkline';
import { DeltaBadge } from './delta-badge';
import type { Metric } from '@/data/home-metrics';

interface MetricCardProps {
  metric: Metric;
  index: number;
  language?: 'ar' | 'en';
}

export function MetricCard({ metric, index, language = 'ar' }: MetricCardProps) {
  const decimals = metric.value % 1 !== 0 ? 1 : 0;
  const { value, ref } = useCountUp(metric.value, 2000, index * 200, decimals);
  
  const title = language === 'ar' ? metric.title_ar : metric.title_en;
  const caption = language === 'ar' ? metric.caption_ar : metric.caption_en;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="group"
    >
      <Card className="p-6 bg-white border-sky-200 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-500 relative overflow-hidden">
        {/* Background gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-sky-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={false}
          animate={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
        
        <CardContent className="p-0 relative z-10">
          {/* Header with title and delta */}
          <div className="flex items-start justify-between mb-4">
            <h3 
              className="text-sm font-semibold text-slate-700 leading-tight"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {title}
            </h3>
            {metric.delta && metric.deltaDir && (
              <DeltaBadge 
                delta={metric.delta}
                direction={metric.deltaDir}
                suffix={metric.suffix === '%' ? '%' : ''}
              />
            )}
          </div>

          {/* Main value */}
          <motion.div 
            className="mb-4"
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
          >
            <div className="flex items-baseline gap-1">
              <span className="text-3xl lg:text-4xl font-bold text-slate-900 tabular-nums">
                {value.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
              </span>
              {metric.suffix && (
                <span className="text-lg text-sky-600 font-semibold">
                  {metric.suffix}
                </span>
              )}
            </div>
          </motion.div>

          {/* Sparkline chart */}
          {metric.trend && metric.trend.length > 1 && (
            <div className="mb-3">
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.6 }}
                style={{ originX: language === 'ar' ? 1 : 0 }}
              >
                <Sparkline 
                  data={metric.trend} 
                  className="w-full h-8"
                  color="#7CC7FF"
                />
              </motion.div>
            </div>
          )}

          {/* Caption */}
          {caption && (
            <motion.p 
              className="text-xs text-slate-500"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.8 }}
            >
              {caption}
            </motion.p>
          )}
        </CardContent>

        {/* Hover effect border */}
        <motion.div
          className="absolute inset-0 border-2 border-sky-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      </Card>
    </motion.div>
  );
}