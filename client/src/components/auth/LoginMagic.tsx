import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Mail, CheckCircle, Eye, EyeOff } from 'lucide-react';

export function LoginMagic() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  if (sent) {
    return (
      <div className="bg-slate-50 rounded-2xl p-8 text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">تم إرسال الرابط السحري</h3>
        <p className="text-slate-500 mb-6">
          تم إرسال رابط تسجيل الدخول إلى بريدك الإلكتروني
        </p>
        <Alert className="mb-4 bg-sky-50 border-sky-200">
          <Mail className="h-4 w-4 text-sky-600" />
          <AlertDescription className="text-sky-700">
            تحقق من بريدك الإلكتروني وانقر على الرابط لتسجيل الدخول. الرابط صالح لمدة 15 دقيقة.
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="w-full border-slate-200 hover:bg-slate-100"
          onClick={() => { setSent(false); setEmail(''); }}
          data-testid="button-back-to-login"
        >
          العودة إلى تسجيل الدخول
        </Button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 font-medium">
            البريد الإلكتروني
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            data-testid="input-email"
            className="h-12 bg-slate-50 border-slate-200 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-right"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-700 font-medium">
            كلمة المرور
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              data-testid="input-password"
              className="h-12 bg-slate-50 border-slate-200 focus:border-sky-500 focus:ring-sky-500 rounded-xl pr-4 pl-12 text-right"
            />
            <button
              type="button"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              data-testid="button-toggle-password"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="rounded-xl">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-all duration-200" 
          disabled={isLoading || !email || !password}
          data-testid="button-login"
        >
          {isLoading && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
          تسجيل الدخول
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-slate-400">أو</span>
          </div>
        </div>
        
        <Button 
          type="button"
          variant="outline"
          className="w-full h-12 mt-4 border-slate-200 hover:bg-slate-50 font-medium rounded-xl transition-all duration-200" 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          data-testid="button-login-google"
        >
          <svg className="w-5 h-5 ml-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          تسجيل الدخول بجوجل
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-400">
          بالمتابعة، أنت توافق على{' '}
          <a href="/terms" className="text-sky-500 hover:text-sky-600 transition-colors">
            شروط الخدمة
          </a>{' '}
          و{' '}
          <a href="/privacy" className="text-sky-500 hover:text-sky-600 transition-colors">
            سياسة الخصوصية
          </a>
        </p>
      </div>
    </div>
  );
}
