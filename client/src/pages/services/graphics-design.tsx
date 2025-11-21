import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Filter, 
  Check, 
  Star, 
  Download, 
  Eye, 
  ArrowRight, 
  Package,
  Sparkles,
  Target,
  Users,
  Clock,
  Award,
  Zap,
  Layers,
  ChevronDown,
  X,
  Send,
  Upload,
  FileImage,
  Briefcase,
  Heart,
  Lightbulb,
  Crown,
  Shield,
  TrendingUp,
  Globe,
  Brush,
  Scissors,
  PaintBucket,
  ImageIcon,
  MonitorSpeaker,
  Smartphone,
  FileText,
  DollarSign,
  Calendar,
  Building,
  User,
  HelpCircle,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/i18n/lang";
import { SEOHead } from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

// Schema for graphics design service request
const graphicsDesignRequestSchema = z.object({
  customerName: z.string().min(2, "الاسم مطلوب"),
  customerEmail: z.string().email("بريد إلكتروني صحيح مطلوب"),
  customerPhone: z.string().min(10, "رقم الجوال مطلوب"),
  company: z.string().optional(),
  selectedPackage: z.string().min(1, "يرجى اختيار باقة"),
  selectedFeatures: z.array(z.string()).min(1, "يرجى اختيار ميزة واحدة على الأقل"),
  projectDescription: z.string().min(10, "وصف المشروع مطلوب"),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  businessType: z.string().optional(),
  additionalRequirements: z.string().optional(),
  attachments: z.array(z.any()).optional(),
});

type GraphicsDesignFormData = z.infer<typeof graphicsDesignRequestSchema>;

// Package types
interface DesignPackage {
  id: string;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  features: string[];
  deliverables: string[];
  timeline: string;
  revisions?: string;
  support?: string;
  tag?: string;
  popular?: boolean;
  premium?: boolean;
  category: 'branding' | 'marketing' | 'digital' | 'print' | 'comprehensive';
  targetAudience?: string[];
  technicalSpecs?: string[];
  addOns?: {
    id: string;
    name: string;
    price: string;
    description: string;
  }[];
}

// Feature categories
interface FeatureCategory {
  id: string;
  name: string;
  features: {
    id: string;
    name: string;
    description: string;
    price?: string;
  }[];
}

