import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DoubaoErrorBoundary } from '@/components/doubao/DoubaoErrorBoundary';

const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

describe('DoubaoErrorBoundary', () => {
  let consoleSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for error boundary tests
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <DoubaoErrorBoundary>
        <div>Test content</div>
      </DoubaoErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error fallback when child component throws', () => {
    render(
      <DoubaoErrorBoundary>
        <ThrowError />
      </DoubaoErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
  });

  it('displays retry button in error state', () => {
    render(
      <DoubaoErrorBoundary>
        <ThrowError />
      </DoubaoErrorBoundary>
    );

    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('allows retry after error', async () => {
    const user = userEvent.setup();
    let shouldThrow = true;

    const { rerender } = render(
      <DoubaoErrorBoundary>
        <ThrowError shouldThrow={shouldThrow} />
      </DoubaoErrorBoundary>
    );

    // Should show error state
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Fix the error condition
    shouldThrow = false;

    // Click retry button
    const retryButton = screen.getByText('Try Again');
    await user.click(retryButton);

    // Re-render with fixed component
    rerender(
      <DoubaoErrorBoundary>
        <ThrowError shouldThrow={shouldThrow} />
      </DoubaoErrorBoundary>
    );

    // Should show normal content
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('supports custom fallback component', () => {
    const CustomFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
      <div>
        <h2>Custom Error: {error.message}</h2>
        <button onClick={retry}>Custom Retry</button>
      </div>
    );

    render(
      <DoubaoErrorBoundary fallback={CustomFallback}>
        <ThrowError />
      </DoubaoErrorBoundary>
    );

    expect(screen.getByText('Custom Error: Test error message')).toBeInTheDocument();
    expect(screen.getByText('Custom Retry')).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const mockOnError = vi.fn();

    render(
      <DoubaoErrorBoundary onError={mockOnError}>
        <ThrowError />
      </DoubaoErrorBoundary>
    );

    expect(mockOnError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });

  it('logs error details to console', () => {
    render(
      <DoubaoErrorBoundary>
        <ThrowError />
      </DoubaoErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error caught by DoubaoErrorBoundary:',
      expect.any(Error)
    );
  });

  it('resets error state on retry', async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <DoubaoErrorBoundary>
        <ThrowError />
      </DoubaoErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    const retryButton = screen.getByText('Try Again');
    await user.click(retryButton);

    // Re-render with non-throwing component
    rerender(
      <DoubaoErrorBoundary>
        <ThrowError shouldThrow={false} />
      </DoubaoErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('handles multiple error boundaries', () => {
    const OuterFallback = () => <div>Outer error boundary</div>;
    const InnerFallback = () => <div>Inner error boundary</div>;

    render(
      <DoubaoErrorBoundary fallback={OuterFallback}>
        <div>Outer content</div>
        <DoubaoErrorBoundary fallback={InnerFallback}>
          <ThrowError />
        </DoubaoErrorBoundary>
      </DoubaoErrorBoundary>
    );

    // Inner boundary should catch the error
    expect(screen.getByText('Inner error boundary')).toBeInTheDocument();
    expect(screen.getByText('Outer content')).toBeInTheDocument();
    expect(screen.queryByText('Outer error boundary')).not.toBeInTheDocument();
  });

  it('provides error details in development mode', () => {
    // Mock development environment
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <DoubaoErrorBoundary>
        <ThrowError />
      </DoubaoErrorBoundary>
    );

    // Should show more detailed error information in development
    expect(screen.getByText(/Test error message/)).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('handles async errors gracefully', async () => {
    const AsyncThrowError = () => {
      React.useEffect(() => {
        setTimeout(() => {
          throw new Error('Async error');
        }, 0);
      }, []);
      return <div>Async component</div>;
    };

    render(
      <DoubaoErrorBoundary>
        <AsyncThrowError />
      </DoubaoErrorBoundary>
    );

    // Should render normally initially (async errors aren't caught by error boundaries)
    expect(screen.getByText('Async component')).toBeInTheDocument();
  });

  it('maintains accessibility in error state', () => {
    render(
      <DoubaoErrorBoundary>
        <ThrowError />
      </DoubaoErrorBoundary>
    );

    // Error message should be announced to screen readers
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('aria-live', 'assertive');

    // Retry button should be accessible
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('supports custom error reporting', () => {
    const mockReportError = vi.fn();

    render(
      <DoubaoErrorBoundary onError={mockReportError}>
        <ThrowError />
      </DoubaoErrorBoundary>
    );

    expect(mockReportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object)
    );
  });
});