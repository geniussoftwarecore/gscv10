import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Search, Filter, TrendingUp } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import EnhancedPortfolioFilters from "./enhanced-portfolio-filters";
import EnhancedProjectCard from "./enhanced-project-card";
import { portfolioProjects, portfolioFilters, type PortfolioProject } from "@/data/portfolio";

interface EnhancedPortfolioGridProps {
  showFilters?: boolean;
  showViewToggle?: boolean;
  showLoadMore?: boolean;
  limit?: number;
  className?: string;
}

export default function EnhancedPortfolioGrid({
  showFilters = true,
  showViewToggle = true,
  showLoadMore = true,
  limit,
  className = ""
}: EnhancedPortfolioGridProps) {
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // UI states
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [displayCount, setDisplayCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useIntersectionObserver(sectionRef, { once: true, margin: "-100px" });

  // Simulate API data with our enhanced portfolio data
  const portfolioItems = portfolioProjects;

  // Enhanced filtering logic
  const filteredAndSortedItems = useMemo(() => {
    let filtered = portfolioItems.filter((item) => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          item.titleAr.toLowerCase().includes(searchLower) ||
          item.clientAr.toLowerCase().includes(searchLower) ||
          item.summaryAr.toLowerCase().includes(searchLower) ||
          item.sectorAr.toLowerCase().includes(searchLower) ||
          item.tech.some(tech => tech.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Industry filter
      if (selectedIndustry && item.sector !== selectedIndustry) {
        return false;
      }

      // Services filter
      if (selectedServices.length > 0) {
        const hasMatchingService = selectedServices.some(service =>
          item.services.includes(service)
        );
        if (!hasMatchingService) return false;
      }

      // Technologies filter
      if (selectedTechnologies.length > 0) {
        const hasMatchingTech = selectedTechnologies.some(tech =>
          item.tech.includes(tech)
        );
        if (!hasMatchingTech) return false;
      }

      // Year filter
      if (selectedYear && item.year.toString() !== selectedYear) {
        return false;
      }

      return true;
    });

    // Sorting logic
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.year - a.year);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.year - b.year);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.titleAr.localeCompare(b.titleAr, 'ar'));
        break;
      case 'industry':
        filtered.sort((a, b) => a.sectorAr.localeCompare(b.sectorAr, 'ar'));
        break;
      default:
        break;
    }

    return filtered;
  }, [portfolioItems, searchQuery, selectedIndustry, selectedServices, selectedTechnologies, selectedYear, sortBy]);

  const displayItems = limit ? filteredAndSortedItems.slice(0, limit) : filteredAndSortedItems.slice(0, displayCount);
  const hasMoreItems = !limit && displayCount < filteredAndSortedItems.length;

  const toggleLike = (itemSlug: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemSlug)) {
        newSet.delete(itemSlug);
      } else {
        newSet.add(itemSlug);
      }
      return newSet;
    });
  };

  const handleLoadMore = async () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setDisplayCount(prev => prev + 6);
      setIsLoading(false);
    }, 800);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedIndustry("");
    setSelectedServices([]);
    setSelectedTechnologies([]);
    setSelectedYear("");
    setSortBy("newest");
  };

  const hasActiveFilters = searchQuery !== "" || selectedIndustry !== "" || 
                          selectedServices.length > 0 || selectedTechnologies.length > 0 || 
                          selectedYear !== "";

  // Loading state
  if (!portfolioItems) {
    return (
      <section className="py-16 lg:py-24 bg-brand-bg" ref={sectionRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-brand-sky-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-brand-text-primary mb-4">
              جاري تحميل المشاريع...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (!portfolioItems.length) {
    return (
      <section className="py-16 lg:py-24 bg-brand-bg" ref={sectionRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">
              <AlertCircle className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text-primary mb-4">
              خطأ في تحميل المشاريع
            </h2>
            <p className="text-brand-text-muted">
              حدث خطأ أثناء تحميل المشاريع. يرجى المحاولة مرة أخرى.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="projects-grid" 
      className={`py-16 lg:py-24 bg-brand-bg ${className}`} 
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Filters */}
        {showFilters && (
          <EnhancedPortfolioFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedIndustry={selectedIndustry}
            onIndustryChange={setSelectedIndustry}
            selectedServices={selectedServices}
            onServicesChange={setSelectedServices}
            selectedTechnologies={selectedTechnologies}
            onTechnologiesChange={setSelectedTechnologies}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalResults={filteredAndSortedItems.length}
            onClearAll={clearAllFilters}
            className="mb-12"
          />
        )}

        {/* Results Summary Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-brand-text-primary">
              {hasActiveFilters ? 'نتائج البحث' : 'جميع المشاريع'}
            </h2>
            <Badge variant="outline" className="border-brand-sky-base text-brand-sky-accent bg-brand-sky-light">
              {filteredAndSortedItems.length} مشروع
            </Badge>
          </div>

          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-sm text-brand-text-muted"
            >
              <Filter className="w-4 h-4" />
              <span>تم التصفية</span>
            </motion.div>
          )}
        </motion.div>

        {/* Projects Grid/List */}
        {filteredAndSortedItems.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <Card className="border-2 border-brand-sky-base bg-brand-sky-light/30 p-12 max-w-md mx-auto">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-brand-sky-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-brand-sky-accent" />
                </div>
                <h3 className="text-xl font-bold text-brand-text-primary">
                  لا توجد مشاريع مطابقة
                </h3>
                <p className="text-brand-text-muted">
                  لم يتم العثور على مشاريع تطابق معايير البحث. جرب تعديل الفلاتر.
                </p>
                {hasActiveFilters && (
                  <Button 
                    onClick={clearAllFilters}
                    variant="outline"
                    className="mt-4 border-brand-sky-accent text-brand-sky-accent hover:bg-brand-sky-accent hover:text-white"
                  >
                    مسح جميع الفلاتر
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* Projects Display */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
                  : 'space-y-6'
              }`}
            >
              <AnimatePresence mode="wait">
                {displayItems.map((item, index) => (
                  <EnhancedProjectCard
                    key={item.slug}
                    project={item}
                    onLike={toggleLike}
                    isLiked={likedItems.has(item.slug)}
                    viewMode={viewMode}
                    showKpis={true}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Load More Button */}
            {showLoadMore && hasMoreItems && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mt-12"
              >
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  size="lg"
                  variant="outline"
                  className="border-2 border-brand-sky-accent text-brand-sky-accent hover:bg-brand-sky-accent hover:text-white min-w-48"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      جاري التحميل...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      عرض المزيد ({filteredAndSortedItems.length - displayCount} متبقي)
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}