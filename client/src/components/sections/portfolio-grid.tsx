import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { PortfolioItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";
import { DynamicIcon, IconName } from "@/lib/icons";
import { ExternalLink, Eye, Heart, Star, Zap, TrendingUp, Award } from "lucide-react";

interface PortfolioGridProps {
  showFilter?: boolean;
  limit?: number;
}

export default function PortfolioGrid({ showFilter = true, limit }: PortfolioGridProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const {
    data: portfolioItems,
    isLoading,
    error,
  } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  if (error) {
    return (
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              خطأ في تحميل المشاريع
            </h2>
            <p className="text-gray-600">
              حدث خطأ أثناء تحميل المشاريع. يرجى المحاولة مرة أخرى.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const filteredItems = portfolioItems?.filter((item) =>
    activeFilter === "all" ? true : item.category === activeFilter
  );

  const displayItems = limit ? filteredItems?.slice(0, limit) : filteredItems;

  const toggleLike = (itemId: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50/30 relative overflow-hidden" style={{ position: 'relative' }}>
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-32 -right-32 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-primary/8 to-primary/4 rounded-full blur-3xl"
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
          className="absolute -bottom-24 -left-24 w-48 h-48 sm:w-80 sm:h-80 bg-gradient-to-tl from-secondary/6 to-secondary/3 rounded-full blur-2xl"
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
        {/* Enhanced Dynamic Floating Particles System */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 3 === 0 ? 'bg-primary/15' : 
              i % 3 === 1 ? 'bg-secondary/20' : 
              'bg-gradient-to-r from-primary/10 to-secondary/15'
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
              opacity: [0.2, 0.8, 0.2],
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
        
        {/* Geometric floating shapes for visual interest */}
        <motion.div
          className="absolute top-1/6 left-1/5 w-3 h-3 sm:w-4 sm:h-4 border border-primary/40 rotate-45"
          animate={{
            rotate: [45, 405],
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <motion.div
          className="absolute top-2/3 right-1/4 w-2 h-2 sm:w-3 sm:h-3 bg-secondary/30 rounded-full shadow-lg"
          animate={{
            y: [0, -18, 0],
            x: [0, 12, 0],
            scale: [1, 1.4, 1],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
        <motion.div
          className="absolute top-1/2 left-4/5 w-1 h-6 sm:w-2 sm:h-8 bg-gradient-to-b from-primary/25 to-transparent rounded-full"
          animate={{
            rotate: [0, 180, 360],
            y: [0, -25, 0],
            opacity: [0.3, 0.8, 0.3],
            scaleY: [1, 1.3, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent mb-6 relative"
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
              className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent"
            >
              معرض أعمالنا المميزة
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 15 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.01, color: '#4f46e5' }}
          >
            مجموعة مختارة من مشاريعنا المميزة والناجحة التي حققت نتائج استثنائية لعملائنا
          </motion.p>

          {/* Horizontal Moving Statistics Bar */}
          <motion.div 
            className="relative w-full max-w-5xl mx-auto mb-16 overflow-hidden h-32 sm:h-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* Background Track */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-full"
              animate={{
                backgroundPosition: ['0% 0%', '100% 0%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: '200% 100%',
              }}
            />

            {/* Moving Statistics Bar */}
            <motion.div
              className="absolute top-1/2 transform -translate-y-1/2 flex items-center gap-8 sm:gap-12"
              animate={{
                x: ['100vw', '-100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: 'max-content',
              }}
            >
              {[
                { icon: Award, value: "50+", label: "مشروع مكتمل" },
                { icon: Star, value: "98%", label: "رضا العملاء" },
                { icon: TrendingUp, value: "200%", label: "نمو الأداء" },
                { icon: Zap, value: "24/7", label: "دعم مستمر" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 sm:gap-4 bg-white/95 backdrop-blur-sm rounded-full px-4 sm:px-6 py-3 sm:py-4 shadow-lg border border-gray-100/50 min-w-fit"
                  whileHover={{ 
                    scale: 1.1,
                    y: -5,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                    transition: { duration: 0.3 }
                  }}
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    y: {
                      duration: 3 + index * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5
                    }
                  }}
                >
                  <motion.div
                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-full"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotate: { duration: 4 + index, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                  
                  <div className="text-center">
                    <motion.div 
                      className="text-xl sm:text-2xl font-bold text-secondary"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.3
                      }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Secondary Moving Elements for Visual Depth */}
            <motion.div
              className="absolute top-1/2 transform -translate-y-1/2 flex items-center gap-16 opacity-30"
              animate={{
                x: ['-100%', '100vw'],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: 'max-content',
              }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-primary/40 to-secondary/40 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.7
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {showFilter && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              {/* Enhanced Filter Buttons with better mobile responsive */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 px-4">
                {PORTFOLIO_CATEGORIES.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 1.2 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => handleFilterChange(category.id)}
                        className={`
                          relative overflow-hidden transition-all duration-300 
                          ${activeFilter === category.id
                            ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg ring-2 ring-primary/20"
                            : "bg-white hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md border border-gray-200 hover:border-primary/30"
                          }
                          px-3 py-2 sm:px-6 sm:py-3 rounded-full font-medium text-sm sm:text-base
                          focus:outline-none focus:ring-2 focus:ring-primary/20
                        `}
                      >
                      <motion.span
                        className="relative z-10"
                        animate={activeFilter === category.id ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {category.name}
                      </motion.span>
                      {activeFilter === category.id && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10"
                          layoutId="activeFilter"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      </Button>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced View Mode Toggle with better mobile design */}
              <motion.div 
                className="flex justify-center gap-1 p-1 bg-gray-100/80 backdrop-blur-sm rounded-xl w-fit mx-auto shadow-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 }}
              >
                {[
                  { mode: 'grid' as const, label: 'شبكة', icon: '⊞' },
                  { mode: 'list' as const, label: 'قائمة', icon: '☰' }
                ].map((option) => (
                  <motion.button
                    key={option.mode}
                    onClick={() => setViewMode(option.mode)}
                    className={`
                      px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-sm transition-all duration-300 relative overflow-hidden
                      ${viewMode === option.mode 
                        ? 'bg-white text-primary shadow-md ring-2 ring-primary/10' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {viewMode === option.mode && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10"
                        layoutId="activeViewMode"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                      <motion.span
                        animate={viewMode === option.mode ? { rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.5 }}
                        className="text-base sm:text-lg"
                      >
                        {option.icon}
                      </motion.span>
                      <span className="hidden sm:inline">{option.label}</span>
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {isLoading ? (
          <motion.div 
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" 
              : "space-y-4 sm:space-y-6"
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {[...Array(limit || 6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100 
                }}
                className={viewMode === 'list' ? "flex gap-3 sm:gap-4" : ""}
              >
                <Card className="overflow-hidden shadow-sm border-0 bg-white/90 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                  <motion.div
                    animate={{ 
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Skeleton className={
                      viewMode === 'list' 
                        ? "h-24 w-32 sm:h-32 sm:w-48 flex-shrink-0 rounded-lg" 
                        : "h-48 sm:h-56 md:h-64 w-full rounded-lg"
                    } />
                  </motion.div>
                  <CardContent className="p-4 sm:p-6">
                    <motion.div
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    >
                      <Skeleton className="h-5 sm:h-6 w-3/4 mb-3 rounded" />
                    </motion.div>
                    <motion.div
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }}
                    >
                      <Skeleton className="h-4 w-full mb-2 rounded" />
                      <Skeleton className="h-4 w-2/3 rounded" />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <AnimatePresence>
            {viewMode === 'grid' ? (
              /* Horizontal Moving Bar Layout */
              <motion.div 
                key={activeFilter + viewMode}
                className="relative w-full overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {/* Moving Projects Bar from Right to Left */}
                <motion.div
                  className="flex items-center gap-6 sm:gap-8 py-8"
                  animate={{
                    x: ['100vw', '-100%'],
                  }}
                  transition={{
                    duration: displayItems ? 15 + (displayItems.length * 2) : 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    width: 'max-content',
                  }}
                >
                  {displayItems?.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="flex-shrink-0"
                      whileHover={{ 
                        scale: 1.1,
                        y: -10,
                        zIndex: 20,
                        transition: { duration: 0.3 }
                      }}
                      animate={{
                        y: [0, -5 - (index % 3) * 3, 0],
                        rotate: [0, (index % 2 === 0 ? 2 : -2), 0],
                      }}
                      transition={{
                        y: {
                          duration: 3 + (index % 4) * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.3
                        },
                        rotate: {
                          duration: 4 + (index % 3) * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2
                        }
                      }}
                    >
                      <Card className="w-64 sm:w-80 h-48 sm:h-56 overflow-hidden cursor-pointer shadow-lg border-0 bg-white/96 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 relative group">
                        {/* Featured Badge */}
                        {item.featured === "true" && (
                          <motion.div
                            className="absolute top-3 right-3 z-20"
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
                        <div className="relative h-2/3 overflow-hidden">
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
                                rotate: [0, 360],
                                scale: [1, 1.1, 1],
                              }}
                              transition={{
                                rotate: { duration: 6 + index, repeat: Infinity, ease: "linear" },
                                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                              }}
                              whileHover={{ 
                                scale: 1.3,
                                rotate: 720,
                                transition: { duration: 0.6 } 
                              }}
                            >
                              <DynamicIcon 
                                name={item.imageUrl as IconName} 
                                className="text-primary/80 drop-shadow-lg" 
                                size={48} 
                              />
                            </motion.div>

                            {/* Moving Progress Bar */}
                            <motion.div
                              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary"
                              animate={{
                                width: ['0%', '100%', '0%'],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: index * 0.5
                              }}
                            />
                          </motion.div>
                        </div>

                        {/* Project Content */}
                        <CardContent className="p-3 sm:p-4 h-1/3 flex flex-col justify-center">
                          <motion.h3 
                            className="text-sm sm:text-base font-bold text-secondary text-center mb-2 line-clamp-1"
                            animate={{
                              color: ['#374151', '#6366f1', '#374151'],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: index * 0.4
                            }}
                          >
                            {item.title}
                          </motion.h3>
                          
                          <div className="flex justify-center gap-1 flex-wrap">
                            {item.technologies?.slice(0, 3).map((tech, techIndex) => (
                              <motion.div
                                key={techIndex}
                                animate={{
                                  scale: [1, 1.05, 1],
                                  opacity: [0.8, 1, 0.8],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: techIndex * 0.2
                                }}
                              >
                                <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-100 text-gray-700">
                                  {tech}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Background Moving Elements */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
                  style={{ zIndex: -1 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-primary/20 rounded-full"
                      style={{
                        top: `${20 + i * 15}%`,
                      }}
                      animate={{
                        x: ['100vw', '-50px'],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 12 + i * 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 2
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              /* Traditional List View */
              <motion.div 
                key={activeFilter + viewMode}
                className="space-y-4 sm:space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
              {displayItems?.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  layout
                  className={`group ${viewMode === 'list' ? 'flex gap-3 sm:gap-6' : ''}`}
                >
                  <Card className={`
                    overflow-hidden cursor-pointer shadow-sm border-0 bg-white/96 backdrop-blur-sm
                    hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:rotate-2
                    ${item.featured === "true" ? "ring-2 ring-primary/25 shadow-lg" : ""}
                    ${viewMode === 'list' ? 'flex-1' : ''}
                    group-hover:shadow-2xl group-hover:border-primary/15 relative
                    before:absolute before:inset-0 before:bg-gradient-to-tr before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
                  `}>
                    {/* Enhanced Project Image/Icon with better mobile sizing */}
                    <div className={`
                      relative overflow-hidden
                      ${viewMode === 'list' ? 'w-32 h-24 sm:w-48 sm:h-32 flex-shrink-0' : 'h-48 sm:h-56 md:h-64'}
                    `}>
                      <motion.div 
                        className="w-full h-full bg-gradient-to-br from-primary/12 via-primary/20 to-primary/30 flex items-center justify-center relative overflow-hidden"
                        whileHover={{ scale: 1.08, rotate: 3 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
                      >
                        {/* Enhanced Animated background patterns */}
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
                          className="absolute inset-0 opacity-8"
                          style={{
                            backgroundImage: 'linear-gradient(45deg, currentColor 1px, transparent 1px)',
                            backgroundSize: '16px 16px'
                          }}
                          animate={{
                            backgroundPosition: ['0px 0px', '16px 16px'],
                          }}
                          transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                          className="relative z-10"
                        >
                          <DynamicIcon 
                            name={item.imageUrl as IconName} 
                            className="text-primary/80 drop-shadow-lg" 
                            size={viewMode === 'list' ? 32 : 64} 
                          />
                        </motion.div>

                        {/* Featured Badge */}
                        {item.featured === "true" && (
                          <motion.div
                            className="absolute top-3 right-3"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                              <Star className="w-3 h-3 mr-1" />
                              مميز
                            </Badge>
                          </motion.div>
                        )}

                        {/* Enhanced Interactive Overlay with better mobile touch targets */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              whileHover={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.3, staggerChildren: 0.1 }}
                              className="flex gap-1.5 sm:gap-2 justify-center"
                            >
                              <motion.button
                                className="p-1.5 sm:p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 touch-manipulation"
                                onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                                whileHover={{ scale: 1.15, rotate: 12 }}
                                whileTap={{ scale: 0.85 }}
                                transition={{ type: "spring", stiffness: 400 }}
                                variants={{
                                  hover: { y: -2, shadow: "0 8px 25px rgba(0,0,0,0.15)" }
                                }}
                              >
                                <Heart 
                                  className={`w-3 h-3 sm:w-4 sm:h-4 ${likedItems.has(item.id) 
                                    ? 'text-red-500 fill-current' 
                                    : 'text-gray-700'
                                  }`}
                                />
                              </motion.button>
                              <motion.button
                                className="p-1.5 sm:p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 touch-manipulation"
                                whileHover={{ scale: 1.15, rotate: -12 }}
                                whileTap={{ scale: 0.85 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                              </motion.button>
                              <motion.button
                                className="p-1.5 sm:p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 touch-manipulation"
                                whileHover={{ scale: 1.15, x: 3 }}
                                whileTap={{ scale: 0.85 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                              </motion.button>
                            </motion.div>
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Enhanced Project Content with better mobile padding */}
                    <CardContent className={`
                      p-4 sm:p-6 ${viewMode === 'list' ? 'flex-1' : ''}
                    `}>
                      <div className="flex items-start justify-between mb-3">
                        <motion.h3 
                          className="text-lg sm:text-xl font-bold text-secondary group-hover:text-primary transition-colors duration-300 flex-1 pr-2"
                          whileHover={{ scale: 1.02, x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.title}
                        </motion.h3>
                        <motion.button
                          className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                          onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                          whileHover={{ scale: 1.2, rotate: 12 }}
                          whileTap={{ scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Heart 
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${likedItems.has(item.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-gray-400 hover:text-red-400'
                            }`}
                          />
                        </motion.button>
                      </div>
                      
                      <motion.p 
                        className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 line-clamp-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {item.description}
                      </motion.p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.technologies?.slice(0, viewMode === 'list' ? 2 : 3).map((tech, techIndex) => (
                          <motion.div
                            key={tech}
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ 
                              delay: techIndex * 0.1 + 0.5,
                              type: "spring",
                              stiffness: 200
                            }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Badge 
                                variant="secondary" 
                                className="text-xs bg-gray-100 text-gray-700 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md border border-gray-200 hover:border-primary/20"
                              >
                                {tech}
                              </Badge>
                            </motion.div>
                          </motion.div>
                        ))}
                        {item.technologies && item.technologies.length > (viewMode === 'list' ? 2 : 3) && (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            +{item.technologies.length - (viewMode === 'list' ? 2 : 3)}
                          </Badge>
                        )}
                      </div>

                      {/* Enhanced Action Area with better mobile layout */}
                      <motion.div 
                        className="flex items-center justify-between pt-3 border-t border-gray-100/70"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <div className="flex items-center text-xs sm:text-sm text-gray-500 gap-3 sm:gap-4">
                          <motion.span 
                            className="flex items-center gap-1"
                            whileHover={{ scale: 1.1, color: '#6366f1' }}
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            {Math.floor(Math.random() * 500) + 100}
                          </motion.span>
                          <motion.span 
                            className="flex items-center gap-1"
                            whileHover={{ scale: 1.1, color: '#ef4444' }}
                          >
                            <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                            {Math.floor(Math.random() * 50) + 10}
                          </motion.span>
                        </div>
                        
                        <motion.button
                          className="text-primary hover:text-primary/80 text-sm sm:text-base font-medium flex items-center gap-1 group/btn px-2 py-1 rounded-md hover:bg-primary/5 transition-colors"
                          whileHover={{ x: 3, scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="hidden sm:inline">عرض التفاصيل</span>
                          <span className="sm:hidden">عرض</span>
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:rotate-12 transition-transform" />
                        </motion.button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            )}
          </AnimatePresence>
        )}

        {!showFilter && (
          <motion.div 
            className="text-center mt-12 sm:mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <Link href="/portfolio">
              <motion.button
                className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/95 hover:to-primary/75 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 mx-auto relative overflow-hidden group"
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated background shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 w-full h-full"
                  initial={{ x: "-100%" }}
                  whileHover={{ 
                    x: "100%",
                    transition: { duration: 0.6, ease: "easeInOut" }
                  }}
                />
                <span className="relative z-10">استعرض جميع المشاريع</span>
                <motion.div
                  className="relative z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ rotate: 12 }}
                >
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
