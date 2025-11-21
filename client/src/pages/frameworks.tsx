import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedCard, AnimatedSection, AnimatedText } from "@/components/ui/animated-card";
import { InteractiveButton } from "@/components/ui/interactive-button";
import { Badge } from "@/components/ui/badge";

export default function Frameworks() {
  const frameworks = [
    {
      id: 1,
      name: "GSC Mobile Kit",
      version: "v2.1.0",
      description: "مكتبة شاملة لتطوير التطبيقات المحمولة بسرعة وكفاءة عالية",
      problem: "تسريع عملية تطوير التطبيقات المحمولة وتوحيد المكونات المشتركة",
      features: [
        "مكونات UI جاهزة للاستخدام",
        "نظام تصميم موحد",
        "دعم RTL كامل",
        "تكامل مع أشهر المكتبات"
      ],
      technologies: ["React Native", "TypeScript", "Expo"],
      status: "stable",
      downloadUrl: "#",
      demoUrl: "#",
      githubUrl: "#",
      icon: "fas fa-mobile-alt"
    },
    {
      id: 2,
      name: "GSC Web Components",
      version: "v1.8.2",
      description: "مجموعة مكونات ويب قابلة لإعادة الاستخدام بتصميم عصري",
      problem: "توحيد تجربة المستخدم عبر جميع المشاريع الويب",
      features: [
        "مكونات قابلة للتخصيص",
        "دعم الوضع المظلم",
        "استجابة كاملة",
        "أداء محسّن"
      ],
      technologies: ["React", "Tailwind CSS", "TypeScript"],
      status: "beta",
      downloadUrl: "#",
      demoUrl: "#",
      githubUrl: "#",
      icon: "fas fa-code"
    },
    {
      id: 3,
      name: "GSC ERP Extensions",
      version: "v1.5.0",
      description: "إضافات مخصصة لتوسيع قدرات ERPNext لتناسب السوق العربي",
      problem: "تخصيص ERPNext ليتماشى مع متطلبات الأعمال في المنطقة العربية",
      features: [
        "تقارير محاسبية محلية",
        "دعم الضرائب الإقليمية",
        "واجهات عربية محسنة",
        "تكامل مع البنوك المحلية"
      ],
      technologies: ["Python", "Frappe", "JavaScript"],
      status: "stable",
      downloadUrl: "#",
      demoUrl: "#",
      githubUrl: "#",
      icon: "fas fa-cogs"
    },
    {
      id: 4,
      name: "GSC Analytics Dashboard",
      version: "v0.9.1",
      description: "لوحة تحكم تحليلية شاملة للمشاريع الرقمية",
      problem: "توفير رؤى شاملة وتحليلات متقدمة بطريقة بصرية واضحة",
      features: [
        "رسوم بيانية تفاعلية",
        "تقارير قابلة للتخصيص",
        "تحديث البيانات في الوقت الفعلي",
        "تصدير متعدد الصيغ"
      ],
      technologies: ["Vue.js", "D3.js", "Node.js"],
      status: "alpha",
      downloadUrl: "#",
      demoUrl: "#",
      githubUrl: "#",
      icon: "fas fa-chart-line"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stable":
        return "bg-green-100 text-green-800 border-green-200";
      case "beta":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "alpha":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-light py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText delay={0.2} className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-secondary mb-6 leading-tight">
              مختبر الأطر والأدوات
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              نطور أدواتنا وأطرنا الخاصة لتسريع عملية التطوير وتحسين جودة المنتجات
            </p>
          </AnimatedText>
        </div>
      </section>

      {/* Frameworks Grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText delay={0.3} className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
              أطرنا المفتوحة المصدر
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              مجموعة من الأدوات والمكتبات التي طورناها لتسهيل عملية البناء
            </p>
          </AnimatedText>

          <div className="grid md:grid-cols-2 gap-8">
            {frameworks.map((framework, index) => (
              <AnimatedCard
                key={framework.id}
                delay={index * 0.1}
                className="p-8 card-hover"
              >
                <CardContent className="p-0">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                      <div className="text-primary text-4xl ml-4">
                        <i className={framework.icon}></i>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-secondary mb-2">
                          {framework.name}
                        </h3>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-sm">
                            {framework.version}
                          </Badge>
                          <Badge
                            className={`text-sm ${getStatusColor(framework.status)}`}
                          >
                            {framework.status === "stable"
                              ? "مستقر"
                              : framework.status === "beta"
                              ? "تجريبي"
                              : "تطويري"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {framework.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-bold text-secondary mb-3">
                      المشكلة التي يحلها:
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {framework.problem}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-secondary mb-3">الميزات الرئيسية:</h4>
                    <ul className="space-y-2">
                      {framework.features.map((feature, idx) => (
                        <li key={idx} className="text-gray-600 text-sm flex items-center">
                          <i className="fas fa-check-circle text-primary ml-2"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-8">
                    <h4 className="font-bold text-secondary mb-3">التقنيات المستخدمة:</h4>
                    <div className="flex flex-wrap gap-2">
                      {framework.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <InteractiveButton
                      className="btn-primary flex-1"
                      icon={<i className="fas fa-eye"></i>}
                    >
                      عرض تفاعلي
                    </InteractiveButton>
                    <InteractiveButton
                      variant="outline"
                      className="btn-secondary flex-1"
                      icon={<i className="fas fa-download"></i>}
                    >
                      تحميل
                    </InteractiveButton>
                    <InteractiveButton
                      variant="ghost"
                      icon={<i className="fab fa-github"></i>}
                    >
                      GitHub
                    </InteractiveButton>
                  </div>
                </CardContent>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* R&D Section */}
      <section className="py-16 lg:py-24 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0.4}>
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
                قسم البحث والتطوير
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                نستثمر في البحث والتطوير لإنشاء حلول مبتكرة تخدم مجتمع التطوير
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "fas fa-flask",
                  title: "تجريب التقنيات الجديدة",
                  description:
                    "نختبر أحدث التقنيات والأدوات لضمان استخدام أفضل الحلول المتاحة",
                },
                {
                  icon: "fas fa-users",
                  title: "التعاون مع المجتمع",
                  description:
                    "نعمل مع مطورين من جميع أنحاء العالم لتطوير حلول مفتوحة المصدر",
                },
                {
                  icon: "fas fa-rocket",
                  title: "الابتكار المستمر",
                  description:
                    "نسعى لإيجاد طرق جديدة لحل المشاكل التقنية وتحسين تجربة التطوير",
                },
              ].map((item, index) => (
                <AnimatedCard key={index} delay={index * 0.1} className="p-6 text-center">
                  <CardContent className="p-0">
                    <div className="text-primary text-4xl mb-4">
                      <i className={item.icon}></i>
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </AnimatedCard>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contributing Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection delay={0.5}>
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
              ساهم معنا في التطوير
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              نرحب بمساهمات المطورين والمصممين لتطوير هذه الأدوات وجعلها أكثر فائدة للمجتمع
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <InteractiveButton
                className="btn-primary"
                icon={<i className="fab fa-github"></i>}
              >
                استعرض المشاريع على GitHub
              </InteractiveButton>
              <InteractiveButton
                variant="outline"
                className="btn-secondary"
                icon={<i className="fas fa-envelope"></i>}
              >
                تواصل معنا
              </InteractiveButton>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}