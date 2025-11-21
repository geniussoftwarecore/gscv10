import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function VerifyMagicLink() {
  const [, setLocation] = useLocation();
  const { verifyMagicLink } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const redirectUrl = urlParams.get('redirect');

    if (!token) {
      setStatus('error');
      setError('رابط غير صالح - لا يوجد رمز تحقق');
      return;
    }

    const verify = async () => {
      try {
        await verifyMagicLink(token);
        setStatus('success');
        
        // Redirect after a short delay
        setTimeout(() => {
          setLocation(redirectUrl || '/dashboard');
        }, 2000);
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'فشل في التحقق من الرابط');
      }
    };

    verify();
  }, [verifyMagicLink, setLocation]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
            <CardTitle>جاري التحقق...</CardTitle>
            <CardDescription>
              يتم التحقق من الرابط السحري، يرجى الانتظار
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle>تم تسجيل الدخول بنجاح!</CardTitle>
            <CardDescription>
              سيتم توجيهك إلى لوحة التحكم خلال ثوانٍ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                مرحباً بك في Genius Software Core! ستجد جميع الأدوات والخدمات في لوحة التحكم.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle>فشل في التحقق</CardTitle>
          <CardDescription>
            لم نتمكن من التحقق من الرابط السحري
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <div className="flex flex-col gap-2">
            <Link href="/login">
              <Button className="w-full" data-testid="button-retry-login">
                المحاولة مرة أخرى
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                العودة إلى الصفحة الرئيسية
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}