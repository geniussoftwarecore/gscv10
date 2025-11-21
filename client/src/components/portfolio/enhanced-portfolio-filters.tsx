import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, ChevronDown, SortAsc, Grid, List, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { portfolioFilters } from "@/data/portfolio";

interface EnhancedPortfolioFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
  selectedTechnologies: string[];
  onTechnologiesChange: (technologies: string[]) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalResults: number;
  onClearAll: () => void;
  className?: string;
}

export default function EnhancedPortfolioFilters({
  searchQuery,
  onSearchChange,
  selectedIndustry,
  onIndustryChange,
  selectedServices,
  onServicesChange,
  selectedTechnologies,
  onTechnologiesChange,
  selectedYear,
  onYearChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults,
  onClearAll,
  className = ""
}: EnhancedPortfolioFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const hasActiveFilters = selectedIndustry !== '' || selectedServices.length > 0 || 
                          selectedTechnologies.length > 0 || selectedYear !== '' || 
                          searchQuery !== '';

  const activeFiltersCount = [
    selectedIndustry !== '',
    selectedServices.length > 0,
    selectedTechnologies.length > 0,
    selectedYear !== '',
    searchQuery !== ''
  ].filter(Boolean).length;

  const toggleService = (service: string) => {
    const newServices = selectedServices.includes(service)
      ? selectedServices.filter(s => s !== service)
      : [...selectedServices, service];
    onServicesChange(newServices);
  };

  const toggleTechnology = (tech: string) => {
    const newTech = selectedTechnologies.includes(tech)
      ? selectedTechnologies.filter(t => t !== tech)
      : [...selectedTechnologies, tech];
    onTechnologiesChange(newTech);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Search and Quick Actions Bar */}
      <Card className="border-brand-sky-base bg-brand-bg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Enhanced Search Input */}
            <div className="relative flex-1 max-w-md">
              <motion.div
                className={`relative transition-all duration-300 ${
                  isSearchFocused ? 'transform scale-105' : ''
                }`}
              >
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                  isSearchFocused ? 'text-brand-sky-accent' : 'text-brand-text-muted'
                }`} />
                <Input
                  placeholder="البحث في المشاريع..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`pl-10 pr-4 py-3 border-2 transition-all duration-300 bg-brand-bg ${
                    isSearchFocused 
                      ? 'border-brand-sky-accent shadow-lg' 
                      : 'border-brand-sky-base hover:border-brand-sky-accent/50'
                  }`}
                />
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-text-muted hover:text-brand-sky-accent transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </motion.div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Advanced Filters Toggle */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className={`border-2 transition-all duration-300 ${
                    hasActiveFilters 
                      ? 'border-brand-sky-accent bg-brand-sky-light text-brand-text-primary' 
                      : 'border-brand-sky-base hover:border-brand-sky-accent hover:bg-brand-sky-light'
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  فلتر متقدم
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-brand-sky-accent text-white">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </motion.div>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="border-brand-sky-base hover:border-brand-sky-accent hover:bg-brand-sky-light">
                      <SortAsc className="w-4 h-4 mr-2" />
                      ترتيب
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-brand-bg border-brand-sky-base">
                  <DropdownMenuLabel className="text-brand-text-primary">ترتيب حسب</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-brand-sky-base" />
                  {portfolioFilters.sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => onSortChange(option.value)}
                      className={`cursor-pointer transition-colors ${
                        sortBy === option.value 
                          ? 'bg-brand-sky-light text-brand-text-primary' 
                          : 'hover:bg-brand-sky-light/50'
                      }`}
                    >
                      {option.labelAr}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-brand-sky-light rounded-lg p-1 border border-brand-sky-base">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onViewModeChange('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-brand-sky-accent text-white shadow-md' 
                      : 'text-brand-text-muted hover:bg-brand-sky-base'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onViewModeChange('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-brand-sky-accent text-white shadow-md' 
                      : 'text-brand-text-muted hover:bg-brand-sky-base'
                  }`}
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Clear All Filters */}
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    onClick={onClearAll}
                    className="text-brand-text-muted hover:text-brand-sky-accent hover:bg-brand-sky-light/50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    مسح الكل
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-sky-base">
            <div className="flex items-center gap-2 text-brand-text-muted">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">
                {totalResults} مشروع متاح
                {hasActiveFilters && ' (مفلتر)'}
              </span>
            </div>
            
            {/* Active Filter Summary */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                {searchQuery && (
                  <Badge variant="secondary" className="bg-brand-sky-light text-brand-text-primary border-brand-sky-base">
                    بحث: {searchQuery}
                  </Badge>
                )}
                {selectedIndustry && (
                  <Badge variant="secondary" className="bg-brand-sky-light text-brand-text-primary border-brand-sky-base">
                    صناعة: {portfolioFilters.industries.find(i => i.value === selectedIndustry)?.labelAr}
                  </Badge>
                )}
                {selectedYear && (
                  <Badge variant="secondary" className="bg-brand-sky-light text-brand-text-primary border-brand-sky-base">
                    سنة: {selectedYear}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Card className="border-brand-sky-base bg-brand-bg shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Industry Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-brand-text-primary">الصناعة</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between border-brand-sky-base hover:border-brand-sky-accent">
                          {selectedIndustry 
                            ? portfolioFilters.industries.find(i => i.value === selectedIndustry)?.labelAr 
                            : 'اختر الصناعة'
                          }
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full bg-brand-bg border-brand-sky-base">
                        {portfolioFilters.industries.map((industry) => (
                          <DropdownMenuItem
                            key={industry.value}
                            onClick={() => onIndustryChange(industry.value)}
                            className="cursor-pointer hover:bg-brand-sky-light"
                          >
                            {industry.labelAr}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Services Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-brand-text-primary">الخدمات</label>
                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                      {portfolioFilters.services.map((service) => (
                        <motion.div
                          key={service.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge
                            variant={selectedServices.includes(service.value) ? "default" : "outline"}
                            className={`cursor-pointer transition-all duration-200 ${
                              selectedServices.includes(service.value)
                                ? 'bg-brand-sky-accent text-white border-brand-sky-accent'
                                : 'border-brand-sky-base hover:border-brand-sky-accent hover:bg-brand-sky-light'
                            }`}
                            onClick={() => toggleService(service.value)}
                          >
                            {service.labelAr}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-brand-text-primary">التقنيات</label>
                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                      {portfolioFilters.technologies.slice(0, 8).map((tech) => (
                        <motion.div
                          key={tech}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge
                            variant={selectedTechnologies.includes(tech) ? "default" : "outline"}
                            className={`cursor-pointer transition-all duration-200 ${
                              selectedTechnologies.includes(tech)
                                ? 'bg-brand-sky-accent text-white border-brand-sky-accent'
                                : 'border-brand-sky-base hover:border-brand-sky-accent hover:bg-brand-sky-light'
                            }`}
                            onClick={() => toggleTechnology(tech)}
                          >
                            {tech}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Year Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-brand-text-primary">السنة</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between border-brand-sky-base hover:border-brand-sky-accent">
                          {selectedYear || 'اختر السنة'}
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full bg-brand-bg border-brand-sky-base">
                        <DropdownMenuItem
                          onClick={() => onYearChange('')}
                          className="cursor-pointer hover:bg-brand-sky-light"
                        >
                          جميع السنوات
                        </DropdownMenuItem>
                        {portfolioFilters.years.map((year) => (
                          <DropdownMenuItem
                            key={year}
                            onClick={() => onYearChange(year.toString())}
                            className="cursor-pointer hover:bg-brand-sky-light"
                          >
                            {year}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}