import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DeltaBadgeProps {
  delta: number;
  direction: "up" | "down" | "flat";
  suffix?: string;
  className?: string;
}

export function DeltaBadge({ delta, direction, suffix = "", className = "" }: DeltaBadgeProps) {
  const getStyles = () => {
    switch (direction) {
      case 'up':
        return {
          container: "bg-sky-100 text-sky-700 border-sky-200",
          icon: TrendingUp,
          iconColor: "text-sky-600"
        };
      case 'down':
        return {
          container: "bg-red-100 text-red-700 border-red-200",
          icon: TrendingDown,
          iconColor: "text-red-600"
        };
      default:
        return {
          container: "bg-slate-100 text-slate-600 border-slate-200",
          icon: Minus,
          iconColor: "text-slate-500"
        };
    }
  };

  const styles = getStyles();
  const IconComponent = styles.icon;
  const displayValue = Math.abs(delta);
  const sign = direction === 'up' ? '+' : direction === 'down' ? '-' : '';

  return (
    <motion.div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${styles.container} ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        duration: 0.3,
        delay: 0.5,
        type: "spring",
        stiffness: 200
      }}
      whileHover={{ scale: 1.05 }}
    >
      <IconComponent className={`w-3 h-3 ${styles.iconColor}`} />
      <span>
        {sign}{displayValue}{suffix}
      </span>
    </motion.div>
  );
}