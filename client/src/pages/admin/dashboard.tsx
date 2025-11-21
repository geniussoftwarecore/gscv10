import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedCard, AnimatedSection, AnimatedText } from "@/components/ui/animated-card";
import { InteractiveButton } from "@/components/ui/interactive-button";
import { 
  Settings,
  Bell,
  Users, 
  BarChart3, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Calendar,
  TrendingUp,
  UserCheck,
  RefreshCw
} from "lucide-react";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { 
  getAllRequests, 
  getRequestStats, 
  updateRequestStatus, 
  getRequestsByStatus,
  ClientRequestWithService 
} from "@/data/clientRequests";

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState("overview");
  const [, setLocation] = useLocation();
  const { user, isAdmin } = useAuth();
  const { notifications, getNotificationsForUser, markAsRead } = useNotifications();
  
  const [requests, setRequests] = useState<ClientRequestWithService[]>([]);
  const [requestStats, setRequestStats] = useState({ total: 0, new: 0, inProgress: 0, answered: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    // Load admin data
    const allRequests = getAllRequests();
    setRequests(allRequests);
    setRequestStats(getRequestStats());
  }, []);

  // Filter requests based on search and status
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (requestId: string, newStatus: "new" | "in-progress" | "answered") => {
    const updatedRequest = updateRequestStatus(requestId, newStatus);
    if (updatedRequest) {
      setRequests(prev => 
        prev.map(req => req.id === requestId ? updatedRequest : req)
      );
      setRequestStats(getRequestStats());
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      "new": { label: "جديد", className: "bg-blue-500" },
      "in-progress": { label: "قيد المعالجة", className: "bg-yellow-500" },
      "answered": { label: "تم الرد", className: "bg-green-500" },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, className: "bg-gray-500" };
    return <Badge className={`${statusInfo.className} text-white`}>{statusInfo.label}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "request": return <FileText className="text-blue-500" size={16} />;
      case "suggestion": return <MessageSquare className="text-green-500" size={16} />;
      case "comment": return <MessageSquare className="text-gray-500" size={16} />;
      default: return <FileText className="text-blue-500" size={16} />;
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "غير محدد";
    return new Date(date).toLocaleDateString("ar-SA");
  };

  const adminNotifications = getNotificationsForUser(user?.id || "");

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnimatedText>
              <h1 className="text-3xl lg:text-4xl font-bold text-secondary mb-2">
                لوحة التحكم الإدارية
              </h1>
              <p className="text-gray-600">
                إدارة طلبات العملاء والإشعارات وإحصائيات النظام
              </p>
            </AnimatedText>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 size={16} />
                نظرة عامة
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex items-center gap-2">
                <FileText size={16} />
                طلبات العملاء
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell size={16} />
                الإشعارات
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
                          <p className="text-gray-100">إجمالي الطلبات</p>
                          <p className="text-3xl font-bold">{requestStats.total}</p>
                        </div>
                        <FileText size={32} className="text-gray-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600">طلبات جديدة</p>
                          <p className="text-3xl font-bold text-blue-600">{requestStats.new}</p>
                        </div>
                        <AlertCircle size={32} className="text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600">قيد المعالجة</p>
                          <p className="text-3xl font-bold text-yellow-600">{requestStats.inProgress}</p>
                        </div>
                        <Clock size={32} className="text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600">تم الرد عليها</p>
                          <p className="text-3xl font-bold text-green-600">{requestStats.answered}</p>
                        </div>
                        <CheckCircle size={32} className="text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AnimatedSection>

              {/* Recent Requests */}
              <AnimatedCard delay={0.2}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar size={20} />
                    الطلبات الأخيرة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requests.slice(0, 5).map((request, index) => (
                      <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(request.type)}
                          <div>
                            <p className="font-semibold text-secondary">{request.title}</p>
                            <p className="text-sm text-gray-600">{request.description.substring(0, 100)}...</p>
                          </div>
                        </div>
                        <div className="text-left">
                          {getStatusBadge(request.status || "new")}
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </AnimatedCard>
            </TabsContent>

            {/* Requests Tab */}
            <TabsContent value="requests" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-secondary">إدارة الطلبات</h2>
                <InteractiveButton icon={<RefreshCw size={16} />} onClick={() => {
                  setRequests(getAllRequests());
                  setRequestStats(getRequestStats());
                }}>
                  تحديث
                </InteractiveButton>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="البحث في الطلبات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="new">جديد</option>
                    <option value="in-progress">قيد المعالجة</option>
                    <option value="answered">تم الرد</option>
                  </select>
                </div>
              </div>

              {/* Requests List */}
              <div className="space-y-4">
                {filteredRequests.map((request, index) => (
                  <AnimatedCard key={request.id} delay={index * 0.05}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getTypeIcon(request.type)}
                            <h3 className="text-xl font-semibold text-secondary">{request.title}</h3>
                            {getStatusBadge(request.status || "new")}
                          </div>
                          <p className="text-gray-600 mb-2">{request.description}</p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>النوع: {request.type === "request" ? "طلب" : request.type === "suggestion" ? "اقتراح" : "تعليق"}</span>
                            {request.budget && <span>الميزانية: {request.budget} ر.ي</span>}
                            {request.timeline && <span>المدة: {request.timeline}</span>}
                          </div>
                        </div>
                        <div className="text-left space-y-1">
                          <p className="text-sm text-gray-500">تاريخ الإنشاء</p>
                          <p className="font-semibold">{formatDate(request.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(request.id, "in-progress")}
                          disabled={request.status === "in-progress"}
                        >
                          <Clock size={14} className="ml-1" />
                          قيد المعالجة
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(request.id, "answered")}
                          disabled={request.status === "answered"}
                        >
                          <CheckCircle size={14} className="ml-1" />
                          تم الرد
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye size={14} className="ml-1" />
                          عرض التفاصيل
                        </Button>
                      </div>
                    </CardContent>
                  </AnimatedCard>
                ))}
              </div>

              {filteredRequests.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-secondary mb-2">لا توجد طلبات</h3>
                    <p className="text-gray-600">لا توجد طلبات تطابق المعايير المحددة</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-secondary">الإشعارات الإدارية</h2>
                <InteractiveButton icon={<UserCheck size={16} />}>
                  تمييز الكل كمقروء
                </InteractiveButton>
              </div>

              <div className="space-y-4">
                {adminNotifications.map((notification, index) => (
                  <AnimatedCard key={notification.id} delay={index * 0.05}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Bell size={16} className={notification.read === "false" ? "text-blue-500" : "text-gray-400"} />
                            <h3 className="text-lg font-semibold text-secondary">{notification.title}</h3>
                            {notification.read === "false" && (
                              <Badge className="bg-blue-500 text-white">جديد</Badge>
                            )}
                          </div>
                          <p className="text-gray-600">{notification.message}</p>
                        </div>
                        <div className="text-left space-y-2">
                          <p className="text-sm text-gray-500">
                            {formatDate(notification.createdAt)}
                          </p>
                          {notification.read === "false" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              تمييز كمقروء
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </AnimatedCard>
                ))}
              </div>

              {adminNotifications.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <Bell size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-secondary mb-2">لا توجد إشعارات</h3>
                    <p className="text-gray-600">لا توجد إشعارات إدارية حاليًا</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-2xl font-bold text-secondary">إعدادات النظام</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <AnimatedCard>
                  <CardHeader>
                    <CardTitle>إعدادات الإشعارات</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>إشعارات الطلبات الجديدة</span>
                      <Button variant="outline" size="sm">مفعل</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>إشعارات الدفع</span>
                      <Button variant="outline" size="sm">مفعل</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>التقارير اليومية</span>
                      <Button variant="outline" size="sm">معطل</Button>
                    </div>
                  </CardContent>
                </AnimatedCard>

                <AnimatedCard delay={0.1}>
                  <CardHeader>
                    <CardTitle>إعدادات النظام</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>قبول الطلبات الجديدة</span>
                      <Button variant="outline" size="sm">مفعل</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>وضع الصيانة</span>
                      <Button variant="outline" size="sm">معطل</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>نسخ احتياطية تلقائية</span>
                      <Button variant="outline" size="sm">مفعل</Button>
                    </div>
                  </CardContent>
                </AnimatedCard>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminRoute>
  );
}

export default function AdminDashboard() {
  return <AdminDashboardContent />;
}