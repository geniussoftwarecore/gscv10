import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load chart components only when needed
const LazyBarChart = lazy(() => 
  import('recharts').then(module => ({ default: module.BarChart }))
);
const LazyLineChart = lazy(() => 
  import('recharts').then(module => ({ default: module.LineChart }))
);
const LazyPieChart = lazy(() => 
  import('recharts').then(module => ({ default: module.PieChart }))
);
const LazyAreaChart = lazy(() => 
  import('recharts').then(module => ({ default: module.AreaChart }))
);

// Chart components with lazy loading
const LazyBar = lazy(() => 
  import('recharts').then(module => ({ default: module.Bar }))
);
const LazyLine = lazy(() => 
  import('recharts').then(module => ({ default: module.Line }))
);
const LazyArea = lazy(() => 
  import('recharts').then(module => ({ default: module.Area }))
);
const LazyPie = lazy(() => 
  import('recharts').then(module => ({ default: module.Pie }))
);
const LazyCell = lazy(() => 
  import('recharts').then(module => ({ default: module.Cell }))
);

// Utility components
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

// Chart skeleton
function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="w-full" style={{ height }} data-testid="chart-loading">
      <Skeleton className="w-full h-full rounded-lg" />
    </div>
  );
}

// Optimized chart components
interface ChartProps {
  data: any[];
  height?: number;
  colors?: string[];
  className?: string;
}

export function DynamicBarChart({ data, height = 300, colors = ['#0ea5e9'], className }: ChartProps) {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Suspense fallback={<ChartSkeleton height={height} />}>
        <LazyResponsiveContainer width="100%" height="100%">
          <LazyBarChart data={data}>
            <LazyCartesianGrid strokeDasharray="3 3" />
            <LazyXAxis dataKey="name" />
            <LazyYAxis />
            <LazyTooltip />
            <LazyLegend />
            <LazyBar dataKey="value" fill={colors[0]} />
          </LazyBarChart>
        </LazyResponsiveContainer>
      </Suspense>
    </div>
  );
}

export function DynamicLineChart({ data, height = 300, colors = ['#0ea5e9'], className }: ChartProps) {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Suspense fallback={<ChartSkeleton height={height} />}>
        <LazyResponsiveContainer width="100%" height="100%">
          <LazyLineChart data={data}>
            <LazyCartesianGrid strokeDasharray="3 3" />
            <LazyXAxis dataKey="name" />
            <LazyYAxis />
            <LazyTooltip />
            <LazyLegend />
            <LazyLine type="monotone" dataKey="value" stroke={colors[0]} strokeWidth={2} />
          </LazyLineChart>
        </LazyResponsiveContainer>
      </Suspense>
    </div>
  );
}

export function DynamicAreaChart({ data, height = 300, colors = ['#0ea5e9'], className }: ChartProps) {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Suspense fallback={<ChartSkeleton height={height} />}>
        <LazyResponsiveContainer width="100%" height="100%">
          <LazyAreaChart data={data}>
            <LazyCartesianGrid strokeDasharray="3 3" />
            <LazyXAxis dataKey="name" />
            <LazyYAxis />
            <LazyTooltip />
            <LazyLegend />
            <LazyArea type="monotone" dataKey="value" fill={colors[0]} stroke={colors[0]} />
          </LazyAreaChart>
        </LazyResponsiveContainer>
      </Suspense>
    </div>
  );
}

export function DynamicPieChart({ data, height = 300, colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444'], className }: ChartProps) {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Suspense fallback={<ChartSkeleton height={height} />}>
        <LazyResponsiveContainer width="100%" height="100%">
          <LazyPieChart>
            <LazyPie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <LazyCell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </LazyPie>
            <LazyTooltip />
            <LazyLegend />
          </LazyPieChart>
        </LazyResponsiveContainer>
      </Suspense>
    </div>
  );
}