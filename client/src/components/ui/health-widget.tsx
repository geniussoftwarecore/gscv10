import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Progress } from './progress';
import { Activity, Database, Zap, Clock } from 'lucide-react';
import { HealthSummary } from '../../../../shared/types/health';

export function HealthWidget() {
  const [health, setHealth] = useState<HealthSummary | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/health/summary');
      if (response.ok) {
        const data = await response.json();
        setHealth(data);
        setLastUpdated(new Date().toLocaleTimeString('ar-SA'));
      }
    } catch (error) {
      console.error('Failed to fetch health data:', error);
    }
  };

  if (!health) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center text-sm">
            <Activity className="w-4 h-4 ml-2" />
            حالة النظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">جاري التحميل...</div>
        </CardContent>
      </Card>
    );
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}د ${hours}س`;
    if (hours > 0) return `${hours}س ${minutes}ق`;
    return `${minutes}ق`;
  };

  const getStatusColor = (isOk: boolean) => {
    return isOk ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = (isOk: boolean) => {
    return isOk ? 'طبيعي' : 'خطأ';
  };

  return (
    <Card className="w-full max-w-md" data-testid="widget-health">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Activity className="w-4 h-4 ml-2" />
            حالة النظام
          </div>
          <Badge variant="outline" className="text-xs">
            آخر تحديث: {lastUpdated}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">الحالة العامة</span>
          <Badge 
            variant={health.db.ok && health.api.ok ? "default" : "destructive"}
            data-testid="badge-overall-status"
          >
            {health.db.ok && health.api.ok ? 'طبيعي' : 'تحتاج انتباه'}
          </Badge>
        </div>

        {/* Uptime */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="w-4 h-4 ml-2 text-blue-600" />
            <span className="text-sm text-gray-600">وقت التشغيل</span>
          </div>
          <span className="text-sm font-medium" data-testid="text-uptime">
            {formatUptime(health.uptime)}
          </span>
        </div>

        {/* Latency */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="w-4 h-4 ml-2 text-yellow-600" />
            <span className="text-sm text-gray-600">زمن الاستجابة</span>
          </div>
          <span className="text-sm font-medium" data-testid="text-latency">
            {health.latencyMs}ms
          </span>
        </div>

        {/* Database Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="w-4 h-4 ml-2 text-green-600" />
              <span className="text-sm text-gray-600">قاعدة البيانات</span>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full ml-2 ${getStatusColor(health.db.ok)}`} />
              <span className="text-sm font-medium" data-testid="text-db-status">
                {getStatusText(health.db.ok)}
              </span>
            </div>
          </div>
          {health.db.responseTime && (
            <div className="text-xs text-gray-500 text-left">
              زمن الاستجابة: {health.db.responseTime}ms
            </div>
          )}
        </div>

        {/* API Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-4 h-4 ml-2 text-purple-600" />
              <span className="text-sm text-gray-600">واجهة البرمجة</span>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full ml-2 ${getStatusColor(health.api.ok)}`} />
              <span className="text-sm font-medium" data-testid="text-api-status">
                {getStatusText(health.api.ok)}
              </span>
            </div>
          </div>
          
          {/* Error Rate Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>معدل الأخطاء</span>
              <span data-testid="text-error-rate">{health.api.errorRate}%</span>
            </div>
            <Progress 
              value={health.api.errorRate} 
              className="h-1"
              data-testid="progress-error-rate"
            />
          </div>
          
          {health.api.avgResponseTime && (
            <div className="text-xs text-gray-500 text-left">
              متوسط زمن الاستجابة: {health.api.avgResponseTime.toFixed(1)}ms
            </div>
          )}
        </div>

        {/* Version */}
        {health.version && (
          <div className="pt-2 border-t text-center">
            <span className="text-xs text-gray-400">
              الإصدار: {health.version}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}