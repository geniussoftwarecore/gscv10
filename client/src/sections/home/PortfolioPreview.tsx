import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { ArrowRight, ExternalLink, Sparkles, TrendingUp, Eye } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { PortfolioItem } from "@shared/schema";

export function PortfolioPreview() {
  const { dir } = useLanguage();
  const { t } = useTranslation();

  // Fetch real portfolio items from API
  const { data: portfolioData, isLoading, isError } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  // Get top 3 featured or most recent projects
  const featuredProjects = portfolioData?.slice(0, 3) || [];
  const hasProjects = featuredProjects.length > 0;

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-brand-sky-accent/30 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-brand-sky-accent/10 backdrop-blur-sm rounded-full text-sm font-medium text-primary mb-6 border border-primary/20"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4" />
            {dir === 'rtl' ? 'أعمالنا المميزة' : 'Featured Projects'}
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text-primary dark:text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('portfolio.title')}
          </motion.h2>
          <motion.p
            className="text-lg text-brand-text-muted dark:text-slate-400"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {t('portfolio.subtitle')}
          </motion.p>
        </motion.div>

        {/* Portfolio Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-56 w-full" />
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isError || !hasProjects ? (
          <div className="text-center py-16 mb-12">
            <motion.div
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-brand-sky-accent/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <ExternalLink className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-brand-text-primary dark:text-white mb-3">
                {isError 
                  ? (dir === 'rtl' ? 'عذراً، حدث خطأ' : 'Oops, Something went wrong')
                  : (dir === 'rtl' ? 'قريباً' : 'Coming Soon')
                }
              </h3>
              <p className="text-brand-text-muted dark:text-slate-400 mb-6">
                {isError
                  ? (dir === 'rtl' ? 'لم نتمكن من تحميل المشاريع. يرجى المحاولة مرة أخرى لاحقاً.' : 'Unable to load projects. Please try again later.')
                  : (dir === 'rtl' ? 'نعمل على إضافة مشاريع مميزة قريباً.' : 'We are working on adding featured projects soon.')
                }
              </p>
              <Link href="/portfolio" data-testid="link-portfolio-fallback">
                <Button variant="outline" data-testid="button-portfolio-fallback">
                  {dir === 'rtl' ? 'استكشف محفظة الأعمال' : 'Explore Portfolio'}
                </Button>
              </Link>
            </motion.div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project, index) => (
              <Link key={project.id} href={`/portfolio/${project.slug}`} data-testid={`link-portfolio-${project.slug}`}>
                <motion.div
                  className="group h-full"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  data-testid={`card-portfolio-${project.slug}`}
                >
                  <Card className="h-full overflow-hidden hover-elevate active-elevate-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all duration-300">
                    {/* Project Image */}
                    <div className="relative overflow-hidden h-56 bg-gradient-to-br from-primary/5 to-brand-sky-accent/5">
                      {project.coverImage || project.imageUrl ? (
                        <motion.div
                          className="w-full h-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${project.coverImage || project.imageUrl})`,
                          }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.4 }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-slate-400">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                              <ExternalLink className="w-10 h-10" />
                            </div>
                            <p className="text-sm font-medium">{project.category}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Year Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-700 dark:text-slate-300 border-0">
                          {project.year}
                        </Badge>
                      </div>

                      {/* Hover Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"
                        initial={{ opacity: 0 }}
                      >
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white text-primary hover:bg-slate-100 shadow-lg"
                          data-testid={`button-view-project-${project.slug}`}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {dir === 'rtl' ? 'عرض التفاصيل' : 'View Details'}
                        </Button>
                      </motion.div>
                    </div>

                    {/* Project Content */}
                    <CardContent className="p-6">
                      {/* Category Badge */}
                      <div className="mb-3">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                          {project.category}
                        </Badge>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold text-brand-text-primary dark:text-white mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {project.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-brand-text-muted dark:text-slate-400 mb-4 text-sm leading-relaxed line-clamp-3">
                        {project.description}
                      </p>

                      {/* Technology Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies?.slice(0, 3).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-md font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                        {(project.technologies?.length || 0) > 3 && (
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-md font-medium">
                            +{(project.technologies?.length || 0) - 3}
                          </span>
                        )}
                      </div>

                      {/* View Project Link */}
                      <motion.div
                        className="flex items-center gap-2 text-primary font-medium cursor-pointer group-hover:gap-3 transition-all duration-300"
                        whileHover={{ x: dir === 'rtl' ? -5 : 5 }}
                      >
                        <span className="text-sm">{dir === 'rtl' ? 'استكشف المشروع' : 'Explore Project'}</span>
                        <ArrowRight 
                          className={cn(
                            "w-4 h-4 transition-transform duration-300",
                            dir === 'rtl' && "rotate-180"
                          )} 
                        />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Projects Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Link href="/portfolio" data-testid="link-view-all-portfolio">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-2xl hover:shadow-primary/50 px-10 py-6 rounded-2xl transition-all duration-300 text-base font-bold group relative overflow-hidden"
              data-testid="button-view-all-portfolio"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              
              <span className="relative z-10 flex items-center gap-3">
                <TrendingUp className="w-5 h-5" />
                {dir === 'rtl' ? 'استكشف جميع المشاريع' : 'Explore All Projects'}
                <ArrowRight 
                  className={cn(
                    "w-5 h-5 transition-transform duration-300 group-hover:translate-x-1",
                    dir === 'rtl' && "rotate-180 group-hover:-translate-x-1"
                  )} 
                />
              </span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
