import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  stagger?: number;
}

/**
 * Enhanced animated section wrapper following Services/Home design system
 */
export function AnimatedSection({ 
  children, 
  className = "",
  delay = 0,
  direction = "up",
  stagger = 0.1
}: AnimatedSectionProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { opacity: 0, y: 60 };
      case "down": return { opacity: 0, y: -60 };
      case "left": return { opacity: 0, x: 60 };
      case "right": return { opacity: 0, x: -60 };
      default: return { opacity: 0, y: 60 };
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
      className={cn(className)}
      initial={getInitialPosition()}
      whileInView={getAnimatePosition()}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: "easeOut",
        staggerChildren: stagger
      }}
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </motion.div>
  );
}