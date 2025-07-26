import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DoubaoButton } from '@/components/doubao/DoubaoButton';

describe('DoubaoButton', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders button with text', () => {
    render(<DoubaoButton onClick={mockOnClick}>Click me</DoubaoButton>);

    expect(screen.getByText('Click me')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    
    render(<DoubaoButton onClick={mockOnClick}>Click me</DoubaoButton>);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('supports different variants', () => {
    const { rerender } = render(
      <DoubaoButton variant="primary" onClick={mockOnClick}>Primary</DoubaoButton>
    );

    let button = screen.getByRole('button');
    expect(button).toHaveClass('doubao-gradient-blue');

    rerender(
      <DoubaoButton variant="secondary" onClick={mockOnClick}>Secondary</DoubaoButton>
    );

    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-doubao-secondary');

    rerender(
      <DoubaoButton variant="ghost" onClick={mockOnClick}>Ghost</DoubaoButton>
    );

    button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-doubao-hover');
  });

  it('supports different sizes', () => {
    const { rerender } = render(
      <DoubaoButton size="sm" onClick={mockOnClick}>Small</DoubaoButton>
    );

    let button = screen.getByRole('button');
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(
      <DoubaoButton size="md" onClick={mockOnClick}>Medium</DoubaoButton>
    );

    button = screen.getByRole('button');
    expect(button).toHaveClass('px-4', 'py-2', 'text-base');

    rerender(
      <DoubaoButton size="lg" onClick={mockOnClick}>Large</DoubaoButton>
    );

    button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('handles disabled state', async () => {
    const user = userEvent.setup();
    
    render(
      <DoubaoButton disabled onClick={mockOnClick}>
        Disabled
      </DoubaoButton>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');

    await user.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(
      <DoubaoButton loading onClick={mockOnClick}>
        Loading
      </DoubaoButton>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    // Should show loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('supports icons', () => {
    const TestIcon = () => <svg data-testid="test-icon" />;
    
    render(
      <DoubaoButton 
        onClick={mockOnClick}
        leftIcon={<TestIcon />}
        rightIcon={<TestIcon />}
      >
        With Icons
      </DoubaoButton>
    );

    const icons = screen.getAllByTestId('test-icon');
    expect(icons).toHaveLength(2);
  });

  it('supports full width', () => {
    render(
      <DoubaoButton fullWidth onClick={mockOnClick}>
        Full Width
      </DoubaoButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('handles keyboard activation', async () => {
    const user = userEvent.setup();
    
    render(<DoubaoButton onClick={mockOnClick}>Keyboard</DoubaoButton>);

    const button = screen.getByRole('button');
    button.focus();

    // Enter key
    await user.keyboard('{Enter}');
    expect(mockOnClick).toHaveBeenCalledTimes(1);

    // Space key
    await user.keyboard(' ');
    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });

  it('applies hover effects', async () => {
    const user = userEvent.setup();
    
    render(<DoubaoButton onClick={mockOnClick}>Hover me</DoubaoButton>);

    const button = screen.getByRole('button');
    
    await user.hover(button);
    expect(button).toHaveClass('transition-all', 'duration-150');
  });

  it('supports custom className', () => {
    render(
      <DoubaoButton 
        onClick={mockOnClick}
        className="custom-class"
      >
        Custom
      </DoubaoButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    
    render(
      <DoubaoButton ref={ref} onClick={mockOnClick}>
        Ref test
      </DoubaoButton>
    );

    expect(ref).toHaveBeenCalled();
  });

  it('supports as prop for polymorphic rendering', () => {
    render(
      <DoubaoButton as="a" href="/test" onClick={mockOnClick}>
        Link Button
      </DoubaoButton>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('handles focus and blur events', async () => {
    const user = userEvent.setup();
    const mockOnFocus = vi.fn();
    const mockOnBlur = vi.fn();
    
    render(
      <DoubaoButton 
        onClick={mockOnClick}
        onFocus={mockOnFocus}
        onBlur={mockOnBlur}
      >
        Focus test
      </DoubaoButton>
    );

    const button = screen.getByRole('button');
    
    await user.click(button);
    expect(mockOnFocus).toHaveBeenCalled();
    
    await user.tab();
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('prevents double clicks when loading', async () => {
    const user = userEvent.setup();
    
    render(
      <DoubaoButton loading onClick={mockOnClick}>
        Loading
      </DoubaoButton>
    );

    const button = screen.getByRole('button');
    
    await user.click(button);
    await user.click(button);
    
    expect(mockOnClick).not.toHaveBeenCalled();
  });
});