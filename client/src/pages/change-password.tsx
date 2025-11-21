import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { MetaTags } from '../components/seo/meta-tags';
import { Loader2, Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const [, setLocation] = useLocation();
  const { changePassword, forcePasswordChange } = useAuth();
  const { toast } = useToast();

  // Password validation function
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 10) {
      errors.push('Password must be at least 10 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one digit');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    if (password === currentPassword) {
      errors.push('New password must be different from current password');
    }
    
    return errors;
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    setValidationErrors(validatePassword(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword || isLoading) return;

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match",
        variant: "destructive",
      });
      return;
    }

    // Check validation errors
    const errors = validatePassword(newPassword);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      
      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated",
        variant: "default",
      });
      
      // Redirect to dashboard after successful password change
      setLocation('/dashboard');
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to change password',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MetaTags
        title="تغيير كلمة المرور - Genius Software Core"
        description="قم بتحديث كلمة المرور الخاصة بك لضمان أمان حسابك"
        type="website"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 flex items-center justify-center py-12 px-4" dir="rtl">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              تغيير كلمة المرور
            </h1>
            <p className="text-slate-600 mt-2">
              قم بتحديث كلمة المرور لضمان أمان حسابك
            </p>
          </div>

          {forcePasswordChange && (
            <Alert className="mb-6 border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                يجب عليك تغيير كلمة المرور للمتابعة
              </AlertDescription>
            </Alert>
          )}
          
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">كلمة مرور جديدة</CardTitle>
              <CardDescription>
                أدخل كلمة المرور الحالية وكلمة المرور الجديدة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="كلمة المرور الحالية"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      data-testid="input-current-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      data-testid="button-toggle-current-password"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="كلمة المرور الجديدة"
                      value={newPassword}
                      onChange={(e) => handleNewPasswordChange(e.target.value)}
                      required
                      disabled={isLoading}
                      data-testid="input-new-password"
                      className={`pr-10 ${validationErrors.length > 0 ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      data-testid="button-toggle-new-password"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {validationErrors.length > 0 && (
                    <div className="text-sm text-red-600 space-y-1">
                      {validationErrors.map((error, index) => (
                        <div key={index}>• {error}</div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="تأكيد كلمة المرور الجديدة"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      data-testid="input-confirm-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      data-testid="button-toggle-confirm-password"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">
                  <p className="font-medium mb-1">متطلبات كلمة المرور:</p>
                  <ul className="space-y-1">
                    <li>• على الأقل 10 أحرف</li>
                    <li>• حرف كبير واحد على الأقل</li>
                    <li>• حرف صغير واحد على الأقل</li>
                    <li>• رقم واحد على الأقل</li>
                    <li>• رمز خاص واحد على الأقل</li>
                    <li>• مختلفة عن كلمة المرور الحالية</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || validationErrors.length > 0 || !currentPassword || !newPassword || !confirmPassword}
                  data-testid="button-change-password"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      جاري التحديث...
                    </>
                  ) : (
                    'تحديث كلمة المرور'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}