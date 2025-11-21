import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { useTranslation } from "@/hooks/useTranslation";
import { SEOHead } from "@/components/SEOHead";
import {
  PageHeaderPortfolio,
  PortfolioGrid,
  PortfolioCTA
} from "@/sections/portfolio";

export default function PortfolioIndex() {
  const { dir } = useLanguage();
  const { t } = useTranslation();

  return (
    <>
      <SEOHead 
        title={dir === 'rtl' ? 'معرض أعمالنا | جينيوس سوفت وير كور' : 'Our Portfolio | Genius Software Core'}
        description={dir === 'rtl' 
          ? 'استكشف مجموعة متنوعة من المشاريع التي طورناها بعناية فائقة، من التطبيقات المحمولة إلى الأنظمة المعقدة'
          : 'Explore our carefully crafted projects, from mobile applications to complex systems'
        }
        type="website"
      />
      
      <motion.div 
        className="min-h-screen"
        dir={dir}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Page Header */}
        <PageHeaderPortfolio />
        
        {/* Portfolio Grid */}
        <PortfolioGrid />
        
        {/* CTA Section */}
        <PortfolioCTA />
      </motion.div>
    </>
  );
}