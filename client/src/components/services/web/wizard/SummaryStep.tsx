import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle,
  ChevronLeft,
  Send,
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  Settings,
  Clock,
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

interface SummaryStepProps {
  siteType: string;
  selectedFeatures: string[];
  formData: ContactFormData;
  attachedFiles: AttachedFile[];
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function SummaryStep({
  siteType,
  selectedFeatures,
  formData,
  attachedFiles,
  onSubmit,
  onBack,
  isSubmitting
}: SummaryStepProps) {
  const { lang, dir } = useLanguage();

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

  // Get feature display names
  const getFeatureDisplayName = (featureId: string) => {
    const featureNames: Record<string, { ar: string; en: string }> = {
      basics: { ar: 'الصفحات الأساسية', en: 'Basic Pages' },
      performance: { ar: 'تحسين الأداء', en: 'Performance Optimization' },
      seo_analytics: { ar: 'SEO والتحليلات', en: 'SEO & Analytics' },
      security: { ar: 'الأمان المتقدم', en: 'Advanced Security' },
      cms_admin: { ar: 'نظام إدارة المحتوى', en: 'CMS & Admin Panel' },
      ecommerce: { ar: 'ميزات التجارة الإلكترونية', en: 'E-commerce Features' },
      integrations: { ar: 'التكاملات الخارجية', en: 'External Integrations' },
      scalability: { ar: 'القابلية للتوسع', en: 'Scalability & DevOps' },
      ai_smart: { ar: 'الذكاء الاصطناعي والميزات الذكية', en: 'AI & Smart Features' },
      blog_features: { ar: 'ميزات المدونة والمجلة', en: 'Blog & Magazine Features' },
      learning_features: { ar: 'ميزات التعلم الإلكتروني', en: 'E-learning Features' },
      booking_features: { ar: 'ميزات الحجز والمواعيد', en: 'Booking & Appointment Features' }
    };
    return lang === 'ar' ? featureNames[featureId]?.ar || featureId : featureNames[featureId]?.en || featureId;
  };

  // Get language display name
  const getLanguageDisplayName = (languageId: string) => {
    const languageNames: Record<string, { ar: string; en: string }> = {
      ar: { ar: 'العربية', en: 'Arabic' },
      en: { ar: 'الإنجليزية', en: 'English' },
      fr: { ar: 'الفرنسية', en: 'French' },
      de: { ar: 'الألمانية', en: 'German' },
      es: { ar: 'الإسبانية', en: 'Spanish' }
    };
    return lang === 'ar' ? languageNames[languageId]?.ar || languageId : languageNames[languageId]?.en || languageId;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          {lang === 'ar' ? 'مراجعة الملخص وإرسال الطلب' : 'Review Summary & Submit Request'}
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {lang === 'ar' ? 'راجع طلبك قبل الإرسال. سنعود إليك خلال 24-72 ساعة.' : 'Review your request before submitting. We\'ll get back to you within 24-72 hours.'}
        </motion.p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-6">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card data-testid="summary-card-contact">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {lang === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {lang === 'ar' ? 'الاسم:' : 'Name:'}
                  </span>
                  <span className="font-medium">{formData.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {lang === 'ar' ? 'البريد:' : 'Email:'}
                  </span>
                  <span className="font-medium">{formData.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {lang === 'ar' ? 'الهاتف:' : 'Phone:'}
                  </span>
                  <span className="font-medium">{formData.customerPhone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Site Type and Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card data-testid="summary-card-project">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {lang === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {lang === 'ar' ? 'نوع الموقع:' : 'Site Type:'}
                </span>
                <Badge variant="default" className="ml-2">
                  {getSiteTypeName()}
                </Badge>
              </div>

              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                  {lang === 'ar' ? 'الميزات المختارة:' : 'Selected Features:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedFeatures.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {getFeatureDisplayName(feature)}
                    </Badge>
                  ))}
                </div>
              </div>

              {formData.contentScope && (
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {lang === 'ar' ? 'نطاق المحتوى:' : 'Content Scope:'}
                  </span>
                  <p className="text-sm mt-1">{formData.contentScope}</p>
                </div>
              )}

              {formData.domainHosting && (
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {lang === 'ar' ? 'الدومين والاستضافة:' : 'Domain & Hosting:'}
                  </span>
                  <p className="text-sm mt-1">{formData.domainHosting}</p>
                </div>
              )}

              {formData.languages && formData.languages.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                    {lang === 'ar' ? 'اللغات:' : 'Languages:'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {formData.languages.map((language) => (
                      <Badge key={language} variant="outline" className="text-xs">
                        {getLanguageDisplayName(language)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {formData.integrations && formData.integrations.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                    {lang === 'ar' ? 'التكاملات:' : 'Integrations:'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {formData.integrations.map((integration) => (
                      <Badge key={integration} variant="outline" className="text-xs">
                        {integration}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {formData.notes && (
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {lang === 'ar' ? 'ملاحظات إضافية:' : 'Additional Notes:'}
                  </span>
                  <p className="text-sm mt-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    {formData.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Attached Files */}
        {attachedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {lang === 'ar' ? 'الملفات المرفقة' : 'Attached Files'}
                  <Badge variant="secondary">{attachedFiles.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {attachedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded"
                    >
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Important Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">
                {lang === 'ar' ? 'الخطوات التالية:' : 'Next Steps:'}
              </p>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  {lang === 'ar' ? 'مراجعة متطلبات مشروعك' : 'Review your project requirements'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  {lang === 'ar' ? 'إعداد عرض سعر مفصل' : 'Prepare detailed quotation'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  {lang === 'ar' ? 'التواصل معك خلال 24-72 ساعة' : 'Contact you within 24-72 hours'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  {lang === 'ar' ? 'مناقشة التفاصيل ووضع خطة العمل' : 'Discuss details and create work plan'}
                </li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div 
        className="flex justify-between pt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          disabled={isSubmitting}
          className={cn(
            "px-8 py-3 text-lg font-medium",
            dir === 'rtl' ? 'flex-row-reverse' : ''
          )}
          data-testid="back-btn"
        >
          <ChevronLeft className={cn("w-5 h-5", dir === 'rtl' ? 'rotate-180 ml-2' : 'mr-2')} />
          {lang === 'ar' ? 'العودة للتعديل' : 'Back to Edit'}
        </Button>
        
        <Button
          onClick={onSubmit}
          size="lg"
          disabled={isSubmitting}
          className={cn(
            "px-8 py-3 text-lg font-medium",
            dir === 'rtl' ? 'flex-row-reverse' : '',
            isSubmitting && "opacity-75 cursor-not-allowed"
          )}
          data-testid="submit-btn"
        >
          {isSubmitting ? (
            <>
              <Settings className={cn("w-5 h-5 animate-spin", dir === 'rtl' ? 'mr-2' : 'ml-2')} />
              {lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
            </>
          ) : (
            <>
              {lang === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
              <Send className={cn("w-5 h-5", dir === 'rtl' ? 'rotate-180 mr-2' : 'ml-2')} />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}