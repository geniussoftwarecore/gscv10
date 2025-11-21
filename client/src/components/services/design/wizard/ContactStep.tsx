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
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company?: string;
  selectedPackage: string;
  selectedFeatures: string[];
  projectDescription: string;
  budget?: string;
  timeline?: string;
  additionalRequirements?: string;
}

interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

interface ContactStepProps {
  selectedPackage: string;
  selectedFeatures: string[];
  formData: ContactFormData;
  attachedFiles: AttachedFile[];
  onFormDataChange: (data: ContactFormData) => void;
  onFilesChange: (files: AttachedFile[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ContactStep({
  selectedPackage,
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
    company: z.string().optional(),
    projectDescription: z.string().min(10, lang === 'ar' ? 'وصف المشروع مطلوب (10 أحرف على الأقل)' : 'Project description is required (min 10 characters)'),
    budget: z.string().optional(),
    timeline: z.string().optional(),
    additionalRequirements: z.string().optional(),
  });

  const form = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formData
  });

  // Update form data when external formData changes
  useEffect(() => {
    form.reset(formData);
  }, [formData, form]);

  const onSubmit = (data: ContactFormData) => {
    onFormDataChange({ ...data, selectedPackage, selectedFeatures });
    onNext();
  };

  // File handling
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/'];

    const validFiles: AttachedFile[] = [];
    const currentFileCount = attachedFiles.length;

