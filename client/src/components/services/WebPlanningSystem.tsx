import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/i18n/lang";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import {
  Globe,
  Shield,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  ShoppingCart,
  GraduationCap,
  Heart,
  Users,
  Calendar,
  MapPin,
  Zap,
  Star,
  Play,
  Settings,
  Camera,
  MessageCircle,
  CreditCard,
  BarChart3,
  Lock,
  Bell,
  Share2,
  Code,
  Database,
  Cloud,
  Building,
  Trophy,
  BookOpen,
  Activity,
  Sparkles,
  PlusCircle,
  Send,
  X,
  Briefcase,
  Monitor,
  Layers,
  Search,
  Palette,
  ShoppingBag,
  Newspaper,
  Rocket,
  Layout,
  Smartphone
} from "lucide-react";

interface WebPlanningStep {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  completed: boolean;
}

interface WebTypeOption {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: any;
  color: string;
  bgColor: string;
  features: string[];
  featuresAr: string[];
}

interface FeatureOption {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: any;
  category: 'core' | 'business' | 'advanced';
  required: boolean;
}

interface PlatformOption {
  id: 'desktop' | 'mobile' | 'both';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: any;
  recommended?: boolean;
}

interface ProjectDetails {
  webType: string;
  platforms: string[];
  features: string[];
  projectName: string;
  projectDescription: string;
  timeline: string;
  budget: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  additionalNotes: string;
  files: File[];
}

