import { useState, useEffect } from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2, Smartphone, Upload, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/i18n/lang";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().optional(),
  service: z.string().min(1, "Please select a service type"),
  serviceApplication: z.string().optional(),
  selectedApp: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  budget: z.string().optional(),
  currency: z.string().optional(),
  timeline: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const { t } = useTranslation();
  const { dir } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedServiceApplication, setSelectedServiceApplication] = useState<string>("");
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>(dir === 'rtl' ? "ريال يمني" : "YER");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  // Check for pre-selected service in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const priceParam = urlParams.get('price');
    
    if (serviceParam) {
      const decodedService = decodeURIComponent(serviceParam);
      
      // Check if this is an app name or main service
      const mainServices = [
        "تطوير تطبيقات الموبايل",
        "تطوير المواقع والمنصات", 
        "تطوير تطبيقات سطح المكتب",
        "الحلول الذكية والبرمجية للهواتف الذكية",
        "تصميم الجرافيكس والهوية البصرية",
        "التسويق الرقمي والإعلانات",
        "الحلول الذكية والذكاء الاصطناعي",
        "أنظمة ERPNext"
      ];
      
      // Check if this is a marketing package or design package
      const isMarketingPackage = decodedService.includes('تسويق') || decodedService.includes('إعلان') || decodedService.includes('حملة') || 
                                decodedService.includes('Marketing') || decodedService.includes('Campaign') || decodedService.includes('Social Media');
      const isDesignPackage = decodedService.includes('تصميم') || decodedService.includes('هوية') || decodedService.includes('Design') || 
                             decodedService.includes('Identity') || decodedService.includes('Visual');
      
      if (mainServices.includes(decodedService)) {
        // It's a main service
        setSelectedService(decodedService);
        setValue("service", decodedService);
        toast({
          title: dir === 'rtl' ? 'تم اختيار الخدمة' : 'Service Selected',
          description: dir === 'rtl' ? `تم اختيار خدمة: ${decodedService}` : `Selected service: ${decodedService}`,
        });
      } else if (isMarketingPackage) {
        // It's a marketing package
        const marketingService = "التسويق الرقمي والإعلانات";
        setSelectedService(marketingService);
        setValue("service", marketingService);
        setSelectedApp(decodedService);
        setValue("selectedApp", decodedService);
        
        // Set budget if price is provided
        if (priceParam) {
          setValue("budget", priceParam);
          setValue("currency", "YER");
          setSelectedCurrency("YER");
        }
        
        toast({
          title: dir === 'rtl' ? 'تم اختيار الباقة التسويقية' : 'Marketing Package Selected',
          description: dir === 'rtl' ? `تم اختيار: ${decodedService}${priceParam ? ` - ${parseFloat(priceParam).toLocaleString()} ريال` : ''}` : `Selected: ${decodedService}${priceParam ? ` - ${parseFloat(priceParam).toLocaleString()} SAR` : ''}`,
        });
      } else if (isDesignPackage) {
        // It's a design package
        const designService = "تصميم الجرافيكس والهوية البصرية";
        setSelectedService(designService);
        setValue("service", designService);
        setSelectedApp(decodedService);
        setValue("selectedApp", decodedService);
        
        // Set budget if price is provided
        if (priceParam) {
          setValue("budget", priceParam);
          setValue("currency", "YER");
          setSelectedCurrency("YER");
        }
        
        toast({
          title: dir === 'rtl' ? 'تم اختيار الباقة التصميمية' : 'Design Package Selected',
          description: dir === 'rtl' ? `تم اختيار: ${decodedService}${priceParam ? ` - ${parseFloat(priceParam).toLocaleString()} ريال` : ''}` : `Selected: ${decodedService}${priceParam ? ` - ${parseFloat(priceParam).toLocaleString()} SAR` : ''}`,
        });
      } else {
        // It's an app - set a default service and the specific app
        const defaultService = "تطوير تطبيقات الموبايل";
        setSelectedService(defaultService);
        setValue("service", defaultService);
        setSelectedApp(decodedService);
        setValue("selectedApp", decodedService);
        
        // Set budget if price is provided
        if (priceParam) {
          setValue("budget", priceParam);
          setValue("currency", "YER");
          setSelectedCurrency("YER");
        }
        
        toast({
          title: dir === 'rtl' ? 'تم اختيار التطبيق' : 'App Selected',
          description: dir === 'rtl' ? `تم اختيار تطبيق: ${decodedService}${priceParam ? ` - ${parseFloat(priceParam).toLocaleString()} ريال` : ''}` : `Selected app: ${decodedService}${priceParam ? ` - ${parseFloat(priceParam).toLocaleString()} SAR` : ''}`,
        });
      }
    }
  }, [setValue, toast, dir]);

  // File upload handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: dir === 'rtl' ? 'نوع ملف غير مدعوم' : 'Unsupported file type',
          description: dir === 'rtl' ? `الملف ${file.name} غير مدعوم. يُسمح بـ PDF, JPG, PNG, DOC, DOCX فقط` : `File ${file.name} is not supported. Only PDF, JPG, PNG, DOC, DOCX are allowed`,
          variant: 'destructive'
        });
        return false;
      }
      if (file.size > maxSize) {
        toast({
          title: dir === 'rtl' ? 'حجم الملف كبير جداً' : 'File too large',
          description: dir === 'rtl' ? `الملف ${file.name} كبير جداً. الحد الأقصى 5MB` : `File ${file.name} is too large. Maximum size is 5MB`,
          variant: 'destructive'
        });
        return false;
      }
      return true;
    });

    if (uploadedFiles.length + validFiles.length > 3) {
      toast({
        title: dir === 'rtl' ? 'عدد كبير من الملفات' : 'Too many files',
        description: dir === 'rtl' ? 'يمكنك رفع 3 ملفات كحد أقصى' : 'You can upload maximum 3 files',
        variant: 'destructive'
      });
      return;
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
    
    if (validFiles.length > 0) {
      toast({
        title: dir === 'rtl' ? 'تم رفع الملفات' : 'Files uploaded',
        description: dir === 'rtl' ? `تم رفع ${validFiles.length} ملف بنجاح` : `${validFiles.length} files uploaded successfully`
      });
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      // Enhanced data for CRM integration
      const enhancedData = {
        ...data,
        leadSource: 'website_contact_form',
        utm: {
          source: new URLSearchParams(window.location.search).get('utm_source') || 'direct',
          medium: new URLSearchParams(window.location.search).get('utm_medium') || 'website',
          campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        }
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enhancedData),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('contact.form.successTitle'),
        description: t('contact.form.successDesc'),
      });
      reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error('Contact form submission error:', error);
      toast({
        title: t('contact.form.errorTitle'),
        description: t('contact.form.errorDesc'),
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: ContactFormData) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  // Main services only (apps will appear in separate field)
  const services = [
    "تطوير تطبيقات الموبايل",
    "تطوير المواقع والمنصات", 
    "تطوير تطبيقات سطح المكتب",
    "الحلول الذكية والبرمجية للهواتف الذكية",
    "تصميم الجرافيكس والهوية البصرية",
    "التسويق الرقمي والإعلانات",
    "الحلول الذكية والذكاء الاصطناعي",
    "أنظمة ERPNext",
    dir === 'rtl' ? "استشارات تقنية" : "Technical Consulting",
    dir === 'rtl' ? "أخرى" : "Other",
  ];
  
  const currencies = [
    { value: "YER", label: dir === 'rtl' ? "ريال يمني (YER)" : "Yemeni Rial (YER)" },
    { value: "USD", label: dir === 'rtl' ? "دولار أمريكي (USD)" : "US Dollar (USD)" },
    { value: "SAR", label: dir === 'rtl' ? "ريال سعودي (SAR)" : "Saudi Riyal (SAR)" },
    { value: "AED", label: dir === 'rtl' ? "درهم إماراتي (AED)" : "UAE Dirham (AED)" },
    { value: "EUR", label: dir === 'rtl' ? "يورو (EUR)" : "Euro (EUR)" },
  ];
  
  const timelineOptions = [
    dir === 'rtl' ? "أقل من شهر" : "Less than 1 month",
    dir === 'rtl' ? "1-3 أشهر" : "1-3 months",
    dir === 'rtl' ? "3-6 أشهر" : "3-6 months",
    dir === 'rtl' ? "6-12 شهر" : "6-12 months",
    dir === 'rtl' ? "أكثر من سنة" : "More than 1 year",
  ];

  // Service applications mapping
  const serviceApplications: Record<string, string[]> = {
    "تطوير تطبيقات الموبايل": [
      dir === 'rtl' ? "تطبيق تجاري للمتاجر الإلكترونية" : "E-commerce Mobile App",
      dir === 'rtl' ? "تطبيق إدارة المخزون والمستودعات" : "Inventory Management App",
      dir === 'rtl' ? "تطبيق خدمات التوصيل والشحن" : "Delivery & Shipping App",
      dir === 'rtl' ? "تطبيق حجز المواعيد والخدمات" : "Appointment Booking App",
      dir === 'rtl' ? "تطبيق تعليمي وتدريبي" : "Educational & Training App",
      dir === 'rtl' ? "تطبيق طبي وصحي" : "Healthcare & Medical App",
      dir === 'rtl' ? "تطبيق مالي ومصرفي" : "Financial & Banking App",
      dir === 'rtl' ? "تطبيق شبكات اجتماعية" : "Social Media App",
      dir === 'rtl' ? "تطبيق ألعاب وترفيه" : "Gaming & Entertainment App",
      dir === 'rtl' ? "تطبيق مطاعم وطعام" : "Restaurant & Food App",
      dir === 'rtl' ? "تطبيق سفر وسياحة" : "Travel & Tourism App",
      dir === 'rtl' ? "تطبيق عقارات" : "Real Estate App",
      dir === 'rtl' ? "تطبيق نقل ومواصلات" : "Transportation App",
      dir === 'rtl' ? "تطبيق رياضة ولياقة" : "Sports & Fitness App",
      dir === 'rtl' ? "تطبيق أخبار وإعلام" : "News & Media App",
      dir === 'rtl' ? "تطبيق موسيقى وصوتيات" : "Music & Audio App",
      dir === 'rtl' ? "تطبيق تصوير وفيديو" : "Camera & Video App",
      dir === 'rtl' ? "تطبيق إنتاجية وأدوات" : "Productivity & Tools App",
      dir === 'rtl' ? "تطبيق أعمال وشركات" : "Business & Enterprise App",
      dir === 'rtl' ? "تطبيق حكومي وخدمات عامة" : "Government & Public Services App",
      dir === 'rtl' ? "تطبيق زراعة وبيئة" : "Agriculture & Environment App",
      dir === 'rtl' ? "تطبيق تقني ومطورين" : "Tech & Developer Tools App",
      dir === 'rtl' ? "تطبيق أمان وحماية" : "Security & Safety App",
      dir === 'rtl' ? "تطبيق IoT والأجهزة الذكية" : "IoT & Smart Devices App",
      dir === 'rtl' ? "تطبيق ذكاء اصطناعي" : "AI-Powered App",
      dir === 'rtl' ? "تطبيق مخصص حسب الطلب" : "Custom Mobile App"
    ],
    "تطوير المواقع والمنصات": [
      dir === 'rtl' ? "موقع تجاري" : "E-commerce Website",
      dir === 'rtl' ? "موقع شخصي أو محفظة أعمال" : "Portfolio Website",
      dir === 'rtl' ? "منصة إدارة محتوى" : "Content Management System",
      dir === 'rtl' ? "منصة تعليمية" : "Educational Platform",
      dir === 'rtl' ? "منصة حجوزات" : "Booking Platform",
      dir === 'rtl' ? "منصة إعلانات مبوبة" : "Classified Ads Platform",
      dir === 'rtl' ? "منصة شبكة اجتماعية" : "Social Media Platform",
      dir === 'rtl' ? "منصة مخصصة" : "Custom Platform"
    ],
    "تطوير تطبيقات سطح المكتب": [
      dir === 'rtl' ? "تطبيق إدارة المخزون" : "Inventory Management System",
      dir === 'rtl' ? "تطبيق المحاسبة" : "Accounting Software",
      dir === 'rtl' ? "تطبيق إدارة العملاء CRM" : "CRM System",
      dir === 'rtl' ? "تطبيق إدارة المشاريع" : "Project Management Tool",
      dir === 'rtl' ? "تطبيق إدارة المبيعات" : "Sales Management System",
      dir === 'rtl' ? "تطبيق مخصص" : "Custom Desktop Application"
    ],
    "الحلول الذكية والبرمجية للهواتف الذكية": [
      dir === 'rtl' ? "حل IoT للمنازل الذكية" : "Smart Home IoT Solution",
      dir === 'rtl' ? "حل إدارة الطاقة" : "Energy Management Solution",
      dir === 'rtl' ? "حل مراقبة وأمان" : "Security & Monitoring Solution",
      dir === 'rtl' ? "حل ذكي للمصانع" : "Smart Factory Solution",
      dir === 'rtl' ? "حل ذكي للزراعة" : "Smart Agriculture Solution",
      dir === 'rtl' ? "حل مخصص" : "Custom Smart Solution"
    ],
    "الحلول الذكية والذكاء الاصطناعي": [
      dir === 'rtl' ? "نظام ذكاء اصطناعي للتنبؤ" : "AI Prediction System",
      dir === 'rtl' ? "نظام معالجة اللغات الطبيعية" : "NLP System",
      dir === 'rtl' ? "نظام تحليل البيانات" : "Data Analytics System",
      dir === 'rtl' ? "نظام التعرف على الصور" : "Image Recognition System",
      dir === 'rtl' ? "نظام ذكي للمساعدة الآلية" : "AI Assistant System",
      dir === 'rtl' ? "حل ذكاء اصطناعي مخصص" : "Custom AI Solution"
    ],
    "أنظمة ERPNext": [
      dir === 'rtl' ? "نظام ERP للمصانع" : "Manufacturing ERP",
      dir === 'rtl' ? "نظام ERP التجاري" : "Retail ERP",
      dir === 'rtl' ? "نظام ERP للخدمات" : "Services ERP",
      dir === 'rtl' ? "نظام ERP للمستشفيات" : "Healthcare ERP",
      dir === 'rtl' ? "نظام ERP للتعليم" : "Education ERP",
      dir === 'rtl' ? "نظام ERP مخصص" : "Custom ERP"
    ],
    "تصميم الجرافيكس والهوية البصرية": [
      dir === 'rtl' ? "تصميم هوية بصرية شاملة" : "Complete Brand Identity Design",
      dir === 'rtl' ? "تصميم شعار احترافي" : "Professional Logo Design",
      dir === 'rtl' ? "تصميم بروشورات وفلايرز" : "Brochure & Flyer Design",
      dir === 'rtl' ? "تصميم مواد تسويقية" : "Marketing Materials Design",
      dir === 'rtl' ? "تصميم لافتات ومعارض" : "Banners & Exhibition Design",
      dir === 'rtl' ? "تصميم مواقع التواصل الاجتماعي" : "Social Media Graphics",
      dir === 'rtl' ? "تصميم عبوات ومنتجات" : "Packaging Design",
      dir === 'rtl' ? "تصميم تطبيقات UI/UX" : "App UI/UX Design"
    ],
    "التسويق الرقمي والإعلانات": [
      dir === 'rtl' ? "حملات إعلانية على جوجل" : "Google Ads Campaigns",
      dir === 'rtl' ? "حملات إعلانية على فيسبوك وإنستغرام" : "Facebook & Instagram Ads",
      dir === 'rtl' ? "تحسين محركات البحث SEO" : "Search Engine Optimization (SEO)",
      dir === 'rtl' ? "إدارة حسابات التواصل الاجتماعي" : "Social Media Management",
      dir === 'rtl' ? "التسويق عبر البريد الإلكتروني" : "Email Marketing",
      dir === 'rtl' ? "التسويق بالمحتوى" : "Content Marketing",
      dir === 'rtl' ? "تحليل البيانات والتقارير" : "Analytics & Reporting",
      dir === 'rtl' ? "استراتيجية تسويقية شاملة" : "Complete Marketing Strategy"
    ]
  };

  return (
    <Section size="xl" background="light">
      <Container size="lg">
        <AnimatedSection delay={0.3}>
          <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 text-center py-8">
              <CardTitle className="text-3xl lg:text-4xl font-bold text-secondary">
                {t('contact.sendMessage')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 lg:p-12">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
                      {t('contact.form.name')} *
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder={dir === 'rtl' ? "اسمك الكامل" : "Your full name"}
                      className="h-12 text-base border-2 focus:border-primary rounded-xl"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
                      {t('contact.form.email')} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="email@example.com"
                      className="h-12 text-base border-2 focus:border-primary rounded-xl"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 mb-2 block">
                      {t('contact.form.phone')} *
                    </Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="+967 777 123 456"
                      className="h-12 text-base border-2 focus:border-primary rounded-xl"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-2">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="company" className="text-sm font-semibold text-gray-700 mb-2 block">
                      {t('contact.form.company')}
                    </Label>
                    <Input
                      id="company"
                      {...register("company")}
                      placeholder={t('contact.form.company')}
                      className="h-12 text-base border-2 focus:border-primary rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="service" className="text-sm font-semibold text-gray-700 mb-2 block">
                      {t('contact.form.service')} *
                      {selectedService && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {dir === 'rtl' ? 'محدد مسبقاً' : 'Pre-selected'}
                        </span>
                      )}
                    </Label>
                    <Select 
                      value={selectedService} 
                      onValueChange={(value) => {
                        setValue("service", value);
                        setSelectedService(value);
                        // Clear service application when service changes
                        setSelectedServiceApplication("");
                        setValue("serviceApplication", "");
                      }}
                    >
                      <SelectTrigger className="h-12 text-base border-2 focus:border-primary rounded-xl">
                        <SelectValue placeholder={t('contact.form.service')} />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.service && (
                      <p className="text-red-500 text-sm mt-2">{errors.service.message}</p>
                    )}
                  </div>
                </div>

                {/* Service Application Field - appears when a service with applications is selected */}
                {selectedService && serviceApplications[selectedService] && (
                  <div>
                    <Label htmlFor="serviceApplication" className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-primary" />
                      {dir === 'rtl' ? 'نوع التطبيق المطلوب' : 'Application Type'} 
                      {selectedServiceApplication && (
                        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {dir === 'rtl' ? 'مختار' : 'Selected'}
                        </span>
                      )}
                    </Label>
                    <Select 
                      value={selectedServiceApplication} 
                      onValueChange={(value) => {
                        setValue("serviceApplication", value);
                        setSelectedServiceApplication(value);
                      }}
                    >
                      <SelectTrigger className="h-12 text-base border-2 focus:border-primary rounded-xl">
                        <SelectValue placeholder={dir === 'rtl' ? 'اختر نوع التطبيق' : 'Select application type'} />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceApplications[selectedService].map((app) => (
                          <SelectItem key={app} value={app}>
                            {app}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-600 mt-1">
                      {dir === 'rtl' ? 'اختر نوع التطبيق الذي تريد تطويره' : 'Choose the specific type of application you want to develop'}
                    </p>
                  </div>
                )}

                {/* Selected App Field - appears when an app is selected */}
                {selectedApp && (
                  <div className="mb-6">
                    <Label htmlFor="selectedApp" className="text-sm font-semibold text-gray-700 mb-2 block">
                      {dir === 'rtl' ? 'التطبيق المختار' : 'Selected App'}
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {dir === 'rtl' ? 'محدد مسبقاً' : 'Pre-selected'}
                      </span>
                    </Label>
                    <div className="h-12 text-base border-2 border-blue-200 bg-blue-50 rounded-xl px-4 flex items-center">
                      <span className="text-blue-800 font-medium">{selectedApp}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {dir === 'rtl' ? 'هذا هو التطبيق الذي اخترته من صفحة تفاصيل الخدمة' : 'This is the app you selected from the service details page'}
                    </p>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="budget" className="text-sm font-semibold text-gray-700 mb-2 block">
                      {t('contact.form.budget')}
                    </Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          id="budget"
                          type="number"
                          {...register("budget")}
                          placeholder={dir === 'rtl' ? "أدخل المبلغ" : "Enter amount"}
                          className="h-12 text-base border-2 focus:border-primary rounded-xl"
                          data-testid="input-budget"
                        />
                      </div>
                      <div className="w-40">
                        <Select 
                          value={selectedCurrency} 
                          onValueChange={(value) => {
                            setSelectedCurrency(value);
                            setValue("currency", value);
                          }}
                        >
                          <SelectTrigger className="h-12 text-base border-2 focus:border-primary rounded-xl" data-testid="select-currency">
                            <SelectValue placeholder={dir === 'rtl' ? "العملة" : "Currency"} />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.value} value={currency.value}>
                                {currency.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 mb-2">
                        {dir === 'rtl' ? 'تلميحات سريعة:' : 'Quick suggestions:'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000].map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => setValue("budget", amount.toString())}
                            className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-primary hover:text-white text-gray-700 rounded-lg transition-all duration-200 border border-gray-200 hover:border-primary"
                            data-testid={`button-budget-${amount}`}
                          >
                            {amount.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="timeline" className="text-sm font-semibold text-gray-700 mb-2 block">
                      {t('contact.form.timeline')}
                    </Label>
                    <Select onValueChange={(value) => setValue("timeline", value)}>
                      <SelectTrigger className="h-12 text-base border-2 focus:border-primary rounded-xl">
                        <SelectValue placeholder={t('contact.form.timeline')} />
                      </SelectTrigger>
                      <SelectContent>
                        {timelineOptions.map((timeline) => (
                          <SelectItem key={timeline} value={timeline}>
                            {timeline}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-semibold text-gray-700 mb-2 block">
                    {t('contact.form.message')} *
                  </Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    placeholder={t('contact.form.message')}
                    rows={6}
                    className="text-base border-2 focus:border-primary rounded-xl resize-none"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-2">{errors.message.message}</p>
                  )}
                </div>

                {/* File Upload Section */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                    <Upload className="w-4 h-4 text-primary" />
                    {dir === 'rtl' ? 'إرفاق ملفات (اختياري)' : 'Attach Files (Optional)'}
                  </Label>
                  
                  <div className="space-y-3">
                    {/* Upload Button */}
                    <div className="relative">
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        data-testid="input-file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 hover:border-primary rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                        data-testid="button-file-upload"
                      >
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600 font-medium">
                            {dir === 'rtl' ? 'اضغط لرفع الملفات أو اسحبها هنا' : 'Click to upload files or drag them here'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {dir === 'rtl' ? 'PDF, JPG, PNG, DOC (حتى 5MB لكل ملف)' : 'PDF, JPG, PNG, DOC (up to 5MB each)'}
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          {dir === 'rtl' ? `الملفات المرفقة (${uploadedFiles.length}/3):` : `Attached Files (${uploadedFiles.length}/3):`}
                        </p>
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                            data-testid={`file-item-${index}`}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Upload className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-blue-800 truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-blue-600">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                              data-testid={`button-remove-file-${index}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2">
                    {dir === 'rtl' 
                      ? 'يمكنك رفع حتى 3 ملفات (PDF, JPG, PNG, DOC) بحجم أقصى 5MB لكل ملف'
                      : 'You can upload up to 3 files (PDF, JPG, PNG, DOC) with maximum 5MB per file'
                    }
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('contact.form.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {t('contact.form.send')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </AnimatedSection>
      </Container>
    </Section>
  );
}