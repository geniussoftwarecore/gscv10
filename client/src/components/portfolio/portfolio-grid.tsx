import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "use-debounce";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioItem } from "@shared/schema";
import ProjectCard from "./project-card";
import FiltersBar, { FilterState } from "./filters-bar";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";

interface PortfolioGridProps {
  showFilters?: boolean;
  showViewToggle?: boolean;
  limit?: number;
  showLoadMore?: boolean;
}

export default function PortfolioGrid({ 
  showFilters = true, 
  showViewToggle = true,
  limit,
  showLoadMore = true
}: PortfolioGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    industry: [],
    services: [],
    technologies: [],
    year: [],
    sortBy: 'latest'
  });

  const sectionRef = useRef<HTMLElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  const { ref: loadMoreIntersectionRef, inView: isLoadMoreInView } = useInView({
    threshold: 0.1,
  });

  const {
    data: portfolioItems,
    isLoading,
    error,
  } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  // Filter and sort logic
  const filteredAndSortedItems = useMemo(() => {
    if (!portfolioItems) return [];
    
    let filtered = portfolioItems.filter(item => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchMatches = 
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
          item.technologies?.some(tech => tech.toLowerCase().includes(searchLower));
        if (!searchMatches) return false;
      }

      // Industry filter
      if (filters.industry.length > 0 && !filters.industry.includes(item.industry)) {
        return false;
      }

      // Services filter
      if (filters.services.length > 0) {
        const hasMatchingService = item.services?.some(service => 
          filters.services.includes(service)
        );
        if (!hasMatchingService) return false;
      }

      // Technologies filter
      if (filters.technologies.length > 0) {
        const hasMatchingTech = item.technologies?.some(tech => 
          filters.technologies.includes(tech)
        );
        if (!hasMatchingTech) return false;
      }

      // Year filter
      if (filters.year.length > 0 && !filters.year.includes(item.year)) {
        return false;
      }

      return true;
    });

    // Sort logic
    switch (filters.sortBy) {
      case 'latest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'oldest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });
        break;
      case 'most-viewed':
        filtered.sort((a, b) => {
          const viewsA = a.views ? parseInt(a.views) : 0;
          const viewsB = b.views ? parseInt(b.views) : 0;
          return viewsB - viewsA;
        });
        break;
      case 'most-liked':
        filtered.sort((a, b) => {
          const likesA = a.likes ? parseInt(a.likes) : 0;
          const likesB = b.likes ? parseInt(b.likes) : 0;
          return likesB - likesA;
        });
        break;
      case 'industry':
        filtered.sort((a, b) => a.industry.localeCompare(b.industry, 'ar'));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
        break;
      default:
        break;
    }

    return filtered;
  }, [portfolioItems, filters]);

  // Pagination logic
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const paginatedItems = limit 
    ? filteredAndSortedItems.slice(0, limit)
    : filteredAndSortedItems.slice(0, currentPage * itemsPerPage);

  // Load more when intersection is detected
  useState(() => {
    if (isLoadMoreInView && showLoadMore && currentPage < totalPages && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  });

  // Extract filter options from data
  const filterOptions = useMemo(() => {
    if (!portfolioItems) return {
      industries: [],
      services: [],
      technologies: [],
      years: []
    };

    const industriesSet = new Set(portfolioItems.map(item => item.industry));
    const servicesSet = new Set(portfolioItems.flatMap(item => item.services || []));
    const technologiesSet = new Set(portfolioItems.flatMap(item => item.technologies || []));
    const yearsSet = new Set(portfolioItems.map(item => item.year));
    
    const industries = Array.from(industriesSet);
    const services = Array.from(servicesSet);
    const technologies = Array.from(technologiesSet);
    const years = Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a));

    return { industries, services, technologies, years };
  }, [portfolioItems]);

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

  if (error) {
    return (
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
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

  return (
    <section 
      ref={sectionRef}
      className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <FiltersBar
              filters={filters}
              onFiltersChange={setFilters}
              availableIndustries={filterOptions.industries}
              availableServices={filterOptions.services}
              availableTechnologies={filterOptions.technologies}
              availableYears={filterOptions.years}
              totalResults={filteredAndSortedItems.length}
            />
          </motion.div>
        )}

        {/* View Mode Toggle */}
        {showViewToggle && (
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 10 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                عرض {filteredAndSortedItems.length} من {portfolioItems?.length || 0} مشروع
              </span>
            </div>
            
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3 py-2"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3 py-2"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div 
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-6"
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {[...Array(limit || 12)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={viewMode === 'list' ? "flex gap-4" : ""}
              >
                <Card className="overflow-hidden border-0 shadow-lg">
                  <Skeleton className={
                    viewMode === 'list' 
                      ? "h-32 w-48 flex-shrink-0" 
                      : "aspect-[4/3] w-full"
                  } />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-14" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Portfolio Grid */}
        {!isLoading && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewMode}-${filters.search}-${filters.industry.join(',')}`}
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-6"
              }
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {paginatedItems.map((item) => (
                <ProjectCard
                  key={item.id}
                  project={item}
                  onLike={toggleLike}
                  isLiked={likedItems.has(item.id)}
                  viewMode={viewMode}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* No Results */}
        {!isLoading && filteredAndSortedItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              لم نجد أي مشاريع مطابقة
            </h3>
            <p className="text-gray-600 mb-6">
              جرب تعديل معايير البحث أو إزالة بعض المرشحات
            </p>
            <Button
              variant="outline"
              onClick={() => setFilters({
                search: '',
                industry: [],
                services: [],
                technologies: [],
                year: [],
                sortBy: 'latest'
              })}
            >
              إزالة جميع المرشحات
            </Button>
          </motion.div>
        )}

        {/* Load More / Pagination */}
        {!isLoading && showLoadMore && currentPage < totalPages && (
          <div ref={loadMoreIntersectionRef} className="flex justify-center mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
              >
                عرض المزيد من المشاريع
                <ChevronLeft className="w-4 h-4 mr-2" />
              </Button>
            </motion.div>
          </div>
        )}

        {/* Pagination for non-infinite scroll */}
        {!showLoadMore && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center gap-2 mt-12"
          >
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </Button>
            
            <div className="flex gap-1">
              {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-10 h-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}