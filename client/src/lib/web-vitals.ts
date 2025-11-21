import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

interface VitalsData {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
  delta: number;
}

// Console-based logging for web vitals (can be replaced with real analytics)
function logVital(metric: VitalsData) {
  // This is a console stub - replace with your analytics service
  console.group(`🔧 Web Vital: ${metric.name}`);
  console.log(`Value: ${metric.value}ms`);
  console.log(`Rating: ${metric.rating}`);
  console.log(`ID: ${metric.id}`);
  console.groupEnd();

  // Send to analytics service if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
}

// Initialize web vitals tracking
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  onCLS(logVital);
  onINP(logVital);
  onFCP(logVital);
  onLCP(logVital);
  onTTFB(logVital);
}

// Error tracking
interface ErrorInfo {
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  timestamp: number;
  userAgent: string;
  url: string;
}

function logError(error: ErrorInfo) {
  // Console stub for error tracking
  console.group('🚨 Client Error');
  console.error('Message:', error.message);
  console.error('Stack:', error.stack);
  console.error('Location:', `${error.filename}:${error.lineno}:${error.colno}`);
  console.error('URL:', error.url);
  console.error('Timestamp:', new Date(error.timestamp).toISOString());
  console.groupEnd();

  // Send to error tracking service if available
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.captureException(error);
  }
}

// Global error handler
export function initErrorTracking() {
  if (typeof window === 'undefined') return;

  // Capture unhandled errors
  window.addEventListener('error', (event) => {
    logError({
      message: event.message,
      stack: event.error?.stack,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  });

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError({
      message: `Unhandled Promise Rejection: ${event.reason}`,
      stack: event.reason?.stack,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  });
}

// Performance observer for additional metrics
export function initPerformanceObserver() {
  if (typeof window === 'undefined' || !window.PerformanceObserver) return;

  // Observe long tasks
  const longTaskObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.warn(`⚠️ Long Task detected: ${entry.duration}ms`, entry);
    });
  });

  try {
    longTaskObserver.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    // Long task API not supported
  }

  // Observe layout shifts
  const layoutShiftObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry: any) => {
      if (entry.value > 0.1) {
        console.warn(`⚠️ Layout Shift detected: ${entry.value}`, entry);
      }
    });
  });

  try {
    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    // Layout shift API not supported
  }
}