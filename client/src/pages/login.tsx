import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { LoginMagic } from '../components/auth/LoginMagic';
import { MetaTags } from '../components/seo/meta-tags';
import logoImage from '@assets/logo_1764350770360.png';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <MetaTags
        title="تسجيل الدخول - Genius Software Core"
        description="سجل دخولك للوصول إلى لوحة التحكم الخاصة بك وإدارة مشاريعك وطلباتك."
        type="website"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 flex items-center justify-center py-12 px-4" dir="rtl">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src={logoImage} 
              alt="Genius Software Core Logo" 
              className="w-24 h-24 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-[#0284c7]">جينيس سوفت وير كور</h1>
            <p className="text-slate-600 mt-2">
              منصة إدارة المشاريع والخدمات التقنية
            </p>
          </div>
          
          <LoginMagic />
        </div>
      </div>
    </>
  );
}