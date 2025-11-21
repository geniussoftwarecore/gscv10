import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  direction?: "up" | "down" | "left" | "right";
}

/**
 * Enhanced animated card following Services/Home design system
 */
export function AnimatedCard({ 
  children, 
  className = "",
  delay = 0,
  hover = true,
  direction = "up"
}: AnimatedCardProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { opacity: 0, y: 50 };
      case "down": return { opacity: 0, y: -50 };
      case "left": return { opacity: 0, x: 50 };
      case "right": return { opacity: 0, x: -50 };
      default: return { opacity: 0, y: 50 };
    }
  };

  const getAnimatePosition = () => {
    switch (direction) {
      case "up": return { opacity: 1, y: 0 };
      case "down": return { opacity: 1, y: 0 };
      case "left": return { opacity: 1, x: 0 };
      case "right": return { opacity: 1, x: 0 };
      default: return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.div
      className={cn(
        "bg-white rounded-2xl shadow-sm border border-brand-sky-base/20",
        hover && "hover:shadow-xl hover:border-primary/20 transition-all duration-300",
        className
      )}
      initial={getInitialPosition()}
      whileInView={getAnimatePosition()}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: "easeOut"
      }}
      viewport={{ once: true }}
      whileHover={hover ? { 
        y: -8,
        transition: { duration: 0.3 }
      } : undefined}
    >
      {children}
    </motion.div>
  );
}