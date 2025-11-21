// Enhanced Portfolio Data with Bilingual Support and KPIs
export interface PortfolioProject {
  slug: string;
  title: string;
  titleAr: string;
  client: string;
  clientAr: string;
  clientLogo?: string;
  sector: string;
  sectorAr: string;
  year: number;
  status: 'published' | 'draft' | 'archived';
  kpis: KPI[];
  tech: string[];
  coverImage: string;
  gallery: GalleryItem[];
  summaryEn: string;
  summaryAr: string;
  descriptionEn: string;
  descriptionAr: string;
  challengeEn: string;
  challengeAr: string;
  solutionEn: string;
  solutionAr: string;
  services: string[];
  servicesAr: string[];
  duration: string;
  durationAr: string;
  teamSize: number;
  budget?: string;
  budgetAr?: string;
  websiteUrl?: string;
  githubUrl?: string;
  testimonial?: {
    name: string;
    nameAr: string;
    position: string;
    positionAr: string;
    content: string;
    contentAr: string;
    avatar?: string;
    rating: number;
  };
  features: string[];
  featuresAr: string[];
  results: string[];
  resultsAr: string[];
}

export interface KPI {
  id: string;
  label: string;
  labelAr: string;
  value: string;
  description: string;
  descriptionAr: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  unit?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  altAr: string;
  type: 'image' | 'video';
  caption?: string;
  captionAr?: string;
}

