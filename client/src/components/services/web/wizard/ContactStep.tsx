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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  File, 
  ChevronLeft, 
  ArrowRight, 
  User, 
  Mail, 
  Phone, 
  Building,
  Globe,
  Link,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  siteType: string;
  selectedFeatures: string[];
  contentScope: string;
  domainHosting: string;
  languages: string[];
  integrations: string[];
  notes: string;
}

interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

interface ContactStepProps {
  siteType: string;
  selectedFeatures: string[];
  formData: ContactFormData;
  attachedFiles: AttachedFile[];
  onFormDataChange: (data: ContactFormData) => void;
  onFilesChange: (files: AttachedFile[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ContactStep({
  siteType,
  selectedFeatures,
  formData,
  attachedFiles,
  onFormDataChange,
  onFilesChange,
  onNext,
  onBack
}: ContactStepProps) {
  const { lang, dir } = useLanguage();
  const [dragActive, setDragActive] = useState(false);

  // Form validation schema
  const formSchema = z.object({
    customerName: z.string().min(2, lang === 'ar' ? 'الاسم مطلوب (حرفان على الأقل)' : 'Name is required (min 2 characters)'),
    customerEmail: z.string().email(lang === 'ar' ? 'بريد إلكتروني صحيح مطلوب' : 'Valid email is required'),
    customerPhone: z.string().min(8, lang === 'ar' ? 'رقم هاتف صحيح مطلوب' : 'Valid phone number is required'),
    siteType: z.string(),
    selectedFeatures: z.array(z.string()),
    contentScope: z.string().optional(),
    domainHosting: z.string().optional(),
    languages: z.array(z.string()).optional(),
    integrations: z.array(z.string()).optional(),
    notes: z.string().optional(),
  });

  const form = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...formData,
      siteType,
      selectedFeatures,
      languages: formData.languages || ['ar'],
      integrations: formData.integrations || []
    }
  });

  const { handleSubmit, register, watch, setValue, formState: { errors } } = form;

  // Watch all form values and update parent
  const watchedValues = watch();
  useEffect(() => {
    onFormDataChange(watchedValues);
  }, [watchedValues, onFormDataChange]);

  // Get site type name
  const getSiteTypeName = () => {
    const types: Record<string, { ar: string; en: string }> = {
      company_profile: { ar: 'موقع تعريفي/بورتفوليو', en: 'Company Profile/Portfolio' },
      blog_magazine: { ar: 'مدوّنة/مجلة', en: 'Blog/Magazine' },
      ecommerce: { ar: 'متجر إلكتروني', en: 'E-commerce Store' },
      elearning: { ar: 'منصّة تعليمية', en: 'E-learning Platform' },
      booking: { ar: 'منصّة حجز/خدمات', en: 'Booking/Services Platform' },
      custom_platform: { ar: 'منصّة مخصّصة/SaaS', en: 'Custom Platform/SaaS' }
    };
    return lang === 'ar' ? types[siteType]?.ar || siteType : types[siteType]?.en || siteType;
  };

