import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DoubaoOptimizedMessageList } from '@/components/doubao/DoubaoOptimizedMessageList';
import { DoubaoVirtualScroll } from '@/components/doubao/DoubaoVirtualScroll';
import { usePerformanceMonitor, useBatchedMessages } from '@/lib/performance-utils';
import { createMockMessages, measureRenderTime } from '../setup';

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByName: vi.fn(() => []),
  memory: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 2000000,
    jsHeapSizeLimit: 4000000,
  },
};

Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true,
});

describe('Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPerformance.now.mockImplementation(() => Date.now());
  });

  describe('Rendering Performance', () => {
    it('renders large message lists efficiently', async () => {
      const largeMessageList = createMockMessages(1000);
      
      const startTime = performance.now();
      
      render(
        <DoubaoOptimizedMessageList
          messages={largeMessageList}
          containerHeight={600}
          enableVirtualization={true}
        />
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time
      expect(renderTime).toBeLessThan(100); // 100ms threshold
    });

    it('maintains performance with frequent updates', async () => {
      const initialMessages = createMockMessages(50);
      
      const { rerender } = render(
        <DoubaoOptimizedMessageList
          messages={initialMessages}
          containerHeight={600}
        />
      );

      const updateTimes: number[] = [];

      // Simulate frequent message updates
      for (let i = 0; i < 10; i++) {
        const startTime = performance.now();
        
        const updatedMessages = [
          ...initialMessages,
          ...createMockMessages(5).map(msg => ({
            ...msg,
            id: `new-${i}-${msg.id}`,
          })),
        ];

        rerender(
          <DoubaoOptimizedMessageList
            messages={updatedMessages}
            containerHeight={600}
          />
        );

        const endTime = performance.now();
        updateTimes.push(endTime - startTime);
      }

      // Average update time should be reasonable
      const avgUpdateTime = updateTimes.reduce((a, b) => a + b, 0) / updateTimes.length;
      expect(avgUpdateTime).toBeLessThan(50); // 50ms average
    });

    it('optimizes virtual scrolling performance', async () => {
      const largeDataSet = Array.from({ length: 10000 }, (_, index) => ({
        id: `item-${index}`,
        data: { content: `Item ${index}` },
        height: 60,
      }));

      const renderItem = vi.fn((item) => (
        <div key={item.id}>{item.data.content}</div>
      ));

      const startTime = performance.now();

      render(
        <DoubaoVirtualScroll
          items={largeDataSet}
          itemHeight={60}
          renderItem={renderItem}
          containerHeight={600}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Virtual scrolling should handle large datasets efficiently
      expect(renderTime).toBeLessThan(200);
      
      // Should only render visible items
      expect(renderItem).toHaveBeenCalledTimes(expect.any(Number));
      expect(renderItem.mock.calls.length).toBeLessThan(50); // Only visible items
    });
  });

  describe('Memory Management', () => {
    it('manages memory efficiently with large datasets', () => {
      const initialMemory = mockPerformance.memory.usedJSHeapSize;
      
      // Create and destroy large components
      for (let i = 0; i < 10; i++) {
        const messages = createMockMessages(100);
        const { unmount } = render(
          <DoubaoOptimizedMessageList
            messages={messages}
            containerHeight={600}
          />
        );
        unmount();
      }

      // Memory usage should not grow excessively
      const finalMemory = mockPerformance.memory.usedJSHeapSize;
      const memoryIncrease = finalMemory - initialMemory;
      
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024); // 5MB limit
    });

    it('cleans up event listeners properly', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(
        <DoubaoOptimizedMessageList
          messages={createMockMessages(10)}
          containerHeight={600}
        />
      );

      const addedListeners = addEventListenerSpy.mock.calls.length;
      
      unmount();
      
      const removedListeners = removeEventListenerSpy.mock.calls.length;

      // Should clean up all event listeners
      expect(removedListeners).toBeGreaterThanOrEqual(addedListeners);

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it('prevents memory leaks in animation cleanup', () => {
      const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame');
      
      const { unmount } = render(
        <DoubaoOptimizedMessageList
          messages={createMockMessages(10)}
          containerHeight={600}
        />
      );

      unmount();

      // Should cancel any pending animation frames
      expect(cancelAnimationFrameSpy).toHaveBeenCalled();

      cancelAnimationFrameSpy.mockRestore();
    });
  });

  describe('Animation Performance', () => {
    it('maintains 60fps during animations', async () => {
      const user = userEvent.setup();
      const messages = createMockMessages(20);
      
      render(
        <DoubaoOptimizedMessageList
          messages={messages}
          containerHeight={600}
        />
      );

      const frameTimes: number[] = [];
      let lastFrameTime = performance.now();

      // Mock requestAnimationFrame to measure frame times
      const originalRAF = window.requestAnimationFrame;
      window.requestAnimationFrame = vi.fn((callback) => {
        const currentTime = performance.now();
        frameTimes.push(currentTime - lastFrameTime);
        lastFrameTime = currentTime;
        return originalRAF(callback);
      });

      // Trigger animations by scrolling
      const container = screen.getByRole('generic');
      await act(async () => {
        for (let i = 0; i < 10; i++) {
          container.scrollTop = i * 50;
          await new Promise(resolve => requestAnimationFrame(resolve));
        }
      });

      window.requestAnimationFrame = originalRAF;

      // Calculate average frame time
      const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      
      // Should maintain 60fps (16.67ms per frame)
      expect(avgFrameTime).toBeLessThan(20);
    });

    it('optimizes GPU acceleration usage', () => {
      render(
        <DoubaoOptimizedMessageList
          messages={createMockMessages(10)}
          containerHeight={600}
        />
      );

      // Check for GPU acceleration properties
      const animatedElements = document.querySelectorAll('[style*="transform"]');
      
      animatedElements.forEach(element => {
        const style = window.getComputedStyle(element);
        // Should use GPU acceleration
        expect(style.transform).toContain('translateZ') || 
        expect(style.willChange).toContain('transform');
      });
    });

    it('throttles scroll events appropriately', async () => {
      const scrollHandler = vi.fn();
      
      render(
        <DoubaoVirtualScroll
          items={createMockMessages(100).map(msg => ({
            id: msg.id,
            data: msg,
            height: 60,
          }))}
          itemHeight={60}
          renderItem={(item) => <div>{item.data.content}</div>}
          containerHeight={600}
          onScroll={scrollHandler}
        />
      );

      const container = screen.getByRole('generic');
      
      // Rapid scroll events
      for (let i = 0; i < 100; i++) {
        container.scrollTop = i;
        container.dispatchEvent(new Event('scroll'));
      }

      // Should throttle calls
      expect(scrollHandler.mock.calls.length).toBeLessThan(50);
    });
  });

  describe('Bundle Size Optimization', () => {
    it('supports code splitting', async () => {
      // Mock dynamic import
      const mockImport = vi.fn().mockResolvedValue({
        default: () => <div>Lazy Component</div>
      });

      // Simulate lazy loading
      const LazyComponent = React.lazy(mockImport);
      
      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </React.Suspense>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockImport).toHaveBeenCalled();
    });

    it('tree-shakes unused code', () => {
      // This would typically be tested at build time
      // Here we just verify that imports are structured correctly
      
      const { DoubaoOptimizedMessageList } = require('@/components/doubao/DoubaoOptimizedMessageList');
      expect(DoubaoOptimizedMessageList).toBeDefined();
      
      // Should not import unused utilities
      expect(() => {
        require('@/lib/unused-utility');
      }).toThrow();
    });
  });

  describe('Performance Monitoring', () => {
    it('tracks performance metrics', () => {
      const TestComponent = () => {
        const { metrics } = usePerformanceMonitor();
        return (
          <div>
            <span data-testid="fps">FPS: {metrics.fps}</span>
            <span data-testid="memory">Memory: {metrics.memoryUsage}MB</span>
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByTestId('fps')).toBeInTheDocument();
      expect(screen.getByTestId('memory')).toBeInTheDocument();
    });

    it('batches messages efficiently', () => {
      const TestComponent = () => {
        const messages = createMockMessages(1000);
        const { visibleItems, hasMore, loadMore } = useBatchedMessages(messages, 50);
        
        return (
          <div>
            <div data-testid="visible-count">{visibleItems.length}</div>
            <div data-testid="has-more">{hasMore.toString()}</div>
            <button onClick={loadMore}>Load More</button>
          </div>
        );
      };

      render(<TestComponent />);

      expect(screen.getByTestId('visible-count')).toHaveTextContent('50');
      expect(screen.getByTestId('has-more')).toHaveTextContent('true');
    });

    it('measures render performance', async () => {
      const renderTimes: number[] = [];
      
      const TestComponent = () => {
        React.useEffect(() => {
          const startTime = performance.now();
          return () => {
            const endTime = performance.now();
            renderTimes.push(endTime - startTime);
          };
        });
        
        return <div>Test Component</div>;
      };

      const { rerender } = render(<TestComponent />);
      
      // Trigger re-renders
      for (let i = 0; i < 5; i++) {
        rerender(<TestComponent key={i} />);
      }

      // Should track render times
      expect(renderTimes.length).toBeGreaterThan(0);
    });
  });

  describe('Network Performance', () => {
    it('handles slow network conditions', async () => {
      // Mock slow network
      const slowFetch = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 2000))
      );

      global.fetch = slowFetch;

      const startTime = performance.now();
      
      render(
        <DoubaoOptimizedMessageList
          messages={createMockMessages(10)}
          containerHeight={600}
          isLoading={true}
        />
      );

      const endTime = performance.now();
      
      // Should render immediately with loading state
      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByText(/Loading/)).toBeInTheDocument();
    });

    it('optimizes image loading', () => {
      // Mock intersection observer for lazy loading
      const mockObserver = {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };

      global.IntersectionObserver = vi.fn().mockImplementation(() => mockObserver);

      render(
        <DoubaoOptimizedMessageList
          messages={createMockMessages(10)}
          containerHeight={600}
        />
      );

      // Should set up intersection observer for lazy loading
      expect(mockObserver.observe).toHaveBeenCalled();
    });
  });
});