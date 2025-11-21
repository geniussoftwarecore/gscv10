import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Globe, ArrowRight, Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { SiReact, SiNextdotjs, SiTypescript } from "react-icons/si";

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
    setLocation('/contact?service=web-development');
  };

  const handleSecondaryCta = () => {
    setLocation('/contact?service=web-development&type=demo');
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/10 py-20 overflow-hidden">
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
                      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      aria-label={dir === 'rtl' ? 'المواقع الإلكترونية' : 'Websites'}
                      data-testid="badge-websites"
                    >
                      <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {dir === 'rtl' ? 'المواقع الإلكترونية' : 'Websites'}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{dir === 'rtl' ? 'مواقع احترافية متجاوبة' : 'Professional responsive websites'}</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                      aria-label={dir === 'rtl' ? 'المنصات الرقمية' : 'Digital Platforms'}
                      data-testid="badge-platforms"
                    >
                      <Monitor className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {dir === 'rtl' ? 'المنصات الرقمية' : 'Digital Platforms'}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{dir === 'rtl' ? 'منصات إدارة المحتوى والأعمال' : 'Content and business management platforms'}</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                      aria-label={dir === 'rtl' ? 'تطبيقات الويب' : 'Web Applications'}
                      data-testid="badge-webapps"
                    >
                      <SiReact className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {dir === 'rtl' ? 'تطبيقات الويب' : 'Web Apps'}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{dir === 'rtl' ? 'تطبيقات ويب تفاعلية متطورة' : 'Advanced interactive web applications'}</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                      aria-label={dir === 'rtl' ? 'جميع الأجهزة' : 'All Devices'}
                      data-testid="badge-responsive"
                    >
                      <div className="flex items-center gap-1">
                        <Monitor className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        <Smartphone className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {dir === 'rtl' ? 'متجاوب' : 'Responsive'}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{dir === 'rtl' ? 'يعمل على جميع الأجهزة والشاشات' : 'Works on all devices and screens'}</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            </div>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50 mb-6 text-sm font-medium text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            data-testid="hero-badge"
          >
            <Globe className="w-4 h-4 text-primary" />
            <span>{title}</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            data-testid="hero-title"
          >
            {subtitle}
          </motion.h1>

          <motion.p 
            className="text-xl text-gray-600 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            data-testid="hero-description"
          >
            {description}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={handlePrimaryCta}
              data-testid="button-primary-cta"
            >
              <ArrowRight className={cn(
                "w-5 h-5 mr-2",
                dir === 'rtl' && "rotate-180 mr-0 ml-2"
              )} />
              {primaryCta}
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300"
              onClick={handleSecondaryCta}
              data-testid="button-secondary-cta"
            >
              {secondaryCta}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}