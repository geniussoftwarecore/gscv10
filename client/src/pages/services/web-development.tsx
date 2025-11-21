import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/lang";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Globe, 
  ArrowRight, 
  CheckCircle, 
  Upload, 
  FileText,
  Users,
  Zap,
  Shield,
  Rocket,
  Building,
  ShoppingBag,
  GraduationCap,
  Palette,
  Newspaper,
  Monitor,
  Smartphone,
  User,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  MessageSquare,
  X,
  Send,
  Code,
  Database,
  Search,
  Settings,
  CreditCard,
  BarChart3,
  Lock,
  Bell,
  Share2,
  Camera,
  Star,
  Play,
  Layers
} from "lucide-react";
import { SiReact, SiNextdotjs, SiNodedotjs } from "react-icons/si";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface PlanStep {
  id: number;
  isCompleted: boolean;
  isActive: boolean;
}

interface WebType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  color: string;
  bgColor: string;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  isRequired?: boolean;
}

interface PlanningState {
  currentStep: number;
  selectedWebType: string | null;
  selectedFeatures: string[];
  selectedSpecializations: string[];
  uploadedFiles: File[];
  projectDetails: {
    siteName: string;
    siteDescription: string;
    targetAudience: string;
    budget: string;
    timeline: string;
    additionalRequirements: string;
  };
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
}

