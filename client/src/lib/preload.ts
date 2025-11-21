// Preload critical chunks and resources
import { queryClient } from "./queryClient";

export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  // Preload critical routes that are likely to be visited
  const criticalRoutes = [
    () => import('@/pages/about'),
    () => import('@/pages/services'),
    () => import('@/pages/portfolio/index'),
    () => import('@/pages/contact'),
  ];

  // Preload critical data queries
  const criticalData = [
    () => queryClient.prefetchQuery({
      queryKey: ['/api/services'],
      queryFn: () => fetch('/api/services').then(res => res.json()),
      staleTime: 5 * 60 * 1000 // 5 minutes
    }),
    () => queryClient.prefetchQuery({
      queryKey: ['/api/testimonials'],
      queryFn: () => fetch('/api/testimonials').then(res => res.json()),
      staleTime: 5 * 60 * 1000
    })
  ];

  // Use requestIdleCallback to preload when the browser is idle
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      criticalRoutes.forEach((importFn) => {
        importFn().catch(() => {
          // Ignore preload errors - the route will load normally when needed
        });
      });
      // Preload data after components
      setTimeout(() => {
        criticalData.forEach((dataFn) => {
          dataFn().catch(() => {
            // Ignore preload errors
          });
        });
      }, 500);
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      criticalRoutes.forEach((importFn) => {
        importFn().catch(() => {
          // Ignore preload errors
        });
      });
      criticalData.forEach((dataFn) => {
        dataFn().catch(() => {
          // Ignore preload errors
        });
      });
    }, 2000);
  }
}

// Preload resources on user interaction
export function setupPreloadOnInteraction() {
  if (typeof window === 'undefined') return;

  const preloadMap = new Map<string, () => Promise<any>>([
    // Route preloads
    ['/about', () => import('@/pages/about')],
    ['/services', () => import('@/pages/services')],
    ['/portfolio', () => import('@/pages/portfolio/index')],
    ['/contact', () => import('@/pages/contact')],
    ['/dashboard', () => import('@/pages/dashboard')],
    ['/login', () => import('@/pages/login')],
    ['/register', () => import('@/pages/register')],
    ['/admin', () => import('@/pages/admin')],
    ['/frameworks', () => import('@/pages/frameworks')],
    
    // Heavy component preloads via data attributes
    ['nav-about', () => import('@/pages/about')],
    ['nav-services', () => import('@/pages/services')],
    ['nav-portfolio', () => import('@/pages/portfolio/index')],
    ['nav-contact', () => import('@/pages/contact')],
    ['nav-frameworks', () => import('@/pages/frameworks')],
    ['chart-components', () => import('recharts')],
    ['admin-components', () => import('@/pages/admin')],
    ['crm-components', () => import('@/pages/CrmDashboard')],
    
    // Data preloads
    ['portfolio-data', () => 
      queryClient.prefetchQuery({
        queryKey: ['/api/portfolio'],
        queryFn: () => fetch('/api/portfolio').then(res => res.json())
      })
    ],
    ['testimonials-data', () =>
      queryClient.prefetchQuery({
        queryKey: ['/api/testimonials'],
        queryFn: () => fetch('/api/testimonials').then(res => res.json())
      })
    ]
  ]);

  // Preload on hover/focus for links
  document.addEventListener('mouseover', (event) => {
    const target = event.target as HTMLElement;
    
    // Check for data-preload attribute first
    const preloadKey = target.getAttribute('data-preload');
    if (preloadKey && preloadMap.has(preloadKey)) {
      const preloadFn = preloadMap.get(preloadKey)!;
      preloadFn().catch(() => {});
      preloadMap.delete(preloadKey); // Only preload once
      return;
    }
    
    // Fallback to link-based preloading
    const link = target.closest('a[href]') as HTMLAnchorElement;
    if (link && link.hostname === window.location.hostname) {
      const path = link.pathname;
      const preloadFn = preloadMap.get(path);
      if (preloadFn) {
        preloadFn().catch(() => {});
        preloadMap.delete(path); // Only preload once
      }
    }
  }, { passive: true });

  // Preload on focus for accessibility
  document.addEventListener('focusin', (event) => {
    const target = event.target as HTMLElement;
    const preloadKey = target.getAttribute('data-preload');
    if (preloadKey && preloadMap.has(preloadKey)) {
      const preloadFn = preloadMap.get(preloadKey)!;
      preloadFn().catch(() => {});
      preloadMap.delete(preloadKey);
    }
  }, { passive: true });

  // Preload on touchstart for mobile
  document.addEventListener('touchstart', (event) => {
    const target = event.target as HTMLElement;
    const preloadKey = target.getAttribute('data-preload');
    if (preloadKey && preloadMap.has(preloadKey)) {
      const preloadFn = preloadMap.get(preloadKey)!;
      preloadFn().catch(() => {});
      preloadMap.delete(preloadKey);
      return;
    }
    
    const link = target.closest('a[href]') as HTMLAnchorElement;
    if (link && link.hostname === window.location.hostname) {
      const path = link.pathname;
      const preloadFn = preloadMap.get(path);
      if (preloadFn) {
        preloadFn().catch(() => {});
        preloadMap.delete(path);
      }
    }
  }, { passive: true });

  // Intersection observer for viewport-based preloading
  if (window.IntersectionObserver) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const preloadKey = target.getAttribute('data-preload-viewport');
          if (preloadKey && preloadMap.has(preloadKey)) {
            const preloadFn = preloadMap.get(preloadKey)!;
            preloadFn().catch(() => {});
            preloadMap.delete(preloadKey);
            observer.unobserve(target);
          }
        }
      });
    }, { rootMargin: '100px' });

    // Observe elements after DOM is ready
    setTimeout(() => {
      document.querySelectorAll('[data-preload-viewport]').forEach(el => {
        observer.observe(el);
      });
    }, 1000);
  }
}