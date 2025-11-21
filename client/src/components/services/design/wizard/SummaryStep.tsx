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
  Building,
  FileText,
  Palette,
  Star,
  DollarSign,
  Clock,
  AlertCircle,
  Sparkles,
  Package,
  Zap
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

interface SummaryStepProps {
  selectedPackage: string;
  selectedFeatures: string[];
  formData: ContactFormData;
  attachedFiles: AttachedFile[];
  estimatedCost: number;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function SummaryStep({
  selectedPackage,
  selectedFeatures,
  formData,
  attachedFiles,
  estimatedCost,
  onSubmit,
  onBack,
  isSubmitting
}: SummaryStepProps) {
  const { lang, dir } = useLanguage();

  // Package information
  const packageInfo = {
    starter: {
      name: lang === 'ar' ? 'باقة البداية' : 'Starter Brand Kit',
      price: lang === 'ar' ? 1500 : 400,
      duration: lang === 'ar' ? '7-10 أيام' : '7-10 Days'
    },
    business: {
      name: lang === 'ar' ? 'الهوية التجارية' : 'Business Identity',
      price: lang === 'ar' ? 3500 : 933,
      duration: lang === 'ar' ? '10-12 يوم' : '10-12 Days'
    },
    premium: {
      name: lang === 'ar' ? 'النظام المتقدم' : 'Premium Brand System',
      price: lang === 'ar' ? 6500 : 1733,
      duration: lang === 'ar' ? '12-15 يوم' : '12-15 Days'
    },
    enterprise: {
      name: lang === 'ar' ? 'النظام المؤسسي' : 'Enterprise Brand Ecosystem',
      price: lang === 'ar' ? 12000 : 3200,
      duration: lang === 'ar' ? '15-20 يوم' : '15-20 Days'
    }
  };

  const currentPackage = packageInfo[selectedPackage as keyof typeof packageInfo];

  // Feature names mapping
  const featureNames: Record<string, { ar: string; en: string }> = {
    animated_logo: { ar: 'الشعار المتحرك', en: 'Animated Logo' },
    logo_variations: { ar: 'تنويعات إضافية للشعار', en: 'Additional Logo Variations' },
    extended_brand_guide: { ar: 'دليل هوية موسع', en: 'Extended Brand Guide' },
    packaging_design: { ar: 'تصميم التغليف', en: 'Packaging Design' },
    mobile_app_kit: { ar: 'طقم تطبيق المحمول', en: 'Mobile App Kit' },
    web_elements: { ar: 'عناصر الموقع الإلكتروني', en: 'Website Elements' },
    brand_photography: { ar: 'استشارة التصوير التجاري', en: 'Brand Photography Consultation' },
    brand_strategy: { ar: 'استراتيجية العلامة التجارية', en: 'Brand Strategy' },
    team_training: { ar: 'تدريب الفريق', en: 'Team Training' }
  };

  const getFeatureDisplayName = (featureId: string) => {
    return lang === 'ar' ? featureNames[featureId]?.ar || featureId : featureNames[featureId]?.en || featureId;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
          {lang === 'ar' ? 'الخطوة الأخيرة' : 'Final Step'}
        </Badge>
        
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {lang === 'ar' ? 'مراجعة طلبك' : 'Review Your Request'}
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {lang === 'ar' ? 
            'تأكد من صحة جميع المعلومات قبل إرسال طلبك. سنتواصل معك خلال 24 ساعة' :
            'Make sure all information is correct before submitting your request. We will contact you within 24 hours'
          }
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-blue-600" />
                {lang === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">{lang === 'ar' ? 'الاسم' : 'Name'}</p>
                  <p className="font-medium" data-testid="text-customer-name">{formData.customerName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                  <p className="font-medium" data-testid="text-customer-email">{formData.customerEmail}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">{lang === 'ar' ? 'الهاتف' : 'Phone'}</p>
                  <p className="font-medium" data-testid="text-customer-phone">{formData.customerPhone}</p>
                </div>
              </div>
              
              {formData.company && (
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">{lang === 'ar' ? 'الشركة' : 'Company'}</p>
                    <p className="font-medium" data-testid="text-company">{formData.company}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Package & Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="w-5 h-5 text-blue-600" />
                {lang === 'ar' ? 'الباقة والميزات' : 'Package & Features'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Palette className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-gray-900 dark:text-white" data-testid="text-selected-package">
                    {currentPackage?.name}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">
                      {lang === 'ar' ? `${currentPackage?.price} ر.س` : `$${currentPackage?.price}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {currentPackage?.duration}
                    </span>
                  </div>
                </div>
              </div>

              {selectedFeatures.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {lang === 'ar' ? 'الميزات الإضافية:' : 'Additional Features:'}
                  </h5>
                  <div className="space-y-1">
                    {selectedFeatures.map((featureId, index) => (
                      <div key={featureId} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2" data-testid={`text-feature-${index}`}>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        {getFeatureDisplayName(featureId)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Project Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-blue-600" />
                {lang === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">{lang === 'ar' ? 'وصف المشروع' : 'Project Description'}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed" data-testid="text-project-description">
                  {formData.projectDescription}
                </p>
              </div>

              {formData.budget && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">{lang === 'ar' ? 'الميزانية' : 'Budget'}</p>
                  <p className="text-sm font-medium" data-testid="text-budget">{formData.budget}</p>
                </div>
              )}

              {formData.timeline && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">{lang === 'ar' ? 'الجدول الزمني' : 'Timeline'}</p>
                  <p className="text-sm font-medium" data-testid="text-timeline">{formData.timeline}</p>
                </div>
              )}

              {formData.additionalRequirements && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">{lang === 'ar' ? 'متطلبات إضافية' : 'Additional Requirements'}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed" data-testid="text-additional-requirements">
                    {formData.additionalRequirements}
                  </p>
                </div>
              )}

              {attachedFiles.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">{lang === 'ar' ? 'الملفات المرفقة' : 'Attached Files'}</p>
                  <div className="space-y-1">
                    {attachedFiles.map((file, index) => (
                      <div key={file.id} className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between" data-testid={`text-file-${index}`}>
                        <span className="truncate">{file.name}</span>
                        <span className="ml-2 text-gray-500">{formatFileSize(file.size)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Total Cost Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
          <DollarSign className="h-5 w-5 text-green-600" />
          <AlertDescription>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-green-800 dark:text-green-200 text-lg">
                  {lang === 'ar' ? 'إجمالي التكلفة المقدرة' : 'Total Estimated Cost'}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {lang === 'ar' ? 'شامل جميع الميزات المختارة' : 'Including all selected features'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400" data-testid="text-total-cost">
                  {lang === 'ar' ? `${estimatedCost} ر.س` : `$${estimatedCost}`}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {lang === 'ar' ? 'السعر النهائي بعد المراجعة' : 'Final price after review'}
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Final Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <p className="font-semibold mb-1">
              {lang === 'ar' ? 'ما الذي سيحدث بعد الإرسال؟' : 'What happens after submission?'}
            </p>
            <ul className="space-y-1 text-xs">
              <li>• {lang === 'ar' ? 'سنراجع طلبك خلال 24 ساعة' : 'We will review your request within 24 hours'}</li>
              <li>• {lang === 'ar' ? 'سنتواصل معك لمناقشة التفاصيل' : 'We will contact you to discuss details'}</li>
              <li>• {lang === 'ar' ? 'سنرسل لك عرض سعر نهائي' : 'We will send you a final quote'}</li>
              <li>• {lang === 'ar' ? 'بعد الموافقة نبدأ العمل فوراً' : 'After approval, we start work immediately'}</li>
            </ul>
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Navigation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex justify-between items-center pt-6"
      >
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="font-semibold px-6 py-3 rounded-xl"
          disabled={isSubmitting}
          data-testid="button-back-details"
        >
          <ChevronLeft className={cn("w-5 h-5 mr-2", dir === 'rtl' && "ml-2 mr-0 rotate-180")} />
          {lang === 'ar' ? 'العودة للتفاصيل' : 'Back to Details'}
        </Button>

        <Button
          onClick={onSubmit}
          size="lg"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          data-testid="button-submit-request"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
            </>
          ) : (
            <>
              <Send className={cn("w-5 h-5 mr-2", dir === 'rtl' && "ml-2 mr-0 rotate-180")} />
              {lang === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}