
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, ChevronDown, SortAsc, Grid, List, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface FiltersBarProps {
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
}

export default function FiltersBar({
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
}: FiltersBarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const industries = [
    { value: "", label: "جميع الصناعات" },
    { value: "Government", label: "حكومي" },
    { value: "E-commerce", label: "تجارة إلكترونية" },
    { value: "Healthcare", label: "صحي" },
    { value: "Education", label: "تعليمي" },
    { value: "Logistics", label: "لوجستيات" },
    { value: "Finance", label: "مالي" },
    { value: "Industrial", label: "صناعي" },
    { value: "Media", label: "إعلام" },
  ];

  const services = [
    "تطوير التطبيقات",
    "تطوير المواقع", 
    "تصميم UX/UI",
    "نظم الدفع",
    "الأمن السيبراني",
    "تكامل الأنظمة",
    "الذكاء الاصطناعي",
    "إنترنت الأشياء",
    "البث المباشر",
    "تحليل البيانات"
  ];

  const technologies = [
    "React", "React Native", "Vue.js", "Angular", "Flutter",
    "Node.js", "Python", "Laravel", "Spring Boot",
    "PostgreSQL", "MongoDB", "MySQL", "Redis",
    "Firebase", "AWS", "Docker", "Kubernetes",
    "AI/ML", "TensorFlow", "Blockchain"
  ];

  const years = [
    { value: "", label: "جميع السنوات" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
  ];

  const sortOptions = [
    { value: "latest", label: "الأحدث" },
    { value: "mostViewed", label: "الأكثر مشاهدة" },
    { value: "mostLiked", label: "الأكثر إعجاباً" },
    { value: "industry", label: "حسب الصناعة" },
    { value: "alphabetical", label: "أبجدياً" },
  ];

  const activeFiltersCount = [
    selectedIndustry,
    ...selectedServices,
    ...selectedTechnologies,
    selectedYear
  ].filter(Boolean).length;

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      onServicesChange(selectedServices.filter(s => s !== service));
    } else {
      onServicesChange([...selectedServices, service]);
    }
  };

  const toggleTechnology = (tech: string) => {
    if (selectedTechnologies.includes(tech)) {
      onTechnologiesChange(selectedTechnologies.filter(t => t !== tech));
    } else {
      onTechnologiesChange([...selectedTechnologies, tech]);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Main Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Search and Primary Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search Input */}
            <motion.div 
              className="relative flex-1 max-w-md"
              animate={{
                scale: isSearchFocused ? 1.02 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="ابحث في المشاريع..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-10 pr-4 h-11 border-gray-300 focus:border-primary focus:ring-primary rounded-xl transition-all duration-300"
              />
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>

            {/* Industry Quick Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-11 px-4 rounded-xl border-gray-300 hover:border-primary transition-all duration-300"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {selectedIndustry ? industries.find(i => i.value === selectedIndustry)?.label : "الصناعة"}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {industries.map((industry) => (
                  <DropdownMenuItem
                    key={industry.value}
                    onClick={() => onIndustryChange(industry.value)}
                    className={selectedIndustry === industry.value ? "bg-primary/10 text-primary" : ""}
                  >
                    {industry.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Advanced Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`h-11 px-4 rounded-xl transition-all duration-300 ${
                isFiltersOpen ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:border-primary'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              فلاتر متقدمة
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-white text-primary text-xs px-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center gap-3">
            {/* Results Count */}
            <div className="text-sm text-gray-600 hidden sm:block">
              {totalResults} مشروع
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 px-4 rounded-xl border-gray-300">
                  <SortAsc className="w-4 h-4 mr-2" />
                  {sortOptions.find(s => s.value === sortBy)?.label}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onSortChange(option.value)}
                    className={sortBy === option.value ? "bg-primary/10 text-primary" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Services Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">الخدمات</h4>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {services.map((service) => (
                      <motion.button
                        key={service}
                        onClick={() => toggleService(service)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                          selectedServices.includes(service)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {service}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Technologies Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">التقنيات</h4>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {technologies.map((tech) => (
                      <motion.button
                        key={tech}
                        onClick={() => toggleTechnology(tech)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                          selectedTechnologies.includes(tech)
                            ? 'bg-secondary text-white border-secondary'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-secondary'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {tech}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Year Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">السنة</h4>
                  <div className="flex flex-wrap gap-2">
                    {years.map((year) => (
                      <motion.button
                        key={year.value}
                        onClick={() => onYearChange(year.value)}
                        className={`px-4 py-2 text-sm rounded-lg border transition-all duration-200 ${
                          selectedYear === year.value
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Calendar className="w-4 h-4 mr-1 inline" />
                        {year.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear All Button */}
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200 flex justify-end"
                >
                  <Button
                    variant="outline"
                    onClick={onClearAll}
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    <X className="w-4 h-4 mr-2" />
                    مسح جميع المرشحات
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
