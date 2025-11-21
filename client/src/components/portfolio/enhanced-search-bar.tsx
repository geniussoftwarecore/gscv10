import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface SearchFilters {
  technologies: string[];
  categories: string[];
  sortBy: 'newest' | 'oldest' | 'popular' | 'alphabetical';
}

interface EnhancedSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  availableTechnologies: string[];
  availableCategories: { id: string; label: string }[];
  recentSearches: string[];
  popularSearches: string[];
  totalResults: number;
}

export function EnhancedSearchBar({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  availableTechnologies,
  availableCategories,
  recentSearches,
  popularSearches,
  totalResults
}: EnhancedSearchBarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleTechnologyToggle = (tech: string) => {
    const newTechnologies = filters.technologies.includes(tech)
      ? filters.technologies.filter(t => t !== tech)
      : [...filters.technologies, tech];
    
    onFiltersChange({ ...filters, technologies: newTechnologies });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(c => c !== categoryId)
      : [...filters.categories, categoryId];
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      technologies: [],
      categories: [],
      sortBy: 'newest'
    });
    onSearchChange('');
  };

  const hasActiveFilters = 
    searchQuery.length > 0 || 
    filters.technologies.length > 0 || 
    filters.categories.length > 0 ||
    filters.sortBy !== 'newest';

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Main Search Bar */}
      <div className="relative">
        <motion.div
          animate={{
            scale: isSearchFocused ? 1.02 : 1,
            boxShadow: isSearchFocused 
              ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-xl border-2 border-gray-200 focus-within:border-primary"
        >
          <div className="flex items-center">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="ابحث في المشاريع... (العنوان، الوصف، التقنيات)"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => {
                setIsSearchFocused(true);
                setShowSuggestions(true);
              }}
              onBlur={() => {
                setIsSearchFocused(false);
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              className="pr-12 pl-4 py-4 text-lg border-0 focus:ring-0 rounded-xl"
              data-testid="portfolio-search"
            />
            
            {/* Filters Button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`ml-2 ${hasActiveFilters ? 'text-primary bg-primary/10' : 'text-gray-500'}`}
                  data-testid="filters-button"
                >
                  <Filter size={18} />
                  {hasActiveFilters && (
                    <Badge variant="destructive" className="mr-1 text-xs">
                      {filters.technologies.length + filters.categories.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">التصفية المتقدمة</h4>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} className="ml-1" />
                        مسح الكل
                      </Button>
                    )}
                  </div>

                  {/* Categories Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">الفئات</label>
                    <div className="space-y-2">
                      {availableCategories.map(category => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={filters.categories.includes(category.id)}
                            onCheckedChange={() => handleCategoryToggle(category.id)}
                          />
                          <label htmlFor={`category-${category.id}`} className="text-sm">
                            {category.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">التقنيات</label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {availableTechnologies.slice(0, 12).map(tech => (
                        <Button
                          key={tech}
                          variant={filters.technologies.includes(tech) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTechnologyToggle(tech)}
                          className="text-xs"
                        >
                          {tech}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">الترتيب</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'newest', label: 'الأحدث', icon: Clock },
                        { key: 'oldest', label: 'الأقدم', icon: Clock },
                        { key: 'popular', label: 'الأكثر شعبية', icon: TrendingUp },
                        { key: 'alphabetical', label: 'أبجدي', icon: Filter }
                      ].map(option => (
                        <Button
                          key={option.key}
                          variant={filters.sortBy === option.key ? "default" : "outline"}
                          size="sm"
                          onClick={() => onFiltersChange({ ...filters, sortBy: option.key as any })}
                          className="text-xs justify-start"
                        >
                          <option.icon size={14} className="ml-1" />
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </motion.div>

        {/* Search Suggestions */}
        <AnimatePresence>
          {showSuggestions && (recentSearches.length > 0 || popularSearches.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            >
              <div className="p-4">
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">عمليات البحث الأخيرة</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.slice(0, 3).map((search, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onSearchChange(search);
                            setShowSuggestions(false);
                          }}
                          className="text-xs text-gray-600 hover:text-primary"
                        >
                          {search}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {popularSearches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={16} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">عمليات البحث الشائعة</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.slice(0, 4).map((search, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onSearchChange(search);
                            setShowSuggestions(false);
                          }}
                          className="text-xs text-gray-600 hover:text-primary"
                        >
                          {search}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filters & Results Count */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 flex flex-wrap items-center gap-2"
        >
          <span className="text-sm text-gray-600">
            {totalResults} نتيجة
          </span>
          
          {/* Search Query Badge */}
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              البحث: "{searchQuery}"
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSearchChange('')}
                className="h-auto p-0 hover:bg-transparent"
              >
                <X size={12} />
              </Button>
            </Badge>
          )}

          {/* Category Badges */}
          {filters.categories.map(categoryId => {
            const category = availableCategories.find(c => c.id === categoryId);
            return category ? (
              <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                {category.label}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCategoryToggle(categoryId)}
                  className="h-auto p-0 hover:bg-transparent"
                >
                  <X size={12} />
                </Button>
              </Badge>
            ) : null;
          })}

          {/* Technology Badges */}
          {filters.technologies.map(tech => (
            <Badge key={tech} variant="secondary" className="flex items-center gap-1">
              {tech}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTechnologyToggle(tech)}
                className="h-auto p-0 hover:bg-transparent"
              >
                <X size={12} />
              </Button>
            </Badge>
          ))}
        </motion.div>
      )}
    </div>
  );
}