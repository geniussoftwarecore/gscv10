import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  SortAsc, 
  X, 
  Calendar,
  Building,
  Code,
  Tag
} from "lucide-react";
import { useDebounce } from 'use-debounce';

export interface FilterState {
  search: string;
  industry: string[];
  services: string[];
  technologies: string[];
  year: string[];
  sortBy: string;
}

interface FiltersBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableIndustries: string[];
  availableServices: string[];
  availableTechnologies: string[];
  availableYears: string[];
  totalResults: number;
}

export default function FiltersBar({
  filters,
  onFiltersChange,
  availableIndustries,
  availableServices,
  availableTechnologies,
  availableYears,
  totalResults
}: FiltersBarProps) {
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [debouncedSearch] = useDebounce(localSearch, 500);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch]);

  const handleFilterChange = (type: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [type]: value });
  };

  const addFilter = (type: 'industry' | 'services' | 'technologies' | 'year', value: string) => {
    const currentValues = filters[type] as string[];
    if (!currentValues.includes(value)) {
      handleFilterChange(type, [...currentValues, value]);
    }
  };

  const removeFilter = (type: 'industry' | 'services' | 'technologies' | 'year', value: string) => {
    const currentValues = filters[type] as string[];
    handleFilterChange(type, currentValues.filter(v => v !== value));
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      industry: [],
      services: [],
      technologies: [],
      year: [],
      sortBy: 'latest'
    });
    setLocalSearch('');
  };

  const hasActiveFilters = filters.search || 
    filters.industry.length > 0 || 
    filters.services.length > 0 || 
    filters.technologies.length > 0 || 
    filters.year.length > 0;

  const sortOptions = [
    { value: 'latest', label: 'الأحدث أولاً' },
    { value: 'oldest', label: 'الأقدم أولاً' },
    { value: 'most-viewed', label: 'الأكثر مشاهدة' },
    { value: 'most-liked', label: 'الأكثر إعجاباً' },
    { value: 'industry', label: 'حسب القطاع' },
    { value: 'alphabetical', label: 'أبجدياً' }
  ];

  return (
    <div className="space-y-6">
      {/* Main Search and Sort Bar */}
      <Card className="p-6 border-0 shadow-lg bg-white/95 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full lg:w-auto">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="ابحث في المشاريع..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pr-10 pl-4 py-3 border-gray-200 focus:border-primary focus:ring-primary text-right"
              dir="rtl"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="w-full lg:w-auto lg:min-w-[200px]">
            <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
              <SelectTrigger className="border-gray-200 focus:border-primary focus:ring-primary">
                <div className="flex items-center gap-2">
                  <SortAsc className="w-4 h-4" />
                  <SelectValue placeholder="ترتيب حسب..." />
                </div>
              </SelectTrigger>
              <SelectContent align="end">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filters Toggle */}
          <Button
            variant={isExpanded ? "default" : "outline"}
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 transition-all duration-300"
          >
            <Filter className="w-4 h-4" />
            تصفية متقدمة
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 px-2 py-1 text-xs">
                {filters.industry.length + filters.services.length + filters.technologies.length + filters.year.length}
              </Badge>
            )}
          </Button>

          {/* Results Count */}
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {totalResults} نتيجة
          </div>
        </div>
      </Card>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="p-6 border-0 shadow-lg bg-white/95 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Industry Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Building className="w-4 h-4" />
                    القطاع
                  </label>
                  <div className="space-y-2">
                    {availableIndustries.map((industry) => (
                      <Button
                        key={industry}
                        variant={filters.industry.includes(industry) ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          if (filters.industry.includes(industry)) {
                            removeFilter('industry', industry);
                          } else {
                            addFilter('industry', industry);
                          }
                        }}
                        className="w-full justify-start text-right h-8"
                      >
                        {industry}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Services Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Code className="w-4 h-4" />
                    الخدمات
                  </label>
                  <div className="space-y-2">
                    {availableServices.map((service) => (
                      <Button
                        key={service}
                        variant={filters.services.includes(service) ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          if (filters.services.includes(service)) {
                            removeFilter('services', service);
                          } else {
                            addFilter('services', service);
                          }
                        }}
                        className="w-full justify-start text-right h-8"
                      >
                        {service}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Technologies Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Tag className="w-4 h-4" />
                    التقنيات
                  </label>
                  <div className="space-y-2">
                    {availableTechnologies.map((tech) => (
                      <Button
                        key={tech}
                        variant={filters.technologies.includes(tech) ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          if (filters.technologies.includes(tech)) {
                            removeFilter('technologies', tech);
                          } else {
                            addFilter('technologies', tech);
                          }
                        }}
                        className="w-full justify-start text-right h-8"
                      >
                        {tech}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Calendar className="w-4 h-4" />
                    السنة
                  </label>
                  <div className="space-y-2">
                    {availableYears.map((year) => (
                      <Button
                        key={year}
                        variant={filters.year.includes(year) ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          if (filters.year.includes(year)) {
                            removeFilter('year', year);
                          } else {
                            addFilter('year', year);
                          }
                        }}
                        className="w-full justify-start text-right h-8"
                      >
                        {year}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear All Filters */}
              {hasActiveFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-4 h-4" />
                    مسح جميع المرشحات
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              البحث: "{filters.search}"
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => {
                  setLocalSearch('');
                  handleFilterChange('search', '');
                }} 
              />
            </Badge>
          )}
          
          {filters.industry.map((item) => (
            <Badge key={item} variant="secondary" className="flex items-center gap-1">
              {item}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('industry', item)} 
              />
            </Badge>
          ))}
          
          {filters.services.map((item) => (
            <Badge key={item} variant="secondary" className="flex items-center gap-1">
              {item}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('services', item)} 
              />
            </Badge>
          ))}
          
          {filters.technologies.map((item) => (
            <Badge key={item} variant="secondary" className="flex items-center gap-1">
              {item}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('technologies', item)} 
              />
            </Badge>
          ))}
          
          {filters.year.map((item) => (
            <Badge key={item} variant="secondary" className="flex items-center gap-1">
              {item}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('year', item)} 
              />
            </Badge>
          ))}
        </motion.div>
      )}
    </div>
  );
}