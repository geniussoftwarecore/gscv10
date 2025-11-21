import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface TechBadgeProps {
  technology: string;
  index?: number;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  className?: string;
}

const techIcons: Record<string, string> = {
  'React': '⚛️',
  'Vue.js': '💚',
  'Angular': '🔴',
  'Next.js': '▲',
  'Flutter': '🐦',
  'React Native': '⚛️📱',
  'Node.js': '💚',
  'Express.js': '⚡',
  'Laravel': '🔷',
  'Django': '🐍',
  'Spring Boot': '🍃',
  'PostgreSQL': '🐘',
  'MongoDB': '🍃',
  'MySQL': '🐬',
  'Redis': '🔴',
  'AWS': '☁️',
  'Azure': '☁️',
  'Docker': '🐳',
  'Kubernetes': '⚙️',
  'TypeScript': '📘',
  'JavaScript': '💛',
  'Python': '🐍',
  'Java': '☕',
  'PHP': '🐘',
  'Swift': '🦉',
  'Kotlin': '🎯'
};

export default function TechBadge({ 
  technology, 
  index = 0, 
  variant = 'outline',
  size = 'md',
  interactive = true,
  className = ""
}: TechBadgeProps) {
  const icon = techIcons[technology] || '⚙️';

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'default':
        return 'bg-brand-sky-accent text-white border-brand-sky-accent hover:bg-brand-sky-accent/90';
      case 'secondary':
        return 'bg-brand-sky-light text-brand-text-primary border-brand-sky-base hover:bg-brand-sky-base';
      default:
        return 'bg-brand-bg border-brand-sky-base text-brand-text-primary hover:border-brand-sky-accent hover:bg-brand-sky-light';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: "easeOut"
      }}
      whileHover={interactive ? { 
        scale: 1.05,
        y: -2,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={interactive ? { scale: 0.95 } : undefined}
      className={className}
    >
      <Badge
        variant={variant}
        className={`
          ${sizeClasses[size]} 
          ${getVariantClasses()}
          font-medium 
          transition-all 
          duration-300 
          cursor-default
          border-2
          flex
          items-center
          gap-1.5
          select-none
          ${interactive ? 'hover:shadow-md' : ''}
        `}
      >
        <span className="text-sm" role="img" aria-label={technology}>
          {icon}
        </span>
        <span>{technology}</span>
      </Badge>
    </motion.div>
  );
}