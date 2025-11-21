import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  MessageSquare,
  Sparkles,
  AlertCircle
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
  formData: ContactFormData;
  onFormDataChange: (data: ContactFormData) => void;
  attachedFiles: AttachedFile[];
  onFilesChange: (files: AttachedFile[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ContactStep({
  formData,
  onFormDataChange,
  attachedFiles,
  onFilesChange,
  onNext,
  onBack
}: ContactStepProps) {
  const { lang, dir } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = lang === 'ar' ? 'الاسم مطلوب' : 'Name is required';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = lang === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = lang === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email format';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = lang === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required';
    }

    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = lang === 'ar' ? 'وصف المشروع مطلوب' : 'Project description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 5;
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain'
    ];

    const newFiles: AttachedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file size
      if (file.size > maxFileSize) {
        alert(lang === 'ar' ? 
          `حجم الملف ${file.name} كبير جداً. الحد الأقصى 10 ميجابايت.` :
          `File ${file.name} is too large. Maximum size is 10MB.`
        );
        continue;
      }

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        alert(lang === 'ar' ? 
          `نوع الملف ${file.name} غير مدعوم.` :
          `File type of ${file.name} is not supported.`
        );
        continue;
      }

      // Check total files limit
      if (attachedFiles.length + newFiles.length >= maxFiles) {
        alert(lang === 'ar' ? 
          'يمكنك رفع 5 ملفات كحد أقصى.' :
          'You can upload maximum 5 files.'
        );
        break;
      }

      newFiles.push({
        id: Date.now().toString() + i,
        file,
        name: file.name,
        size: file.size,
        type: file.type
      });
    }

    onFilesChange([...attachedFiles, ...newFiles]);
    event.target.value = '';
  };

  const removeFile = (fileId: string) => {
    onFilesChange(attachedFiles.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <Badge variant="outline" className="text-sky-600 border-sky-200 bg-sky-50 dark:text-sky-400 dark:border-sky-800 dark:bg-sky-950/20 mb-4">
          <Sparkles className="w-4 h-4 mr-2" />
          {lang === 'ar' ? 'الخطوة الثالثة' : 'Step 3'}
        </Badge>
        
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {lang === 'ar' ? 'معلومات التواصل والمشروع' : 'Contact & Project Information'}
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {lang === 'ar' ? 
            'أدخل معلوماتك وتفاصيل مشروعك لنتمكن من تقديم أفضل خدمة' :
            'Enter your information and project details so we can provide the best service'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-sky-600" />
              {lang === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customerName" className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                {lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
              </Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder={lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                className={cn(errors.customerName && "border-red-500")}
                data-testid="input-customer-name"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.customerName}
                </p>
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
                value={formData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                placeholder={lang === 'ar' ? 'example@domain.com' : 'example@domain.com'}
                className={cn(errors.customerEmail && "border-red-500")}
                data-testid="input-customer-email"
              />
              {errors.customerEmail && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.customerEmail}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="customerPhone" className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4" />
                {lang === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
              </Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                placeholder={lang === 'ar' ? '+966 50 123 4567' : '+1 (555) 123-4567'}
                className={cn(errors.customerPhone && "border-red-500")}
                data-testid="input-customer-phone"
              />
              {errors.customerPhone && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.customerPhone}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="company" className="flex items-center gap-2 mb-2">
                <Building className="w-4 h-4" />
                {lang === 'ar' ? 'اسم الشركة (اختياري)' : 'Company Name (Optional)'}
              </Label>
              <Input
                id="company"
                value={formData.company || ''}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder={lang === 'ar' ? 'اسم شركتك' : 'Your company name'}
                data-testid="input-company"
              />
            </div>
          </CardContent>
        </Card>

        {/* Project Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-sky-600" />
              {lang === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="projectDescription" className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4" />
                {lang === 'ar' ? 'وصف المشروع *' : 'Project Description *'}
              </Label>
              <Textarea
                id="projectDescription"
                value={formData.projectDescription}
                onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                placeholder={lang === 'ar' ? 
                  'أخبرنا عن مشروعك وأهدافك التسويقية...' : 
                  'Tell us about your project and marketing goals...'
                }
                rows={4}
                className={cn(errors.projectDescription && "border-red-500")}
                data-testid="textarea-project-description"
              />
              {errors.projectDescription && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.projectDescription}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget" className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4" />
                  {lang === 'ar' ? 'الميزانية المتوقعة' : 'Expected Budget'}
                </Label>
                <Input
                  id="budget"
                  value={formData.budget || ''}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder={lang === 'ar' ? '5000 ر.س' : '$1,500'}
                  data-testid="input-budget"
                />
              </div>

              <div>
                <Label htmlFor="timeline" className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  {lang === 'ar' ? 'الإطار الزمني' : 'Timeline'}
                </Label>
                <Input
                  id="timeline"
                  value={formData.timeline || ''}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  placeholder={lang === 'ar' ? '30 يوم' : '30 days'}
                  data-testid="input-timeline"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="additionalRequirements" className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4" />
                {lang === 'ar' ? 'متطلبات إضافية' : 'Additional Requirements'}
              </Label>
              <Textarea
                id="additionalRequirements"
                value={formData.additionalRequirements || ''}
                onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                placeholder={lang === 'ar' ? 
                  'أي متطلبات أو ملاحظات إضافية...' : 
                  'Any additional requirements or notes...'
                }
                rows={3}
                data-testid="textarea-additional-requirements"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-sky-600" />
            {lang === 'ar' ? 'رفع ملفات (اختياري)' : 'File Upload (Optional)'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {lang === 'ar' ? 
                  'اسحب الملفات هنا أو اضغط للاختيار' :
                  'Drag files here or click to select'
                }
              </p>
              <input
                type="file"
                id="fileUpload"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="fileUpload"
                className="inline-flex items-center px-4 py-2 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-lg cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                {lang === 'ar' ? 'اختيار ملفات' : 'Choose Files'}
              </label>
            </div>

            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                {lang === 'ar' ? 
                  'يمكنك رفع حتى 5 ملفات (PDF, Word, صور) بحجم أقصى 10 ميجابايت لكل ملف' :
                  'You can upload up to 5 files (PDF, Word, Images) with maximum 10MB per file'
                }
              </AlertDescription>
            </Alert>

            {/* Uploaded Files */}
            {attachedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {lang === 'ar' ? 'الملفات المرفوعة:' : 'Uploaded Files:'}
                </h4>
                {attachedFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <FileText className="w-5 h-5 text-sky-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <Button
                      onClick={() => removeFile(file.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="px-8 py-3"
          data-testid="button-back-to-features"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          {lang === 'ar' ? 'العودة للميزات' : 'Back to Features'}
        </Button>
        
        <Button
          onClick={handleNext}
          size="lg"
          className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 group"
          data-testid="button-continue-to-summary"
        >
          {lang === 'ar' ? 'مراجعة الطلب' : 'Review Request'}
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </div>
    </motion.div>
  );
}