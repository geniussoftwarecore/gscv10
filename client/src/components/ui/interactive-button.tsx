import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InteractiveButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  loading?: boolean;
}

export function InteractiveButton({
  children,
  className,
  variant = "default",
  size = "default",
  onClick,
  disabled,
  type = "button",
  icon,
  loading = false,
}: InteractiveButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
          "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
          className
        )}
        variant={variant}
        size={size}
        onClick={onClick}
        disabled={disabled || loading}
        type={type}
      >
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mr-2"
          >
            <i className="fas fa-spinner"></i>
          </motion.div>
        ) : (
          icon && <span className="mr-2">{icon}</span>
        )}
        {children}
      </Button>
    </motion.div>
  );
}

export function FloatingActionButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.button
      className={cn(
        "fixed bottom-8 left-8 z-50 w-14 h-14 rounded-full",
        "bg-primary text-white shadow-lg hover:shadow-xl",
        "flex items-center justify-center transition-all duration-300",
        className
      )}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}