  // Handle file upload
  const handleFileUpload = (files: FileList) => {
    const validFiles: AttachedFile[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/png', 'image/jpg', 'image/jpeg', 'image/webp',
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    Array.from(files).forEach((file) => {
      // Check file size
      if (file.size > maxSize) {
        alert(lang === 'ar' 
          ? `حجم الملف ${file.name} كبير جداً (الحد الأقصى 10MB)`
          : `File ${file.name} is too large (max 10MB)`
        );
        return;
      }

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        alert(lang === 'ar' 
          ? `نوع الملف ${file.name} غير مدعوم`
          : `File type ${file.name} is not supported`
        );
        return;
      }

      // Check total files limit
      if (attachedFiles.length + validFiles.length >= 5) {
        alert(lang === 'ar' 
          ? 'يمكن رفع 5 ملفات كحد أقصى'
          : 'Maximum 5 files allowed'
        );
        return;
      }

      validFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    });

    if (validFiles.length > 0) {
      onFilesChange([...attachedFiles, ...validFiles]);
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Remove file
  const removeFile = (fileId: string) => {
    onFilesChange(attachedFiles.filter(file => file.id !== fileId));
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type === 'application/pdf') return FileText;
    return File;
  };

  // Available languages
  const availableLanguages = [
    { id: 'ar', name: lang === 'ar' ? 'العربية' : 'Arabic' },
    { id: 'en', name: lang === 'ar' ? 'الإنجليزية' : 'English' },
    { id: 'fr', name: lang === 'ar' ? 'الفرنسية' : 'French' },
    { id: 'de', name: lang === 'ar' ? 'الألمانية' : 'German' },
    { id: 'es', name: lang === 'ar' ? 'الإسبانية' : 'Spanish' }
  ];

  // Available integrations
  const availableIntegrations = [
    'GA4', 'MetaPixel', 'LocalWallet', 'Stripe', 'PayPal', 'CRM', 'ERP', 'SMS', 'WhatsApp'
  ];

  const onSubmit = () => {
    onNext();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h2 
          className="text-3xl font-bold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {lang === 'ar' ? 'بيانات التواصل والمتطلبات' : 'Contact Details & Requirements'}
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {lang === 'ar' ? 'املأ بياناتك وارفع أي ملفات (شعار، دليل هوية، كتالوج...).' : 'Fill your details and upload any files (logo, brand guide, catalog...).'}
        </motion.p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {lang === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName" className="text-sm font-medium">
                    {lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                  </Label>
                  <Input
                    id="customerName"
                    {...register('customerName')}
                    className={cn(errors.customerName && 'border-red-500')}
                    placeholder={lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    data-testid="input-name"
                  />
                  {errors.customerName && (
                    <p className="text-sm text-red-500 mt-1">{errors.customerName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="customerEmail" className="text-sm font-medium">
                    {lang === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    {...register('customerEmail')}
                    className={cn(errors.customerEmail && 'border-red-500')}
                    placeholder={lang === 'ar' ? 'your@email.com' : 'your@email.com'}
                    data-testid="input-email"
                  />
                  {errors.customerEmail && (
                    <p className="text-sm text-red-500 mt-1">{errors.customerEmail.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="customerPhone" className="text-sm font-medium">
                    {lang === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
                  </Label>
                  <Input
                    id="customerPhone"
                    {...register('customerPhone')}
                    className={cn(errors.customerPhone && 'border-red-500')}
                    placeholder={lang === 'ar' ? '+966 5xxxxxxxx' : '+966 5xxxxxxxx'}
                    data-testid="input-phone"
                  />
                  {errors.customerPhone && (
                    <p className="text-sm text-red-500 mt-1">{errors.customerPhone.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Project Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {lang === 'ar' ? 'متطلبات المشروع' : 'Project Requirements'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected Type and Features Summary */}
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {lang === 'ar' ? 'نوع الموقع المختار:' : 'Selected Site Type:'}
                  </Label>
                  <p className="text-sm font-medium">{getSiteTypeName()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {lang === 'ar' ? 'الميزات المختارة:' : 'Selected Features:'}
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedFeatures.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="contentScope" className="text-sm font-medium">
                  {lang === 'ar' ? 'نطاق المحتوى (أقسام/صفحات/محتوى)' : 'Content Scope (sections/pages/content)'}
                </Label>
                <Textarea
                  id="contentScope"
                  {...register('contentScope')}
                  placeholder={lang === 'ar' ? 'مثال: الرئيسية، عنّا، خدماتنا، أعمالنا، تواصل معنا...' : 'Example: Home, About, Services, Portfolio, Contact...'}
                  rows={3}
                  data-testid="input-content-scope"
                />
              </div>

              <div>
                <Label htmlFor="domainHosting" className="text-sm font-medium">
                  {lang === 'ar' ? 'الدومين والاستضافة' : 'Domain & Hosting'}
                </Label>
                <Textarea
                  id="domainHosting"
                  {...register('domainHosting')}
                  placeholder={lang === 'ar' ? 'مثال: لديّ دومين واستضافة مشتركة، أريد ترقية أو احتاج دومين واستضافة جديدة...' : 'Example: I have domain and shared hosting, need upgrade or need new domain and hosting...'}
                  rows={2}
                  data-testid="input-domain-hosting"
                />
              </div>

              {/* Languages Selection */}
              <div>
                <Label className="text-sm font-medium">
                  {lang === 'ar' ? 'اللغات المطلوبة' : 'Required Languages'}
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {availableLanguages.map((language) => (
                    <label key={language.id} className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="checkbox"
                        value={language.id}
                        checked={watchedValues.languages?.includes(language.id) || false}
                        onChange={(e) => {
                          const currentLanguages = watchedValues.languages || [];
                          if (e.target.checked) {
                            setValue('languages', [...currentLanguages, language.id]);
                          } else {
                            setValue('languages', currentLanguages.filter(l => l !== language.id));
                          }
                        }}
                        className="rounded border-gray-300"
                        data-testid={`checkbox-language-${language.id}`}
                      />
                      <span className="text-sm">{language.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Integrations Selection */}
              <div>
                <Label className="text-sm font-medium">
                  {lang === 'ar' ? 'التكاملات المطلوبة' : 'Required Integrations'}
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {availableIntegrations.map((integration) => (
                    <label key={integration} className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="checkbox"
                        value={integration}
                        checked={watchedValues.integrations?.includes(integration) || false}
                        onChange={(e) => {
                          const currentIntegrations = watchedValues.integrations || [];
                          if (e.target.checked) {
                            setValue('integrations', [...currentIntegrations, integration]);
                          } else {
                            setValue('integrations', currentIntegrations.filter(i => i !== integration));
                          }
                        }}
                        className="rounded border-gray-300"
                        data-testid={`checkbox-integration-${integration}`}
                      />
                      <span className="text-sm">{integration}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium">
                  {lang === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                </Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder={lang === 'ar' ? 'أي تفاصيل أخرى أو متطلبات خاصة...' : 'Any other details or special requirements...'}
                  rows={4}
                  data-testid="input-notes"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* File Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                {lang === 'ar' ? 'ملفات مرفقة (اختياري)' : 'Attached Files (Optional)'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Area */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  dragActive 
                    ? "border-primary bg-primary/5" 
                    : "border-gray-300 dark:border-gray-700 hover:border-primary/50",
                  "cursor-pointer"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
                data-testid="file-input"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {lang === 'ar' ? 'اسحب الملفات هنا أو انقر للاختيار' : 'Drag files here or click to select'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {lang === 'ar' 
                    ? 'PNG, JPG, WebP, PDF, DOCX • حتى 10MB لكل ملف • 5 ملفات كحد أقصى'
                    : 'PNG, JPG, WebP, PDF, DOCX • Up to 10MB per file • 5 files max'
                  }
                </p>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.webp,.pdf,.docx,.doc"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Uploaded Files */}
              {attachedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {lang === 'ar' ? 'الملفات المرفقة:' : 'Attached Files:'}
                  </h4>
                  {attachedFiles.map((file) => {
                    const FileIcon = getFileIcon(file.type);
                    return (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileIcon className="w-8 h-8 text-gray-500 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="text-red-500 hover:text-red-700 flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div 
          className="flex justify-between pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            size="lg"
            className={cn(
              "px-8 py-3 text-lg font-medium",
              dir === 'rtl' ? 'flex-row-reverse' : ''
            )}
            data-testid="back-btn"
          >
            <ChevronLeft className={cn("w-5 h-5", dir === 'rtl' ? 'rotate-180 ml-2' : 'mr-2')} />
            {lang === 'ar' ? 'العودة' : 'Back'}
          </Button>
          
          <Button
            type="submit"
            size="lg"
            className={cn(
              "px-8 py-3 text-lg font-medium",
              dir === 'rtl' ? 'flex-row-reverse' : ''
            )}
            data-testid="next-btn"
          >
            {lang === 'ar' ? 'مراجعة الملخص' : 'Review Summary'}
            <ArrowRight className={cn("w-5 h-5", dir === 'rtl' ? 'rotate-180 mr-2' : 'ml-2')} />
          </Button>
        </motion.div>
      </form>
    </div>
  );
}