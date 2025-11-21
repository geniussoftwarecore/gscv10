import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PackageSelection } from "./PackageSelection";
import { FeatureSelection } from "./FeatureSelection";
import { ContactStep } from "./ContactStep";
import { SummaryStep } from "./SummaryStep";
import { 
  CheckCircle, 
  Sparkles, 
  ArrowLeft, 
  Calendar, 
  Mail,
  Phone
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

interface MarketingWizardProps {
  onClose: () => void;
}

export function MarketingWizard({ onClose }: MarketingWizardProps) {
  const { lang, dir } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState<ContactFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    company: '',
    selectedPackage: '',
    selectedFeatures: [],
    projectDescription: '',
    budget: '',
    timeline: '',
    additionalRequirements: ''
  });

  // Feature prices for calculation (in USD)
  const featurePrices: Record<string, number> = {
    social_media_premium: 320,
    seo_optimization: 240,
    content_creation: 213,
    paid_advertising: 400,
    email_marketing: 160,
    analytics_reporting: 187,
    influencer_marketing: 533,
    video_production: 480,
    brand_strategy: 267,
    competitor_analysis: 133
  };

  // Format price for display based on language
  const formatPrice = (usdPrice: number) => {
    if (lang === 'ar') {
      const sarPrice = Math.round(usdPrice * 3.75); // USD to SAR conversion
      return `${sarPrice} ر.س`;
    } else {
      return `$${usdPrice}`;
    }
  };

  // Submit mutation
  const submitRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      
      // Add form fields
      Object.entries(data.formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      // Add files
      data.files.forEach((fileData: AttachedFile) => {
        formData.append('files', fileData.file);
      });

      const response = await fetch('/api/service-requests', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: lang === 'ar' ? 'تم إرسال الطلب بنجاح' : 'Request Submitted Successfully',
        description: lang === 'ar' ? 
          'سنتواصل معك خلال 24 ساعة لمناقشة مشروعك' :
          'We will contact you within 24 hours to discuss your project',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/marketing-requests'] });
    },
    onError: (error: any) => {
      toast({
        title: lang === 'ar' ? 'خطأ في إرسال الطلب' : 'Error Submitting Request',
        description: error.message || (lang === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred'),
        variant: 'destructive',
      });
    },
  });

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const stepTitles = {
    1: lang === 'ar' ? 'اختيار الباقة' : 'Choose Package',
    2: lang === 'ar' ? 'الميزات الإضافية' : 'Additional Features',
    3: lang === 'ar' ? 'معلومات التواصل' : 'Contact Information',
    4: lang === 'ar' ? 'مراجعة الطلب' : 'Review Request'
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const requestData = {
      formData: {
        ...formData,
        selectedPackage: selectedPackage || '',
        selectedFeatures: selectedFeatures,
      },
      files: attachedFiles,
    };

    submitRequestMutation.mutate(requestData);
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {lang === 'ar' ? 'تم الإرسال بنجاح!' : 'Successfully Submitted!'}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {lang === 'ar' ? 
              'تم استلام طلبك وسنتواصل معك قريباً لمناقشة مشروعك' :
              'Your request has been received and we will contact you soon to discuss your project'
            }
          </p>
          
          <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تحقق من بريدك الإلكتروني' : 'Check your email'}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{lang === 'ar' ? 'أو انتظر مكالمتنا' : 'Or wait for our call'}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{lang === 'ar' ? 'خلال 24 ساعة' : 'Within 24 hours'}</span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {lang === 'ar' ? 'طلب خدمة تسويقية' : 'Marketing Service Request'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {stepTitles[currentStep as keyof typeof stepTitles]}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              data-testid="button-close-wizard"
            >
              ×
            </button>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{lang === 'ar' ? `الخطوة ${currentStep} من ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <PackageSelection
                selectedPackage={selectedPackage}
                onSelectPackage={setSelectedPackage}
                onNext={handleNext}
              />
            )}
            
            {currentStep === 2 && selectedPackage && (
              <FeatureSelection
                selectedPackage={selectedPackage}
                selectedFeatures={selectedFeatures}
                onFeaturesChange={setSelectedFeatures}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            
            {currentStep === 3 && (
              <ContactStep
                formData={formData}
                onFormDataChange={setFormData}
                attachedFiles={attachedFiles}
                onFilesChange={setAttachedFiles}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            
            {currentStep === 4 && (
              <SummaryStep
                formData={formData}
                selectedPackage={selectedPackage}
                selectedFeatures={selectedFeatures}
                attachedFiles={attachedFiles}
                featurePrices={featurePrices}
                onBack={handleBack}
                onSubmit={handleSubmit}
                isSubmitting={submitRequestMutation.isPending}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Loading State */}
        {submitRequestMutation.isPending && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-sky-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                {lang === 'ar' ? 'جاري إرسال الطلب...' : 'Submitting request...'}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}