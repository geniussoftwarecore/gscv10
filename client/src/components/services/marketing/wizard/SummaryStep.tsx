import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  User,
  Mail,
  Phone,
  Building,
  MessageSquare,
  DollarSign,
  Calendar,
  FileText,
  Package,
  Star,
  ChevronLeft,
  Send,
  CheckCircle,
  Sparkles,
  Megaphone,
  ArrowRight
} from "lucide-react";

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
  formData: ContactFormData;
  selectedPackage: string | null;
  selectedFeatures: string[];
  attachedFiles: AttachedFile[];
  featurePrices: Record<string, number>;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function SummaryStep({
  formData,
  selectedPackage,
  selectedFeatures,
  attachedFiles,
  featurePrices,
  onBack,
  onSubmit,
  isSubmitting
}: SummaryStepProps) {
  const { lang, dir } = useLanguage();

  // Format price for display based on language
  const formatPrice = (usdPrice: number) => {
    if (lang === 'ar') {
      const sarPrice = Math.round(usdPrice * 3.75); // USD to SAR conversion
      return `${sarPrice} ر.س`;
    } else {
      return `$${usdPrice}`;
    }
  };

  // Package details
  const packages = {
    starter: {
      name: lang === 'ar' ? 'باقة البداية' : 'Starter Marketing',
      price: lang === 'ar' ? '2,500 ر.س' : '$667',
      features: lang === 'ar' ? [
        'إعداد وإدارة منصة واحدة',
        'إنشاء 12 منشور شهرياً',
        'تصميم 3 إعلانات',
        'تقرير أداء شهري'
      ] : [
        'Setup & manage 1 platform',
        'Create 12 posts monthly',
        'Design 3 ad campaigns',
        'Monthly performance report'
      ]
    },
    business: {
      name: lang === 'ar' ? 'باقة الأعمال' : 'Business Growth',
      price: lang === 'ar' ? '4,500 ر.س' : '$1,200',
      features: lang === 'ar' ? [
        'إدارة 3 منصات اجتماعية',
        'إنشاء 20 منشور شهرياً',
        'تصميم 5 حملات إعلانية',
        'تحليلات وتقارير مفصلة'
      ] : [
        'Manage 3 social platforms',
        'Create 20 posts monthly',
        'Design 5 ad campaigns',
        'Detailed analytics & reports'
      ]
    },
    premium: {
      name: lang === 'ar' ? 'الباقة المتقدمة' : 'Premium Enterprise',
      price: lang === 'ar' ? '8,500 ر.س' : '$2,267',
      features: lang === 'ar' ? [
        'إدارة 5+ منصات',
        'إنشاء 40 منشور شهرياً',
        'حملات إعلانية غير محدودة',
        'تحليلات وذكاء أعمال متقدم'
      ] : [
        'Manage 5+ platforms',
        'Create 40 posts monthly',
        'Unlimited ad campaigns',
        'Advanced analytics & BI'
      ]
    }
  };

  // Feature details
  const featureDetails = {
    social_media_premium: { name: lang === 'ar' ? 'إدارة متقدمة لوسائل التواصل' : 'Advanced Social Media Management' },
    seo_optimization: { name: lang === 'ar' ? 'تحسين محركات البحث المتقدم' : 'Advanced SEO Optimization' },
    content_creation: { name: lang === 'ar' ? 'إنشاء محتوى إبداعي' : 'Creative Content Creation' },
    paid_advertising: { name: lang === 'ar' ? 'إدارة الإعلانات المدفوعة' : 'Paid Advertising Management' },
    email_marketing: { name: lang === 'ar' ? 'التسويق عبر البريد الإلكتروني' : 'Email Marketing Campaigns' },
    analytics_reporting: { name: lang === 'ar' ? 'تحليلات وتقارير متقدمة' : 'Advanced Analytics & Reporting' },
    influencer_marketing: { name: lang === 'ar' ? 'تسويق المؤثرين' : 'Influencer Marketing' },
    video_production: { name: lang === 'ar' ? 'إنتاج الفيديوهات التسويقية' : 'Marketing Video Production' },
    brand_strategy: { name: lang === 'ar' ? 'استراتيجية العلامة التجارية' : 'Brand Strategy Development' },
    competitor_analysis: { name: lang === 'ar' ? 'تحليل المنافسين' : 'Competitor Analysis' }
  };

  const selectedPackageInfo = selectedPackage ? packages[selectedPackage as keyof typeof packages] : null;
  
  const additionalFeaturesTotal = selectedFeatures.reduce((total, featureId) => {
    return total + (featurePrices[featureId] || 0);
  }, 0);

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
      </div>

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
                <User className="w-5 h-5 text-sky-600" />
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
                <Package className="w-5 h-5 text-sky-600" />
                {lang === 'ar' ? 'الباقة والميزات' : 'Package & Features'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected Package */}
              {selectedPackageInfo && (
                <div className="p-4 bg-sky-50 dark:bg-sky-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Megaphone className="w-4 h-4 text-sky-600" />
                    <span className="font-semibold text-sky-700 dark:text-sky-400">
                      {selectedPackageInfo.name}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-sky-600" data-testid="text-package-price">
                    {selectedPackageInfo.price}
                  </p>
                </div>
              )}

              {/* Additional Features */}
              {selectedFeatures.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {lang === 'ar' ? 'الميزات الإضافية:' : 'Additional Features:'}
                  </h4>
                  <div className="space-y-2">
                    {selectedFeatures.map((featureId) => (
                      <div key={featureId} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">
                          {featureDetails[featureId as keyof typeof featureDetails]?.name || featureId}
                        </span>
                        <span className="font-medium text-sky-600">
                          {formatPrice(featurePrices[featureId])}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {additionalFeaturesTotal > 0 && (
                    <>
                      <Separator className="my-3" />
                      <div className="flex items-center justify-between font-semibold">
                        <span>{lang === 'ar' ? 'إجمالي الميزات الإضافية:' : 'Additional Features Total:'}</span>
                        <span className="text-sky-600" data-testid="text-features-total">
                          {formatPrice(additionalFeaturesTotal)}
                        </span>
                      </div>
                    </>
                  )}
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
                <MessageSquare className="w-5 h-5 text-sky-600" />
                {lang === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">{lang === 'ar' ? 'وصف المشروع' : 'Project Description'}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300" data-testid="text-project-description">
                  {formData.projectDescription}
                </p>
              </div>
              
              {formData.budget && (
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">{lang === 'ar' ? 'الميزانية' : 'Budget'}</p>
                    <p className="font-medium" data-testid="text-budget">{formData.budget}</p>
                  </div>
                </div>
              )}
              
              {formData.timeline && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">{lang === 'ar' ? 'الإطار الزمني' : 'Timeline'}</p>
                    <p className="font-medium" data-testid="text-timeline">{formData.timeline}</p>
                  </div>
                </div>
              )}
              
              {formData.additionalRequirements && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">{lang === 'ar' ? 'متطلبات إضافية' : 'Additional Requirements'}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300" data-testid="text-additional-requirements">
                    {formData.additionalRequirements}
                  </p>
                </div>
              )}
              
              {/* Attached Files */}
              {attachedFiles.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">{lang === 'ar' ? 'الملفات المرفقة:' : 'Attached Files:'}</p>
                  <div className="space-y-1">
                    {attachedFiles.map((file) => (
                      <div key={file.id} className="flex items-center gap-2 text-sm">
                        <FileText className="w-3 h-3 text-sky-600" />
                        <span className="text-gray-700 dark:text-gray-300 truncate">
                          {file.name} ({formatFileSize(file.size)})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center"
      >
        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
        <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
          {lang === 'ar' ? 'جاهز للإرسال!' : 'Ready to Submit!'}
        </h3>
        <p className="text-green-700 dark:text-green-400 text-sm">
          {lang === 'ar' ? 
            'سنراجع طلبك ونتواصل معك خلال 24 ساعة لبدء العمل على مشروعك' :
            'We will review your request and contact you within 24 hours to start working on your project'
          }
        </p>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="px-8 py-3"
          disabled={isSubmitting}
          data-testid="button-back-to-contact"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          {lang === 'ar' ? 'العودة للتعديل' : 'Back to Edit'}
        </Button>
        
        <Button
          onClick={onSubmit}
          size="lg"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 group disabled:opacity-50"
          data-testid="button-submit-request"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              {lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              {lang === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}