import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Key,
  Save,
  Eye,
  EyeOff
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Profile settings state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    company: "",
    bio: ""
  });
  
  // Notification settings state  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    projectUpdates: true,
    paymentReminders: true
  });
  
  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: "30"
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Handle profile update
  const handleProfileUpdate = () => {
    if (!profileData.name.trim()) {
      toast({
        title: "الاسم مطلوب",
        description: "يرجى إدخال اسمك الكامل",
        variant: "destructive"
      });
      return;
    }
    
    if (!profileData.email.trim()) {
      toast({
        title: "البريد الإلكتروني مطلوب",
        description: "يرجى إدخال بريدك الإلكتروني",
        variant: "destructive"
      });
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      toast({
        title: "بريد إلكتروني غير صحيح",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // In a real app, this would call an API to update user profile
      // For now, just show success message
      
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم حفظ التغييرات بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء حفظ التغييرات",
        variant: "destructive"
      });
    }
  };

  // Handle password change
  const handlePasswordChange = () => {
    if (!passwordData.currentPassword) {
      toast({
        title: "كلمة المرور الحالية مطلوبة",
        description: "يرجى إدخال كلمة المرور الحالية",
        variant: "destructive"
      });
      return;
    }
    
    if (!passwordData.newPassword) {
      toast({
        title: "كلمة المرور الجديدة مطلوبة",
        description: "يرجى إدخال كلمة المرور الجديدة",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمة المرور الجديدة غير متطابقة",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast({
        title: "كلمة مرور ضعيفة",
        description: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would call an API
    toast({
      title: "تم تغيير كلمة المرور",
      description: "تم تحديث كلمة المرور بنجاح"
    });
    
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الإعدادات</h1>
          <p className="text-gray-600">إدارة حسابك وتفضيلاتك الشخصية</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              الملف الشخصي
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              الإشعارات
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              الأمان
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              التفضيلات
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  المعلومات الشخصية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      placeholder="أدخل اسمك الكامل"
                      data-testid="input-name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      placeholder="أدخل بريدك الإلكتروني"
                      data-testid="input-email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      placeholder="+967 735158003"
                      data-testid="input-phone"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">الشركة</Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      placeholder="اسم الشركة (اختياري)"
                      data-testid="input-company"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">نبذة تعريفية</Label>
                  <textarea
                    id="bio"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    placeholder="اكتب نبذة مختصرة عنك..."
                    data-testid="textarea-bio"
                  />
                </div>
                
                <Button 
                  onClick={handleProfileUpdate} 
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors" 
                  data-testid="button-save-profile"
                >
                  <Save className="w-4 h-4" />
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  إعدادات الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات البريد الإلكتروني</Label>
                      <p className="text-sm text-gray-500">تلقي الإشعارات عبر البريد الإلكتروني</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, emailNotifications: checked})
                      }
                      data-testid="switch-email-notifications"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>الإشعارات الفورية</Label>
                      <p className="text-sm text-gray-500">تلقي إشعارات فورية في المتصفح</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, pushNotifications: checked})
                      }
                      data-testid="switch-push-notifications"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>رسائل SMS</Label>
                      <p className="text-sm text-gray-500">تلقي رسائل نصية قصيرة</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, smsNotifications: checked})
                      }
                      data-testid="switch-sms-notifications"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تحديثات المشاريع</Label>
                      <p className="text-sm text-gray-500">إشعارات حول تقدم مشاريعك</p>
                    </div>
                    <Switch
                      checked={notificationSettings.projectUpdates}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, projectUpdates: checked})
                      }
                      data-testid="switch-project-updates"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تذكير بالدفعات</Label>
                      <p className="text-sm text-gray-500">تذكيرات بمواعيد الدفع</p>
                    </div>
                    <Switch
                      checked={notificationSettings.paymentReminders}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, paymentReminders: checked})
                      }
                      data-testid="switch-payment-reminders"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    toast({
                      title: "تم حفظ إعدادات الإشعارات",
                      description: "تم تحديث تفضيلات الإشعارات بنجاح"
                    });
                  }}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors" 
                  data-testid="button-save-notifications"
                >
                  <Save className="w-4 h-4" />
                  حفظ إعدادات الإشعارات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    تغيير كلمة المرور
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        placeholder="أدخل كلمة المرور الحالية"
                        data-testid="input-current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        placeholder="أدخل كلمة المرور الجديدة"
                        data-testid="input-new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">تأكيد كلمة المرور الجديدة</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        placeholder="أعد إدخال كلمة المرور الجديدة"
                        data-testid="input-confirm-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handlePasswordChange} 
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors" 
                    data-testid="button-change-password"
                  >
                    <Key className="w-4 h-4" />
                    تغيير كلمة المرور
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    إعدادات الأمان
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>المصادقة الثنائية</Label>
                      <p className="text-sm text-gray-500">طبقة حماية إضافية لحسابك</p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, twoFactorAuth: checked})
                      }
                      data-testid="switch-two-factor"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات تسجيل الدخول</Label>
                      <p className="text-sm text-gray-500">تلقي إشعار عند تسجيل دخول جديد</p>
                    </div>
                    <Switch
                      checked={securitySettings.loginNotifications}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, loginNotifications: checked})
                      }
                      data-testid="switch-login-notifications"
                    />
                  </div>
                  
                  <Button 
                    onClick={() => {
                      toast({
                        title: "تم حفظ إعدادات الأمان",
                        description: "تم تحديث إعدادات الأمان بنجاح"
                      });
                    }}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors" 
                    data-testid="button-save-security"
                  >
                    <Save className="w-4 h-4" />
                    حفظ إعدادات الأمان
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  التفضيلات العامة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>اللغة</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-testid="select-language">
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>المنطقة الزمنية</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-testid="select-timezone">
                      <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                      <option value="Asia/Dubai">دبي (GMT+4)</option>
                      <option value="Asia/Kuwait">الكويت (GMT+3)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>تنسيق التاريخ</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-testid="select-date-format">
                      <option value="dd/mm/yyyy">يوم/شهر/سنة</option>
                      <option value="mm/dd/yyyy">شهر/يوم/سنة</option>
                      <option value="yyyy-mm-dd">سنة-شهر-يوم</option>
                    </select>
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    toast({
                      title: "تم حفظ التفضيلات",
                      description: "تم تحديث التفضيلات العامة بنجاح"
                    });
                  }}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors" 
                  data-testid="button-save-preferences"
                >
                  <Save className="w-4 h-4" />
                  حفظ التفضيلات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}