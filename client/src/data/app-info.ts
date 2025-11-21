// App information data extracted from service-detail.tsx for better performance
export const getDetailedAppInfo = (appName: string) => {
  const appDetails: Record<string, any> = {
    // Business Apps
    "إدارة المشاريع": {
      name: "إدارة المشاريع",
      description: "تطبيق شامل لإدارة المشاريع والمهام بكفاءة عالية",
      fullDescription: "تطبيق متقدم لإدارة المشاريع يوفر بيئة عمل متكاملة لفرق العمل.",
      keyFeatures: ["تخطيط المشاريع التفاعلي", "توزيع المهام الذكي", "تتبع الوقت والتكلفة"],
      technicalFeatures: ["واجهة سهلة الاستخدام", "مزامنة الوقت الفعلي", "تكامل مع التقويم"],
      benefits: ["تحسين الإنتاجية بنسبة 35%", "تقليل وقت المشاريع", "تحسين التعاون بين الفرق"],
      targetAudience: ["الشركات الناشئة", "فرق التطوير", "المكاتب الاستشارية"],
      timeline: "3-4 أسابيع",
      technologies: ["React Native", "Firebase", "Node.js", "MongoDB"],
      category: "business"
    },
    "Project Management": {
      name: "Project Management",
      description: "Comprehensive project and task management application with high efficiency",
      fullDescription: "Advanced project management app that provides an integrated work environment for teams.",
      keyFeatures: ["Interactive Project Planning", "Smart Task Assignment", "Time & Cost Tracking"],
      technicalFeatures: ["User-friendly Interface", "Real-time Sync", "Calendar Integration"],
      benefits: ["35% Productivity Improvement", "Reduced Project Time", "Better Team Collaboration"],
      targetAudience: ["Startups", "Development Teams", "Consulting Firms"],
      timeline: "3-4 weeks",
      technologies: ["React Native", "Firebase", "Node.js", "MongoDB"],
      category: "business"
    }
  };

  return appDetails[appName] || null;
};