import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Enhanced animated text wrapper following Services/Home design system
 */
export function AnimatedText({ 
  children, 
  className = "",
  delay = 0
}: AnimatedTextProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: "easeOut"
      }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}