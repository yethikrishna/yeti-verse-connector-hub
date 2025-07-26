import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { useThrottledScroll, useIntersectionObserver, enableGPUAcceleration } from '@/lib/performance-utils';

export interface VirtualScrollItem {
  id: string;
  height?: number;
  data: any;
}

export interface DoubaoVirtualScrollProps<T extends VirtualScrollItem> {
  items: T[];
  itemHeight: number | ((item: T, index: number) => number);
  renderItem: (item: T, index: number, isVisible: boolean) => React.ReactNode;
  containerHeight: number;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  loadMoreThreshold?: number;
  enableSmoothScrolling?: boolean;
  maintainScrollPosition?: boolean;
}

export const DoubaoVirtualScroll = <T extends VirtualScrollItem>({
  items,
  itemHeight,
  renderItem,
  containerHeight,
  overscan = 5,
  className,
  onScroll,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  loadMoreThreshold = 200,
  enableSmoothScrolling = true,
  maintainScrollPosition = true,
}: DoubaoVirtualScrollProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const previousItemsLength = useRef(items.length);
  const previousScrollHeight = useRef(0);

  // Calculate item heights and positions
  const itemMetrics = useMemo(() => {
    let totalHeight = 0;
    const positions: number[] = [];
    const heights: number[] = [];

    items.forEach((item, index) => {
      positions[index] = totalHeight;
      const height = typeof itemHeight === 'function' ? itemHeight(item, index) : itemHeight;
      heights[index] = height;
      totalHeight += height;
    });

    return { positions, heights, totalHeight };
  }, [items, itemHeight]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const { positions, heights } = itemMetrics;
    
    let startIndex = 0;
    let endIndex = items.length - 1;

    // Binary search for start index
    let left = 0;
    let right = items.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (positions[mid] < scrollTop) {
        startIndex = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    // Find end index
    let currentHeight = 0;
    for (let i = startIndex; i < items.length; i++) {
      if (currentHeight > containerHeight) {
        endIndex = i;
        break;
      }
      currentHeight += heights[i];
    }

    // Apply overscan
    startIndex = Math.max(0, startIndex - overscan);
    endIndex = Math.min(items.length - 1, endIndex + overscan);

    return { startIndex, endIndex };
  }, [scrollTop, containerHeight, itemMetrics, items.length, overscan]);

  // Throttled scroll handler
  const handleScroll = useThrottledScroll(
    useCallback((newScrollTop: number, scrollHeight: number, clientHeight: number) => {
      setScrollTop(newScrollTop);
      setIsScrolling(true);
      onScroll?.(newScrollTop);

      // Load more when near bottom
      if (hasMore && !isLoading && onLoadMore) {
        const distanceFromBottom = scrollHeight - (newScrollTop + clientHeight);
        if (distanceFromBottom < loadMoreThreshold) {
          onLoadMore();
        }
      }

      // Clear scrolling state after delay
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    }, [onScroll, hasMore, isLoading, onLoadMore, loadMoreThreshold]),
    16 // 60fps
  );

  // Maintain scroll position when items are added/removed
  useEffect(() => {
    if (!maintainScrollPosition || !containerRef.current) return;

    const container = containerRef.current;
    const currentScrollHeight = container.scrollHeight;
    
    // If items were added at the beginning (like loading older messages)
    if (items.length > previousItemsLength.current && previousScrollHeight.current > 0) {
      const heightDifference = currentScrollHeight - previousScrollHeight.current;
      if (heightDifference > 0) {
        container.scrollTop = scrollTop + heightDifference;
      }
    }

    previousItemsLength.current = items.length;
    previousScrollHeight.current = currentScrollHeight;
  }, [items.length, scrollTop, maintainScrollPosition]);

  // Enable GPU acceleration on mount
  useEffect(() => {
    if (containerRef.current && enableSmoothScrolling) {
      enableGPUAcceleration(containerRef.current);
    }
  }, [enableSmoothScrolling]);

  // Intersection observer for additional optimization
  const { observe, unobserve } = useIntersectionObserver({
    threshold: 0,
    rootMargin: '100px',
  });

  // Render visible items
  const visibleItems = useMemo(() => {
    const { startIndex, endIndex } = visibleRange;
    const { positions } = itemMetrics;
    
    return items.slice(startIndex, endIndex + 1).map((item, index) => {
      const actualIndex = startIndex + index;
      const top = positions[actualIndex];
      
      return {
        item,
        index: actualIndex,
        top,
        isVisible: !isScrolling, // Optimize rendering during scroll
      };
    });
  }, [visibleRange, itemMetrics, items, isScrolling]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'overflow-auto scrollbar-thin scrollbar-thumb-doubao-border-medium',
        'scrollbar-track-transparent',
        enableSmoothScrolling && 'scroll-smooth',
        className
      )}
      style={{ 
        height: containerHeight,
        // Optimize scrolling performance
        scrollBehavior: enableSmoothScrolling ? 'smooth' : 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
      onScroll={handleScroll}
    >
      {/* Total height container */}
      <div
        style={{ 
          height: itemMetrics.totalHeight,
          position: 'relative',
        }}
      >
        {/* Visible items */}
        <AnimatePresence mode="popLayout">
          {visibleItems.map(({ item, index, top, isVisible }) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                top,
                left: 0,
                right: 0,
                // Optimize rendering
                willChange: isScrolling ? 'transform' : 'auto',
                transform: 'translateZ(0)', // GPU acceleration
              }}
              ref={(el) => {
                if (el) {
                  observe(el);
                } else {
                  // Element is being unmounted
                }
              }}
            >
              {renderItem(item, index, isVisible)}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 flex justify-center py-4"
          >
            <div className="flex items-center gap-2 text-doubao-text-muted">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-doubao-border-medium border-t-doubao-primary-blue rounded-full"
              />
              Loading more messages...
            </div>
          </motion.div>
        )}

        {/* End of list indicator */}
        {!hasMore && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 flex justify-center py-4"
          >
            <div className="text-doubao-text-muted text-sm">
              No more messages
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Hook for managing virtual scroll state
export const useVirtualScroll = <T extends VirtualScrollItem>(
  items: T[],
  options: {
    itemHeight: number | ((item: T, index: number) => number);
    containerHeight: number;
    batchSize?: number;
  }
) => {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { itemHeight, containerHeight, batchSize = 50 } = options;

  // Calculate visible range based on scroll position
  const calculateVisibleRange = useCallback((scrollTop: number) => {
    const avgHeight = typeof itemHeight === 'number' ? itemHeight : 100;
    const startIndex = Math.floor(scrollTop / avgHeight);
    const endIndex = Math.min(
      items.length - 1,
      startIndex + Math.ceil(containerHeight / avgHeight) + 10 // overscan
    );

    return { startIndex: Math.max(0, startIndex), endIndex };
  }, [itemHeight, containerHeight, items.length]);

  // Update visible items when scroll position changes
  useEffect(() => {
    const { startIndex, endIndex } = calculateVisibleRange(scrollTop);
    setVisibleItems(items.slice(startIndex, endIndex + 1));
  }, [scrollTop, items, calculateVisibleRange]);

  const handleScroll = useCallback((newScrollTop: number) => {
    setScrollTop(newScrollTop);
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    // Simulate async loading
    await new Promise(resolve => setTimeout(resolve, 100));
    setIsLoading(false);
  }, [isLoading]);

  return {
    visibleItems,
    scrollTop,
    isLoading,
    handleScroll,
    loadMore,
  };
};

export default DoubaoVirtualScroll;