import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicChart } from '@/components/ui/dynamic-chart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, UsersIcon, BuildingIcon, TicketIcon, CurrencyIcon } from 'lucide-react';

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
  summary: {
    totalContacts: number;
    totalAccounts: number;
    totalOpportunities: number;
    totalTickets: number;
    totalTasks: number;
  };
}

const DashboardNew: React.FC = () => {
  const { t, language } = useTranslation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error loading dashboard: {error}</p>
              <Button onClick={fetchDashboardData} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const kpiCards = [
    {
      title: language === 'ar' ? 'إجمالي الصفقات' : 'Total Deals',
      value: dashboardData.kpis.totalDeals.toLocaleString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: TrendingUpIcon,
      description: language === 'ar' ? 'من الشهر الماضي' : 'from last month'
    },
    {
      title: language === 'ar' ? 'قيمة الأنبوب' : 'Pipeline Value',
      value: `$${dashboardData.kpis.pipelineValue.toLocaleString()}`,
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: CurrencyIcon,
      description: language === 'ar' ? 'نمو متوقع' : 'expected growth'
    },
    {
      title: language === 'ar' ? 'معدل التحويل' : 'Conversion Rate',
      value: `${dashboardData.kpis.conversionRate}%`,
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: UsersIcon,
      description: language === 'ar' ? 'من الهدف' : 'from target'
    },
    {
      title: language === 'ar' ? 'متوسط وقت الحل' : 'Avg Resolution Time',
      value: `${dashboardData.kpis.avgResolutionTime}d`,
      change: '-15%',
      changeType: 'positive' as const,
      icon: TicketIcon,
      description: language === 'ar' ? 'تحسن كبير' : 'improvement'
    }
  ];

  return (
    <div className="p-6 space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'نظرة عامة على الأداء والمقاييس الرئيسية' : 'Overview of performance and key metrics'}
          </p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline">
          {language === 'ar' ? 'تحديث' : 'Refresh'}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center space-x-1 text-sm">
                  {kpi.changeType === 'positive' ? (
                    <ArrowUpIcon className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 text-red-600" />
                  )}
                  <Badge 
                    variant={kpi.changeType === 'positive' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {kpi.change}
                  </Badge>
                  <span className="text-muted-foreground">{kpi.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Deals by Stage */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'الصفقات حسب المرحلة' : 'Deals by Stage'}</CardTitle>
            <CardDescription>
              {language === 'ar' ? 'توزيع الصفقات عبر مراحل المبيعات' : 'Distribution of deals across sales stages'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DynamicChart 
              type="donut"
              data={dashboardData.charts.dealsByStage.map(item => ({
                name: item.stage,
                value: item.count
              }))}
              height={300}
            />
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'الاتجاه الشهري' : 'Monthly Trend'}</CardTitle>
            <CardDescription>
              {language === 'ar' ? 'تطور الصفقات والقيمة عبر الوقت' : 'Deal progression and value over time'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DynamicChart 
              type="area"
              data={dashboardData.charts.monthlyTrend.map(item => ({
                name: item.month,
                deals: item.deals,
                value: item.value / 1000 // Convert to K for readability
              }))}
              height={300}
              xAxisKey="name"
              yAxisKeys={['deals', 'value']}
            />
          </CardContent>
        </Card>
      </div>

      {/* Ticket Resolution Chart */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'حل التذاكر الأسبوعي' : 'Weekly Ticket Resolution'}</CardTitle>
            <CardDescription>
              {language === 'ar' ? 'التذاكر المحلولة ومتوسط وقت الحل' : 'Resolved tickets and average resolution time'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DynamicChart 
              type="bar"
              data={dashboardData.charts.ticketResolution.map(item => ({
                name: item.day,
                resolved: item.resolved,
                avg_time: item.avg_time
              }))}
              height={350}
              xAxisKey="name"
              yAxisKeys={['resolved', 'avg_time']}
            />
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'ar' ? 'جهات الاتصال' : 'Contacts'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.summary.totalContacts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'ar' ? 'الحسابات' : 'Accounts'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.summary.totalAccounts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'ar' ? 'الفرص' : 'Opportunities'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.summary.totalOpportunities}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'ar' ? 'التذاكر' : 'Tickets'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.summary.totalTickets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'ar' ? 'المهام' : 'Tasks'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.summary.totalTasks}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardNew;