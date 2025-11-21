import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
  color?: "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const colorClasses = {
  primary: "bg-primary",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
};

const sizeClasses = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export function ProgressBar({
  value,
  max = 100,
  className,
  showLabel = false,
  label,
  color = "primary",
  size = "md",
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {label}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div className={cn(
        "w-full bg-gray-200 rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <motion.div
          className={cn(
            "h-full rounded-full transition-colors",
            colorClasses[color]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.8, ease: "easeOut" } : { duration: 0 }}
        />
      </div>
    </div>
  );
}

interface SkillProgressProps {
  skills: { name: string; level: number }[];
  className?: string;
}

export function SkillProgress({ skills, className }: SkillProgressProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ProgressBar
            value={skill.level}
            label={skill.name}
            showLabel
            animated
            className="mb-2"
          />
        </motion.div>
      ))}
    </div>
  );
}