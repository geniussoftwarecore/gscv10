import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Star,
  TrendingUp,
  Zap,
  Users
} from "lucide-react";
import TechBadge from "./tech-badge";
import KpiPill from "./kpi-pill";
import type { PortfolioProject } from "@/data/portfolio";

interface EnhancedProjectCardProps {
  project: PortfolioProject;
  onLike?: (projectId: string) => void;
  isLiked?: boolean;
  viewMode?: 'grid' | 'list';
  showKpis?: boolean;
  index?: number;
}

export default function EnhancedProjectCard({ 
  project, 
  onLike, 
  isLiked = false,
  viewMode = 'grid',
  showKpis = true,
  index = 0
}: EnhancedProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onLike?.(project.slug);
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

  // Enhanced List View
  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ scale: 1.01, y: -2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group"
      >
        <Link href={`/portfolio/${project.slug}`}>
          <Card className="overflow-hidden cursor-pointer border-2 border-brand-sky-base bg-brand-bg hover:border-brand-sky-accent hover:shadow-xl transition-all duration-400">
            <CardContent className="p-0">
              <div className="flex gap-6">
                {/* Enhanced Image Section */}
                <div className="relative w-80 h-48 flex-shrink-0 overflow-hidden bg-gradient-to-br from-brand-sky-light to-brand-sky-base">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-sky-accent/10 to-brand-sky-accent/5 animate-pulse" />
                  {project.coverImage && (
                    <motion.img
                      src={project.coverImage}
                      alt={project.titleAr}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div 
                    className="absolute top-4 right-4 flex gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge className={statusColors[project.status]}>
                      {statusLabels[project.status]}
                    </Badge>
                  </motion.div>
                </div>

                {/* Enhanced Content Section */}
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm text-brand-text-muted">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>{project.clientAr}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{project.year}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-brand-text-primary group-hover:text-brand-sky-accent transition-colors">
                        {project.titleAr}
                      </h3>
                      <Badge variant="outline" className="border-brand-sky-base text-brand-sky-accent">
                        {project.sectorAr}
                      </Badge>
                    </div>
                    
                    <motion.button
                      onClick={handleLike}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        isLiked 
                          ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                          : 'bg-brand-sky-light text-brand-text-muted hover:bg-brand-sky-accent/20 hover:text-brand-sky-accent'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    </motion.button>
                  </div>

                  {/* Description */}
                  <p className="text-brand-text-muted leading-relaxed line-clamp-2">
                    {project.summaryAr}
                  </p>

                  {/* KPIs Row */}
                  {showKpis && project.kpis && project.kpis.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {project.kpis.slice(0, 3).map((kpi, kpiIndex) => (
                        <KpiPill 
                          key={kpi.id} 
                          kpi={kpi} 
                          index={kpiIndex}
                          size="sm"
                          showTrend={false}
                        />
                      ))}
                    </div>
                  )}

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 6).map((tech, techIndex) => (
                      <TechBadge 
                        key={tech} 
                        technology={tech} 
                        index={techIndex}
                        size="sm"
                        variant="secondary"
                      />
                    ))}
                    {project.tech.length > 6 && (
                      <Badge variant="outline" className="border-brand-sky-base text-brand-text-muted">
                        +{project.tech.length - 6}
                      </Badge>
                    )}
                  </div>

                  {/* Action Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-brand-sky-base">
                    <div className="flex items-center gap-4 text-sm text-brand-text-muted">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{project.teamSize} أعضاء</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{project.durationAr}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-brand-sky-accent text-brand-sky-accent hover:bg-brand-sky-accent hover:text-white group-hover:shadow-md transition-all"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      عرض التفاصيل
                      <ArrowLeft className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    );
  }

  // Enhanced Grid View
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.03, 
        y: -8,
        rotateY: 2,
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group perspective-1000"
    >
      <Link href={`/portfolio/${project.slug}`}>
        <Card className="overflow-hidden cursor-pointer border-2 border-brand-sky-base bg-brand-bg hover:border-brand-sky-accent hover:shadow-2xl transition-all duration-400 h-full">
          {/* Enhanced Image Header */}
          <div className="relative h-56 overflow-hidden bg-gradient-to-br from-brand-sky-light to-brand-sky-base">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-sky-accent/10 to-brand-sky-accent/5" />
            {project.coverImage && (
              <motion.img
                src={project.coverImage}
                alt={project.titleAr}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                }`}
                onLoad={() => setImageLoaded(true)}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.4 }}
              />
            )}
            
            {/* Floating Action Buttons */}
            <motion.div 
              className="absolute top-4 right-4 flex gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index * 0.1) + 0.3 }}
            >
              <Badge className={`${statusColors[project.status]} shadow-lg backdrop-blur-sm`}>
                {statusLabels[project.status]}
              </Badge>
            </motion.div>

            <motion.div
              className="absolute bottom-4 right-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                scale: isHovered ? 1 : 0.8 
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                onClick={handleLike}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${
                  isLiked 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-white/90 text-brand-text-muted hover:bg-brand-sky-accent hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </motion.button>
            </motion.div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <CardHeader className="pb-3">
            <div className="space-y-3">
              {/* Client and Year Info */}
              <div className="flex items-center justify-between text-sm text-brand-text-muted">
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  <span>{project.clientAr}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{project.year}</span>
                </div>
              </div>

              {/* Title and Sector */}
              <div className="space-y-2">
                <motion.h3 
                  className="text-lg font-bold text-brand-text-primary group-hover:text-brand-sky-accent transition-colors line-clamp-2 leading-tight"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {project.titleAr}
                </motion.h3>
                <Badge 
                  variant="outline" 
                  className="border-brand-sky-base text-brand-sky-accent bg-brand-sky-light/50"
                >
                  {project.sectorAr}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-4">
            {/* Description */}
            <motion.p 
              className="text-brand-text-muted text-sm leading-relaxed line-clamp-3"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
            >
              {project.summaryAr}
            </motion.p>

            {/* Top KPIs */}
            {showKpis && project.kpis && project.kpis.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {project.kpis.slice(0, 2).map((kpi, kpiIndex) => (
                  <KpiPill 
                    key={kpi.id} 
                    kpi={kpi} 
                    index={kpiIndex}
                    size="sm"
                    showTrend={true}
                  />
                ))}
              </div>
            )}

            {/* Technologies */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {project.tech.slice(0, 4).map((tech, techIndex) => (
                  <TechBadge 
                    key={tech} 
                    technology={tech} 
                    index={techIndex}
                    size="sm"
                    variant="secondary"
                  />
                ))}
                {project.tech.length > 4 && (
                  <Badge variant="outline" className="border-brand-sky-base text-brand-text-muted text-xs">
                    +{project.tech.length - 4}
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-3 border-t border-brand-sky-base">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-brand-text-muted">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{project.teamSize}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{project.durationAr}</span>
                  </div>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-brand-sky-accent text-brand-sky-accent hover:bg-brand-sky-accent hover:text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    عرض
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>

          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-sky-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          {/* Floating Animation Elements */}
          <motion.div
            className="absolute -top-2 -right-2 w-8 h-8 bg-brand-sky-accent/10 rounded-full"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </Card>
      </Link>
    </motion.div>
  );
}