    for (let i = 0; i < Math.min(files.length, maxFiles - currentFileCount); i++) {
      const file = files[i];
      
      if (file.size > maxSize) {
        continue;
      }

      if (!allowedTypes.some(type => file.type.startsWith(type))) {
        continue;
      }

      validFiles.push({
        id: `${Date.now()}-${i}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type
      });
    }

    onFilesChange([...attachedFiles, ...validFiles]);
  };

  const removeFile = (fileId: string) => {
    onFilesChange(attachedFiles.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.includes('pdf')) return FileText;
    return File;
  };

  // Package info
  const packageNames: Record<string, { ar: string; en: string }> = {
    starter: { ar: 'باقة البداية', en: 'Starter Brand Kit' },
    business: { ar: 'الهوية التجارية', en: 'Business Identity' },
    premium: { ar: 'النظام المتقدم', en: 'Premium Brand System' },
    enterprise: { ar: 'النظام المؤسسي', en: 'Enterprise Brand Ecosystem' }
  };

  const budgetOptions = [
    { value: '1000-3000', label: lang === 'ar' ? '1,000 - 3,000 ر.س' : '$267 - $800' },
    { value: '3000-7000', label: lang === 'ar' ? '3,000 - 7,000 ر.س' : '$800 - $1,867' },
    { value: '7000-15000', label: lang === 'ar' ? '7,000 - 15,000 ر.س' : '$1,867 - $4,000' },
    { value: '15000+', label: lang === 'ar' ? '15,000+ ر.س' : '$4,000+' }
  ];

  const timelineOptions = [
    { value: '1-2-weeks', label: lang === 'ar' ? '1-2 أسبوع' : '1-2 weeks' },
    { value: '2-4-weeks', label: lang === 'ar' ? '2-4 أسابيع' : '2-4 weeks' },
    { value: '1-2-months', label: lang === 'ar' ? '1-2 شهر' : '1-2 months' },
    { value: 'flexible', label: lang === 'ar' ? 'مرن' : 'Flexible' }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <Badge 
          variant="secondary" 
          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 px-4 py-2 text-sm font-medium mb-4"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {lang === 'ar' ? 'الخطوة الثالثة' : 'Step 3'}
        </Badge>
        
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {lang === 'ar' ? 'تفاصيل المشروع والتواصل' : 'Project Details & Contact'}
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {lang === 'ar' ? 
            'أخبرنا المزيد عن مشروعك وكيفية التواصل معك لبدء العمل' :
            'Tell us more about your project and how to contact you to start working'
          }
        </p>
      </motion.div>

      {/* Selected Package Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-semibold">
                  {lang === 'ar' ? 'الباقة المختارة:' : 'Selected Package:'}
                </span>
                <span className="ml-2">
                  {lang === 'ar' ? packageNames[selectedPackage]?.ar : packageNames[selectedPackage]?.en}
                </span>
                {selectedFeatures.length > 0 && (
                  <span className="text-sm text-blue-700 dark:text-blue-300 ml-2">
                    + {selectedFeatures.length} {lang === 'ar' ? 'ميزة إضافية' : 'additional features'}
                  </span>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                {lang === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="customerName" className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    {lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                  </Label>
                  <Input
                    id="customerName"
                    placeholder={lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    {...form.register('customerName')}
                    onChange={(e) => onFormDataChange({ ...formData, customerName: e.target.value })}
                    data-testid="input-customer-name"
                  />
                  {form.formState.errors.customerName && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.customerName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="customerEmail" className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" />
                    {lang === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    placeholder={lang === 'ar' ? 'name@example.com' : 'name@example.com'}
                    {...form.register('customerEmail')}
                    onChange={(e) => onFormDataChange({ ...formData, customerEmail: e.target.value })}
                    data-testid="input-customer-email"
                  />
                  {form.formState.errors.customerEmail && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.customerEmail.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="customerPhone" className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4" />
                    {lang === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
                  </Label>
                  <Input
                    id="customerPhone"
                    placeholder={lang === 'ar' ? '+966 50 123 4567' : '+966 50 123 4567'}
                    {...form.register('customerPhone')}
                    onChange={(e) => onFormDataChange({ ...formData, customerPhone: e.target.value })}
                    data-testid="input-customer-phone"
                  />
                  {form.formState.errors.customerPhone && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.customerPhone.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="company" className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4" />
                    {lang === 'ar' ? 'اسم الشركة (اختياري)' : 'Company Name (Optional)'}
                  </Label>
                  <Input
                    id="company"
                    placeholder={lang === 'ar' ? 'أدخل اسم الشركة' : 'Enter company name'}
                    {...form.register('company')}
                    onChange={(e) => onFormDataChange({ ...formData, company: e.target.value })}
                    data-testid="input-company"
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Project Details */}
        <motion.div
          initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                {lang === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="projectDescription" className="mb-2 block">
                  {lang === 'ar' ? 'وصف المشروع *' : 'Project Description *'}
                </Label>
                <Textarea
                  id="projectDescription"
                  placeholder={lang === 'ar' ? 
                    'أخبرنا عن مشروعك، نوع العمل، الجمهور المستهدف، والرؤية المطلوبة للهوية البصرية...' :
                    'Tell us about your project, type of business, target audience, and desired vision for visual identity...'
                  }
                  rows={4}
                  {...form.register('projectDescription')}
                  onChange={(e) => onFormDataChange({ ...formData, projectDescription: e.target.value })}
                  data-testid="textarea-project-description"
                />
                {form.formState.errors.projectDescription && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.projectDescription.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4" />
                    {lang === 'ar' ? 'الميزانية المتوقعة' : 'Expected Budget'}
                  </Label>
                  <Select 
                    value={formData.budget} 
                    onValueChange={(value) => onFormDataChange({ ...formData, budget: value })}
                  >
                    <SelectTrigger data-testid="select-budget">
                      <SelectValue placeholder={lang === 'ar' ? 'اختر الميزانية' : 'Select budget'} />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" />
                    {lang === 'ar' ? 'الجدول الزمني المفضل' : 'Preferred Timeline'}
                  </Label>
                  <Select 
                    value={formData.timeline} 
                    onValueChange={(value) => onFormDataChange({ ...formData, timeline: value })}
                  >
                    <SelectTrigger data-testid="select-timeline">
                      <SelectValue placeholder={lang === 'ar' ? 'اختر الجدول الزمني' : 'Select timeline'} />
                    </SelectTrigger>
                    <SelectContent>
                      {timelineOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="additionalRequirements" className="mb-2 block">
                  {lang === 'ar' ? 'متطلبات إضافية' : 'Additional Requirements'}
                </Label>
                <Textarea
                  id="additionalRequirements"
                  placeholder={lang === 'ar' ? 
                    'أي متطلبات أو ملاحظات إضافية تود مشاركتها معنا...' :
                    'Any additional requirements or notes you would like to share with us...'
                  }
                  rows={3}
                  {...form.register('additionalRequirements')}
                  onChange={(e) => onFormDataChange({ ...formData, additionalRequirements: e.target.value })}
                  data-testid="textarea-additional-requirements"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* File Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              {lang === 'ar' ? 'رفع الملفات (اختياري)' : 'File Upload (Optional)'}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lang === 'ar' ? 
                'ارفع أي ملفات مرجعية أو مواد تساعدنا في فهم رؤيتك بشكل أفضل' :
                'Upload any reference files or materials that help us understand your vision better'
              }
            </p>
          </CardHeader>
          <CardContent>
            {/* Upload Area */}
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer",
                dragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-300 dark:border-gray-600",
                attachedFiles.length >= 5 && "opacity-50 cursor-not-allowed"
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (attachedFiles.length < 5) {
                  handleFileUpload(e.dataTransfer.files);
                }
              }}
              onClick={() => {
                if (attachedFiles.length < 5) {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = 'image/*,.pdf,.doc,.docx,.txt';
                  input.onchange = (e) => handleFileUpload((e.target as HTMLInputElement).files);
                  input.click();
                }
              }}
              data-testid="file-upload-area"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                {attachedFiles.length >= 5 ? (
                  lang === 'ar' ? 'تم الوصول للحد الأقصى من الملفات' : 'Maximum files reached'
                ) : (
                  lang === 'ar' ? 'اضغط أو اسحب الملفات هنا' : 'Click or drag files here'
                )}
              </p>
              <p className="text-xs text-gray-500">
                {lang === 'ar' ? 
                  'الحد الأقصى 5 ملفات، 10MB لكل ملف. الأنواع المدعومة: الصور، PDF، Word، النصوص' :
                  'Max 5 files, 10MB each. Supported: Images, PDF, Word, Text files'
                }
              </p>
            </div>

            {/* Uploaded Files */}
            {attachedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  {lang === 'ar' ? 'الملفات المرفقة:' : 'Attached Files:'}
                </p>
                <div className="space-y-2">
                  {attachedFiles.map((file) => {
                    const Icon = getFileIcon(file.type);
                    return (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
      </motion.div>

      {/* Navigation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex justify-between items-center pt-6"
      >
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="font-semibold px-6 py-3 rounded-xl"
          data-testid="button-back-features"
        >
          <ChevronLeft className={cn("w-5 h-5 mr-2", dir === 'rtl' && "ml-2 mr-0 rotate-180")} />
          {lang === 'ar' ? 'العودة للميزات' : 'Back to Features'}
        </Button>

        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={!form.formState.isValid}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          data-testid="button-next-review"
        >
          {lang === 'ar' ? 'التالي: مراجعة الطلب' : 'Next: Review Request'}
          <ArrowRight className={cn("w-5 h-5 ml-2", dir === 'rtl' && "mr-2 ml-0 rotate-180")} />
        </Button>
      </motion.div>
    </div>
  );
}