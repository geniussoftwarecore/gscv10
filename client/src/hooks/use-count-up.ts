import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export function useCountUp(
  endValue: number,
  duration: number = 2000,
  startDelay: number = 0,
  decimals: number = 0
) {
  const [currentValue, setCurrentValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!isInView || hasStarted) return;

    setHasStarted(true);
    
    const startTime = performance.now() + startDelay;
    
    const animate = (currentTime: number) => {
      const elapsed = Math.max(0, currentTime - startTime);
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const value = endValue * easeOutQuart;
      
      setCurrentValue(parseFloat(value.toFixed(decimals)));
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    
    frameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isInView, endValue, duration, startDelay, decimals, hasStarted]);

  return { value: currentValue, ref };
}