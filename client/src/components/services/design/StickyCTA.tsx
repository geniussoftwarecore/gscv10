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
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StickyCTAProps {
  onStartWizard: () => void;
  className?: string;
}

export function StickyCTA({ onStartWizard, className }: StickyCTAProps) {
  const { lang, dir } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Show after scrolling down 50% of viewport height
      setIsVisible(scrollPosition > windowHeight * 0.5 && !isDismissed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "fixed bottom-6 left-6 right-6 z-50 pointer-events-none",
            className
          )}
        >
          <Card className="max-w-4xl mx-auto shadow-2xl border-none bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white pointer-events-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                {/* Content */}
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {lang === 'ar' ? 'عرض محدود' : 'Limited Offer'}
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-300">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold mb-1">
                        {lang === 'ar' ? 
                          'ابدأ مشروعك الآن واحصل على استشارة مجانية!' :
                          'Start Your Project Now & Get a Free Consultation!'
                        }
                      </h3>
                      <p className="text-blue-100 text-sm">
                        {lang === 'ar' ? 
                          'خصم 20% على باقة الهوية الكاملة للطلبات الجديدة' :
                          '20% discount on complete identity package for new orders'
                        }
                      </p>
                    </div>

                    {/* Features */}
                    <div className="hidden sm:flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-blue-100">
                        <Zap className="w-3 h-3" />
                        <span>{lang === 'ar' ? 'تسليم سريع' : 'Fast delivery'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-100">
                        <Clock className="w-3 h-3" />
                        <span>{lang === 'ar' ? '10-15 يوم' : '10-15 days'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-100">
                        <Shield className="w-3 h-3" />
                        <span>{lang === 'ar' ? 'ضمان الجودة' : 'Quality guarantee'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={onStartWizard}
                    className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    data-testid="button-sticky-start-wizard"
                  >
                    <span className="hidden sm:inline">
                      {lang === 'ar' ? 'ابدأ الآن' : 'Start Now'}
                    </span>
                    <span className="sm:hidden">
                      {lang === 'ar' ? 'ابدأ' : 'Start'}
                    </span>
                    <ArrowRight className={cn(
                      "w-4 h-4 ml-2",
                      dir === 'rtl' && "mr-2 ml-0 rotate-180"
                    )} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="text-white hover:bg-white/10 p-2 rounded-lg"
                    data-testid="button-dismiss-sticky-cta"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile features */}
              <div className="sm:hidden flex items-center justify-center gap-4 text-xs mt-3 pt-3 border-t border-white/20">
                <div className="flex items-center gap-1 text-blue-100">
                  <Zap className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'تسليم سريع' : 'Fast delivery'}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-100">
                  <Clock className="w-3 h-3" />
                  <span>{lang === 'ar' ? '10-15 يوم' : '10-15 days'}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-100">
                  <Shield className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'ضمان الجودة' : 'Quality guarantee'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}