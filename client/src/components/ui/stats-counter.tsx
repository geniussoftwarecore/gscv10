import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface StatsCounterProps {
  value: number | string;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  icon?: string;
}

export function StatsCounter({
  value,
  label,
  prefix = "",
  suffix = "",
  duration = 2,
  className,
  icon,
}: StatsCounterProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const numericValue = typeof value === "string" ? parseInt(value.replace(/\D/g, "")) : value;
  const isNumeric = !isNaN(numericValue) && numericValue > 0;

  useEffect(() => {
    if (inView && isNumeric) {
      let startTime: number;
      let animationId: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeOutCubic * numericValue);
        
        setCount(currentCount);

        if (progress < 1) {
          animationId = requestAnimationFrame(animate);
        }
      };

      animationId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationId);
    }
  }, [inView, numericValue, duration, isNumeric]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className={`text-center ${className}`}
    >
      {icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-primary text-4xl mb-4"
        >
          <i className={icon}></i>
        </motion.div>
      )}
      
      <motion.div
        initial={{ scale: 0.8 }}
        animate={inView ? { scale: 1 } : { scale: 0.8 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-4xl lg:text-5xl font-bold text-secondary mb-2"
      >
        {prefix}
        {isNumeric ? count : value}
        {suffix}
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-gray-600 font-medium"
      >
        {label}
      </motion.p>
    </motion.div>
  );
}