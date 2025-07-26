// Performance optimization utilities for Doubao UI
import React, { useCallback, useEffect, useRef, useState } from 'react';

// GPU acceleration utilities
export const enableGPUAcceleration = (element: HTMLElement) => {
  element.style.transform = 'translateZ(0)';
  element.style.willChange = 'transform, opacity';
};

export const disableGPUAcceleration = (element: HTMLElement) => {
  element.style.transform = '';
  element.style.willChange = 'auto';
};

// Optimized animation frame utilities
export const useAnimationFrame = (callback: (deltaTime: number) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
};

// Throttled scroll handler
export const useThrottledScroll = (
  callback: (scrollTop: number, scrollHeight: number, clientHeight: number) => void,
  delay: number = 16 // ~60fps
) => {
  const lastRun = useRef(Date.now());

  return useCallback((event: Event) => {
    if (Date.now() - lastRun.current >= delay) {
      const target = event.target as HTMLElement;
      callback(target.scrollTop, target.scrollHeight, target.clientHeight);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

// Debounced resize handler
export const useDebounceResize = (callback: () => void, delay: number = 250) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(callback, delay);
  }, [callback, delay]);
};

// Intersection Observer for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);
  const observer = useRef<IntersectionObserver>();

  const observe = useCallback((element: Element) => {
    if (observer.current) {
      observer.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element: Element) => {
    if (observer.current) {
      observer.current.unobserve(element);
    }
  }, []);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      setEntries(entries);
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options,
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [options]);

  return { entries, observe, unobserve };
};

// Memory-efficient message batching
export const useBatchedMessages = <T>(
  items: T[],
  batchSize: number = 50
) => {
  const [visibleBatches, setVisibleBatches] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const visibleItems = items.slice(0, visibleBatches * batchSize);
  const hasMore = visibleItems.length < items.length;

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setIsLoading(true);
      // Simulate async loading with requestAnimationFrame for smooth UX
      requestAnimationFrame(() => {
        setVisibleBatches(prev => prev + 1);
        setIsLoading(false);
      });
    }
  }, [isLoading, hasMore]);

  const reset = useCallback(() => {
    setVisibleBatches(1);
    setIsLoading(false);
  }, []);

  return {
    visibleItems,
    hasMore,
    isLoading,
    loadMore,
    reset,
  };
};

// Performance monitoring
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0,
  });

  const measureFPS = useCallback(() => {
    let frames = 0;
    let lastTime = performance.now();

    const countFrames = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: Math.round((frames * 1000) / (currentTime - lastTime)),
        }));
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(countFrames);
    };

    requestAnimationFrame(countFrames);
  }, []);

  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024),
      }));
    }
  }, []);

  const measureRenderTime = useCallback((startTime: number) => {
    const endTime = performance.now();
    setMetrics(prev => ({
      ...prev,
      renderTime: Math.round(endTime - startTime),
    }));
  }, []);

  useEffect(() => {
    measureFPS();
    const memoryInterval = setInterval(measureMemory, 5000);
    
    return () => {
      clearInterval(memoryInterval);
    };
  }, [measureFPS, measureMemory]);

  return { metrics, measureRenderTime };
};

// Optimized event handlers
export const createOptimizedEventHandler = <T extends Event>(
  handler: (event: T) => void,
  options: {
    passive?: boolean;
    capture?: boolean;
    throttle?: number;
    debounce?: number;
  } = {}
) => {
  let timeoutId: NodeJS.Timeout;
  let lastRun = 0;

  return (event: T) => {
    const now = Date.now();

    if (options.throttle) {
      if (now - lastRun < options.throttle) {
        return;
      }
      lastRun = now;
    }

    if (options.debounce) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handler(event), options.debounce);
      return;
    }

    handler(event);
  };
};

// Bundle size optimization utilities
export const preloadComponent = (importFn: () => Promise<any>) => {
  const componentPromise = importFn();
  return componentPromise;
};

export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): React.FC<React.ComponentProps<T>> => {
  const LazyComponent = React.lazy(importFn);
  
  const WrappedComponent: React.FC<React.ComponentProps<T>> = (props) => (
    <React.Suspense fallback={fallback ? React.createElement(fallback) : null}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
  
  return WrappedComponent;
};

// CSS-in-JS optimization
export const createOptimizedStyles = (styles: Record<string, React.CSSProperties>) => {
  const optimizedStyles: Record<string, React.CSSProperties> = {};
  
  Object.entries(styles).forEach(([key, style]) => {
    optimizedStyles[key] = {
      ...style,
      // Enable GPU acceleration for transform/opacity animations
      ...(style.transform || style.opacity !== undefined ? {
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        perspective: 1000,
      } : {}),
    };
  });
  
  return optimizedStyles;
};

// Animation performance utilities
export const createGPUOptimizedAnimation = (
  element: HTMLElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions
): Animation => {
  // Enable GPU acceleration
  enableGPUAcceleration(element);
  
  const animation = element.animate(keyframes, {
    ...options,
    // Optimize for performance
    composite: 'replace',
  });
  
  // Clean up GPU acceleration when animation ends
  animation.addEventListener('finish', () => {
    disableGPUAcceleration(element);
  });
  
  return animation;
};

export default {
  enableGPUAcceleration,
  disableGPUAcceleration,
  useAnimationFrame,
  useThrottledScroll,
  useDebounceResize,
  useIntersectionObserver,
  useBatchedMessages,
  usePerformanceMonitor,
  createOptimizedEventHandler,
  preloadComponent,
  createLazyComponent,
  createOptimizedStyles,
  createGPUOptimizedAnimation,
};