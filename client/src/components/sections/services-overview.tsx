import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Service } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedCard, AnimatedText } from "@/components/ui/animated-card";
import { InteractiveButton } from "@/components/ui/interactive-button";
import { motion } from "framer-motion";
import { DynamicIcon, IconName } from "@/lib/icons";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/i18n/lang";

interface ServicesOverviewProps {
  limit?: number;
}

export default function ServicesOverview({ limit = 6 }: ServicesOverviewProps) {
  const { t } = useTranslation();
  const { dir } = useLanguage();
  
  const {
    data: services,
    isLoading,
    error,
  } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  if (error) {
    return (
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">
              <AlertTriangle size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('common.error')}
            </h2>
            <p className="text-gray-600">
              {t('services.loadError', 'حدث خطأ أثناء تحميل الخدمات. يرجى المحاولة مرة أخرى.')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedText className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold text-secondary mb-6 ${dir ? 'text-right' : 'text-left'}`}>
            {t('services.title')}
          </h2>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto ${dir ? 'text-right' : 'text-left'}`}>
            {t('services.subtitle')}
          </p>
        </AnimatedText>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(limit)].map((_, index) => (
              <Card key={index} className="p-8">
                <CardContent className="p-0">
                  <Skeleton className="h-12 w-12 mb-6" />
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-6" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.slice(0, limit).map((service, index) => (
              <Link key={service.id} href={`/services/${service.id}`}>
                <AnimatedCard
                  delay={index * 0.1}
                  className={`p-8 group cursor-pointer h-full relative overflow-hidden ${
                    service.featured === "true"
                      ? "gradient-primary text-white shadow-2xl scale-105"
                      : "bg-white hover:shadow-xl"
                  }`}
                >
                  {service.featured === "true" && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                      مميز
                    </div>
                  )}
                  
                  <CardContent className="p-0 h-full flex flex-col">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={`text-5xl mb-6 ${
                        service.featured === "true"
                          ? "text-white"
                          : "text-primary"
                      }`}
                    >
                      <DynamicIcon name={service.icon as IconName} size={60} />
                    </motion.div>
                    
                    <h3
                      className={`text-2xl font-bold mb-4 ${
                        service.featured === "true"
                          ? "text-white"
                          : "text-secondary"
                      }`}
                    >
                      {service.title}
                    </h3>
                    
                    <p
                      className={`mb-6 leading-relaxed flex-grow ${
                        service.featured === "true"
                          ? "text-gray-100"
                          : "text-gray-600"
                      }`}
                    >
                      {service.description}
                    </p>

                    <div className={`mb-6 ${
                      service.featured === "true" ? "text-gray-100" : "text-gray-700"
                    }`}>
                      {service.technologies && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {service.technologies.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className={`text-xs px-2 py-1 rounded-full ${
                                service.featured === "true"
                                  ? "bg-white/20 text-white"
                                  : "bg-primary/10 text-primary"
                              }`}
                            >
                              {tech}
                            </span>
                          ))}
                          {service.technologies.length > 3 && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              service.featured === "true"
                                ? "bg-white/20 text-white"
                                : "bg-primary/10 text-primary"
                            }`}>
                              +{service.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <motion.div
                      whileHover={{ x: 5 }}
                      className={`font-semibold cursor-pointer flex items-center mt-auto ${
                        service.featured === "true"
                          ? "text-white hover:text-gray-200"
                          : "text-primary hover:text-primary-dark"
                      }`}
                    >
                      اعرف المزيد
                      <ArrowLeft className="mr-2" size={18} />
                    </motion.div>
                  </CardContent>
                </AnimatedCard>
              </Link>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/services">
            <InteractiveButton
              className="btn-primary shadow-lg hover:shadow-xl"
              icon={<i className="fas fa-arrow-left"></i>}
            >
              استعرض جميع الخدمات
            </InteractiveButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
