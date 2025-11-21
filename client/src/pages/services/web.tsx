import { useLanguage } from "@/i18n/lang";
import { SEOHead } from "@/components/SEOHead";
import WebPlanningSystem from "@/components/services/WebPlanningSystem";

export default function WebDetail() {
  const { lang } = useLanguage();

  const seoData = {
    title: lang === 'ar' ? 'تطوير المواقع والمنصات | GSC' : 'Web & Platform Development | GSC',
    description: lang === 'ar' 
      ? 'تطوير مواقع ومنصات احترافية متجاوبة مع أفضل ممارسات SEO والأداء. نصمم ونطور مواقع حديثة تناسب احتياجاتك.' 
      : 'Professional responsive websites and platforms development with best SEO and performance practices. We design and develop modern websites that suit your needs.'
  };

  return (
    <>
      <SEOHead 
        title={seoData.title}
        description={seoData.description}
      />
      
      <main className="scroll-smooth">
        <WebPlanningSystem />
      </main>
    </>
  );
}