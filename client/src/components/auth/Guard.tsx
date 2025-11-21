import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plan } from '../../../../shared/types/billing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Lock, Crown, Zap } from 'lucide-react';
import { Link } from 'wouter';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requirePlan?: Plan;
  fallback?: ReactNode;
}

export function AuthGuard({ 
  children, 
  requireAuth = false, 
  requirePlan,
  fallback 
}: AuthGuardProps) {
  const { user, isLoading, isAuthenticated, trialDaysRemaining } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-orange-600" />
          </div>
          <CardTitle>تسجيل الدخول مطلوب</CardTitle>
          <CardDescription>
            يجب تسجيل الدخول للوصول إلى هذه الصفحة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button className="w-full" data-testid="button-login-required">
              تسجيل الدخول
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (requirePlan && user) {
    const userPlan = user.subscription?.plan || 'free';
    const planLevels = { free: 0, pro: 1, business: 2 };
    
    const hasRequiredPlan = planLevels[userPlan] >= planLevels[requirePlan];
    const isTrialExpired = user.subscription?.status === 'trialing' && 
      user.subscription.trialEndsAt && 
      new Date(user.subscription.trialEndsAt) < new Date();

    if (!hasRequiredPlan || isTrialExpired) {
      if (fallback) return <>{fallback}</>;

      const getPlanIcon = (plan: Plan) => {
        switch (plan) {
          case 'pro': return <Zap className="w-6 h-6 text-blue-600" />;
          case 'business': return <Crown className="w-6 h-6 text-purple-600" />;
          default: return <Lock className="w-6 h-6 text-gray-600" />;
        }
      };

      const getPlanName = (plan: Plan) => {
        switch (plan) {
          case 'pro': return 'برو';
          case 'business': return 'الأعمال';
          default: return plan;
        }
      };

      return (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              {getPlanIcon(requirePlan)}
            </div>
            <CardTitle>ترقية الباقة مطلوبة</CardTitle>
            <CardDescription>
              تحتاج إلى باقة {getPlanName(requirePlan)} أو أعلى للوصول إلى هذه الميزة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isTrialExpired && (
              <Alert>
                <AlertDescription>
                  انتهت فترة التجربة المجانية. قم بالترقية للمتابعة.
                </AlertDescription>
              </Alert>
            )}
            
            {trialDaysRemaining !== null && trialDaysRemaining > 0 && (
              <Alert>
                <AlertDescription>
                  متبقي {trialDaysRemaining} أيام من التجربة المجانية
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-2">
              <Link href="/pricing">
                <Button className="w-full" data-testid="button-upgrade-plan">
                  عرض الباقات والأسعار
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  العودة إلى لوحة التحكم
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      );
    }
  }

  return <>{children}</>;
}