import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { PortfolioItem } from "@shared/schema";

interface RelatedProjectsProps {
  currentProject: PortfolioItem;
  maxItems?: number;
}

export default function RelatedProjects({ 
  currentProject, 
  maxItems = 6 
}: RelatedProjectsProps) {
  const {
    data: portfolioItems,
    isLoading,
  } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  // Find related projects by industry, services, or technologies
  const relatedProjects = portfolioItems?.filter(item => {
    if (item.id === currentProject.id) return false;
    
    // Check for same industry
    if (item.industry === currentProject.industry) return true;
    
    // Check for shared services
    const sharedServices = item.services?.some(service => 
      currentProject.services?.includes(service)
    );
    if (sharedServices) return true;
    
    // Check for shared technologies
    const sharedTech = item.technologies?.some(tech => 
      currentProject.technologies?.includes(tech)
    );
    if (sharedTech) return true;
    
    return false;
  }).slice(0, maxItems) || [];

  if (isLoading || relatedProjects.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            مشاريع ذات صلة
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اكتشف المزيد من المشاريع المميزة في نفس القطاع أو التقنيات المشابهة
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {relatedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link href={`/portfolio/${project.slug}`}>
                <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={project.coverImage || '/api/placeholder/400/300'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Featured Badge */}
                    {project.featured === "true" && (
                      <Badge className="absolute top-3 right-3 bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                        مميز
                      </Badge>
                    )}

                    {/* External Link */}
                    {project.liveUrl && (
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ExternalLink className="w-4 h-4 text-gray-600" />
                      </motion.a>
                    )}
                  </div>

                  <CardContent className="p-6">
                    {/* Title and Description */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    {/* Industry and Year */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{project.industry}</span>
                      <span>{project.year}</span>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies?.slice(0, 3).map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies && project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Client */}
                    {project.client && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {project.client.company}
                        </span>
                        
                        <motion.div
                          className="text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          whileHover={{ x: -3 }}
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </motion.div>
                      </div>
                    )}

                    {/* KPI Preview */}
                    {project.kpis && project.kpis.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">نتيجة بارزة:</span>
                          <span className="text-primary font-medium">
                            {project.kpis[0].value} {project.kpis[0].label}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/portfolio">
            <Button
              size="lg"
              variant="outline"
              className="group hover:bg-primary hover:text-white transition-all duration-300"
            >
              عرض جميع المشاريع
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}