export default function WebPlanningSystem() {
  const { dir, lang } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    webType: '',
    platforms: ['both'],
    features: ['responsive_design', 'ssl_security', 'seo_optimization'],
    projectName: '',
    projectDescription: '',
    timeline: '',
    budget: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    additionalNotes: '',
    files: []
  });

  // Steps definition
  const steps: WebPlanningStep[] = [
    {
      id: 0,
      title: "Website Type",
      titleAr: "نوع الموقع",
      description: "Choose your website type",
      descriptionAr: "اختر نوع موقعك",
      completed: !!projectDetails.webType
    },
    {
      id: 1,
      title: "Platform Focus",
      titleAr: "التركيز على المنصة",
      description: "Select target platforms",
      descriptionAr: "اختر المنصات المستهدفة",
      completed: projectDetails.platforms.length > 0
    },
    {
      id: 2,
      title: "Features",
      titleAr: "الميزات",
      description: "Select website features",
      descriptionAr: "اختر ميزات الموقع",
      completed: projectDetails.features.length > 0
    },
    {
      id: 3,
      title: "Project Details",
      titleAr: "تفاصيل المشروع",
      description: "Tell us about your project",
      descriptionAr: "أخبرنا عن مشروعك",
      completed: !!(projectDetails.projectName && projectDetails.projectDescription)
    },
    {
      id: 4,
      title: "File Upload",
      titleAr: "رفع الملفات",
      description: "Upload relevant files",
      descriptionAr: "ارفع الملفات ذات الصلة",
      completed: true // Optional step
    },
    {
      id: 5,
      title: "Contact Info",
      titleAr: "معلومات التواصل",
      description: "Your contact information",
      descriptionAr: "معلومات التواصل",
      completed: !!(projectDetails.contactName && projectDetails.contactEmail)
    },
    {
      id: 6,
      title: "Review & Submit",
      titleAr: "مراجعة وإرسال",
      description: "Review and submit your request",
      descriptionAr: "راجع وأرسل طلبك",
      completed: false
    }
  ];

  // Website types definition
  const webTypes: WebTypeOption[] = [
    {
      id: 'corporate',
      title: 'Corporate Website',
      titleAr: 'موقع شركة',
      description: 'Professional business websites',
      descriptionAr: 'مواقع الأعمال الاحترافية',
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      features: ['Company Pages', 'Portfolio', 'Contact Forms', 'Team Showcase'],
      featuresAr: ['صفحات الشركة', 'معرض الأعمال', 'نماذج التواصل', 'عرض الفريق']
    },
    {
      id: 'ecommerce',
      title: 'E-commerce Store',
      titleAr: 'متجر إلكتروني',
      description: 'Online stores and shopping websites',
      descriptionAr: 'المتاجر الإلكترونية ومواقع التسوق',
      icon: ShoppingBag,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      features: ['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Inventory'],
      featuresAr: ['كتالوج المنتجات', 'سلة التسوق', 'بوابة الدفع', 'إدارة المخزون']
    },
    {
      id: 'blog',
      title: 'Blog/Magazine',
      titleAr: 'مدونة/مجلة',
      description: 'Content publishing platforms',
      descriptionAr: 'منصات نشر المحتوى',
      icon: Newspaper,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      features: ['Article Management', 'Categories', 'Comments', 'Newsletter'],
      featuresAr: ['إدارة المقالات', 'التصنيفات', 'التعليقات', 'النشرة البريدية']
    },
    {
      id: 'portfolio',
      title: 'Portfolio Website',
      titleAr: 'موقع بورتفوليو',
      description: 'Creative showcase websites',
      descriptionAr: 'مواقع عرض الأعمال الإبداعية',
      icon: Palette,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      features: ['Gallery', 'Project Showcase', 'Client Reviews', 'Contact'],
      featuresAr: ['معرض الصور', 'عرض المشاريع', 'تقييمات العملاء', 'التواصل']
    },
    {
      id: 'educational',
      title: 'Educational Platform',
      titleAr: 'منصة تعليمية',
      description: 'Learning management systems',
      descriptionAr: 'أنظمة إدارة التعلم',
      icon: GraduationCap,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      features: ['Course Management', 'Student Portal', 'Assessments', 'Certificates'],
      featuresAr: ['إدارة الدورات', 'بوابة الطلاب', 'التقييمات', 'الشهادات']
    },
    {
      id: 'landing',
      title: 'Landing Page',
      titleAr: 'صفحة هبوط',
      description: 'High-converting single pages',
      descriptionAr: 'صفحات فردية عالية التحويل',
      icon: Rocket,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      features: ['Call-to-Action', 'Lead Forms', 'Analytics', 'A/B Testing'],
      featuresAr: ['دعوة للعمل', 'نماذج العملاء المحتملين', 'التحليلات', 'اختبار A/B']
    }
  ];

  // Platform options
  const platformOptions: PlatformOption[] = [
    {
      id: 'both',
      title: 'Both Desktop & Mobile',
      titleAr: 'سطح المكتب والهاتف',
      description: 'Fully responsive design for all devices',
      descriptionAr: 'تصميم متجاوب بالكامل لجميع الأجهزة',
      icon: Globe,
      recommended: true
    },
    {
      id: 'desktop',
      title: 'Desktop Focus',
      titleAr: 'التركيز على سطح المكتب',
      description: 'Optimized primarily for desktop users',
      descriptionAr: 'محسن بشكل أساسي لمستخدمي سطح المكتب',
      icon: Monitor
    },
    {
      id: 'mobile',
      title: 'Mobile Focus',
      titleAr: 'التركيز على الهاتف',
      description: 'Mobile-first responsive design',
      descriptionAr: 'تصميم متجاوب يركز على الهاتف أولاً',
      icon: Smartphone
    }
  ];

  // Feature options
  const featureOptions: FeatureOption[] = [
    // Core Features
    {
      id: 'responsive_design',
      title: 'Responsive Design',
      titleAr: 'تصميم متجاوب',
      description: 'Works perfectly on all devices',
      descriptionAr: 'يعمل بشكل مثالي على جميع الأجهزة',
      icon: Monitor,
      category: 'core',
      required: true
    },
    {
      id: 'ssl_security',
      title: 'SSL Security',
      titleAr: 'أمان SSL',
      description: 'Secure encrypted connections',
      descriptionAr: 'اتصالات مشفرة آمنة',
      icon: Shield,
      category: 'core',
      required: true
    },
    {
      id: 'seo_optimization',
      title: 'SEO Optimization',
      titleAr: 'تحسين محركات البحث',
      description: 'Better search engine visibility',
      descriptionAr: 'ظهور أفضل في محركات البحث',
      icon: Search,
      category: 'core',
      required: true
    },
    {
      id: 'performance',
      title: 'Performance Optimization',
      titleAr: 'تحسين الأداء',
      description: 'Fast loading times',
      descriptionAr: 'أوقات تحميل سريعة',
      icon: Zap,
      category: 'core',
      required: false
    },

    // Business Features
    {
      id: 'cms',
      title: 'Content Management',
      titleAr: 'إدارة المحتوى',
      description: 'Easy content updates',
      descriptionAr: 'تحديث سهل للمحتوى',
      icon: Settings,
      category: 'business',
      required: false
    },
    {
      id: 'user_accounts',
      title: 'User Accounts',
      titleAr: 'حسابات المستخدمين',
      description: 'User registration and login',
      descriptionAr: 'تسجيل ودخول المستخدمين',
      icon: Users,
      category: 'business',
      required: false
    },
    {
      id: 'contact_forms',
      title: 'Contact Forms',
      titleAr: 'نماذج التواصل',
      description: 'Custom contact and inquiry forms',
      descriptionAr: 'نماذج تواصل واستفسار مخصصة',
      icon: MessageCircle,
      category: 'business',
      required: false
    },
    {
      id: 'analytics',
      title: 'Analytics Integration',
      titleAr: 'تكامل التحليلات',
      description: 'Track visitors and performance',
      descriptionAr: 'تتبع الزوار والأداء',
      icon: BarChart3,
      category: 'business',
      required: false
    },
    {
      id: 'social_media',
      title: 'Social Media Integration',
      titleAr: 'تكامل وسائل التواصل',
      description: 'Connect with social platforms',
      descriptionAr: 'الاتصال بمنصات التواصل الاجتماعي',
      icon: Share2,
      category: 'business',
      required: false
    },
    {
      id: 'newsletter',
      title: 'Newsletter Signup',
      titleAr: 'اشتراك النشرة البريدية',
      description: 'Email marketing integration',
      descriptionAr: 'تكامل التسويق عبر البريد الإلكتروني',
      icon: Bell,
      category: 'business',
      required: false
    },

    // Advanced Features
    {
      id: 'ecommerce_cart',
      title: 'Shopping Cart',
      titleAr: 'سلة التسوق',
      description: 'Full e-commerce functionality',
      descriptionAr: 'وظائف التجارة الإلكترونية الكاملة',
      icon: ShoppingCart,
      category: 'advanced',
      required: false
    },
    {
      id: 'payment_gateway',
      title: 'Payment Gateway',
      titleAr: 'بوابة الدفع',
      description: 'Secure online payments',
      descriptionAr: 'مدفوعات آمنة عبر الإنترنت',
      icon: CreditCard,
      category: 'advanced',
      required: false
    },
    {
      id: 'multi_language',
      title: 'Multi-Language Support',
      titleAr: 'دعم متعدد اللغات',
      description: 'Support for multiple languages',
      descriptionAr: 'دعم للغات متعددة',
      icon: Globe,
      category: 'advanced',
      required: false
    },
    {
      id: 'api_integration',
      title: 'API Integration',
      titleAr: 'تكامل واجهة البرمجة',
      description: 'Connect with external services',
      descriptionAr: 'الاتصال بالخدمات الخارجية',
      icon: Code,
      category: 'advanced',
      required: false
    },
    {
      id: 'booking_system',
      title: 'Booking System',
      titleAr: 'نظام الحجز',
      description: 'Appointment and reservation system',
      descriptionAr: 'نظام المواعيد والحجوزات',
      icon: Calendar,
      category: 'advanced',
      required: false
    },
    {
      id: 'live_chat',
      title: 'Live Chat Support',
      titleAr: 'دعم الدردشة المباشرة',
      description: 'Real-time customer support',
      descriptionAr: 'دعم العملاء في الوقت الفعلي',
      icon: MessageCircle,
      category: 'advanced',
      required: false
    }
  ];

  // Calculate progress
  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  // Handle navigation
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepChange = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  // Handle selections
  const handleWebTypeSelect = (typeId: string) => {
    setProjectDetails(prev => ({ ...prev, webType: typeId }));
    
    // Auto-select relevant features based on web type
    let autoFeatures = ['responsive_design', 'ssl_security', 'seo_optimization'];
    
    if (typeId === 'ecommerce') {
      autoFeatures.push('ecommerce_cart', 'payment_gateway', 'user_accounts');
    } else if (typeId === 'blog') {
      autoFeatures.push('cms', 'social_media', 'newsletter');
    } else if (typeId === 'corporate') {
      autoFeatures.push('contact_forms', 'analytics', 'cms');
    } else if (typeId === 'educational') {
      autoFeatures.push('user_accounts', 'cms', 'analytics');
    } else if (typeId === 'portfolio') {
      autoFeatures.push('contact_forms', 'social_media');
    } else if (typeId === 'landing') {
      autoFeatures.push('contact_forms', 'analytics');
    }
    
    setProjectDetails(prev => ({ ...prev, features: autoFeatures }));
  };

  const handlePlatformSelect = (platforms: string[]) => {
    setProjectDetails(prev => ({ ...prev, platforms }));
  };

  const handleFeatureToggle = (featureId: string, checked: boolean) => {
    const feature = featureOptions.find(f => f.id === featureId);
    
    // Prevent removing required features
    if (!checked && feature?.required) {
      toast({
        title: lang === 'ar' ? 'ميزة مطلوبة' : 'Required Feature',
        description: lang === 'ar' ? 'لا يمكن إلغاء تحديد الميزات المطلوبة' : 'Cannot uncheck required features',
        variant: 'destructive'
      });
      return;
    }
    
    setProjectDetails(prev => {
      const features = checked 
        ? [...prev.features, featureId]
        : prev.features.filter(f => f !== featureId);
      return { ...prev, features };
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'text/plain', 'application/zip'];
      const maxSize = 10 * 1024 * 1024; // 10MB to match mobile wizard
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== files.length) {
      toast({
        title: lang === 'ar' ? 'تحذير' : 'Warning',
        description: lang === 'ar' ? 'بعض الملفات لم يتم قبولها. يرجى التأكد من نوع وحجم الملف.' : 'Some files were not accepted. Please check file type and size.',
        variant: 'destructive'
      });
    }

    const totalFiles = uploadedFiles.length + validFiles.length;
    if (totalFiles > 5) { // Changed to 5 to match mobile wizard
      toast({
        title: lang === 'ar' ? 'تحذير' : 'Warning',
        description: lang === 'ar' ? 'يمكن رفع 5 ملفات كحد أقصى' : 'Maximum 5 files can be uploaded',
        variant: 'destructive'
      });
      return;
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
    setProjectDetails(prev => ({ ...prev, files: [...prev.files, ...validFiles] }));
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setProjectDetails(prev => ({ 
      ...prev, 
      files: prev.files.filter((_, i) => i !== index) 
    }));
  };

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      
      // Add customer information
      formData.append('customerName', projectDetails.contactName);
      formData.append('customerEmail', projectDetails.contactEmail);
      formData.append('customerPhone', projectDetails.contactPhone);
      
      // Add project details
      formData.append('siteType', projectDetails.webType);
      formData.append('contentScope', projectDetails.projectDescription);
      formData.append('domainHosting', 'managed'); // Default
      formData.append('languages', JSON.stringify(['ar', 'en'])); // Default
      formData.append('integrations', JSON.stringify([])); // Default
      formData.append('selectedFeatures', JSON.stringify(projectDetails.features));
      formData.append('notes', projectDetails.additionalNotes);
      
      // Add timeline and budget if provided
      if (projectDetails.timeline) {
        formData.append('preferredTimeline', projectDetails.timeline);
      }
      if (projectDetails.budget) {
        formData.append('estimatedBudget', projectDetails.budget);
      }
      
      // Add files
      projectDetails.files.forEach((file) => {
        formData.append('attachedFiles', file);
      });

      const response = await fetch('/api/web-orders', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to submit request' }));
        throw new Error(errorData.message || 'Failed to submit request');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: lang === 'ar' ? 'تم إرسال الطلب بنجاح' : 'Request submitted successfully',
        description: lang === 'ar' ? 'سنتواصل معك قريباً لمناقشة تفاصيل المشروع' : 'We will contact you soon to discuss project details',
      });
      
      // Reset form
      setProjectDetails({
        webType: '',
        platforms: ['both'],
        features: ['responsive_design', 'ssl_security', 'seo_optimization'],
        projectName: '',
        projectDescription: '',
        timeline: '',
        budget: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        additionalNotes: '',
        files: []
      });
      setUploadedFiles([]);
      setCurrentStep(0);
    },
    onError: () => {
      toast({
        title: lang === 'ar' ? 'حدث خطأ' : 'Error occurred',
        description: lang === 'ar' ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.' : 'Error submitting request. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = () => {
    // Basic validation
    const errors: string[] = [];
    
    if (!projectDetails.contactName.trim()) {
      errors.push(lang === 'ar' ? 'اسم جهة الاتصال مطلوب' : 'Contact name is required');
    }
    
    if (!projectDetails.contactEmail.trim()) {
      errors.push(lang === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required');
    } else if (!/\S+@\S+\.\S+/.test(projectDetails.contactEmail)) {
      errors.push(lang === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Email is invalid');
    }
    
    if (!projectDetails.projectName.trim()) {
      errors.push(lang === 'ar' ? 'اسم المشروع مطلوب' : 'Project name is required');
    }
    
    if (!projectDetails.projectDescription.trim()) {
      errors.push(lang === 'ar' ? 'وصف المشروع مطلوب' : 'Project description is required');
    }
    
    if (!projectDetails.webType) {
      errors.push(lang === 'ar' ? 'نوع الموقع مطلوب' : 'Website type is required');
    }
    
    if (errors.length > 0) {
      toast({
        title: lang === 'ar' ? 'خطأ في النموذج' : 'Form Error',
        description: errors.join('. '),
        variant: 'destructive'
      });
      return;
    }
    
    submitMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {lang === 'ar' ? 'خطط مشروع موقعك' : 'Plan Your Website Project'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {lang === 'ar' 
              ? 'دعنا نساعدك في إنشاء موقع الويب المثالي لاحتياجاتك من خلال هذه الخطوات البسيطة'
              : 'Let us help you create the perfect website for your needs through these simple steps'
            }
          </p>
          
          {/* Progress bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{lang === 'ar' ? 'التقدم' : 'Progress'}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </motion.div>

        {/* Main Card */}
        <Card className="max-w-4xl mx-auto shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold">
              {lang === 'ar' ? `الخطوة ${currentStep + 1} من ${steps.length}` : `Step ${currentStep + 1} of ${steps.length}`}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {lang === 'ar' ? steps[currentStep]?.descriptionAr : steps[currentStep]?.description}
            </p>
          </CardHeader>

          <CardContent>
            {/* Step Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {steps.map((step, index) => (
                <motion.button
                  key={step.id}
                  onClick={() => handleStepChange(index)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium transition-all",
                    index <= currentStep
                      ? "bg-[hsl(213,94%,68%)] text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
                    index === currentStep && "ring-2 ring-[hsl(213,94%,68%)]/50 ring-offset-2"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid={`step-${index}`}
                >
                  {lang === 'ar' ? step.titleAr : step.title}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[400px]"
              >
                {/* Step 0: Website Type Selection */}
                {currentStep === 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6 text-center">
                      {lang === 'ar' ? 'ما نوع الموقع الذي تريد إنشاؤه؟' : 'What type of website do you want to create?'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {webTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = projectDetails.webType === type.id;
                        return (
                          <motion.div
                            key={type.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleWebTypeSelect(type.id)}
                            className={cn(
                              "cursor-pointer rounded-lg border-2 p-6 transition-all",
                              isSelected
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            )}
                            data-testid={`web-type-${type.id}`}
                          >
                            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-4", type.bgColor)}>
                              <Icon className={cn("w-6 h-6", type.color)} />
                            </div>
                            <h4 className="font-semibold text-lg mb-2">
                              {lang === 'ar' ? type.titleAr : type.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                              {lang === 'ar' ? type.descriptionAr : type.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {(lang === 'ar' ? type.featuresAr : type.features).slice(0, 3).map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="mt-4 flex items-center justify-center"
                              >
                                <CheckCircle className="w-6 h-6 text-green-600" />
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 1: Platform Selection */}
                {currentStep === 1 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6 text-center">
                      {lang === 'ar' ? 'اختر التركيز على المنصة' : 'Choose Platform Focus'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                      {platformOptions.map((platform) => {
                        const Icon = platform.icon;
                        const isSelected = projectDetails.platforms.includes(platform.id);
                        return (
                          <motion.div
                            key={platform.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              if (platform.id === 'both') {
                                handlePlatformSelect(['both']);
                              } else if (isSelected) {
                                handlePlatformSelect(
                                  projectDetails.platforms.filter(p => p !== platform.id)
                                );
                              } else {
                                handlePlatformSelect(
                                  [...projectDetails.platforms.filter(p => p !== 'both'), platform.id]
                                );
                              }
                            }}
                            className={cn(
                              "cursor-pointer rounded-lg border-2 p-8 text-center transition-all relative",
                              isSelected
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            )}
                            data-testid={`platform-${platform.id}`}
                          >
                            {platform.recommended && (
                              <Badge className="absolute -top-2 -right-2 bg-green-600">
                                {lang === 'ar' ? 'مُوصى به' : 'Recommended'}
                              </Badge>
                            )}
                            <div className="flex items-center justify-center mb-4">
                              <Icon className="w-16 h-16 text-gray-700 dark:text-gray-300" />
                            </div>
                            <h4 className="font-semibold text-lg mb-2">
                              {lang === 'ar' ? platform.titleAr : platform.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                              {lang === 'ar' ? platform.descriptionAr : platform.description}
                            </p>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="mt-4 flex items-center justify-center"
                              >
                                <CheckCircle className="w-6 h-6 text-green-600" />
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 2: Features Selection */}
                {currentStep === 2 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6 text-center">
                      {lang === 'ar' ? 'اختر ميزات موقعك' : 'Choose Your Website Features'}
                    </h3>
                    
                    {['core', 'business', 'advanced'].map((category) => (
                      <div key={category} className="mb-8">
                        <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                          {category === 'core' && <Shield className="w-5 h-5 text-blue-600" />}
                          {category === 'business' && <Briefcase className="w-5 h-5 text-green-600" />}
                          {category === 'advanced' && <Sparkles className="w-5 h-5 text-purple-600" />}
                          {lang === 'ar' 
                            ? (category === 'core' ? 'الميزات الأساسية' : category === 'business' ? 'ميزات الأعمال' : 'الميزات المتقدمة')
                            : (category === 'core' ? 'Core Features' : category === 'business' ? 'Business Features' : 'Advanced Features')
                          }
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {featureOptions
                            .filter(feature => feature.category === category)
                            .map((feature) => {
                              const Icon = feature.icon;
                              const isSelected = projectDetails.features.includes(feature.id);
                              return (
                                <motion.div
                                  key={feature.id}
                                  className={cn(
                                    "flex items-start gap-4 p-4 rounded-lg border transition-all",
                                    isSelected
                                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                      : "border-gray-200 dark:border-gray-700"
                                  )}
                                  data-testid={`feature-${feature.id}`}
                                >
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked) => 
                                      handleFeatureToggle(feature.id, !!checked)
                                    }
                                    disabled={feature.required}
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-start gap-3">
                                      <Icon className="w-5 h-5 text-blue-600 mt-0.5" />
                                      <div>
                                        <h5 className="font-medium flex items-center gap-2">
                                          {lang === 'ar' ? feature.titleAr : feature.title}
                                          {feature.required && (
                                            <Badge variant="secondary" className="text-xs">
                                              {lang === 'ar' ? 'مطلوب' : 'Required'}
                                            </Badge>
                                          )}
                                        </h5>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                          {lang === 'ar' ? feature.descriptionAr : feature.description}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 3: Project Details */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-6 text-center">
                      {lang === 'ar' ? 'أخبرنا عن مشروعك' : 'Tell Us About Your Project'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="projectName">
                          {lang === 'ar' ? 'اسم المشروع *' : 'Project Name *'}
                        </Label>
                        <Input
                          id="projectName"
                          value={projectDetails.projectName}
                          onChange={(e) => setProjectDetails(prev => ({ ...prev, projectName: e.target.value }))}
                          placeholder={lang === 'ar' ? 'أدخل اسم المشروع' : 'Enter project name'}
                          className="mt-2"
                          data-testid="input-project-name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="timeline">
                          {lang === 'ar' ? 'الإطار الزمني المتوقع' : 'Expected Timeline'}
                        </Label>
                        <Select onValueChange={(value) => setProjectDetails(prev => ({ ...prev, timeline: value }))}>
                          <SelectTrigger className="mt-2" data-testid="select-timeline">
                            <SelectValue placeholder={lang === 'ar' ? 'اختر الإطار الزمني' : 'Select timeline'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-2-weeks">{lang === 'ar' ? '1-2 أسبوع' : '1-2 weeks'}</SelectItem>
                            <SelectItem value="3-4-weeks">{lang === 'ar' ? '3-4 أسابيع' : '3-4 weeks'}</SelectItem>
                            <SelectItem value="1-2-months">{lang === 'ar' ? '1-2 شهر' : '1-2 months'}</SelectItem>
                            <SelectItem value="3-plus-months">{lang === 'ar' ? 'أكثر من 3 أشهر' : '3+ months'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="projectDescription">
                        {lang === 'ar' ? 'وصف المشروع *' : 'Project Description *'}
                      </Label>
                      <Textarea
                        id="projectDescription"
                        value={projectDetails.projectDescription}
                        onChange={(e) => setProjectDetails(prev => ({ ...prev, projectDescription: e.target.value }))}
                        placeholder={lang === 'ar' ? 'أخبرنا المزيد عن فكرة موقعك وأهدافك ومميزاته المطلوبة' : 'Tell us more about your website idea, goals, and required features'}
                        rows={4}
                        className="mt-2"
                        data-testid="textarea-project-description"
                      />
                    </div>

                    <div>
                      <Label htmlFor="budget">
                        {lang === 'ar' ? 'الميزانية المتوقعة' : 'Expected Budget'}
                      </Label>
                      <Select onValueChange={(value) => setProjectDetails(prev => ({ ...prev, budget: value }))}>
                        <SelectTrigger className="mt-2" data-testid="select-budget">
                          <SelectValue placeholder={lang === 'ar' ? 'اختر الميزانية' : 'Select budget range'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1k-3k">$1,000 - $3,000</SelectItem>
                          <SelectItem value="3k-7k">$3,000 - $7,000</SelectItem>
                          <SelectItem value="7k-15k">$7,000 - $15,000</SelectItem>
                          <SelectItem value="15k-plus">$15,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 4: File Upload */}
                {currentStep === 4 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6 text-center">
                      {lang === 'ar' ? 'ارفع الملفات ذات الصلة' : 'Upload Relevant Files'}
                    </h3>
                    <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
                      {lang === 'ar' 
                        ? 'يمكنك رفع أي مستندات، تصاميم، أو ملفات أخرى تساعدنا في فهم مشروعك بشكل أفضل'
                        : 'Upload any documents, designs, or other files that help us understand your project better'
                      }
                    </p>

                    <div 
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="file-upload-area"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">
                        {lang === 'ar' ? 'انقر لرفع الملفات أو اسحب الملفات هنا' : 'Click to upload files or drag files here'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {lang === 'ar' ? 'يدعم: PDF, DOC, DOCX, JPG, PNG, ZIP (الحد الأقصى: 10 ملفات، 5MB لكل ملف)' : 'Supported: PDF, DOC, DOCX, JPG, PNG, ZIP (Max: 10 files, 5MB each)'}
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                      onChange={handleFileUpload}
                      className="hidden"
                      data-testid="file-input"
                    />

                    {uploadedFiles.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-4">
                          {lang === 'ar' ? 'الملفات المرفوعة:' : 'Uploaded Files:'}
                        </h4>
                        <div className="space-y-3">
                          {uploadedFiles.map((file, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                              data-testid={`uploaded-file-${index}`}
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <div>
                                  <p className="font-medium">{file.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                data-testid={`remove-file-${index}`}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 5: Contact Information */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-6 text-center">
                      {lang === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="contactName">
                          {lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                        </Label>
                        <Input
                          id="contactName"
                          value={projectDetails.contactName}
                          onChange={(e) => setProjectDetails(prev => ({ ...prev, contactName: e.target.value }))}
                          placeholder={lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                          className="mt-2"
                          data-testid="input-contact-name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="contactPhone">
                          {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                        </Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          value={projectDetails.contactPhone}
                          onChange={(e) => setProjectDetails(prev => ({ ...prev, contactPhone: e.target.value }))}
                          placeholder={lang === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                          className="mt-2"
                          data-testid="input-contact-phone"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contactEmail">
                        {lang === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                      </Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={projectDetails.contactEmail}
                        onChange={(e) => setProjectDetails(prev => ({ ...prev, contactEmail: e.target.value }))}
                        placeholder={lang === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter email address'}
                        className="mt-2"
                        data-testid="input-contact-email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="additionalNotes">
                        {lang === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                      </Label>
                      <Textarea
                        id="additionalNotes"
                        value={projectDetails.additionalNotes}
                        onChange={(e) => setProjectDetails(prev => ({ ...prev, additionalNotes: e.target.value }))}
                        placeholder={lang === 'ar' ? 'أي ملاحظات أو متطلبات إضافية' : 'Any additional notes or requirements'}
                        rows={3}
                        className="mt-2"
                        data-testid="textarea-additional-notes"
                      />
                    </div>
                  </div>
                )}

                {/* Step 6: Review & Submit */}
                {currentStep === 6 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6 text-center">
                      {lang === 'ar' ? 'مراجعة وتأكيد الطلب' : 'Review & Submit Request'}
                    </h3>
                    
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {lang === 'ar' ? 'ملخص المشروع' : 'Project Summary'}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">
                              {lang === 'ar' ? 'نوع الموقع' : 'Website Type'}
                            </Label>
                            <p className="mt-1">
                              {webTypes.find(t => t.id === projectDetails.webType)?.[lang === 'ar' ? 'titleAr' : 'title']}
                            </p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-gray-500">
                              {lang === 'ar' ? 'التركيز على المنصة' : 'Platform Focus'}
                            </Label>
                            <p className="mt-1">
                              {projectDetails.platforms.map(p => 
                                platformOptions.find(opt => opt.id === p)?.[lang === 'ar' ? 'titleAr' : 'title']
                              ).join(', ')}
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-500">
                              {lang === 'ar' ? 'الميزات المختارة' : 'Selected Features'}
                            </Label>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {projectDetails.features.map(featureId => {
                                const feature = featureOptions.find(f => f.id === featureId);
                                return feature ? (
                                  <Badge key={featureId} variant="secondary">
                                    {lang === 'ar' ? feature.titleAr : feature.title}
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-500">
                              {lang === 'ar' ? 'اسم المشروع' : 'Project Name'}
                            </Label>
                            <p className="mt-1">{projectDetails.projectName}</p>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-500">
                              {lang === 'ar' ? 'وصف المشروع' : 'Project Description'}
                            </Label>
                            <p className="mt-1 text-sm">{projectDetails.projectDescription}</p>
                          </div>

                          {projectDetails.timeline && (
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                {lang === 'ar' ? 'الإطار الزمني' : 'Timeline'}
                              </Label>
                              <p className="mt-1">{projectDetails.timeline}</p>
                            </div>
                          )}

                          {projectDetails.budget && (
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                {lang === 'ar' ? 'الميزانية' : 'Budget'}
                              </Label>
                              <p className="mt-1">{projectDetails.budget}</p>
                            </div>
                          )}

                          <div>
                            <Label className="text-sm font-medium text-gray-500">
                              {lang === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
                            </Label>
                            <div className="mt-1 space-y-1">
                              <p>{projectDetails.contactName}</p>
                              <p>{projectDetails.contactEmail}</p>
                              {projectDetails.contactPhone && <p>{projectDetails.contactPhone}</p>}
                            </div>
                          </div>

                          {uploadedFiles.length > 0 && (
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                {lang === 'ar' ? 'الملفات المرفوعة' : 'Uploaded Files'}
                              </Label>
                              <div className="mt-1 space-y-1">
                                {uploadedFiles.map((file, index) => (
                                  <p key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    {file.name}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
                        <h4 className="font-semibold text-lg mb-2">
                          {lang === 'ar' ? 'الخطوات التالية' : 'Next Steps'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {lang === 'ar' 
                            ? 'بعد إرسال طلبك، سيتواصل معك فريقنا خلال 24 ساعة لمناقشة تفاصيل المشروع وبدء العمل'
                            : 'After submitting your request, our team will contact you within 24 hours to discuss project details and begin work'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
                data-testid="button-previous"
              >
                <ArrowLeft className="w-4 h-4" />
                {lang === 'ar' ? 'السابق' : 'Previous'}
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending || !projectDetails.contactName || !projectDetails.contactEmail || !projectDetails.projectName || !projectDetails.projectDescription}
                  className="flex items-center gap-2"
                  data-testid="button-submit"
                >
                  {submitMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {lang === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 0 && !projectDetails.webType) ||
                    (currentStep === 1 && projectDetails.platforms.length === 0) ||
                    (currentStep === 3 && (!projectDetails.projectName || !projectDetails.projectDescription)) ||
                    (currentStep === 5 && (!projectDetails.contactName || !projectDetails.contactEmail))
                  }
                  className="flex items-center gap-2"
                  data-testid="button-next"
                >
                  {lang === 'ar' ? 'التالي' : 'Next'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}