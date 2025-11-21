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
import { TypeStep } from "./TypeStep";
import { FeaturesStep } from "./FeaturesStep";
import { ContactStep } from "./ContactStep";
import { SummaryStep } from "./SummaryStep";
import { cn } from "@/lib/utils";

interface WizardState {
  currentStep: number;
  siteType: string | null;
  selectedFeatures: string[];
  formData: {
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
  };
  attachedFiles: Array<{
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
  }>;
}

interface WebWizardProps {
  className?: string;
}

export function WebWizard({ className }: WebWizardProps) {
  const { lang, dir } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 1,
    siteType: null,
    selectedFeatures: [],
    formData: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      siteType: '',
      selectedFeatures: [],
      contentScope: '',
      domainHosting: '',
      languages: ['ar'],
      integrations: [],
      notes: '',
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
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value.toString());
            }
          }
        });
        
        formData.append('siteType', wizardState.siteType || '');
        formData.append('selectedFeatures', JSON.stringify(wizardState.selectedFeatures));
        
        // Add files
        wizardState.attachedFiles.forEach((attachedFile) => {
          formData.append('attachments', attachedFile.file);
        });

        const response = await fetch('/api/web-orders', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to submit request');
        }

        return response.json();
      } else {
        // Use JSON for requests without files
        const response = await fetch('/api/web-orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...wizardState.formData,
            siteType: wizardState.siteType,
            selectedFeatures: wizardState.selectedFeatures,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to submit request');
        }

        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: lang === 'ar' ? 'تم إرسال الطلب بنجاح' : 'Request submitted successfully',
        description: lang === 'ar' 
          ? 'سيتواصل معك فريقنا خلال 24-72 ساعة'
          : 'Our team will contact you within 24-72 hours',
      });
      setIsSubmitted(true);
      // Invalidate any related queries
      queryClient.invalidateQueries({ queryKey: ['/api/web-orders'] });
    },
    onError: (error: any) => {
      toast({
        title: lang === 'ar' ? 'خطأ في إرسال الطلب' : 'Error submitting request',
        description: error.message || (lang === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred'),
        variant: 'destructive',
      });
    },
  });

  // Step navigation handlers
  const handleNextStep = () => {
    if (wizardState.currentStep < 4) {
      setWizardState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const handlePrevStep = () => {
    if (wizardState.currentStep > 1) {
      setWizardState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const handleSiteTypeSelect = (siteType: string) => {
    setWizardState(prev => ({
      ...prev,
      siteType,
      formData: { ...prev.formData, siteType }
    }));
  };

  const handleFeaturesChange = (features: string[]) => {
    setWizardState(prev => ({
      ...prev,
      selectedFeatures: features,
      formData: { ...prev.formData, selectedFeatures: features }
    }));
  };

  const handleFormDataChange = (data: WizardState['formData']) => {
    setWizardState(prev => ({ ...prev, formData: data }));
  };

  const handleFilesChange = (files: WizardState['attachedFiles']) => {
    setWizardState(prev => ({ ...prev, attachedFiles: files }));
  };

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  // Step titles for progress indicator
  const getStepTitle = (step: number) => {
    const titles = {
      1: lang === 'ar' ? 'النوع' : 'Type',
      2: lang === 'ar' ? 'الميزات' : 'Features', 
      3: lang === 'ar' ? 'التفاصيل' : 'Details',
      4: lang === 'ar' ? 'المراجعة' : 'Review'
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
                  ? 'شكراً لك على ثقتك بنا. سيتواصل معك فريقنا خلال 24-72 ساعة لمناقشة تفاصيل مشروعك ووضع خطة العمل.'
                  : 'Thank you for your trust. Our team will contact you within 24-72 hours to discuss your project details and create a work plan.'
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
                      {lang === 'ar' ? 'إعداد عرض سعر مفصل' : 'Prepare detailed quotation'}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      {lang === 'ar' ? 'التواصل معك لمناقشة التفاصيل' : 'Contact you to discuss details'}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      {lang === 'ar' ? 'بدء تنفيذ المشروع' : 'Begin project implementation'}
                    </li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className={cn("max-w-6xl mx-auto", className)}>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4 space-x-reverse">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step === wizardState.currentStep
                  ? "bg-primary text-primary-foreground"
                  : step < wizardState.currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              )}>
                {step < wizardState.currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step
                )}
              </div>
              {step < 4 && (
                <div className={cn(
                  "w-12 h-1 mx-2",
                  step < wizardState.currentStep ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                )} />
              )}
              <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                {getStepTitle(step)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={wizardState.currentStep}
          initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
          transition={{ duration: 0.3 }}
        >
          {wizardState.currentStep === 1 && (
            <TypeStep
              selectedType={wizardState.siteType}
              onSelectType={handleSiteTypeSelect}
              onNext={handleNextStep}
            />
          )}

          {wizardState.currentStep === 2 && (
            <FeaturesStep
              siteType={wizardState.siteType || ''}
              selectedFeatures={wizardState.selectedFeatures}
              onFeaturesChange={handleFeaturesChange}
              onNext={handleNextStep}
              onBack={handlePrevStep}
            />
          )}

          {wizardState.currentStep === 3 && (
            <ContactStep
              siteType={wizardState.siteType || ''}
              selectedFeatures={wizardState.selectedFeatures}
              formData={wizardState.formData}
              attachedFiles={wizardState.attachedFiles}
              onFormDataChange={handleFormDataChange}
              onFilesChange={handleFilesChange}
              onNext={handleNextStep}
              onBack={handlePrevStep}
            />
          )}

          {wizardState.currentStep === 4 && (
            <SummaryStep
              siteType={wizardState.siteType || ''}
              selectedFeatures={wizardState.selectedFeatures}
              formData={wizardState.formData}
              attachedFiles={wizardState.attachedFiles}
              onSubmit={handleSubmit}
              onBack={handlePrevStep}
              isSubmitting={submitMutation.isPending}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Error Display */}
      {submitMutation.isError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {submitMutation.error?.message || (lang === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred')}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}