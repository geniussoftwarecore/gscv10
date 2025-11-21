import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  ArrowRight, 
  X, 
  Zap, 
  Clock, 
  Shield,
  Star,
  Megaphone
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StickyCTAProps {
  onStartWizard: () => void;
  className?: string;
}

export function StickyCTA({ onStartWizard, className }: StickyCTAProps) {
  const { lang, dir } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Show sticky CTA after scrolling 100vh
      setIsVisible(scrollPosition > windowHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Zap,
      text: lang === 'ar' ? 'نتائج سريعة' : 'Fast Results'
    },
    {
      icon: Shield,
      text: lang === 'ar' ? 'ضمان الجودة' : 'Quality Guarantee'
    },
    {
      icon: Clock,
      text: lang === 'ar' ? 'دعم 24/7' : '24/7 Support'
    }
  ];

  if (isMinimized) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className={cn(
              "fixed bottom-6 z-50 transition-all duration-300",
              dir === 'rtl' ? 'left-6' : 'right-6',
              className
            )}
          >
            <Button
              onClick={() => setIsMinimized(false)}
              size="lg"
              className="w-14 h-14 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-2xl hover:shadow-sky-500/25 transition-all duration-300 p-0"
              data-testid="button-expand-sticky-cta"
            >
              <Megaphone className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className={cn(
            "fixed bottom-6 z-50 max-w-sm transition-all duration-300",
            dir === 'rtl' ? 'left-6' : 'right-6',
            className
          )}
        >
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-0 shadow-2xl">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {lang === 'ar' ? 'عرض خاص' : 'Special Offer'}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  data-testid="button-minimize-sticky-cta"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {lang === 'ar' ? 
                      'جاهز لتطوير أعمالك؟' :
                      'Ready to Grow Your Business?'
                    }
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {lang === 'ar' ? 
                      'احصل على استشارة مجانية واكتشف كيف يمكننا مساعدتك' :
                      'Get a free consultation and discover how we can help you'
                    }
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <feature.icon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={onStartWizard}
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                    data-testid="button-start-marketing-wizard"
                  >
                    <Megaphone className="w-4 h-4 mr-2" />
                    {lang === 'ar' ? 'ابدأ خطتك' : 'Start Your Plan'}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                  
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>
                      {lang === 'ar' ? 
                        'تقييم 4.9/5 من عملائنا' :
                        '4.9/5 rating from our clients'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}