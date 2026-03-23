import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { ArrowRight, ExternalLink, Sparkles, TrendingUp, Calendar, Building2 } from "lucide-react";
import { Link } from "wouter";
import { portfolioProjects } from "@/data/portfolio";

export function PortfolioPreview() {
  const { dir } = useLanguage();
  const { t } = useTranslation();

  // Projects to exclude from home page
  const excludedSlugs = [
    'fintech-mobile-app', // تطبيق البنكية الرقمية - البنك السعودي
    'logistics-optimization-platform', // منصة اللوجستيات الذكية
    'educational-platform-ksu', // نظام إدارة التعلم الذكي
    'healthcare-management-system' // نظام إدارة الرعاية الصحية - مستشفى الملك فهد
  ];

  // Get top 6 featured projects excluding specific ones
  const featuredProjects = portfolioProjects
    .filter(p => p.status === 'published' && !excludedSlugs.includes(p.slug))
    .slice(0, 6);

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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/portfolio/${project.slug}`} data-testid={`link-project-${project.slug}`}>
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer h-full">
                  {/* Project Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={project.coverImage.startsWith('@assets') ? project.coverImage.replace('@assets', '/attached_assets') : project.coverImage}
                      alt={dir === 'rtl' ? project.titleAr : project.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      width={400}
                      height={256}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Project Type Badge */}
                    <div className={cn(
                      "absolute top-4",
                      dir === 'rtl' ? "right-4" : "left-4"
                    )}>
                      <Badge className="bg-primary text-white border-0">
                        {dir === 'rtl' ? project.sectorAr : project.sector}
                      </Badge>
                    </div>

                    {/* Hover Action */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        className="bg-white text-primary hover:bg-primary hover:text-white transition-colors duration-300"
                        data-testid={`button-view-project-${project.slug}`}
                      >
                        <ExternalLink className={cn("w-4 h-4", dir === 'rtl' ? "ml-2" : "mr-2")} />
                        {dir === 'rtl' ? 'عرض المشروع' : 'View Project'}
                      </Button>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    {/* Project Meta */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-brand-text-muted">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        <span>{dir === 'rtl' ? project.clientAr : project.client}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{project.year}</span>
                      </div>
                    </div>

                    {/* Project Title */}
                    <h3 className="text-xl font-bold text-brand-text-primary dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {dir === 'rtl' ? project.titleAr : project.title}
                    </h3>

                    {/* Project Description */}
                    <p className="text-brand-text-muted dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                      {dir === 'rtl' ? project.summaryAr : project.summaryEn}
                    </p>

                    {/* Technology Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.slice(0, 3).map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="text-xs border-brand-sky-accent text-brand-sky-accent hover:bg-brand-sky-accent hover:text-white transition-colors duration-300"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.tech.length > 3 && (
                        <Badge variant="outline" className="text-xs text-brand-text-muted">
                          +{project.tech.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Project Link */}
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between text-primary hover:text-white hover:bg-primary transition-all duration-300",
                        dir === 'rtl' && "flex-row-reverse"
                      )}
                      data-testid={`button-details-${project.slug}`}
                    >
                      <span>{dir === 'rtl' ? 'عرض التفاصيل' : 'View Details'}</span>
                      <ExternalLink className={cn("w-4 h-4", dir === 'rtl' ? 'mr-2' : 'ml-2')} />
                    </Button>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

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
