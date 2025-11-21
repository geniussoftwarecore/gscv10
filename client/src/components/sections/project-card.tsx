
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Eye, 
  ExternalLink, 
  Star, 
  Calendar,
  Users,
  TrendingUp,
  Clock,
  ArrowLeft
} from "lucide-react";
import { DynamicIcon, IconName } from "@/lib/icons";
import { Link } from "wouter";

interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  industry: string;
  services?: string[];
  imageUrl: string;
  technologies?: string[];
  featured: string;
  year: string;
  duration?: string;
  teamSize?: string;
  client?: {
    name: string;
    company: string;
    position: string;
    logo?: string;
  };
  kpis?: Array<{
    label: string;
    value: string;
    description: string;
    icon?: string;
  }>;
  testimonial?: {
    content: string;
    author: string;
    position: string;
    rating: number;
  };
  tags?: string[];
  views: string;
  likes: string;
  liveUrl?: string;
}

interface ProjectCardProps {
  project: PortfolioItem;
  viewMode: 'grid' | 'list';
  index: number;
  onLike?: (id: string) => void;
  isLiked?: boolean;
}

export default function ProjectCard({ 
  project, 
  viewMode, 
  index, 
  onLike, 
  isLiked = false 
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike?.(project.id);
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const industries = {
    "Government": "حكومي",
    "E-commerce": "تجارة إلكترونية", 
    "Healthcare": "صحي",
    "Education": "تعليمي",
    "Logistics": "لوجستيات",
    "Finance": "مالي",
    "Industrial": "صناعي",
    "Media": "إعلام"
  };

  return (
    <Link href={`/portfolio/${project.slug}`}>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`group cursor-pointer ${
          viewMode === 'list' ? 'flex gap-6' : ''
        }`}
      >
        <Card className="overflow-hidden border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 relative">
          {/* Featured Badge */}
          {project.featured === "true" && (
            <motion.div
              className="absolute top-4 right-4 z-20"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                مميز
              </Badge>
            </motion.div>
          )}

          {/* Project Image/Icon */}
          <div className={`
            relative overflow-hidden
            ${viewMode === 'list' ? 'w-80 h-48 flex-shrink-0' : 'h-56 sm:h-64'}
          `}>
            <motion.div 
              className="w-full h-full bg-gradient-to-br from-primary/12 via-primary/20 to-primary/30 flex items-center justify-center relative overflow-hidden"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 8 + index,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              {/* Animated background patterns */}
              <motion.div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: 'radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px)',
                  backgroundSize: '20px 20px'
                }}
                animate={{
                  backgroundPosition: ['0px 0px', '20px 20px'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              
              <motion.div
                className="relative z-10"
                animate={{
                  rotate: isHovered ? [0, 360] : 0,
                  scale: isHovered ? 1.2 : [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 0.8 },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <DynamicIcon 
                  name={project.imageUrl as IconName} 
                  className="text-primary/80 drop-shadow-lg" 
                  size={viewMode === 'list' ? 48 : 64} 
                />
              </motion.div>

              {/* Industry Badge */}
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-white/90 text-gray-700 backdrop-blur-sm">
                  {industries[project.industry as keyof typeof industries] || project.industry}
                </Badge>
              </div>

              {/* Hover Overlay */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2 justify-center">
                    {/* Quick Actions */}
                    <motion.button
                      className="p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300"
                      onClick={handleLike}
                      whileHover={{ scale: 1.1, rotate: 12 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart 
                        className={`w-4 h-4 ${isLiked 
                          ? 'text-red-500 fill-current' 
                          : 'text-gray-700'
                        }`}
                      />
                    </motion.button>
                    
                    <motion.button
                      className="p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye className="w-4 h-4 text-gray-700" />
                    </motion.button>
                    
                    {project.liveUrl && (
                      <motion.button
                        className="p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(project.liveUrl, '_blank');
                        }}
                        whileHover={{ scale: 1.1, x: 3 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ExternalLink className="w-4 h-4 text-gray-700" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Project Content */}
          <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <motion.h3 
                className="text-xl font-bold text-secondary group-hover:text-primary transition-colors duration-300 flex-1 line-clamp-2"
                whileHover={{ x: 3 }}
              >
                {project.title}
              </motion.h3>
              
              <motion.button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                onClick={handleLike}
                whileHover={{ scale: 1.1, rotate: 12 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart 
                  className={`w-5 h-5 ${isLiked 
                    ? 'text-red-500 fill-current' 
                    : 'text-gray-400 hover:text-red-400'
                  }`}
                />
              </motion.button>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {project.description}
            </p>

            {/* Project Meta */}
            <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-500">
              {project.year && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {project.year}
                </span>
              )}
              {project.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {project.duration}
                </span>
              )}
              {project.teamSize && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {project.teamSize}
                </span>
              )}
            </div>

            {/* Key Metrics Preview */}
            {project.kpis && project.kpis.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">{project.kpis[0]?.value}</span>
                    <span className="text-xs text-gray-500">{project.kpis[0]?.label}</span>
                  </div>
                  {project.kpis[1] && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <span className="font-medium">{project.kpis[1]?.value}</span>
                      <span className="text-xs text-gray-500">{project.kpis[1]?.label}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies?.slice(0, viewMode === 'list' ? 3 : 4).map((tech, techIndex) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: techIndex * 0.1 + 0.5 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-gray-100 text-gray-700 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
                  >
                    {tech}
                  </Badge>
                </motion.div>
              ))}
              {project.technologies && project.technologies.length > (viewMode === 'list' ? 3 : 4) && (
                <Badge variant="outline" className="text-xs text-gray-500">
                  +{project.technologies.length - (viewMode === 'list' ? 3 : 4)}
                </Badge>
              )}
            </div>

            {/* Services Tags */}
            {project.services && project.services.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {project.services.slice(0, 2).map((service, serviceIndex) => (
                  <Badge 
                    key={service}
                    variant="outline" 
                    className="text-xs text-primary border-primary/30 bg-primary/5"
                  >
                    {service}
                  </Badge>
                ))}
                {project.services.length > 2 && (
                  <Badge variant="outline" className="text-xs text-gray-500">
                    +{project.services.length - 2}
                  </Badge>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center text-xs text-gray-500 gap-4">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {project.views}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {project.likes}
                </span>
              </div>
              
              <motion.div
                className="flex items-center text-primary hover:text-primary/80 text-sm font-medium group/btn"
                whileHover={{ x: 3 }}
              >
                <span className="hidden sm:inline">عرض التفاصيل</span>
                <span className="sm:hidden">عرض</span>
                <ArrowLeft className="w-4 h-4 mr-1 group-hover/btn:translate-x-1 transition-transform" />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
