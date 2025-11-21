import React, { useState, Suspense, lazy } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/base";
import { Skeleton } from "../../client/src/components/ui/skeleton";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Clock,
  Calendar,
  BarChart3
} from "lucide-react";

// Simple chart components that lazy load recharts
const SimpleBarChart = lazy(() => 
  import('recharts').then(module => {
    const { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } = module;
    return {
      default: ({ data, dataKey, fill }: any) => (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={dataKey} fill={fill} />
          </BarChart>
        </ResponsiveContainer>
      )
    };
  })
);

const SimpleLineChart = lazy(() => 
  import('recharts').then(module => {
    const { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } = module;
    return {
      default: ({ data, dataKey, stroke }: any) => (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )
    };
  })
);

type Period = 'week' | 'month' | 'quarter' | 'custom';

interface KPIData {
  totalDeals: number;
  pipelineValue: number;
  conversionRate: number;
  avgResolutionTime: number;
}

interface ChartData {
  dealsByStage: Array<{ stage: string; count: number; value: number }>;
  monthlyTrend: Array<{ month: string; deals: number; value: number }>;
  ticketResolution: Array<{ day: string; resolved: number; avg_time: number }>;
}

interface DashboardData {
  kpis: KPIData;
  charts: ChartData;
}

// Period selector component
function PeriodSelector({ 
  selectedPeriod, 
  onPeriodChange 
}: { 
  selectedPeriod: Period; 
  onPeriodChange: (period: Period) => void 
}) {
  const periods = [
    { value: 'week', label: 'هذا الأسبوع' },
    { value: 'month', label: 'هذا الشهر' }, 
    { value: 'quarter', label: 'هذا الربع' },
    { value: 'custom', label: 'فترة مخصصة' }
  ];

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-gray-500" />
      <Select value={selectedPeriod} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {periods.map((period) => (
            <SelectItem key={period.value} value={period.value}>
              {period.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// KPI Cards component
function KPICards({ data, isLoading }: { data: KPIData; isLoading: boolean }) {
  const cards = [
    {
      title: "إجمالي الصفقات",
      value: data.totalDeals,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      format: (val: number) => val.toString()
    },
    {
      title: "قيمة خط الأنابيب", 
      value: data.pipelineValue,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      format: (val: number) => new Intl.NumberFormat('ar-SA').format(val) + ' ر.س'
    },
    {
      title: "معدل التحويل",
      value: data.conversionRate,
      icon: Users,
      color: "text-purple-600", 
      bgColor: "bg-purple-100",
      format: (val: number) => val.toFixed(1) + '%'
    },
    {
      title: "متوسط وقت حل التذاكر",
      value: data.avgResolutionTime,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100", 
      format: (val: number) => val.toFixed(1) + ' يوم'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.format(card.value)}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Chart skeleton component
function ChartSkeleton() {
  return (
    <div className="w-full h-80 flex items-center justify-center">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

// Dashboard charts component
function DashboardCharts({ data, isLoading }: { data: ChartData; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>الصفقات حسب المرحلة</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartSkeleton />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>الاتجاه الشهري</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Deals by Stage Chart */}
      <Card>
        <CardHeader>
          <CardTitle>الصفقات حسب المرحلة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Suspense fallback={<ChartSkeleton />}>
              <SimpleBarChart data={data.dealsByStage} dataKey="count" fill="#3b82f6" />
            </Suspense>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>الاتجاه الشهري</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Suspense fallback={<ChartSkeleton />}>
              <SimpleLineChart data={data.monthlyTrend} dataKey="deals" stroke="#10b981" />
            </Suspense>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Resolution Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>أداء حل التذاكر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Suspense fallback={<ChartSkeleton />}>
              <SimpleBarChart data={data.ticketResolution} dataKey="resolved" fill="#f59e0b" />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');

  // Fetch batched dashboard analytics with period parameter
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard/analytics', selectedPeriod],
    queryFn: () => 
      fetch(`/api/dashboard/analytics?period=${selectedPeriod}`)
        .then(res => res.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Default data to prevent layout shifts
  const defaultData: DashboardData = {
    kpis: {
      totalDeals: 0,
      pipelineValue: 0,
      conversionRate: 0,
      avgResolutionTime: 0
    },
    charts: {
      dealsByStage: [],
      monthlyTrend: [],
      ticketResolution: []
    }
  };

  const data = dashboardData || defaultData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                لوحة التحكم
              </h1>
              <p className="text-gray-600 mt-1">
                نظرة شاملة على أداء المبيعات والدعم
              </p>
            </div>
            <PeriodSelector 
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Cards */}
        <KPICards data={data.kpis} isLoading={isLoading} />

        {/* Charts */}
        <DashboardCharts data={data.charts} isLoading={isLoading} />
      </div>
    </div>
  );
}