// Website information data extracted from service-detail.tsx for better performance
export const getDetailedWebsiteInfo = (websiteName: string) => {
  const websiteDetails: Record<string, any> = {
    // Corporate Websites
    "موقع شركة تقنية": {
      name: "موقع شركة تقنية",
      description: "موقع شركة تقنية احترافي بتصميم عصري",
      fullDescription: "موقع ويب احترافي للشركات التقنية يجمع بين التصميم العصري والوظائف المتقدمة. يعرض الخدمات والمنتجات بطريقة جذابة ويوفر تجربة مستخدم استثنائية.",
      keyFeatures: ["صفحة رئيسية جذابة", "معرض خدمات تفاعلي", "صفحات فريق العمل", "نماذج أعمال ومشاريع"],
      technicalFeatures: ["تقنيات ويب حديثة", "سرعة تحميل فائقة", "أمان SSL متقدم", "تحسين الأداء"],
      benefits: ["زيادة الثقة بالعلامة التجارية", "تحسين الوصول للعملاء المحتملين", "عرض احترافي للخدمات"],
      targetAudience: ["الشركات التقنية", "الاستشارات الهندسية", "شركات البرمجيات"],
      timeline: "4-6 أسابيع",
      technologies: ["React.js", "Next.js", "Tailwind CSS", "TypeScript", "Node.js", "MongoDB"],
      category: "corporate"
    },
    "Tech Company Website": {
      name: "Tech Company Website", 
      description: "Professional tech company website with modern design",
      fullDescription: "Professional corporate website for technology companies that combines modern design with advanced functionality.",
      keyFeatures: ["Attractive Homepage", "Interactive Services Gallery", "Team Member Pages", "Portfolio & Projects"],
      technicalFeatures: ["Modern Web Technologies", "Lightning-fast Loading", "Advanced SSL Security"],
      benefits: ["Increased Brand Trust", "Better Reach to Potential Clients", "Professional Service Display"],
      targetAudience: ["Tech Companies", "Engineering Consultancies", "Software Companies"],
      timeline: "4-6 weeks",
      technologies: ["React.js", "Next.js", "Tailwind CSS", "TypeScript", "Node.js", "MongoDB"],
      category: "corporate"
    }
  };

  return websiteDetails[websiteName] || null;
};