import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";
import { portfolioProjects } from "@/data/portfolio";
import { ExternalLink, Calendar, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export function PortfolioGrid() {
  const { dir } = useLanguage();
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {portfolioProjects.slice(0, 9).map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/portfolio/${project.slug}`} data-testid={`link-project-${project.slug}`}>
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
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
                    <div className="absolute top-4 rtl:right-4 ltr:left-4">
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
                        <ExternalLink className="w-4 h-4 mr-2" />
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
                    <h3 className="text-xl font-bold text-brand-text-primary mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {dir === 'rtl' ? project.titleAr : project.title}
                    </h3>

                    {/* Project Description */}
                    <p className="text-brand-text-muted mb-4 line-clamp-3 leading-relaxed">
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

        {/* Load More Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
          >
            {dir === 'rtl' ? 'عرض المزيد من المشاريع' : 'Load More Projects'}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}