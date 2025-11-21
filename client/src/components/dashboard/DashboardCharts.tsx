import { Suspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load recharts to reduce initial bundle size
const LazyBarChart = lazy(() => 
  import('recharts').then(module => ({ default: module.BarChart }))
);
const LazyLineChart = lazy(() => 
  import('recharts').then(module => ({ default: module.LineChart }))
);
const LazyPieChart = lazy(() => 
  import('recharts').then(module => ({ default: module.PieChart }))
);
const LazyBar = lazy(() => 
  import('recharts').then(module => ({ default: module.Bar }))
);
const LazyLine = lazy(() => 
  import('recharts').then(module => ({ default: module.Line }))
);
const LazyPie = lazy(() => 
  import('recharts').then(module => ({ default: module.Pie }))
);
const LazyCell = lazy(() => 
  import('recharts').then(module => ({ default: module.Cell }))
);
const LazyXAxis = lazy(() => 
  import('recharts').then(module => ({ default: module.XAxis }))
);
const LazyYAxis = lazy(() => 
  import('recharts').then(module => ({ default: module.YAxis }))
);
const LazyCartesianGrid = lazy(() => 
  import('recharts').then(module => ({ default: module.CartesianGrid }))
);
const LazyTooltip = lazy(() => 
  import('recharts').then(module => ({ default: module.Tooltip }))
);
const LazyLegend = lazy(() => 
  import('recharts').then(module => ({ default: module.Legend }))
);
const LazyResponsiveContainer = lazy(() => 
  import('recharts').then(module => ({ default: module.ResponsiveContainer }))
);

interface DashboardChartsProps {
  data: {
    dealsByStage: Record<string, number>;
    monthlyTrend: Array<{ month: string; deals: number; value: number }>;
    ticketStatus: Record<string, number>;
  };
  isLoading?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const stageLabels: Record<string, string> = {
  'prospecting': 'استطلاع',
  'qualification': 'تأهيل',
  'proposal': 'عرض',
  'negotiation': 'تفاوض', 
  'closed-won': 'مغلقة-فوز',
  'closed-lost': 'مغلقة-خسارة'
};

const statusLabels: Record<string, string> = {
  'open': 'مفتوحة',
  'in-progress': 'قيد المعالجة',
  'resolved': 'محلولة',
  'closed': 'مغلقة'
};

function ChartSkeleton() {
  return (
    <div className="w-full h-80 flex items-center justify-center">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

function DealsByStageChart({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(data).map(([stage, count]) => ({
    stage: stageLabels[stage] || stage,
    count,
    fill: COLORS[Object.keys(data).indexOf(stage) % COLORS.length]
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>الصفقات حسب المرحلة</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<ChartSkeleton />}>
          <LazyResponsiveContainer width="100%" height={300}>
            <LazyBarChart data={chartData} layout="horizontal">
              <LazyCartesianGrid strokeDasharray="3 3" />
              <LazyXAxis type="number" />
              <LazyYAxis dataKey="stage" type="category" width={80} />
              <LazyTooltip />
              <LazyBar dataKey="count" />
            </LazyBarChart>
          </LazyResponsiveContainer>
        </Suspense>
      </CardContent>
    </Card>
  );
}

function MonthlyTrendChart({ data }: { data: Array<{ month: string; deals: number; value: number }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>الاتجاه الشهري للصفقات</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<ChartSkeleton />}>
          <LazyResponsiveContainer width="100%" height={300}>
            <LazyLineChart data={data}>
              <LazyCartesianGrid strokeDasharray="3 3" />
              <LazyXAxis dataKey="month" />
              <LazyYAxis />
              <LazyTooltip />
              <LazyLegend />
              <LazyLine 
                type="monotone" 
                dataKey="deals" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="عدد الصفقات"
              />
              <LazyLine 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={2}
                name="القيمة (ر.س)"
              />
            </LazyLineChart>
          </LazyResponsiveContainer>
        </Suspense>
      </CardContent>
    </Card>
  );
}

function TicketStatusChart({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(data).map(([status, count]) => ({
    name: statusLabels[status] || status,
    value: count
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>حالة التذاكر</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<ChartSkeleton />}>
          <LazyResponsiveContainer width="100%" height={300}>
            <LazyPieChart>
              <LazyPie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <LazyCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </LazyPie>
              <LazyTooltip />
              <LazyLegend />
            </LazyPieChart>
          </LazyResponsiveContainer>
        </Suspense>
      </CardContent>
    </Card>
  );
}

export function DashboardCharts({ data, isLoading }: DashboardChartsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <ChartSkeleton />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DealsByStageChart data={data.dealsByStage} />
      <TicketStatusChart data={data.ticketStatus} />
      <div className="lg:col-span-2">
        <MonthlyTrendChart data={data.monthlyTrend} />
      </div>
    </div>
  );
}