// Sample Portfolio Data (6 projects with bilingual content)
export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'k9-police-dog-management-system',
    title: 'K9 Police Dog Unit Management System',
    titleAr: 'نظام K9 لإدارة الكلاب البوليسية',
    client: 'Bargrain Security Services Company',
    clientAr: 'شركة برجراين للخدمات الأمنية',
    clientLogo: '@assets/pre_1761856733947.webp',
    sector: 'Security Services',
    sectorAr: 'الخدمات الأمنية',
    year: 2025,
    status: 'published',
    kpis: [
      {
        id: 'operational_efficiency',
        label: 'Operational Efficiency',
        labelAr: 'الكفاءة التشغيلية',
        value: '92%',
        description: 'Improvement in unit operations management',
        descriptionAr: 'تحسين في إدارة عمليات الوحدة',
        icon: 'TrendingUp',
        trend: 'up'
      },
      {
        id: 'training_tracking',
        label: 'Training Coverage',
        labelAr: 'تغطية التدريب',
        value: '100%',
        description: 'Complete digital tracking of all training sessions',
        descriptionAr: 'تتبع رقمي كامل لجميع جلسات التدريب',
        icon: 'Target',
        trend: 'up'
      },
      {
        id: 'mission_success',
        label: 'Mission Documentation',
        labelAr: 'توثيق المهام',
        value: '98%',
        description: 'Accurate field mission recording and reporting',
        descriptionAr: 'تسجيل وإبلاغ دقيق للمهام الميدانية',
        icon: 'Shield',
        trend: 'up'
      },
      {
        id: 'response_time',
        label: 'Report Generation',
        labelAr: 'إنشاء التقارير',
        value: '85%',
        description: 'Faster report generation and analysis',
        descriptionAr: 'إنشاء وتحليل التقارير بشكل أسرع',
        icon: 'Zap',
        trend: 'up'
      }
    ],
    tech: ['React.js', 'Next.js', 'TypeScript', 'ASP.NET Core', 'C#', 'SQL Server', 'Entity Framework', 'OAuth 2.0', 'JWT'],
    coverImage: '@assets/1_1761854863054.webp',
    gallery: [
      {
        id: '1',
        url: '@assets/1_1761854863054.webp',
        alt: 'K9 System Production Dashboard',
        altAr: 'لوحة تحكم نظام الإنتاج K9',
        type: 'image',
        caption: 'Real-time production tracking dashboard',
        captionAr: 'لوحة تحكم تتبع الإنتاج في الوقت الفعلي'
      },
      {
        id: '2',
        url: '@assets/2_1761854863054.webp',
        alt: 'K9 Control Panel',
        altAr: 'لوحة التحكم الرئيسية K9',
        type: 'image',
        caption: 'Comprehensive control panel interface',
        captionAr: 'واجهة لوحة التحكم الشاملة'
      },
      {
        id: '3',
        url: '@assets/3_1761854863055.webp',
        alt: 'K9 Dashboard Overview',
        altAr: 'نظرة عامة على لوحة تحكم K9',
        type: 'image',
        caption: 'Main dashboard with real-time statistics',
        captionAr: 'لوحة معلومات رئيسية مع إحصائيات في الوقت الفعلي'
      },
      {
        id: '4',
        url: '@assets/4_1761854863055.webp',
        alt: 'K9 Production System',
        altAr: 'نظام الإنتاج K9',
        type: 'image',
        caption: 'Advanced production management system',
        captionAr: 'نظام إدارة الإنتاج المتقدم'
      },
      {
        id: '5',
        url: '@assets/5_1761854863055.webp',
        alt: 'K9 Attendance Control Panel',
        altAr: 'لوحة التحكم بالحضور K9',
        type: 'image',
        caption: 'Attendance and shift management board',
        captionAr: 'لوحة إدارة الحضور والورديات'
      },
      {
        id: '7',
        url: '@assets/7_1761854863056.webp',
        alt: 'K9 Reports Dashboard',
        altAr: 'لوحة التقارير K9',
        type: 'image',
        caption: 'Advanced reporting with PDF/Excel export',
        captionAr: 'تقارير متقدمة مع إمكانية التصدير بصيغة PDF و Excel'
      },
      {
        id: '9',
        url: '@assets/9_1761854863056.webp',
        alt: 'K9 Control Panel Light Mode',
        altAr: 'لوحة التحكم K9 (الوضع الفاتح)',
        type: 'image',
        caption: 'Control panel with light theme interface',
        captionAr: 'لوحة التحكم بواجهة فاتحة'
      },
      {
        id: '10',
        url: '@assets/10_1761854863057.webp',
        alt: 'K9 System Login Interface',
        altAr: 'واجهة تسجيل الدخول لنظام K9',
        type: 'image',
        caption: 'Secure authentication system with role-based access',
        captionAr: 'نظام مصادقة آمن مع وصول قائم على الأدوار'
      }
    ],
    summaryEn: 'Integrated software system designed specifically for managing police dog unit operations, training, and field missions with complete digital documentation.',
    summaryAr: 'نظام برمجي متكامل مصمم خصيصاً لإدارة عمليات وحدات الكلاب البوليسية والتدريب والمهام الميدانية مع توثيق رقمي كامل.',
    descriptionEn: 'K9 Police Dog Management System is a comprehensive software solution developed to streamline operations of police K9 units. The system provides a central platform for registering all police dog data, officers, handlers, and tracking their activities effectively and reliably. It aims to improve unit efficiency through automation of training records, field missions, and facilitating monitoring of each police dog\'s status and role within the team. The system ensures comprehensive documentation of all activities, making review and evaluation processes easier while enhancing accountability and transparency in unit management.',
    descriptionAr: 'نظام K9 لإدارة الكلاب البوليسية هو نظام برمجي متكامل مصمم خصيصاً لإدارة عمليات فرق الكلاب البوليسية التابعة للجهات الأمنية. يوفر النظام منصة مركزية لتسجيل جميع بيانات الكلاب البوليسية وضباط الوحدة وتتبع أنشطتهم بصورة فعالة وموثوقة. يهدف نظام K9 إلى تحسين كفاءة إدارة الوحدة عبر أتمتة سجلات التدريب والمهام الميدانية وتسهيل متابعة حالة كل كلب بوليسي ودوره ضمن الفريق. كما يساعد النظام في ضمان توثيق شامل لكل نشاط، مما يسهل عمليات المراجعة والتقييم ويعزز مستوى المساءلة والشفافية في إدارة الوحدة.',
    challengeEn: 'Police K9 units needed an advanced digital tool to manage their operations effectively. Historically, K9 units play a vital role in daily security work, being used in various areas such as drug and explosive detection, tracking suspects or missing persons, search and rescue operations, and maintaining order during events. The challenge was to provide accurate and reliable records for all K9 unit operations and training, which is crucial for security agencies to meet compliance requirements and official reporting needs.',
    challengeAr: 'احتاجت وحدات الكلاب البوليسية إلى أداة رقمية متقدمة لإدارة عملياتها بفعالية. تاريخياً، تلعب وحدات الكلاب البوليسية دوراً حيوياً في العمل الأمني اليومي، حيث تُستخدم في مجالات متعددة مثل الكشف عن المخدرات والمتفجرات، تتبع المشتبه بهم المفقودين أو الهاربين، عمليات البحث والإنقاذ، وحفظ النظام أثناء الفعاليات. التحدي كان توفير سجلات دقيقة وموثوقة لكافة عمليات وتدريبات وحدة الK9، وهو أمر بالغ الأهمية للجهات الشرطية لتلبية متطلبات الامتثال والتقارير الرسمية.',
    solutionEn: 'We developed a comprehensive K9 management system featuring advanced UI/UX, police dog data management, officer and handler management, training management with certification tracking, field operations documentation, advanced reporting and analytics, alerts and reminders system, and integration capabilities with other police systems. The system uses modern technologies including React.js with Next.js for the frontend, ASP.NET Core with C# for the backend, SQL Server for database, and OAuth 2.0 with JWT for secure authentication.',
    solutionAr: 'طورنا نظام K9 شامل يتميز بواجهة مستخدم متقدمة، إدارة بيانات الكلاب البوليسية، إدارة الضباط والمعالجين، إدارة التدريب مع تتبع الشهادات، توثيق العمليات الميدانية، تقارير وإحصاءات متقدمة، نظام تنبيهات وتذكيرات، وقدرات التكامل مع الأنظمة الشرطية الأخرى. يستخدم النظام تقنيات حديثة تشمل React.js مع Next.js للواجهة الأمامية، ASP.NET Core مع #C للخادم الخلفي، SQL Server لقاعدة البيانات، و OAuth 2.0 مع JWT للمصادقة الآمنة.',
    services: ['Custom Software Development', 'UI/UX Design', 'Database Architecture', 'Security Implementation', 'System Integration', 'Training & Support'],
    servicesAr: ['تطوير برمجيات مخصصة', 'تصميم واجهة المستخدم', 'هندسة قواعد البيانات', 'تنفيذ الأمان', 'تكامل الأنظمة', 'التدريب والدعم'],
    duration: '6 months',
    durationAr: '6 أشهر',
    teamSize: 8,
    features: [
      'Advanced Police Dog Profile Management',
      'Officer & Handler Administration',
      'Training Session Tracking & Certification',
      'Field Mission Documentation',
      'Real-time Dashboard & Analytics',
      'Advanced Reporting (PDF/Excel Export)',
      'Role-based Access Control (RBAC)',
      'Alerts & Reminders System',
      'Multi-language Support (Arabic/English)',
      'Mobile-responsive Interface'
    ],
    featuresAr: [
      'إدارة متقدمة لملفات الكلاب البوليسية',
      'إدارة الضباط والمعالجين',
      'تتبع جلسات التدريب والشهادات',
      'توثيق المهام الميدانية',
      'لوحة معلومات وتحليلات في الوقت الفعلي',
      'تقارير متقدمة (تصدير PDF/Excel)',
      'التحكم في الوصول القائم على الأدوار',
      'نظام تنبيهات وتذكيرات',
      'دعم متعدد اللغات (عربي/إنجليزي)',
      'واجهة متجاوبة مع الأجهزة المحمولة'
    ],
    results: [
      '92% improvement in operational efficiency',
      '100% digital tracking of training sessions',
      '98% accurate field mission documentation',
      '85% faster report generation and analysis',
      'Complete elimination of paper-based records',
      'Real-time unit performance visibility'
    ],
    resultsAr: [
      '92% تحسين في الكفاءة التشغيلية',
      '100% تتبع رقمي لجلسات التدريب',
      '98% توثيق دقيق للمهام الميدانية',
      '85% أسرع في إنشاء وتحليل التقارير',
      'إلغاء كامل للسجلات الورقية',
      'رؤية أداء الوحدة في الوقت الفعلي'
    ],
    testimonial: {
      name: 'Nabil Al-Siyani',
      nameAr: 'نبيل السياني',
      position: 'CEO, Bargrain Security Services',
      positionAr: 'المدير التنفيذي، برجراين للخدمات الأمنية',
      content: 'The K9 system transformed our unit operations completely. Now we have complete visibility of all training and missions, with instant access to any information we need. The system has significantly improved our efficiency and accountability.',
      contentAr: 'نظام K9 حوّل عمليات وحدتنا بالكامل. الآن لدينا رؤية كاملة لجميع التدريبات والمهام، مع وصول فوري لأي معلومات نحتاجها. النظام حسّن كفاءتنا ومساءلتنا بشكل كبير.',
      rating: 5
    }
  },
  {
    slug: 'peregrine-complaint-management',
    title: 'Peregrine - Complaint and Customer Service Management System',
    titleAr: 'تطبيق Peregrine لإدارة الشكاوى وخدمة العملاء',
    client: 'Bargrain Security Services Company',
    clientAr: 'شركة برجراين للخدمات الأمنية',
    clientLogo: '@assets/pre_1761856733947.webp',
    sector: 'Customer Service & Operations',
    sectorAr: 'خدمة العملاء والعمليات',
    year: 2024,
    status: 'published',
    kpis: [
      {
        id: 'response_time',
        label: 'Response Time',
        labelAr: 'وقت الاستجابة',
        value: '67%',
        description: 'Faster complaint resolution',
        descriptionAr: 'حل الشكاوى بشكل أسرع',
        icon: 'Clock',
        trend: 'up'
      },
      {
        id: 'customer_satisfaction',
        label: 'Customer Satisfaction',
        labelAr: 'رضا العملاء',
        value: '95%',
        description: 'Overall customer satisfaction with complaint handling',
        descriptionAr: 'رضا العملاء العام عن معالجة الشكاوى',
        icon: 'Users',
        trend: 'up'
      },
      {
        id: 'digital_adoption',
        label: 'Digital Adoption',
        labelAr: 'التبني الرقمي',
        value: '88%',
        description: 'Customers using digital complaint system',
        descriptionAr: 'العملاء الذين يستخدمون نظام الشكاوى الرقمي',
        icon: 'Smartphone',
        trend: 'up'
      },
      {
        id: 'operational_efficiency',
        label: 'Operational Efficiency',
        labelAr: 'الكفاءة التشغيلية',
        value: '75%',
        description: 'Improvement in operations management',
        descriptionAr: 'تحسين في إدارة العمليات',
        icon: 'TrendingUp',
        trend: 'up'
      }
    ],
    tech: ['Flutter', 'Dart', 'ASP.NET Core 8', 'C#', 'SQL Server 2019', 'Entity Framework Core', 'Swagger', 'ASP.NET Core Identity'],
    coverImage: '@assets/33_1762120808371.webp',
    gallery: [
      {
        id: '1',
        url: '@assets/11_1762120808369.webp',
        alt: 'Peregrine app welcome screen',
        altAr: 'شاشة الترحيب لتطبيق Peregrine',
        type: 'image',
        caption: 'Secure and reliable mobile app splash screen',
        captionAr: 'شاشة الترحيب للتطبيق - الحماية والأمان بين يديك'
      },
      {
        id: '2',
        url: '@assets/22_1762120808370.webp',
        alt: 'User login screen',
        altAr: 'شاشة تسجيل الدخول',
        type: 'image',
        caption: 'Secure authentication with multiple login options',
        captionAr: 'تسجيل دخول آمن مع خيارات متعددة للمستخدمين'
      },
      {
        id: '3',
        url: '@assets/33_1762120808371.webp',
        alt: 'Main dashboard with quick actions',
        altAr: 'الشاشة الرئيسية مع الإجراءات السريعة',
        type: 'image',
        caption: 'Intuitive home screen for submitting requests and tracking complaints',
        captionAr: 'شاشة رئيسية سهلة لتقديم الطلبات وتتبع الشكاوى'
      },
      {
        id: '4',
        url: '@assets/44_1762120808371.webp',
        alt: 'Complaint tracking and status updates',
        altAr: 'تتبع الشكاوى وتحديثات الحالة',
        type: 'image',
        caption: 'Real-time complaint and request tracking with status indicators',
        captionAr: 'تتبع الطلبات والشكاوى في الوقت الفعلي مع مؤشرات الحالة'
      },
      {
        id: '5',
        url: '@assets/55_1762120808372.webp',
        alt: 'Live chat support interface',
        altAr: 'واجهة الدردشة المباشرة مع الدعم',
        type: 'image',
        caption: 'Interactive chat system for instant customer support',
        captionAr: 'نظام دردشة تفاعلي للدعم الفوري للعملاء'
      },
      {
        id: '6',
        url: '@assets/11_1762120808369.jpg',
        alt: 'Request details and conversation view',
        altAr: 'عرض تفاصيل الطلب والمحادثة',
        type: 'image',
        caption: 'Detailed request view with complete conversation history',
        captionAr: 'عرض تفاصيل الطلب مع سجل المحادثات الكامل'
      },
      {
        id: '7',
        url: '@assets/66_1762120808372.webp',
        alt: 'Request status and messaging',
        altAr: 'حالة الطلب والمراسلة',
        type: 'image',
        caption: 'Seamless communication between customers and support team',
        captionAr: 'تواصل سلس بين العملاء وفريق الدعم'
      }
    ],
    summaryEn: 'Comprehensive complaint and customer service management system with integrated incident tracking, guard management, and contract administration features.',
    summaryAr: 'نظام شامل لإدارة الشكاوى وخدمة العملاء مع ميزات متكاملة لتتبع الحوادث وإدارة الحراس والعقود.',
    descriptionEn: 'Peregrine is an integrated platform for complaint and customer service management, designed to connect customers with support teams seamlessly. The application automates the process of receiving, tracking, and resolving complaints, while also integrating internal operations management such as security guards, contracts, and incident management into one unified system. This comprehensive approach makes Peregrine a distinguished solution in the complaint management sector.',
    descriptionAr: 'تطبيق Peregrine هو منصة متكاملة لإدارة الشكاوى وخدمة العملاء، مصممة لربط العملاء بفرق الدعم الفني بطريقة سلسة وشفافة. يعمل التطبيق على أتمتة عمليات استقبال الشكاوى ومتابعتها وحلّها، إلى جانب دمج إدارة العمليات الداخلية مثل الحراسات والعقود والحوادث في منظومة واحدة متكاملة. هذا التكامل بين خدمة العملاء والعمليات التشغيلية يجعل Peregrine حلًا متميزًا في قطاع إدارة الشكاوى.',
    challengeEn: 'In an era where customer expectations for quick and efficient service are increasing, there was a critical need for innovative digital solutions to manage customer complaints and enhance support service quality. Studies show that 63% of customers form a negative impression after one bad experience, and about two-thirds of customers will not wait more than two minutes for assistance. The challenge was to provide a reliable digital system that ensures transparency and professional complaint handling while integrating various operational aspects.',
    challengeAr: 'في عصر تتزايد فيه توقعات العملاء للحصول على خدمة سريعة وفعّالة، برزت الحاجة إلى حلول رقمية مبتكرة لإدارة شكاوى العملاء وتعزيز جودة خدمة الدعم. تشير التقارير إلى أن 63% من العملاء يكوّنون انطباعًا سلبيًا بعد تجربة سيئة واحدة، وأن نحو ثلثي العملاء لن ينتظروا أكثر من دقيقتين للحصول على المساعدة. التحدي كان توفير نظام رقمي موثوق يضمن الشفافية والمعالجة الاحترافية للشكاوى مع دمج جوانب العمليات المختلفة.',
    solutionEn: 'We developed Peregrine using cutting-edge technologies: ASP.NET Core 8 with C# for high-performance backend APIs, SQL Server 2019 for reliable data storage, Entity Framework Core for efficient database operations, and Flutter with Dart for a seamless cross-platform mobile experience. The system features comprehensive complaint management, real-time incident tracking, guard and contract administration, role-based access control with ASP.NET Core Identity, instant push notifications, and interactive API documentation with Swagger.',
    solutionAr: 'طورنا تطبيق Peregrine باستخدام أحدث التقنيات: ASP.NET Core 8 مع #C لواجهات برمجية عالية الأداء، SQL Server 2019 لتخزين البيانات الموثوق، Entity Framework Core للتعامل الفعال مع قاعدة البيانات، و Flutter مع Dart لتجربة جوال سلسة متعددة المنصات. يتميز النظام بإدارة شاملة للشكاوى، تتبع الحوادث في الوقت الفعلي، إدارة الحراس والعقود، التحكم بالوصول القائم على الأدوار، الإشعارات الفورية، والتوثيق التفاعلي لواجهات البرمجة.',
    services: ['Mobile App Development', 'Backend API Development', 'Database Architecture', 'Security Implementation', 'System Integration', 'UI/UX Design'],
    servicesAr: ['تطوير تطبيقات الجوال', 'تطوير واجهات برمجية خلفية', 'هندسة قواعد البيانات', 'تنفيذ الأمان', 'تكامل الأنظمة', 'تصميم واجهة المستخدم'],
    duration: '8 months',
    durationAr: '8 أشهر',
    teamSize: 10,
    features: [
      'Comprehensive Complaint Management',
      'Real-time Incident Tracking',
      'Guard & Personnel Management',
      'Contract Administration',
      'Push Notifications System',
      'Role-based Access Control',
      'Cross-platform Mobile App (iOS & Android)',
      'Interactive API Documentation (Swagger)',
      'Audit Logs & Activity Tracking',
      'Multi-language Support (Arabic/English)',
      'Customer Satisfaction Surveys',
      'Advanced Reporting & Analytics'
    ],
    featuresAr: [
      'إدارة شاملة للشكاوى',
      'تتبع الحوادث في الوقت الفعلي',
      'إدارة الحراس والموظفين',
      'إدارة العقود',
      'نظام الإشعارات الفورية',
      'التحكم بالوصول القائم على الأدوار',
      'تطبيق جوال متعدد المنصات (iOS و Android)',
      'توثيق تفاعلي لواجهات البرمجة (Swagger)',
      'سجلات التدقيق وتتبع النشاط',
      'دعم متعدد اللغات (عربي/إنجليزي)',
      'استطلاعات رضا العملاء',
      'تقارير وإحصاءات متقدمة'
    ],
    results: [
      '67% faster complaint resolution time',
      '95% customer satisfaction rate',
      '88% digital adoption rate',
      '75% improvement in operational efficiency',
      'Complete elimination of paper-based complaint tracking',
      'Real-time visibility of all operations'
    ],
    resultsAr: [
      '67% أسرع في حل الشكاوى',
      '95% معدل رضا العملاء',
      '88% معدل التبني الرقمي',
      '75% تحسين في الكفاءة التشغيلية',
      'إلغاء كامل لتتبع الشكاوى الورقي',
      'رؤية في الوقت الفعلي لجميع العمليات'
    ],
    testimonial: {
      name: 'Nabil Al-Siyani',
      nameAr: 'نبيل السياني',
      position: 'CEO, Bargrain Security Services',
      positionAr: 'المدير التنفيذي، برجراين للخدمات الأمنية',
      content: 'Peregrine has revolutionized how we handle customer complaints and manage our operations. The seamless integration of complaint management with our field operations has dramatically improved our response times and customer satisfaction.',
      contentAr: 'لقد أحدث Peregrine ثورة في طريقة معالجتنا لشكاوى العملاء وإدارة عملياتنا. التكامل السلس بين إدارة الشكاوى وعملياتنا الميدانية حسّن بشكل كبير أوقات استجابتنا ورضا عملائنا.',
      rating: 5
    }
  },
  {
    slug: 'healthcare-management-system',
    title: 'Healthcare Management System - King Fahd Hospital',
    titleAr: 'نظام إدارة الرعاية الصحية - مستشفى الملك فهد',
    client: 'King Fahd Hospital',
    clientAr: 'مستشفى الملك فهد',
    sector: 'Healthcare',
    sectorAr: 'صحي',
    year: 2023,
    status: 'published',
    kpis: [
      {
        id: 'patient_satisfaction',
        label: 'Patient Satisfaction',
        labelAr: 'رضا المرضى',
        value: '94%',
        description: 'Overall patient satisfaction with digital services',
        descriptionAr: 'رضا المرضى العام عن الخدمات الرقمية',
        icon: 'Heart',
        trend: 'up'
      },
      {
        id: 'appointment_efficiency',
        label: 'Appointment Efficiency',
        labelAr: 'كفاءة المواعيد',
        value: '67%',
        description: 'Reduction in appointment waiting time',
        descriptionAr: 'انخفاض في وقت انتظار المواعيد',
        icon: 'Calendar',
        trend: 'up'
      },
      {
        id: 'system_uptime',
        label: 'System Uptime',
        labelAr: 'وقت تشغيل النظام',
        value: '99.9%',
        description: 'System availability and reliability',
        descriptionAr: 'توفر النظام وموثوقيته',
        icon: 'Shield',
        trend: 'up'
      }
    ],
    tech: ['Angular', 'Spring Boot', 'PostgreSQL', 'Kubernetes', 'FHIR', 'HL7'],
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
    gallery: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=800&fit=crop',
        alt: 'Healthcare system interface',
        altAr: 'واجهة نظام الرعاية الصحية',
        type: 'image'
      }
    ],
    summaryEn: 'Comprehensive healthcare management system improving patient care and hospital operations efficiency.',
    summaryAr: 'نظام إدارة رعاية صحية شامل يحسن رعاية المرضى وكفاءة عمليات المستشفى.',
    descriptionEn: 'An integrated healthcare management solution that streamlines patient records, appointment scheduling, medical inventory, and clinical workflows while ensuring HIPAA compliance.',
    descriptionAr: 'حل إدارة رعاية صحية متكامل يبسط سجلات المرضى وجدولة المواعيد والمخزون الطبي وسير العمل السريري مع ضمان الامتثال لمعايير HIPAA.',
    challengeEn: 'The hospital needed to modernize legacy systems while maintaining patient data security and integrating with various medical equipment and third-party services.',
    challengeAr: 'احتاج المستشفى إلى تحديث الأنظمة القديمة مع الحفاظ على أمان بيانات المرضى والتكامل مع مختلف الأجهزة الطبية والخدمات الخارجية.',
    solutionEn: 'We developed a modular healthcare platform with electronic health records, telemedicine capabilities, inventory management, and comprehensive reporting tools.',
    solutionAr: 'طورنا منصة رعاية صحية مرنة مع السجلات الصحية الإلكترونية وقدرات الطب عن بعد وإدارة المخزون وأدوات التقارير الشاملة.',
    services: ['Healthcare IT', 'System Integration', 'Data Migration', 'Compliance Implementation'],
    servicesAr: ['تكنولوجيا المعلومات الصحية', 'تكامل الأنظمة', 'ترحيل البيانات', 'تنفيذ الامتثال'],
    duration: '10 months',
    durationAr: '10 أشهر',
    teamSize: 18,
    features: [
      'Electronic Health Records (EHR)',
      'Appointment Management',
      'Telemedicine Platform',
      'Medical Inventory Tracking',
      'Prescription Management',
      'Patient Portal'
    ],
    featuresAr: [
      'السجلات الصحية الإلكترونية',
      'إدارة المواعيد',
      'منصة الطب عن بعد',
      'تتبع المخزون الطبي',
      'إدارة الوصفات الطبية',
      'بوابة المرضى'
    ],
    results: [
      '94% patient satisfaction rate',
      '67% reduction in appointment waiting time',
      '99.9% system uptime',
      '45% improvement in workflow efficiency'
    ],
    resultsAr: [
      '94% معدل رضا المرضى',
      '67% انخفاض في وقت انتظار المواعيد',
      '99.9% وقت تشغيل النظام',
      '45% تحسن في كفاءة سير العمل'
    ]
  },
  {
    slug: 'fintech-mobile-app',
    title: 'Digital Banking App - Saudi Bank',
    titleAr: 'تطبيق البنكية الرقمية - البنك السعودي',
    client: 'Saudi Bank',
    clientAr: 'البنك السعودي',
    sector: 'Finance',
    sectorAr: 'مالي',
    year: 2024,
    status: 'published',
    kpis: [
      {
        id: 'transaction_volume',
        label: 'Daily Transactions',
        labelAr: 'المعاملات اليومية',
        value: '2.5M',
        description: 'Average daily transaction volume',
        descriptionAr: 'متوسط حجم المعاملات اليومية',
        icon: 'CreditCard',
        trend: 'up'
      },
      {
        id: 'security_score',
        label: 'Security Score',
        labelAr: 'نقاط الأمان',
        value: '99.8%',
        description: 'Security compliance and fraud prevention',
        descriptionAr: 'الامتثال الأمني ومنع الاحتيال',
        icon: 'Shield',
        trend: 'up'
      },
      {
        id: 'app_rating',
        label: 'App Store Rating',
        labelAr: 'تقييم متجر التطبيقات',
        value: '4.8/5',
        description: 'Average rating across app stores',
        descriptionAr: 'متوسط التقييم عبر متاجر التطبيقات',
        icon: 'Star',
        trend: 'up'
      }
    ],
    tech: ['React Native', 'Node.js', 'MongoDB', 'Blockchain', 'Biometric Auth', 'AWS'],
    coverImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
    gallery: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=800&fit=crop',
        alt: 'Mobile banking app interface',
        altAr: 'واجهة تطبيق البنكية المحمولة',
        type: 'image'
      }
    ],
    summaryEn: 'Next-generation mobile banking application with advanced security features and seamless user experience.',
    summaryAr: 'تطبيق بنكي محمول من الجيل التالي مع ميزات أمان متقدمة وتجربة مستخدم سلسة.',
    descriptionEn: 'A comprehensive digital banking solution offering secure transactions, investment management, and personalized financial insights through an intuitive mobile interface.',
    descriptionAr: 'حل بنكي رقمي شامل يقدم معاملات آمنة وإدارة الاستثمارات ورؤى مالية مخصصة من خلال واجهة محمولة بديهية.',
    challengeEn: 'The bank required a cutting-edge mobile app that could handle millions of transactions while maintaining the highest security standards and regulatory compliance.',
    challengeAr: 'احتاج البنك إلى تطبيق محمول متطور يمكنه التعامل مع ملايين المعاملات مع الحفاظ على أعلى معايير الأمان والامتثال التنظيمي.',
    solutionEn: 'We delivered a feature-rich banking app with biometric authentication, AI-powered fraud detection, real-time notifications, and comprehensive financial management tools.',
    solutionAr: 'قدمنا تطبيقاً بنكياً غنياً بالميزات مع المصادقة البيومترية وكشف الاحتيال المدعوم بالذكاء الاصطناعي والإشعارات في الوقت الفعلي وأدوات الإدارة المالية الشاملة.',
    services: ['Mobile Development', 'Cybersecurity', 'AI Integration', 'Blockchain Implementation'],
    servicesAr: ['تطوير الجوال', 'الأمن السيبراني', 'تكامل الذكاء الاصطناعي', 'تنفيذ البلوك تشين'],
    duration: '14 months',
    durationAr: '14 شهر',
    teamSize: 22,
    features: [
      'Biometric Authentication',
      'Real-time Transaction Monitoring',
      'Investment Portfolio Management',
      'AI-powered Financial Insights',
      'Contactless Payments',
      'Multi-currency Support'
    ],
    featuresAr: [
      'المصادقة البيومترية',
      'مراقبة المعاملات في الوقت الفعلي',
      'إدارة محفظة الاستثمار',
      'الرؤى المالية المدعومة بالذكاء الاصطناعي',
      'المدفوعات اللاتلامسية',
      'دعم متعدد العملات'
    ],
    results: [
      '2.5M daily transactions processed',
      '99.8% security compliance score',
      '4.8/5 average app store rating',
      '89% customer adoption rate'
    ],
    resultsAr: [
      '2.5 مليون معاملة يومية تتم معالجتها',
      '99.8% نقاط الامتثال الأمني',
      '4.8/5 متوسط تقييم متجر التطبيقات',
      '89% معدل تبني العملاء'
    ]
  },
  {
    slug: 'logistics-optimization-platform',
    title: 'Smart Logistics Platform - Aramex Saudi',
    titleAr: 'منصة اللوجستيات الذكية - أرامكس السعودية',
    client: 'Aramex Saudi',
    clientAr: 'أرامكس السعودية',
    sector: 'Logistics',
    sectorAr: 'لوجستيات',
    year: 2023,
    status: 'published',
    kpis: [
      {
        id: 'delivery_efficiency',
        label: 'Delivery Efficiency',
        labelAr: 'كفاءة التسليم',
        value: '43%',
        description: 'Improvement in delivery time optimization',
        descriptionAr: 'تحسن في تحسين وقت التسليم',
        icon: 'Truck',
        trend: 'up'
      },
      {
        id: 'cost_reduction',
        label: 'Operational Costs',
        labelAr: 'التكاليف التشغيلية',
        value: '28%',
        description: 'Reduction in operational expenses',
        descriptionAr: 'انخفاض في المصاريف التشغيلية',
        icon: 'DollarSign',
        trend: 'down'
      },
      {
        id: 'tracking_accuracy',
        label: 'Tracking Accuracy',
        labelAr: 'دقة التتبع',
        value: '99.5%',
        description: 'Real-time package tracking precision',
        descriptionAr: 'دقة تتبع الطرود في الوقت الفعلي',
        icon: 'MapPin',
        trend: 'up'
      }
    ],
    tech: ['Flutter', 'Django', 'PostgreSQL', 'Redis', 'Google Maps API', 'IoT Sensors'],
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
    gallery: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop',
        alt: 'Logistics platform dashboard',
        altAr: 'لوحة معلومات منصة اللوجستيات',
        type: 'image'
      }
    ],
    summaryEn: 'AI-powered logistics optimization platform streamlining supply chain operations and delivery management.',
    summaryAr: 'منصة تحسين اللوجستيات المدعومة بالذكاء الاصطناعي لتبسيط عمليات سلسلة التوريد وإدارة التسليم.',
    descriptionEn: 'An intelligent logistics management system that optimizes route planning, tracks shipments in real-time, and provides predictive analytics for supply chain efficiency.',
    descriptionAr: 'نظام إدارة لوجستيات ذكي يحسن تخطيط المسارات ويتتبع الشحنات في الوقت الفعلي ويوفر التحليلات التنبؤية لكفاءة سلسلة التوريد.',
    challengeEn: 'Aramex needed to optimize complex delivery routes across Saudi Arabia while providing real-time visibility and reducing operational costs.',
    challengeAr: 'احتاجت أرامكس إلى تحسين مسارات التسليم المعقدة عبر المملكة العربية السعودية مع توفير الرؤية في الوقت الفعلي وتقليل التكاليف التشغيلية.',
    solutionEn: 'We developed an AI-driven platform with machine learning algorithms for route optimization, IoT integration for real-time tracking, and predictive maintenance capabilities.',
    solutionAr: 'طورنا منصة مدعومة بالذكاء الاصطناعي مع خوارزميات التعلم الآلي لتحسين المسارات وتكامل إنترنت الأشياء للتتبع في الوقت الفعلي وقدرات الصيانة التنبؤية.',
    services: ['AI Development', 'IoT Integration', 'Mobile Applications', 'Data Analytics'],
    servicesAr: ['تطوير الذكاء الاصطناعي', 'تكامل إنترنت الأشياء', 'تطبيقات الجوال', 'تحليل البيانات'],
    duration: '9 months',
    durationAr: '9 أشهر',
    teamSize: 14,
    features: [
      'AI Route Optimization',
      'Real-time GPS Tracking',
      'Predictive Analytics',
      'Automated Dispatch System',
      'Customer Notification System',
      'Performance Dashboard'
    ],
    featuresAr: [
      'تحسين المسار بالذكاء الاصطناعي',
      'تتبع GPS في الوقت الفعلي',
      'التحليلات التنبؤية',
      'نظام الإرسال الآلي',
      'نظام إشعارات العملاء',
      'لوحة معلومات الأداء'
    ],
    results: [
      '43% improvement in delivery efficiency',
      '28% reduction in operational costs',
      '99.5% tracking accuracy',
      '35% increase in customer satisfaction'
    ],
    resultsAr: [
      '43% تحسن في كفاءة التسليم',
      '28% انخفاض في التكاليف التشغيلية',
      '99.5% دقة التتبع',
      '35% زيادة في رضا العملاء'
    ]
  },
  {
    slug: 'educational-platform-ksu',
    title: 'Smart Learning Management System - KSU',
    titleAr: 'نظام إدارة التعلم الذكي - جامعة الملك سعود',
    client: 'King Saud University',
    clientAr: 'جامعة الملك سعود',
    sector: 'Education',
    sectorAr: 'تعليمي',
    year: 2024,
    status: 'published',
    kpis: [
      {
        id: 'student_engagement',
        label: 'Student Engagement',
        labelAr: 'مشاركة الطلاب',
        value: '87%',
        description: 'Active participation in online learning',
        descriptionAr: 'المشاركة النشطة في التعلم عبر الإنترنت',
        icon: 'Users',
        trend: 'up'
      },
      {
        id: 'course_completion',
        label: 'Course Completion',
        labelAr: 'إتمام الدورات',
        value: '92%',
        description: 'Students completing their courses',
        descriptionAr: 'الطلاب الذين يكملون دوراتهم',
        icon: 'BookOpen',
        trend: 'up'
      },
      {
        id: 'performance_improvement',
        label: 'Performance Boost',
        labelAr: 'تحسن الأداء',
        value: '34%',
        description: 'Average grade improvement',
        descriptionAr: 'متوسط تحسن الدرجات',
        icon: 'TrendingUp',
        trend: 'up'
      }
    ],
    tech: ['Next.js', 'Express.js', 'MongoDB', 'WebRTC', 'Socket.io', 'AWS S3'],
    coverImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop',
    gallery: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&h=800&fit=crop',
        alt: 'Educational platform interface',
        altAr: 'واجهة المنصة التعليمية',
        type: 'image'
      }
    ],
    summaryEn: 'Comprehensive e-learning platform enhancing educational delivery and student engagement at university level.',
    summaryAr: 'منصة تعلم إلكتروني شاملة تعزز التعليم وتفاعل الطلاب على مستوى الجامعة.',
    descriptionEn: 'An advanced learning management system featuring virtual classrooms, AI-powered personalized learning paths, interactive content delivery, and comprehensive progress tracking.',
    descriptionAr: 'نظام إدارة تعلم متقدم يتميز بالفصول الافتراضية ومسارات التعلم المخصصة المدعومة بالذكاء الاصطناعي وتقديم المحتوى التفاعلي وتتبع التقدم الشامل.',
    challengeEn: 'The university needed a scalable platform to support 50,000+ students with diverse learning needs while maintaining high-quality educational standards.',
    challengeAr: 'احتاجت الجامعة إلى منصة قابلة للتوسع لدعم أكثر من 50,000 طالب مع احتياجات تعليمية متنوعة مع الحفاظ على معايير تعليمية عالية الجودة.',
    solutionEn: 'We created a comprehensive LMS with adaptive learning algorithms, integrated video conferencing, automated assessment tools, and analytics for personalized education.',
    solutionAr: 'أنشأنا نظام إدارة تعلم شامل مع خوارزميات التعلم التكيفي والمؤتمرات المرئية المتكاملة وأدوات التقييم الآلي والتحليلات للتعليم المخصص.',
    services: ['E-Learning Solutions', 'Video Streaming', 'AI Implementation', 'System Architecture'],
    servicesAr: ['حلول التعلم الإلكتروني', 'بث الفيديو', 'تنفيذ الذكاء الاصطناعي', 'هندسة الأنظمة'],
    duration: '11 months',
    durationAr: '11 شهر',
    teamSize: 16,
    features: [
      'Virtual Classrooms',
      'AI-Powered Learning Paths',
      'Interactive Content Library',
      'Automated Grading System',
      'Progress Analytics',
      'Mobile Learning App'
    ],
    featuresAr: [
      'الفصول الافتراضية',
      'مسارات التعلم المدعومة بالذكاء الاصطناعي',
      'مكتبة المحتوى التفاعلي',
      'نظام التقييم الآلي',
      'تحليلات التقدم',
      'تطبيق التعلم المحمول'
    ],
    results: [
      '87% student engagement rate',
      '92% course completion rate',
      '34% average performance improvement',
      '95% faculty satisfaction'
    ],
    resultsAr: [
      '87% معدل مشاركة الطلاب',
      '92% معدل إتمام الدورات',
      '34% متوسط تحسن الأداء',
      '95% رضا أعضاء هيئة التدريس'
    ]
  }
];

