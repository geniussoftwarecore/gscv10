import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  className?: string;
  color?: string;
}

export function Sparkline({ data, className = "w-full h-10", color = "#7CC7FF" }: SparklineProps) {
  const pathData = useMemo(() => {
    if (!data || data.length < 2) return '';
    
    const width = 100;
    const height = 40;
    const padding = 2;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
      const y = padding + ((max - value) * (height - 2 * padding)) / range;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  }, [data]);

  const lastPoint = useMemo(() => {
    if (!data || data.length < 2) return null;
    
    const width = 100;
    const height = 40;
    const padding = 2;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const lastValue = data[data.length - 1];
    const x = padding + ((data.length - 1) * (width - 2 * padding)) / (data.length - 1);
    const y = padding + ((max - lastValue) * (height - 2 * padding)) / range;
    
    return { x, y };
  }, [data]);

  if (!data || data.length < 2) {
    return (
      <div className={className} aria-label="بيانات غير متوفرة">
        <svg viewBox="0 0 100 40" className="w-full h-full">
          <line
            x1="10"
            y1="20"
            x2="90"
            y2="20"
            stroke="#e2e8f0"
            strokeWidth="2"
            strokeDasharray="2,2"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={className}>
      <svg viewBox="0 0 100 40" className="w-full h-full" aria-label="مخطط الاتجاه">
        <defs>
          <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        {/* Trend line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ 
            duration: 1.5, 
            delay: 0.5,
            ease: "easeInOut"
          }}
        />
        
        {/* End point marker */}
        {lastPoint && (
          <motion.circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r="2"
            fill={color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: 1.8,
              type: "spring",
              stiffness: 200
            }}
          />
        )}
        
        {/* Subtle glow effect */}
        <motion.circle
          cx={lastPoint?.x || 0}
          cy={lastPoint?.y || 0}
          r="4"
          fill={color}
          opacity="0.2"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ 
            duration: 0.6, 
            delay: 1.8,
            ease: "easeOut"
          }}
        />
      </svg>
    </div>
  );
}