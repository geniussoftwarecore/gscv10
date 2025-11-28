import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, Shield, Zap, Users, BarChart3 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MetaTags } from "@/components/seo/meta-tags";
import logoImage from '@assets/logo_1764350770360.png';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      });
      return;
    }
    if (!formData.agreeToTerms) {
      toast({
        title: "يجب الموافقة على الشروط",
        description: "يجب الموافقة على الشروط والأحكام للمتابعة",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const result = await response.json();
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: result.message,
      });
      
      setLocation("/login");
      
    } catch (error) {
      toast({
        title: "فشل في إنشاء الحساب",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    toast({
      title: "قريباً",
      description: "تسجيل الدخول عبر Google سيكون متاحاً قريباً",
    });
  };

  const features = [
    { icon: Shield, title: 'أمان متقدم', description: 'حماية بيانات متكاملة' },
    { icon: Zap, title: 'أداء سريع', description: 'سرعة في التنفيذ' },
    { icon: Users, title: 'دعم متواصل', description: 'فريق دعم 24/7' },
    { icon: BarChart3, title: 'تقارير ذكية', description: 'تحليلات متطورة' },
  ];

  return (
    <>
      <MetaTags
        title="إنشاء حساب - Genius Software Core"
        description="أنشئ حسابك الآن وانضم إلى منصة جينيس سوفت وير كور لإدارة مشاريعك وخدماتك التقنية."
        type="website"
      />
      
      <div className="min-h-screen flex" dir="rtl">
        {/* Left Panel - Decorative (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
            {/* Logo */}
            <div className="mb-8">
              <img 
                src={logoImage} 
                alt="Genius Software Core Logo" 
                className="w-32 h-32 drop-shadow-2xl"
              />
            </div>
            
            <h1 className="text-4xl font-bold mb-4 text-center">جينيس سوفت وير كور</h1>
            <p className="text-xl text-sky-100 mb-12 text-center max-w-md">
              منصة متكاملة لإدارة المشاريع والخدمات التقنية
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6 max-w-md">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <feature.icon className="w-8 h-8 mb-3 text-sky-200" />
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-sky-200">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm text-sky-200">التزام بالمواعيد</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">99%</div>
                <div className="text-sm text-sky-200">رضا العملاء</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-sky-200">دعم فني</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Registration Form */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">
              <img 
                src={logoImage} 
                alt="Genius Software Core Logo" 
                className="w-20 h-20 mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-sky-600">جينيس سوفت وير كور</h1>
              <p className="text-slate-500 mt-2 text-sm">
                منصة إدارة المشاريع والخدمات التقنية
              </p>
            </div>

            {/* Welcome Text (Desktop only) */}
            <div className="hidden lg:block mb-6">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">إنشاء حساب جديد</h2>
              <p className="text-slate-500">
                انضم إلينا وابدأ في إدارة مشاريعك باحترافية
              </p>
            </div>
            
            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">
                  الاسم الكامل
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  disabled={isLoading}
                  data-testid="input-name"
                  className="h-12 bg-slate-50 border-slate-200 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  disabled={isLoading}
                  data-testid="input-email"
                  className="h-12 bg-slate-50 border-slate-200 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium">
                  رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+967 7XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={isLoading}
                  data-testid="input-phone"
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
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                  تأكيد كلمة المرور
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    disabled={isLoading}
                    data-testid="input-confirm-password"
                    className="h-12 bg-slate-50 border-slate-200 focus:border-sky-500 focus:ring-sky-500 rounded-xl pr-4 pl-12 text-right"
                  />
                  <button
                    type="button"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    data-testid="button-toggle-confirm-password"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                  className="h-4 w-4 text-sky-500 focus:ring-sky-500 border-slate-300 rounded"
                  data-testid="checkbox-terms"
                />
                <label htmlFor="agree-terms" className="text-sm text-slate-600">
                  أوافق على{' '}
                  <Link href="/terms" className="text-sky-500 hover:text-sky-600 transition-colors">
                    الشروط والأحكام
                  </Link>
                  {' '}و{' '}
                  <Link href="/privacy" className="text-sky-500 hover:text-sky-600 transition-colors">
                    سياسة الخصوصية
                  </Link>
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-all duration-200" 
                disabled={isLoading}
                data-testid="button-register"
              >
                {isLoading && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
                إنشاء حساب
              </Button>
            </form>

            <div className="mt-5">
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
                onClick={handleGoogleRegister}
                disabled={isLoading}
                data-testid="button-register-google"
              >
                <svg className="w-5 h-5 ml-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                التسجيل بحساب Google
              </Button>
            </div>

            <div className="mt-5 text-center">
              <p className="text-sm text-slate-500">
                لديك حساب بالفعل؟{' '}
                <Link href="/login" className="text-sky-500 hover:text-sky-600 font-medium transition-colors">
                  تسجيل الدخول
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                &copy; 2025 Genius Software Core. جميع الحقوق محفوظة
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
