import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/i18n/lang";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  ShoppingBag,
  Ticket,
  LogOut,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  LayoutDashboard,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getAuthHeader() {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchWithAuth(url: string) {
  const res = await fetch(url, { headers: getAuthHeader() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function formatDate(dateStr?: string | Date | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Status badge helpers
// ─────────────────────────────────────────────────────────────────────────────

const ORDER_STATUS_MAP: Record<string, { label: string; labelAr: string; color: string; icon: any }> = {
  pending:     { label: "Pending",     labelAr: "قيد الانتظار", color: "bg-amber-100 text-amber-800 border-amber-200",    icon: Clock },
  in_progress: { label: "In Progress", labelAr: "قيد التنفيذ",  color: "bg-blue-100 text-blue-800 border-blue-200",       icon: Loader2 },
  completed:   { label: "Completed",   labelAr: "مكتمل",        color: "bg-green-100 text-green-800 border-green-200",    icon: CheckCircle2 },
  cancelled:   { label: "Cancelled",   labelAr: "ملغى",         color: "bg-red-100 text-red-800 border-red-200",          icon: XCircle },
  approved:    { label: "Approved",    labelAr: "معتمد",        color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle2 },
  rejected:    { label: "Rejected",    labelAr: "مرفوض",        color: "bg-red-100 text-red-800 border-red-200",          icon: XCircle },
};

const TICKET_STATUS_MAP: Record<string, { label: string; labelAr: string; color: string; icon: any }> = {
  open:     { label: "Open",     labelAr: "مفتوح",    color: "bg-blue-100 text-blue-800 border-blue-200",   icon: AlertCircle },
  pending:  { label: "Pending",  labelAr: "معلّق",    color: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
  resolved: { label: "Resolved", labelAr: "محلول",    color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2 },
  closed:   { label: "Closed",   labelAr: "مغلق",     color: "bg-gray-100 text-gray-800 border-gray-200",   icon: XCircle },
};

const PRIORITY_MAP: Record<string, { label: string; labelAr: string; color: string }> = {
  high:   { label: "High",   labelAr: "عالية",   color: "bg-red-100 text-red-700 border-red-200" },
  medium: { label: "Medium", labelAr: "متوسطة",  color: "bg-amber-100 text-amber-700 border-amber-200" },
  low:    { label: "Low",    labelAr: "منخفضة",  color: "bg-green-100 text-green-700 border-green-200" },
};

function StatusBadge({ status, map, dir }: { status: string; map: Record<string, any>; dir: string }) {
  const info = map[status] || { labelAr: status, label: status, color: "bg-gray-100 text-gray-700 border-gray-200", icon: null };
  const Icon = info.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border", info.color)}>
      {Icon && <Icon className="w-3 h-3" />}
      {dir === "rtl" ? info.labelAr : info.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-sections
// ─────────────────────────────────────────────────────────────────────────────

function ProfileSection({ user, dir }: { user: any; dir: string }) {
  const getInitials = (name: string) =>
    name?.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase() || "U";

  return (
    <div className="space-y-6">
      {/* Avatar + name */}
      <div className="flex items-center gap-5">
        <Avatar className="h-20 w-20 border-4 border-primary/20 shadow-md">
          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
            {getInitials(user?.name || user?.username || "U")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-foreground">{user?.name || user?.username}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <Badge variant="outline" className="mt-1 text-xs border-primary/30 text-primary">
            {dir === "rtl" ? "عميل" : "Customer"}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: Mail,      labelAr: "البريد الإلكتروني", labelEn: "Email",      value: user?.email },
          { icon: Phone,     labelAr: "رقم الهاتف",        labelEn: "Phone",      value: user?.phone },
          { icon: Building2, labelAr: "القسم",             labelEn: "Department", value: user?.department },
          { icon: User,      labelAr: "المنصب",             labelEn: "Position",   value: user?.position },
          { icon: Calendar,  labelAr: "تاريخ الانضمام",   labelEn: "Joined",     value: formatDate(user?.createdAt) },
          { icon: Clock,     labelAr: "آخر تسجيل دخول",   labelEn: "Last Login", value: formatDate(user?.lastLoginAt) },
        ].map(({ icon: Icon, labelAr, labelEn, value }) => (
          <div key={labelEn} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
            <Icon className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">{dir === "rtl" ? labelAr : labelEn}</p>
              <p className="text-sm font-medium text-foreground">{value || (dir === "rtl" ? "غير محدد" : "Not set")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersSection({ orders, isLoading, dir }: { orders: any[]; isLoading: boolean; dir: string }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
        <ShoppingBag className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-lg font-medium">{dir === "rtl" ? "لا توجد طلبات بعد" : "No orders yet"}</p>
        <p className="text-sm mt-1">{dir === "rtl" ? "لم تقدّم أي طلبات خدمة حتى الآن" : "You haven't submitted any service requests yet"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order: any, idx: number) => (
        <div
          key={order.id || idx}
          data-testid={`card-order-${order.id || idx}`}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-0.5 p-2 rounded-lg bg-primary/10">
              <ShoppingBag className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">
                {order.title || order.serviceName || order.serviceApplication || (dir === "rtl" ? "طلب خدمة" : "Service Request")}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {dir === "rtl" ? "تاريخ الطلب:" : "Submitted:"} {formatDate(order.createdAt)}
              </p>
              {order.estimatedCost && (
                <p className="text-xs text-muted-foreground">
                  {dir === "rtl" ? "التكلفة التقديرية:" : "Est. Cost:"}{" "}
                  {Number(order.estimatedCost).toLocaleString()} {dir === "rtl" ? "ريال" : "SAR"}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusBadge status={order.status || "pending"} map={ORDER_STATUS_MAP} dir={dir} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TicketsSection({ tickets, isLoading, dir }: { tickets: any[]; isLoading: boolean; dir: string }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
        <Ticket className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-lg font-medium">{dir === "rtl" ? "لا توجد تذاكر دعم" : "No support tickets"}</p>
        <p className="text-sm mt-1">{dir === "rtl" ? "لم تفتح أي تذكرة دعم حتى الآن" : "You haven't opened any support tickets yet"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket: any, idx: number) => (
        <div
          key={ticket.id || idx}
          data-testid={`card-ticket-${ticket.id || idx}`}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-0.5 p-2 rounded-lg bg-blue-500/10">
              <Ticket className="w-4 h-4 text-blue-500" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">
                {ticket.subject || ticket.title || (dir === "rtl" ? "تذكرة دعم" : "Support Ticket")}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {ticket.description || ticket.message || ""}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {dir === "rtl" ? "تاريخ الفتح:" : "Opened:"} {formatDate(ticket.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {ticket.priority && (
              <StatusBadge status={ticket.priority} map={PRIORITY_MAP} dir={dir} />
            )}
            <StatusBadge status={ticket.status || "open"} map={TICKET_STATUS_MAP} dir={dir} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Overview stats
// ─────────────────────────────────────────────────────────────────────────────

function OverviewCards({ orders, tickets, dir }: { orders: any[]; tickets: any[]; dir: string }) {
  const pendingOrders  = orders.filter(o => o.status === "pending" || !o.status).length;
  const activeOrders   = orders.filter(o => o.status === "in_progress").length;
  const openTickets    = tickets.filter(t => t.status === "open" || t.status === "pending" || !t.status).length;
  const resolvedTickets = tickets.filter(t => t.status === "resolved" || t.status === "closed").length;

  const stats = [
    { labelAr: "إجمالي الطلبات",   labelEn: "Total Orders",      value: orders.length,   icon: ShoppingBag, color: "text-primary",    bg: "bg-primary/10" },
    { labelAr: "طلبات قيد التنفيذ",labelEn: "Active Orders",     value: activeOrders,    icon: Loader2,     color: "text-blue-500",   bg: "bg-blue-500/10" },
    { labelAr: "تذاكر مفتوحة",      labelEn: "Open Tickets",      value: openTickets,     icon: AlertCircle, color: "text-amber-500",  bg: "bg-amber-500/10" },
    { labelAr: "تذاكر محلولة",      labelEn: "Resolved Tickets",  value: resolvedTickets, icon: CheckCircle2,color: "text-green-500",  bg: "bg-green-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map(({ labelAr, labelEn, value, icon: Icon, color, bg }) => (
        <Card key={labelEn} className="border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{dir === "rtl" ? labelAr : labelEn}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
              </div>
              <div className={cn("p-2.5 rounded-xl", bg)}>
                <Icon className={cn("w-5 h-5", color)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Access denied component
// ─────────────────────────────────────────────────────────────────────────────

function AccessDenied({ dir }: { dir: string }) {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="max-w-md w-full shadow-xl border-red-200 dark:border-red-900">
        <CardContent className="pt-10 pb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            {dir === "rtl" ? "غير مصرح بالدخول" : "Access Denied"}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {dir === "rtl"
              ? "هذه الصفحة مخصصة للعملاء فقط. يرجى تسجيل الدخول بحساب عميل."
              : "This page is for customers only. Please log in with a customer account."}
          </p>
          <Button onClick={() => setLocation("/")} variant="outline" className="w-full">
            {dir === "rtl" ? "العودة للرئيسية" : "Back to Home"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default function CustomerDashboard() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { dir } = useLanguage();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const isRtl = dir === "rtl";

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  // Fetch orders
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/customer/orders"],
    queryFn: () => fetchWithAuth("/api/customer/orders"),
    enabled: isAuthenticated && user?.role === "customer",
    retry: false,
  });

  // Fetch tickets
  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ["/api/customer/tickets"],
    queryFn: () => fetchWithAuth("/api/customer/tickets"),
    enabled: isAuthenticated && user?.role === "customer",
    retry: false,
  });

  // Fetch full profile
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/customer/profile"],
    queryFn: () => fetchWithAuth("/api/customer/profile"),
    enabled: isAuthenticated && user?.role === "customer",
    retry: false,
  });

  const orders  = ordersData?.orders   || [];
  const tickets = ticketsData?.tickets  || [];
  const profile = profileData?.profile  || user;

  // Loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">{isRtl ? "جارٍ التحقق…" : "Verifying…"}</p>
        </div>
      </div>
    );
  }

  // Access denied for non-customer roles
  if (isAuthenticated && user?.role !== "customer") {
    return <AccessDenied dir={dir} />;
  }

  if (!isAuthenticated) {
    return null; // useEffect redirect handles this
  }

  const getInitials = (name: string) =>
    name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "U";

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        isRtl && "rtl"
      )}
      dir={dir}
    >
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">
                {isRtl ? "لوحة التحكم" : "Customer Dashboard"}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {isRtl ? "بلاحدود سوفت" : "Unlimited Soft"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {getInitials(user?.name || user?.email || "U")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                {user?.name || user?.email}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => { await logout(); setLocation("/login"); }}
              data-testid="button-logout"
              className="text-muted-foreground hover:text-red-500 gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{isRtl ? "تسجيل الخروج" : "Logout"}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome banner */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg">
          <p className="text-sm font-medium opacity-80 mb-1">
            {isRtl ? "مرحباً بك،" : "Welcome back,"}
          </p>
          <h2 className="text-2xl font-bold">
            {user?.name || user?.email}
          </h2>
          <p className="text-sm opacity-75 mt-1">
            {isRtl
              ? "يمكنك متابعة طلباتك وتذاكر الدعم من هنا"
              : "Track your orders and support tickets from here"}
          </p>
        </div>

        {/* Overview stats */}
        <OverviewCards orders={orders} tickets={tickets} dir={dir} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} dir={dir}>
          <TabsList className="mb-6 bg-muted/60 border border-border">
            <TabsTrigger value="overview" data-testid="tab-overview" className="gap-1.5">
              <LayoutDashboard className="w-4 h-4" />
              {isRtl ? "نظرة عامة" : "Overview"}
            </TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-orders" className="gap-1.5">
              <ShoppingBag className="w-4 h-4" />
              {isRtl ? "الطلبات" : "Orders"}
              {orders.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary/20 text-primary font-medium">
                  {orders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="tickets" data-testid="tab-tickets" className="gap-1.5">
              <Ticket className="w-4 h-4" />
              {isRtl ? "تذاكر الدعم" : "Support"}
              {tickets.filter(t => t.status === "open" || !t.status).length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-600 font-medium">
                  {tickets.filter(t => t.status === "open" || !t.status).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile" className="gap-1.5">
              <User className="w-4 h-4" />
              {isRtl ? "الملف الشخصي" : "Profile"}
            </TabsTrigger>
          </TabsList>

          {/* ── Overview tab ─────────────────────────────────────────────── */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent orders */}
              <Card className="border border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-primary" />
                    {isRtl ? "أحدث الطلبات" : "Recent Orders"}
                  </CardTitle>
                  <CardDescription>
                    {isRtl ? "آخر طلبات الخدمة المقدّمة" : "Your latest service requests"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrdersSection orders={orders.slice(0, 3)} isLoading={ordersLoading} dir={dir} />
                  {orders.length > 3 && (
                    <Button variant="ghost" size="sm" className="w-full mt-3 text-primary" onClick={() => setActiveTab("orders")}>
                      {isRtl ? `عرض جميع الطلبات (${orders.length})` : `View all orders (${orders.length})`}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Recent tickets */}
              <Card className="border border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-blue-500" />
                    {isRtl ? "أحدث التذاكر" : "Recent Tickets"}
                  </CardTitle>
                  <CardDescription>
                    {isRtl ? "آخر تذاكر الدعم الفني المفتوحة" : "Your latest support tickets"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TicketsSection tickets={tickets.slice(0, 3)} isLoading={ticketsLoading} dir={dir} />
                  {tickets.length > 3 && (
                    <Button variant="ghost" size="sm" className="w-full mt-3 text-blue-500" onClick={() => setActiveTab("tickets")}>
                      {isRtl ? `عرض جميع التذاكر (${tickets.length})` : `View all tickets (${tickets.length})`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Orders tab ───────────────────────────────────────────────── */}
          <TabsContent value="orders">
            <Card className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  {isRtl ? "طلبات الخدمة" : "Service Orders"}
                </CardTitle>
                <CardDescription>
                  {isRtl ? "جميع طلبات الخدمة الخاصة بك" : "All your service requests"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersSection orders={orders} isLoading={ordersLoading} dir={dir} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Tickets tab ──────────────────────────────────────────────── */}
          <TabsContent value="tickets">
            <Card className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-blue-500" />
                  {isRtl ? "تذاكر الدعم الفني" : "Support Tickets"}
                </CardTitle>
                <CardDescription>
                  {isRtl ? "جميع طلبات الدعم الفني الخاصة بك" : "All your support tickets"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TicketsSection tickets={tickets} isLoading={ticketsLoading} dir={dir} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Profile tab ──────────────────────────────────────────────── */}
          <TabsContent value="profile">
            <Card className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  {isRtl ? "الملف الشخصي" : "My Profile"}
                </CardTitle>
                <CardDescription>
                  {isRtl ? "بيانات حسابك الشخصي" : "Your account information"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profileLoading ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-20 w-20 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-56" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-16 rounded-lg" />)}
                    </div>
                  </div>
                ) : (
                  <ProfileSection user={profile} dir={dir} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
