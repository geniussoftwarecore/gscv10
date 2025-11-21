import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";
import { useServiceTranslations } from "@/hooks/useServiceTranslations";
import { toCanonicalKey, getCanonicalServiceKeys } from "@/lib/services-normalize";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Service } from "@shared/schema";
import { 
  Code, 
  Palette, 
  Megaphone, 
  TrendingUp, 
  Search, 
  ArrowRight,
  Globe,
  Smartphone,
  Boxes,
  Workflow,
  Bot,
  Cloud,
  BarChartBig,
  ShoppingCart,
  LifeBuoy,
  Settings,
  Users,
  Monitor,
  Brain
} from "lucide-react";

interface ServicesGridProps {
  services?: Service[]; // Services data from API
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  hoveredService: string | null;
  setHoveredService: (id: string | null) => void;
  likedServices: Set<string>;
  toggleLike: (id: string) => void;
  loading?: boolean;
  error?: string | null;
}

// Icon mapping for service categories - Fixed to match API data
const getIconForService = (iconName?: string) => {
  const iconMap: Record<string, any> = {
    // API returns these exact values, map them to proper Lucide icons
    "smartphone": Smartphone,
    "code": Code,
    "monitor": Monitor,
    "brain-circuit": Brain, // Use Brain as fallback for brain-circuit since BrainCircuit might not exist
    "palette": Palette,
    "megaphone": Megaphone,
    "brain": Brain,
    "settings": Settings,
    // Additional mappings for consistency
    "globe": Globe,
    "boxes": Boxes,
    "workflow": Workflow,
    "bot": Bot,
    "cloud": Cloud,
    "bar-chart": BarChartBig,
    "shopping-cart": ShoppingCart,
    "life-buoy": LifeBuoy,
    "users": Users
  };
  return iconMap[iconName || "settings"] || Settings;
};

// Compact Service Card Component
interface ServiceCardProps {
  service: Service; // Service from API data
  index: number;
  dir: string;
}

