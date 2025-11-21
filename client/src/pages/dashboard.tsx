import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedCard, AnimatedSection, AnimatedText } from "@/components/ui/animated-card";
import { InteractiveButton } from "@/components/ui/interactive-button";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  FileText, 
  Settings, 
  Calendar, 
  BarChart3, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Plus,
  Download,
  Eye,
  Edit
} from "lucide-react";
import { UserSubscription, ServiceRequest, Service } from "@shared/schema";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [location, setLocation] = useLocation();
  
  // استخدام سياق المصادقة للحصول على بيانات المستخدم الحقيقية
  const { user, isAuthenticated, loading } = useAuth();
  const userId = user?.id;

  // جميع الـ hooks يجب أن تكون في الأعلى قبل أي conditional returns
  const { data: subscriptions, isLoading: subsLoading } = useQuery<UserSubscription[]>({
    queryKey: ['/api/user-subscriptions', userId],
    enabled: !!userId && isAuthenticated, // تشغيل الاستعلام فقط عند المصادقة ووجود معرف المستخدم
  });

  const { data: serviceRequests, isLoading: requestsLoading } = useQuery<ServiceRequest[]>({
    queryKey: ['/api/service-requests', userId],
    enabled: !!userId && isAuthenticated, // تشغيل الاستعلام فقط عند المصادقة ووجود معرف المستخدم
  });

  const { data: services } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    enabled: isAuthenticated, // تشغيل الاستعلام فقط عند المصادقة
  });

  // التحقق من المصادقة - إعادة التوجيه للدخول إذا لم يكن مصادق عليه
  // استخدام useEffect لتجنب تحديث الحالة أثناء الرندر
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, loading, setLocation]);

  // عرض loading أثناء التحقق من المصادقة
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  // إذا لم يكن مصادق عليه، لا تعرض المحتوى
  if (!isAuthenticated) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      "active": { label: "نشط", className: "bg-green-500" },
      "pending": { label: "قيد المراجعة", className: "bg-yellow-500" },
      "in-progress": { label: "قيد التنفيذ", className: "bg-blue-500" },
      "completed": { label: "مكتمل", className: "bg-green-600" },
      "cancelled": { label: "ملغي", className: "bg-red-500" },
      "expired": { label: "منتهي", className: "bg-gray-500" },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, className: "bg-gray-500" };
    return <Badge className={`${statusInfo.className} text-white`}>{statusInfo.label}</Badge>;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent": return <AlertCircle className="text-red-500" size={16} />;
      case "high": return <AlertCircle className="text-orange-500" size={16} />;
      case "medium": return <Clock className="text-yellow-500" size={16} />;
      default: return <CheckCircle className="text-green-500" size={16} />;
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "غير محدد";
    return new Date(date).toLocaleDateString("ar-SA");
  };

  const formatPrice = (price: string | null) => {
    if (!price) return "غير محدد";
    return new Intl.NumberFormat("ar-SA").format(parseInt(price)) + " ر.س";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatedText>
            <h1 className="text-3xl lg:text-4xl font-bold text-secondary mb-2">
              مرحباً {user?.name || "المستخدم"}
            </h1>
            <p className="text-gray-600">
              إدارة اشتراكاتك وطلبات الخدمات من مكان واحد
            </p>
          </AnimatedText>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 size={16} />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <CreditCard size={16} />
              المعاملات
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <Calendar size={16} />
              الاشتراكات
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <FileText size={16} />
              الطلبات
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="gradient-primary text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-100">الاشتراكات النشطة</p>
                        <p className="text-3xl font-bold">
                          {subscriptions?.filter(s => s.status === "active").length || 0}
                        </p>
                      </div>
                      <CreditCard size={32} className="text-gray-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600">الطلبات الجارية</p>
                        <p className="text-3xl font-bold text-secondary">
                          {serviceRequests?.filter(r => r.status === "in-progress").length || 0}
                        </p>
                      </div>
                      <Clock size={32} className="text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600">المشاريع المكتملة</p>
                        <p className="text-3xl font-bold text-secondary">
                          {serviceRequests?.filter(r => r.status === "completed").length || 0}
                        </p>
                      </div>
                      <CheckCircle size={32} className="text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600">إجمالي الإنفاق</p>
                        <p className="text-3xl font-bold text-secondary">
                          {formatPrice(serviceRequests?.reduce((sum, req) => 
                            sum + (parseInt(req.actualCost || req.estimatedCost || "0")), 0).toString() || "0"
                          )}
                        </p>
                      </div>
                      <BarChart3 size={32} className="text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>

            {/* Recent Activity */}
            <AnimatedCard delay={0.2}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} />
                  النشاط الأخير
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceRequests?.slice(0, 5).map((request, index) => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getPriorityIcon(request.priority || "medium")}
                        <div>
                          <p className="font-semibold text-secondary">{request.title}</p>
                          <p className="text-sm text-gray-600">
                            {services?.find(s => s.id === request.serviceId)?.title || "خدمة غير محددة"}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        {getStatusBadge(request.status || "pending")}
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(request.updatedAt)}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-center text-gray-500 py-8">لا يوجد نشاط حديث</p>
                  )}
                </div>
              </CardContent>
            </AnimatedCard>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-secondary">المعاملات والمدفوعات</h2>
            </div>
            
            <div className="space-y-6">
              {/* Transactions Table */}
              <Card>
                <CardHeader>
                  <CardTitle>سجل المعاملات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Sample transaction data */}
                    {[
                      {
                        id: "txn-1",
                        serviceName: "تطوير تطبيق جوال",
                        amount: "50000",
                        currency: "YER",
                        paymentMethod: "credit_card",
                        status: "paid",
                        date: "2024-08-10",
                        subscriptionStart: "2024-08-10",
                        subscriptionEnd: "2024-11-10"
                      },
                      {
                        id: "txn-2",
                        serviceName: "تصميم موقع ويب",
                        amount: "25000",
                        currency: "YER",
                        paymentMethod: "jaib",
                        status: "pending",
                        date: "2024-08-14",
                        subscriptionStart: "2024-08-14",
                        subscriptionEnd: "2024-09-14"
                      }
                    ].map((transaction) => (
                      <div key={transaction.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{transaction.serviceName}</h3>
                            <p className="text-gray-600">#{transaction.id}</p>
                          </div>
                          <Badge className={transaction.status === "paid" ? "bg-green-500" : "bg-yellow-500"}>
                            {transaction.status === "paid" ? "مدفوع" : "قيد المراجعة"}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">المبلغ:</span>
                            <p className="font-semibold">{formatPrice(transaction.amount)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">طريقة الدفع:</span>
                            <p className="font-semibold">
                              {transaction.paymentMethod === "credit_card" ? "بطاقة ائتمانية" :
                               transaction.paymentMethod === "jaib" ? "محفظة جيب" :
                               transaction.paymentMethod === "cash" ? "كاش" :
                               transaction.paymentMethod}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">تاريخ الدفع:</span>
                            <p className="font-semibold">{formatDate(transaction.date)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">مدة الاشتراك:</span>
                            <p className="font-semibold">
                              {formatDate(transaction.subscriptionStart)} - {formatDate(transaction.subscriptionEnd)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            <Download size={14} className="ml-1" />
                            تحميل الفاتورة
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye size={14} className="ml-1" />
                            تفاصيل المعاملة
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Payment Summary */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-gray-600 mb-2">إجمالي المدفوعات</h3>
                    <p className="text-2xl font-bold text-primary">75,000 ر.ي</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-gray-600 mb-2">المدفوعات المعلقة</h3>
                    <p className="text-2xl font-bold text-yellow-600">25,000 ر.ي</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-gray-600 mb-2">الاشتراكات النشطة</h3>
                    <p className="text-2xl font-bold text-green-600">2</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-secondary">اشتراكاتي</h2>
              <InteractiveButton icon={<Plus size={16} />}>
                اشتراك جديد
              </InteractiveButton>
            </div>

            {subsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
              </div>
            ) : subscriptions && subscriptions.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.map((subscription, index) => (
                  <AnimatedCard key={subscription.id} delay={index * 0.1}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {services?.find(s => s.id === subscription.planId)?.title || "خدمة غير محددة"}
                        </CardTitle>
                        {getStatusBadge(subscription.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">تاريخ البداية:</span>
                          <span>{formatDate(subscription.startDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">تاريخ الانتهاء:</span>
                          <span>{formatDate(subscription.endDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">التجديد التلقائي:</span>
                          <span className={subscription.autoRenew === "true" ? "text-green-600" : "text-red-600"}>
                            {subscription.autoRenew === "true" ? "مفعل" : "معطل"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye size={14} className="ml-1" />
                          عرض
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit size={14} className="ml-1" />
                          تعديل
                        </Button>
                      </div>
                    </CardContent>
                  </AnimatedCard>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <CreditCard size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-secondary mb-2">لا توجد اشتراكات</h3>
                  <p className="text-gray-600 mb-4">ابدأ بالاشتراك في إحدى خدماتنا</p>
                  <InteractiveButton>استكشف الخدمات</InteractiveButton>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-secondary">طلبات الخدمات</h2>
              <InteractiveButton icon={<Plus size={16} />}>
                طلب جديد
              </InteractiveButton>
            </div>

            {requestsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : serviceRequests && serviceRequests.length > 0 ? (
              <div className="space-y-4">
                {serviceRequests.map((request, index) => (
                  <AnimatedCard key={request.id} delay={index * 0.05}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getPriorityIcon(request.priority || "medium")}
                            <h3 className="text-xl font-semibold text-secondary">{request.title}</h3>
                            {getStatusBadge(request.status || "pending")}
                          </div>
                          <p className="text-gray-600 mb-2">{request.description}</p>
                          <p className="text-sm text-gray-500">
                            الخدمة: {services?.find(s => s.id === request.serviceId)?.title || "غير محددة"}
                          </p>
                        </div>
                        <div className="text-left space-y-1">
                          <p className="text-sm text-gray-500">تاريخ الإنشاء</p>
                          <p className="font-semibold">{formatDate(request.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-500">التكلفة المقدرة</p>
                          <p className="font-semibold text-primary">{formatPrice(request.estimatedCost)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">تاريخ البداية</p>
                          <p className="font-semibold">{formatDate(request.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">تاريخ الانتهاء المتوقع</p>
                          <p className="font-semibold">{formatDate(request.endDate)}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Eye size={14} className="ml-1" />
                          عرض التفاصيل
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download size={14} className="ml-1" />
                          تحميل التقرير
                        </Button>
                        {request.status === "pending" && (
                          <Button variant="outline" size="sm">
                            <Edit size={14} className="ml-1" />
                            تعديل الطلب
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </AnimatedCard>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-secondary mb-2">لا توجد طلبات</h3>
                  <p className="text-gray-600 mb-4">ابدأ بطلب إحدى خدماتنا</p>
                  <InteractiveButton>طلب خدمة جديدة</InteractiveButton>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary">إعدادات الحساب</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatedCard>
                <CardHeader>
                  <CardTitle>معلومات الحساب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم المستخدم
                    </label>
                    <input 
                      type="text" 
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      defaultValue="أحمد محمد"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      البريد الإلكتروني
                    </label>
                    <input 
                      type="email" 
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      defaultValue="ahmed@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رقم الهاتف
                    </label>
                    <input 
                      type="tel" 
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      defaultValue="+967735158003"
                    />
                  </div>
                  <Button className="w-full">حفظ التغييرات</Button>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard delay={0.1}>
                <CardHeader>
                  <CardTitle>إعدادات الإشعارات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>إشعارات البريد الإلكتروني</span>
                    <Button variant="outline" size="sm">تفعيل</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>إشعارات الرسائل النصية</span>
                    <Button variant="outline" size="sm">تفعيل</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>إشعارات التجديد التلقائي</span>
                    <Button variant="outline" size="sm">تفعيل</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>تقارير دورية</span>
                    <Button variant="outline" size="sm">معطل</Button>
                  </div>
                </CardContent>
              </AnimatedCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}