import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Testimonial } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { AnimatedText } from '@/components/ui/animated-card';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight, Play, Pause, User, Award, Heart } from 'lucide-react';

export default function Testimonials() {
  const {
    data: testimonials,
    isLoading,
    error,
  } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [likedTestimonials, setLikedTestimonials] = useState<Set<string>>(new Set());

  // Auto-play carousel functionality
  useEffect(() => {
    if (!isAutoPlay || !testimonials || testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoPlay, testimonials]);

  const toggleLike = (testimonialId: string) => {
    setLikedTestimonials(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testimonialId)) {
        newSet.delete(testimonialId);
      } else {
        newSet.add(testimonialId);
      }
      return newSet;
    });
  };

  const nextTestimonial = () => {
    if (testimonials && testimonials.length > 0) {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }
  };

  const prevTestimonial = () => {
    if (testimonials && testimonials.length > 0) {
      setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  if (error) {
    return (
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              خطأ في تحميل الآراء
            </h2>
            <p className="text-slate-600">
              حدث خطأ أثناء تحميل آراء العملاء. يرجى المحاولة مرة أخرى.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={ref}
      className="py-16 lg:py-24 bg-white relative overflow-hidden" 
      style={{ position: 'relative' }}
    >
      {/* Background decorations with White + Sky Blue theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-sky-100/30 to-sky-200/20 rounded-full blur-3xl"
          animate={{ 
            rotate: 360,
            scale: [1, 1.3, 1],
            x: [0, 25, 0],
            y: [0, -25, 0]
          }}
          transition={{ 
            rotate: { duration: 35, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 15, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 12, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        <motion.div 
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tl from-sky-200/25 to-sky-100/15 rounded-full blur-3xl"
          animate={{ 
            rotate: -360,
            scale: [1, 0.8, 1.2, 1],
            x: [0, -20, 0],
            y: [0, 20, 0]
          }}
          transition={{ 
            rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 18, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 14, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Floating quote icons */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10 text-sky-400"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
            }}
            animate={{
              y: [0, -30 - Math.random() * 20, 0],
              x: [0, (Math.random() - 0.5) * 25, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8
            }}
          >
            <Quote size={24 + Math.random() * 16} />
          </motion.div>
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
            className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-sky-600 via-slate-800 to-sky-600 bg-clip-text text-transparent mb-6 relative"
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
              className="bg-gradient-to-r from-sky-600 via-slate-800 to-sky-600 bg-clip-text text-transparent"
            >
              آراء عملائنا
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 15 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            شهادات حقيقية من عملاء راضين عن خدماتنا وحلولنا التقنية المتطورة
          </motion.p>
        </motion.div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : testimonials && testimonials.length > 0 ? (
          <>
            {/* Enhanced Carousel Section */}
            <div className="relative mb-16">
              <div className="flex items-center justify-between mb-8">
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Button
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                    variant="outline"
                    size="sm"
                    className="border-sky-300 text-sky-600 hover:bg-sky-50"
                  >
                    {isAutoPlay ? <Pause size={16} /> : <Play size={16} />}
                    <span className="mr-2">{isAutoPlay ? 'إيقاف' : 'تشغيل'}</span>
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {testimonials.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex ? 'bg-sky-500 w-6' : 'bg-sky-200'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Button
                    onClick={prevTestimonial}
                    variant="outline"
                    size="sm"
                    className="border-sky-300 text-sky-600 hover:bg-sky-50"
                  >
                    <ChevronRight size={16} />
                  </Button>
                  <Button
                    onClick={nextTestimonial}
                    variant="outline"
                    size="sm"
                    className="border-sky-300 text-sky-600 hover:bg-sky-50"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                </motion.div>
              </div>

              {/* Featured Testimonial Carousel */}
              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 300, rotateY: 90 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: -300, rotateY: -90 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="w-full"
                  >
                    <EnhancedTestimonialCard
                      testimonial={testimonials[currentIndex]}
                      isLiked={likedTestimonials.has(testimonials[currentIndex].id)}
                      onToggleLike={() => toggleLike(testimonials[currentIndex].id)}
                      featured={true}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>


          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}

// Enhanced Testimonial Card Component
interface EnhancedTestimonialCardProps {
  testimonial: Testimonial;
  isLiked: boolean;
  onToggleLike: () => void;
  featured: boolean;
}

function EnhancedTestimonialCard({ 
  testimonial, 
  isLiked, 
  onToggleLike, 
  featured 
}: EnhancedTestimonialCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`group relative ${featured ? 'max-w-4xl mx-auto' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: featured ? 1.02 : 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`
        overflow-hidden border-0 bg-white/95 backdrop-blur-sm shadow-lg 
        hover:shadow-2xl transition-all duration-500 relative
        ${featured ? 'p-8 md:p-12' : 'p-6'}
        before:absolute before:inset-0 before:bg-gradient-to-br 
        before:from-sky-50/50 before:to-white before:opacity-0 
        hover:before:opacity-100 before:transition-opacity before:duration-500
      `}>
        
        {/* Quote decoration */}
        <motion.div
          className="absolute -top-4 -right-4 text-sky-200 opacity-30"
          animate={isHovered ? { 
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1] 
          } : {}}
          transition={{ duration: 0.8 }}
        >
          <Quote size={featured ? 80 : 60} />
        </motion.div>

        {/* Like button */}
        <motion.button
          onClick={onToggleLike}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full 
                     flex items-center justify-center shadow-md hover:shadow-lg transition-all 
                     duration-300 z-20 border border-sky-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart 
            className={`w-5 h-5 transition-colors duration-300 ${
              isLiked ? 'text-red-500 fill-current' : 'text-slate-400 hover:text-red-400'
            }`} 
          />
        </motion.button>

        <CardContent className="p-0 relative z-10">
          {/* Rating stars */}
          <div className="flex gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ 
                  scale: 1.3, 
                  rotate: 360,
                  transition: { duration: 0.3 }
                }}
              >
                <Star 
                  size={featured ? 24 : 20} 
                  className="text-yellow-400 fill-current"
                />
              </motion.div>
            ))}
          </div>

          {/* Testimonial content */}
          <motion.blockquote 
            className={`text-slate-700 mb-8 leading-relaxed italic relative
              ${featured ? 'text-xl md:text-2xl' : 'text-base'}
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="text-sky-500 text-2xl md:text-3xl font-bold">"</span>
            {testimonial.content}
            <span className="text-sky-500 text-2xl md:text-3xl font-bold">"</span>
          </motion.blockquote>

          {/* Client info */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.div
              className={`
                bg-gradient-to-br from-sky-400 to-sky-600 text-white rounded-full 
                flex items-center justify-center font-bold
                ${featured ? 'w-16 h-16 text-xl' : 'w-12 h-12'}
              `}
              whileHover={{ 
                scale: 1.1,
                rotate: 360,
                transition: { duration: 0.6 }
              }}
            >
              {testimonial.name?.charAt(0) || 'ع'}
            </motion.div>
            
            <div className="flex-1">
              <motion.h4 
                className={`font-bold text-slate-900 mb-1 
                  ${featured ? 'text-xl' : 'text-lg'}
                `}
                whileHover={{ color: '#0369a1' }}
                transition={{ duration: 0.2 }}
              >
                {testimonial.name || "عميل مجهول"}
              </motion.h4>
              
              <p className={`text-slate-600 flex items-center gap-2
                ${featured ? 'text-base' : 'text-sm'}
              `}>
                <Award size={16} className="text-sky-500" />
                {testimonial.position || "عميل"}
                {testimonial.company && (
                  <>
                    <span className="text-sky-400">•</span>
                    <span className="text-sky-600 font-medium">
                      {testimonial.company}
                    </span>
                  </>
                )}
              </p>
            </div>
          </motion.div>

          {/* Company badge (if available) */}
          {testimonial.company && (
            <motion.div
              className="absolute bottom-4 right-4 px-3 py-1 bg-sky-100 text-sky-700 
                         rounded-full text-xs font-semibold opacity-80"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
            >
              تأكيد موثق
            </motion.div>
          )}
        </CardContent>

        {/* Hover effect border */}
        <motion.div
          className="absolute inset-0 border-2 border-sky-300 rounded-lg opacity-0 
                     group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      </Card>
    </motion.div>
  );
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 md:p-12">
          <CardContent className="p-0">
            <motion.div
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="space-y-6"
            >
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-6 h-6 rounded" />
                ))}
              </div>
              <Skeleton className="h-24 w-full rounded" />
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32 rounded" />
                  <Skeleton className="h-4 w-48 rounded" />
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
      

    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <motion.div
      className="text-center py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Quote size={48} className="text-sky-400" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        لا توجد آراء متاحة حالياً
      </h3>
      
      <p className="text-slate-600">
        سنعرض آراء عملائنا هنا قريباً
      </p>
    </motion.div>
  );
}
