import { useState } from "react";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedCard, AnimatedText } from "@/components/ui/animated-card";
import { InteractiveButton } from "@/components/ui/interactive-button";
import { 
  Users, 
  FolderOpen, 
  CreditCard, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  TrendingUp,
  FileText
} from "lucide-react";

function AdminPanelContent() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for admin panel
  const stats = {
    totalUsers: 156,
    activeProjects: 23,
    monthlyRevenue: 89500,
    pendingTickets: 8
  };

  const recentProjects = [
    { id: 1, title: "تطبيق التجارة الإلكترونية", client: "شركة الرواد", status: "in-progress", progress: 75 },
    { id: 2, title: "موقع الشركة المؤسسية", client: "مجموعة الإبداع", status: "review", progress: 90 },
    { id: 3, title: "نظام إدارة المخزون", client: "التقنية المتطورة", status: "planning", progress: 25 }
  ];

  const recentUsers = [
    { id: 1, name: "أحمد محمد", email: "ahmed@example.com", joinDate: "2024-01-15", projects: 3 },
    { id: 2, name: "سارة أحمد", email: "sara@example.com", joinDate: "2024-01-12", projects: 2 },
    { id: 3, name: "محمد علي", email: "mohammed@example.com", joinDate: "2024-01-10", projects: 1 }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      "in-progress": { label: "قيد التنفيذ", className: "bg-blue-500" },
      "review": { label: "قيد المراجعة", className: "bg-yellow-500" },
      "planning": { label: "قيد التخطيط", className: "bg-gray-500" },
      "completed": { label: "مكتمل", className: "bg-green-500" }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return <Badge className={`${statusInfo.className} text-white`}>{statusInfo.label}</Badge>;
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("ar-SA").format(amount) + " ر.س";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatedText>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-gsc rounded-full flex items-center justify-center">
                  <Settings className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-secondary">لوحة الإدارة</h1>
                  <p className="text-gray-600">إدارة شاملة لمنصة GSC</p>
                </div>
              </div>
              <div className="flex gap-3">
                <InteractiveButton className="bg-primary text-white">
                  <Plus size={16} className="ml-1" />
                  إضافة جديد
                </InteractiveButton>
              </div>
            </div>
          </AnimatedText>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 size={16} />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              العملاء
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen size={16} />
              المشاريع
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <CreditCard size={16} />
              الفواتير
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <MessageSquare size={16} />
              التذاكر
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText size={16} />
              المحتوى
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatedCard>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">إجمالي العملاء</p>
                      <p className="text-3xl font-bold text-secondary">{stats.totalUsers}</p>
                      <p className="text-sm text-green-600">+12% من الشهر الماضي</p>
                    </div>
                    <Users size={32} className="text-blue-500" />
                  </div>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard delay={0.1}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">المشاريع النشطة</p>
                      <p className="text-3xl font-bold text-secondary">{stats.activeProjects}</p>
                      <p className="text-sm text-blue-600">+5 مشاريع جديدة</p>
                    </div>
                    <FolderOpen size={32} className="text-green-500" />
                  </div>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard delay={0.2}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">الإيرادات الشهرية</p>
                      <p className="text-3xl font-bold text-secondary">{formatPrice(stats.monthlyRevenue)}</p>
                      <p className="text-sm text-green-600">+18% من الشهر الماضي</p>
                    </div>
                    <DollarSign size={32} className="text-purple-500" />
                  </div>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard delay={0.3}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">التذاكر المعلقة</p>
                      <p className="text-3xl font-bold text-secondary">{stats.pendingTickets}</p>
                      <p className="text-sm text-yellow-600">يحتاج للمتابعة</p>
                    </div>
                    <MessageSquare size={32} className="text-orange-500" />
                  </div>
                </CardContent>
              </AnimatedCard>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <AnimatedCard delay={0.4}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen size={20} />
                    المشاريع الحديثة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentProjects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-secondary">{project.title}</h4>
                          <p className="text-sm text-gray-600">{project.client}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{width: `${project.progress}%`}}
                            ></div>
                          </div>
                        </div>
                        <div className="text-left mr-4">
                          {getStatusBadge(project.status)}
                          <p className="text-sm text-gray-500 mt-1">{project.progress}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard delay={0.5}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={20} />
                    العملاء الجدد
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">{user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-secondary">{user.name}</h4>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium">{user.projects} مشاريع</p>
                          <p className="text-xs text-gray-500">{user.joinDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </AnimatedCard>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-secondary">إدارة العملاء</h2>
              <InteractiveButton icon={<Plus size={16} />}>
                إضافة عميل جديد
              </InteractiveButton>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3">العميل</th>
                        <th className="text-right py-3">البريد الإلكتروني</th>
                        <th className="text-right py-3">تاريخ التسجيل</th>
                        <th className="text-right py-3">المشاريع</th>
                        <th className="text-right py-3">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">{user.name.charAt(0)}</span>
                              </div>
                              {user.name}
                            </div>
                          </td>
                          <td className="py-4">{user.email}</td>
                          <td className="py-4">{user.joinDate}</td>
                          <td className="py-4">{user.projects}</td>
                          <td className="py-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye size={14} />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit size={14} />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600">
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
          <TabsContent value="projects" className="space-y-6">
            <div className="text-center py-12">
              <FolderOpen size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-secondary mb-2">إدارة المشاريع</h3>
              <p className="text-gray-600">قريباً - إدارة شاملة للمشاريع ومراحل التطوير</p>
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <div className="text-center py-12">
              <CreditCard size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-secondary mb-2">إدارة الفواتير</h3>
              <p className="text-gray-600">قريباً - إنشاء ومتابعة الفواتير والمدفوعات</p>
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <div className="text-center py-12">
              <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-secondary mb-2">إدارة التذاكر</h3>
              <p className="text-gray-600">قريباً - نظام متكامل لإدارة طلبات الدعم الفني</p>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-secondary mb-2">إدارة المحتوى</h3>
              <p className="text-gray-600">قريباً - إدارة المقالات والخدمات ومحتوى الموقع</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <AdminRoute>
      <AdminPanelContent />
    </AdminRoute>
  );
}