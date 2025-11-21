import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Smartphone, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { SiAndroid, SiApple } from "react-icons/si";

interface ServiceHeroProps {
  title: string;
  subtitle: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
}

export function ServiceHero({ 
  title, 
  subtitle, 
  description, 
  primaryCta, 
  secondaryCta 
}: ServiceHeroProps) {
  const { dir } = useLanguage();
  const [, setLocation] = useLocation();

  const handlePrimaryCta = () => {
    setLocation('/contact?service=mobile-apps');
  };

  const handleSecondaryCta = () => {
    setLocation('/contact?service=mobile-apps&type=demo');
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-brand-sky-light/20 to-brand-sky-base/10 py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:32px_32px] opacity-30" />
      
      {/* Platform Icons Bar */}
      <div className="absolute top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TooltipProvider>
            <div className="flex items-center justify-center gap-8 py-4" data-testid="bar-platforms">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      aria-label={dir === 'rtl' ? 'تطبيقات أندرويد' : 'Android Apps'}
                      data-testid="badge-android"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          // Could add future navigation to Android apps section
                        }
                      }}
                    >
                      <SiAndroid className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">Android</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{dir === 'rtl' ? 'تطبيقات أندرويد' : 'Android Apps'}</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                      aria-label={dir === 'rtl' ? 'تطبيقات آيفون' : 'iOS Apps'}
                      data-testid="badge-ios"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          // Could add future navigation to iOS apps section
                        }
                      }}
                    >
                      <SiApple className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">iOS</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{dir === 'rtl' ? 'تطبيقات آيفون' : 'iOS Apps'}</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            </div>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Content */}
          <motion.div
            className="text-center md:text-left space-y-8"
            initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <motion.div
                className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Smartphone className="w-6 h-6 text-white" />
              </motion.div>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-brand-sky-base rounded-full" />
            </div>

            <div className="space-y-4">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {title}
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl text-primary font-medium leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {subtitle}
              </motion.p>
              
              <motion.p
                className="text-lg text-gray-600 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {description}
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  onClick={handlePrimaryCta}
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  data-testid="button-start-project"
                >
                  {primaryCta}
                  <ArrowRight 
                    className={cn(
                      "w-5 h-5 ml-2 transition-transform duration-200",
                      dir === 'rtl' && "rotate-180 ml-0 mr-2"
                    )} 
                  />
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleSecondaryCta}
                  className="px-8 py-4 rounded-2xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                  data-testid="button-try-demo"
                >
                  {secondaryCta}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Phone mockup */}
              <motion.div
                className="w-64 h-[520px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-primary to-brand-sky-base rounded-[2.5rem] flex items-center justify-center relative overflow-hidden">
                  <motion.div
                    className="text-6xl"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0] 
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    📱
                  </motion.div>
                  
                  {/* Floating elements */}
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-white/20 rounded-full"
                      style={{
                        left: `${20 + i * 20}%`,
                        top: `${30 + (i % 2) * 40}%`,
                      }}
                      animate={{
                        y: [-20, 20, -20],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 4 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
                
                {/* Notch */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-gray-900 rounded-full" />
              </motion.div>

              {/* Floating tech icons */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center"
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [0, 360, 0] 
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-2xl">⚡</span>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center"
                animate={{ 
                  y: [10, -10, 10],
                  rotate: [0, -360, 0] 
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <span className="text-2xl">🔒</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}