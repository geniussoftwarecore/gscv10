import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedCard, AnimatedSection, AnimatedText } from "@/components/ui/animated-card";
import { InteractiveButton } from "@/components/ui/interactive-button";
import { motion } from "framer-motion";
import { Calendar, User, Eye, MessageCircle, Search, Filter, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  published: string;
  publishedAt: string;
  readTime?: string;
  views?: number;
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "مستقبل تطوير التطبيقات المحمولة في 2024",
      slug: "mobile-app-development-future-2024",
      excerpt: "استكشف أحدث الاتجاهات والتقنيات في تطوير التطبيقات المحمولة وكيف ستؤثر على مستقبل الصناعة",
      content: "",
      featuredImage: "smartphone",
      category: "تقنية",
      tags: ["تطبيقات", "موبايل", "مستقبل"],
      published: "true",
      publishedAt: "2024-01-20",
      readTime: "5 دقائق",
      views: 1250
    },
    {
      id: "2", 
      title: "أهمية تجربة المستخدم في تصميم المواقع",
      slug: "ux-importance-web-design",
      excerpt: "تعرف على كيفية تأثير تجربة المستخدم على نجاح موقعك الإلكتروني وأفضل الممارسات لتحسينها",
      content: "",
      featuredImage: "palette",
      category: "تصميم",
      tags: ["UX", "تصميم", "مواقع"],
      published: "true",
      publishedAt: "2024-01-18",
      readTime: "7 دقائق",
      views: 980
    },
    {
      id: "3",
      title: "كيفية اختيار التقنية المناسبة لمشروعك",
      slug: "choosing-right-technology-project",
      excerpt: "دليل شامل لمساعدتك في اختيار أفضل التقنيات والأدوات المناسبة لمشروعك التقني",
      content: "",
      featuredImage: "code",
      category: "برمجة",
      tags: ["تقنية", "برمجة", "مشاريع"],
      published: "true", 
      publishedAt: "2024-01-15",
      readTime: "10 دقائق",
      views: 1500
    },
    {
      id: "4",
      title: "استراتيجيات التسويق الرقمي الفعالة",
      slug: "effective-digital-marketing-strategies",
      excerpt: "اكتشف أحدث استراتيجيات التسويق الرقمي التي تساعدك في الوصول لجمهورك المستهدف",
      content: "",
      featuredImage: "megaphone",
      category: "تسويق",
      tags: ["تسويق", "رقمي", "استراتيجية"],
      published: "true",
      publishedAt: "2024-01-12",
      readTime: "8 دقائق",
      views: 750
    }
  ];

  const categories = ["الكل", "تقنية", "تصميم", "برمجة", "تسويق"];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "all" || selectedCategory === "الكل" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  };

  const getIconForCategory = (category: string) => {
    const icons = {
      "تقنية": "📱",
      "تصميم": "🎨", 
      "برمجة": "💻",
      "تسويق": "📢"
    };
    return icons[category as keyof typeof icons] || "📝";
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-light py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedText delay={0.2}>
            <h1 className="text-4xl lg:text-6xl font-bold text-secondary mb-6">
              مدونة GSC
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              آخر المقالات والنصائح في عالم التقنية والبرمجة والتصميم
            </p>
          </AnimatedText>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="البحث في المقالات..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category || (selectedCategory === "all" && category === "الكل") ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category === "الكل" ? "all" : category)}
                  className="text-sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <AnimatedCard key={post.id} delay={index * 0.1} className="overflow-hidden">
                  {/* Featured Image */}
                  <div className="h-48 bg-gradient-to-br from-primary to-primary-dark relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">{getIconForCategory(post.category)}</span>
                    </div>
                    <Badge className="absolute top-4 right-4 bg-white text-primary">
                      {post.category}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(post.publishedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        {post.views?.toLocaleString("ar-SA")}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-secondary mb-3 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                      <Link href={`/blog/${post.slug}`}>
                        <motion.button
                          whileHover={{ x: 5 }}
                          className="text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                        >
                          اقرأ المزيد
                          <ArrowLeft size={16} />
                        </motion.button>
                      </Link>
                    </div>
                  </CardContent>
                </AnimatedCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-secondary mb-2">لا توجد مقالات</h3>
              <p className="text-gray-600">لم نجد مقالات تطابق البحث أو الفئة المحددة</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-24 bg-gsc-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection delay={0.3}>
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
              اشترك في النشرة البريدية
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              احصل على آخر المقالات والنصائح التقنية مباشرة في بريدك الإلكتروني
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <InteractiveButton className="gradient-gsc text-white">
                اشتراك
              </InteractiveButton>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              لن نرسل لك رسائل مزعجة. يمكنك إلغاء الاشتراك في أي وقت.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
              استكشف المواضيع
            </h2>
            <p className="text-xl text-gray-600">
              تصفح مقالاتنا حسب المواضيع المختلفة
            </p>
          </AnimatedText>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(1).map((category, index) => {
              const categoryPosts = blogPosts.filter(post => post.category === category);
              return (
                <AnimatedCard key={category} delay={index * 0.1} className="p-6 text-center cursor-pointer hover:shadow-lg transition-all">
                  <div className="text-4xl mb-4">{getIconForCategory(category)}</div>
                  <h3 className="text-xl font-bold text-secondary mb-2">{category}</h3>
                  <p className="text-gray-600 mb-4">{categoryPosts.length} مقال</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    استكشف
                  </Button>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}