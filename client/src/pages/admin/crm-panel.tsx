import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  LayoutDashboard,
  Users,
  UserPlus,
  Building2,
  DollarSign,
  FileText,
  Settings,
  Shield,
  Bell,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Activity,
  Target,
  Award,
  UserCheck,
  UserX,
  RefreshCw,
  Download,
  Upload,
  MoreVertical,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  Receipt,
  Package,
  HeadphonesIcon,
  MessageSquare,
  AlertTriangle,
  Star
} from "lucide-react";

type TabValue = "dashboard" | "users" | "clients" | "registrations" | "revenue" | "permissions" | "settings";
type UserRole = "admin" | "support" | "sales" | "client";

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  department?: string;
  position?: string;
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  type: string;
  status: string;
  totalSpent: number;
  registrations: number;
  createdAt: string;
}

interface Registration {
  id: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  amount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  revenueByService: { service: string; amount: number }[];
  revenueByMonth: { month: string; amount: number }[];
}

const roleLabels: Record<UserRole, string> = {
  admin: "مدير النظام",
  support: "دعم فني",
  sales: "مبيعات",
  client: "عميل"
};

const roleColors: Record<UserRole, string> = {
  admin: "bg-purple-500",
  support: "bg-blue-500",
  sales: "bg-green-500",
  client: "bg-gray-500"
};

const rolePermissions: Record<UserRole, string[]> = {
  admin: ["users.view", "users.create", "users.edit", "users.delete", "clients.view", "clients.create", "clients.edit", "clients.delete", "registrations.view", "registrations.edit", "revenue.view", "revenue.export", "permissions.view", "permissions.edit", "settings.view", "settings.edit"],
  support: ["clients.view", "registrations.view", "tickets.view", "tickets.respond"],
  sales: ["clients.view", "clients.create", "clients.edit", "registrations.view", "registrations.create", "revenue.view"],
  client: ["profile.view", "profile.edit", "registrations.view", "tickets.create"]
};

