// DEPRECATED: This file contains dummy project data that has been replaced by real database data
// Portfolio data is now fetched from the database via /api/portfolio endpoints
// Real portfolio data is seeded in server/seed-database.ts and served through the API
// Frontend components now use React Query to fetch data from /api/portfolio endpoints
export const dummyProjects = {
  mobile: [
    {
      id: "mob1",
      title: "تطبيق التسوق الإلكتروني",
      description: "تطبيق جوال شامل للتسوق مع إدارة المنتجات وسلة الشراء والدفع الآمن",
      imageUrl: "/api/placeholder/400/300", // TODO: استبدال بصور حقيقية في assets/projects/
      technologies: ["React Native", "Firebase", "Redux", "Stripe"],
      duration: "3 أشهر",
    },
    {
      id: "mob2", 
      title: "تطبيق التوصيل السريع",
      description: "منصة توصيل ذكية مع تتبع الطلبات وإدارة السائقين",
      imageUrl: "/api/placeholder/400/300",
      technologies: ["Flutter", "Node.js", "PostgreSQL", "Socket.io"],
      duration: "4 أشهر",
    },
    {
      id: "mob3",
      title: "تطبيق إدارة المهام",
      description: "تطبيق إنتاجية متقدم لإدارة المشاريع والمهام الشخصية والجماعية",
      imageUrl: "/api/placeholder/400/300",
      technologies: ["React Native", "Express.js", "MongoDB", "JWT"],
      duration: "2.5 أشهر",
    },
    {
      id: "mob4",
      title: "تطبيق الحجوزات الطبية",
      description: "منصة رقمية لحجز المواعيد الطبية مع إدارة العيادات والأطباء",
      imageUrl: "/api/placeholder/400/300",
      technologies: ["Flutter", "Django", "MySQL", "FCM"],
      duration: "5 أشهر",
    },
    {
      id: "mob5",
      title: "تطبيق التعليم التفاعلي",
      description: "منصة تعليمية تفاعلية مع الدروس المرئية والاختبارات الذكية",
      imageUrl: "/api/placeholder/400/300",
      technologies: ["React Native", "Laravel", "PostgreSQL", "WebRTC"],
      duration: "6 أشهر",
    },
    {
      id: "mob6",
      title: "تطبيق إدارة المالية الشخصية",
      description: "تطبيق ذكي لتتبع الإنفاق وإدارة الميزانية والاستثمارات",
      imageUrl: "/api/placeholder/400/300",
      technologies: ["Flutter", "Spring Boot", "H2", "Chart.js"],
      duration: "3.5 أشهر",
    }
  ],
  web: [
    {
      id: "web1",
      title: "منصة التجارة الإلكترونية",
      description: "موقع تجارة إلكترونية متكامل مع لوحة تحكم شاملة وإدارة المخزون",
      imageUrl: "/api/placeholder/400/300", // TODO: استبدال بصور حقيقية في assets/projects/
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      duration: "4 أشهر",
    },
    {
      id: "web2",
      title: "نظام إدارة المحتوى",
      description: "منصة CMS متطورة لإدارة المحتوى الرقمي مع محرر متقدم",
      imageUrl: "/api/placeholder/400/300",
      technologies: ["Vue.js", "Laravel", "MySQL", "Redis"],
      duration: "3 أشهر",
    },
    {
      id: "web3",
      title: "منصة التعلم الإلكتروني",
      description: "نظام إدارة التعلم الشامل مع الفصول الافتراضية والاختبارات",
      imageUrl: "/api/placeholder/400/300",
      technologies: ["Angular", "Spring Boot", "Oracle", "WebRTC"],
      duration: "6 أشهر",
    },
    {
      id: "web4",
      title: "نظام إدارة المستشفيات",
      description: "نظام شامل لإدارة المستشفيات والمرضى والموظفين",
      imageUrl: "/api/placeholder/400/300",
      technologies: ["React", "ASP.NET Core", "SQL Server", "SignalR"],
      duration: "8 أشهر",
    },
    {
      id: "web5", 
      title: "منصة الحلول المصرفية",
      description: "نظام مصرفي رقمي متكامل مع الأمان العالي والمعاملات السريعة",
      imageUrl: "/api/placeholder/400/300",
      technologies: ["React", "Java Spring", "PostgreSQL", "Kafka"],
      duration: "10 أشهر",
    },
    {
      id: "web6",
      title: "نظام إدارة الموارد البشرية",
      description: "منصة HR شاملة لإدارة الموظفين والرواتب والحضور",
      imageUrl: "/api/placeholder/400/300",
      technologies: ["Vue.js", "Django", "MySQL", "Celery"],
      duration: "5 أشهر",
    }
  ]
};

// نوع البيانات للمشروع
export interface DummyProject {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  duration: string;
}

// دالة للحصول على المشاريع حسب الفئة
export function getProjectsByCategory(category: 'mobile' | 'web'): DummyProject[] {
  return dummyProjects[category] || [];
}

// دالة للحصول على مشروع واحد بواسطة المعرف
export function getProjectById(id: string): DummyProject | undefined {
  const allProjects = [...dummyProjects.mobile, ...dummyProjects.web];
  return allProjects.find(project => project.id === id);
}

/* 
تعليقات للتطوير المستقبلي:
1. استبدال البيانات الوهمية ببيانات حقيقية من قاعدة البيانات
2. إضافة صور حقيقية في مجلد assets/projects/
3. ربط المشاريع بجدول قاعدة البيانات الحقيقي
4. إضافة المزيد من الحقول مثل تاريخ الإنجاز والعميل
*/