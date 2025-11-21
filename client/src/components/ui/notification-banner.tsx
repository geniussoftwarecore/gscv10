import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface NotificationBannerProps {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const typeStyles = {
  info: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-800",
    icon: "fas fa-info-circle text-blue-500",
  },
  success: {
    bg: "bg-green-50 border-green-200", 
    text: "text-green-800",
    icon: "fas fa-check-circle text-green-500",
  },
  warning: {
    bg: "bg-yellow-50 border-yellow-200",
    text: "text-yellow-800", 
    icon: "fas fa-exclamation-triangle text-yellow-500",
  },
  error: {
    bg: "bg-red-50 border-red-200",
    text: "text-red-800",
    icon: "fas fa-times-circle text-red-500",
  },
};

export function NotificationBanner({
  message,
  type = "info",
  dismissible = true,
  action,
  className,
}: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const styles = typeStyles[type];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "border rounded-lg p-4 mb-4",
          styles.bg,
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <i className={cn("mr-3", styles.icon)}></i>
            <p className={cn("text-sm font-medium", styles.text)}>
              {message}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {action && (
              <Button
                onClick={action.onClick}
                variant="outline"
                size="sm"
                className={cn("text-xs", styles.text)}
              >
                {action.label}
              </Button>
            )}

            {dismissible && (
              <Button
                onClick={() => setIsVisible(false)}
                variant="ghost"
                size="sm"
                className="w-6 h-6 rounded-full p-0 hover:bg-gray-200"
                aria-label="إغلاق الإشعار"
              >
                <i className="fas fa-times text-xs text-gray-500"></i>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook for managing multiple notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    duration?: number;
  }>>([]);

  const addNotification = (
    message: string,
    type: "info" | "success" | "warning" | "error" = "info",
    duration = 5000
  ) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return { notifications, addNotification, removeNotification };
}