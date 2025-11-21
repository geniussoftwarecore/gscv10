import { useEffect, useRef } from 'react';

interface ViewportPreloaderProps {
  children: React.ReactNode;
  preloadKey: string;
  className?: string;
  rootMargin?: string;
}

export function ViewportPreloader({ 
  children, 
  preloadKey, 
  className = '', 
  rootMargin = '100px' 
}: ViewportPreloaderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger preload via custom event
            element.setAttribute('data-preload-viewport', preloadKey);
            const event = new CustomEvent('viewport-preload', { 
              detail: { key: preloadKey } 
            });
            document.dispatchEvent(event);
            observer.unobserve(element);
          }
        });
      },
      { rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [preloadKey, rootMargin]);

  return (
    <div ref={ref} className={className} data-preload-viewport={preloadKey}>
      {children}
    </div>
  );
}