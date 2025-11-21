import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'wouter';
import { ExternalLink, Eye, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { portfolioProjects, type PortfolioProject } from '@/data/portfolio';

interface HomePortfolioProps {
  maxItems?: number;
}

export default function HomePortfolio({ maxItems = 6 }: HomePortfolioProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  
  // Get featured projects or latest projects as fallback
  const featuredProjects = portfolioProjects
    .filter(project => project.status === 'published')
    .slice(0, maxItems)
    .sort((a, b) => b.year - a.year);

  const toggleLike = (projectId: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="our-work" ref={ref} className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
      {/* Background Elements with White + Sky Blue Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-32 -right-32 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-sky-100/40 to-sky-200/20 rounded-full blur-3xl"
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        <motion.div 
          className="absolute -bottom-24 -left-24 w-48 h-48 sm:w-80 sm:h-80 bg-gradient-to-tl from-sky-200/30 to-sky-100/15 rounded-full blur-2xl"
          animate={{ 
            rotate: -360,
            scale: [1, 0.9, 1.1, 1],
            x: [0, -15, 0],
            y: [0, 15, 0]
          }}
          transition={{ 
            rotate: { duration: 35, repeat: Infinity, ease: "linear" },
            scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 14, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 16, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 3 === 0 ? 'bg-sky-300/20' : 
              i % 3 === 1 ? 'bg-sky-400/25' : 
              'bg-gradient-to-r from-sky-200/15 to-sky-300/20'
            }`}
            style={{
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -25 - Math.random() * 15, 0],
              x: [0, (Math.random() - 0.5) * 20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.3 + Math.random() * 0.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-sky-600 via-sky-800 to-sky-600 bg-clip-text text-transparent mb-6 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 8,
                ease: 'linear',
                repeat: Infinity,
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
              className="bg-gradient-to-r from-sky-600 via-sky-800 to-sky-600 bg-clip-text text-transparent"
            >
              أعمالنا المميزة
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 15 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            اكتشف مجموعة مختارة من أحدث مشاريعنا التي حققت نتائج استثنائية وساعدت عملاءنا على تحقيق أهدافهم الرقمية
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {featuredProjects.map((project, index) => (
            <HomeProjectCard 
              key={project.slug}
              project={project}
              variants={cardVariants}
              isLiked={likedItems.has(project.slug)}
              onToggleLike={() => toggleLike(project.slug)}
              index={index}
            />
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Link to="/portfolio">
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-sky-300 text-sky-700 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl group"
            >
              <span className="mr-2">استعراض جميع الأعمال</span>
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

interface HomeProjectCardProps {
  project: PortfolioProject;
  variants: any;
  isLiked: boolean;
  onToggleLike: () => void;
  index: number;
}

function HomeProjectCard({ project, variants, isLiked, onToggleLike, index }: HomeProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={variants}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden cursor-pointer shadow-lg border-0 bg-white hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:rotate-1 relative">
        {/* Project Image/Icon */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <motion.div 
            className="w-full h-full bg-gradient-to-br from-sky-100 via-sky-200 to-sky-300 flex items-center justify-center relative overflow-hidden"
            whileHover={{ scale: 1.08, rotate: 2 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
          >
            {/* Animated background pattern */}
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px)',
                backgroundSize: '20px 20px'
              }}
              animate={{
                backgroundPosition: ['0px 0px', '20px 20px'],
              }}
              transition={{
                duration: 20,
                ease: 'linear',
                repeat: Infinity,
              }}
            />
            
            {/* Project Icon */}
            <motion.div 
              className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl sm:text-3xl font-bold text-sky-600"
              animate={{
                rotate: isHovered ? [0, 10, -10, 0] : 0,
                scale: isHovered ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.6 }}
            >
              {project.titleAr.charAt(0)}
            </motion.div>

            {/* Like Button */}
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                onToggleLike();
              }}
              className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 z-20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart 
                className={`w-5 h-5 transition-colors duration-300 ${
                  isLiked ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-400'
                }`} 
              />
            </motion.button>
          </motion.div>
        </div>

        <CardContent className="p-6">
          {/* Project Title */}
          <motion.h3 
            className="text-lg sm:text-xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors duration-300"
            animate={isHovered ? { x: [0, 5, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {project.titleAr}
          </motion.h3>

          {/* Client & Sector */}
          <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
            <span>{project.clientAr}</span>
            <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
            <span>{project.sectorAr}</span>
          </div>

          {/* KPIs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.kpis.slice(0, 2).map((kpi) => (
              <motion.div
                key={kpi.id}
                className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                {kpi.labelAr}: {kpi.value}
              </motion.div>
            ))}
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.slice(0, 3).map((tech, techIndex) => (
              <Badge 
                key={techIndex} 
                variant="secondary" 
                className="text-xs px-2 py-1 bg-slate-100 text-slate-700 hover:bg-sky-100 hover:text-sky-700 transition-colors duration-300"
              >
                {tech}
              </Badge>
            ))}
            {project.tech.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-1 bg-slate-100 text-slate-700">
                +{project.tech.length - 3}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link to={`/portfolio/${project.slug}`}>
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1 border-sky-300 text-sky-600 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-300"
              >
                <Eye className="w-4 h-4 ml-2" />
                التفاصيل
              </Button>
            </Link>
            
            {project.websiteUrl && (
              <Button 
                size="sm" 
                variant="ghost"
                className="text-sky-600 hover:text-sky-800 hover:bg-sky-50"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(project.websiteUrl, '_blank');
                }}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>

        {/* Hover Effect Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 to-sky-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        />
      </Card>
    </motion.div>
  );
}