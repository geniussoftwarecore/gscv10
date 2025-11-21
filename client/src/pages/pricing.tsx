import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Check, Crown, Zap, Star, Loader2 } from 'lucide-react';
import { Plan, PlanConfig } from '../../../shared/types/billing';
import { MetaTags } from '../components/seo/meta-tags';

interface PricingData {
  free: PlanConfig;
  pro: PlanConfig;
  business: PlanConfig;
}

export default function PricingPage() {
  const { user, isAuthenticated, trialDaysRemaining } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const response = await fetch('/api/billing/prices');
      if (response.ok) {
        const data = await response.json();
        setPricing(data);
      }
    } catch (error) {
      console.error('Failed to fetch pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan: Plan) => {
    if (!isAuthenticated) {
      window.location.href = '/login?redirect=/pricing';
      return;
    }

    setCheckoutLoading(plan);
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan,
          billingCycle: isYearly ? 'yearly' : 'monthly',
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('فشل في إنشاء جلسة الدفع، يرجى المحاولة مرة أخرى');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const getPlanIcon = (plan: Plan) => {
    switch (plan) {
      case 'pro': return <Zap className="w-6 h-6 text-blue-600" />;
      case 'business': return <Crown className="w-6 h-6 text-purple-600" />;
      default: return <Star className="w-6 h-6 text-green-600" />;
    }
  };

  const isCurrentPlan = (plan: Plan) => {
    return user?.subscription?.plan === plan;
  };

  const getButtonText = (plan: Plan) => {
    if (!isAuthenticated) {
      return plan === 'free' ? 'ابدأ التجربة المجانية' : 'ابدأ الآن';
    }
    
    if (isCurrentPlan(plan)) {
      return 'الباقة الحالية';
    }
    
    return plan === 'free' ? 'الرجوع للباقة المجانية' : 'ترقية الباقة';
  };

  if (loading || !pricing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title="الأسعار والباقات - Genius Software Core"
        description="اختر الباقة المناسبة لاحتياجاتك مع تجربة مجانية لمدة 14 يوماً. باقات مرنة للأفراد والشركات مع دعم فني متميز."
        type="website"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              الأسعار والباقات
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              اختر الباقة المناسبة لاحتياجاتك. جميع الباقات تأتي مع تجربة مجانية لمدة 14 يوماً
            </p>
            
            {trialDaysRemaining !== null && trialDaysRemaining > 0 && (
              <Alert className="max-w-md mx-auto mt-6">
                <AlertDescription>
                  متبقي {trialDaysRemaining} أيام من التجربة المجانية
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12 space-x-4 space-x-reverse">
            <Label htmlFor="billing-toggle" className="text-lg">شهرياً</Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
              data-testid="switch-billing-cycle"
            />
            <Label htmlFor="billing-toggle" className="text-lg">
              سنوياً
              <Badge variant="secondary" className="mr-2">
                وفر شهرين مجاناً
              </Badge>
            </Label>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.entries(pricing).map(([planKey, planConfig]) => {
              const plan = planKey as Plan;
              const price = isYearly ? planConfig.yearlyPrice : planConfig.monthlyPrice;
              const yearlyDiscount = isYearly && planConfig.monthlyPrice > 0 
                ? Math.round((1 - planConfig.yearlyPrice / (planConfig.monthlyPrice * 12)) * 100)
                : 0;

              return (
                <Card 
                  key={plan}
                  className={`relative ${planConfig.popular ? 'border-blue-500 scale-105' : ''} ${
                    isCurrentPlan(plan) ? 'bg-blue-50 border-blue-300' : ''
                  }`}
                  data-testid={`card-plan-${plan}`}
                >
                  {planConfig.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                      الأكثر شعبية
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      {getPlanIcon(plan)}
                    </div>
                    <CardTitle className="text-2xl">{planConfig.name}</CardTitle>
                    <CardDescription className="text-lg">
                      <span className="text-3xl font-bold text-gray-900">
                        {price === 0 ? 'مجاناً' : `$${price}`}
                      </span>
                      {price > 0 && (
                        <span className="text-gray-600">
                          /{isYearly ? 'سنة' : 'شهر'}
                        </span>
                      )}
                      {yearlyDiscount > 0 && (
                        <Badge variant="secondary" className="mr-2">
                          وفر {yearlyDiscount}%
                        </Badge>
                      )}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Features */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-600 ml-2" />
                        <span>
                          {planConfig.features.maxProjects === -1 
                            ? 'مشاريع غير محدودة' 
                            : `${planConfig.features.maxProjects} مشاريع`}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-5 h-5 text-green-600 ml-2" />
                        <span>
                          {planConfig.features.maxTeamMembers === -1 
                            ? 'أعضاء فريق غير محدودة' 
                            : `${planConfig.features.maxTeamMembers} أعضاء فريق`}
                        </span>
                      </div>
                      {planConfig.features.advancedAnalytics && (
                        <div className="flex items-center">
                          <Check className="w-5 h-5 text-green-600 ml-2" />
                          <span>تحليلات متقدمة</span>
                        </div>
                      )}
                      {planConfig.features.prioritySupport && (
                        <div className="flex items-center">
                          <Check className="w-5 h-5 text-green-600 ml-2" />
                          <span>دعم فني أولوية</span>
                        </div>
                      )}
                      {planConfig.features.customBranding && (
                        <div className="flex items-center">
                          <Check className="w-5 h-5 text-green-600 ml-2" />
                          <span>علامة تجارية مخصصة</span>
                        </div>
                      )}
                      {planConfig.features.apiAccess && (
                        <div className="flex items-center">
                          <Check className="w-5 h-5 text-green-600 ml-2" />
                          <span>وصول إلى API</span>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Button
                      className="w-full"
                      variant={planConfig.popular ? 'default' : 'outline'}
                      disabled={isCurrentPlan(plan) || checkoutLoading === plan}
                      onClick={() => plan !== 'free' && handleUpgrade(plan)}
                      data-testid={`button-select-${plan}`}
                    >
                      {checkoutLoading === plan && (
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      )}
                      {getButtonText(plan)}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              أسئلة شائعة
            </h2>
            <div className="max-w-3xl mx-auto space-y-4 text-right">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">هل يمكنني تغيير باقتي في أي وقت؟</h3>
                <p className="text-gray-600">
                  نعم، يمكنك ترقية أو تخفيض باقتك في أي وقت. ستدفع الفرق أو تحصل على رصيد للفترة المتبقية.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">ماذا يحدث عند انتهاء التجربة المجانية؟</h3>
                <p className="text-gray-600">
                  ستتحول تلقائياً إلى الباقة المجانية. يمكنك الترقية في أي وقت للاستفادة من المزيد من الميزات.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}