export default function WebDevelopmentServicePage() {
  const { lang, dir } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Web service data
  const [isLoading, setIsLoading] = useState(false);
  
  const getWebData = () => {
    return {
      hero: {
        title: lang === 'ar' ? 'تطوير المواقع والمنصات' : 'Web & Platform Development',
        subtitle: lang === 'ar' ? 'مواقع احترافية ومنصات متطورة' : 'Professional Websites and Advanced Platforms',
        description: lang === 'ar' ? 'نصمم ونطور مواقع ومنصات حديثة وآمنة مع دعم كامل للغة العربية وأفضل ممارسات SEO' : 'We design and develop modern and secure websites and platforms with full Arabic language support and SEO best practices',
        primaryCta: lang === 'ar' ? 'ابدأ مشروعك الآن' : 'Start Your Project Now',
        secondaryCta: lang === 'ar' ? 'تحدث مع خبير' : 'Talk to an Expert'
      },
      features: {
        title: lang === 'ar' ? 'نقاط القوة' : 'Our Strengths',
        items: [
          {
            icon: 'Shield',
            title: lang === 'ar' ? 'أمان مؤسسي' : 'Enterprise Security',
            desc: lang === 'ar' ? 'SSL وحماية متقدمة للبيانات' : 'SSL and advanced data protection'
          },
          {
            icon: 'Search',
            title: lang === 'ar' ? 'تحسين محركات البحث' : 'SEO Optimization',
            desc: lang === 'ar' ? 'ظهور أفضل في محركات البحث' : 'Better search engine visibility'
          },
          {
            icon: 'Rocket',
            title: lang === 'ar' ? 'أداء عالي' : 'High Performance',
            desc: lang === 'ar' ? 'مواقع سريعة ومستقرة' : 'Fast and stable websites'
          },
          {
            icon: 'Monitor',
            title: lang === 'ar' ? 'تصميم متجاوب' : 'Responsive Design',
            desc: lang === 'ar' ? 'يعمل على جميع الأجهزة' : 'Works on all devices'
          },
          {
            icon: 'Settings',
            title: lang === 'ar' ? 'إدارة سهلة' : 'Easy Management',
            desc: lang === 'ar' ? 'لوحة تحكم بسيطة وفعالة' : 'Simple and effective admin panel'
          },
          {
            icon: 'Globe',
            title: lang === 'ar' ? 'دعم متعدد اللغات' : 'Multi-language Support',
            desc: lang === 'ar' ? 'عربي وإنجليزي مع دعم RTL' : 'Arabic and English with RTL support'
          }
        ]
      },
      cta: {
        title: lang === 'ar' ? 'جاهز للانطلاق؟' : 'Ready to Launch?',
        desc: lang === 'ar' ? 'لنحول فكرتك إلى موقع حقيقي' : 'Let\'s turn your idea into reality',
        primary: lang === 'ar' ? 'ابدأ مشروعك الآن' : 'Start Your Project',
        secondary: lang === 'ar' ? 'تحدث مع خبير' : 'Talk to Expert'
      },
      seo: {
        title: lang === 'ar' ? 'تطوير المواقع والمنصات | GSC' : 'Web & Platform Development | GSC',
        description: lang === 'ar' ? 'تطوير مواقع ومنصات احترافية' : 'Professional website and platform development'
      }
    };
  };

  const [planningState, setPlanningState] = useState<PlanningState>({
    currentStep: 1,
    selectedWebType: null,
    selectedFeatures: [],
    selectedSpecializations: [],
    uploadedFiles: [],
    projectDetails: {
      siteName: '',
      siteDescription: '',
      targetAudience: '',
      budget: '',
      timeline: '',
      additionalRequirements: ''
    },
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      company: ''
    }
  });

  // Initialize required features when component mounts
  useEffect(() => {
    const requiredFeatures = getFeatures()
      .filter(feature => feature.isRequired)
      .map(feature => feature.id);
    
    if (requiredFeatures.length > 0) {
      setPlanningState(prev => ({
        ...prev,
        selectedFeatures: [...prev.selectedFeatures, ...requiredFeatures]
      }));
    }
  }, []);

  // Form submission mutation
  const submitPlanMutation = useMutation({
    mutationFn: async (planData: any) => {
      setIsLoading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add form fields
      formData.append('customerName', planData.contactInfo.name);
      formData.append('customerEmail', planData.contactInfo.email);
      formData.append('customerPhone', planData.contactInfo.phone);
      if (planData.contactInfo.company) {
        formData.append('customerCompany', planData.contactInfo.company);
      }
      
      formData.append('siteType', planData.selectedWebType || '');
      formData.append('selectedFeatures', JSON.stringify(planData.selectedFeatures));
      formData.append('contentScope', planData.projectDetails.siteDescription);
      formData.append('targetAudience', planData.projectDetails.targetAudience);
      formData.append('budget', planData.projectDetails.budget);
      formData.append('timeline', planData.projectDetails.timeline);
      formData.append('notes', planData.projectDetails.additionalRequirements);
      formData.append('projectName', planData.projectDetails.siteName);
      
      // Add files
      planData.uploadedFiles.forEach((file: File) => {
        formData.append('attachments', file);
      });
      
      const response = await fetch('/api/web-orders', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit request');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: lang === 'ar' ? 'تم إرسال الطلب بنجاح!' : 'Request Submitted Successfully!',
        description: lang === 'ar' 
          ? 'سيتم التواصل معك قريباً لمناقشة تفاصيل مشروعك' 
          : 'We will contact you soon to discuss your project details',
      });
      
      // Reset form
      setPlanningState({
        currentStep: 1,
        selectedWebType: null,
        selectedFeatures: getFeatures().filter(f => f.isRequired).map(f => f.id),
        selectedSpecializations: [],
        uploadedFiles: [],
        projectDetails: {
          siteName: '',
          siteDescription: '',
          targetAudience: '',
          budget: '',
          timeline: '',
          additionalRequirements: ''
        },
        contactInfo: {
          name: '',
          email: '',
          phone: '',
          company: ''
        }
      });
      
      setIsLoading(false);
    },
    onError: () => {
      toast({
        title: lang === 'ar' ? 'خطأ في الإرسال' : 'Submission Error',
        description: lang === 'ar' 
          ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى' 
          : 'An error occurred while submitting the request. Please try again',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  });

  const handleSubmitPlan = () => {
    submitPlanMutation.mutate(planningState);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Web Types Definition
  const getWebTypes = (): WebType[] => [
    {
      id: 'corporate',
      name: lang === 'ar' ? 'موقع شركة' : 'Corporate Website',
      description: lang === 'ar' ? 'مواقع احترافية للشركات والأعمال' : 'Professional websites for companies and businesses',
      icon: Building,
      features: lang === 'ar' ? [
        'صفحات الشركة الأساسية',
        'معرض الأعمال والخدمات',
        'نماذج التواصل',
        'دعم متعدد اللغات'
      ] : [
        'Essential company pages',
        'Portfolio and services gallery',
        'Contact forms',
        'Multi-language support'
      ],
      color: 'blue',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      id: 'ecommerce',
      name: lang === 'ar' ? 'متجر إلكتروني' : 'E-commerce Store',
      description: lang === 'ar' ? 'متاجر إلكترونية للتجارة الرقمية' : 'E-commerce stores for digital trade',
      icon: ShoppingBag,
      features: lang === 'ar' ? [
        'كتالوج منتجات شامل',
        'سلة شراء ونظام دفع',
        'إدارة المخزون',
        'تقارير المبيعات'
      ] : [
        'Comprehensive product catalog',
        'Shopping cart & payment system',
        'Inventory management',
        'Sales reports'
      ],
      color: 'green',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
      id: 'blog',
      name: lang === 'ar' ? 'مدونة/مجلة' : 'Blog/Magazine',
      description: lang === 'ar' ? 'منصات نشر المحتوى' : 'Content publishing platforms',
      icon: Newspaper,
      features: lang === 'ar' ? [
        'إدارة المقالات',
        'التصنيفات والعلامات',
        'التعليقات والتفاعل',
        'النشرة البريدية'
      ] : [
        'Article management',
        'Categories and tags',
        'Comments and interaction',
        'Newsletter'
      ],
      color: 'purple',
      bgColor: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      id: 'portfolio',
      name: lang === 'ar' ? 'معرض أعمال' : 'Portfolio Website',
      description: lang === 'ar' ? 'مواقع عرض الأعمال الإبداعية' : 'Creative work showcase websites',
      icon: Palette,
      features: lang === 'ar' ? [
        'معرض الأعمال',
        'عرض المشاريع',
        'تقييمات العملاء',
        'صفحة التواصل'
      ] : [
        'Work gallery',
        'Project showcase',
        'Client testimonials',
        'Contact page'
      ],
      color: 'pink',
      bgColor: 'bg-pink-50 hover:bg-pink-100'
    },
    {
      id: 'educational',
      name: lang === 'ar' ? 'منصة تعليمية' : 'Educational Platform',
      description: lang === 'ar' ? 'أنظمة إدارة التعلم' : 'Learning management systems',
      icon: GraduationCap,
      features: lang === 'ar' ? [
        'إدارة الدورات',
        'بوابة الطلاب',
        'التقييمات والاختبارات',
        'الشهادات'
      ] : [
        'Course management',
        'Student portal',
        'Assessments and tests',
        'Certificates'
      ],
      color: 'indigo',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100'
    },
    {
      id: 'platform',
      name: lang === 'ar' ? 'منصة رقمية' : 'Digital Platform',
      description: lang === 'ar' ? 'منصات متقدمة ومخصصة' : 'Advanced and custom platforms',
      icon: Layers,
      features: lang === 'ar' ? [
        'إدارة المستخدمين',
        'لوحات تحكم متقدمة',
        'تقارير وتحليلات',
        'واجهات برمجة التطبيقات'
      ] : [
        'User management',
        'Advanced dashboards',
        'Reports and analytics',
        'API interfaces'
      ],
      color: 'orange',
      bgColor: 'bg-orange-50 hover:bg-orange-100'
    }
  ];

  // Features Definition
  const getFeatures = (): Feature[] => [
    // Core Features
    {
      id: 'responsive_design',
      name: lang === 'ar' ? 'تصميم متجاوب' : 'Responsive Design',
      description: lang === 'ar' ? 'يعمل بشكل مثالي على جميع الأجهزة' : 'Works perfectly on all devices',
      category: 'core',
      isRequired: true
    },
    {
      id: 'ssl_security',
      name: lang === 'ar' ? 'أمان SSL' : 'SSL Security',
      description: lang === 'ar' ? 'اتصالات مشفرة آمنة' : 'Secure encrypted connections',
      category: 'core',
      isRequired: true
    },
    {
      id: 'seo_optimization',
      name: lang === 'ar' ? 'تحسين محركات البحث' : 'SEO Optimization',
      description: lang === 'ar' ? 'ظهور أفضل في محركات البحث' : 'Better search engine visibility',
      category: 'core',
      isRequired: true
    },
    {
      id: 'performance',
      name: lang === 'ar' ? 'تحسين الأداء' : 'Performance Optimization',
      description: lang === 'ar' ? 'أوقات تحميل سريعة' : 'Fast loading times',
      category: 'core'
    },

    // Business Features
    {
      id: 'cms',
      name: lang === 'ar' ? 'إدارة المحتوى' : 'Content Management',
      description: lang === 'ar' ? 'تحديث سهل للمحتوى' : 'Easy content updates',
      category: 'business'
    },
    {
      id: 'user_accounts',
      name: lang === 'ar' ? 'حسابات المستخدمين' : 'User Accounts',
      description: lang === 'ar' ? 'تسجيل ودخول المستخدمين' : 'User registration and login',
      category: 'business'
    },
    {
      id: 'contact_forms',
      name: lang === 'ar' ? 'نماذج التواصل' : 'Contact Forms',
      description: lang === 'ar' ? 'نماذج تواصل واستفسار مخصصة' : 'Custom contact and inquiry forms',
      category: 'business'
    },
    {
      id: 'analytics',
      name: lang === 'ar' ? 'تكامل التحليلات' : 'Analytics Integration',
      description: lang === 'ar' ? 'تتبع الزوار والأداء' : 'Track visitors and performance',
      category: 'business'
    },

    // Advanced Features
    {
      id: 'ecommerce_cart',
      name: lang === 'ar' ? 'سلة التسوق' : 'Shopping Cart',
      description: lang === 'ar' ? 'وظائف التجارة الإلكترونية الكاملة' : 'Full e-commerce functionality',
      category: 'advanced'
    },
    {
      id: 'payment_gateway',
      name: lang === 'ar' ? 'بوابة الدفع' : 'Payment Gateway',
      description: lang === 'ar' ? 'مدفوعات آمنة عبر الإنترنت' : 'Secure online payments',
      category: 'advanced'
    },
    {
      id: 'multi_language',
      name: lang === 'ar' ? 'دعم متعدد اللغات' : 'Multi-Language Support',
      description: lang === 'ar' ? 'دعم للغات متعددة' : 'Support for multiple languages',
      category: 'advanced'
    },
    {
      id: 'api_integration',
      name: lang === 'ar' ? 'تكامل واجهة البرمجة' : 'API Integration',
      description: lang === 'ar' ? 'الاتصال بالخدمات الخارجية' : 'Connect with external services',
      category: 'advanced'
    }
  ];

  // Steps for planning process
  const planSteps = [
    {
      id: 1,
      title: lang === 'ar' ? 'نوع الموقع' : 'Website Type',
      description: lang === 'ar' ? 'اختر نوع الموقع المطلوب' : 'Choose your website type'
    },
    {
      id: 2,
      title: lang === 'ar' ? 'الميزات' : 'Features',
      description: lang === 'ar' ? 'حدد الميزات المطلوبة' : 'Select required features'
    },
    {
      id: 3,
      title: lang === 'ar' ? 'تفاصيل المشروع' : 'Project Details',
      description: lang === 'ar' ? 'أضف تفاصيل مشروعك' : 'Add your project details'
    },
    {
      id: 4,
      title: lang === 'ar' ? 'الملفات والمستندات' : 'Files & Documents',
      description: lang === 'ar' ? 'ارفع الملفات ذات الصلة' : 'Upload relevant files'
    },
    {
      id: 5,
      title: lang === 'ar' ? 'معلومات التواصل' : 'Contact Info',
      description: lang === 'ar' ? 'أدخل معلومات التواصل' : 'Enter contact information'
    }
  ];

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      
      // Add customer information
      formData.append('customerName', planningState.contactInfo.name);
      formData.append('customerEmail', planningState.contactInfo.email);
      formData.append('customerPhone', planningState.contactInfo.phone);
      if (planningState.contactInfo.company) {
        formData.append('customerCompany', planningState.contactInfo.company);
      }
      
      // Add site details
      formData.append('siteType', planningState.selectedWebType || '');
      if (planningState.projectDetails.siteName) {
        formData.append('siteName', planningState.projectDetails.siteName);
      }
      if (planningState.projectDetails.siteDescription) {
        formData.append('contentScope', planningState.projectDetails.siteDescription);
      }
      
      // Add selected features as JSON string
      formData.append('selectedFeatures', JSON.stringify(planningState.selectedFeatures));
      
      // Add additional requirements
      let additionalRequirements = planningState.projectDetails.additionalRequirements || '';
      
      if (planningState.projectDetails.targetAudience) {
        additionalRequirements += `\n\nالجمهور المستهدف: ${planningState.projectDetails.targetAudience}`;
      }
      
      formData.append('notes', additionalRequirements);
      
      // Add budget and timeline
      if (planningState.projectDetails.budget) {
        formData.append('estimatedBudget', planningState.projectDetails.budget);
      }
      if (planningState.projectDetails.timeline) {
        formData.append('preferredTimeline', planningState.projectDetails.timeline);
      }
      
      // Add files as attachments to match the API expectation
      planningState.uploadedFiles.forEach((file) => {
        formData.append('attachments', file);
      });

      const response = await fetch('/api/web-orders', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error('Failed to submit request');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: lang === 'ar' ? 'تم إرسال الطلب بنجاح' : 'Request submitted successfully',
        description: lang === 'ar' ? 'سنتواصل معك قريباً لمناقشة تفاصيل المشروع' : 'We will contact you soon to discuss project details',
      });
      
      // Reset form
      setPlanningState({
        currentStep: 1,
        selectedWebType: null,
        selectedFeatures: [],
        selectedSpecializations: [],
        uploadedFiles: [],
        projectDetails: {
          siteName: '',
          siteDescription: '',
          targetAudience: '',
          budget: '',
          timeline: '',
          additionalRequirements: ''
        },
        contactInfo: {
          name: '',
          email: '',
          phone: '',
          company: ''
        }
      });
    },
    onError: () => {
      toast({
        title: lang === 'ar' ? 'حدث خطأ' : 'Error occurred',
        description: lang === 'ar' ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.' : 'Error submitting request. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const webData = getWebData();

  return (
    <>
      <SEOHead
        title={webData.seo.title}
        description={webData.seo.description}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20">
        {/* Interactive Platform Icons Bar */}
        <div className="absolute top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <TooltipProvider>
              <div className="flex items-center justify-center gap-8 py-4" data-testid="bar-platforms">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        aria-label={dir === 'rtl' ? 'المواقع الإلكترونية' : 'Websites'}
                        data-testid="badge-websites"
                      >
                        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {dir === 'rtl' ? 'المواقع' : 'Web'}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{lang === 'ar' ? 'مواقع إلكترونية متجاوبة' : 'Responsive websites'}</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        aria-label={dir === 'rtl' ? 'منصات رقمية' : 'Digital Platforms'}
                        data-testid="badge-platforms"
                      >
                        <Layers className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {dir === 'rtl' ? 'المنصات' : 'Platforms'}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{lang === 'ar' ? 'منصات رقمية متطورة' : 'Advanced digital platforms'}</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                        aria-label={dir === 'rtl' ? 'تقنيات حديثة' : 'Modern Technologies'}
                        data-testid="badge-tech"
                      >
                        <SiReact className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {dir === 'rtl' ? 'التقنيات' : 'Tech'}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{lang === 'ar' ? 'React, Next.js, Node.js' : 'React, Next.js, Node.js'}</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              </div>
            </TooltipProvider>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/10 pt-24 pb-20 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:32px_32px] opacity-30" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  {webData.hero.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-4 font-medium">
                  {webData.hero.subtitle}
                </p>
                <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                  {webData.hero.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => setPlanningState(prev => ({ ...prev, currentStep: 1 }))}
                    data-testid="button-start-project"
                  >
                    {webData.hero.primaryCta}
                    <ArrowRight className={cn("w-5 h-5", dir === 'rtl' ? "rotate-180 mr-2" : "ml-2")} />
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => setLocation('/contact?service=web-development')}
                    data-testid="button-talk-expert"
                  >
                    {webData.hero.secondaryCta}
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Planning System */}
        <AnimatePresence>
          {planningState.currentStep > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="py-20 bg-white/80 backdrop-blur-sm"
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                  {/* Progress Steps */}
                  <div className="flex justify-center mb-12">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      {planSteps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                            planningState.currentStep >= step.id
                              ? "bg-primary text-white shadow-lg"
                              : "bg-gray-200 text-gray-600"
                          )}>
                            {planningState.currentStep > step.id ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              step.id
                            )}
                          </div>
                          {index < planSteps.length - 1 && (
                            <div className={cn(
                              "w-16 h-1 mx-2 transition-all duration-300",
                              planningState.currentStep > step.id
                                ? "bg-primary"
                                : "bg-gray-200"
                            )} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step Content */}
                  <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader className="text-center pb-6">
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {planSteps[planningState.currentStep - 1]?.title}
                      </CardTitle>
                      <p className="text-gray-600">
                        {planSteps[planningState.currentStep - 1]?.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      {/* Step 1: Website Type Selection */}
                      {planningState.currentStep === 1 && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-6"
                        >
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {getWebTypes().map((webType) => {
                              const IconComponent = webType.icon;
                              const isSelected = planningState.selectedWebType === webType.id;
                              
                              return (
                                <motion.div
                                  key={webType.id}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Card 
                                    className={cn(
                                      "cursor-pointer transition-all duration-300 hover:shadow-lg border-2",
                                      isSelected 
                                        ? "border-primary bg-primary/5 shadow-lg" 
                                        : "border-gray-200 hover:border-primary/50",
                                      webType.bgColor
                                    )}
                                    onClick={() => setPlanningState(prev => ({ 
                                      ...prev, 
                                      selectedWebType: webType.id 
                                    }))}
                                    data-testid={`card-web-type-${webType.id}`}
                                  >
                                    <CardContent className="p-6 text-center">
                                      <div className={cn(
                                        "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-all duration-300",
                                        isSelected 
                                          ? "bg-primary text-white shadow-lg scale-110" 
                                          : "bg-white text-primary shadow-md"
                                      )}>
                                        <IconComponent className="w-8 h-8" />
                                      </div>
                                      
                                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {webType.name}
                                      </h3>
                                      
                                      <p className="text-sm text-gray-600 mb-4">
                                        {webType.description}
                                      </p>

                                      <div className="space-y-2">
                                        {webType.features.map((feature, index) => (
                                          <div key={index} className="flex items-center text-xs text-gray-500">
                                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 rtl:ml-2 rtl:mr-0" />
                                            {feature}
                                          </div>
                                        ))}
                                      </div>

                                      {isSelected && (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          className="mt-4"
                                        >
                                          <Badge className="bg-primary/10 text-primary border-primary/20">
                                            {lang === 'ar' ? 'محدد' : 'Selected'}
                                          </Badge>
                                        </motion.div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Features Selection */}
                      {planningState.currentStep === 2 && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-6"
                        >
                          {/* Features Categories */}
                          {['core', 'business', 'advanced'].map((category) => (
                            <div key={category} className="space-y-4">
                              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                                {category === 'core' && (lang === 'ar' ? 'الميزات الأساسية' : 'Core Features')}
                                {category === 'business' && (lang === 'ar' ? 'الميزات التجارية' : 'Business Features')}
                                {category === 'advanced' && (lang === 'ar' ? 'الميزات المتقدمة' : 'Advanced Features')}
                              </h3>
                              
                              <div className="grid md:grid-cols-2 gap-4">
                                {getFeatures().filter(feature => feature.category === category).map((feature) => {
                                  const isSelected = planningState.selectedFeatures.includes(feature.id);
                                  const isRequired = feature.isRequired;
                                  
                                  return (
                                    <motion.div
                                      key={feature.id}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <Card 
                                        className={cn(
                                          "cursor-pointer transition-all duration-300 hover:shadow-md border-2",
                                          isSelected 
                                            ? "border-primary bg-primary/5" 
                                            : "border-gray-200 hover:border-primary/50",
                                          isRequired && "border-green-300 bg-green-50/50"
                                        )}
                                        onClick={() => {
                                          if (isRequired) return; // Don't allow deselection of required features
                                          
                                          setPlanningState(prev => ({
                                            ...prev,
                                            selectedFeatures: isSelected
                                              ? prev.selectedFeatures.filter(id => id !== feature.id)
                                              : [...prev.selectedFeatures, feature.id]
                                          }));
                                        }}
                                        data-testid={`card-feature-${feature.id}`}
                                      >
                                        <CardContent className="p-4">
                                          <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                            <div className={cn(
                                              "w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5",
                                              isSelected || isRequired
                                                ? "bg-primary border-primary"
                                                : "border-gray-300"
                                            )}>
                                              {(isSelected || isRequired) && (
                                                <CheckCircle className="w-3 h-3 text-white" />
                                              )}
                                            </div>
                                            
                                            <div className="flex-1">
                                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                <h4 className="font-semibold text-gray-900">{feature.name}</h4>
                                                {isRequired && (
                                                  <Badge variant="secondary" className="text-xs">
                                                    {lang === 'ar' ? 'مطلوب' : 'Required'}
                                                  </Badge>
                                                )}
                                              </div>
                                              <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}

                      {/* Step 3: Project Details */}
                      {planningState.currentStep === 3 && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-6"
                        >
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="siteName">{lang === 'ar' ? 'اسم الموقع/المشروع' : 'Site/Project Name'}</Label>
                                <Input
                                  id="siteName"
                                  value={planningState.projectDetails.siteName}
                                  onChange={(e) => setPlanningState(prev => ({
                                    ...prev,
                                    projectDetails: { ...prev.projectDetails, siteName: e.target.value }
                                  }))}
                                  placeholder={lang === 'ar' ? 'أدخل اسم الموقع أو المشروع' : 'Enter site or project name'}
                                  data-testid="input-site-name"
                                />
                              </div>

                              <div>
                                <Label htmlFor="targetAudience">{lang === 'ar' ? 'الجمهور المستهدف' : 'Target Audience'}</Label>
                                <Input
                                  id="targetAudience"
                                  value={planningState.projectDetails.targetAudience}
                                  onChange={(e) => setPlanningState(prev => ({
                                    ...prev,
                                    projectDetails: { ...prev.projectDetails, targetAudience: e.target.value }
                                  }))}
                                  placeholder={lang === 'ar' ? 'من هو جمهورك المستهدف؟' : 'Who is your target audience?'}
                                  data-testid="input-target-audience"
                                />
                              </div>

                              <div>
                                <Label htmlFor="budget">{lang === 'ar' ? 'الميزانية المتوقعة' : 'Expected Budget'}</Label>
                                <Select 
                                  value={planningState.projectDetails.budget}
                                  onValueChange={(value) => setPlanningState(prev => ({
                                    ...prev,
                                    projectDetails: { ...prev.projectDetails, budget: value }
                                  }))}
                                >
                                  <SelectTrigger data-testid="select-budget">
                                    <SelectValue placeholder={lang === 'ar' ? 'اختر الميزانية' : 'Select budget range'} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="5000-15000">{lang === 'ar' ? '5,000 - 15,000 ريال' : '$1,500 - $4,000'}</SelectItem>
                                    <SelectItem value="15000-30000">{lang === 'ar' ? '15,000 - 30,000 ريال' : '$4,000 - $8,000'}</SelectItem>
                                    <SelectItem value="30000-60000">{lang === 'ar' ? '30,000 - 60,000 ريال' : '$8,000 - $16,000'}</SelectItem>
                                    <SelectItem value="60000+">{lang === 'ar' ? 'أكثر من 60,000 ريال' : '$16,000+'}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="timeline">{lang === 'ar' ? 'الإطار الزمني المطلوب' : 'Required Timeline'}</Label>
                                <Select 
                                  value={planningState.projectDetails.timeline}
                                  onValueChange={(value) => setPlanningState(prev => ({
                                    ...prev,
                                    projectDetails: { ...prev.projectDetails, timeline: value }
                                  }))}
                                >
                                  <SelectTrigger data-testid="select-timeline">
                                    <SelectValue placeholder={lang === 'ar' ? 'اختر الإطار الزمني' : 'Select timeline'} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1-2weeks">{lang === 'ar' ? '1-2 أسبوع' : '1-2 weeks'}</SelectItem>
                                    <SelectItem value="2-4weeks">{lang === 'ar' ? '2-4 أسابيع' : '2-4 weeks'}</SelectItem>
                                    <SelectItem value="1-2months">{lang === 'ar' ? '1-2 شهر' : '1-2 months'}</SelectItem>
                                    <SelectItem value="2-3months">{lang === 'ar' ? '2-3 أشهر' : '2-3 months'}</SelectItem>
                                    <SelectItem value="3months+">{lang === 'ar' ? 'أكثر من 3 أشهر' : '3+ months'}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label htmlFor="siteDescription">{lang === 'ar' ? 'وصف المشروع' : 'Project Description'}</Label>
                                <Textarea
                                  id="siteDescription"
                                  value={planningState.projectDetails.siteDescription}
                                  onChange={(e) => setPlanningState(prev => ({
                                    ...prev,
                                    projectDetails: { ...prev.projectDetails, siteDescription: e.target.value }
                                  }))}
                                  placeholder={lang === 'ar' ? 'صف مشروعك بالتفصيل...' : 'Describe your project in detail...'}
                                  rows={4}
                                  data-testid="textarea-project-description"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="additionalRequirements">{lang === 'ar' ? 'متطلبات إضافية' : 'Additional Requirements'}</Label>
                            <Textarea
                              id="additionalRequirements"
                              value={planningState.projectDetails.additionalRequirements}
                              onChange={(e) => setPlanningState(prev => ({
                                ...prev,
                                projectDetails: { ...prev.projectDetails, additionalRequirements: e.target.value }
                              }))}
                              placeholder={lang === 'ar' ? 'أي متطلبات أو ملاحظات إضافية...' : 'Any additional requirements or notes...'}
                              rows={3}
                              data-testid="textarea-additional-requirements"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Step 4: Files & Documents */}
                      {planningState.currentStep === 4 && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-6"
                        >
                          <div className="text-center">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-primary/50 transition-colors">
                              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {lang === 'ar' ? 'ارفع ملفاتك' : 'Upload Your Files'}
                              </h3>
                              <p className="text-gray-600 mb-4">
                                {lang === 'ar' 
                                  ? 'يمكنك رفع التصاميم، المراجع، أو أي مستندات ذات صلة' 
                                  : 'You can upload designs, references, or any relevant documents'
                                }
                              </p>
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || []);
                                  setPlanningState(prev => ({
                                    ...prev,
                                    uploadedFiles: [...prev.uploadedFiles, ...files].slice(0, 5) // Max 5 files
                                  }));
                                }}
                                className="hidden"
                                id="file-upload"
                                data-testid="input-file-upload"
                              />
                              <Label htmlFor="file-upload" className="cursor-pointer">
                                <Button type="button" variant="outline" className="pointer-events-none">
                                  <Upload className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                                  {lang === 'ar' ? 'اختر الملفات' : 'Choose Files'}
                                </Button>
                              </Label>
                            </div>
                          </div>

                          {/* Uploaded Files List */}
                          {planningState.uploadedFiles.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-900">
                                {lang === 'ar' ? 'الملفات المرفوعة' : 'Uploaded Files'}
                              </h4>
                              {planningState.uploadedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                    <FileText className="w-5 h-5 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-900">{file.name}</span>
                                    <span className="text-xs text-gray-500">
                                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPlanningState(prev => ({
                                      ...prev,
                                      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
                                    }))}
                                    data-testid={`button-remove-file-${index}`}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}

                          <Alert>
                            <AlertDescription>
                              {lang === 'ar' 
                                ? 'يمكنك رفع حتى 5 ملفات بحد أقصى 10 ميجابايت لكل ملف. الصيغ المدعومة: PDF، DOC، DOCX، TXT، JPG، PNG، GIF'
                                : 'You can upload up to 5 files with a maximum of 10MB per file. Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF'
                              }
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}

                      {/* Step 5: Contact Info */}
                      {planningState.currentStep === 5 && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-6"
                        >
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="contactName">{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} *</Label>
                                <Input
                                  id="contactName"
                                  value={planningState.contactInfo.name}
                                  onChange={(e) => setPlanningState(prev => ({
                                    ...prev,
                                    contactInfo: { ...prev.contactInfo, name: e.target.value }
                                  }))}
                                  placeholder={lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                                  required
                                  data-testid="input-contact-name"
                                />
                              </div>

                              <div>
                                <Label htmlFor="contactEmail">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *</Label>
                                <Input
                                  id="contactEmail"
                                  type="email"
                                  value={planningState.contactInfo.email}
                                  onChange={(e) => setPlanningState(prev => ({
                                    ...prev,
                                    contactInfo: { ...prev.contactInfo, email: e.target.value }
                                  }))}
                                  placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                                  required
                                  data-testid="input-contact-email"
                                />
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="contactPhone">{lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *</Label>
                                <Input
                                  id="contactPhone"
                                  type="tel"
                                  value={planningState.contactInfo.phone}
                                  onChange={(e) => setPlanningState(prev => ({
                                    ...prev,
                                    contactInfo: { ...prev.contactInfo, phone: e.target.value }
                                  }))}
                                  placeholder={lang === 'ar' ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
                                  required
                                  data-testid="input-contact-phone"
                                />
                              </div>

                              <div>
                                <Label htmlFor="contactCompany">{lang === 'ar' ? 'اسم الشركة (اختياري)' : 'Company Name (Optional)'}</Label>
                                <Input
                                  id="contactCompany"
                                  value={planningState.contactInfo.company || ''}
                                  onChange={(e) => setPlanningState(prev => ({
                                    ...prev,
                                    contactInfo: { ...prev.contactInfo, company: e.target.value }
                                  }))}
                                  placeholder={lang === 'ar' ? 'أدخل اسم شركتك' : 'Enter your company name'}
                                  data-testid="input-contact-company"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Summary Review */}
                          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-4">
                              {lang === 'ar' ? 'ملخص طلبك' : 'Request Summary'}
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="font-medium">{lang === 'ar' ? 'نوع الموقع:' : 'Website Type:'}</span>
                                <span className="ml-2 rtl:mr-2">
                                  {getWebTypes().find(type => type.id === planningState.selectedWebType)?.name}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">{lang === 'ar' ? 'الميزات المحددة:' : 'Selected Features:'}</span>
                                <span className="ml-2 rtl:mr-2">{planningState.selectedFeatures.length} {lang === 'ar' ? 'ميزة' : 'features'}</span>
                              </div>
                              <div>
                                <span className="font-medium">{lang === 'ar' ? 'الملفات المرفوعة:' : 'Uploaded Files:'}</span>
                                <span className="ml-2 rtl:mr-2">{planningState.uploadedFiles.length} {lang === 'ar' ? 'ملف' : 'files'}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Navigation */}
                      <div className="flex justify-between pt-8">
                        <Button
                          variant="outline"
                          onClick={() => setPlanningState(prev => ({ ...prev, currentStep: Math.max(1, prev.currentStep - 1) }))}
                          disabled={planningState.currentStep === 1}
                          data-testid="button-prev-step"
                        >
                          <ArrowRight className={cn("w-4 h-4", dir === 'rtl' ? "ml-2" : "mr-2 rotate-180")} />
                          {lang === 'ar' ? 'السابق' : 'Previous'}
                        </Button>
                        
                        <Button
                          onClick={() => {
                            // Step validations
                            if (planningState.currentStep === 1 && !planningState.selectedWebType) {
                              toast({
                                title: lang === 'ar' ? 'اختيار مطلوب' : 'Selection Required',
                                description: lang === 'ar' ? 'يرجى اختيار نوع الموقع' : 'Please select a website type',
                                variant: 'destructive'
                              });
                              return;
                            }
                            
                            if (planningState.currentStep === 3) {
                              const { siteName, siteDescription, targetAudience } = planningState.projectDetails;
                              if (!siteName.trim() || !siteDescription.trim() || !targetAudience.trim()) {
                                toast({
                                  title: lang === 'ar' ? 'الحقول المطلوبة' : 'Required Fields',
                                  description: lang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields',
                                  variant: 'destructive'
                                });
                                return;
                              }
                            }
                            
                            if (planningState.currentStep === 5) {
                              const { name, email, phone } = planningState.contactInfo;
                              if (!name.trim() || !email.trim() || !phone.trim()) {
                                toast({
                                  title: lang === 'ar' ? 'معلومات التواصل مطلوبة' : 'Contact Info Required',
                                  description: lang === 'ar' ? 'يرجى ملء جميع حقول التواصل' : 'Please fill in all contact fields',
                                  variant: 'destructive'
                                });
                                return;
                              }
                              
                              // If it's the last step, submit the form
                              handleSubmitPlan();
                              return;
                            }
                            
                            setPlanningState(prev => ({ ...prev, currentStep: Math.min(5, prev.currentStep + 1) }));
                          }}
                          disabled={
                            (planningState.currentStep === 1 && !planningState.selectedWebType) ||
                            (planningState.currentStep === 5 && isLoading)
                          }
                          data-testid="button-next-step"
                        >
                          {isLoading && planningState.currentStep === 5 ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 rtl:ml-2 rtl:mr-0" />
                              {lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                            </>
                          ) : planningState.currentStep === 5 ? (
                            <>
                              <Send className={cn("w-4 h-4", dir === 'rtl' ? "rotate-180 mr-2" : "ml-2")} />
                              {lang === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
                            </>
                          ) : (
                            <>
                              {lang === 'ar' ? 'التالي' : 'Next'}
                              <ArrowRight className={cn("w-4 h-4", dir === 'rtl' ? "rotate-180 mr-2" : "ml-2")} />
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Features Section */}
        <section className="py-20 bg-gray-50/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {webData.features.title}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full mx-auto" />
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {webData.features.items.map((feature: any, index: number) => {
                const icons = {
                  Shield: Shield,
                  Search: Search,
                  Rocket: Rocket,
                  Monitor: Monitor,
                  Settings: Settings,
                  Globe: Globe
                };
                const IconComponent = icons[feature.icon as keyof typeof icons] || Shield;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-8 text-center space-y-4">
                        <motion.div
                          className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                          whileHover={{ rotate: 5 }}
                        >
                          <IconComponent className="w-8 h-8 text-white" />
                        </motion.div>
                        
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                          {feature.title}
                        </h3>
                        
                        <p className="text-gray-600 leading-relaxed">
                          {feature.desc}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-blue-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {webData.cta.title}
              </h2>
              <p className="text-xl text-white/90 mb-8">
                {webData.cta.desc}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold"
                  onClick={() => setPlanningState(prev => ({ ...prev, currentStep: 1 }))}
                  data-testid="button-cta-start"
                >
                  {webData.cta.primary}
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-xl font-semibold"
                  onClick={() => setLocation('/contact?service=web-development')}
                  data-testid="button-cta-expert"
                >
                  {webData.cta.secondary}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}