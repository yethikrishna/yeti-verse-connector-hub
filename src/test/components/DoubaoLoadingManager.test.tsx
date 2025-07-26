import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { DoubaoLoadingManager } from '@/components/doubao/DoubaoLoadingManager';

describe('DoubaoLoadingManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when not loading', () => {
    render(
      <DoubaoLoadingManager isLoading={false}>
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    expect(screen.getByText('Content loaded')).toBeInTheDocument();
  });

  it('renders loading state when loading', () => {
    render(
      <DoubaoLoadingManager isLoading={true}>
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Content loaded')).not.toBeInTheDocument();
  });

  it('supports custom loading text', () => {
    render(
      <DoubaoLoadingManager isLoading={true} loadingText="Please wait...">
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('supports skeleton loading variant', () => {
    render(
      <DoubaoLoadingManager isLoading={true} variant="skeleton">
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    const skeletonElements = screen.getAllByRole('generic').filter(el =>
      el.className.includes('animate-pulse')
    );
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('supports spinner loading variant', () => {
    render(
      <DoubaoLoadingManager isLoading={true} variant="spinner">
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    const spinner = screen.getByRole('status');
    expect(spinner.firstChild).toHaveClass('animate-spin');
  });

  it('supports dots loading variant', () => {
    render(
      <DoubaoLoadingManager isLoading={true} variant="dots">
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    const dots = screen.getAllByRole('generic').filter(el =>
      el.className.includes('rounded-full')
    );
    expect(dots).toHaveLength(3);
  });

  it('handles loading state transitions smoothly', async () => {
    const { rerender } = render(
      <DoubaoLoadingManager isLoading={true}>
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(
      <DoubaoLoadingManager isLoading={false}>
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(screen.getByText('Content loaded')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('supports minimum loading duration', async () => {
    const { rerender } = render(
      <DoubaoLoadingManager isLoading={true} minDuration={500}>
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();

    // Try to stop loading immediately
    rerender(
      <DoubaoLoadingManager isLoading={false} minDuration={500}>
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    // Should still be loading due to minimum duration
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Wait for minimum duration
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
    });

    expect(screen.getByText('Content loaded')).toBeInTheDocument();
  });

  it('supports delay before showing loading', async () => {
    const { rerender } = render(
      <DoubaoLoadingManager isLoading={false} delay={200}>
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    expect(screen.getByText('Content loaded')).toBeInTheDocument();

    rerender(
      <DoubaoLoadingManager isLoading={true} delay={200}>
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    // Should not show loading immediately due to delay
    expect(screen.getByText('Content loaded')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    // Wait for delay
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 250));
    });

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('cancels delayed loading if loading stops', async () => {
    const { rerender } = render(
      <DoubaoLoadingManager isLoading={true} delay={200}>
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    // Stop loading before delay expires
    rerender(
      <DoubaoLoadingManager isLoading={false} delay={200}>
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    // Wait past the delay
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 250));
    });

    // Should show content, not loading
    expect(screen.getByText('Content loaded')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('supports custom loading component', () => {
    const CustomLoader = () => (
      <div role="status">
        <span>Custom loading...</span>
      </div>
    );

    render(
      <DoubaoLoadingManager 
        isLoading={true} 
        loadingComponent={<CustomLoader />}
      >
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    expect(screen.getByText('Custom loading...')).toBeInTheDocument();
  });

  it('maintains accessibility attributes', () => {
    render(
      <DoubaoLoadingManager isLoading={true}>
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toHaveAttribute('aria-live', 'polite');
    expect(loadingElement).toHaveAttribute('aria-label', 'Loading content');
  });

  it('supports different sizes', () => {
    render(
      <DoubaoLoadingManager isLoading={true} size="lg">
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    const loadingElement = screen.getByRole('status');
    expect(loadingElement.firstChild).toHaveClass('w-8', 'h-8'); // Large size
  });

  it('handles rapid loading state changes', async () => {
    const { rerender } = render(
      <DoubaoLoadingManager isLoading={false}>
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    // Rapid state changes
    for (let i = 0; i < 5; i++) {
      rerender(
        <DoubaoLoadingManager isLoading={true}>
          <div>Content loaded</div>
        </DoubaoLoadingManager>
      );

      rerender(
        <DoubaoLoadingManager isLoading={false}>
          <div>Content loaded</div>
        </DoubaoLoadingManager>
      );
    }

    // Should handle gracefully
    expect(screen.getByText('Content loaded')).toBeInTheDocument();
  });

  it('cleans up timers on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount } = render(
      <DoubaoLoadingManager isLoading={true} delay={1000}>
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it('supports overlay loading mode', () => {
    render(
      <DoubaoLoadingManager isLoading={true} overlay={true}>
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    // Should show both content and loading overlay
    expect(screen.getByText('Content loaded')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();

    const overlay = screen.getByRole('status').closest('div');
    expect(overlay).toHaveClass('absolute', 'inset-0');
  });

  it('respects reduced motion preferences', () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <DoubaoLoadingManager isLoading={true} variant="spinner">
        <div>Content loaded</div>
      </DoubaoLoadingManager>
    );

    const spinner = screen.getByRole('status').firstChild;
    expect(spinner).toHaveClass('motion-reduce:animate-none');
  });
});