import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { LoginMagic } from '../components/auth/LoginMagic';
import { MetaTags } from '../components/seo/meta-tags';
import logoImage from '@assets/logo_1764350770360.png';
import { Shield, Zap, Users, BarChart3 } from 'lucide-react';

export default function Login() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');
      setLocation(redirect || '/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-sky-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const features = [
    { icon: Shield, title: 'أمان متقدم', description: 'حماية بيانات متكاملة' },
    { icon: Zap, title: 'أداء سريع', description: 'سرعة في التنفيذ' },
    { icon: Users, title: 'دعم متواصل', description: 'فريق دعم 24/7' },
    { icon: BarChart3, title: 'تقارير ذكية', description: 'تحليلات متطورة' },
  ];

  return (
    <>
      <MetaTags
        title="تسجيل الدخول - Genius Software Core"
        description="سجل دخولك للوصول إلى لوحة التحكم الخاصة بك وإدارة مشاريعك وطلباتك."
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
                <div className="text-3xl font-bold">+150</div>
                <div className="text-sm text-sky-200">مشروع منجز</div>
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

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
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
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">مرحباً بعودتك</h2>
              <p className="text-slate-500">
                سجل دخولك للوصول إلى لوحة التحكم الخاصة بك
              </p>
            </div>
            
            <LoginMagic />

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
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
