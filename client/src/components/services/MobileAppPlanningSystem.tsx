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
  Smartphone,
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
  Globe,
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
  Gamepad2,
  Music,
  Car,
  Home,
  Briefcase,
  Calculator,
  Send,
  Apple,
  X,
  Building,
  Trophy,
  BookOpen,
  Activity,
  Sparkles,
  PlusCircle
} from "lucide-react";
import { SiAndroid } from "react-icons/si";

interface AppPlanningStep {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  completed: boolean;
}

interface AppTypeOption {
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
  id: 'ios' | 'android' | 'both';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: any;
  recommended?: boolean;
}

interface ProjectDetails {
  appType: string;
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

export default function MobileAppPlanningSystem() {
  const { dir, lang } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    appType: '',
    platforms: [],
    features: [],
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

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const steps: AppPlanningStep[] = [
    {
      id: 0,
      title: "Choose App Type",
      titleAr: "اختر نوع التطبيق",
      description: "What type of mobile app do you want to create?",
      descriptionAr: "ما نوع تطبيق الموبايل الذي تريد إنشاءه؟",
      completed: false
    },
    {
      id: 1,
      title: "Select Platform",
      titleAr: "اختر المنصة",
      description: "Which platforms do you want to target?",
      descriptionAr: "ما المنصات التي تريد استهدافها؟",
      completed: false
    },
    {
      id: 2,
      title: "Choose Features",
      titleAr: "اختر المميزات",
      description: "What features do you need in your app?",
      descriptionAr: "ما المميزات التي تحتاجها في تطبيقك؟",
      completed: false
    },
    {
      id: 3,
      title: "Project Details",
      titleAr: "تفاصيل المشروع",
      description: "Tell us more about your project",
      descriptionAr: "أخبرنا المزيد عن مشروعك",
      completed: false
    },
    {
      id: 4,
      title: "Upload Files",
      titleAr: "رفع الملفات",
      description: "Upload any relevant files or documents",
      descriptionAr: "ارفع أي ملفات أو مستندات ذات صلة",
      completed: false
    },
    {
      id: 5,
      title: "Contact Information",
      titleAr: "معلومات الاتصال",
      description: "How can we reach you?",
      descriptionAr: "كيف يمكننا التواصل معك؟",
      completed: false
    },
    {
      id: 6,
      title: "Review & Submit",
      titleAr: "مراجعة وإرسال",
      description: "Review your request before submitting",
      descriptionAr: "راجع طلبك قبل الإرسال",
      completed: false
    }
  ];

  const appTypes: AppTypeOption[] = [
    {
      id: 'ecommerce',
      title: 'E-commerce',
      titleAr: 'التجارة الإلكترونية',
      description: 'Online shopping and marketplace applications',
      descriptionAr: 'تطبيقات التسوق الإلكتروني والأسواق الرقمية',
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      features: ['Product catalog', 'Shopping cart', 'Payment integration', 'Order tracking', 'Reviews'],
      featuresAr: ['كتالوج المنتجات', 'سلة التسوق', 'تكامل الدفع', 'تتبع الطلبات', 'التقييمات']
    },
    {
      id: 'educational',
      title: 'Educational',
      titleAr: 'التعليمية',
      description: 'Learning management and educational content apps',
      descriptionAr: 'تطبيقات إدارة التعلم والمحتوى التعليمي',
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      features: ['Course management', 'Video streaming', 'Quiz system', 'Progress tracking', 'Certificates'],
      featuresAr: ['إدارة الدورات', 'البث المرئي', 'نظام الاختبارات', 'تتبع التقدم', 'الشهادات']
    },
    {
      id: 'healthcare',
      title: 'Healthcare',
      titleAr: 'الصحية',
      description: 'Medical and health monitoring applications',
      descriptionAr: 'تطبيقات طبية ومراقبة الصحة',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      features: ['Appointment booking', 'Health records', 'Telemedicine', 'Medication reminders'],
      featuresAr: ['حجز المواعيد', 'السجلات الصحية', 'الطب عن بُعد', 'تذكير الأدوية']
    },
    {
      id: 'social',
      title: 'Social Media',
      titleAr: 'التواصل الاجتماعي',
      description: 'Social networking and community applications',
      descriptionAr: 'تطبيقات الشبكات الاجتماعية والمجتمعات',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      features: ['User profiles', 'Chat system', 'Content sharing', 'Social feed', 'Groups'],
      featuresAr: ['ملفات المستخدمين', 'نظام الدردشة', 'مشاركة المحتوى', 'الخلاصة الاجتماعية', 'المجموعات']
    },
    {
      id: 'business',
      title: 'Business',
      titleAr: 'الأعمال',
      description: 'Enterprise and productivity applications',
      descriptionAr: 'تطبيقات المؤسسات والإنتاجية',
      icon: Briefcase,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      features: ['CRM system', 'Task management', 'Analytics', 'Team collaboration', 'Reporting'],
      featuresAr: ['نظام إدارة العملاء', 'إدارة المهام', 'التحليلات', 'التعاون الجماعي', 'التقارير']
    },
    {
      id: 'entertainment',
      title: 'Entertainment',
      titleAr: 'الترفيه',
      description: 'Gaming, media streaming, and entertainment apps',
      descriptionAr: 'تطبيقات الألعاب والبث الإعلامي والترفيه',
      icon: Play,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      features: ['Media streaming', 'Gaming features', 'Social features', 'Content management'],
      featuresAr: ['البث الإعلامي', 'ميزات الألعاب', 'الميزات الاجتماعية', 'إدارة المحتوى']
    }
  ];

  const platformOptions: PlatformOption[] = [
    {
      id: 'ios',
      title: 'iOS',
      titleAr: 'iOS',
      description: 'Apple App Store for iPhone and iPad',
      descriptionAr: 'متجر تطبيقات آبل للآيفون والآيباد',
      icon: Apple,
      recommended: false
    },
    {
      id: 'android',
      title: 'Android',
      titleAr: 'أندرويد',
      description: 'Google Play Store for Android devices',
      descriptionAr: 'متجر جوجل بلاي لأجهزة الأندرويد',
      icon: SiAndroid,
      recommended: false
    },
    {
      id: 'both',
      title: 'Both Platforms',
      titleAr: 'كلا المنصتين',
      description: 'Cross-platform app for iOS and Android',
      descriptionAr: 'تطبيق متعدد المنصات لنظامي iOS والأندرويد',
      icon: Smartphone,
      recommended: true
    }
  ];

  const featureOptions: FeatureOption[] = [
    // Core Features
    {
      id: 'user-auth',
      title: 'User Authentication',
      titleAr: 'تسجيل الدخول',
      description: 'Login, signup, and user management',
      descriptionAr: 'تسجيل الدخول والتسجيل وإدارة المستخدمين',
      icon: Shield,
      category: 'core',
      required: true
    },
    {
      id: 'offline-support',
      title: 'Offline Support',
      titleAr: 'العمل بدون إنترنت',
      description: 'App works without internet connection',
      descriptionAr: 'يعمل التطبيق بدون الحاجة لاتصال بالإنترنت',
      icon: Database,
      category: 'core',
      required: false
    },
    {
      id: 'push-notifications',
      title: 'Push Notifications',
      titleAr: 'الإشعارات الفورية',
      description: 'Send notifications to users',
      descriptionAr: 'إرسال الإشعارات للمستخدمين',
      icon: Bell,
      category: 'core',
      required: false
    },
    
    // Business Features
    {
      id: 'payment-gateway',
      title: 'Payment Integration',
      titleAr: 'تكامل الدفع',
      description: 'Credit cards, PayPal, and other payment methods',
      descriptionAr: 'البطاقات الائتمانية وباي بال وطرق الدفع الأخرى',
      icon: CreditCard,
      category: 'business',
      required: false
    },
    {
      id: 'analytics',
      title: 'Analytics & Reporting',
      titleAr: 'التحليلات والتقارير',
      description: 'Track user behavior and generate reports',
      descriptionAr: 'تتبع سلوك المستخدمين وتوليد التقارير',
      icon: BarChart3,
      category: 'business',
      required: false
    },
    {
      id: 'geolocation',
      title: 'GPS & Location',
      titleAr: 'GPS والموقع',
      description: 'Location-based services and mapping',
      descriptionAr: 'الخدمات المعتمدة على الموقع والخرائط',
      icon: MapPin,
      category: 'business',
      required: false
    },
    
    // Advanced Features
    {
      id: 'ai-integration',
      title: 'AI Integration',
      titleAr: 'تكامل الذكاء الاصطناعي',
      description: 'Machine learning and AI-powered features',
      descriptionAr: 'ميزات التعلم الآلي والذكاء الاصطناعي',
      icon: Sparkles,
      category: 'advanced',
      required: false
    },
    {
      id: 'ar-vr',
      title: 'AR/VR Features',
      titleAr: 'ميزات الواقع المعزز/الافتراضي',
      description: 'Augmented and virtual reality integration',
      descriptionAr: 'تكامل الواقع المعزز والافتراضي',
      icon: Activity,
      category: 'advanced',
      required: false
    },
    {
      id: 'iot-integration',
      title: 'IoT Integration',
      titleAr: 'تكامل إنترنت الأشياء',
      description: 'Connect with smart devices and sensors',
      descriptionAr: 'الاتصال بالأجهزة الذكية وأجهزة الاستشعار',
      icon: Zap,
      category: 'advanced',
      required: false
    }
  ];

  const handleStepChange = (step: number) => {
    if (step <= currentStep + 1 && step >= 0) {
      setCurrentStep(step);
    }
  };

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

  const handleAppTypeSelect = (typeId: string) => {
    setProjectDetails(prev => ({
      ...prev,
      appType: typeId
    }));
  };

  const handlePlatformSelect = (platforms: string[]) => {
    setProjectDetails(prev => ({
      ...prev,
      platforms
    }));
  };

  const handleFeatureToggle = (featureId: string, checked: boolean) => {
    setProjectDetails(prev => ({
      ...prev,
      features: checked 
        ? [...prev.features, featureId]
        : prev.features.filter(id => id !== featureId)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    setProjectDetails(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setProjectDetails(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  // Mutation for submitting the form
  const submitMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/mobile-app-orders', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit request');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: lang === 'ar' ? 'تم إرسال الطلب بنجاح!' : 'Request submitted successfully!',
        description: lang === 'ar' 
          ? 'سيتم التواصل معك قريباً من قبل فريقنا المختص.'
          : 'Our team will contact you shortly to discuss your project.',
        duration: 5000,
      });

      // Reset form
      setProjectDetails({
        appType: '',
        platforms: [],
        features: [],
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
    onError: (error: any) => {
      toast({
        title: lang === 'ar' ? 'خطأ في إرسال الطلب' : 'Error submitting request',
        description: lang === 'ar' 
          ? 'حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.'
          : 'There was an error submitting your request. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async () => {
    // Create FormData object for file upload
    const formData = new FormData();
    
    // Add all form fields
    formData.append('customerName', projectDetails.contactName);
    formData.append('customerEmail', projectDetails.contactEmail);
    if (projectDetails.contactPhone) {
      formData.append('customerPhone', projectDetails.contactPhone);
    }
    
    formData.append('appType', projectDetails.appType);
    if (projectDetails.projectName) {
      formData.append('appName', projectDetails.projectName);
    }
    if (projectDetails.projectDescription) {
      formData.append('appDescription', projectDetails.projectDescription);
    }
    
    // Add selected features as JSON string
    formData.append('selectedFeatures', JSON.stringify(projectDetails.features));
    
    if (projectDetails.additionalNotes) {
      formData.append('additionalRequirements', projectDetails.additionalNotes);
    }
    
    if (projectDetails.budget) {
      formData.append('estimatedBudget', projectDetails.budget);
    }
    
    if (projectDetails.timeline) {
      formData.append('preferredTimeline', projectDetails.timeline);
    }
    
    // Add platforms as additional info
    if (projectDetails.platforms.length > 0) {
      const platformInfo = `Platforms: ${projectDetails.platforms.join(', ')}`;
      const existingReq = projectDetails.additionalNotes || '';
      formData.set('additionalRequirements', existingReq ? `${existingReq}\n\n${platformInfo}` : platformInfo);
    }
    
    // Add uploaded files
    uploadedFiles.forEach((file, index) => {
      formData.append('attachedFiles', file);
    });
    
    // Submit the form
    await submitMutation.mutateAsync(formData);
  };

  const isStepValid = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0:
        return !!projectDetails.appType;
      case 1:
        return projectDetails.platforms.length > 0;
      case 2:
        return projectDetails.features.length > 0;
      case 3:
        return !!(projectDetails.projectName && projectDetails.projectDescription);
      case 4:
        return true; // File upload is optional
      case 5:
        return !!(projectDetails.contactName && projectDetails.contactEmail);
      case 6:
        return true; // Review step
      default:
        return false;
    }
  };

  const getProgress = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" dir={dir}>
      {/* Hero Section with Interactive Mobile Icons */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[hsl(213,94%,68%)] via-[hsl(204,100%,73%)] to-[hsl(213,87%,60%)]">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center items-center gap-8 mb-8"
            >
              {/* Interactive iOS Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 cursor-pointer"
                data-testid="icon-ios"
              >
                <Apple className="w-20 h-20 text-white" />
              </motion.div>

              {/* Central Mobile Icon */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-gradient-to-br from-[hsl(213,94%,68%)]/30 to-[hsl(213,87%,60%)]/20 backdrop-blur-sm rounded-3xl p-8 border border-[hsl(213,94%,68%)]/20 shadow-lg shadow-[hsl(213,94%,68%)]/25"
                data-testid="icon-mobile-central"
              >
                <Smartphone className="w-24 h-24 text-white drop-shadow-lg" />
              </motion.div>

              {/* Interactive Android Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 cursor-pointer"
                data-testid="icon-android"
              >
                <SiAndroid className="w-20 h-20 text-white" />
              </motion.div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              data-testid="heading-service-title"
            >
              {lang === 'ar' ? 'تطوير تطبيقات الموبايل' : 'Mobile App Development'}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-white/90 mb-8 max-w-3xl mx-auto"
              data-testid="text-service-description"
            >
              {lang === 'ar' 
                ? 'نبني تطبيقات موبايل احترافية ومبتكرة لنظامي iOS و Android بأحدث التقنيات وأعلى معايير الجودة'
                : 'We build professional and innovative mobile applications for iOS and Android using the latest technologies and highest quality standards'
              }
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 text-white/90"
            >
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {lang === 'ar' ? 'تصميم احترافي' : 'Professional Design'}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {lang === 'ar' ? 'أداء عالي' : 'High Performance'}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {lang === 'ar' ? 'أمان متقدم' : 'Advanced Security'}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {lang === 'ar' ? 'دعم فني متواصل' : '24/7 Support'}
              </Badge>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Planning Wizard */}
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl font-bold">
                {lang === 'ar' ? 'خطط مشروع تطبيقك' : 'Plan Your App Project'}
              </CardTitle>
              <Badge variant="outline">
                {lang === 'ar' ? `الخطوة ${currentStep + 1} من ${steps.length}` : `Step ${currentStep + 1} of ${steps.length}`}
              </Badge>
            </div>
            <Progress value={getProgress()} className="h-2" data-testid="progress-wizard" />
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
                {/* Step 0: App Type Selection */}
                {currentStep === 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6 text-center">
                      {lang === 'ar' ? 'ما نوع التطبيق الذي تريد تطويره؟' : 'What type of app do you want to develop?'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {appTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = projectDetails.appType === type.id;
                        return (
                          <motion.div
                            key={type.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAppTypeSelect(type.id)}
                            className={cn(
                              "cursor-pointer rounded-lg border-2 p-6 transition-all",
                              isSelected
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            )}
                            data-testid={`app-type-${type.id}`}
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
                      {lang === 'ar' ? 'اختر المنصات المستهدفة' : 'Choose Target Platforms'}
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
                      {lang === 'ar' ? 'اختر مميزات تطبيقك' : 'Choose Your App Features'}
                    </h3>
                    
                    {['core', 'business', 'advanced'].map((category) => (
                      <div key={category} className="mb-8">
                        <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                          {category === 'core' && <Shield className="w-5 h-5 text-blue-600" />}
                          {category === 'business' && <Briefcase className="w-5 h-5 text-green-600" />}
                          {category === 'advanced' && <Sparkles className="w-5 h-5 text-purple-600" />}
                          {lang === 'ar' 
                            ? (category === 'core' ? 'المميزات الأساسية' : category === 'business' ? 'مميزات الأعمال' : 'المميزات المتقدمة')
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
                            <SelectItem value="1-2-months">{lang === 'ar' ? '1-2 شهر' : '1-2 months'}</SelectItem>
                            <SelectItem value="3-4-months">{lang === 'ar' ? '3-4 أشهر' : '3-4 months'}</SelectItem>
                            <SelectItem value="5-6-months">{lang === 'ar' ? '5-6 أشهر' : '5-6 months'}</SelectItem>
                            <SelectItem value="6-plus-months">{lang === 'ar' ? 'أكثر من 6 أشهر' : '6+ months'}</SelectItem>
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
                        placeholder={lang === 'ar' ? 'أخبرنا المزيد عن فكرة تطبيقك ومميزاته وأهدافك' : 'Tell us more about your app idea, features, and goals'}
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
                          <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                          <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                          <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                          <SelectItem value="50k-plus">$50,000+</SelectItem>
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
                              {lang === 'ar' ? 'نوع التطبيق' : 'App Type'}
                            </Label>
                            <p className="mt-1">
                              {appTypes.find(t => t.id === projectDetails.appType)?.[lang === 'ar' ? 'titleAr' : 'title']}
                            </p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-gray-500">
                              {lang === 'ar' ? 'المنصات' : 'Platforms'}
                            </Label>
                            <p className="mt-1">
                              {projectDetails.platforms.map(p => 
                                platformOptions.find(opt => opt.id === p)?.[lang === 'ar' ? 'titleAr' : 'title']
                              ).join(', ')}
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-500">
                              {lang === 'ar' ? 'المميزات المختارة' : 'Selected Features'}
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
                            <p className="mt-1">{projectDetails.projectDescription}</p>
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

                          {uploadedFiles.length > 0 && (
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                {lang === 'ar' ? 'الملفات المرفقة' : 'Attached Files'}
                              </Label>
                              <div className="mt-2 space-y-1">
                                {uploadedFiles.map((file, index) => (
                                  <p key={index} className="text-sm text-blue-600">
                                    {file.name}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          <Separator />

                          <div>
                            <Label className="text-sm font-medium text-gray-500">
                              {lang === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
                            </Label>
                            <div className="mt-2 space-y-1">
                              <p><strong>{lang === 'ar' ? 'الاسم:' : 'Name:'}</strong> {projectDetails.contactName}</p>
                              <p><strong>{lang === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</strong> {projectDetails.contactEmail}</p>
                              {projectDetails.contactPhone && (
                                <p><strong>{lang === 'ar' ? 'الهاتف:' : 'Phone:'}</strong> {projectDetails.contactPhone}</p>
                              )}
                            </div>
                          </div>

                          {projectDetails.additionalNotes && (
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                {lang === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                              </Label>
                              <p className="mt-1">{projectDetails.additionalNotes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
                        <h4 className="font-semibold mb-2">
                          {lang === 'ar' ? 'الخطوة التالية' : 'Next Steps'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {lang === 'ar' 
                            ? 'بعد إرسال الطلب، سيقوم فريقنا المختص بمراجعة تفاصيل مشروعك والتواصل معك خلال 24 ساعة لمناقشة التفاصيل وتقديم عرض مخصص.'
                            : 'After submitting your request, our specialized team will review your project details and contact you within 24 hours to discuss specifics and provide a customized proposal.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
                data-testid="button-previous"
              >
                <ArrowLeft className={cn("w-4 h-4", dir === 'rtl' && "rotate-180")} />
                {lang === 'ar' ? 'السابق' : 'Previous'}
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep)}
                  className="flex items-center gap-2"
                  data-testid="button-next"
                >
                  {lang === 'ar' ? 'التالي' : 'Next'}
                  <ArrowRight className={cn("w-4 h-4", dir === 'rtl' && "rotate-180")} />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid(currentStep) || submitMutation.isPending}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  data-testid="button-submit"
                >
                  {submitMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Send className={cn("w-4 h-4", dir === 'rtl' && "rotate-180")} />
                      {lang === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}