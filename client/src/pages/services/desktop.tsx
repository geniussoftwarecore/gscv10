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
  Monitor, 
  ArrowRight, 
  CheckCircle, 
  Upload, 
  FileText,
  Users,
  Zap,
  Shield,
  Rocket,
  Building,
  Database,
  GraduationCap,
  Settings,
  Calculator,
  Gamepad2,
  Palette,
  Code,
  User,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  MessageSquare,
  X,
  Send,
  Search,
  CreditCard,
  BarChart3,
  Lock,
  Bell,
  Share2,
  Camera,
  Star,
  Play,
  Layers,
  FileSpreadsheet,
  Headphones,
  Video,
  PieChart,
  ShoppingCart,
  Briefcase,
  Globe
} from "lucide-react";
import { SiElectron, SiDotnet, SiQt, SiPython } from "react-icons/si";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface PlanStep {
  id: number;
  isCompleted: boolean;
  isActive: boolean;
}

interface AppType {
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
  icon: React.ComponentType<any>;
  category: 'core' | 'business' | 'advanced';
  isRequired?: boolean;
}

interface PlanningState {
  currentStep: number;
  selectedAppType: string | null;
  selectedFeatures: string[];
  selectedSpecializations: string[];
  uploadedFiles: File[];
  projectDetails: {
    appName: string;
    appDescription: string;
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

export default function DesktopApplicationDevelopment() {
  const { lang, dir } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [planningState, setPlanningState] = useState<PlanningState>({
    currentStep: 1,
    selectedAppType: null,
    selectedFeatures: [],
    selectedSpecializations: [],
    uploadedFiles: [],
    projectDetails: {
      appName: '',
      appDescription: '',
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
      
      formData.append('appType', planData.selectedAppType || '');
      formData.append('selectedFeatures', JSON.stringify(planData.selectedFeatures));
      formData.append('contentScope', planData.projectDetails.appDescription);
      formData.append('targetAudience', planData.projectDetails.targetAudience);
      formData.append('budget', planData.projectDetails.budget);
      formData.append('timeline', planData.projectDetails.timeline);
      formData.append('notes', planData.projectDetails.additionalRequirements);
      formData.append('projectName', planData.projectDetails.appName);
      
      // Add files
      planData.uploadedFiles.forEach((file: File) => {
        formData.append('attachments', file);
      });
      
      const response = await fetch('/api/desktop-orders', {
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
        selectedAppType: null,
        selectedFeatures: getFeatures().filter(f => f.isRequired).map(f => f.id),
        selectedSpecializations: [],
        uploadedFiles: [],
        projectDetails: {
          appName: '',
          appDescription: '',
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

  // Desktop Application Types Definition
  const getAppTypes = (): AppType[] => [
    {
      id: 'business',
      name: lang === 'ar' ? 'تطبيقات الأعمال' : 'Business Applications',
      description: lang === 'ar' ? 'تطبيقات إدارية وأنظمة أعمال متقدمة' : 'Administrative and advanced business systems',
      icon: Building,
      features: lang === 'ar' ? [
        'إدارة قواعد البيانات',
        'تقارير وتحليلات',
        'أنظمة أمان متقدمة',
        'تكامل مع الأنظمة الخارجية'
      ] : [
        'Database Management',
        'Reports & Analytics',
        'Advanced Security',
        'External System Integration'
      ],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'financial',
      name: lang === 'ar' ? 'التطبيقات المالية' : 'Financial Applications',
      description: lang === 'ar' ? 'أنظمة محاسبة ومالية متخصصة' : 'Specialized accounting and financial systems',
      icon: Calculator,
      features: lang === 'ar' ? [
        'محاسبة وفواتير',
        'إدارة الرواتب',
        'تتبع المصروفات',
        'تقارير ضريبية'
      ] : [
        'Accounting & Invoicing',
        'Payroll Management',
        'Expense Tracking',
        'Tax Reports'
      ],
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'education',
      name: lang === 'ar' ? 'التطبيقات التعليمية' : 'Educational Applications',
      description: lang === 'ar' ? 'منصات تعليمية وإدارة مؤسسات تعليمية' : 'Educational platforms and institutional management',
      icon: GraduationCap,
      features: lang === 'ar' ? [
        'إدارة الطلاب',
        'منصات تعلم إلكتروني',
        'نظام درجات وتقييم',
        'مكتبة رقمية'
      ] : [
        'Student Management',
        'E-Learning Platforms',
        'Grading & Assessment',
        'Digital Library'
      ],
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'design',
      name: lang === 'ar' ? 'تطبيقات التصميم' : 'Design Applications',
      description: lang === 'ar' ? 'أدوات تصميم ورسوميات احترافية' : 'Professional design and graphics tools',
      icon: Palette,
      features: lang === 'ar' ? [
        'محرر رسوميات متقدم',
        'أدوات الرسم الرقمي',
        'معالجة الصور',
        'تصدير متعدد الصيغ'
      ] : [
        'Advanced Graphics Editor',
        'Digital Drawing Tools',
        'Image Processing',
        'Multi-format Export'
      ],
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      id: 'productivity',
      name: lang === 'ar' ? 'تطبيقات الإنتاجية' : 'Productivity Applications',
      description: lang === 'ar' ? 'أدوات تنظيم ومهام وإدارة الوقت' : 'Organization, task management and time tracking tools',
      icon: Settings,
      features: lang === 'ar' ? [
        'إدارة المهام والمشاريع',
        'تقويم وجدولة',
        'ملاحظات ووثائق',
        'تذكيرات ذكية'
      ] : [
        'Task & Project Management',
        'Calendar & Scheduling',
        'Notes & Documents',
        'Smart Reminders'
      ],
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'media',
      name: lang === 'ar' ? 'تطبيقات الوسائط' : 'Media Applications',
      description: lang === 'ar' ? 'تطبيقات تحرير فيديو وصوت ووسائط' : 'Video, audio and media editing applications',
      icon: Video,
      features: lang === 'ar' ? [
        'تحرير فيديو احترافي',
        'معالجة الصوت',
        'مؤثرات بصرية',
        'تصدير عالي الجودة'
      ] : [
        'Professional Video Editing',
        'Audio Processing',
        'Visual Effects',
        'High-Quality Export'
      ],
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'games',
      name: lang === 'ar' ? 'الألعاب' : 'Games',
      description: lang === 'ar' ? 'ألعاب تفاعلية وترفيهية للحاسوب' : 'Interactive and entertainment games for desktop',
      icon: Gamepad2,
      features: lang === 'ar' ? [
        'رسوميات ثلاثية الأبعاد',
        'فيزياء اللعبة',
        'صوت محيطي',
        'وضع متعدد اللاعبين'
      ] : [
        '3D Graphics',
        'Game Physics',
        'Surround Sound',
        'Multiplayer Mode'
      ],
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'analytics',
      name: lang === 'ar' ? 'تطبيقات التحليل' : 'Analytics Applications',
      description: lang === 'ar' ? 'أدوات تحليل البيانات والإحصائيات' : 'Data analysis and statistics tools',
      icon: BarChart3,
      features: lang === 'ar' ? [
        'تحليل البيانات الضخمة',
        'لوحات معلومات تفاعلية',
        'تصورات بيانية متقدمة',
        'تقارير آلية'
      ] : [
        'Big Data Analysis',
        'Interactive Dashboards',
        'Advanced Data Visualization',
        'Automated Reports'
      ],
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    }
  ];

  // Features Definition
  const getFeatures = (): Feature[] => [
    // Core Features
    {
      id: 'user_interface',
      name: lang === 'ar' ? 'واجهة مستخدم حديثة' : 'Modern User Interface',
      description: lang === 'ar' ? 'تصميم واجهة عصرية وسهلة الاستخدام' : 'Modern and user-friendly interface design',
      icon: Monitor,
      category: 'core',
      isRequired: true
    },
    {
      id: 'data_storage',
      name: lang === 'ar' ? 'تخزين البيانات' : 'Data Storage',
      description: lang === 'ar' ? 'نظام قاعدة بيانات محلي أو سحابي' : 'Local or cloud database system',
      icon: Database,
      category: 'core',
      isRequired: true
    },
    {
      id: 'file_management',
      name: lang === 'ar' ? 'إدارة الملفات' : 'File Management',
      description: lang === 'ar' ? 'نظام متكامل لإدارة وتنظيم الملفات' : 'Integrated file management and organization system',
      icon: FileText,
      category: 'core'
    },
    {
      id: 'search_functionality',
      name: lang === 'ar' ? 'وظائف البحث' : 'Search Functionality',
      description: lang === 'ar' ? 'نظام بحث متقدم وفلترة ذكية' : 'Advanced search system and smart filtering',
      icon: Search,
      category: 'core'
    },
    {
      id: 'settings_configuration',
      name: lang === 'ar' ? 'الإعدادات والتخصيص' : 'Settings & Configuration',
      description: lang === 'ar' ? 'إعدادات قابلة للتخصيص وحفظ التفضيلات' : 'Customizable settings and preference saving',
      icon: Settings,
      category: 'core'
    },

    // Business Features
    {
      id: 'user_authentication',
      name: lang === 'ar' ? 'نظام تسجيل الدخول' : 'User Authentication',
      description: lang === 'ar' ? 'نظام أمان متقدم لتسجيل الدخول' : 'Advanced security login system',
      icon: Lock,
      category: 'business'
    },
    {
      id: 'multi_user_support',
      name: lang === 'ar' ? 'دعم متعدد المستخدمين' : 'Multi-User Support',
      description: lang === 'ar' ? 'إدارة أدوار وصلاحيات المستخدمين' : 'User roles and permissions management',
      icon: Users,
      category: 'business'
    },
    {
      id: 'reporting_system',
      name: lang === 'ar' ? 'نظام التقارير' : 'Reporting System',
      description: lang === 'ar' ? 'تقارير تفصيلية وتحليلات' : 'Detailed reports and analytics',
      icon: BarChart3,
      category: 'business'
    },
    {
      id: 'data_backup',
      name: lang === 'ar' ? 'نسخ احتياطي للبيانات' : 'Data Backup',
      description: lang === 'ar' ? 'نظام نسخ احتياطي آمن ومجدول' : 'Secure and scheduled backup system',
      icon: Shield,
      category: 'business'
    },
    {
      id: 'email_integration',
      name: lang === 'ar' ? 'تكامل البريد الإلكتروني' : 'Email Integration',
      description: lang === 'ar' ? 'إرسال واستقبال البريد الإلكتروني' : 'Send and receive email functionality',
      icon: Mail,
      category: 'business'
    },
    {
      id: 'notification_system',
      name: lang === 'ar' ? 'نظام الإشعارات' : 'Notification System',
      description: lang === 'ar' ? 'تنبيهات ذكية وإشعارات مخصصة' : 'Smart alerts and custom notifications',
      icon: Bell,
      category: 'business'
    },

    // Advanced Features
    {
      id: 'api_integration',
      name: lang === 'ar' ? 'تكامل API خارجي' : 'External API Integration',
      description: lang === 'ar' ? 'ربط مع خدمات وأنظمة خارجية' : 'Integration with external services and systems',
      icon: Globe,
      category: 'advanced'
    },
    {
      id: 'custom_plugins',
      name: lang === 'ar' ? 'نظام إضافات مخصص' : 'Custom Plugin System',
      description: lang === 'ar' ? 'تطوير وتثبيت إضافات مخصصة' : 'Development and installation of custom plugins',
      icon: Code,
      category: 'advanced'
    },
    {
      id: 'cloud_synchronization',
      name: lang === 'ar' ? 'المزامنة السحابية' : 'Cloud Synchronization',
      description: lang === 'ar' ? 'مزامنة البيانات مع الخدمات السحابية' : 'Data synchronization with cloud services',
      icon: Layers,
      category: 'advanced'
    },
    {
      id: 'offline_mode',
      name: lang === 'ar' ? 'وضع العمل دون اتصال' : 'Offline Mode',
      description: lang === 'ar' ? 'إمكانية العمل بدون اتصال بالإنترنت' : 'Ability to work without internet connection',
      icon: Shield,
      category: 'advanced'
    },
    {
      id: 'advanced_security',
      name: lang === 'ar' ? 'أمان متقدم' : 'Advanced Security',
      description: lang === 'ar' ? 'تشفير متقدم وحماية شاملة' : 'Advanced encryption and comprehensive protection',
      icon: Lock,
      category: 'advanced'
    },
    {
      id: 'performance_optimization',
      name: lang === 'ar' ? 'تحسين الأداء' : 'Performance Optimization',
      description: lang === 'ar' ? 'تحسين السرعة واستهلاك الموارد' : 'Speed optimization and resource usage',
      icon: Zap,
      category: 'advanced'
    }
  ];

  // Planning Steps Configuration
  const planSteps = [
    {
      id: 1,
      title: lang === 'ar' ? 'نوع التطبيق' : 'Application Type',
      description: lang === 'ar' ? 'اختر نوع تطبيق سطح المكتب المطلوب' : 'Choose the type of desktop application needed'
    },
    {
      id: 2,
      title: lang === 'ar' ? 'الميزات المطلوبة' : 'Required Features',
      description: lang === 'ar' ? 'حدد الميزات والوظائف المطلوبة' : 'Select the features and functions needed'
    },
    {
      id: 3,
      title: lang === 'ar' ? 'تفاصيل المشروع' : 'Project Details',
      description: lang === 'ar' ? 'أدخل تفاصيل مشروعك والمتطلبات' : 'Enter your project details and requirements'
    },
    {
      id: 4,
      title: lang === 'ar' ? 'الملفات والمستندات' : 'Files & Documents',
      description: lang === 'ar' ? 'ارفع أي ملفات أو مراجع مساعدة' : 'Upload any helpful files or references'
    },
    {
      id: 5,
      title: lang === 'ar' ? 'معلومات التواصل' : 'Contact Information',
      description: lang === 'ar' ? 'أدخل معلومات التواصل لإرسال الطلب' : 'Enter contact information to submit the request'
    }
  ];

  return (
    <>
      <SEOHead 
        title={lang === 'ar' 
          ? "تطوير تطبيقات سطح المكتب - GSC منصة جينيوس الذكية" 
          : "Desktop Application Development - GSC Genius Smart Platform"
        }
        description={lang === 'ar'
          ? "خدمات تطوير تطبيقات سطح المكتب المتقدمة باستخدام أحدث التقنيات والإطارات البرمجية"
          : "Advanced desktop application development services using the latest technologies and frameworks"
        }
        keywords={lang === 'ar' 
          ? "تطوير تطبيقات, سطح المكتب, برامج, أنظمة, إلكترون, دوت نت"
          : "desktop development, applications, software, systems, electron, dotnet"
        }
      />

      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                  {lang === 'ar' ? 'تطوير تطبيقات سطح المكتب' : 'Desktop Application Development'}
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  {lang === 'ar' ? (
                    <>
                      طور تطبيق سطح المكتب
                      <span className="text-blue-600 block">المتخصص لأعمالك</span>
                    </>
                  ) : (
                    <>
                      Develop Your Specialized
                      <span className="text-blue-600 block">Desktop Application</span>
                    </>
                  )}
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {lang === 'ar' 
                    ? 'حلول برمجية متقدمة لسطح المكتب مصممة خصيصاً لاحتياجات عملك مع أحدث التقنيات والأدوات المتطورة'
                    : 'Advanced desktop software solutions tailored to your business needs with the latest technologies and cutting-edge tools'
                  }
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                    onClick={() => setPlanningState(prev => ({ ...prev, currentStep: 1 }))}
                    data-testid="button-start-project"
                  >
                    {lang === 'ar' ? 'ابدأ تخطيط مشروعك' : 'Start Planning Your Project'}
                    <ArrowRight className={cn("w-5 h-5", dir === 'rtl' ? "rotate-180 mr-2" : "ml-2")} />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-3 text-lg"
                    data-testid="button-explore-features"
                  >
                    {lang === 'ar' ? 'استكشف الميزات' : 'Explore Features'}
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Technology Stack Showcase */}
          <div className="container mx-auto px-4 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <p className="text-sm text-gray-500 mb-6">
                {lang === 'ar' ? 'نستخدم أحدث التقنيات في التطوير' : 'Built with the latest development technologies'}
              </p>
              
              <div className="flex justify-center items-center space-x-8 rtl:space-x-reverse">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <SiElectron className="w-8 h-8 text-gray-600 hover:text-blue-600 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Electron</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <SiDotnet className="w-8 h-8 text-gray-600 hover:text-blue-600 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>.NET</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <SiQt className="w-8 h-8 text-gray-600 hover:text-blue-600 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Qt Framework</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <SiPython className="w-8 h-8 text-gray-600 hover:text-blue-600 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Python</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Planning Wizard Section */}
        <section className="py-20 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Progress Indicator */}
              <div className="mb-12">
                <div className="flex items-center justify-center">
                  {planSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300",
                        planningState.currentStep >= step.id
                          ? "bg-primary text-white shadow-lg"
                          : "bg-gray-200 text-gray-500"
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
                  {/* Step 1: Application Type Selection */}
                  {planningState.currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getAppTypes().map((appType) => {
                          const IconComponent = appType.icon;
                          const isSelected = planningState.selectedAppType === appType.id;
                          
                          return (
                            <motion.div
                              key={appType.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Card 
                                className={cn(
                                  "cursor-pointer transition-all duration-300 hover:shadow-lg border-2",
                                  isSelected 
                                    ? "border-primary bg-primary/5 shadow-lg" 
                                    : "border-gray-200 hover:border-primary/50",
                                  appType.bgColor
                                )}
                                onClick={() => setPlanningState(prev => ({ 
                                  ...prev, 
                                  selectedAppType: appType.id 
                                }))}
                                data-testid={`card-app-type-${appType.id}`}
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
                                    {appType.name}
                                  </h3>
                                  
                                  <p className="text-sm text-gray-600 mb-4">
                                    {appType.description}
                                  </p>

                                  <div className="space-y-2">
                                    {appType.features.map((feature, index) => (
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
                            <Label htmlFor="appName">{lang === 'ar' ? 'اسم التطبيق/المشروع' : 'Application/Project Name'}</Label>
                            <Input
                              id="appName"
                              value={planningState.projectDetails.appName}
                              onChange={(e) => setPlanningState(prev => ({
                                ...prev,
                                projectDetails: { ...prev.projectDetails, appName: e.target.value }
                              }))}
                              placeholder={lang === 'ar' ? 'أدخل اسم التطبيق أو المشروع' : 'Enter application or project name'}
                              data-testid="input-app-name"
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
                              placeholder={lang === 'ar' ? 'من سيستخدم هذا التطبيق؟' : 'Who will use this application?'}
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
                                <SelectItem value="10000-25000">{lang === 'ar' ? '10,000 - 25,000 ريال' : '$2,500 - $6,500'}</SelectItem>
                                <SelectItem value="25000-50000">{lang === 'ar' ? '25,000 - 50,000 ريال' : '$6,500 - $13,000'}</SelectItem>
                                <SelectItem value="50000-100000">{lang === 'ar' ? '50,000 - 100,000 ريال' : '$13,000 - $26,000'}</SelectItem>
                                <SelectItem value="100000+">{lang === 'ar' ? 'أكثر من 100,000 ريال' : '$26,000+'}</SelectItem>
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
                                <SelectItem value="2-4weeks">{lang === 'ar' ? '2-4 أسابيع' : '2-4 weeks'}</SelectItem>
                                <SelectItem value="1-2months">{lang === 'ar' ? '1-2 شهر' : '1-2 months'}</SelectItem>
                                <SelectItem value="2-4months">{lang === 'ar' ? '2-4 أشهر' : '2-4 months'}</SelectItem>
                                <SelectItem value="4-6months">{lang === 'ar' ? '4-6 أشهر' : '4-6 months'}</SelectItem>
                                <SelectItem value="6months+">{lang === 'ar' ? 'أكثر من 6 أشهر' : '6+ months'}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="appDescription">{lang === 'ar' ? 'وصف التطبيق' : 'Application Description'}</Label>
                            <Textarea
                              id="appDescription"
                              value={planningState.projectDetails.appDescription}
                              onChange={(e) => setPlanningState(prev => ({
                                ...prev,
                                projectDetails: { ...prev.projectDetails, appDescription: e.target.value }
                              }))}
                              placeholder={lang === 'ar' ? 'صف وظائف وأهداف التطبيق...' : 'Describe the application functions and goals...'}
                              rows={4}
                              data-testid="textarea-app-description"
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
                              ? 'يمكنك رفع التصاميم، المواصفات، أو أي مستندات ذات صلة' 
                              : 'You can upload designs, specifications, or any relevant documents'
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
                            <span className="font-medium">{lang === 'ar' ? 'نوع التطبيق:' : 'Application Type:'}</span>
                            <span className="ml-2 rtl:mr-2">
                              {getAppTypes().find(type => type.id === planningState.selectedAppType)?.name}
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
                        if (planningState.currentStep === 1 && !planningState.selectedAppType) {
                          toast({
                            title: lang === 'ar' ? 'اختيار مطلوب' : 'Selection Required',
                            description: lang === 'ar' ? 'يرجى اختيار نوع التطبيق' : 'Please select an application type',
                            variant: 'destructive'
                          });
                          return;
                        }
                        
                        if (planningState.currentStep === 3) {
                          const { appName, appDescription, targetAudience } = planningState.projectDetails;
                          if (!appName.trim() || !appDescription.trim() || !targetAudience.trim()) {
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
                        (planningState.currentStep === 1 && !planningState.selectedAppType) ||
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
        </section>
      </div>
    </>
  );
}