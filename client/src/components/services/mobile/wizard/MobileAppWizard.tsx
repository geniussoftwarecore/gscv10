import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/lang";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { AppTypeSelection } from "./AppTypeSelection";
import { FeatureSelection } from "./FeatureSelection";
import { ContactFormStep } from "./ContactFormStep";
import { cn } from "@/lib/utils";

interface WizardState {
  currentStep: number;
  appType: string | null;
  selectedFeatures: string[];
  formData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerCompany?: string;
    appName?: string;
    appDescription?: string;
    additionalRequirements?: string;
    estimatedBudget?: string;
    preferredTimeline?: string;
  };
  attachedFiles: Array<{
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
  }>;
}

interface MobileAppWizardProps {
  className?: string;
}

export function MobileAppWizard({ className }: MobileAppWizardProps) {
  const { lang, dir } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 1,
    appType: null,
    selectedFeatures: [],
    formData: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerCompany: '',
      appName: '',
      appDescription: '',
      additionalRequirements: '',
      estimatedBudget: '',
      preferredTimeline: '',
    },
    attachedFiles: [],
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (wizardState.attachedFiles.length > 0) {
        // Use FormData for file uploads
        const formData = new FormData();
        
        // Add form fields
        Object.entries(wizardState.formData).forEach(([key, value]) => {
          if (value) formData.append(key, value);
        });
        
        formData.append('appType', wizardState.appType || '');
        formData.append('selectedFeatures', JSON.stringify(wizardState.selectedFeatures));
        
        // Add files
        wizardState.attachedFiles.forEach((fileObj, index) => {
          formData.append(`attachedFiles[${index}]`, fileObj.file, fileObj.name);
        });

        // Manual fetch for FormData
        const response = await fetch('/api/mobile-app-orders', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) {
          const text = (await response.text()) || response.statusText;
          throw new Error(`${response.status}: ${text}`);
        }

        return response;
      } else {
        // Use regular apiRequest for JSON data
        const data = {
          ...wizardState.formData,
          appType: wizardState.appType,
          selectedFeatures: wizardState.selectedFeatures,
          attachedFiles: []
        };

        return apiRequest('POST', '/api/mobile-app-orders', data);
      }
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: lang === 'ar' ? 'تم إرسال الطلب بنجاح!' : 'Request Submitted Successfully!',
        description: lang === 'ar' 
          ? 'سنتواصل معك خلال 24 ساعة لمناقشة تفاصيل مشروعك'
          : 'We will contact you within 24 hours to discuss your project details',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mobile-app-orders'] });
    },
    onError: (error: any) => {
      toast({
        title: lang === 'ar' ? 'خطأ في إرسال الطلب' : 'Error Submitting Request',
        description: error.message || (lang === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred'),
        variant: "destructive",
      });
    },
  });

  // Step handlers
  const handleAppTypeSelect = (appType: string) => {
    setWizardState(prev => ({ ...prev, appType }));
  };

  const handleFeaturesChange = (features: string[]) => {
    setWizardState(prev => ({ ...prev, selectedFeatures: features }));
  };

  const handleFormDataChange = (formData: WizardState['formData']) => {
    setWizardState(prev => ({ ...prev, formData }));
  };

  const handleFilesChange = (files: WizardState['attachedFiles']) => {
    setWizardState(prev => ({ ...prev, attachedFiles: files }));
  };

  const goToNextStep = () => {
    setWizardState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const goToPreviousStep = () => {
    setWizardState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
  };

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  // Get step title
  const getStepTitle = (step: number) => {
    const titles = {
      1: lang === 'ar' ? 'نوع التطبيق' : 'App Type',
      2: lang === 'ar' ? 'الميزات' : 'Features',
      3: lang === 'ar' ? 'التفاصيل' : 'Details'
    };
    return titles[step as keyof typeof titles] || '';
  };

  // Success state
  if (isSubmitted) {
    return (
      <motion.div
        className={cn("max-w-4xl mx-auto", className)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="text-center p-8">
          <CardContent className="space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {lang === 'ar' ? 'تم إرسال طلبك بنجاح!' : 'Your Request Has Been Submitted!'}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {lang === 'ar' 
                  ? 'شكراً لك على ثقتك بنا. سيتواصل معك فريقنا خلال 24 ساعة لمناقشة تفاصيل مشروعك ووضع خطة العمل.'
                  : 'Thank you for your trust. Our team will contact you within 24 hours to discuss your project details and create a work plan.'
                }
              </p>
            </div>

            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20 text-left">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">
                    {lang === 'ar' ? 'الخطوات التالية:' : 'Next Steps:'}
                  </p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      {lang === 'ar' ? 'مراجعة متطلبات مشروعك' : 'Review your project requirements'}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      {lang === 'ar' ? 'إعداد عرض سعر مفصل' : 'Prepare a detailed quote'}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      {lang === 'ar' ? 'التواصل معك لمناقشة التفاصيل' : 'Contact you to discuss details'}
                    </li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            <div className="pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {lang === 'ar' ? 'رقم الطلب: ' : 'Request ID: '}
                <span className="font-mono font-medium">
                  {Date.now().toString(36).toUpperCase()}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className={cn("max-w-6xl mx-auto space-y-8", className)}>
      {/* Step Progress Indicator */}
      <Card className="p-6">
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  step < wizardState.currentStep ? "bg-green-500 text-white" :
                  step === wizardState.currentStep ? "bg-primary text-white" :
                  "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                )}>
                  {step < wizardState.currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                <div className="text-center">
                  <div className={cn(
                    "text-sm font-medium",
                    step <= wizardState.currentStep ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {getStepTitle(step)}
                  </div>
                </div>
              </div>
              
              {step < 3 && (
                <div className={cn(
                  "w-8 h-0.5 transition-colors",
                  step < wizardState.currentStep ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                )} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step Content */}
      <Card className="p-8">
        <AnimatePresence mode="wait">
          {wizardState.currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
              transition={{ duration: 0.3 }}
            >
              <AppTypeSelection
                selectedType={wizardState.appType}
                onSelectType={handleAppTypeSelect}
                onNext={goToNextStep}
              />
            </motion.div>
          )}

          {wizardState.currentStep === 2 && wizardState.appType && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
              transition={{ duration: 0.3 }}
            >
              <FeatureSelection
                appType={wizardState.appType}
                selectedFeatures={wizardState.selectedFeatures}
                onFeaturesChange={handleFeaturesChange}
                onNext={goToNextStep}
                onBack={goToPreviousStep}
              />
            </motion.div>
          )}

          {wizardState.currentStep === 3 && wizardState.appType && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
              transition={{ duration: 0.3 }}
            >
              <ContactFormStep
                appType={wizardState.appType}
                selectedFeatures={wizardState.selectedFeatures}
                formData={wizardState.formData}
                attachedFiles={wizardState.attachedFiles}
                onFormDataChange={handleFormDataChange}
                onFilesChange={handleFilesChange}
                onSubmit={handleSubmit}
                onBack={goToPreviousStep}
                isSubmitting={submitMutation.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Error Alert */}
      {submitMutation.isError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              {lang === 'ar' 
                ? 'حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.'
                : 'An error occurred while submitting your request. Please try again.'
              }
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}