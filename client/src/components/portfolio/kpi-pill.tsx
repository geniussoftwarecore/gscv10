import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { KPI } from "@/data/portfolio";

interface KpiPillProps {
  kpi: KPI;
  index?: number;
  showTrend?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconMap: Record<string, any> = {
  TrendingUp,
  Target: TrendingUp,
  Star: TrendingUp,
  Zap: TrendingDown,
  Clock: TrendingDown,
  Users: TrendingUp,
  BookOpen: TrendingUp,
  Heart: TrendingUp,
  Calendar: TrendingUp,
  Shield: TrendingUp,
  CreditCard: TrendingUp,
  Truck: TrendingUp,
  DollarSign: TrendingDown,
  MapPin: TrendingUp,
  Smartphone: TrendingUp
};

export default function KpiPill({ 
  kpi, 
  index = 0, 
  showTrend = true, 
  size = 'md',
  className = ""
}: KpiPillProps) {
  const IconComponent = iconMap[kpi.icon] || TrendingUp;
  
  const getTrendIcon = () => {
    switch (kpi.trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Minus className="w-3 h-3 text-brand-text-muted" />;
    }
  };

  const getTrendColor = () => {
    switch (kpi.trend) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-brand-text-muted bg-brand-sky-light border-brand-sky-base';
    }
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizeClasses = {
    sm: {
      value: 'text-lg',
      label: 'text-xs',
      description: 'text-xs'
    },
    md: {
      value: 'text-xl',
      label: 'text-sm',
      description: 'text-xs'
    },
    lg: {
      value: 'text-2xl',
      label: 'text-base',
      description: 'text-sm'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.03,
        y: -2,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      <Card className={`border-2 border-brand-sky-base bg-brand-bg hover:border-brand-sky-accent hover:shadow-lg transition-all duration-300 overflow-hidden group ${
        kpi.trend === 'up' ? 'hover:bg-green-50/30' : 
        kpi.trend === 'down' ? 'hover:bg-blue-50/30' : 
        'hover:bg-brand-sky-light/30'
      }`}>
        <CardContent className={sizeClasses[size]}>
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg bg-brand-sky-light border border-brand-sky-base group-hover:bg-brand-sky-accent/20 transition-colors duration-300`}>
              <IconComponent className={`${iconSizeClasses[size]} text-brand-sky-accent`} />
            </div>
            {showTrend && kpi.trend && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: (index * 0.1) + 0.3 }}
                className="flex items-center"
              >
                <Badge 
                  variant="outline" 
                  className={`${getTrendColor()} border px-1.5 py-0.5`}
                >
                  {getTrendIcon()}
                </Badge>
              </motion.div>
            )}
          </div>

          <div className="space-y-2">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: (index * 0.1) + 0.2 }}
              className={`font-bold text-brand-text-primary ${textSizeClasses[size].value}`}
            >
              {kpi.value}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (index * 0.1) + 0.4 }}
              className={`font-medium text-brand-text-primary ${textSizeClasses[size].label}`}
            >
              {kpi.labelAr}
            </motion.div>
            
            {size !== 'sm' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (index * 0.1) + 0.5 }}
                className={`text-brand-text-muted leading-relaxed ${textSizeClasses[size].description}`}
              >
                {kpi.descriptionAr}
              </motion.p>
            )}
          </div>

          {/* Decorative gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-sky-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </CardContent>
      </Card>
    </motion.div>
  );
}