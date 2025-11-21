import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ExternalLink,
  Github,
  Calendar,
  Building,
  Users,
  Clock,
  DollarSign,
  Eye,
  Heart,
  Share2,
  Play,
  ArrowDown
} from 'lucide-react';
import type { PortfolioItem } from '@shared/schema';
import LightboxGallery from './lightbox-gallery';

interface ProjectDetailHeaderProps {
  project: PortfolioItem;
}

export default function ProjectDetailHeader({ project }: ProjectDetailHeaderProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const scrollToDetails = () => {
    const detailsSection = document.getElementById('project-details');
    if (detailsSection) {
      detailsSection.scrollIntoView({ behavior: 'smooth' });
    }
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

  return (
    <>
      <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/30 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>الرئيسية</span>
                <span>/</span>
                <span>المعرض</span>
                <span>/</span>
                <span className="text-primary font-medium">{project.title}</span>
              </div>

              {/* Title and Status */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <motion.h1 
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {project.title}
                  </motion.h1>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                      {statusLabels[project.status as keyof typeof statusLabels]}
                    </Badge>
                    {project.featured === "true" && (
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                        مميز
                      </Badge>
                    )}
                  </div>
                </div>

                <motion.p 
                  className="text-xl text-gray-600 leading-relaxed"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {project.description}
                </motion.p>
              </div>

              {/* Project Metadata */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                <div className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{project.industry}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{project.year}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{project.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{project.teamSize}</span>
                </div>
              </motion.div>

              {/* Technologies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="space-y-3"
              >
                <h3 className="text-sm font-medium text-gray-700">التقنيات المستخدمة</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="flex flex-wrap gap-4"
              >
                {project.liveUrl && (
                  <Button
                    asChild
                    className="bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90"
                  >
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      زيارة المشروع
                    </a>
                  </Button>
                )}
                
                {project.projectUrl && (
                  <Button variant="outline" asChild>
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      الكود المصدري
                    </a>
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => setIsLiked(!isLiked)}
                  className="flex items-center gap-2"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  {project.likes}
                </Button>
                
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  مشاركة
                </Button>

                <Button 
                  variant="outline"
                  onClick={scrollToDetails}
                  className="flex items-center gap-2"
                >
                  التفاصيل التقنية
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex items-center gap-6 text-sm text-gray-500"
              >
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {project.views} مشاهدة
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {project.likes} إعجاب
                </div>
              </motion.div>
            </motion.div>

            {/* Project Images */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Main Image */}
              <Card className="overflow-hidden shadow-2xl border-0">
                <motion.div
                  className="relative aspect-[4/3] cursor-pointer group"
                  onClick={() => handleImageClick(0)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={project.coverImage || '/api/placeholder/800/600'}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="bg-white/90 backdrop-blur-sm rounded-full p-3"
                    >
                      <Play className="w-6 h-6 text-gray-800" />
                    </motion.div>
                  </div>
                </motion.div>
              </Card>

              {/* Gallery Thumbnails */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {project.gallery.slice(0, 4).map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
                      onClick={() => handleImageClick(index + 1)}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={item.url}
                        alt={item.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      
                      {index === 3 && project.gallery.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-medium">
                            +{project.gallery.length - 3}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.button
            onClick={scrollToDetails}
            className="flex flex-col items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-sm">اكتشف المزيد</span>
            <ArrowDown className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>

      {/* Lightbox Gallery */}
      <LightboxGallery
        items={[
          { id: 'cover', url: project.coverImage || '', alt: project.title, type: 'image' },
          ...(project.gallery || [])
        ]}
        initialIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}