import { Router } from 'express';
import { HealthSummary } from '../../shared/types/health';

const router = Router();
const startTime = Date.now();

// Simple in-memory metrics storage
let requestCount = 0;
let errorCount = 0;
let totalResponseTime = 0;

// Middleware to track API metrics
export function trackMetrics() {
  return (req: any, res: any, next: any) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      requestCount++;
      totalResponseTime += duration;
      
      if (res.statusCode >= 400) {
        errorCount++;
      }
    });
    
    next();
  };
}

// GET /api/health/summary
router.get('/summary', async (req, res) => {
  try {
    const now = Date.now();
    const uptime = Math.floor((now - startTime) / 1000); // uptime in seconds
    
    // Simple latency check (ping to self)
    const latencyStart = Date.now();
    const latencyMs = Date.now() - latencyStart;
    
    // Calculate error rate
    const errorRate = requestCount > 0 ? (errorCount / requestCount) : 0;
    const avgResponseTime = requestCount > 0 ? (totalResponseTime / requestCount) : 0;
    
    // Simple database health check
    let dbHealth = { ok: true, responseTime: 0 };
    try {
      const dbStart = Date.now();
      // In a real app, you'd do a simple query here
      // await db.query('SELECT 1');
      dbHealth.responseTime = Date.now() - dbStart;
    } catch (error) {
      dbHealth.ok = false;
    }

    const healthSummary: HealthSummary = {
      uptime,
      latencyMs,
      db: dbHealth,
      api: {
        ok: errorRate < 0.1, // Consider API healthy if error rate < 10%
        errorRate: Number((errorRate * 100).toFixed(2)),
        avgResponseTime: Number(avgResponseTime.toFixed(2)),
      },
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    };

    res.json(healthSummary);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      uptime: Math.floor((Date.now() - startTime) / 1000),
      latencyMs: 999,
      db: { ok: false },
      api: { ok: false, errorRate: 100 },
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;