export default function GraphicsDesignService() {
  const { lang, dir } = useLanguage();
  const { toast } = useToast();
  
  // State management
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPackage, setSelectedPackage] = useState<DesignPackage | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Packages data
  const designPackages: DesignPackage[] = useMemo(() => [
    {
      id: 'essential',
      title: lang === 'ar' ? 'الهوية البصرية الأساسية' : 'Essential Visual Identity',
      description: lang === 'ar' ? 'باقة أساسية شاملة للشركات الناشئة' : 'Complete essential package for startups',
      price: '2,500 ريال',
      originalPrice: '3,500 ريال',
      discount: '29% خصم',
      features: [
        lang === 'ar' ? 'تصميم شعار احترافي (3 مفاهيم)' : 'Professional logo design (3 concepts)',
        lang === 'ar' ? 'دليل الهوية البصرية المبسط' : 'Simplified brand guidelines',
        lang === 'ar' ? 'تصميم بطاقة أعمال' : 'Business card design',
        lang === 'ar' ? 'ورقة رسمية للشركة' : 'Company letterhead',
        lang === 'ar' ? 'ملفات الشعار بصيغ متعددة' : 'Logo files in multiple formats'
      ],
      deliverables: [
        lang === 'ar' ? 'ملفات الشعار بجميع الصيغ' : 'Logo files in all formats',
        lang === 'ar' ? 'بطاقة أعمال جاهزة للطباعة' : 'Print-ready business card',
        lang === 'ar' ? 'دليل استخدام مبسط' : 'Simple usage guide'
      ],
      timeline: lang === 'ar' ? '7-10 أيام' : '7-10 days',
      tag: lang === 'ar' ? 'البداية' : 'Starter',
      category: 'branding'
    },
    {
      id: 'professional',
      title: lang === 'ar' ? 'الهوية البصرية الاحترافية' : 'Professional Visual Identity',
      description: lang === 'ar' ? 'باقة شاملة للشركات المتوسطة' : 'Complete package for medium businesses',
      price: '6,500 ريال',
      originalPrice: '8,500 ريال',
      discount: '24% خصم',
      features: [
        lang === 'ar' ? 'تصميم شعار احترافي (5 مفاهيم)' : 'Professional logo design (5 concepts)',
        lang === 'ar' ? 'دليل الهوية البصرية المفصل' : 'Detailed brand guidelines',
        lang === 'ar' ? 'مجموعة القرطاسية الكاملة' : 'Complete stationery set',
        lang === 'ar' ? 'قوالب عروض تقديمية' : 'Presentation templates',
        lang === 'ar' ? 'نماذج فواتير ومراسلات' : 'Invoice and letter templates'
      ],
      deliverables: [
        lang === 'ar' ? 'شعار بجميع الإصدارات' : 'Logo in all versions',
        lang === 'ar' ? 'مجموعة قرطاسية كاملة' : 'Complete stationery set',
        lang === 'ar' ? 'دعم فني لمدة 3 أشهر' : '3 months technical support'
      ],
      timeline: lang === 'ar' ? '2-3 أسابيع' : '2-3 weeks',
      tag: lang === 'ar' ? 'احترافية' : 'Professional',
      popular: true,
      category: 'branding'
    },
    {
      id: 'premium',
      title: lang === 'ar' ? 'الهوية البصرية المتقدمة' : 'Premium Visual Identity',
      description: lang === 'ar' ? 'باقة متقدمة للمؤسسات الكبيرة' : 'Advanced package for large organizations',
      price: '15,000 ريال',
      originalPrice: '20,000 ريال',
      discount: '25% خصم',
      features: [
        lang === 'ar' ? 'تصميم شعار متعدد الإصدارات' : 'Multi-version logo design',
        lang === 'ar' ? 'دليل هوية مؤسسي شامل' : 'Comprehensive corporate guidelines',
        lang === 'ar' ? 'تصميم اللافتات والإعلانات' : 'Signage and advertising design',
        lang === 'ar' ? 'تصميم زي الموظفين' : 'Employee uniform design',
        lang === 'ar' ? 'تصميم المركبات والمعدات' : 'Vehicle and equipment design'
      ],
      deliverables: [
        lang === 'ar' ? 'دليل هوية مؤسسي شامل' : 'Comprehensive corporate guidelines',
        lang === 'ar' ? 'نماذج ثلاثية الأبعاد' : '3D mockups',
        lang === 'ar' ? 'دعم مجاني لمدة 6 أشهر' : '6 months free support'
      ],
      timeline: lang === 'ar' ? '4-6 أسابيع' : '4-6 weeks',
      tag: lang === 'ar' ? 'متقدمة' : 'Premium',
      category: 'branding'
    },
    {
      id: 'marketing',
      title: lang === 'ar' ? 'التصميمات التسويقية' : 'Marketing Materials',
      description: lang === 'ar' ? 'مواد تسويقية إبداعية ومؤثرة' : 'Creative and impactful marketing materials',
      price: '4,200 ريال',
      originalPrice: '6,000 ريال',
      discount: '30% خصم',
      features: [
        lang === 'ar' ? 'تصميم بروشورات وكتيبات' : 'Brochure and booklet design',
        lang === 'ar' ? 'إعلانات المجلات والجرائد' : 'Magazine and newspaper ads',
        lang === 'ar' ? 'لوحات إعلانية خارجية' : 'Outdoor billboard design',
        lang === 'ar' ? 'مواد المعارض والفعاليات' : 'Exhibition and event materials'
      ],
      deliverables: [
        lang === 'ar' ? 'تصاميم بجميع الأحجام' : 'Designs in all sizes',
        lang === 'ar' ? 'ملفات للطباعة والنشر الرقمي' : 'Print and digital files',
        lang === 'ar' ? 'قوالب قابلة للتعديل' : 'Editable templates'
      ],
      timeline: lang === 'ar' ? '3-7 أيام' : '3-7 days',
      tag: lang === 'ar' ? 'إبداعية' : 'Creative',
      category: 'marketing'
    },
    {
      id: 'digital',
      title: lang === 'ar' ? 'المحتوى الرقمي' : 'Digital Content',
      description: lang === 'ar' ? 'محتوى رقمي جذاب لوسائل التواصل' : 'Engaging digital content for social media',
      price: '5,500 ريال شهرياً',
      originalPrice: '7,500 ريال',
      discount: '27% خصم',
      features: [
        lang === 'ar' ? 'منشورات يومية للسوشيال ميديا' : 'Daily social media posts',
        lang === 'ar' ? 'ستوريز تفاعلية ومتحركة' : 'Interactive animated stories',
        lang === 'ar' ? 'إنفوجرافيك معلوماتية' : 'Informational infographics',
        lang === 'ar' ? 'بنرات إعلانية رقمية' : 'Digital advertising banners'
      ],
      deliverables: [
        lang === 'ar' ? '30-60 منشور شهرياً' : '30-60 posts monthly',
        lang === 'ar' ? 'ستوريز يومية متنوعة' : 'Daily varied stories',
        lang === 'ar' ? 'تقرير أداء شهري' : 'Monthly performance report'
      ],
      timeline: lang === 'ar' ? 'مستمر شهرياً' : 'Monthly continuous',
      tag: lang === 'ar' ? 'رقمية' : 'Digital',
      category: 'digital'
    },
    {
      id: 'print',
      title: lang === 'ar' ? 'المطبوعات التجارية' : 'Commercial Printing',
      description: lang === 'ar' ? 'مطبوعات عالية الجودة ومؤثرة' : 'High-quality impactful printing materials',
      price: '3,800 ريال',
      originalPrice: '5,200 ريال',
      discount: '27% خصم',
      features: [
        lang === 'ar' ? 'تصميم البروشورات والكتالوجات' : 'Brochure and catalog design',
        lang === 'ar' ? 'أغلفة الكتب والمجلات' : 'Book and magazine covers',
        lang === 'ar' ? 'تصميم التغليف والعبوات' : 'Packaging and container design',
        lang === 'ar' ? 'تصميم القوائم والمنيوهات' : 'Menu and list design'
      ],
      deliverables: [
        lang === 'ar' ? 'تصاميم جاهزة للطباعة' : 'Print-ready designs',
        lang === 'ar' ? 'مواصفات الطباعة التفصيلية' : 'Detailed printing specifications',
        lang === 'ar' ? 'دعم أثناء الطباعة' : 'Support during printing'
      ],
      timeline: lang === 'ar' ? '5-10 أيام' : '5-10 days',
      tag: lang === 'ar' ? 'جودة' : 'Quality',
      category: 'print'
    }
  ], [lang]);

  // Categories for filtering
  const categories = useMemo(() => [
    { id: 'all', name: lang === 'ar' ? 'جميع الباقات' : 'All Packages', icon: Package },
    { id: 'branding', name: lang === 'ar' ? 'الهوية البصرية' : 'Branding', icon: Palette },
    { id: 'marketing', name: lang === 'ar' ? 'التسويق' : 'Marketing', icon: Target },
    { id: 'digital', name: lang === 'ar' ? 'المحتوى الرقمي' : 'Digital Content', icon: Zap },
    { id: 'print', name: lang === 'ar' ? 'المطبوعات' : 'Print Materials', icon: FileImage }
  ], [lang]);

  // Feature categories for customization
  const featureCategories: FeatureCategory[] = useMemo(() => [
    {
      id: 'logo',
      name: lang === 'ar' ? 'تصميم الشعارات' : 'Logo Design',
      features: [
        { id: 'logo-basic', name: lang === 'ar' ? 'شعار أساسي' : 'Basic Logo', description: lang === 'ar' ? '3 مفاهيم أولية' : '3 initial concepts' },
        { id: 'logo-premium', name: lang === 'ar' ? 'شعار متقدم' : 'Premium Logo', description: lang === 'ar' ? '5 مفاهيم مع تطوير' : '5 concepts with development' },
        { id: 'logo-variations', name: lang === 'ar' ? 'إصدارات متعددة' : 'Multiple Versions', description: lang === 'ar' ? 'أفقي وعمودي ومبسط' : 'Horizontal, vertical and simplified' }
      ]
    },
    {
      id: 'stationery',
      name: lang === 'ar' ? 'القرطاسية' : 'Stationery',
      features: [
        { id: 'business-card', name: lang === 'ar' ? 'بطاقة أعمال' : 'Business Card', description: lang === 'ar' ? 'تصميم احترافي' : 'Professional design' },
        { id: 'letterhead', name: lang === 'ar' ? 'ورقة رسمية' : 'Letterhead', description: lang === 'ar' ? 'للمراسلات الرسمية' : 'For official correspondence' },
        { id: 'envelope', name: lang === 'ar' ? 'ظرف' : 'Envelope', description: lang === 'ar' ? 'متناسق مع الهوية' : 'Consistent with identity' }
      ]
    },
    {
      id: 'marketing',
      name: lang === 'ar' ? 'المواد التسويقية' : 'Marketing Materials',
      features: [
        { id: 'brochure', name: lang === 'ar' ? 'بروشور' : 'Brochure', description: lang === 'ar' ? 'تصميم جذاب ومعلوماتي' : 'Attractive and informative design' },
        { id: 'flyer', name: lang === 'ar' ? 'منشور إعلاني' : 'Flyer', description: lang === 'ar' ? 'للحملات الترويجية' : 'For promotional campaigns' },
        { id: 'banner', name: lang === 'ar' ? 'بنر إعلاني' : 'Banner', description: lang === 'ar' ? 'للإعلانات الرقمية' : 'For digital advertising' }
      ]
    },
    {
      id: 'digital',
      name: lang === 'ar' ? 'المحتوى الرقمي' : 'Digital Content',
      features: [
        { id: 'social-posts', name: lang === 'ar' ? 'منشورات سوشيال ميديا' : 'Social Media Posts', description: lang === 'ar' ? 'محتوى يومي متنوع' : 'Daily varied content' },
        { id: 'infographic', name: lang === 'ar' ? 'إنفوجرافيك' : 'Infographic', description: lang === 'ar' ? 'عرض المعلومات بصرياً' : 'Visual information display' },
        { id: 'presentation', name: lang === 'ar' ? 'عرض تقديمي' : 'Presentation', description: lang === 'ar' ? 'قوالب احترافية' : 'Professional templates' }
      ]
    }
  ], [lang]);

  // Form handling
  const form = useForm<GraphicsDesignFormData>({
    resolver: zodResolver(graphicsDesignRequestSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      company: '',
      selectedPackage: '',
      selectedFeatures: [],
      projectDescription: '',
      budget: '',
      timeline: '',
      businessType: '',
      additionalRequirements: '',
      attachments: []
    }
  });

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async (data: GraphicsDesignFormData) => {
      const formData = new FormData();
      
      // Add form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'selectedFeatures') {
          formData.append(key, JSON.stringify(value));
        } else if (key !== 'attachments') {
          formData.append(key, value as string);
        }
      });

      // Add attachments
      attachedFiles.forEach((file, index) => {
        formData.append('attachments', file);
      });

      const result = await apiRequest('/api/graphics-design-orders', {
        method: 'POST',
        body: formData
      });
      
      return result;
    },
    onSuccess: () => {
      toast({
        title: lang === 'ar' ? "تم إرسال الطلب بنجاح!" : "Request sent successfully!",
        description: lang === 'ar' ? "سيتواصل معك فريقنا قريباً" : "Our team will contact you soon"
      });
      setShowQuoteModal(false);
      form.reset();
      setSelectedFeatures([]);
      setAttachedFiles([]);
    },
    onError: (error) => {
      toast({
        title: lang === 'ar' ? "خطأ في الإرسال" : "Submission Error",
        description: lang === 'ar' ? "حدث خطأ، يرجى المحاولة مرة أخرى" : "An error occurred, please try again",
        variant: "destructive"
      });
    }
  });

  // Filter packages
  const filteredPackages = useMemo(() => {
    if (selectedCategory === 'all') return designPackages;
    return designPackages.filter(pkg => pkg.category === selectedCategory);
  }, [designPackages, selectedCategory]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachedFiles(prev => [...prev, ...files].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle feature selection
  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => {
      const updated = prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId];
      
      form.setValue('selectedFeatures', updated);
      return updated;
    });
  };

  const onSubmit = (data: GraphicsDesignFormData) => {
    data.selectedFeatures = selectedFeatures;
    submitMutation.mutate(data);
  };

  return (
    <>
      <SEOHead 
        title={lang === 'ar' ? 'تصميم الجرافيكس والهوية البصرية | GSC' : 'Graphics Design & Visual Identity | GSC'}
        description={lang === 'ar' ? 'نصمم لك هوية بصرية متكاملة وتصاميم جرافيكس احترافية تعكس شخصية علامتك التجارية وتترك انطباعاً مميزاً لدى عملائك.' : 'We design complete visual identity and professional graphics that reflect your brand personality and leave a distinctive impression on your customers.'}
      />

      <main className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:32px_32px] opacity-30" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <Palette className="w-8 h-8 text-purple-600" />
                <Badge variant="secondary" className="text-purple-700 bg-purple-100">
                  {lang === 'ar' ? 'تصميم احترافي' : 'Professional Design'}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                  {lang === 'ar' ? 'تصميم الجرافيكس والهوية البصرية' : 'Graphics Design & Visual Identity'}
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {lang === 'ar' 
                  ? 'نصمم لك هوية بصرية متكاملة وتصاميم جرافيكس احترافية تعكس شخصية علامتك التجارية وتترك انطباعاً مميزاً لدى عملائك'
                  : 'We design complete visual identity and professional graphics that reflect your brand personality and leave a distinctive impression on your customers'
                }
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => setShowQuoteModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  data-testid="button-get-quote"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {lang === 'ar' ? 'احصل على عرض سعر' : 'Get Quote'}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="button-explore-packages"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  {lang === 'ar' ? 'استكشف الباقات' : 'Explore Packages'}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="py-16 bg-white/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {lang === 'ar' ? 'ماذا نقدم لك؟' : 'What We Offer You?'}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {lang === 'ar' 
                  ? 'خدمات تصميم شاملة تغطي جميع احتياجاتك التسويقية والبصرية'
                  : 'Comprehensive design services covering all your marketing and visual needs'
                }
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Palette,
                  title: lang === 'ar' ? 'هوية بصرية متكاملة' : 'Complete Visual Identity',
                  description: lang === 'ar' ? 'شعار وألوان وخطوط مخصصة' : 'Custom logo, colors and fonts'
                },
                {
                  icon: Target,
                  title: lang === 'ar' ? 'مواد تسويقية' : 'Marketing Materials',
                  description: lang === 'ar' ? 'بروشورات وإعلانات ولافتات' : 'Brochures, ads and signage'
                },
                {
                  icon: Zap,
                  title: lang === 'ar' ? 'محتوى رقمي' : 'Digital Content',
                  description: lang === 'ar' ? 'منشورات وستوريز وإنفوجرافيك' : 'Posts, stories and infographics'
                },
                {
                  icon: Award,
                  title: lang === 'ar' ? 'جودة احترافية' : 'Professional Quality',
                  description: lang === 'ar' ? 'معايير عالمية وخبرة واسعة' : 'Global standards and wide experience'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow p-6">
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Continue with Packages Section... */}
        <section id="packages" className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {lang === 'ar' ? 'باقاتنا المتنوعة' : 'Our Diverse Packages'}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {lang === 'ar' 
                  ? 'اختر الباقة التي تناسب احتياجاتك أو خصص باقة خاصة بك'
                  : 'Choose the package that suits your needs or customize your own package'
                }
              </p>
            </motion.div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "transition-all",
                    selectedCategory === category.id 
                      ? "bg-purple-600 hover:bg-purple-700" 
                      : "hover:bg-purple-50"
                  )}
                  data-testid={`filter-${category.id}`}
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Packages Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="wait">
                {filteredPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    layout
                  >
                    <Card className={cn(
                      "relative overflow-hidden hover:shadow-xl transition-all duration-300 h-full",
                      pkg.popular ? "ring-2 ring-purple-500 shadow-lg" : ""
                    )}>
                      {pkg.popular && (
                        <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {lang === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
                        </div>
                      )}
                      
                      {pkg.tag && (
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                            {pkg.tag}
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="pb-4 pt-8">
                        <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                          {pkg.title}
                        </CardTitle>
                        <p className="text-gray-600 text-sm mb-4">
                          {pkg.description}
                        </p>
                        <div className="text-2xl font-bold text-purple-600">
                          {pkg.price}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Features */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Layers className="w-4 h-4 mr-2 text-purple-600" />
                            {lang === 'ar' ? 'المميزات' : 'Features'}
                          </h4>
                          <ul className="space-y-2">
                            {pkg.features.slice(0, 4).map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                            {pkg.features.length > 4 && (
                              <li className="text-sm text-purple-600 font-medium">
                                +{pkg.features.length - 4} {lang === 'ar' ? 'ميزة إضافية' : 'more features'}
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span>{lang === 'ar' ? 'مدة التنفيذ:' : 'Timeline:'} {pkg.timeline}</span>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2 pt-4">
                          <Button 
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            onClick={() => {
                              setSelectedPackage(pkg);
                              form.setValue('selectedPackage', pkg.id);
                              setShowQuoteModal(true);
                            }}
                            data-testid={`button-select-${pkg.id}`}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            {lang === 'ar' ? 'اطلب هذه الباقة' : 'Request This Package'}
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setSelectedPackage(pkg)}
                            data-testid={`button-details-${pkg.id}`}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Custom Package CTA and Why Choose Us */}
            <div className="mt-16 space-y-12">
              {/* Why Choose Us Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-slate-50 to-gray-100/50 rounded-3xl p-8 border border-gray-200"
              >
                <div className="text-center mb-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {lang === 'ar' ? 'لماذا تختار GSC لتصميم هويتك البصرية؟' : 'Why Choose GSC for Your Visual Identity Design?'}
                  </h3>
                  <p className="text-gray-600 max-w-3xl mx-auto">
                    {lang === 'ar' 
                      ? 'نجمع بين الخبرة العميقة والإبداع الاستثنائي لنقدم حلولاً تصميمية تحقق أهدافك التجارية وتميز علامتك في السوق'
                      : 'We combine deep expertise with exceptional creativity to deliver design solutions that achieve your business goals and distinguish your brand in the market'
                    }
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      icon: Award,
                      title: lang === 'ar' ? 'خبرة +7 سنوات' : '+7 Years Experience',
                      description: lang === 'ar' ? 'فريق من المحترفين ذوي الخبرة الواسعة في التصميم' : 'Team of professionals with extensive design experience',
                      color: 'from-blue-500 to-cyan-500'
                    },
                    {
                      icon: Users,
                      title: lang === 'ar' ? '+500 عميل راضي' : '+500 Satisfied Clients',
                      description: lang === 'ar' ? 'سجل حافل من النجاحات والعملاء المميزين' : 'Impressive track record of successes and distinguished clients',
                      color: 'from-green-500 to-teal-500'
                    },
                    {
                      icon: Clock,
                      title: lang === 'ar' ? 'التزام بالمواعيد' : 'On-Time Commitment',
                      description: lang === 'ar' ? 'نسلم مشاريعك في الوقت المحدد دون تأخير' : 'We deliver your projects on time without delay',
                      color: 'from-purple-500 to-violet-500'
                    },
                    {
                      icon: Shield,
                      title: lang === 'ar' ? 'ضمان الجودة' : 'Quality Guarantee',
                      description: lang === 'ar' ? 'ضمان شامل على الجودة مع إمكانية التعديل' : 'Comprehensive quality guarantee with revision options',
                      color: 'from-orange-500 to-red-500'
                    }
                  ].map((item, index) => (
                    <div key={index} className="text-center group">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl bg-gradient-to-br mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300",
                        item.color
                      )}>
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Custom Package CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-purple-200 shadow-xl overflow-hidden">
                  <CardContent className="p-8 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full -translate-y-16 translate-x-16 opacity-30" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full translate-y-12 -translate-x-12 opacity-30" />
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                        <Lightbulb className="w-10 h-10 text-white" />
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        {lang === 'ar' ? 'لديك متطلبات خاصة ومميزة؟' : 'Have Special and Unique Requirements?'}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 max-w-lg leading-relaxed">
                        {lang === 'ar' 
                          ? 'لا تجد الباقة المناسبة؟ نحن نصمم باقة مخصصة تماماً لاحتياجاتك وميزانيتك. استشارة مجانية وعرض سعر مفصل.'
                          : 'Cannot find the right package? We design a package completely customized to your needs and budget. Free consultation and detailed quote.'
                        }
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          size="lg"
                          onClick={() => {
                            setSelectedPackage(null);
                            form.setValue('selectedPackage', 'custom');
                            setShowQuoteModal(true);
                          }}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:scale-105 transition-all duration-300"
                          data-testid="button-custom-package"
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          {lang === 'ar' ? 'طلب باقة مخصصة' : 'Request Custom Package'}
                        </Button>
                        
                        <Button 
                          variant="outline"
                          size="lg"
                          onClick={() => {
                            window.open(`https://wa.me/966505551234?text=${encodeURIComponent(
                              lang === 'ar' 
                                ? 'مرحباً، أرغب في استشارة مجانية حول تصميم الهوية البصرية'
                                : 'Hello, I would like a free consultation about visual identity design'
                            )}`, '_blank');
                          }}
                          className="border-purple-300 text-purple-700 hover:bg-purple-50"
                          data-testid="button-free-consultation"
                        >
                          <Users className="w-5 h-5 mr-2" />
                          {lang === 'ar' ? 'استشارة مجانية' : 'Free Consultation'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quote Request Modal */}
        <Dialog open={showQuoteModal} onOpenChange={setShowQuoteModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="modal-quote-request">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Palette className="w-6 h-6 text-purple-600" />
                {lang === 'ar' ? 'طلب عرض سعر للتصميم' : 'Design Quote Request'}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Selected Package Info */}
                {selectedPackage && (
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-2">
                      {lang === 'ar' ? 'الباقة المختارة:' : 'Selected Package:'}
                    </h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{selectedPackage.title}</p>
                        <p className="text-sm text-gray-600">{selectedPackage.description}</p>
                      </div>
                      <div className="text-purple-600 font-bold">
                        {selectedPackage.price}
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder={lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                            data-testid="input-customer-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'} *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email"
                            placeholder={lang === 'ar' ? 'name@example.com' : 'name@example.com'}
                            data-testid="input-customer-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{lang === 'ar' ? 'رقم الجوال' : 'Phone Number'} *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder={lang === 'ar' ? '+966 5X XXX XXXX' : '+966 5X XXX XXXX'}
                            data-testid="input-customer-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{lang === 'ar' ? 'اسم الشركة' : 'Company Name'}</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder={lang === 'ar' ? 'اختياري' : 'Optional'}
                            data-testid="input-company"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Package Selection */}
                <FormField
                  control={form.control}
                  name="selectedPackage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{lang === 'ar' ? 'اختر الباقة' : 'Select Package'} *</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          value={field.value} 
                          onValueChange={(value) => {
                            field.onChange(value);
                            const pkg = designPackages.find(p => p.id === value);
                            setSelectedPackage(pkg || null);
                          }}
                          className="grid md:grid-cols-2 gap-4"
                        >
                          {designPackages.map(pkg => (
                            <div key={pkg.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                              <RadioGroupItem value={pkg.id} id={pkg.id} data-testid={`radio-package-${pkg.id}`} />
                              <Label htmlFor={pkg.id} className="flex-1 cursor-pointer">
                                <div className="border rounded-lg p-3 hover:bg-gray-50">
                                  <div className="font-medium text-gray-900">{pkg.title}</div>
                                  <div className="text-sm text-gray-600">{pkg.price}</div>
                                </div>
                              </Label>
                            </div>
                          ))}
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <RadioGroupItem value="custom" id="custom" data-testid="radio-package-custom" />
                            <Label htmlFor="custom" className="flex-1 cursor-pointer">
                              <div className="border rounded-lg p-3 hover:bg-gray-50 border-dashed border-purple-300">
                                <div className="font-medium text-purple-700">
                                  {lang === 'ar' ? 'باقة مخصصة' : 'Custom Package'}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {lang === 'ar' ? 'حسب المتطلبات' : 'Based on requirements'}
                                </div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Simple Feature Selection */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-purple-600" />
                    {lang === 'ar' ? 'اختر المميزات المطلوبة' : 'Select Required Features'} *
                  </h3>
                  
                  <div className="space-y-6">
                    {featureCategories.map(category => (
                      <div key={category.id} className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">{category.name}</h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {category.features.map(feature => (
                            <div 
                              key={feature.id}
                              className={cn(
                                "border rounded-lg p-3 cursor-pointer transition-all",
                                selectedFeatures.includes(feature.id)
                                  ? "border-purple-500 bg-purple-50"
                                  : "border-gray-200 hover:border-purple-300"
                              )}
                              onClick={() => toggleFeature(feature.id)}
                              data-testid={`checkbox-feature-${feature.id}`}
                            >
                              <div className="flex items-start gap-2">
                                <Checkbox 
                                  checked={selectedFeatures.includes(feature.id)}
                                  onChange={() => toggleFeature(feature.id)}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <div className="font-medium text-sm text-gray-900">{feature.name}</div>
                                  <div className="text-xs text-gray-600">{feature.description}</div>
                                  {feature.price && (
                                    <div className="text-xs text-purple-600 font-medium mt-1">{feature.price}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Form Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          {lang === 'ar' ? 'الميزانية المتوقعة' : 'Expected Budget'}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              {...field} 
                              placeholder={lang === 'ar' ? 'مثال: 5,000 ريال' : 'Example: 5,000 SAR'}
                              className="pl-10"
                              data-testid="input-budget"
                            />
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          {lang === 'ar' ? 'الجدول الزمني المطلوب' : 'Required Timeline'}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              {...field} 
                              placeholder={lang === 'ar' ? 'مثال: خلال أسبوعين' : 'Example: Within 2 weeks'}
                              className="pl-10"
                              data-testid="input-timeline"
                            />
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Business Type Selection */}
                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-purple-600" />
                        {lang === 'ar' ? 'نوع النشاط التجاري' : 'Business Type'}
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { id: 'startup', label: lang === 'ar' ? 'شركة ناشئة' : 'Startup', icon: Zap },
                            { id: 'business', label: lang === 'ar' ? 'شركة تجارية' : 'Business', icon: Building },
                            { id: 'freelancer', label: lang === 'ar' ? 'عمل حر' : 'Freelancer', icon: User },
                            { id: 'other', label: lang === 'ar' ? 'أخرى' : 'Other', icon: HelpCircle }
                          ].map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => field.onChange(type.id)}
                              className={cn(
                                "p-3 border-2 rounded-lg transition-all text-center hover:scale-105",
                                field.value === type.id
                                  ? "border-purple-500 bg-purple-50 text-purple-700"
                                  : "border-gray-200 hover:border-purple-300"
                              )}
                              data-testid={`button-business-type-${type.id}`}
                            >
                              <type.icon className="w-6 h-6 mx-auto mb-2" />
                              <div className="text-sm font-medium">{type.label}</div>
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Project Description */}
                <FormField
                  control={form.control}
                  name="projectDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        {lang === 'ar' ? 'وصف مفصل للمشروع والمتطلبات' : 'Detailed Project Description & Requirements'} *
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder={lang === 'ar' 
                            ? 'صف مشروعك بالتفصيل: نوع النشاط، الجمهور المستهدف، الألوان المفضلة، الرسالة المراد إيصالها، أي متطلبات خاصة...' 
                            : 'Describe your project in detail: business type, target audience, preferred colors, message to convey, any special requirements...'
                          }
                          rows={5}
                          className="resize-none"
                          data-testid="textarea-project-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="additionalRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-gray-600" />
                        {lang === 'ar' ? 'متطلبات أو ملاحظات إضافية' : 'Additional Requirements or Notes'}
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder={lang === 'ar' 
                            ? 'أي متطلبات خاصة، مراجع تصميمية، أو ملاحظات إضافية...' 
                            : 'Any special requirements, design references, or additional notes...'
                          }
                          rows={3}
                          className="resize-none"
                          data-testid="textarea-additional-requirements"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Request Summary */}
                {(selectedFeatures.length > 0 || selectedPackage) && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <h4 className="font-bold text-purple-900 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      {lang === 'ar' ? 'ملخص طلبك المخصص' : 'Your Custom Request Summary'}
                    </h4>
                    
                    <div className="space-y-3 text-sm">
                      {selectedPackage && (
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-purple-100">
                          <div>
                            <span className="font-semibold text-gray-900">{selectedPackage.title}</span>
                            <p className="text-xs text-gray-600 mt-1">{selectedPackage.description}</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-purple-100 text-purple-700 mb-1">
                              {selectedPackage.price}
                            </Badge>
                            {selectedPackage.timeline && (
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {selectedPackage.timeline}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {selectedFeatures.length > 0 && (
                        <div className="p-3 bg-white rounded-lg border border-purple-100">
                          <div className="font-semibold text-gray-900 mb-2 flex items-center justify-between">
                            <span>{lang === 'ar' ? 'المميزات المختارة:' : 'Selected Features:'}</span>
                            <Badge variant="outline" className="text-purple-700">
                              {selectedFeatures.length} {lang === 'ar' ? 'ميزة' : 'features'}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedFeatures.map((featureId) => {
                              const feature = featureCategories
                                .flatMap(cat => cat.features)
                                .find(f => f.id === featureId);
                              return feature ? (
                                <div key={featureId} className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-lg">
                                  <Check className="w-3 h-3 text-purple-600" />
                                  <span className="text-xs font-medium text-purple-800">
                                    {feature.name.split(' ').slice(0, 3).join(' ')}
                                  </span>
                                  {feature.price && (
                                    <span className="text-xs text-purple-600 font-bold">
                                      {feature.price}
                                    </span>
                                  )}
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                          <Shield className="w-4 h-4" />
                          {lang === 'ar' ? 'ضمانات GSC:' : 'GSC Guarantees:'}
                        </div>
                        <div className="grid md:grid-cols-3 gap-2 mt-2 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-600" />
                            {lang === 'ar' ? 'تسليم في الوقت' : 'On-time delivery'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-red-500" />
                            {lang === 'ar' ? 'دعم مجاني' : 'Free support'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="w-3 h-3 text-yellow-600" />
                            {lang === 'ar' ? 'جودة احترافية' : 'Professional quality'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Submit Section */}
                <div className="space-y-4 pt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      {lang === 'ar' 
                        ? 'سيتم مراجعة طلبك خلال 24 ساعة وسنتواصل معك لتأكيد التفاصيل وموعد البدء'
                        : 'Your request will be reviewed within 24 hours and we will contact you to confirm details and start date'
                      }
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      type="submit" 
                      disabled={submitMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:scale-105 transition-all duration-300"
                      data-testid="button-submit-request"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          {lang === 'ar' ? 'جاري إرسال طلبك...' : 'Sending your request...'}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {lang === 'ar' ? 'إرسال طلب العرض المخصص' : 'Send Custom Quote Request'}
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowQuoteModal(false)}
                      className="flex-1 sm:flex-none border-purple-300 text-purple-700 hover:bg-purple-50"
                      data-testid="button-cancel"
                    >
                      {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}