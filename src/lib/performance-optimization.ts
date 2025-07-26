// Performance optimization utilities for 60fps animations and smooth interactions

// Throttle function for performance-critical operations
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Debounce function for input handling
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Request animation frame wrapper for smooth animations
export const raf = (callback: () => void): number => {
  return requestAnimationFrame(callback);
};

// Cancel animation frame
export const cancelRaf = (id: number): void => {
  cancelAnimationFrame(id);
};

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMeasure(name: string): void {
    performance.mark(`${name}-start`);
  }

  endMeasure(name: string): number {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name, 'measure')[0];
    const duration = measure.duration;
    
    // Store metrics
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);
    
    // Clean up
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
    
    return duration;
  }

  getAverageTime(name: string): number {
    const times = this.metrics.get(name) || [];
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  clearMetrics(name?: string): void {
    if (name) {
      this.metrics.delete(name);
    } else {
      this.metrics.clear();
    }
  }
}

// GPU acceleration utilities
export const enableGPUAcceleration = (element: HTMLElement): void => {
  element.style.transform = 'translateZ(0)';
  element.style.willChange = 'transform, opacity';
};

export const disableGPUAcceleration = (element: HTMLElement): void => {
  element.style.transform = '';
  element.style.willChange = 'auto';
};

// Smooth scroll utility
export const smoothScrollTo = (
  element: HTMLElement,
  target: number,
  duration: number = 300
): Promise<void> => {
  return new Promise((resolve) => {
    const start = element.scrollTop;
    const change = target - start;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      element.scrollTop = start + change * easeOut;
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        resolve();
      }
    };
    
    requestAnimationFrame(animateScroll);
  });
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Memory management utilities
export const cleanupEventListeners = (
  element: HTMLElement,
  events: Array<{ type: string; listener: EventListener }>
): void => {
  events.forEach(({ type, listener }) => {
    element.removeEventListener(type, listener);
  });
};

// Animation frame scheduler for heavy operations
export class AnimationScheduler {
  private tasks: Array<() => void> = [];
  private isRunning = false;

  addTask(task: () => void): void {
    this.tasks.push(task);
    if (!this.isRunning) {
      this.start();
    }
  }

  private start(): void {
    this.isRunning = true;
    this.processTask();
  }

  private processTask(): void {
    if (this.tasks.length === 0) {
      this.isRunning = false;
      return;
    }

    const task = this.tasks.shift();
    if (task) {
      task();
    }

    requestAnimationFrame(() => this.processTask());
  }

  clear(): void {
    this.tasks = [];
    this.isRunning = false;
  }
}

// CSS animation utilities
export const getCSSTransition = (
  property: string,
  duration: number = 300,
  easing: string = 'ease-out'
): string => {
  return `${property} ${duration}ms ${easing}`;
};

// Optimized resize observer
export const createResizeObserver = (
  callback: ResizeObserverCallback
): ResizeObserver => {
  const throttledCallback = throttle(callback, 16); // ~60fps
  return new ResizeObserver(throttledCallback);
};

// Touch gesture utilities
export interface TouchGesture {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
}

export const createTouchGestureHandler = (
  onGesture: (gesture: TouchGesture) => void,
  threshold: number = 50
) => {
  let startTouch: Touch | null = null;
  
  const handleTouchStart = (e: TouchEvent) => {
    startTouch = e.touches[0];
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!startTouch) return;
    
    const currentTouch = e.touches[0];
    const deltaX = currentTouch.clientX - startTouch.clientX;
    const deltaY = currentTouch.clientY - startTouch.clientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    let direction: TouchGesture['direction'] = null;
    if (distance > threshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }
    }
    
    const gesture: TouchGesture = {
      startX: startTouch.clientX,
      startY: startTouch.clientY,
      currentX: currentTouch.clientX,
      currentY: currentTouch.clientY,
      deltaX,
      deltaY,
      direction,
      distance,
    };
    
    onGesture(gesture);
  };
  
  const handleTouchEnd = () => {
    startTouch = null;
  };
  
  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};

// Performance-optimized class name utility
export const optimizedClassNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Singleton instance for global performance monitoring
export const performanceMonitor = PerformanceMonitor.getInstance();
export const animationScheduler = new AnimationScheduler();