import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PortfolioItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { EnhancedSearchBar } from "@/components/portfolio/enhanced-search-bar";
import { EnhancedProjectGallery } from "@/components/portfolio/enhanced-project-gallery";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Grid, Globe, Smartphone, Monitor, Settings, Megaphone, CheckCircle, Heart, Headphones, Award, ExternalLink } from "lucide-react";
import { useLanguage } from "@/i18n/lang";

export default function Portfolio() {
  const { dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    technologies: [] as string[],
    categories: [] as string[],
    sortBy: 'newest' as 'newest' | 'oldest' | 'popular' | 'alphabetical'
  });
  
  const { data: portfolio, isLoading, error } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  // Mock data for search functionality
  const recentSearches = ["React", "موبايل", "تطبيق"];
  const popularSearches = ["تطبيق ويب", "React Native", "UI/UX", "تجارة إلكترونية"];

  const categories = [
    { id: "all", label: "جميع المشاريع", icon: Grid },
    { id: "web", label: "تطبيقات الويب", icon: Globe },
    { id: "mobile", label: "التطبيقات المحمولة", icon: Smartphone },
    { id: "desktop", label: "تطبيقات سطح المكتب", icon: Monitor },
    { id: "erp", label: "أنظمة ERP", icon: Settings },
    { id: "marketing", label: "التسويق الرقمي", icon: Megaphone },
  ];

  // Enhanced filtering and search logic
  const { filteredPortfolio, availableTechnologies } = useMemo(() => {
    if (!portfolio) return { filteredPortfolio: [], availableTechnologies: [] };

    // Get all unique technologies
    const allTechnologies = Array.from(
      new Set(portfolio.flatMap(project => project.technologies || []))
    ).sort();

    // Apply filters
    let filtered = portfolio.filter(project => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesDescription = project.description.toLowerCase().includes(query);
        const matchesTechnologies = project.technologies?.some(tech => 
          tech.toLowerCase().includes(query)
        );
        
        if (!matchesTitle && !matchesDescription && !matchesTechnologies) {
          return false;
        }
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(project.category)) {
        return false;
      }

      // Technology filter
      if (filters.technologies.length > 0) {
        const hasMatchingTech = filters.technologies.some(tech => 
          project.technologies?.includes(tech)
        );
        if (!hasMatchingTech) return false;
      }

      return true;
    });

    // Apply sorting
    switch (filters.sortBy) {
      case 'oldest':
        filtered = filtered.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case 'alphabetical':
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'popular':
        // For demo, sort by category then title
        filtered = filtered.sort((a, b) => {
          if (a.category === b.category) return a.title.localeCompare(b.title);
          return a.category.localeCompare(b.category);
        });
        break;
      case 'newest':
      default:
        filtered = filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return { filteredPortfolio: filtered, availableTechnologies: allTechnologies };
  }, [portfolio, searchQuery, filters]);

  const stats = [
    { value: "50+", label: "مشروع مكتمل", icon: CheckCircle },
    { value: "98%", label: "رضا العملاء", icon: Heart },
    { value: "24/7", label: "دعم متواصل", icon: Headphones },
    { value: "5+", label: "سنوات خبرة", icon: Award },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">حدث خطأ في تحميل المشاريع</p>
          <Button onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-light py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedText delay={0.2}>
            <h1 className="text-4xl lg:text-6xl font-bold text-secondary mb-6">
              معرض أعمالنا
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              استكشف مجموعة من مشاريعنا المميزة التي نفذناها بنجاح لعملائنا
            </p>
          </AnimatedText>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <AnimatedCard key={index} delay={index * 0.1} className="text-center p-6">
                <CardContent className="p-0">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="text-primary text-4xl mb-4"
                  >
                    <stat.icon size={48} />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold text-secondary mb-2"
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-gray-600">{stat.label}</p>
                </CardContent>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Search Section */}
      <section className="py-12 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0.3}>
            <EnhancedSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filters={filters}
              onFiltersChange={setFilters}
              availableTechnologies={availableTechnologies}
              availableCategories={categories}
              recentSearches={recentSearches}
              popularSearches={popularSearches}
              totalResults={filteredPortfolio.length}
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : filteredPortfolio && filteredPortfolio.length > 0 ? (
            <motion.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPortfolio.map((project, index) => (
                <AnimatedCard
                  key={project.id}
                  delay={index * 0.1}
                  className="group overflow-hidden"
                >
                  <CardContent className="p-0">
                    {/* Enhanced Project Gallery */}
                    <EnhancedProjectGallery
                      project={{
                        id: project.id,
                        title: project.title,
                        imageUrl: project.imageUrl,
                        category: project.category,
                        technologies: project.technologies,
                        description: project.description,
                        gallery: [
                          // Mock additional gallery images for demo
                          {
                            id: `${project.id}-2`,
                            url: project.imageUrl,
                            alt: `${project.title} - صورة إضافية`,
                            type: 'image' as const,
                            caption: 'لقطة شاشة من المشروع'
                          }
                        ]
                      }}
                    />
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {categories.find(c => c.id === project.category)?.label || project.category}
                        </Badge>
                        <div className="text-primary">
                          <i className="fas fa-folder"></i>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                      
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.slice(0, 4).map((tech, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.technologies.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ x: 5 }}
                          className="text-primary font-semibold cursor-pointer flex items-center flex-1"
                        >
                          تفاصيل المشروع
                          <i className="fas fa-arrow-left mr-2"></i>
                        </motion.button>
                        
                        {/* Quick actions */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                          title="زيارة المشروع"
                        >
                          <ExternalLink size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </CardContent>
                </AnimatedCard>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-500 mb-2">
                  لم نجد مشاريع تطابق معايير البحث
                </h3>
                <p className="text-gray-400 mb-4">
                  جرب تعديل كلمات البحث أو إزالة بعض المرشحات
                </p>
                <InteractiveButton
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({ technologies: [], categories: [], sortBy: 'newest' });
                  }}
                  className="btn-primary"
                >
                  مسح جميع المرشحات
                </InteractiveButton>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
              كيف نعمل معك
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              عملية مدروسة تضمن تحقيق أفضل النتائج لمشروعك
            </p>
          </AnimatedText>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "الاستشارة",
                description: "نتفهم احتياجاتك ونضع الخطة المناسبة",
                icon: "fas fa-comments",
              },
              {
                step: "02", 
                title: "التصميم",
                description: "نصمم النماذج الأولية والواجهات",
                icon: "fas fa-pencil-ruler",
              },
              {
                step: "03",
                title: "التطوير",
                description: "نطور المشروع باستخدام أحدث التقنيات",
                icon: "fas fa-code",
              },
              {
                step: "04",
                title: "التسليم",
                description: "نسلم المشروع مع الدعم والصيانة",
                icon: "fas fa-rocket",
              },
            ].map((process, index) => (
              <AnimatedCard key={index} delay={index * 0.1} className="text-center p-6">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {process.step}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="text-primary text-3xl mb-4"
                  >
                    <i className={process.icon}></i>
                  </motion.div>
                  <h3 className="text-lg font-bold text-secondary mb-3">
                    {process.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {process.description}
                  </p>
                </CardContent>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection delay={0.3}>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              لديك فكرة مشروع؟
            </h2>
            <p className="text-xl mb-8 leading-relaxed opacity-90">
              دعنا نساعدك في تحويل فكرتك إلى واقع رقمي مبهر يحقق أهدافك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <InteractiveButton
                  className="bg-white text-primary hover:bg-gray-100 shadow-lg hover:shadow-xl"
                  icon={<i className="fas fa-rocket"></i>}
                >
                  ابدأ مشروعك الآن
                </InteractiveButton>
              </Link>
              <Link href="/services">
                <InteractiveButton
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  icon={<i className="fas fa-list"></i>}
                >
                  تصفح خدماتنا
                </InteractiveButton>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}