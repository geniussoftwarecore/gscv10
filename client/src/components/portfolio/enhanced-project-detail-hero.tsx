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
  Globe,
  Eye,
  Heart,
  Share2,
  Play,
  ArrowDown,
  Award,
  Zap
} from 'lucide-react';
import TechBadge from './tech-badge';
import KpiPill from './kpi-pill';
import LightboxViewer from './lightbox-viewer';
import type { PortfolioProject } from '@/data/portfolio';

interface EnhancedProjectDetailHeroProps {
  project: PortfolioProject;
}

export default function EnhancedProjectDetailHero({ project }: EnhancedProjectDetailHeroProps) {
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
          title: project.titleAr,
          text: project.summaryAr,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
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
      <section className="relative min-h-screen bg-gradient-to-br from-brand-bg via-brand-sky-light/30 to-brand-sky-base/40 overflow-hidden">
        {/* Enhanced Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-40 -right-40 w-80 h-80 bg-brand-sky-accent/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-brand-sky-accent/5 to-blue-500/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.6, 0.3, 0.6],
              rotate: [360, 0]
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Floating Elements */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-brand-sky-accent/30 rounded-full"
              style={{
                left: `${10 + (i * 10)}%`,
                top: `${20 + (i * 8)}%`,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 4 + (i * 0.5),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col justify-center min-h-screen py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            
            {/* Project Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              {/* Status and Meta Info */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center gap-4 mb-6 flex-wrap"
              >
                <Badge className={`${statusColors[project.status]} px-4 py-2 text-sm font-medium`}>
                  {statusLabels[project.status]}
                </Badge>
                <div className="flex items-center gap-4 text-sm text-brand-text-muted">
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span>{project.clientAr}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{project.year}</span>
                  </div>
                  <Badge variant="outline" className="border-brand-sky-base text-brand-sky-accent bg-brand-sky-light">
                    {project.sectorAr}
                  </Badge>
                </div>
              </motion.div>

              {/* Project Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-3xl lg:text-5xl xl:text-6xl font-bold text-brand-text-primary mb-6 leading-tight max-w-5xl mx-auto"
              >
                {project.titleAr}
              </motion.h1>

              {/* Project Summary */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-lg lg:text-xl text-brand-text-muted max-w-4xl mx-auto leading-relaxed mb-8"
              >
                {project.summaryAr}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex items-center justify-center gap-4 mb-12 flex-wrap"
              >
                {project.websiteUrl && (
                  <Button
                    asChild
                    size="lg"
                    className="bg-brand-sky-accent hover:bg-brand-sky-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-5 h-5 mr-2" />
                      زيارة المشروع
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}

                {project.githubUrl && (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-2 border-brand-sky-base hover:border-brand-sky-accent hover:bg-brand-sky-light"
                  >
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-5 h-5 mr-2" />
                      كود المصدر
                    </a>
                  </Button>
                )}

                <motion.button
                  onClick={() => setIsLiked(!isLiked)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
                    isLiked 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-white border-2 border-brand-sky-base text-brand-text-muted hover:bg-brand-sky-accent hover:text-white hover:border-brand-sky-accent'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </motion.button>

                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-white border-2 border-brand-sky-base text-brand-text-muted hover:bg-brand-sky-accent hover:text-white hover:border-brand-sky-accent shadow-lg transition-all duration-300"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Project Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mb-16"
            >
              <Card className="border-2 border-brand-sky-base bg-brand-bg shadow-2xl overflow-hidden">
                <CardContent className="p-2">
                  <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-lg bg-gradient-to-br from-brand-sky-light to-brand-sky-base cursor-pointer group"
                       onClick={() => handleImageClick(0)}>
                    {project.coverImage && (
                      <motion.img
                        src={project.coverImage}
                        alt={project.titleAr}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                        whileHover={{ scale: 1.02 }}
                      />
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
                          <Eye className="w-8 h-8 text-brand-sky-accent" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Gallery Indicator */}
                    {project.gallery && project.gallery.length > 0 && (
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-black/70 text-white border-0">
                          +{project.gallery.length} صور
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            >
              {/* Duration */}
              <Card className="border-2 border-brand-sky-base bg-brand-bg hover:border-brand-sky-accent hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-brand-sky-light rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-brand-sky-accent" />
                  </div>
                  <div className="text-2xl font-bold text-brand-text-primary mb-1">
                    {project.durationAr}
                  </div>
                  <div className="text-sm text-brand-text-muted">مدة التطوير</div>
                </CardContent>
              </Card>

              {/* Team Size */}
              <Card className="border-2 border-brand-sky-base bg-brand-bg hover:border-brand-sky-accent hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-brand-sky-light rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-brand-sky-accent" />
                  </div>
                  <div className="text-2xl font-bold text-brand-text-primary mb-1">
                    {project.teamSize}
                  </div>
                  <div className="text-sm text-brand-text-muted">عضو في الفريق</div>
                </CardContent>
              </Card>

              {/* Technologies Count */}
              <Card className="border-2 border-brand-sky-base bg-brand-bg hover:border-brand-sky-accent hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-brand-sky-light rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-brand-sky-accent" />
                  </div>
                  <div className="text-2xl font-bold text-brand-text-primary mb-1">
                    {project.tech.length}
                  </div>
                  <div className="text-sm text-brand-text-muted">تقنية مستخدمة</div>
                </CardContent>
              </Card>

              {/* Services Count */}
              <Card className="border-2 border-brand-sky-base bg-brand-bg hover:border-brand-sky-accent hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-brand-sky-light rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-brand-sky-accent" />
                  </div>
                  <div className="text-2xl font-bold text-brand-text-primary mb-1">
                    {project.services.length}
                  </div>
                  <div className="text-sm text-brand-text-muted">خدمة مقدمة</div>
                </CardContent>
              </Card>
            </motion.div>

            {/* KPIs Grid */}
            {project.kpis && project.kpis.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="mb-16"
              >
                <h2 className="text-2xl lg:text-3xl font-bold text-brand-text-primary text-center mb-8">
                  نتائج المشروع
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {project.kpis.map((kpi, index) => (
                    <KpiPill 
                      key={kpi.id} 
                      kpi={kpi} 
                      index={index}
                      size="lg"
                      showTrend={true}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Technologies */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="text-center"
            >
              <h3 className="text-xl font-bold text-brand-text-primary mb-6">
                التقنيات المستخدمة
              </h3>
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {project.tech.map((tech, index) => (
                  <TechBadge 
                    key={tech} 
                    technology={tech} 
                    index={index}
                    variant="default"
                    size="md"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <motion.button
            onClick={scrollToDetails}
            className="flex flex-col items-center gap-2 text-brand-text-muted hover:text-brand-sky-accent transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm font-medium">تفاصيل المشروع</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-8 h-8 border-2 border-brand-sky-accent rounded-full flex items-center justify-center"
            >
              <ArrowDown className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </motion.div>
      </section>

      {/* Lightbox */}
      <LightboxViewer
        items={[
          { 
            id: 'cover', 
            url: project.coverImage || '', 
            alt: project.titleAr, 
            altAr: project.titleAr,
            type: 'image' 
          },
          ...(project.gallery || [])
        ]}
        initialIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        projectTitle={project.titleAr}
      />
    </>
  );
}