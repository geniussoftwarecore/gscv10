import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  background?: "white" | "light" | "gradient";
}

/**
 * Standardized section wrapper following Services/Home spacing
 * - sm: py-12
 * - md: py-16  
 * - lg: py-20
 * - xl: py-24
 */
export function Section({ 
  children, 
  className = "",
  size = "lg",
  background = "white"
}: SectionProps) {
  const sizeClasses = {
    sm: "py-12",
    md: "py-16", 
    lg: "py-20",
    xl: "py-24"
  };

  const backgroundClasses = {
    white: "bg-white",
    light: "bg-gradient-to-br from-brand-sky-light to-brand-sky-base/50",
    gradient: "bg-gradient-to-r from-primary to-primary-dark text-white"
  };

  return (
    <section className={cn(
      sizeClasses[size],
      backgroundClasses[background],
      className
    )}>
      {children}
    </section>
  );
}