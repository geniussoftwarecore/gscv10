import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  File, 
  ChevronLeft, 
  Send, 
  User, 
  Mail, 
  Phone, 
  Building,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string;
  appName?: string;
  appDescription?: string;
  additionalRequirements?: string;
  estimatedBudget?: string;
  preferredTimeline?: string;
}

interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

interface ContactFormStepProps {
  appType: string;
  selectedFeatures: string[];
  formData: ContactFormData;
  attachedFiles: AttachedFile[];
  onFormDataChange: (data: ContactFormData) => void;
  onFilesChange: (files: AttachedFile[]) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function ContactFormStep({
  appType,
  selectedFeatures,
  formData,
  attachedFiles,
  onFormDataChange,
  onFilesChange,
  onSubmit,
  onBack,
  isSubmitting
}: ContactFormStepProps) {
  const { lang, dir } = useLanguage();
  const [dragActive, setDragActive] = useState(false);

  // Form validation schema
  const formSchema = z.object({
    customerName: z.string().min(2, lang === 'ar' ? 'الاسم مطلوب (حرفان على الأقل)' : 'Name is required (min 2 characters)'),
    customerEmail: z.string().email(lang === 'ar' ? 'بريد إلكتروني صحيح مطلوب' : 'Valid email is required'),
    customerPhone: z.string().min(8, lang === 'ar' ? 'رقم هاتف صحيح مطلوب' : 'Valid phone number is required'),
    customerCompany: z.string().optional(),
    appName: z.string().optional(),
    appDescription: z.string().optional(),
    additionalRequirements: z.string().optional(),
    estimatedBudget: z.string().optional(),
    preferredTimeline: z.string().optional(),
  });

  const form = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formData
  });

  const { handleSubmit, register, watch, formState: { errors } } = form;

  // Watch all form values and update parent
  const watchedValues = watch();
  useEffect(() => {
    onFormDataChange(watchedValues);
  }, [watchedValues, onFormDataChange]);

  // Get app type name
  const getAppTypeName = () => {
    const types: Record<string, { ar: string; en: string }> = {
      ecommerce: { ar: 'تجارة إلكترونية', en: 'E-commerce' },
      services: { ar: 'خدمات عند الطلب', en: 'On-Demand Services' },
      education: { ar: 'تعليم وتدريب', en: 'Education & Training' },
      health: { ar: 'صحة ولياقة', en: 'Health & Fitness' },
      fintech: { ar: 'مالية ومدفوعات', en: 'Fintech & Payments' },
      logistics: { ar: 'لوجستيات ونقل', en: 'Logistics & Transport' },
      media: { ar: 'وسائط وترفيه', en: 'Media & Entertainment' }
    };
    return lang === 'ar' ? types[appType]?.ar || appType : types[appType]?.en || appType;
  };

  // Handle file upload
  const handleFileUpload = (files: FileList) => {
    const validFiles: AttachedFile[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        alert(lang === 'ar' ? 'حجم الملف كبير جداً (أقل من 10 ميجا)' : 'File too large (max 10MB)');
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        alert(lang === 'ar' ? 'نوع الملف غير مدعوم' : 'Unsupported file type');
        return;
      }

      validFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type
      });
    });

    onFilesChange([...attachedFiles, ...validFiles]);
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Remove file
  const removeFile = (fileId: string) => {
    onFilesChange(attachedFiles.filter(f => f.id !== fileId));
  };

  // Get file icon
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type === 'application/pdf') return FileText;
    return File;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onFormSubmit = () => {
    onFormDataChange(watchedValues);
    onSubmit();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          {lang === 'ar' ? 'أكمل تفاصيل المشروع' : 'Complete Project Details'}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {lang === 'ar' 
            ? 'أضف تفاصيلك الشخصية ومتطلبات المشروع لنتمكن من التواصل معك'
            : 'Add your personal details and project requirements so we can get in touch with you'
          }
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:order-last"
        >
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                {lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* App Type */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {lang === 'ar' ? 'نوع التطبيق:' : 'App Type:'}
                </Label>
                <Badge variant="secondary" className="mt-1">
                  {getAppTypeName()}
                </Badge>
              </div>

              {/* Selected Features */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {lang === 'ar' ? `الميزات المختارة (${selectedFeatures.length}):` : `Selected Features (${selectedFeatures.length}):`}
                </Label>
                <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                  {selectedFeatures.slice(0, 8).map((featureId, idx) => (
                    <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-primary" />
                      {featureId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  ))}
                  {selectedFeatures.length > 8 && (
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {lang === 'ar' ? `و${selectedFeatures.length - 8} ميزة أخرى` : `+${selectedFeatures.length - 8} more features`}
                    </div>
                  )}
                </div>
              </div>

              {/* Attached Files */}
              {attachedFiles.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {lang === 'ar' ? `الملفات المرفقة (${attachedFiles.length}):` : `Attached Files (${attachedFiles.length}):`}
                  </Label>
                  <div className="mt-2 space-y-1">
                    {attachedFiles.map(file => (
                      <div key={file.id} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-xs">
                  {lang === 'ar' 
                    ? 'سنتواصل معك خلال 24 ساعة لمناقشة التفاصيل'
                    : 'We will contact you within 24 hours to discuss details'
                  }
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {lang === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">
                    {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
                  </Label>
                  <Input
                    id="customerName"
                    placeholder={lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    {...register('customerName')}
                    data-testid="input-customer-name"
                  />
                  {errors.customerName && (
                    <p className="text-sm text-red-600">{errors.customerName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">
                    {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    placeholder={lang === 'ar' ? 'example@email.com' : 'example@email.com'}
                    {...register('customerEmail')}
                    data-testid="input-customer-email"
                  />
                  {errors.customerEmail && (
                    <p className="text-sm text-red-600">{errors.customerEmail.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">
                    {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
                  </Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    placeholder={lang === 'ar' ? '+966 50 123 4567' : '+966 50 123 4567'}
                    {...register('customerPhone')}
                    data-testid="input-customer-phone"
                  />
                  {errors.customerPhone && (
                    <p className="text-sm text-red-600">{errors.customerPhone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerCompany">
                    {lang === 'ar' ? 'اسم الشركة (اختياري)' : 'Company Name (Optional)'}
                  </Label>
                  <Input
                    id="customerCompany"
                    placeholder={lang === 'ar' ? 'اسم شركتك أو مؤسستك' : 'Your company or organization'}
                    {...register('customerCompany')}
                    data-testid="input-customer-company"
                  />
                </div>
              </CardContent>
            </Card>

            {/* App Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  {lang === 'ar' ? 'تفاصيل التطبيق' : 'App Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appName">
                      {lang === 'ar' ? 'اسم التطبيق (اختياري)' : 'App Name (Optional)'}
                    </Label>
                    <Input
                      id="appName"
                      placeholder={lang === 'ar' ? 'ما اسم تطبيقك؟' : 'What will your app be called?'}
                      {...register('appName')}
                      data-testid="input-app-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedBudget">
                      {lang === 'ar' ? 'الميزانية المتوقعة' : 'Estimated Budget'}
                    </Label>
                    <Input
                      id="estimatedBudget"
                      placeholder={lang === 'ar' ? 'مثال: 50,000 ريال' : 'e.g., 50,000 SAR'}
                      {...register('estimatedBudget')}
                      data-testid="input-estimated-budget"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTimeline">
                    {lang === 'ar' ? 'الجدول الزمني المفضل' : 'Preferred Timeline'}
                  </Label>
                  <Input
                    id="preferredTimeline"
                    placeholder={lang === 'ar' ? 'مثال: 3-4 أشهر' : 'e.g., 3-4 months'}
                    {...register('preferredTimeline')}
                    data-testid="input-preferred-timeline"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appDescription">
                    {lang === 'ar' ? 'وصف التطبيق (اختياري)' : 'App Description (Optional)'}
                  </Label>
                  <Textarea
                    id="appDescription"
                    rows={3}
                    placeholder={lang === 'ar' ? 'اشرح فكرة تطبيقك والهدف منه...' : 'Describe your app idea and its purpose...'}
                    {...register('appDescription')}
                    data-testid="textarea-app-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalRequirements">
                    {lang === 'ar' ? 'متطلبات إضافية' : 'Additional Requirements'}
                  </Label>
                  <Textarea
                    id="additionalRequirements"
                    rows={3}
                    placeholder={lang === 'ar' ? 'أي متطلبات خاصة أو ميزات إضافية تحتاجها؟' : 'Any special requirements or additional features you need?'}
                    {...register('additionalRequirements')}
                    data-testid="textarea-additional-requirements"
                  />
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  {lang === 'ar' ? 'رفع الملفات (اختياري)' : 'File Upload (Optional)'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drop Zone */}
                <div
                  className={cn(
                    "border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center transition-colors",
                    dragActive && "border-primary bg-primary/5",
                    "hover:border-primary hover:bg-primary/5"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  data-testid="dropzone-file-upload"
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {lang === 'ar' 
                      ? 'اسحب الملفات هنا أو انقر للرفع'
                      : 'Drag files here or click to upload'
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    {lang === 'ar' 
                      ? 'PDF, Word, صور (أقل من 10 ميجا)'
                      : 'PDF, Word, Images (max 10MB)'
                    }
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    data-testid="input-file-upload"
                  />
                </div>

                {/* Uploaded Files */}
                {attachedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>{lang === 'ar' ? 'الملفات المرفقة:' : 'Attached Files:'}</Label>
                    <div className="space-y-2">
                      {attachedFiles.map(file => {
                        const IconComponent = getFileIcon(file.type);
                        return (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-5 h-5 text-blue-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFile(file.id)}
                              data-testid={`button-remove-file-${file.id}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onBack}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-2xl"
                data-testid="button-back-step3"
              >
                <ChevronLeft className={cn(
                  "w-5 h-5 mr-2",
                  dir === 'rtl' && "rotate-180 mr-0 ml-2"
                )} />
                {lang === 'ar' ? 'العودة' : 'Back'}
              </Button>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-2xl bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl transition-all duration-300"
                data-testid="button-submit-form"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    {lang === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
                    <Send className={cn(
                      "w-5 h-5 ml-2",
                      dir === 'rtl' && "rotate-180 ml-0 mr-2"
                    )} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}