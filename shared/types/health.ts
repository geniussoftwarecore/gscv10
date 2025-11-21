export interface HealthSummary {
  uptime: number;
  latencyMs: number;
  db: {
    ok: boolean;
    responseTime?: number;
  };
  api: {
    ok: boolean;
    errorRate: number;
    avgResponseTime?: number;
  };
  timestamp: string;
  version?: string;
}

export interface HealthMetrics {
  cpuUsage?: number;
  memoryUsage?: number;
  diskUsage?: number;
  activeConnections?: number;
}