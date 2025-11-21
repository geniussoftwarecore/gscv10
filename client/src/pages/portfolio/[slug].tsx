import { useMemo } from 'react';
import { useRoute } from 'wouter';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Home } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import EnhancedProjectDetailHero from '@/components/portfolio/enhanced-project-detail-hero';
import EnhancedProjectDetailContent from '@/components/portfolio/enhanced-project-detail-content';
import { portfolioProjects } from '@/data/portfolio';

export default function ProjectDetail() {
  const [match, params] = useRoute('/portfolio/:slug');
  const slug = params?.slug;

  const project = useMemo(() => {
    if (!slug) return null;
    return portfolioProjects.find(p => p.slug === slug) || null;
  }, [slug]);

  // Loading State
  if (!match || !slug) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-sky-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-brand-text-primary mb-4">
            جاري تحميل تفاصيل المشروع...
          </h2>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!project) {
    return (
      <>
        <Helmet>
          <title>المشروع غير موجود - جينيوس سوفت وير كور</title>
          <meta name="description" content="المشروع المطلوب غير موجود أو تم حذفه" />
        </Helmet>

        <div className="min-h-screen bg-brand-bg flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto p-8"
          >
            <Card className="border-2 border-brand-sky-base bg-brand-bg shadow-xl">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🔍</span>
                </div>
                
                <h1 className="text-2xl font-bold text-brand-text-primary mb-4">
                  المشروع غير موجود
                </h1>
                
                <p className="text-brand-text-muted mb-8 leading-relaxed">
                  عذراً، المشروع الذي تبحث عنه غير موجود أو تم حذفه. 
                  يمكنك العودة لاستعراض جميع مشاريعنا.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="outline" className="border-brand-sky-base hover:border-brand-sky-accent">
                    <Link href="/">
                      <Home className="w-4 h-4 mr-2" />
                      الصفحة الرئيسية
                    </Link>
                  </Button>
                  
                  <Button asChild className="bg-brand-sky-accent hover:bg-brand-sky-accent/90 text-white">
                    <Link href="/portfolio">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      جميع المشاريع
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Enhanced SEO Meta Tags */}
      <Helmet>
        <title>{`${project.titleAr} - ${project.clientAr} | جينيوس سوفت وير كور`}</title>
        <meta name="description" content={project.summaryAr} />
        <meta name="keywords" content={[
          ...project.tech,
          ...project.servicesAr,
          project.sectorAr,
          'تطوير تطبيقات',
          'حلول تقنية',
          'جينيوس سوفت وير كور'
        ].join(', ')} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={`${project.titleAr} - ${project.clientAr}`} />
        <meta property="og:description" content={project.summaryAr} />
        <meta property="og:image" content={project.coverImage} />
        <meta property="og:url" content={`${window.location.origin}/portfolio/${project.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="جينيوس سوفت وير كور" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${project.titleAr} - ${project.clientAr}`} />
        <meta name="twitter:description" content={project.summaryAr} />
        <meta name="twitter:image" content={project.coverImage} />

        {/* Additional SEO Meta Tags */}
        <meta name="author" content="جينيوس سوفت وير كور" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${window.location.origin}/portfolio/${project.slug}`} />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": project.titleAr,
            "description": project.summaryAr,
            "image": project.coverImage,
            "creator": {
              "@type": "Organization",
              "name": "جينيوس سوفت وير كور",
              "url": window.location.origin
            },
            "datePublished": `${project.year}-01-01`,
            "keywords": [...project.tech, ...project.servicesAr].join(', '),
            "inLanguage": "ar",
            "url": `${window.location.origin}/portfolio/${project.slug}`
          })}
        </script>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-brand-bg"
      >
        {/* Breadcrumb Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-brand-bg border-b border-brand-sky-base py-4 sticky top-0 z-40 backdrop-blur-sm bg-brand-bg/90"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-brand-text-muted">
              <Link 
                href="/" 
                className="hover:text-brand-sky-accent transition-colors flex items-center gap-1"
              >
                <Home className="w-4 h-4" />
                الرئيسية
              </Link>
              <span className="text-brand-sky-base">/</span>
              <Link 
                href="/portfolio" 
                className="hover:text-brand-sky-accent transition-colors"
              >
                المشاريع
              </Link>
              <span className="text-brand-sky-base">/</span>
              <span className="text-brand-text-primary font-medium truncate max-w-xs">
                {project.titleAr}
              </span>
            </div>
          </div>
        </motion.nav>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8"
        >
          <Button 
            asChild 
            variant="outline" 
            className="border-brand-sky-base hover:border-brand-sky-accent hover:bg-brand-sky-light mb-8"
          >
            <Link href="/portfolio">
              <ArrowLeft className="w-4 h-4 mr-2" />
              العودة للمشاريع
            </Link>
          </Button>
        </motion.div>

        {/* Project Detail Hero */}
        <EnhancedProjectDetailHero project={project} />

        {/* Project Detail Content */}
        <EnhancedProjectDetailContent project={project} />

        {/* Related Projects Preview */}
        <motion.section 
          className="py-16 lg:py-24 bg-brand-sky-light/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-text-primary mb-4">
                مشاريع ذات صلة
              </h2>
              <p className="text-lg text-brand-text-muted">
                استكشف المزيد من أعمالنا في نفس المجال
              </p>
            </div>

            <div className="text-center">
              <Button 
                asChild 
                size="lg"
                className="bg-brand-sky-accent hover:bg-brand-sky-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/portfolio">
                  استعرض جميع المشاريع
                  <ArrowLeft className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </>
  );
}