export default function CRMPanel() {
  const [activeTab, setActiveTab] = useState<TabValue>("dashboard");
  const [, setLocation] = useLocation();
  const { user, isAdmin, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Check authentication and role
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
    
    const allowedRoles = ['admin', 'support', 'sales'];
    if (user && !allowedRoles.includes(user.role)) {
      toast({
        title: "غير مصرح",
        description: "ليس لديك صلاحية للوصول إلى لوحة التحكم",
        variant: "destructive"
      });
      setLocation('/dashboard');
    }
  }, [isAuthenticated, user, setLocation, toast]);

  // Fetch users
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: isAuthenticated && (user?.role === 'admin' || user?.role === 'support' || user?.role === 'sales')
  });

  // Fetch clients
  const { data: clientsData, isLoading: clientsLoading, refetch: refetchClients } = useQuery({
    queryKey: ['/api/admin/clients'],
    enabled: isAuthenticated && (user?.role === 'admin' || user?.role === 'support' || user?.role === 'sales')
  });

  // Fetch registrations
  const { data: registrationsData, isLoading: registrationsLoading } = useQuery({
    queryKey: ['/api/admin/registrations'],
    enabled: isAuthenticated && (user?.role === 'admin' || user?.role === 'support' || user?.role === 'sales')
  });

  // Fetch revenue data
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['/api/admin/revenue'],
    enabled: isAuthenticated && (user?.role === 'admin' || user?.role === 'sales')
  });

  // Fetch dashboard stats
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/dashboard-stats'],
    enabled: isAuthenticated && (user?.role === 'admin' || user?.role === 'support' || user?.role === 'sales')
  });

  // Mock data for development
  const users: User[] = usersData?.users || [
    { id: "1", username: "admin@geniussoftwarecore.com", name: "مدير النظام", email: "admin@geniussoftwarecore.com", role: "admin", department: "الإدارة", position: "مدير عام", isActive: true, createdAt: "2024-01-01" },
    { id: "2", username: "sales@geniussoftwarecore.com", name: "أحمد محمد", email: "sales@geniussoftwarecore.com", phone: "+967777123456", role: "sales", department: "المبيعات", position: "مدير مبيعات", isActive: true, createdAt: "2024-02-15" },
    { id: "3", username: "support@geniussoftwarecore.com", name: "محمد علي", email: "support@geniussoftwarecore.com", phone: "+967777654321", role: "support", department: "الدعم الفني", position: "مهندس دعم", isActive: true, createdAt: "2024-03-10" },
    { id: "4", username: "client1@example.com", name: "شركة الأمل التجارية", email: "client1@example.com", phone: "+967771234567", role: "client", isActive: true, createdAt: "2024-06-01" },
    { id: "5", username: "client2@example.com", name: "مؤسسة النجاح", email: "client2@example.com", phone: "+967772345678", role: "client", isActive: true, createdAt: "2024-07-15" },
  ];

  const clients: Client[] = clientsData?.clients || [
    { id: "1", name: "شركة الأمل التجارية", email: "alamal@example.com", phone: "+967771234567", company: "شركة الأمل", type: "enterprise", status: "active", totalSpent: 5500000, registrations: 3, createdAt: "2024-06-01" },
    { id: "2", name: "مؤسسة النجاح", email: "alnajah@example.com", phone: "+967772345678", company: "مؤسسة النجاح", type: "business", status: "active", totalSpent: 2800000, registrations: 2, createdAt: "2024-07-15" },
    { id: "3", name: "شركة التطور", email: "tatawr@example.com", phone: "+967773456789", company: "شركة التطور", type: "startup", status: "pending", totalSpent: 850000, registrations: 1, createdAt: "2024-08-20" },
    { id: "4", name: "مجموعة الريادة", email: "alriyada@example.com", phone: "+967774567890", company: "مجموعة الريادة", type: "enterprise", status: "active", totalSpent: 12500000, registrations: 5, createdAt: "2024-04-10" },
  ];

  const registrations: Registration[] = registrationsData?.registrations || [
    { id: "1", clientId: "1", clientName: "شركة الأمل التجارية", serviceId: "web-dev", serviceName: "تطوير موقع ويب", amount: 2500000, status: "completed", paymentStatus: "paid", createdAt: "2024-06-15" },
    { id: "2", clientId: "1", clientName: "شركة الأمل التجارية", serviceId: "mobile-app", serviceName: "تطبيق موبايل", amount: 3000000, status: "in-progress", paymentStatus: "partial", createdAt: "2024-08-01" },
    { id: "3", clientId: "2", clientName: "مؤسسة النجاح", serviceId: "erp", serviceName: "نظام ERP", amount: 2800000, status: "completed", paymentStatus: "paid", createdAt: "2024-07-20" },
    { id: "4", clientId: "3", clientName: "شركة التطور", serviceId: "web-dev", serviceName: "تطوير موقع ويب", amount: 850000, status: "pending", paymentStatus: "unpaid", createdAt: "2024-09-01" },
    { id: "5", clientId: "4", clientName: "مجموعة الريادة", serviceId: "full-suite", serviceName: "حزمة متكاملة", amount: 12500000, status: "in-progress", paymentStatus: "partial", createdAt: "2024-05-10" },
  ];

  const revenue: RevenueData = revenueData || {
    totalRevenue: 21650000,
    monthlyRevenue: 4500000,
    pendingPayments: 6350000,
    completedPayments: 15300000,
    revenueByService: [
      { service: "تطوير الويب", amount: 8500000 },
      { service: "تطبيقات الموبايل", amount: 6000000 },
      { service: "نظام ERP", amount: 4500000 },
      { service: "التصميم الجرافيكي", amount: 2650000 },
    ],
    revenueByMonth: [
      { month: "يناير", amount: 1200000 },
      { month: "فبراير", amount: 1800000 },
      { month: "مارس", amount: 2100000 },
      { month: "أبريل", amount: 2500000 },
      { month: "مايو", amount: 3200000 },
      { month: "يونيو", amount: 2800000 },
      { month: "يوليو", amount: 3500000 },
      { month: "أغسطس", amount: 4550000 },
    ]
  };

  const stats = dashboardStats || {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'active').length,
    totalRegistrations: registrations.length,
    pendingRegistrations: registrations.filter(r => r.status === 'pending').length,
    totalRevenue: revenue.totalRevenue,
    monthlyGrowth: 15.8
  };

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesStatus = filterStatus === "all" || (filterStatus === "active" ? u.isActive : !u.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Filter clients
  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-YE', { 
      style: 'decimal',
      minimumFractionDigits: 0 
    }).format(amount) + ' ر.ي';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      active: { label: "نشط", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      pending: { label: "معلق", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      inactive: { label: "غير نشط", className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" },
      completed: { label: "مكتمل", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      "in-progress": { label: "قيد التنفيذ", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
      paid: { label: "مدفوع", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      partial: { label: "جزئي", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
      unpaid: { label: "غير مدفوع", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
    };
    const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-800" };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const userPermissions = rolePermissions[user.role as UserRole] || [];
    return userPermissions.includes(permission);
  };

  // Check if user has access
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Skeleton className="h-12 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">لوحة تحكم CRM</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Genius Software Core</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name?.[0] || user.username?.[0]}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name || user.username}</p>
                  <Badge className={`${roleColors[user.role as UserRole]} text-white text-xs`}>
                    {roleLabels[user.role as UserRole]}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="space-y-8">
          {/* Navigation Tabs */}
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 h-auto bg-transparent">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              data-testid="tab-dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">لوحة القيادة</span>
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              data-testid="tab-users"
              disabled={!hasPermission('users.view')}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">المستخدمين</span>
            </TabsTrigger>
            <TabsTrigger 
              value="clients" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              data-testid="tab-clients"
              disabled={!hasPermission('clients.view')}
            >
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">العملاء</span>
            </TabsTrigger>
            <TabsTrigger 
              value="registrations" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              data-testid="tab-registrations"
              disabled={!hasPermission('registrations.view')}
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">التسجيلات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="revenue" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              data-testid="tab-revenue"
              disabled={!hasPermission('revenue.view')}
            >
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">الإيرادات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="permissions" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              data-testid="tab-permissions"
              disabled={!hasPermission('permissions.view')}
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">الصلاحيات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              data-testid="tab-settings"
              disabled={!hasPermission('settings.view')}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">الإعدادات</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">إجمالي المستخدمين</p>
                      <p className="text-3xl font-bold mt-1">{stats.totalUsers}</p>
                      <p className="text-blue-200 text-xs mt-1">{stats.activeUsers} نشط</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">إجمالي العملاء</p>
                      <p className="text-3xl font-bold mt-1">{stats.totalClients}</p>
                      <p className="text-green-200 text-xs mt-1">{stats.activeClients} نشط</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Building2 className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">التسجيلات</p>
                      <p className="text-3xl font-bold mt-1">{stats.totalRegistrations}</p>
                      <p className="text-purple-200 text-xs mt-1">{stats.pendingRegistrations} معلق</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <FileText className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100 text-sm">الإيرادات الكلية</p>
                      <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</p>
                      <div className="flex items-center gap-1 text-amber-200 text-xs mt-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>+{stats.monthlyGrowth}% هذا الشهر</span>
                      </div>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    إجراءات سريعة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hasPermission('users.create') && (
                    <Button 
                      className="w-full justify-start gap-3" 
                      variant="outline"
                      onClick={() => setIsAddUserOpen(true)}
                      data-testid="button-add-user"
                    >
                      <UserPlus className="h-4 w-4" />
                      إضافة مستخدم جديد
                    </Button>
                  )}
                  {hasPermission('clients.create') && (
                    <Button 
                      className="w-full justify-start gap-3" 
                      variant="outline"
                      onClick={() => setIsAddClientOpen(true)}
                      data-testid="button-add-client"
                    >
                      <Building2 className="h-4 w-4" />
                      إضافة عميل جديد
                    </Button>
                  )}
                  {hasPermission('revenue.export') && (
                    <Button className="w-full justify-start gap-3" variant="outline" data-testid="button-export-report">
                      <Download className="h-4 w-4" />
                      تصدير تقرير
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Recent Registrations */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    آخر التسجيلات
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('registrations')}>
                    عرض الكل
                    <ChevronRight className="h-4 w-4 mr-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[280px]">
                    <div className="space-y-4">
                      {registrations.slice(0, 5).map((reg) => (
                        <div key={reg.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{reg.serviceName}</p>
                              <p className="text-sm text-gray-500">{reg.clientName}</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(reg.amount)}</p>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(reg.status)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  تحليل الإيرادات الشهرية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-around gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {revenue.revenueByMonth.map((item, index) => {
                    const maxRevenue = Math.max(...revenue.revenueByMonth.map(r => r.amount));
                    const height = (item.amount / maxRevenue) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center gap-2 flex-1">
                        <div 
                          className="w-full bg-gradient-to-t from-primary to-blue-400 rounded-t-lg transition-all duration-500"
                          style={{ height: `${height}%`, minHeight: '20px' }}
                        />
                        <span className="text-xs text-gray-500">{item.month}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة المستخدمين</h2>
                <p className="text-gray-500">إدارة حسابات المستخدمين والصلاحيات</p>
              </div>
              {hasPermission('users.create') && (
                <Button onClick={() => setIsAddUserOpen(true)} data-testid="button-add-new-user">
                  <UserPlus className="h-4 w-4 ml-2" />
                  إضافة مستخدم
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="البحث عن مستخدم..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                  data-testid="input-search-user"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[180px]" data-testid="select-filter-role">
                  <SelectValue placeholder="الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأدوار</SelectItem>
                  <SelectItem value="admin">مدير</SelectItem>
                  <SelectItem value="support">دعم فني</SelectItem>
                  <SelectItem value="sales">مبيعات</SelectItem>
                  <SelectItem value="client">عميل</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]" data-testid="select-filter-status">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b">
                      <tr>
                        <th className="text-right p-4 font-medium text-gray-500">المستخدم</th>
                        <th className="text-right p-4 font-medium text-gray-500">الدور</th>
                        <th className="text-right p-4 font-medium text-gray-500">القسم</th>
                        <th className="text-right p-4 font-medium text-gray-500">الحالة</th>
                        <th className="text-right p-4 font-medium text-gray-500">تاريخ الإنشاء</th>
                        <th className="text-right p-4 font-medium text-gray-500">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800" data-testid={`row-user-${u.id}`}>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={u.avatar} />
                                <AvatarFallback>{u.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                                <p className="text-sm text-gray-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={`${roleColors[u.role]} text-white`}>
                              {roleLabels[u.role]}
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">{u.department || '-'}</td>
                          <td className="p-4">
                            {u.isActive ? (
                              <Badge className="bg-green-100 text-green-800">نشط</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">غير نشط</Badge>
                            )}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">{formatDate(u.createdAt)}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" data-testid={`button-view-user-${u.id}`}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {hasPermission('users.edit') && (
                                <Button variant="ghost" size="icon" data-testid={`button-edit-user-${u.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              {hasPermission('users.delete') && u.role !== 'admin' && (
                                <Button variant="ghost" size="icon" className="text-red-500" data-testid={`button-delete-user-${u.id}`}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
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

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة العملاء</h2>
                <p className="text-gray-500">عرض وإدارة بيانات العملاء</p>
              </div>
              {hasPermission('clients.create') && (
                <Button onClick={() => setIsAddClientOpen(true)} data-testid="button-add-new-client">
                  <Building2 className="h-4 w-4 ml-2" />
                  إضافة عميل
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="البحث عن عميل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                  data-testid="input-search-client"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]" data-testid="select-filter-client-status">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="pending">معلق</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <Card key={client.id} className="hover:shadow-lg transition-shadow" data-testid={`card-client-${client.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {client.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{client.name}</h3>
                          <p className="text-sm text-gray-500">{client.company}</p>
                        </div>
                      </div>
                      {getStatusBadge(client.status)}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Mail className="h-4 w-4" />
                        {client.email}
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Phone className="h-4 w-4" />
                          {client.phone}
                        </div>
                      )}
                    </div>

                    <Separator className="my-4" />

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">{client.registrations}</p>
                        <p className="text-xs text-gray-500">تسجيلات</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(client.totalSpent)}</p>
                        <p className="text-xs text-gray-500">إجمالي الإنفاق</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1" data-testid={`button-view-client-${client.id}`}>
                        <Eye className="h-4 w-4 ml-1" />
                        عرض
                      </Button>
                      {hasPermission('clients.edit') && (
                        <Button variant="outline" size="sm" className="flex-1" data-testid={`button-edit-client-${client.id}`}>
                          <Edit className="h-4 w-4 ml-1" />
                          تعديل
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Registrations Tab */}
          <TabsContent value="registrations" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">تسجيلات الخدمات</h2>
                <p className="text-gray-500">متابعة تسجيلات العملاء في الخدمات</p>
              </div>
              <Button variant="outline" data-testid="button-export-registrations">
                <Download className="h-4 w-4 ml-2" />
                تصدير
              </Button>
            </div>

            {/* Registrations Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">إجمالي التسجيلات</p>
                    <p className="text-2xl font-bold">{registrations.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">قيد التنفيذ</p>
                    <p className="text-2xl font-bold">{registrations.filter(r => r.status === 'in-progress').length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">مكتملة</p>
                    <p className="text-2xl font-bold">{registrations.filter(r => r.status === 'completed').length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">غير مدفوعة</p>
                    <p className="text-2xl font-bold">{registrations.filter(r => r.paymentStatus === 'unpaid').length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registrations Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b">
                      <tr>
                        <th className="text-right p-4 font-medium text-gray-500">الخدمة</th>
                        <th className="text-right p-4 font-medium text-gray-500">العميل</th>
                        <th className="text-right p-4 font-medium text-gray-500">المبلغ</th>
                        <th className="text-right p-4 font-medium text-gray-500">حالة المشروع</th>
                        <th className="text-right p-4 font-medium text-gray-500">حالة الدفع</th>
                        <th className="text-right p-4 font-medium text-gray-500">التاريخ</th>
                        <th className="text-right p-4 font-medium text-gray-500">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {registrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-gray-800" data-testid={`row-registration-${reg.id}`}>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Package className="h-5 w-5 text-primary" />
                              </div>
                              <p className="font-medium text-gray-900 dark:text-white">{reg.serviceName}</p>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">{reg.clientName}</td>
                          <td className="p-4 font-semibold text-gray-900 dark:text-white">{formatCurrency(reg.amount)}</td>
                          <td className="p-4">{getStatusBadge(reg.status)}</td>
                          <td className="p-4">{getStatusBadge(reg.paymentStatus)}</td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">{formatDate(reg.createdAt)}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" data-testid={`button-view-registration-${reg.id}`}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {hasPermission('registrations.edit') && (
                                <Button variant="ghost" size="icon" data-testid={`button-edit-registration-${reg.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
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

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">تقارير الإيرادات</h2>
                <p className="text-gray-500">تحليل الإيرادات والمدفوعات</p>
              </div>
              {hasPermission('revenue.export') && (
                <div className="flex gap-2">
                  <Button variant="outline" data-testid="button-export-revenue">
                    <Download className="h-4 w-4 ml-2" />
                    تصدير التقرير
                  </Button>
                </div>
              )}
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">الإيرادات الكلية</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {formatCurrency(revenue.totalRevenue)}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Wallet className="h-6 w-6 text-green-600 dark:text-green-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">إيرادات الشهر</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {formatCurrency(revenue.monthlyRevenue)}
                      </p>
                      <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>+15.8%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">المدفوعات المكتملة</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {formatCurrency(revenue.completedPayments)}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">المدفوعات المعلقة</p>
                      <p className="text-2xl font-bold text-orange-600 mt-1">
                        {formatCurrency(revenue.pendingPayments)}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <Clock className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue by Service */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    الإيرادات حسب الخدمة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenue.revenueByService.map((item, index) => {
                      const percentage = (item.amount / revenue.totalRevenue) * 100;
                      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500'];
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.service}</span>
                            <span className="text-sm text-gray-500">{formatCurrency(item.amount)}</span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500">{percentage.toFixed(1)}% من الإجمالي</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    الإيرادات الشهرية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-around gap-2">
                    {revenue.revenueByMonth.map((item, index) => {
                      const maxRevenue = Math.max(...revenue.revenueByMonth.map(r => r.amount));
                      const height = (item.amount / maxRevenue) * 100;
                      return (
                        <div key={index} className="flex flex-col items-center gap-2 flex-1">
                          <span className="text-xs text-gray-500">{formatCurrency(item.amount)}</span>
                          <div 
                            className="w-full bg-gradient-to-t from-primary to-blue-400 rounded-t-lg transition-all duration-500 hover:opacity-80"
                            style={{ height: `${height}%`, minHeight: '20px' }}
                          />
                          <span className="text-xs text-gray-500">{item.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة الصلاحيات</h2>
              <p className="text-gray-500">تحديد صلاحيات كل دور في النظام</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Object.keys(rolePermissions) as UserRole[]).map((role) => (
                <Card key={role}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge className={`${roleColors[role]} text-white`}>{roleLabels[role]}</Badge>
                    </CardTitle>
                    <CardDescription>
                      الصلاحيات المتاحة لهذا الدور
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {rolePermissions[role].map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إعدادات النظام</h2>
              <p className="text-gray-500">تخصيص إعدادات لوحة التحكم</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الإشعارات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>إشعارات التسجيلات الجديدة</span>
                    <Button variant="outline" size="sm">مفعل</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>إشعارات المدفوعات</span>
                    <Button variant="outline" size="sm">مفعل</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>التقارير اليومية</span>
                    <Button variant="outline" size="sm">معطل</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>إعدادات النظام</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>وضع الصيانة</span>
                    <Button variant="outline" size="sm">معطل</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>النسخ الاحتياطي التلقائي</span>
                    <Button variant="outline" size="sm">مفعل</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>تسجيل النشاطات</span>
                    <Button variant="outline" size="sm">مفعل</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة مستخدم جديد</DialogTitle>
            <DialogDescription>
              أدخل بيانات المستخدم الجديد
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" placeholder="أدخل الاسم" data-testid="input-new-user-name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="example@domain.com" data-testid="input-new-user-email" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input id="phone" placeholder="+967..." data-testid="input-new-user-phone" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">الدور</Label>
              <Select>
                <SelectTrigger data-testid="select-new-user-role">
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">مدير النظام</SelectItem>
                  <SelectItem value="support">دعم فني</SelectItem>
                  <SelectItem value="sales">مبيعات</SelectItem>
                  <SelectItem value="client">عميل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">القسم</Label>
              <Input id="department" placeholder="القسم" data-testid="input-new-user-department" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>إلغاء</Button>
            <Button data-testid="button-save-new-user">حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Client Dialog */}
      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة عميل جديد</DialogTitle>
            <DialogDescription>
              أدخل بيانات العميل الجديد
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="clientName">اسم العميل / الشركة</Label>
              <Input id="clientName" placeholder="أدخل الاسم" data-testid="input-new-client-name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientEmail">البريد الإلكتروني</Label>
              <Input id="clientEmail" type="email" placeholder="example@domain.com" data-testid="input-new-client-email" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientPhone">رقم الهاتف</Label>
              <Input id="clientPhone" placeholder="+967..." data-testid="input-new-client-phone" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientType">نوع العميل</Label>
              <Select>
                <SelectTrigger data-testid="select-new-client-type">
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enterprise">مؤسسة كبيرة</SelectItem>
                  <SelectItem value="business">شركة</SelectItem>
                  <SelectItem value="startup">شركة ناشئة</SelectItem>
                  <SelectItem value="individual">فرد</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>إلغاء</Button>
            <Button data-testid="button-save-new-client">حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
