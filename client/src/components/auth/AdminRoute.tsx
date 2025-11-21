import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldX, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAdmin, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, loading, setLocation]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gsc-light flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-lg font-medium text-gray-600">جاري التحقق من الصلاحيات...</span>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gsc-light flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <ShieldX className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              غير مصرح لك بالوصول
            </h2>
            
            <p className="text-gray-600 mb-6">
              هذه الصفحة متاحة للمديرين فقط. يرجى التواصل مع الإدارة إذا كنت تحتاج إلى صلاحيات الإدارة.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => setLocation("/dashboard")}
                className="w-full"
              >
                <ArrowRight className="ml-2 h-4 w-4" />
                العودة للداشبورد
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setLocation("/")}
                className="w-full"
              >
                العودة للصفحة الرئيسية
              </Button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                المستخدم الحالي: <span className="font-medium">{user?.name}</span>
              </p>
              <p className="text-sm text-gray-500">
                الدور: <span className="font-medium">{user?.role || "client"}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin authorized - render children
  return <>{children}</>;
}