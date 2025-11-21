import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Service } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedCard, AnimatedSection, AnimatedText } from "@/components/ui/animated-card";
import { InteractiveButton } from "@/components/ui/interactive-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Code, Palette, Megaphone, TrendingUp, Search, Compass, Hammer, CheckCircle, Smartphone, Cloud, Package, Database, Server, Phone, Clock, Users } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/i18n/lang";
import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { cn } from "@/lib/utils";
import {
  PageHeaderServices,
  ServicesGrid,
  ServicesCTA
} from "@/sections/services";

export default function Services() {
  const { t } = useTranslation();
  const { dir } = useLanguage();
  const { data: servicesResponse, isLoading, error } = useQuery<{success: boolean, data: Service[]}>({
    queryKey: ["/api/services"],
  });
  
  const services = servicesResponse?.data || [];

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [likedServices, setLikedServices] = useState<Set<string>>(new Set());

  const toggleLike = (serviceId: string) => {
    setLikedServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  const processes = [
    {
      step: "01",
      title: "الاستشارة والتحليل",
      description: "نبدأ بفهم احتياجاتك وتحليل متطلبات المشروع بدقة",
      icon: Search,
    },
    {
      step: "02",
      title: "التخطيط والتصميم",
      description: "وضع خطة شاملة وتصميم النماذج الأولية للمشروع",
      icon: Compass,
    },
    {
      step: "03",
      title: "التطوير والبناء",
      description: "تطوير الحل باستخدام أحدث التقنيات وأفضل الممارسات",
      icon: Hammer,
    },
    {
      step: "04",
      title: "الاختبار والتسليم",
      description: "اختبار شامل للجودة ثم تسليم المشروع مع التدريب والدعم",
      icon: CheckCircle,
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{t('services.loadError')}</p>
          <InteractiveButton onClick={() => window.location.reload()}>
            {t('common.cancel')}
          </InteractiveButton>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={dir === 'rtl' ? 'خدماتنا المتخصصة' : 'Our Specialized Services'}
        description={dir === 'rtl' 
          ? 'نقدم مجموعة شاملة من الخدمات التقنية المتطورة لتلبية جميع احتياجاتك الرقمية وتحقيق نجاح أعمالك'
          : 'We offer a comprehensive range of advanced technical services to meet all your digital needs and achieve business success'
        }
        type="website"
      />
      
      <motion.div 
        className="min-h-screen"
        dir={dir}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Page Header */}
        <PageHeaderServices />
        
        {/* Services Grid with Filters */}
        <ServicesGrid 
          services={services}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          hoveredService={hoveredService}
          setHoveredService={setHoveredService}
          likedServices={likedServices}
          toggleLike={toggleLike}
          loading={isLoading}
          error={error ? String(error) : null}
        />

        {/* Statistics Section - Commented Out */}
        {/* <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-80 h-80 bg-brand-sky-accent/20 rounded-full blur-3xl"
              animate={{
                x: [0, -40, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                إنجازاتنا بالأرقام
              </motion.h2>
              <motion.p
                className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                نفخر بالثقة التي وضعها عملاؤنا فينا وبالنجاحات التي حققناها معاً
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "150+", label: "مشروع مكتمل", icon: CheckCircle },
                { number: "50+", label: "عميل راضي", icon: Users },
                { number: "5+", label: "سنوات خبرة", icon: Clock },
                { number: "24/7", label: "دعم فني", icon: Phone },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <motion.div
                    className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <stat.icon size={40} className="text-white" />
                  </motion.div>
                  <motion.div
                    className="text-4xl lg:text-5xl font-bold mb-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: (index * 0.1) + 0.3, duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    {stat.number}
                  </motion.div>
                  <p className="text-lg text-white/90">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Process Section */}
        <section className="py-20 bg-gradient-to-br from-brand-sky-light to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text-primary mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                عملية العمل
              </motion.h2>
              <motion.p
                className="text-lg text-brand-text-muted"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                نتبع منهجية مدروسة لضمان تسليم مشاريع عالية الجودة في الوقت المحدد
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processes.map((process, index) => (
                <motion.div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-brand-sky-base hover:border-primary text-center overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  {/* Background Animation */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-brand-sky-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  />

                  <div className="relative z-10">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow duration-300">
                        <span className="text-2xl font-bold">{process.step}</span>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        className="text-primary"
                      >
                        <process.icon size={48} className="mx-auto group-hover:text-primary-dark transition-colors duration-300" />
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-bold text-brand-text-primary mb-3 group-hover:text-primary transition-colors duration-300">
                      {process.title}
                    </h3>
                    <p className="text-brand-text-muted leading-relaxed">
                      {process.description}
                    </p>
                  </div>

                  {/* Decorative Elements */}
                  <motion.div
                    className="absolute top-4 rtl:right-4 ltr:left-4 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-20 bg-gradient-to-br from-white to-brand-sky-light/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text-primary mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                تقنيات حديثة لحلول متميزة
              </motion.h2>
              <motion.p
                className="text-lg text-brand-text-muted"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                نستخدم أحدث الأدوات والتقنيات العالمية لبناء منتجات قوية وقابلة للتطوير
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "React", icon: Code, color: "text-blue-500", desc: "واجهات تفاعلية" },
                { name: "Node.js", icon: Code, color: "text-green-500", desc: "خوادم قوية" },
                { name: "Python", icon: Code, color: "text-yellow-500", desc: "ذكاء اصطناعي" },
                { name: "Flutter", icon: Smartphone, color: "text-blue-400", desc: "تطبيقات هجينة" },
                { name: "AWS", icon: Cloud, color: "text-orange-500", desc: "استضافة سحابية" },
                { name: "Docker", icon: Package, color: "text-blue-600", desc: "نشر سريع" },
                { name: "MongoDB", icon: Database, color: "text-green-600", desc: "قواعد مرنة" },
                { name: "PostgreSQL", icon: Server, color: "text-blue-700", desc: "بيانات موثوقة" },
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 border border-brand-sky-base/50 hover:border-primary text-center overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-brand-sky-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  />

                  <div className="relative z-10">
                    <motion.div
                      className="mb-4"
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mx-auto group-hover:shadow-xl transition-all duration-300">
                        <tech.icon className="w-7 h-7 text-white" />
                      </div>
                    </motion.div>
                    <h3 className="text-base font-bold text-brand-text-primary group-hover:text-primary transition-colors duration-300 mb-2">
                      {tech.name}
                    </h3>
                    <motion.p 
                      className="text-xs text-brand-text-muted font-medium"
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {tech.desc}
                    </motion.p>
                  </div>

                  <motion.div
                    className="absolute top-3 rtl:right-3 ltr:left-3 w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  />
                  <motion.div
                    className="absolute bottom-3 rtl:left-3 ltr:right-3 w-1.5 h-1.5 bg-brand-sky-accent rounded-full opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <ServicesCTA />

        {/* Floating Action Button for Quick Consultation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="fixed bottom-6 rtl:left-6 ltr:right-6 z-50"
        >
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group"
              data-testid="floating-consultation-button"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Phone size={24} />
              </motion.div>
              <span className={cn(
                "absolute bottom-full mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap",
                dir === 'rtl' ? "right-1/2 transform translate-x-1/2" : "left-1/2 transform -translate-x-1/2"
              )}>
                استشارة مجانية
              </span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Quick Filter Summary */}
        {(searchQuery || activeFilter !== "all") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 rtl:right-6 ltr:left-6 z-40 bg-white rounded-2xl shadow-xl p-4 max-w-sm border border-brand-sky-base"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-text-primary">
                  {services?.filter(s => {
                    let filtered = [s];
                    
                    if (activeFilter !== "all") {
                      const categoryMap = {
                        "business": ["erp", "consulting"],
                        "development": ["web", "mobile", "desktop"],
                        "design": ["design"],
                        "marketing": ["marketing"],
                      };
                      const categories = categoryMap[activeFilter as keyof typeof categoryMap] || [];
                      filtered = filtered.filter(service => categories.includes(service.category));
                    }
                    
                    if (searchQuery.trim()) {
                      const query = searchQuery.toLowerCase();
                      filtered = filtered.filter(service =>
                        service.title.toLowerCase().includes(query) ||
                        service.description.toLowerCase().includes(query) ||
                        (service.technologies && service.technologies.some(tech => 
                          tech.toLowerCase().includes(query)
                        ))
                      );
                    }
                    
                    return filtered.length > 0;
                  }).length || 0} خدمة
                </p>
                <p className="text-xs text-brand-text-muted">
                  {searchQuery && `البحث: "${searchQuery}"`}
                  {activeFilter !== "all" && ` • مرشح نشط`}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                }}
                className="h-8 w-8 p-0 hover:bg-brand-sky-base"
              >
                ✕
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}