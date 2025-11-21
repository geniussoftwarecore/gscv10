import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Clock, CheckCircle, ArrowRight } from "lucide-react";

interface QuoteCalculatorProps {
  serviceCategory: string;
  onGetQuote?: (quote: any) => void;
}

export function QuoteCalculator({ serviceCategory, onGetQuote }: QuoteCalculatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, any>>({});
  const [calculatedQuote, setCalculatedQuote] = useState<any>(null);

  const steps = [
    {
      id: "scope",
      title: "نطاق المشروع",
      description: "حدد حجم ومدى تعقيد مشروعك"
    },
    {
      id: "features",
      title: "المميزات المطلوبة",
      description: "اختر المميزات التي تحتاجها"
    },
    {
      id: "timeline",
      title: "الجدولة الزمنية",
      description: "حدد الوقت المطلوب للإنجاز"
    },
    {
      id: "result",
      title: "التقدير النهائي",
      description: "مراجعة التكلفة والجدولة"
    }
  ];

  const scopeOptions = {
    mobile: [
      { id: "simple", label: "تطبيق بسيط", price: 15000, duration: "4-6 أسابيع" },
      { id: "medium", label: "تطبيق متوسط", price: 25000, duration: "6-10 أسابيع" },
      { id: "complex", label: "تطبيق معقد", price: 40000, duration: "10-16 أسبوع" }
    ],
    web: [
      { id: "landing", label: "موقع تعريفي", price: 8000, duration: "2-4 أسابيع" },
      { id: "business", label: "موقع تجاري", price: 18000, duration: "4-8 أسابيع" },
      { id: "ecommerce", label: "متجر إلكتروني", price: 35000, duration: "8-12 أسبوع" }
    ],
    desktop: [
      { id: "simple", label: "تطبيق بسيط", price: 20000, duration: "4-8 أسابيع" },
      { id: "business", label: "نظام إدارة", price: 45000, duration: "8-16 أسبوع" },
      { id: "enterprise", label: "حل مؤسسي", price: 80000, duration: "12-24 أسبوع" }
    ],
    design: [
      { id: "basic", label: "هوية أساسية", price: 5000, duration: "1-2 أسبوع" },
      { id: "complete", label: "هوية شاملة", price: 12000, duration: "2-4 أسابيع" },
      { id: "rebrand", label: "إعادة تصميم", price: 20000, duration: "3-6 أسابيع" }
    ]
  };

  const featureOptions = {
    mobile: [
      { id: "auth", label: "نظام تسجيل الدخول", price: 3000 },
      { id: "payment", label: "نظام الدفع", price: 5000 },
      { id: "chat", label: "دردشة مباشرة", price: 4000 },
      { id: "admin", label: "لوحة إدارة", price: 6000 },
      { id: "api", label: "API متقدم", price: 4500 }
    ],
    web: [
      { id: "cms", label: "إدارة المحتوى", price: 4000 },
      { id: "seo", label: "تحسين محركات البحث", price: 2500 },
      { id: "analytics", label: "تحليلات متقدمة", price: 3000 },
      { id: "multilang", label: "متعدد اللغات", price: 3500 },
      { id: "blog", label: "نظام المدونة", price: 2000 }
    ],
    desktop: [
      { id: "database", label: "قاعدة بيانات متقدمة", price: 5000 },
      { id: "reports", label: "تقارير مفصلة", price: 4000 },
      { id: "backup", label: "نظام النسخ الاحتياطي", price: 3000 },
      { id: "security", label: "أمان متقدم", price: 4500 },
      { id: "integration", label: "تكامل مع أنظمة أخرى", price: 6000 }
    ],
    design: [
      { id: "print", label: "مواد مطبوعة", price: 2000 },
      { id: "social", label: "قوالب وسائل التواصل", price: 1500 },
      { id: "packaging", label: "تصميم العبوات", price: 3000 },
      { id: "signage", label: "تصميم اللافتات", price: 2500 },
      { id: "3d", label: "تصميم ثلاثي الأبعاد", price: 4000 }
    ]
  };

  const currentScopeOptions = scopeOptions[serviceCategory as keyof typeof scopeOptions] || [];
  const currentFeatureOptions = featureOptions[serviceCategory as keyof typeof featureOptions] || [];

  const calculateQuote = () => {
    const scope = selections.scope;
    const features = selections.features || [];
    const urgency = selections.urgency || 1;

    const basePrice = scope?.price || 0;
    const featuresPrice = features.reduce((sum: number, feature: any) => sum + feature.price, 0);
    const urgencyMultiplier = urgency === 2 ? 1.3 : urgency === 3 ? 1.6 : 1;

    const totalPrice = Math.round((basePrice + featuresPrice) * urgencyMultiplier);
    const baseDuration = scope?.duration || "غير محدد";

    setCalculatedQuote({
      totalPrice,
      baseDuration,
      urgencyMultiplier,
      breakdown: {
        base: basePrice,
        features: featuresPrice,
        urgency: urgency
      }
    });
  };

  const handleNext = () => {
    if (currentStep === steps.length - 2) {
      calculateQuote();
    }
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  };

  const handleSelection = (step: string, value: any) => {
    setSelections(prev => ({ ...prev, [step]: value }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-SA").format(price) + " ر.س";
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="text-primary" size={24} />
          حاسبة التكلفة السريعة
        </CardTitle>
        <div className="flex justify-between items-center mt-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index <= currentStep 
                  ? "bg-primary text-white" 
                  : "bg-gray-200 text-gray-500"
              }`}>
                {index < currentStep ? <CheckCircle size={16} /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-1 ${
                  index < currentStep ? "bg-primary" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">{steps[0].title}</h3>
                <p className="text-gray-600 mb-6">{steps[0].description}</p>
                <div className="grid gap-4">
                  {currentScopeOptions.map((option) => (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selections.scope?.id === option.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-primary/50"
                      }`}
                      onClick={() => handleSelection("scope", option)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{option.label}</h4>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Clock size={14} />
                            {option.duration}
                          </p>
                        </div>
                        <Badge variant="outline">{formatPrice(option.price)}</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">{steps[1].title}</h3>
                <p className="text-gray-600 mb-6">{steps[1].description}</p>
                <div className="grid gap-3">
                  {currentFeatureOptions.map((feature) => {
                    const isSelected = selections.features?.some((f: any) => f.id === feature.id);
                    return (
                      <motion.div
                        key={feature.id}
                        whileHover={{ scale: 1.01 }}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                        onClick={() => {
                          const currentFeatures = selections.features || [];
                          const newFeatures = isSelected
                            ? currentFeatures.filter((f: any) => f.id !== feature.id)
                            : [...currentFeatures, feature];
                          handleSelection("features", newFeatures);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{feature.label}</span>
                          <Badge variant="outline">+{formatPrice(feature.price)}</Badge>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">{steps[2].title}</h3>
                <p className="text-gray-600 mb-6">{steps[2].description}</p>
                <div className="grid gap-4">
                  {[
                    { id: 1, label: "جدولة عادية", description: "لا يوجد استعجال", multiplier: 1 },
                    { id: 2, label: "جدولة سريعة", description: "تسليم أسرع بـ 30%", multiplier: 1.3 },
                    { id: 3, label: "جدولة عاجلة", description: "تسليم عاجل بـ 60%", multiplier: 1.6 }
                  ].map((option) => (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selections.urgency === option.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-primary/50"
                      }`}
                      onClick={() => handleSelection("urgency", option.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{option.label}</h4>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                        {option.multiplier > 1 && (
                          <Badge variant="outline">+{Math.round((option.multiplier - 1) * 100)}%</Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && calculatedQuote && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">{steps[3].title}</h3>
                
                <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-lg">
                  <div className="text-center">
                    <p className="text-lg opacity-90">التكلفة الإجمالية التقديرية</p>
                    <p className="text-4xl font-bold mt-2">{formatPrice(calculatedQuote.totalPrice)}</p>
                    <p className="text-sm opacity-75 mt-2">المدة التقديرية: {calculatedQuote.baseDuration}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">تفاصيل التكلفة:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>التكلفة الأساسية:</span>
                      <span>{formatPrice(calculatedQuote.breakdown.base)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>المميزات الإضافية:</span>
                      <span>{formatPrice(calculatedQuote.breakdown.features)}</span>
                    </div>
                    {calculatedQuote.urgencyMultiplier > 1 && (
                      <div className="flex justify-between">
                        <span>رسوم التعجيل:</span>
                        <span>+{Math.round((calculatedQuote.urgencyMultiplier - 1) * 100)}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1"
                    onClick={() => onGetQuote && onGetQuote(calculatedQuote)}
                  >
                    احصل على عرض رسمي
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentStep(0)}>
                    إعادة حساب
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {currentStep < steps.length - 1 && (
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              السابق
            </Button>
            <Button 
              onClick={handleNext}
              disabled={
                (currentStep === 0 && !selections.scope) ||
                (currentStep === 2 && !selections.urgency)
              }
              className="flex items-center gap-2"
            >
              التالي
              <ArrowRight size={16} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}