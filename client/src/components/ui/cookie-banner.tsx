import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { Card, CardContent } from "./card";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("cookie-consent");
    if (!hasConsented) {
      // Show banner after a delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
    
    // Initialize analytics or tracking here
    // e.g., gtag('consent', 'update', { 'analytics_storage': 'granted' });
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
      >
        <Card className="shadow-2xl border-0 bg-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-primary text-2xl">
                <i className="fas fa-cookie-bite"></i>
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-secondary mb-2">
                  استخدام ملفات تعريف الارتباط
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا وتقديم محتوى مخصص. 
                  من خلال الموافقة، تساعدنا في تطوير خدماتنا بشكل أفضل.
                </p>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAccept}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    موافق
                  </Button>
                  
                  <Button
                    onClick={handleDecline}
                    variant="ghost"
                    className="text-sm px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    رفض
                  </Button>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  لمعرفة المزيد، راجع{" "}
                  <a 
                    href="/privacy" 
                    className="text-primary hover:underline"
                  >
                    سياسة الخصوصية
                  </a>
                </p>
              </div>

              {/* Close button */}
              <Button
                onClick={handleDecline}
                variant="ghost"
                size="sm"
                className="w-6 h-6 rounded-full p-0 text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xs"></i>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to check cookie consent status
export function useCookieConsent() {
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    setHasConsented(consent === "accepted");
  }, []);

  return hasConsented;
}