import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/i18n/lang";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Zap,
  Shield,
  Globe,
  BarChart3,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  Factory,
  FileText,
  Building,
  Smartphone,
  Cloud,
  Server,
  Database,
  Award,
  Star,
  CheckCircle,
  ArrowRight,
  Settings,
  Target,
  TrendingUp,
  Layers,
  Workflow,
  MessageSquare,
  Clock,
  Bot,
  HeadphonesIcon,
  CreditCard,
  Calculator,
  ChevronDown,
  Phone,
  Mail
} from "lucide-react";

export default function ERPNextV15Section() {
  const { dir, lang } = useLanguage();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [leadFormData, setLeadFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    industry: "",
    deploymentOption: "",
    message: ""
  });

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the lead data to your backend
    // For now, we'll just show a success message
    
    toast({
      title: lang === 'ar' ? "تم إرسال طلبك بنجاح!" : "Request submitted successfully!",
      description: lang === 'ar' 
        ? "سيتواصل معك فريقنا خلال 24 ساعة"
        : "Our team will contact you within 24 hours",
    });

    // Reset form
    setLeadFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      industry: "",
      deploymentOption: "",
      message: ""
    });
  };

  const scrollToLeadForm = () => {
    const element = document.getElementById('erpnext-lead-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const erpModules = [
    {
      icon: DollarSign,
      titleAr: "الحسابات",
      titleEn: "Accounts",
      descAr: "إدارة شاملة للمحاسبة والتقارير المالية",
      descEn: "Comprehensive accounting and financial reporting"
    },
    {
      icon: ShoppingCart,
      titleAr: "المبيعات",
      titleEn: "Selling",
      descAr: "إدارة دورة المبيعات من العروض إلى الفواتير",
      descEn: "Manage sales cycle from quotes to invoices"
    },
    {
      icon: Package,
      titleAr: "المشتريات",
      titleEn: "Buying",
      descAr: "إدارة الموردين وطلبات الشراء والاستلام",
      descEn: "Supplier management and purchase orders"
    },
    {
      icon: Package,
      titleAr: "المخزون",
      titleEn: "Stock",
      descAr: "تتبع المخزون والمستودعات والحركات",
      descEn: "Inventory tracking and warehouse management"
    },
    {
      icon: Factory,
      titleAr: "التصنيع",
      titleEn: "Manufacturing",
      descAr: "إدارة الإنتاج وأوامر العمل والجودة",
      descEn: "Production management and quality control"
    },
    {
      icon: FileText,
      titleAr: "المشاريع والمهام",
      titleEn: "Projects & Tasks",
      descAr: "إدارة المشاريع والمهام والجدولة",
      descEn: "Project management and task scheduling"
    },
    {
      icon: Users,
      titleAr: "الموارد البشرية والرواتب",
      titleEn: "HR & Payroll",
      descAr: "إدارة الموظفين والرواتب والحضور",
      descEn: "Employee management and payroll processing"
    },
    {
      icon: HeadphonesIcon,
      titleAr: "الدعم/Helpdesk",
      titleEn: "Support/Helpdesk",
      descAr: "نظام تذاكر الدعم وخدمة العملاء",
      descEn: "Support ticketing and customer service"
    },
    {
      icon: CreditCard,
      titleAr: "الاشتراكات والفوترة",
      titleEn: "Subscriptions & Billing",
      descAr: "إدارة الاشتراكات والفوترة الدورية",
      descEn: "Subscription management and recurring billing"
    },
    {
      icon: Calculator,
      titleAr: "الضرائب والتقارير",
      titleEn: "Taxes & Reports",
      descAr: "إدارة الضرائب والتقارير المالية",
      descEn: "Tax management and financial reports"
    }
  ];

  const useCases = [
    {
      titleAr: "تجزئة/جملة",
      titleEn: "Retail/Wholesale",
      descAr: "إدارة شاملة للمتاجر والمبيعات بالجملة",
      descEn: "Comprehensive retail and wholesale management"
    },
    {
      titleAr: "تصنيع خفيف",
      titleEn: "Light Manufacturing",
      descAr: "حلول مرنة للصناعات التصنيعية الصغيرة والمتوسطة",
      descEn: "Flexible solutions for small to medium manufacturing"
    },
    {
      titleAr: "خدمات وصيانة",
      titleEn: "Field Services",
      descAr: "إدارة الخدمات الميدانية وأعمال الصيانة",
      descEn: "Field service and maintenance management"
    },
    {
      titleAr: "توزيع ولوجستيات",
      titleEn: "Distribution & Logistics",
      descAr: "إدارة سلاسل التوريد والتوزيع",
      descEn: "Supply chain and distribution management"
    }
  ];

  const deploymentOptions = [
    {
      titleAr: "محلي (On-Premise)",
      titleEn: "On-Premise",
      descAr: "تحكم كامل، أمان عالي، تكلفة صيانة أعلى",
      descEn: "Full control, high security, higher maintenance cost"
    },
    {
      titleAr: "سحابي (Cloud)",
      titleEn: "Cloud",
      descAr: "سهولة النشر، تكلفة أقل، صيانة مُدارة",
      descEn: "Easy deployment, lower cost, managed maintenance"
    },
    {
      titleAr: "هجين (Hybrid)",
      titleEn: "Hybrid",
      descAr: "مرونة القطع، أمان البيانات الحساسة",
      descEn: "Flexible deployment, sensitive data security"
    }
  ];

  const packages = [
    {
      id: "basic",
      titleAr: "الباقة الأساسية",
      titleEn: "Basic Package",
      descAr: "مناسبة للشركات الناشئة والصغيرة",
      descEn: "Perfect for startups and small businesses",
      icon: Building,
      featuresAr: [
        "إعداد أساسي",
        "المحاسبة والمبيعات والمشتريات والمخزون",
        "تدريب أساسي",
        "دعم فني لمدة شهر"
      ],
      featuresEn: [
        "Standard setup",
        "Accounts/Selling/Buying/Stock",
        "Basic training",
        "1 month technical support"
      ]
    },
    {
      id: "pro",
      titleAr: "الباقة الاحترافية",
      titleEn: "Pro Package",
      descAr: "للشركات المتوسطة مع تخصيصات معتدلة",
      descEn: "For medium businesses with moderate customizations",
      icon: Star,
      popular: true,
      featuresAr: [
        "تخصيصات معتدلة",
        "سير العمل المخصص",
        "تقارير إضافية",
        "تكاملات محدودة",
        "تدريب مُمدد"
      ],
      featuresEn: [
        "Moderate customizations",
        "Custom workflows",
        "Extra reports",
        "Limited integrations",
        "Extended training"
      ]
    },
    {
      id: "enterprise",
      titleAr: "باقة المؤسسات",
      titleEn: "Enterprise Package",
      descAr: "للمؤسسات الكبيرة مع متطلبات متقدمة",
      descEn: "For large enterprises with advanced requirements",
      icon: Award,
      featuresAr: [
        "تخصيصات عميقة",
        "تكاملات متعددة",
        "ذكاء الأعمال",
        "أمان متقدم",
        "دعم أولوية"
      ],
      featuresEn: [
        "Deep customizations",
        "Multiple integrations",
        "Business Intelligence",
        "Advanced security",
        "Priority support"
      ]
    }
  ];

  const addOns = [
    {
      titleAr: "تطبيق الموظفين المحمول",
      titleEn: "Employee Mobile App"
    },
    {
      titleAr: "بوابة العملاء",
      titleEn: "Customer Portal"
    },
    {
      titleAr: "نماذج طباعة مخصصة",
      titleEn: "Custom Print Formats"
    },
    {
      titleAr: "أتمتة WhatsApp/SMS",
      titleEn: "WhatsApp/SMS Automations"
    },
    {
      titleAr: "تقارير ذكاء الأعمال",
      titleEn: "BI Reports"
    }
  ];

  const migrationSteps = [
    {
      titleAr: "تحليل المتطلبات",
      titleEn: "Requirements Analysis",
      descAr: "دراسة شاملة للأنظمة الحالية والمتطلبات",
      descEn: "Comprehensive study of current systems and requirements"
    },
    {
      titleAr: "الإعداد وربط البيانات",
      titleEn: "Setup & Data Mapping",
      descAr: "إعداد النظام وتحديد كيفية ربط البيانات",
      descEn: "System setup and data mapping configuration"
    },
    {
      titleAr: "النقل والاختبار",
      titleEn: "Migration & Testing",
      descAr: "نقل البيانات واختبار شامل للنظام",
      descEn: "Data migration and comprehensive system testing"
    },
    {
      titleAr: "التدريب والتشغيل",
      titleEn: "Training & Go-Live",
      descAr: "تدريب المستخدمين وبدء التشغيل الفعلي",
      descEn: "User training and production go-live"
    }
  ];

  const faqItems = [
    {
      questionAr: "ما هو الوقت المتوقع للتنفيذ؟",
      questionEn: "What is the expected implementation time?",
      answerAr: "عادة من 4 إلى 12 أسبوع حسب حجم الشركة ومتطلبات التخصيص",
      answerEn: "Typically 4 to 12 weeks depending on company size and customization requirements"
    },
    {
      questionAr: "كيف ننقل البيانات من النظام الحالي؟",
      questionEn: "How do we migrate data from current system?",
      answerAr: "نقوم بتحليل البيانات الحالية وإعداد أدوات نقل مخصصة لضمان نقل آمن ودقيق",
      answerEn: "We analyze current data and prepare custom migration tools to ensure safe and accurate transfer"
    },
    {
      questionAr: "ما مستوى الأمان والنسخ الاحتياطية؟",
      questionEn: "What about security and backups?",
      answerAr: "نوفر تشفير متقدم ونسخ احتياطية تلقائية مع إمكانية الاسترجاع الفوري",
      answerEn: "We provide advanced encryption and automated backups with instant recovery capabilities"
    },
    {
      questionAr: "التراخيص والتحديثات؟",
      questionEn: "Licensing and updates?",
      answerAr: "ERPNext مفتوح المصدر مع تحديثات منتظمة وبدون رسوم تراخيص إضافية",
      answerEn: "ERPNext is open source with regular updates and no additional licensing fees"
    },
    {
      questionAr: "التكامل مع الأنظمة الحالية؟",
      questionEn: "Integration with current systems?",
      answerAr: "نوفر APIs قوية وأدوات تكامل للربط مع جميع الأنظمة الخارجية",
      answerEn: "We provide powerful APIs and integration tools to connect with all external systems"
    },
    {
      questionAr: "التدريب بعد الإطلاق؟",
      questionEn: "Post-launch training?",
      answerAr: "تدريب شامل للمستخدمين مع دورات متقدمة ومواد تعليمية مستمرة",
      answerEn: "Comprehensive user training with advanced courses and ongoing educational materials"
    },
    {
      questionAr: "الدعم الفني وSLA؟",
      questionEn: "Technical support & SLA?",
      answerAr: "دعم فني 24/7 مع اتفاقيات خدمة مضمونة ومستويات استجابة سريعة",
      answerEn: "24/7 technical support with guaranteed service agreements and fast response times"
    },
    {
      questionAr: "محلي مقابل سحابي؟",
      questionEn: "On-prem vs. cloud?",
      answerAr: "نوفر كلا الخيارين حسب متطلبات الأمان والميزانية والبنية التحتية",
      answerEn: "We offer both options based on security requirements, budget, and infrastructure needs"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" dir={dir}>
      
      {/* ERPNext v15 Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:32px_32px] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-600/5" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              className="text-4xl lg:text-6xl font-bold text-brand-text-primary mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {lang === 'ar' 
                ? "حوِّل عملياتك مع ERPNext v15 — نظام ERP مرن، شامل، مفتوح المصدر"
                : "Transform Your Operations with ERPNext v15 — Flexible, Comprehensive, Open-Source ERP"
              }
            </motion.h1>
            
            <motion.p
              className="text-xl text-brand-text-secondary mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {lang === 'ar'
                ? "حلّ ERP متكامل للمحاسبة والمبيعات والمشتريات والمخزون والتصنيع والموارد البشرية والمشاريع، قابل للتخصيص وسريع النشر وبكلفة تنافسية"
                : "A full-stack ERP for Accounting, Sales, Buying, Inventory, Manufacturing, HR, and Projects—customizable, fast to deploy, and cost-effective"
              }
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                onClick={scrollToLeadForm}
                className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl text-lg font-semibold"
                size="lg"
              >
                {lang === 'ar' ? 'اطلب عرضًا توضيحيًا' : 'Request a Demo'}
              </Button>
              <Button
                onClick={scrollToLeadForm}
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-xl text-lg font-semibold"
                size="lg"
              >
                {lang === 'ar' ? 'اطلب عرض سعر' : 'Get a Quote'}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-text-primary mb-6">
              {lang === 'ar' ? 'نظرة عامة على ERPNext v15' : 'ERPNext v15 Overview'}
            </h2>
            <p className="text-lg text-brand-text-secondary">
              {lang === 'ar'
                ? "ERPNext v15 يوفّر نواة مالية قوية، سلاسل إمداد واضحة، وأدوات تصنيع ومشاريع واشتراكات. تملّك بياناتك، وخصّص نماذج الطباعة والتقارير وسير العمل، وانشر محليًا أو على السحابة."
                : "ERPNext v15 provides a solid financial core, clear supply chains, and tools for manufacturing, projects, and subscriptions. Own your data, tailor print formats, reports, and workflows, and deploy on-prem or in the cloud."
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-text-primary mb-4">
              {lang === 'ar' ? 'الوحدات والمميزات' : 'Modules & Features'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {erpModules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <module.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <CardTitle className="text-lg font-semibold">
                      {lang === 'ar' ? module.titleAr : module.titleEn}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-brand-text-secondary text-center">
                      {lang === 'ar' ? module.descAr : module.descEn}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-text-primary mb-4">
              {lang === 'ar' ? 'حالات الاستخدام' : 'Use Cases'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {lang === 'ar' ? useCase.titleAr : useCase.titleEn}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-brand-text-secondary">
                      {lang === 'ar' ? useCase.descAr : useCase.descEn}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment Options Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-text-primary mb-4">
              {lang === 'ar' ? 'خيارات النشر' : 'Deployment Options'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deploymentOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-center">
                      {lang === 'ar' ? option.titleAr : option.titleEn}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-brand-text-secondary text-center">
                      {lang === 'ar' ? option.descAr : option.descEn}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-text-primary mb-4">
              {lang === 'ar' ? 'التكاملات' : 'Integrations'}
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-brand-text-primary">
                  {lang === 'ar' ? 'بوابات الدفع' : 'Payment Gateways'}
                </h3>
                <ul className="space-y-2 text-brand-text-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Stripe, PayPal, Razorpay
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-brand-text-primary">
                  {lang === 'ar' ? 'التواصل والإشعارات' : 'Communication & Notifications'}
                </h3>
                <ul className="space-y-2 text-brand-text-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    WhatsApp/SMS/Email {lang === 'ar' ? 'إشعارات' : 'notifications'}
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-brand-text-primary">
                  {lang === 'ar' ? 'تبادل البيانات' : 'Data Exchange'}
                </h3>
                <ul className="space-y-2 text-brand-text-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    API/Webhooks {lang === 'ar' ? 'لتبادل البيانات' : 'for data exchange'}
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-brand-text-primary">
                  {lang === 'ar' ? 'التوصيل والخرائط' : 'Delivery & Maps'}
                </h3>
                <ul className="space-y-2 text-brand-text-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {lang === 'ar' ? 'خرائط وتحسين المسارات للتوصيل' : 'Maps/Route optimization for delivery'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Migration, Training, and Support Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-text-primary mb-4">
              {lang === 'ar' ? 'النقل والتدريب والدعم' : 'Migration, Training, and Support'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {migrationSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader className="text-center">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">
                      {index + 1}
                    </div>
                    <CardTitle className="text-lg">
                      {lang === 'ar' ? step.titleAr : step.titleEn}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-brand-text-secondary text-center">
                      {lang === 'ar' ? step.descAr : step.descEn}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-6 text-brand-text-primary">
              {lang === 'ar' ? 'مستويات الدعم' : 'Support Tiers'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {lang === 'ar' ? 'أساسي' : 'Basic'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-brand-text-secondary">
                    {lang === 'ar' ? 'دعم فني عادي' : 'Standard technical support'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {lang === 'ar' ? 'احترافي' : 'Pro'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-brand-text-secondary">
                    {lang === 'ar' ? 'دعم فني مع SLA محددة' : 'Technical support with defined SLA'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {lang === 'ar' ? 'مؤسسي' : 'Enterprise'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-brand-text-secondary">
                    {lang === 'ar' ? 'دعم أولوية 24/7' : '24/7 priority support'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-text-primary mb-4">
              {lang === 'ar' ? 'الباقات' : 'Packages'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className={cn(
                  "h-full relative",
                  pkg.popular && "border-2 border-primary shadow-lg scale-105"
                )}>
                  {pkg.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white">
                      {lang === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center">
                    <pkg.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-xl">
                      {lang === 'ar' ? pkg.titleAr : pkg.titleEn}
                    </CardTitle>
                    <p className="text-brand-text-secondary">
                      {lang === 'ar' ? pkg.descAr : pkg.descEn}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {(lang === 'ar' ? pkg.featuresAr : pkg.featuresEn).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={scrollToLeadForm}
                      className="w-full"
                      variant={pkg.popular ? "default" : "outline"}
                    >
                      {lang === 'ar' ? 'اطلب عرض سعر' : 'Request a Quote'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-text-primary mb-4">
              {lang === 'ar' ? 'الإضافات' : 'Add-Ons'}
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 gap-4">
              {addOns.map((addon, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                >
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-brand-text-primary">
                    {lang === 'ar' ? addon.titleAr : addon.titleEn}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why ERPNext v15 Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-text-primary mb-4">
              {lang === 'ar' ? 'لماذا ERPNext v15؟' : 'Why ERPNext v15?'}
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-primary" />
                  <span className="text-lg font-semibold text-brand-text-primary">
                    {lang === 'ar' ? 'تنفيذ سريع' : 'Fast Implementation'}
                  </span>
                </div>
                <p className="text-brand-text-secondary">
                  {lang === 'ar' 
                    ? "نشر أسرع من الأنظمة التقليدية مع إعداد مبسط"
                    : "Faster deployment than traditional ERPs with simplified setup"
                  }
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-primary" />
                  <span className="text-lg font-semibold text-brand-text-primary">
                    {lang === 'ar' ? 'تخصيص مرن' : 'Flexible Customization'}
                  </span>
                </div>
                <p className="text-brand-text-secondary">
                  {lang === 'ar' 
                    ? "إمكانيات تخصيص واسعة بدون قيود تقنية"
                    : "Extensive customization capabilities without technical limitations"
                  }
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <span className="text-lg font-semibold text-brand-text-primary">
                    {lang === 'ar' ? 'تكلفة ملكية منخفضة' : 'Low TCO'}
                  </span>
                </div>
                <p className="text-brand-text-secondary">
                  {lang === 'ar' 
                    ? "تكلفة إجمالية أقل للملكية مقارنة بالبدائل"
                    : "Lower total cost of ownership compared to alternatives"
                  }
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary" />
                  <span className="text-lg font-semibold text-brand-text-primary">
                    {lang === 'ar' ? 'ملكية البيانات' : 'Data Ownership'}
                  </span>
                </div>
                <p className="text-brand-text-secondary">
                  {lang === 'ar' 
                    ? "تحكم كامل في بياناتك وحرية النشر"
                    : "Full control over your data and deployment freedom"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-text-primary mb-4">
              {lang === 'ar' ? 'شهادات العملاء' : 'Client Testimonials'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardTitle className="text-lg">
                      {lang === 'ar' ? `شركة عميل ${i}` : `Client Company ${i}`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-brand-text-secondary italic">
                      {lang === 'ar' 
                        ? "شهادة عميل نموذجية ستتم إضافتها لاحقاً مع المحتوى الحقيقي"
                        : "Sample client testimonial to be replaced later with real content"
                      }
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-text-primary mb-4">
              {lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {lang === 'ar' ? faq.questionAr : faq.questionEn}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-brand-text-secondary">
                      {lang === 'ar' ? faq.answerAr : faq.answerEn}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 border-t shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-4 justify-center items-center">
            <Button
              onClick={scrollToLeadForm}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2"
            >
              {lang === 'ar' ? 'اطلب عرضًا توضيحيًا' : 'Request a Demo'}
            </Button>
            <Button
              onClick={scrollToLeadForm}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white px-6 py-2"
            >
              {lang === 'ar' ? 'اطلب عرض سعر' : 'Get a Quote'}
            </Button>
          </div>
        </div>
      </div>

      {/* Lead Form Section */}
      <section id="erpnext-lead-form" className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-text-primary mb-4">
              {lang === 'ar' ? 'احصل على عرض مخصص' : 'Get a Custom Quote'}
            </h2>
            <p className="text-lg text-brand-text-secondary">
              {lang === 'ar' 
                ? "املأ النموذج وسيتواصل معك فريقنا خلال 24 ساعة"
                : "Fill out the form and our team will contact you within 24 hours"
              }
            </p>
          </motion.div>

          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleLeadSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-brand-text-primary font-medium">
                        {lang === 'ar' ? 'الاسم *' : 'Name *'}
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={leadFormData.name}
                        onChange={(e) => setLeadFormData({...leadFormData, name: e.target.value})}
                        className="mt-2"
                        placeholder={lang === 'ar' ? 'اسمك الكامل' : 'Your full name'}
                      />
                    </div>

                    <div>
                      <Label htmlFor="company" className="text-brand-text-primary font-medium">
                        {lang === 'ar' ? 'الشركة *' : 'Company *'}
                      </Label>
                      <Input
                        id="company"
                        type="text"
                        required
                        value={leadFormData.company}
                        onChange={(e) => setLeadFormData({...leadFormData, company: e.target.value})}
                        className="mt-2"
                        placeholder={lang === 'ar' ? 'اسم الشركة' : 'Company name'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email" className="text-brand-text-primary font-medium">
                        {lang === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={leadFormData.email}
                        onChange={(e) => setLeadFormData({...leadFormData, email: e.target.value})}
                        className="mt-2"
                        placeholder={lang === 'ar' ? 'your@email.com' : 'your@email.com'}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-brand-text-primary font-medium">
                        {lang === 'ar' ? 'الهاتف' : 'Phone'}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={leadFormData.phone}
                        onChange={(e) => setLeadFormData({...leadFormData, phone: e.target.value})}
                        className="mt-2"
                        placeholder={lang === 'ar' ? '+967 735158003' : '+967 735158003'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="industry" className="text-brand-text-primary font-medium">
                        {lang === 'ar' ? 'القطاع/حجم الشركة' : 'Industry/Size'}
                      </Label>
                      <Select 
                        value={leadFormData.industry} 
                        onValueChange={(value) => setLeadFormData({...leadFormData, industry: value})}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder={lang === 'ar' ? 'اختر القطاع' : 'Select industry'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail">{lang === 'ar' ? 'تجارة التجزئة' : 'Retail'}</SelectItem>
                          <SelectItem value="manufacturing">{lang === 'ar' ? 'التصنيع' : 'Manufacturing'}</SelectItem>
                          <SelectItem value="services">{lang === 'ar' ? 'الخدمات' : 'Services'}</SelectItem>
                          <SelectItem value="distribution">{lang === 'ar' ? 'التوزيع' : 'Distribution'}</SelectItem>
                          <SelectItem value="other">{lang === 'ar' ? 'أخرى' : 'Other'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="deployment" className="text-brand-text-primary font-medium">
                        {lang === 'ar' ? 'خيار النشر المفضل' : 'Preferred Deployment'}
                      </Label>
                      <Select 
                        value={leadFormData.deploymentOption} 
                        onValueChange={(value) => setLeadFormData({...leadFormData, deploymentOption: value})}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder={lang === 'ar' ? 'اختر النشر' : 'Select deployment'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cloud">{lang === 'ar' ? 'سحابي' : 'Cloud'}</SelectItem>
                          <SelectItem value="onpremise">{lang === 'ar' ? 'محلي' : 'On-Premise'}</SelectItem>
                          <SelectItem value="hybrid">{lang === 'ar' ? 'هجين' : 'Hybrid'}</SelectItem>
                          <SelectItem value="undecided">{lang === 'ar' ? 'غير محدد' : 'Undecided'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-brand-text-primary font-medium">
                      {lang === 'ar' ? 'رسالة إضافية' : 'Additional Message'}
                    </Label>
                    <Textarea
                      id="message"
                      value={leadFormData.message}
                      onChange={(e) => setLeadFormData({...leadFormData, message: e.target.value})}
                      className="mt-2"
                      rows={4}
                      placeholder={lang === 'ar' ? 'أخبرنا عن متطلباتك الخاصة...' : 'Tell us about your specific requirements...'}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white py-3 text-lg font-semibold"
                    size="lg"
                  >
                    <ArrowRight className={cn(
                      "w-5 h-5 mr-2",
                      dir === 'rtl' && "rotate-180 mr-0 ml-2"
                    )} />
                    {lang === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Add some padding at the bottom to account for sticky CTA */}
      <div className="h-20"></div>
    </div>
  );
}