function ServiceCard({
  service,
  index,
  dir
}: ServiceCardProps) {

  const IconComponent = getIconForService(service.icon);
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if this is the smart mobile solutions service
  const isSmartMobileService = service.id === '75cb15d9-9c2f-44c7-bf09-da327bf41332' || 
                               service.title?.includes('الحلول الذكية') || 
                               service.title?.includes('Smart Mobile Solutions');

  // Check if this is the ERP service
  const isERPService = service.id === '99472652-67d9-4b44-98a7-91720bdd15a2' || 
                       service.title?.includes('أنظمة إدارة موارد المؤسسات') || 
                       service.title?.includes('Enterprise Resource Planning');

  const handleERPNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to the ERP service detail page and scroll to ERPNext section
    setLocation(`/services/${service.id}#erpnext-lead-form`);
  };

  const handleViewDetails = () => {
    if (isSmartMobileService) {
      // Show toast message instead of navigating
      toast({
        title: dir === 'rtl' ? "الخدمة قيد التنفيذ" : "Service Under Development",
        description: dir === 'rtl' ? 
          "هذه الخدمة قيد التطوير وستكون متاحة قريباً. نعمل بجد لتقديم أفضل الحلول الذكية والبرمجية للهواتف الذكية." :
          "This service is under development and will be available soon. We are working hard to provide the best smart mobile solutions.",
        variant: "default",
      });
      return;
    }
    // Navigate to the service detail page using the service ID for other services
    setLocation(`/services/${service.id}`);
  };

  const handleCardClick = () => {
    handleViewDetails();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleViewDetails();
    }
  };

  return (
    <motion.div
      className={cn(
        "group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-primary overflow-hidden cursor-pointer",
        isSmartMobileService && "border-orange-200 bg-orange-50/30"
      )}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${t('buttons.viewDetails')} - ${service.title}`}
      data-testid={`service-card-${service.id}`}
    >
      {/* Under Development Badge */}
      {isSmartMobileService && (
        <div className="absolute top-4 right-4 z-20">
          <Badge 
            className="bg-orange-500 text-white font-medium px-3 py-1 text-xs"
            variant="default"
          >
            {dir === 'rtl' ? 'قيد التنفيذ' : 'Under Development'}
          </Badge>
        </div>
      )}

      {/* Background Animation */}
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          isSmartMobileService 
            ? "from-orange-500/5 to-orange-300/10" 
            : "from-primary/5 to-brand-sky-accent/10"
        )}
        initial={false}
      />

      <div className="relative z-10">
        {/* Service Icon */}
        <motion.div
          className="mb-4 flex justify-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-shadow duration-300">
            <IconComponent size={28} className="text-white" />
          </div>
        </motion.div>

        {/* Service Content */}
        <div className="text-center space-y-3">
          {/* Title */}
          <h3 className="text-xl font-bold text-brand-text-primary group-hover:text-primary transition-colors duration-300 leading-tight">
            {service.title}
          </h3>
          
          
          {/* Description - Clamped to 3 lines */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 min-h-[3.75rem]">
            {service.description}
          </p>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="mt-6 space-y-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          {/* Apply Now Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              if (isSmartMobileService) {
                // Show toast message for smart mobile service
                toast({
                  title: dir === 'rtl' ? "الخدمة قيد التنفيذ" : "Service Under Development",
                  description: dir === 'rtl' ? 
                    "هذه الخدمة قيد التطوير وستكون متاحة قريباً. نعمل بجد لتقديم أفضل الحلول الذكية والبرمجية للهواتف الذكية." :
                    "This service is under development and will be available soon. We are working hard to provide the best smart mobile solutions.",
                  variant: "default",
                });
                return;
              }
              // Navigate to contact page with service pre-selected for other services
              setLocation(`/contact?service=${encodeURIComponent(service.title)}`);
            }}
            className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
            size="sm"
            aria-label={`Apply for ${service.title}`}
            data-testid={`apply-now-${service.id}`}
          >
            <span className="font-medium">
              {dir === 'rtl' ? 'اطلب الخدمة' : 'Apply Now'}
            </span>
            <ArrowRight 
              className={cn(
                "w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200",
                dir === 'rtl' && "rotate-180 ml-0 mr-2 group-hover:-translate-x-1"
              )} 
            />
          </Button>
          
          {/* ERPNext v15 Button - Only for ERP Service */}
          {isERPService && (
            <Button
              onClick={handleERPNextClick}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg focus:ring-2 focus:ring-green-500/20 focus:ring-offset-2"
              size="sm"
              aria-label={`ERPNext v15 - ${service.title}`}
              data-testid={`erpnext-v15-${service.id}`}
            >
              <span className="font-medium">
                {dir === 'rtl' ? 'ERPNext v15 🚀' : 'ERPNext v15 🚀'}
              </span>
              <ArrowRight 
                className={cn(
                  "w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200",
                  dir === 'rtl' && "rotate-180 ml-0 mr-2 group-hover:-translate-x-1"
                )} 
              />
            </Button>
          )}
          
          {/* View Details Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
            size="sm"
            aria-label={`${t('buttons.viewDetails')} - ${service.title}`}
            data-testid={`view-details-${service.id}`}
          >
            <span className="font-medium">
              {t('buttons.viewDetails')}
            </span>
            <ArrowRight 
              className={cn(
                "w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200",
                dir === 'rtl' && "rotate-180 ml-0 mr-2 group-hover:-translate-x-1"
              )} 
            />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function ServicesGrid({
  services,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  viewMode,
  setViewMode,
  hoveredService,
  setHoveredService,
  likedServices,
  toggleLike,
  loading,
  error
}: ServicesGridProps) {
  const { dir } = useLanguage();
  const { t } = useTranslation();

  // Category filters matching actual service data
  const serviceCategories = [
    {
      id: "all",
      title: dir === 'rtl' ? "جميع الخدمات" : "All Services",
      icon: TrendingUp,
      color: "text-blue-500",
    },
    {
      id: "web",
      title: dir === 'rtl' ? "تطوير الويب" : "Web Development",
      icon: Globe,
      color: "text-green-500",
    },
    {
      id: "mobile",
      title: dir === 'rtl' ? "تطبيقات الجوال" : "Mobile Apps",
      icon: Smartphone,
      color: "text-blue-500",
    },
    {
      id: "desktop",
      title: dir === 'rtl' ? "تطبيقات سطح المكتب" : "Desktop Apps",
      icon: Monitor,
      color: "text-indigo-500",
    },
    {
      id: "smart-mobile",
      title: dir === 'rtl' ? "الحلول الذكية للجوال" : "Smart Mobile Solutions",
      icon: Bot,
      color: "text-orange-500",
    },
    {
      id: "design",
      title: dir === 'rtl' ? "التصميم والجرافيكس" : "Design & Graphics",
      icon: Palette,
      color: "text-pink-500",
    },
    {
      id: "marketing",
      title: dir === 'rtl' ? "التسويق الرقمي" : "Digital Marketing",
      icon: Megaphone,
      color: "text-red-500",
    },
    {
      id: "erp",
      title: dir === 'rtl' ? "أنظمة ERP" : "ERP Systems",
      icon: Boxes,
      color: "text-purple-500",
    },
    {
      id: "smart",
      title: dir === 'rtl' ? "الذكاء الاصطناعي" : "AI & Smart Solutions",
      icon: Brain,
      color: "text-cyan-500",
    },
  ];

  const filteredServices = useMemo(() => {
    if (!services) return [];
    
    let filtered = services;
    
    // Apply category filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(service => service.category === activeFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service =>
        service.title?.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [services, activeFilter, searchQuery]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-brand-sky-light to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-96 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-brand-sky-light to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            {dir === 'rtl' ? 'إعادة المحاولة' : 'Try Again'}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-brand-sky-light to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filter Controls */}
        <motion.div
          className="max-w-4xl mx-auto mb-12 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Search Input */}
          <motion.div
            className="relative max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <Search className={cn(
                "absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-text-muted",
                dir === 'rtl' ? "right-4" : "left-4"
              )} />
              <Input
                type="text"
                placeholder={dir === 'rtl' ? 'ابحث عن الخدمات...' : 'Search services...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "py-3 text-base rounded-xl border-2 border-gray-200 focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md bg-white",
                  dir === 'rtl' ? "pr-12" : "pl-12"
                )}
                data-testid="search-services"
              />
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {serviceCategories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveFilter(category.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium",
                  activeFilter === category.id
                    ? `bg-primary text-white shadow-lg ${category.color.replace('text-', 'shadow-')}/20`
                    : "bg-white text-brand-text-muted hover:text-brand-text-primary hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                )}
                data-testid={`filter-${category.id}`}
              >
                <category.icon size={16} />
                <span>{category.title}</span>
                {category.id !== "all" && services && (
                  <Badge variant="secondary" className="text-xs ml-1 bg-gray-100 text-gray-600">
                    {services.filter(s => s.category === category.id).length}
                  </Badge>
                )}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Services Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFilter}-${searchQuery}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-testid="services-container"
          >
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                  dir={dir}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16"
              >
                <div className="text-brand-text-muted mb-4">
                  <Search size={64} className="mx-auto mb-4" />
                </div>
                <h3 className="text-2xl font-bold text-brand-text-primary mb-2">
                  {dir === 'rtl' ? 'لا توجد نتائج' : 'No results found'}
                </h3>
                <p className="text-brand-text-muted mb-6">
                  {dir === 'rtl' ? 'جرب تغيير مرشحات البحث أو الكلمات المفتاحية' : 'Try changing search filters or keywords'}
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("all");
                  }}
                  className="rounded-xl"
                >
                  {dir === 'rtl' ? 'إعادة تعيين البحث' : 'Reset Search'}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}