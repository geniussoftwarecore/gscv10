import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { useLanguage } from "@/i18n/lang";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

interface StickyCTAProps {
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
}

export function StickyCTA({ 
  title, 
  description, 
  primaryLabel, 
  secondaryLabel 
}: StickyCTAProps) {
  const { dir } = useLanguage();
  const [, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 400;
      setIsVisible(scrolled && !isDismissed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handlePrimaryCta = () => {
    setLocation('/contact?service=web-development');
  };

  const handleSecondaryCta = () => {
    setLocation('/contact?service=web-development&type=consultation');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="bg-white border-t border-gray-200 shadow-2xl backdrop-blur-lg bg-white/95">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm leading-tight">
                    {title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-tight">
                    {description}
                  </p>
                </div>
                <button
                  onClick={() => setIsDismissed(true)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-primary hover:bg-primary-dark text-white text-xs py-2 px-3 rounded-lg font-medium"
                  onClick={handlePrimaryCta}
                >
                  <ArrowRight className={cn(
                    "w-3 h-3 mr-1",
                    dir === 'rtl' && "rotate-180 mr-0 ml-1"
                  )} />
                  {primaryLabel}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs py-2 px-3 rounded-lg font-medium"
                  onClick={handleSecondaryCta}
                >
                  {secondaryLabel}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}