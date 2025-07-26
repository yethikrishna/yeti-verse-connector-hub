import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { DoubaoTypingIndicator } from '@/components/doubao/DoubaoTypingIndicator';

describe('DoubaoTypingIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders typing indicator when visible', () => {
    render(<DoubaoTypingIndicator isVisible={true} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('AI is typing...')).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    render(<DoubaoTypingIndicator isVisible={false} />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByText('AI is typing...')).not.toBeInTheDocument();
  });

  it('renders three animated dots', () => {
    render(<DoubaoTypingIndicator isVisible={true} />);

    const dots = screen.getAllByRole('generic').filter(el => 
      el.className.includes('rounded-full') && el.className.includes('bg-doubao-text-secondary')
    );
    
    expect(dots).toHaveLength(3);
  });

  it('applies staggered animation delays', () => {
    render(<DoubaoTypingIndicator isVisible={true} />);

    const dots = screen.getAllByRole('generic').filter(el => 
      el.className.includes('rounded-full')
    );

    // Each dot should have different animation delay
    expect(dots[0]).toHaveStyle('animation-delay: 0ms');
    expect(dots[1]).toHaveStyle('animation-delay: 150ms');
    expect(dots[2]).toHaveStyle('animation-delay: 300ms');
  });

  it('supports different variants', () => {
    const { rerender } = render(
      <DoubaoTypingIndicator isVisible={true} variant="dots" />
    );

    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(
      <DoubaoTypingIndicator isVisible={true} variant="pulse" />
    );

    const indicator = screen.getByRole('status');
    expect(indicator.firstChild).toHaveClass('animate-pulse');

    rerender(
      <DoubaoTypingIndicator isVisible={true} variant="wave" />
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('supports custom text', () => {
    render(
      <DoubaoTypingIndicator 
        isVisible={true} 
        text="Assistant is thinking..."
      />
    );

    expect(screen.getByText('Assistant is thinking...')).toBeInTheDocument();
  });

  it('animates in and out smoothly', async () => {
    const { rerender } = render(
      <DoubaoTypingIndicator isVisible={false} />
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    rerender(<DoubaoTypingIndicator isVisible={true} />);

    const indicator = screen.getByRole('status');
    expect(indicator).toHaveClass('animate-in');

    rerender(<DoubaoTypingIndicator isVisible={false} />);

    // Should animate out
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
  });

  it('maintains accessibility attributes', () => {
    render(<DoubaoTypingIndicator isVisible={true} />);

    const indicator = screen.getByRole('status');
    expect(indicator).toHaveAttribute('aria-live', 'polite');
    expect(indicator).toHaveAttribute('aria-label', 'AI is typing');
  });

  it('supports custom size', () => {
    render(
      <DoubaoTypingIndicator 
        isVisible={true} 
        size="lg"
      />
    );

    const dots = screen.getAllByRole('generic').filter(el => 
      el.className.includes('rounded-full')
    );

    dots.forEach(dot => {
      expect(dot).toHaveClass('w-3', 'h-3'); // Large size
    });
  });

  it('handles rapid visibility changes', async () => {
    const { rerender } = render(
      <DoubaoTypingIndicator isVisible={true} />
    );

    expect(screen.getByRole('status')).toBeInTheDocument();

    // Rapid toggle
    rerender(<DoubaoTypingIndicator isVisible={false} />);
    rerender(<DoubaoTypingIndicator isVisible={true} />);
    rerender(<DoubaoTypingIndicator isVisible={false} />);
    rerender(<DoubaoTypingIndicator isVisible={true} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('cleans up animations on unmount', () => {
    const { unmount } = render(
      <DoubaoTypingIndicator isVisible={true} />
    );

    expect(screen.getByRole('status')).toBeInTheDocument();

    unmount();

    // Should not cause memory leaks
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('supports custom className', () => {
    render(
      <DoubaoTypingIndicator 
        isVisible={true} 
        className="custom-typing-indicator"
      />
    );

    const indicator = screen.getByRole('status');
    expect(indicator).toHaveClass('custom-typing-indicator');
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

    render(<DoubaoTypingIndicator isVisible={true} />);

    const dots = screen.getAllByRole('generic').filter(el => 
      el.className.includes('rounded-full')
    );

    // Should disable animations for reduced motion
    dots.forEach(dot => {
      expect(dot).toHaveClass('motion-reduce:animate-none');
    });
  });
});