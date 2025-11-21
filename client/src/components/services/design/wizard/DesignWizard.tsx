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

interface DesignWizardProps {
  onClose: () => void;
}

export function DesignWizard({ onClose }: DesignWizardProps) {
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

  // Feature prices for calculation
  const featurePrices: Record<string, number> = {
    animated_logo: lang === 'ar' ? 800 : 213,
    logo_variations: lang === 'ar' ? 400 : 107,
    extended_brand_guide: lang === 'ar' ? 600 : 160,
    packaging_design: lang === 'ar' ? 1200 : 320,
    mobile_app_kit: lang === 'ar' ? 900 : 240,
    web_elements: lang === 'ar' ? 700 : 187,
    brand_photography: lang === 'ar' ? 500 : 133,
    brand_strategy: lang === 'ar' ? 1500 : 400,
    team_training: lang === 'ar' ? 800 : 213
  };

  const packagePrices = {
    starter: lang === 'ar' ? 1500 : 400,
    business: lang === 'ar' ? 3500 : 933,
    premium: lang === 'ar' ? 6500 : 1733,
    enterprise: lang === 'ar' ? 12000 : 3200
  };

  // Calculate total cost
  const calculateTotalCost = () => {
    const packagePrice = selectedPackage ? packagePrices[selectedPackage as keyof typeof packagePrices] || 0 : 0;
    const featuresPrice = selectedFeatures.reduce((total, featureId) => {
      return total + (featurePrices[featureId] || 0);
    }, 0);
    return packagePrice + featuresPrice;
  };

  // Steps configuration
  const steps = [
    { id: 1, name: lang === 'ar' ? 'اختيار الباقة' : 'Choose Package', completed: currentStep > 1 },
    { id: 2, name: lang === 'ar' ? 'الميزات الإضافية' : 'Additional Features', completed: currentStep > 2 },
    { id: 3, name: lang === 'ar' ? 'تفاصيل المشروع' : 'Project Details', completed: currentStep > 3 },
    { id: 4, name: lang === 'ar' ? 'المراجعة والإرسال' : 'Review & Submit', completed: isSubmitted }
  ];

  // Navigation functions
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setFormData(prev => ({ ...prev, selectedPackage: packageId }));
  };

  const handleFeaturesChange = (features: string[]) => {
    setSelectedFeatures(features);
    setFormData(prev => ({ ...prev, selectedFeatures: features }));
  };

  // Submit request mutation
  const submitRequestMutation = useMutation({
    mutationFn: async (requestData: any) => {
      const formDataToSubmit = new FormData();
      
      // Add form fields
      Object.entries(requestData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'attachedFiles') {
          if (typeof value === 'object') {
            formDataToSubmit.append(key, JSON.stringify(value));
          } else {
            formDataToSubmit.append(key, String(value));
          }
        }
      });

      // Add files
      attachedFiles.forEach((fileWrapper, index) => {
        formDataToSubmit.append(`file_${index}`, fileWrapper.file);
      });

      const response = await fetch('/api/graphics-design-orders', {
        method: 'POST',
        body: formDataToSubmit,
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit request');
      }
      
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: lang === 'ar' ? 'تم إرسال طلبك بنجاح!' : 'Request submitted successfully!',
        description: lang === 'ar' ? 
          'سنتواصل معك خلال 24 ساعة لمناقشة التفاصيل وبدء مشروعك.' :
          'We will contact you within 24 hours to discuss details and start your project.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/graphics-design-requests'] });
    },
    onError: (error) => {
      console.error('Error submitting request:', error);
      toast({
        title: lang === 'ar' ? 'خطأ في الإرسال' : 'Submission Error',
        description: lang === 'ar' ? 
          'حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.' :
          'An error occurred while submitting your request. Please try again.',
        variant: "destructive",
      });
    }
  });

  const handleSubmit = () => {
    const requestData = {
      ...formData,
      selectedPackage,
      selectedFeatures,
      serviceId: '9a6c839d-2a5c-4418-832a-2a5bd14dcf7e',
      totalCost: calculateTotalCost(),
      status: 'pending'
    };
    submitRequestMutation.mutate(requestData);
  };

  // Progress calculation
  const progress = (currentStep / 4) * 100;

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {lang === 'ar' ? 'تم إرسال طلبك بنجاح!' : 'Request Sent Successfully!'}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {lang === 'ar' ? 
              'شكراً لاختيارك خدماتنا. سنراجع طلبك ونتواصل معك خلال 24 ساعة لمناقشة التفاصيل وبدء العمل على مشروعك.' :
              'Thank you for choosing our services. We will review your request and contact you within 24 hours to discuss details and start working on your project.'
            }
          </p>

          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{lang === 'ar' ? 'نتواصل معك خلال 24 ساعة' : 'We\'ll contact you within 24 hours'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500" />
              <span>{lang === 'ar' ? 'تأكيد عبر البريد الإلكتروني' : 'Email confirmation sent'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500" />
              <span>{lang === 'ar' ? 'اتصال لمناقشة التفاصيل' : 'Phone call to discuss details'}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-8 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            data-testid="button-close-success"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                data-testid="button-close-wizard"
              >
                <ArrowLeft className={cn("w-5 h-5", dir === 'rtl' && "rotate-180")} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {lang === 'ar' ? 'طلب خدمة تصميم الهوية البصرية' : 'Visual Identity Design Request'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {lang === 'ar' ? 'اتبع الخطوات لإنشاء طلبك' : 'Follow the steps to create your request'}
                </p>
              </div>
            </div>
            
            <Badge variant="secondary" className="px-3 py-1">
              {lang === 'ar' ? `الخطوة ${currentStep} من 4` : `Step ${currentStep} of 4`}
            </Badge>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-between text-sm">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "flex items-center gap-2",
                  currentStep === step.id ? "text-blue-600 dark:text-blue-400 font-medium" :
                  step.completed ? "text-green-600 dark:text-green-400" : "text-gray-400"
                )}>
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2",
                      currentStep === step.id ? "border-blue-600 bg-blue-100 dark:bg-blue-900" : "border-gray-300"
                    )}>
                      {currentStep === step.id && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full m-0.5"></div>
                      )}
                    </div>
                  )}
                  <span className="hidden sm:inline">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-200 dark:bg-gray-600 mx-2 hidden sm:block"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
                transition={{ duration: 0.3 }}
              >
                <PackageSelection
                  selectedPackage={selectedPackage}
                  onSelectPackage={handlePackageSelect}
                  onNext={nextStep}
                />
              </motion.div>
            )}

            {currentStep === 2 && selectedPackage && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
                transition={{ duration: 0.3 }}
              >
                <FeatureSelection
                  selectedPackage={selectedPackage}
                  selectedFeatures={selectedFeatures}
                  onFeaturesChange={handleFeaturesChange}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              </motion.div>
            )}

            {currentStep === 3 && selectedPackage && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
                transition={{ duration: 0.3 }}
              >
                <ContactStep
                  selectedPackage={selectedPackage}
                  selectedFeatures={selectedFeatures}
                  formData={formData}
                  attachedFiles={attachedFiles}
                  onFormDataChange={setFormData}
                  onFilesChange={setAttachedFiles}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              </motion.div>
            )}

            {currentStep === 4 && selectedPackage && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
                transition={{ duration: 0.3 }}
              >
                <SummaryStep
                  selectedPackage={selectedPackage}
                  selectedFeatures={selectedFeatures}
                  formData={formData}
                  attachedFiles={attachedFiles}
                  estimatedCost={calculateTotalCost()}
                  onSubmit={handleSubmit}
                  onBack={prevStep}
                  isSubmitting={submitRequestMutation.isPending}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cost summary footer */}
        {selectedPackage && currentStep > 1 && currentStep < 4 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <Sparkles className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span className="font-medium">
                  {lang === 'ar' ? 'التكلفة الإجمالية المقدرة:' : 'Estimated Total Cost:'}
                </span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {lang === 'ar' ? `${calculateTotalCost()} ر.س` : `$${calculateTotalCost()}`}
                </span>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}