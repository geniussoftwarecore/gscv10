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
  Smartphone, 
  ArrowRight, 
  CheckCircle, 
  Upload, 
  FileText,
  Users,
  Zap,
  Shield,
  Rocket,
  Globe,
  Heart,
  GraduationCap,
  ShoppingBag,
  Truck,
  HeartHandshake,
  CreditCard,
  Camera,
  Play,
  Star,
  Monitor,
  Tablet,
  User,
  Mail,
  Phone,
  Building,
  DollarSign,
  Calendar,
  MessageSquare,
  X,
  Send
} from "lucide-react";
import { SiAndroid, SiApple } from "react-icons/si";
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
  category: string;
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

export default function MobileServicePage() {
  const { lang, dir } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mobile service data
  const [isLoading, setIsLoading] = useState(false);
  
  const getMobileData = () => {
    return {
      hero: {
        title: lang === 'ar' ? 'تطوير تطبيقات الموبايل' : 'Mobile App Development',
        subtitle: lang === 'ar' ? 'تطبيقات احترافية للأندرويد و iOS' : 'Professional Android and iOS Apps',
        description: lang === 'ar' ? 'نصمم ونطور تطبيقات موبايل حديثة وآمنة مع دعم كامل للغة العربية' : 'We design and develop modern and secure mobile apps with full Arabic language support',
        primaryCta: lang === 'ar' ? 'ابدأ مشروعك الآن' : 'Start Your Project Now',
        secondaryCta: lang === 'ar' ? 'تحدث مع خبير' : 'Talk to an Expert'
      },
      features: {
        title: lang === 'ar' ? 'نقاط القوة' : 'Our Strengths',
        items: [
          {
            icon: 'Shield',
            title: lang === 'ar' ? 'أمان مؤسسي' : 'Enterprise Security',
            desc: lang === 'ar' ? 'تشفير وحماية متقدمة للبيانات' : 'Advanced data encryption and protection'
          },
          {
            icon: 'Languages',
            title: lang === 'ar' ? 'دعم متعدد اللغات' : 'Multi-language Support',
            desc: lang === 'ar' ? 'دعم كامل للعربية والإنجليزية مع RTL' : 'Full Arabic and English support with RTL'
          },
          {
            icon: 'Rocket',
            title: lang === 'ar' ? 'أداء عالي' : 'High Performance',
            desc: lang === 'ar' ? 'تطبيقات سريعة ومستقرة' : 'Fast and stable applications'
          },
          {
            icon: 'Smartphone',
            title: lang === 'ar' ? 'تجربة مميزة' : 'Premium Experience',
            desc: lang === 'ar' ? 'واجهات مستخدم حديثة وسهلة' : 'Modern and user-friendly interfaces'
          },
          {
            icon: 'MessageCircle',
            title: lang === 'ar' ? 'دعم فني مستمر' : 'Continuous Support',
            desc: lang === 'ar' ? 'فريق دعم متاح على مدار الساعة' : '24/7 support team available'
          },
          {
            icon: 'Bell',
            title: lang === 'ar' ? 'إشعارات ذكية' : 'Smart Notifications',
            desc: lang === 'ar' ? 'نظام إشعارات متقدم ومخصص' : 'Advanced and customized notification system'
          }
        ]
      },
      cta: {
        title: lang === 'ar' ? 'جاهز للانطلاق؟' : 'Ready to Launch?',
        desc: lang === 'ar' ? 'لنحول فكرتك إلى تطبيق حقيقي' : 'Let\'s turn your idea into reality',
        primary: lang === 'ar' ? 'ابدأ مشروعك الآن' : 'Start Your Project',
        secondary: lang === 'ar' ? 'تحدث مع خبير' : 'Talk to Expert'
      },
      seo: {
        title: lang === 'ar' ? 'تطوير تطبيقات الموبايل | GSC' : 'Mobile App Development | GSC',
        description: lang === 'ar' ? 'تطوير تطبيقات احترافية للأندرويد و iOS' : 'Professional Android and iOS app development'
      }
    };
  };

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  // App Types Definition
  const getAppTypes = (): AppType[] => [
    {
      id: 'business',
      name: lang === 'ar' ? 'تطبيق تجاري' : 'Business App',
      description: lang === 'ar' ? 'تطبيقات للشركات والخدمات التجارية' : 'Apps for companies and business services',
      icon: Users,
      features: lang === 'ar' ? [
        'إدارة العملاء والحجوزات',
        'نظام فواتير ومدفوعات',
        'تقارير ومتابعة الأداء',
        'إشعارات فورية'
      ] : [
        'Customer & booking management',
        'Billing & payment system',
        'Reports & performance tracking', 
        'Push notifications'
      ],
      color: 'blue',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      id: 'ecommerce',
      name: lang === 'ar' ? 'متجر إلكتروني' : 'E-commerce App',
      description: lang === 'ar' ? 'تطبيقات للتجارة الإلكترونية والمبيعات' : 'E-commerce and sales applications',
      icon: ShoppingBag,
      features: lang === 'ar' ? [
        'كتالوج منتجات تفاعلي',
        'سلة شراء ونظام دفع',
        'إدارة المخزون',
        'كوبونات وعروض'
      ] : [
        'Interactive product catalog',
        'Shopping cart & payment',
        'Inventory management',
        'Coupons & offers'
      ],
      color: 'green',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
      id: 'education',
      name: lang === 'ar' ? 'تطبيق تعليمي' : 'Educational App',
      description: lang === 'ar' ? 'منصات التعلم والتدريب الإلكتروني' : 'Learning and e-training platforms',
      icon: GraduationCap,
      features: lang === 'ar' ? [
        'محتوى تعليمي تفاعلي',
        'اختبارات وتقييمات',
        'متابعة التقدم',
        'شهادات ومكافآت'
      ] : [
        'Interactive educational content',
        'Tests & assessments',
        'Progress tracking',
        'Certificates & rewards'
      ],
      color: 'purple',
      bgColor: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      id: 'healthcare',
      name: lang === 'ar' ? 'تطبيق صحي' : 'Healthcare App',
      description: lang === 'ar' ? 'تطبيقات الرعاية الصحية والطبية' : 'Healthcare and medical applications',
      icon: HeartHandshake,
      features: lang === 'ar' ? [
        'حجز مواعيد طبية',
        'سجلات صحية إلكترونية',
        'استشارات عن بُعد',
        'تذكير بالأدوية'
      ] : [
        'Medical appointment booking',
        'Electronic health records',
        'Telemedicine consultations',
        'Medication reminders'
      ],
      color: 'red',
      bgColor: 'bg-red-50 hover:bg-red-100'
    },
    {
      id: 'logistics',
      name: lang === 'ar' ? 'تطبيق لوجستي' : 'Logistics App',
      description: lang === 'ar' ? 'تطبيقات التوصيل والنقل' : 'Delivery and transportation apps',
      icon: Truck,
      features: lang === 'ar' ? [
        'تتبع GPS مباشر',
        'إدارة الشحنات',
        'تحسين المسارات',
        'إثبات التسليم'
      ] : [
        'Live GPS tracking',
        'Shipment management',
        'Route optimization',
        'Delivery proof'
      ],
      color: 'orange',
      bgColor: 'bg-orange-50 hover:bg-orange-100'
    },
    {
      id: 'fintech',
      name: lang === 'ar' ? 'تطبيق مالي' : 'Fintech App',
      description: lang === 'ar' ? 'تطبيقات الخدمات المالية والمدفوعات' : 'Financial services and payment apps',
      icon: CreditCard,
      features: lang === 'ar' ? [
        'محفظة رقمية آمنة',
        'تحويلات مالية',
        'إدارة الحسابات',
        'تقارير مالية'
      ] : [
        'Secure digital wallet',
        'Money transfers',
        'Account management',
        'Financial reports'
      ],
      color: 'indigo',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100'
    },
    {
      id: 'media',
      name: lang === 'ar' ? 'تطبيق إعلامي' : 'Media App',
      description: lang === 'ar' ? 'تطبيقات المحتوى والترفيه' : 'Content and entertainment apps',
      icon: Play,
      features: lang === 'ar' ? [
        'بث ومشاركة المحتوى',
        'تفاعل اجتماعي',
        'بث مباشر',
        'قوائم تشغيل'
      ] : [
        'Content streaming & sharing',
        'Social interaction',
        'Live streaming',
        'Playlists'
      ],
      color: 'pink',
      bgColor: 'bg-pink-50 hover:bg-pink-100'
    }
  ];

  // Features Definition
  const getFeatures = (): Feature[] => [
    // Core Features
    {
      id: 'user_auth',
      name: lang === 'ar' ? 'نظام المستخدمين والمصادقة' : 'User Authentication System',
      description: lang === 'ar' ? 'تسجيل دخول آمن وإدارة المستخدمين' : 'Secure login and user management',
      category: 'core',
      isRequired: true
    },
    {
      id: 'offline_mode',
      name: lang === 'ar' ? 'وضع عدم الاتصال' : 'Offline Mode',
      description: lang === 'ar' ? 'العمل بدون إنترنت مع المزامنة اللاحقة' : 'Work without internet with later sync',
      category: 'core'
    },
    {
      id: 'push_notifications',
      name: lang === 'ar' ? 'الإشعارات الفورية' : 'Push Notifications',
      description: lang === 'ar' ? 'إشعارات مخصصة ومجدولة' : 'Customized and scheduled notifications',
      category: 'core'
    },
    {
      id: 'multilingual',
      name: lang === 'ar' ? 'دعم متعدد اللغات' : 'Multi-language Support',
      description: lang === 'ar' ? 'عربي وإنجليزي مع دعم RTL' : 'Arabic and English with RTL support',
      category: 'core'
    },

    // Business Features
    {
      id: 'payment_gateway',
      name: lang === 'ar' ? 'بوابة الدفع' : 'Payment Gateway',
      description: lang === 'ar' ? 'دفع آمن عبر بطاقات ومحافظ رقمية' : 'Secure payment via cards and digital wallets',
      category: 'business'
    },
    {
      id: 'analytics',
      name: lang === 'ar' ? 'تحليلات متقدمة' : 'Advanced Analytics',
      description: lang === 'ar' ? 'تقارير ومقاييس الأداء' : 'Reports and performance metrics',
      category: 'business'
    },
    {
      id: 'admin_panel',
      name: lang === 'ar' ? 'لوحة إدارة' : 'Admin Panel',
      description: lang === 'ar' ? 'لوحة تحكم شاملة للإدارة' : 'Comprehensive management dashboard',
      category: 'business'
    },
    {
      id: 'crm_integration',
      name: lang === 'ar' ? 'ربط مع أنظمة CRM' : 'CRM Integration',
      description: lang === 'ar' ? 'تكامل مع أنظمة إدارة العملاء' : 'Integration with customer management systems',
      category: 'business'
    },

    // Technical Features
    {
      id: 'real_time_sync',
      name: lang === 'ar' ? 'المزامنة الفورية' : 'Real-time Sync',
      description: lang === 'ar' ? 'تحديث البيانات في الوقت الفعلي' : 'Real-time data updates',
      category: 'technical'
    },
    {
      id: 'biometric_auth',
      name: lang === 'ar' ? 'المصادقة البيومترية' : 'Biometric Authentication',
      description: lang === 'ar' ? 'بصمة الإصبع والتعرف على الوجه' : 'Fingerprint and face recognition',
      category: 'technical'
    },
    {
      id: 'gps_location',
      name: lang === 'ar' ? 'خدمات الموقع GPS' : 'GPS Location Services',
      description: lang === 'ar' ? 'تتبع الموقع والخرائط التفاعلية' : 'Location tracking and interactive maps',
      category: 'technical'
    },
    {
      id: 'camera_integration',
      name: lang === 'ar' ? 'تكامل الكاميرا' : 'Camera Integration',
      description: lang === 'ar' ? 'التقاط الصور ومسح الـ QR' : 'Photo capture and QR scanning',
      category: 'technical'
    },

    // Social Features
    {
      id: 'social_sharing',
      name: lang === 'ar' ? 'المشاركة الاجتماعية' : 'Social Sharing',
      description: lang === 'ar' ? 'مشاركة المحتوى على المنصات الاجتماعية' : 'Content sharing on social platforms',
      category: 'social'
    },
    {
      id: 'in_app_chat',
      name: lang === 'ar' ? 'دردشة داخل التطبيق' : 'In-app Chat',
      description: lang === 'ar' ? 'نظام مراسلة فوري' : 'Instant messaging system',
      category: 'social'
    },
    {
      id: 'reviews_ratings',
      name: lang === 'ar' ? 'التقييمات والمراجعات' : 'Reviews & Ratings',
      description: lang === 'ar' ? 'نظام تقييم المستخدمين' : 'User rating system',
      category: 'social'
    }
  ];

  // Specializations Definition
  const getSpecializations = () => [
    {
      id: 'healthcare_medical',
      name: lang === 'ar' ? 'الرعاية الصحية والطبية' : 'Healthcare & Medical',
      description: lang === 'ar' ? 'تطبيقات طبية متخصصة ومراقبة صحية' : 'Specialized medical apps and health monitoring',
      icon: HeartHandshake,
      color: 'red'
    },
    {
      id: 'fintech_banking',
      name: lang === 'ar' ? 'التكنولوجيا المالية والبنوك' : 'Fintech & Banking',
      description: lang === 'ar' ? 'حلول دفع وخدمات مصرفية رقمية' : 'Payment solutions and digital banking services',
      icon: CreditCard,
      color: 'green'
    },
    {
      id: 'education_learning',
      name: lang === 'ar' ? 'التعليم والتدريب' : 'Education & Learning',
      description: lang === 'ar' ? 'منصات تعليمية وإدارة المحتوى التعليمي' : 'Educational platforms and learning content management',
      icon: GraduationCap,
      color: 'blue'
    },
    {
      id: 'ecommerce_retail',
      name: lang === 'ar' ? 'التجارة الإلكترونية والبيع بالتجزئة' : 'E-commerce & Retail',
      description: lang === 'ar' ? 'متاجر إلكترونية وإدارة المبيعات' : 'Online stores and sales management',
      icon: ShoppingBag,
      color: 'purple'
    },
    {
      id: 'logistics_delivery',
      name: lang === 'ar' ? 'اللوجستيات والتوصيل' : 'Logistics & Delivery',
      description: lang === 'ar' ? 'إدارة الشحن والتتبع والتوصيل' : 'Shipping management, tracking and delivery',
      icon: Truck,
      color: 'orange'
    },
    {
      id: 'real_estate',
      name: lang === 'ar' ? 'العقارات' : 'Real Estate',
      description: lang === 'ar' ? 'تطبيقات عقارية وإدارة الممتلكات' : 'Real estate apps and property management',
      icon: Monitor,
      color: 'indigo'
    },
    {
      id: 'food_beverage',
      name: lang === 'ar' ? 'الطعام والمشروبات' : 'Food & Beverage',
      description: lang === 'ar' ? 'طلب الطعام وإدارة المطاعم' : 'Food ordering and restaurant management',
      icon: Heart,
      color: 'pink'
    },
    {
      id: 'travel_tourism',
      name: lang === 'ar' ? 'السياحة والسفر' : 'Travel & Tourism',
      description: lang === 'ar' ? 'حجوزات السفر والرحلات السياحية' : 'Travel bookings and tourism services',
      icon: Globe,
      color: 'teal'
    },
    {
      id: 'media_entertainment',
      name: lang === 'ar' ? 'الإعلام والترفيه' : 'Media & Entertainment',
      description: lang === 'ar' ? 'المحتوى الرقمي والألعاب والتطبيقات الترفيهية' : 'Digital content, games and entertainment apps',
      icon: Play,
      color: 'yellow'
    },
    {
      id: 'social_networking',
      name: lang === 'ar' ? 'الشبكات الاجتماعية' : 'Social Networking',
      description: lang === 'ar' ? 'منصات التواصل الاجتماعي والمجتمعات الرقمية' : 'Social media platforms and digital communities',
      icon: Users,
      color: 'cyan'
    }
  ];

  // Steps for planning process
  const planSteps = [
    {
      id: 1,
      title: lang === 'ar' ? 'نوع التطبيق' : 'App Type',
      description: lang === 'ar' ? 'اختر نوع التطبيق المطلوب' : 'Choose your app type'
    },
    {
      id: 2,
      title: lang === 'ar' ? 'الميزات' : 'Features',
      description: lang === 'ar' ? 'حدد الميزات المطلوبة' : 'Select required features'
    },
    {
      id: 3,
      title: lang === 'ar' ? 'التخصصات' : 'Specializations',
      description: lang === 'ar' ? 'اختر التخصصات والمجالات' : 'Select specializations and domains'
    },
    {
      id: 4,
      title: lang === 'ar' ? 'تفاصيل المشروع' : 'Project Details',
      description: lang === 'ar' ? 'أضف تفاصيل مشروعك' : 'Add your project details'
    },
    {
      id: 5,
      title: lang === 'ar' ? 'الملفات والمستندات' : 'Files & Documents',
      description: lang === 'ar' ? 'ارفع الملفات ذات الصلة' : 'Upload relevant files'
    },
    {
      id: 6,
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
      
      // Add app details
      formData.append('appType', planningState.selectedAppType || '');
      if (planningState.projectDetails.appName) {
        formData.append('appName', planningState.projectDetails.appName);
      }
      if (planningState.projectDetails.appDescription) {
        formData.append('appDescription', planningState.projectDetails.appDescription);
      }
      
      // Add selected features as JSON string
      formData.append('selectedFeatures', JSON.stringify(planningState.selectedFeatures));
      
      // Add additional requirements
      let additionalRequirements = planningState.projectDetails.additionalRequirements || '';
      
      // Add specializations and other details to additional requirements
      if (planningState.selectedSpecializations.length > 0) {
        const specializationNames = getSpecializations()
          .filter(spec => planningState.selectedSpecializations.includes(spec.id))
          .map(spec => spec.name);
        additionalRequirements += `\n\nالتخصصات المختارة: ${specializationNames.join(', ')}`;
      }
      
      if (planningState.projectDetails.targetAudience) {
        additionalRequirements += `\n\nالجمهور المستهدف: ${planningState.projectDetails.targetAudience}`;
      }
      
      formData.append('additionalRequirements', additionalRequirements);
      
      // Add budget and timeline
      if (planningState.projectDetails.budget) {
        formData.append('estimatedBudget', planningState.projectDetails.budget);
      }
      if (planningState.projectDetails.timeline) {
        formData.append('preferredTimeline', planningState.projectDetails.timeline);
      }
      
      // Add files as attachedFiles to match the API expectation
      planningState.uploadedFiles.forEach((file) => {
        formData.append('attachedFiles', file);
      });

      const response = await fetch('/api/mobile-app-orders', {
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
        description: lang === 'ar' ? 'سيتم التواصل معك قريباً' : 'We will contact you soon',
      });
      
      // Reset state
      setPlanningState({
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
    },
    onError: (error) => {
      toast({
        title: lang === 'ar' ? 'خطأ في إرسال الطلب' : 'Error submitting request',
        description: lang === 'ar' ? 'حدث خطأ، يرجى المحاولة مرة أخرى' : 'An error occurred, please try again',
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = () => {
    setIsSubmitting(true);
    submitMutation.mutate();
  };

  const mobileData = getMobileData();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={mobileData.seo.title}
        description={mobileData.seo.description}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20" dir={dir}>
        {/* Enhanced Hero Section with Interactive Platform Icons */}
        <section className="relative bg-gradient-to-br from-white via-blue-50/50 to-purple-50/30 py-20 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:32px_32px] opacity-30" />
          
          {/* Interactive Platform Icons Bar */}
          <div className="absolute top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50 z-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <TooltipProvider>
                <div className="flex items-center justify-center gap-8 py-4" data-testid="bar-platforms">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="group"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          className="flex items-center gap-3 px-6 py-3 rounded-full bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-900/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 group-hover:scale-105 group-hover:shadow-lg"
                          aria-label={dir === 'rtl' ? 'تطبيقات أندرويد' : 'Android Apps'}
                          data-testid="badge-android"
                        >
                          <SiAndroid className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
                          <span className="font-semibold text-green-700 text-sm">
                            {dir === 'rtl' ? 'أندرويد' : 'Android'}
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{dir === 'rtl' ? 'تطبيقات أندرويد أصلية' : 'Native Android Apps'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="group"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          className="flex items-center gap-3 px-6 py-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 group-hover:scale-105 group-hover:shadow-lg"
                          aria-label={dir === 'rtl' ? 'تطبيقات الهواتف الذكية' : 'Mobile Apps'}
                          data-testid="badge-mobile"
                        >
                          <Smartphone className="w-6 h-6 text-gray-600 group-hover:scale-110 transition-transform" />
                          <span className="font-semibold text-gray-700 text-sm">
                            {dir === 'rtl' ? 'موبايل' : 'Mobile'}
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{dir === 'rtl' ? 'تطبيقات متعددة المنصات' : 'Cross-platform Apps'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="group"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          className="flex items-center gap-3 px-6 py-3 rounded-full bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 group-hover:scale-105 group-hover:shadow-lg"
                          aria-label={dir === 'rtl' ? 'تطبيقات الآيفون' : 'iOS Apps'}
                          data-testid="badge-ios"
                        >
                          <SiApple className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                          <span className="font-semibold text-blue-700 text-sm">
                            {dir === 'rtl' ? 'آيفون' : 'iOS'}
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{dir === 'rtl' ? 'تطبيقات آيفون وآيباد' : 'iPhone & iPad Apps'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                </div>
              </TooltipProvider>
            </div>
          </div>

          {/* Hero Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-6"
              >
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20">
                  <Rocket className="w-4 h-4 mr-2" />
                  {mobileData.hero.title}
                </Badge>
              </motion.div>

              <motion.h1 
                className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                data-testid="hero-title"
              >
                {mobileData.hero.subtitle}
              </motion.h1>

              <motion.p 
                className="text-xl text-gray-600 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                data-testid="hero-description"
              >
                {mobileData.hero.description}
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => setPlanningState(prev => ({ ...prev, currentStep: 1 }))}
                  data-testid="button-start-planning"
                >
                  <ArrowRight className={cn(
                    "w-5 h-5 mr-2",
                    dir === 'rtl' && "rotate-180 mr-0 ml-2"
                  )} />
                  {lang === 'ar' ? 'ابدأ تخطيط تطبيقك' : 'Start Planning Your App'}
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                  onClick={() => setLocation('/contact?service=mobile-apps')}
                  data-testid="button-contact"
                >
                  {mobileData.hero.secondaryCta}
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Interactive Planning System */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {lang === 'ar' ? 'خطط تطبيقك خطوة بخطوة' : 'Plan Your App Step by Step'}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {lang === 'ar' ? 'نظام تخطيط تفاعلي لتحديد متطلبات تطبيقك بدقة' : 'Interactive planning system to define your app requirements precisely'}
              </p>
            </motion.div>

            {/* Steps Progress Bar */}
            <div className="mb-12">
              <div className="flex items-center justify-center">
                {planSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div 
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                        planningState.currentStep >= step.id 
                          ? "bg-primary text-white" 
                          : "bg-gray-200 text-gray-600"
                      )}
                    >
                      {planningState.currentStep > step.id ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    {index < planSteps.length - 1 && (
                      <div 
                        className={cn(
                          "w-16 h-1 mx-2 transition-all duration-300",
                          planningState.currentStep > step.id 
                            ? "bg-primary" 
                            : "bg-gray-200"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {planSteps[planningState.currentStep - 1]?.title}
                </h3>
                <p className="text-gray-600">
                  {planSteps[planningState.currentStep - 1]?.description}
                </p>
              </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={planningState.currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="max-w-6xl mx-auto"
              >
                {/* Step 1: App Type Selection */}
                {planningState.currentStep === 1 && (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getAppTypes().map((appType) => {
                        const IconComponent = appType.icon;
                        const isSelected = planningState.selectedAppType === appType.id;
                        
                        return (
                          <motion.div
                            key={appType.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <Card 
                              className={cn(
                                "cursor-pointer transition-all duration-300 hover:shadow-lg",
                                appType.bgColor,
                                isSelected && "ring-2 ring-primary shadow-lg scale-105"
                              )}
                              onClick={() => setPlanningState(prev => ({ 
                                ...prev, 
                                selectedAppType: appType.id 
                              }))}
                              data-testid={`card-app-type-${appType.id}`}
                            >
                              <CardContent className="p-6 text-center space-y-4">
                                <div className={cn(
                                  "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-transform duration-300",
                                  `bg-${appType.color}-500`,
                                  isSelected && "scale-110"
                                )}>
                                  <IconComponent className="w-8 h-8 text-white" />
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-900">
                                  {appType.name}
                                </h3>
                                
                                <p className="text-gray-600">
                                  {appType.description}
                                </p>
                                
                                <div className="space-y-2">
                                  {appType.features.map((feature, index) => (
                                    <div key={index} className="flex items-center text-sm text-gray-700">
                                      <CheckCircle className="w-4 h-4 text-primary mr-2" />
                                      {feature}
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="text-center">
                      <Button 
                        size="lg"
                        disabled={!planningState.selectedAppType}
                        onClick={() => setPlanningState(prev => ({ ...prev, currentStep: 2 }))}
                        className="px-8 py-4"
                        data-testid="button-next-step-1"
                      >
                        {lang === 'ar' ? 'التالي: اختيار الميزات' : 'Next: Select Features'}
                        <ArrowRight className={cn("w-5 h-5 ml-2", dir === 'rtl' && "rotate-180 ml-0 mr-2")} />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Features Selection */}
                {planningState.currentStep === 2 && (
                  <div className="space-y-8">
                    <Alert>
                      <Star className="h-4 w-4" />
                      <AlertDescription>
                        {lang === 'ar' ? 'اختر الميزات التي تحتاجها في تطبيقك. يمكنك اختيار عدة ميزات.' : 'Select the features you need in your app. You can choose multiple features.'}
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-6">
                      {['core', 'business', 'technical', 'social'].map((category) => {
                        const categoryFeatures = getFeatures().filter(f => f.category === category);
                        const categoryNames = {
                          core: lang === 'ar' ? 'الميزات الأساسية' : 'Core Features',
                          business: lang === 'ar' ? 'ميزات الأعمال' : 'Business Features', 
                          technical: lang === 'ar' ? 'الميزات التقنية' : 'Technical Features',
                          social: lang === 'ar' ? 'الميزات الاجتماعية' : 'Social Features'
                        };

                        return (
                          <div key={category} className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              <Globe className="w-5 h-5 text-primary" />
                              {categoryNames[category as keyof typeof categoryNames]}
                            </h3>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              {categoryFeatures.map((feature) => {
                                const isSelected = planningState.selectedFeatures.includes(feature.id);
                                
                                return (
                                  <Card
                                    key={feature.id}
                                    className={cn(
                                      "cursor-pointer transition-all duration-300 hover:shadow-md",
                                      isSelected && "ring-2 ring-primary bg-primary/5"
                                    )}
                                    onClick={() => {
                                      if (feature.isRequired) return;
                                      
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
                                      <div className="flex items-start gap-3">
                                        <div className={cn(
                                          "mt-1 transition-colors duration-300",
                                          isSelected || feature.isRequired ? "text-primary" : "text-gray-400"
                                        )}>
                                          <CheckCircle className="w-5 h-5" />
                                        </div>
                                        
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-gray-900">
                                              {feature.name}
                                            </h4>
                                            {feature.isRequired && (
                                              <Badge variant="secondary" className="text-xs">
                                                {lang === 'ar' ? 'مطلوب' : 'Required'}
                                              </Badge>
                                            )}
                                          </div>
                                          <p className="text-sm text-gray-600">
                                            {feature.description}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => setPlanningState(prev => ({ ...prev, currentStep: 1 }))}
                        data-testid="button-prev-step-2"
                      >
                        <ArrowRight className={cn("w-5 h-5 mr-2 rotate-180", dir === 'rtl' && "rotate-0 mr-0 ml-2")} />
                        {lang === 'ar' ? 'السابق' : 'Previous'}
                      </Button>
                      
                      <Button 
                        size="lg"
                        onClick={() => setPlanningState(prev => ({ ...prev, currentStep: 3 }))}
                        data-testid="button-next-step-2"
                      >
                        {lang === 'ar' ? 'التالي: التخصصات' : 'Next: Specializations'}
                        <ArrowRight className={cn("w-5 h-5 ml-2", dir === 'rtl' && "rotate-180 ml-0 mr-2")} />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Specializations Selection */}
                {planningState.currentStep === 3 && (
                  <div className="space-y-8">
                    <Alert>
                      <Star className="h-4 w-4" />
                      <AlertDescription>
                        {lang === 'ar' ? 'اختر التخصصات والمجالات التي تناسب مشروعك. يمكنك اختيار عدة تخصصات.' : 'Select the specializations and domains that fit your project. You can choose multiple specializations.'}
                      </AlertDescription>
                    </Alert>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getSpecializations().map((specialization) => {
                        const IconComponent = specialization.icon;
                        const isSelected = planningState.selectedSpecializations.includes(specialization.id);
                        
                        return (
                          <motion.div
                            key={specialization.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <Card 
                              className={cn(
                                "cursor-pointer transition-all duration-300 hover:shadow-lg h-full",
                                isSelected && "ring-2 ring-primary shadow-lg scale-105 bg-primary/5"
                              )}
                              onClick={() => setPlanningState(prev => ({ 
                                ...prev, 
                                selectedSpecializations: isSelected 
                                  ? prev.selectedSpecializations.filter(id => id !== specialization.id)
                                  : [...prev.selectedSpecializations, specialization.id]
                              }))}
                              data-testid={`card-specialization-${specialization.id}`}
                            >
                              <CardContent className="p-6 text-center space-y-4 h-full flex flex-col">
                                <div className={cn(
                                  "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-transform duration-300",
                                  `bg-${specialization.color}-500`,
                                  isSelected && "scale-110"
                                )}>
                                  <IconComponent className="w-8 h-8 text-white" />
                                </div>
                                
                                <div className="flex-1 flex flex-col justify-center">
                                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {specialization.name}
                                  </h3>
                                  
                                  <p className="text-gray-600 text-sm leading-relaxed">
                                    {specialization.description}
                                  </p>
                                </div>
                                
                                {isSelected && (
                                  <div className="text-primary">
                                    <CheckCircle className="w-6 h-6 mx-auto" />
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => setPlanningState(prev => ({ ...prev, currentStep: 2 }))}
                        data-testid="button-prev-step-3"
                      >
                        <ArrowRight className={cn("w-5 h-5 mr-2 rotate-180", dir === 'rtl' && "rotate-0 mr-0 ml-2")} />
                        {lang === 'ar' ? 'السابق' : 'Previous'}
                      </Button>
                      
                      <Button 
                        size="lg"
                        onClick={() => setPlanningState(prev => ({ ...prev, currentStep: 4 }))}
                        data-testid="button-next-step-3"
                      >
                        {lang === 'ar' ? 'التالي: تفاصيل المشروع' : 'Next: Project Details'}
                        <ArrowRight className={cn("w-5 h-5 ml-2", dir === 'rtl' && "rotate-180 ml-0 mr-2")} />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Project Details */}
                {planningState.currentStep === 4 && (
                  <div className="space-y-8">
                    <Alert>
                      <FileText className="h-4 w-4" />
                      <AlertDescription>
                        {lang === 'ar' ? 'أخبرنا المزيد عن مشروعك وأهدافك. كلما زادت التفاصيل، كان بإمكاننا تقديم حل أفضل.' : 'Tell us more about your project and goals. The more details you provide, the better solution we can offer.'}
                      </AlertDescription>
                    </Alert>

                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="app-name">
                          {lang === 'ar' ? 'اسم التطبيق' : 'App Name'} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="app-name"
                          placeholder={lang === 'ar' ? 'أدخل اسم التطبيق المقترح' : 'Enter your proposed app name'}
                          value={planningState.projectDetails.appName}
                          onChange={(e) => setPlanningState(prev => ({
                            ...prev,
                            projectDetails: { ...prev.projectDetails, appName: e.target.value }
                          }))}
                          data-testid="input-app-name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="app-description">
                          {lang === 'ar' ? 'وصف التطبيق' : 'App Description'} <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="app-description"
                          placeholder={lang === 'ar' ? 'صف فكرة التطبيق وما يحققه للمستخدمين...' : 'Describe your app idea and what it achieves for users...'}
                          value={planningState.projectDetails.appDescription}
                          onChange={(e) => setPlanningState(prev => ({
                            ...prev,
                            projectDetails: { ...prev.projectDetails, appDescription: e.target.value }
                          }))}
                          rows={4}
                          data-testid="textarea-app-description"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="target-audience">
                          {lang === 'ar' ? 'الجمهور المستهدف' : 'Target Audience'} <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="target-audience"
                          placeholder={lang === 'ar' ? 'من هم المستخدمون المستهدفون؟ (العمر، الاهتمامات، السلوك...)' : 'Who are your target users? (Age, interests, behavior...)'}
                          value={planningState.projectDetails.targetAudience}
                          onChange={(e) => setPlanningState(prev => ({
                            ...prev,
                            projectDetails: { ...prev.projectDetails, targetAudience: e.target.value }
                          }))}
                          rows={3}
                          data-testid="textarea-target-audience"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="budget">
                            {lang === 'ar' ? 'الميزانية المتوقعة' : 'Expected Budget'}
                          </Label>
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
                              <SelectItem value="5k-10k">{lang === 'ar' ? '5,000 - 10,000 ريال' : '$1,300 - $2,700'}</SelectItem>
                              <SelectItem value="10k-25k">{lang === 'ar' ? '10,000 - 25,000 ريال' : '$2,700 - $6,700'}</SelectItem>
                              <SelectItem value="25k-50k">{lang === 'ar' ? '25,000 - 50,000 ريال' : '$6,700 - $13,300'}</SelectItem>
                              <SelectItem value="50k+">{lang === 'ar' ? '50,000+ ريال' : '$13,300+'}</SelectItem>
                              <SelectItem value="custom">{lang === 'ar' ? 'مخصص' : 'Custom'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="timeline">
                            {lang === 'ar' ? 'الإطار الزمني المطلوب' : 'Required Timeline'}
                          </Label>
                          <Select 
                            value={planningState.projectDetails.timeline}
                            onValueChange={(value) => setPlanningState(prev => ({
                              ...prev,
                              projectDetails: { ...prev.projectDetails, timeline: value }
                            }))}
                          >
                            <SelectTrigger data-testid="select-timeline">
                              <SelectValue placeholder={lang === 'ar' ? 'اختر المدة' : 'Select timeline'} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-2months">{lang === 'ar' ? '1-2 شهر' : '1-2 months'}</SelectItem>
                              <SelectItem value="2-4months">{lang === 'ar' ? '2-4 أشهر' : '2-4 months'}</SelectItem>
                              <SelectItem value="4-6months">{lang === 'ar' ? '4-6 أشهر' : '4-6 months'}</SelectItem>
                              <SelectItem value="6months+">{lang === 'ar' ? '6+ أشهر' : '6+ months'}</SelectItem>
                              <SelectItem value="flexible">{lang === 'ar' ? 'مرن' : 'Flexible'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="additional-requirements">
                          {lang === 'ar' ? 'متطلبات إضافية' : 'Additional Requirements'}
                        </Label>
                        <Textarea
                          id="additional-requirements"
                          placeholder={lang === 'ar' ? 'أي متطلبات خاصة أو تفاصيل إضافية تريد إضافتها...' : 'Any special requirements or additional details you want to add...'}
                          value={planningState.projectDetails.additionalRequirements}
                          onChange={(e) => setPlanningState(prev => ({
                            ...prev,
                            projectDetails: { ...prev.projectDetails, additionalRequirements: e.target.value }
                          }))}
                          rows={3}
                          data-testid="textarea-additional-requirements"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => setPlanningState(prev => ({ ...prev, currentStep: 3 }))}
                        data-testid="button-prev-step-4"
                      >
                        <ArrowRight className={cn("w-5 h-5 mr-2 rotate-180", dir === 'rtl' && "rotate-0 mr-0 ml-2")} />
                        {lang === 'ar' ? 'السابق' : 'Previous'}
                      </Button>
                      
                      <Button 
                        size="lg"
                        onClick={() => setPlanningState(prev => ({ ...prev, currentStep: 5 }))}
                        disabled={!planningState.projectDetails.appName || !planningState.projectDetails.appDescription || !planningState.projectDetails.targetAudience}
                        data-testid="button-next-step-4"
                      >
                        {lang === 'ar' ? 'التالي: الملفات والمستندات' : 'Next: Files & Documents'}
                        <ArrowRight className={cn("w-5 h-5 ml-2", dir === 'rtl' && "rotate-180 ml-0 mr-2")} />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 5: Files & Documents */}
                {planningState.currentStep === 5 && (
                  <div className="space-y-8">
                    <Alert>
                      <Upload className="h-4 w-4" />
                      <AlertDescription>
                        {lang === 'ar' ? 'ارفع أي ملفات تساعدنا في فهم مشروعك بشكل أفضل (تصاميم، مخططات، مراجع، إلخ). الحد الأقصى 10 ميجابايت لكل ملف.' : 'Upload any files that help us understand your project better (designs, wireframes, references, etc). Maximum 10MB per file.'}
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-6">
                      {/* File Upload Area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip,.rar"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            setPlanningState(prev => ({
                              ...prev,
                              uploadedFiles: [...prev.uploadedFiles, ...files]
                            }));
                          }}
                          className="hidden"
                          id="file-upload"
                          data-testid="input-file-upload"
                        />
                        <label 
                          htmlFor="file-upload" 
                          className="cursor-pointer flex flex-col items-center space-y-4"
                        >
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <Upload className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-700">
                              {lang === 'ar' ? 'اسحب الملفات هنا أو انقر للتصفح' : 'Drag files here or click to browse'}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              {lang === 'ar' ? 'PDF, DOC, صور, ZIP - حتى 10 ميجابايت' : 'PDF, DOC, Images, ZIP - up to 10MB'}
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Uploaded Files List */}
                      {planningState.uploadedFiles.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">
                            {lang === 'ar' ? 'الملفات المرفوعة' : 'Uploaded Files'} ({planningState.uploadedFiles.length})
                          </h4>
                          <div className="space-y-2">
                            {planningState.uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <FileText className="w-5 h-5 text-primary" />
                                  <div>
                                    <p className="font-medium text-gray-900">{file.name}</p>
                                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setPlanningState(prev => ({
                                      ...prev,
                                      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
                                    }));
                                  }}
                                  data-testid={`button-remove-file-${index}`}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => setPlanningState(prev => ({ ...prev, currentStep: 4 }))}
                        data-testid="button-prev-step-5"
                      >
                        <ArrowRight className={cn("w-5 h-5 mr-2 rotate-180", dir === 'rtl' && "rotate-0 mr-0 ml-2")} />
                        {lang === 'ar' ? 'السابق' : 'Previous'}
                      </Button>
                      
                      <Button 
                        size="lg"
                        onClick={() => setPlanningState(prev => ({ ...prev, currentStep: 6 }))}
                        data-testid="button-next-step-5"
                      >
                        {lang === 'ar' ? 'التالي: معلومات التواصل' : 'Next: Contact Information'}
                        <ArrowRight className={cn("w-5 h-5 ml-2", dir === 'rtl' && "rotate-180 ml-0 mr-2")} />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 6: Contact Information & Final Submission */}
                {planningState.currentStep === 6 && (
                  <div className="space-y-8">
                    <Alert>
                      <User className="h-4 w-4" />
                      <AlertDescription>
                        {lang === 'ar' ? 'أدخل معلومات التواصل ليتمكن فريقنا من الوصول إليك ومناقشة مشروعك بالتفصيل.' : 'Enter your contact information so our team can reach you and discuss your project in detail.'}
                      </AlertDescription>
                    </Alert>

                    <div className="grid gap-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="contact-name">
                            {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="contact-name"
                            placeholder={lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                            value={planningState.contactInfo.name}
                            onChange={(e) => setPlanningState(prev => ({
                              ...prev,
                              contactInfo: { ...prev.contactInfo, name: e.target.value }
                            }))}
                            data-testid="input-contact-name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contact-company">
                            {lang === 'ar' ? 'اسم الشركة/المؤسسة' : 'Company/Organization'}
                          </Label>
                          <Input
                            id="contact-company"
                            placeholder={lang === 'ar' ? 'اسم الشركة (اختياري)' : 'Company name (optional)'}
                            value={planningState.contactInfo.company || ''}
                            onChange={(e) => setPlanningState(prev => ({
                              ...prev,
                              contactInfo: { ...prev.contactInfo, company: e.target.value }
                            }))}
                            data-testid="input-contact-company"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="contact-email">
                            {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="contact-email"
                            type="email"
                            placeholder={lang === 'ar' ? 'your@email.com' : 'your@email.com'}
                            value={planningState.contactInfo.email}
                            onChange={(e) => setPlanningState(prev => ({
                              ...prev,
                              contactInfo: { ...prev.contactInfo, email: e.target.value }
                            }))}
                            data-testid="input-contact-email"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contact-phone">
                            {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="contact-phone"
                            type="tel"
                            placeholder={lang === 'ar' ? '+966 XX XXX XXXX' : '+966 XX XXX XXXX'}
                            value={planningState.contactInfo.phone}
                            onChange={(e) => setPlanningState(prev => ({
                              ...prev,
                              contactInfo: { ...prev.contactInfo, phone: e.target.value }
                            }))}
                            data-testid="input-contact-phone"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Project Summary */}
                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {lang === 'ar' ? 'ملخص المشروع' : 'Project Summary'}
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold text-gray-700">{lang === 'ar' ? 'نوع التطبيق:' : 'App Type:'}</p>
                          <p className="text-gray-600">
                            {getAppTypes().find(type => type.id === planningState.selectedAppType)?.name || '-'}
                          </p>
                        </div>
                        
                        <div>
                          <p className="font-semibold text-gray-700">{lang === 'ar' ? 'عدد الميزات:' : 'Features Count:'}</p>
                          <p className="text-gray-600">{planningState.selectedFeatures.length} {lang === 'ar' ? 'ميزة' : 'features'}</p>
                        </div>
                        
                        <div>
                          <p className="font-semibold text-gray-700">{lang === 'ar' ? 'التخصصات:' : 'Specializations:'}</p>
                          <p className="text-gray-600">{planningState.selectedSpecializations.length} {lang === 'ar' ? 'تخصص' : 'specializations'}</p>
                        </div>
                        
                        <div>
                          <p className="font-semibold text-gray-700">{lang === 'ar' ? 'الملفات المرفقة:' : 'Attached Files:'}</p>
                          <p className="text-gray-600">{planningState.uploadedFiles.length} {lang === 'ar' ? 'ملف' : 'files'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => setPlanningState(prev => ({ ...prev, currentStep: 5 }))}
                        data-testid="button-prev-step-6"
                      >
                        <ArrowRight className={cn("w-5 h-5 mr-2 rotate-180", dir === 'rtl' && "rotate-0 mr-0 ml-2")} />
                        {lang === 'ar' ? 'السابق' : 'Previous'}
                      </Button>
                      
                      <Button 
                        size="lg"
                        onClick={handleSubmit}
                        disabled={!planningState.contactInfo.name || !planningState.contactInfo.email || !planningState.contactInfo.phone || isSubmitting}
                        className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        data-testid="button-submit-request"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                          </div>
                        ) : (
                          <>
                            <Send className={cn("w-5 h-5 mr-2", dir === 'rtl' && "mr-0 ml-2")} />
                            {lang === 'ar' ? 'إرسال طلب التطبيق' : 'Submit App Request'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Features Overview Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {mobileData.features.title}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full mx-auto" />
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mobileData.features.items.map((feature: any, index: number) => {
                const icons = {
                  Shield: Shield,
                  Languages: Globe,
                  Rocket: Rocket,
                  Smartphone: Smartphone,
                  MessageCircle: Heart,
                  Bell: Zap
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
                          className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
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
        <section className="py-20 bg-gradient-to-r from-primary to-purple-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {mobileData.cta.title}
              </h2>
              <p className="text-xl text-white/90 mb-8">
                {mobileData.cta.desc}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold"
                  onClick={() => setPlanningState(prev => ({ ...prev, currentStep: 1 }))}
                >
                  {mobileData.cta.primary}
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-xl font-semibold"
                  onClick={() => setLocation('/contact?service=mobile-apps')}
                >
                  {mobileData.cta.secondary}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}