// Filter options for the portfolio
export const portfolioFilters = {
  industries: [
    { value: '', label: 'All Industries', labelAr: 'جميع الصناعات' },
    { value: 'E-commerce', label: 'E-commerce', labelAr: 'تجارة إلكترونية' },
    { value: 'Government', label: 'Government', labelAr: 'حكومي' },
    { value: 'Healthcare', label: 'Healthcare', labelAr: 'صحي' },
    { value: 'Finance', label: 'Finance', labelAr: 'مالي' },
    { value: 'Logistics', label: 'Logistics', labelAr: 'لوجستيات' },
    { value: 'Education', label: 'Education', labelAr: 'تعليمي' }
  ],
  
  technologies: [
    'React', 'Vue.js', 'Angular', 'Next.js', 'Flutter', 'React Native',
    'Node.js', 'Express.js', 'Laravel', 'Django', 'Spring Boot',
    'PostgreSQL', 'MongoDB', 'MySQL', 'Redis',
    'AWS', 'Azure', 'Docker', 'Kubernetes'
  ],
  
  services: [
    { value: 'Web Development', labelAr: 'تطوير المواقع' },
    { value: 'Mobile Apps', labelAr: 'تطبيقات الجوال' },
    { value: 'System Integration', labelAr: 'تكامل الأنظمة' },
    { value: 'UX/UI Design', labelAr: 'تصميم UX/UI' },
    { value: 'AI Implementation', labelAr: 'تنفيذ الذكاء الاصطناعي' },
    { value: 'Cybersecurity', labelAr: 'الأمن السيبراني' }
  ],
  
  years: [2024, 2023, 2022, 2021],
  
  sortOptions: [
    { value: 'newest', label: 'Newest First', labelAr: 'الأحدث أولاً' },
    { value: 'oldest', label: 'Oldest First', labelAr: 'الأقدم أولاً' },
    { value: 'alphabetical', label: 'Alphabetical', labelAr: 'أبجدياً' },
    { value: 'industry', label: 'By Industry', labelAr: 'حسب الصناعة' }
  ]
};