import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ExternalLink, 
  Eye, 
  Heart, 
  Calendar,
  Building,
  Code,
  ArrowLeft,
  Star
} from "lucide-react";
import type { PortfolioItem } from "@shared/schema";

interface ProjectCardProps {
  project: PortfolioItem;
  onLike?: (projectId: string) => void;
  isLiked?: boolean;
  viewMode?: 'grid' | 'list';
}

export default function ProjectCard({ 
  project, 
  onLike, 
  isLiked = false,
  viewMode = 'grid'
}: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onLike?.(project.id);
  };

  const statusColors = {
    published: "bg-green-100 text-green-700 border-green-200",
    draft: "bg-yellow-100 text-yellow-700 border-yellow-200",
    archived: "bg-gray-100 text-gray-700 border-gray-200"
  };

  const statusLabels = {
    published: "منشور",
    draft: "مسودة", 
    archived: "مؤرشف"
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Link href={`/portfolio/${project.slug}`}>
          <Card className="overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="flex gap-4">
                {/* Image */}
                <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />
                  {project.coverImage && (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      } ${isHovered ? 'scale-110' : 'scale-100'}`}
                      onLoad={() => setImageLoaded(true)}
                      loading="lazy"
                    />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  
                  {/* Status Badge */}
                  <Badge 
                    className={`absolute top-2 right-2 text-xs ${statusColors[project.status as keyof typeof statusColors]}`}
                  >
                    {statusLabels[project.status as keyof typeof statusLabels]}
                  </Badge>
                  
                  {/* Featured Badge */}
                  {project.featured === "true" && (
                    <Badge className="absolute top-2 left-2 bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      مميز
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 mb-3">
                        {project.description}
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      className="flex-shrink-0"
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
                        }`}
                      />
                    </Button>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {project.industry}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {project.year}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {project.views} مشاهدة
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies && project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {project.client && (
                        <span className="text-sm text-gray-600">
                          {project.client.company}
                        </span>
                      )}
                    </div>
                    
                    <motion.div
                      whileHover={{ x: -5 }}
                      className="flex items-center text-primary text-sm font-medium"
                    >
                      عرض المشروع
                      <ArrowLeft className="w-4 h-4 mr-1" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/portfolio/${project.slug}`}>
        <Card className="group overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm h-full">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />
            {project.coverImage && (
              <img
                src={project.coverImage}
                alt={project.title}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                } group-hover:scale-110`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Status Badge */}
            <Badge 
              className={`absolute top-3 right-3 text-xs ${statusColors[project.status as keyof typeof statusColors]} backdrop-blur-sm`}
            >
              {statusLabels[project.status as keyof typeof statusLabels]}
            </Badge>
            
            {/* Featured Badge */}
            {project.featured === "true" && (
              <Badge className="absolute top-3 left-3 bg-yellow-100 text-yellow-700 border-yellow-200 text-xs backdrop-blur-sm">
                <Star className="w-3 h-3 mr-1" />
                مميز
              </Badge>
            )}

            {/* Like Button */}
            <motion.button
              onClick={handleLike}
              className="absolute bottom-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart 
                className={`w-4 h-4 ${
                  isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </motion.button>

            {/* External Link Button */}
            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-3 right-3 p-2 bg-primary text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ExternalLink className="w-4 h-4" />
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

            {/* Metadata */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Building className="w-3 h-3" />
                {project.industry}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {project.year}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {project.views}
              </div>
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-1 mb-4">
              {project.technologies?.slice(0, 3).map((tech, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.technologies && project.technologies.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.technologies.length - 3}
                </Badge>
              )}
            </div>

            {/* Client Info */}
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

            {/* KPIs Preview */}
            {project.kpis && project.kpis.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">نتائج المشروع:</span>
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
  );
}