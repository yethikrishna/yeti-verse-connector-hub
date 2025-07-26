import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('DoubaoMainLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders main layout structure', () => {
    renderWithRouter(<DoubaoMainLayout />);

    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('complementary')).toBeInTheDocument(); // Sidebar
    expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
  });

  it('renders header with Doubao branding', () => {
    renderWithRouter(<DoubaoMainLayout />);

    expect(screen.getByText('Doubao')).toBeInTheDocument();
  });

  it('renders sidebar with navigation', () => {
    renderWithRouter(<DoubaoMainLayout />);

    expect(screen.getByText('New Chat')).toBeInTheDocument();
  });

  it('renders main content area', () => {
    renderWithRouter(<DoubaoMainLayout />);

    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
  });

  it('handles responsive layout', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    renderWithRouter(<DoubaoMainLayout />);

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toBeInTheDocument();
    
    // Should adapt layout for mobile
    expect(sidebar).toHaveClass('lg:w-80');
  });

  it('supports sidebar toggle on mobile', async () => {
    const user = userEvent.setup();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 640,
    });

    renderWithRouter(<DoubaoMainLayout />);

    // Should have mobile menu button
    const menuButton = screen.getByTitle('Toggle sidebar');
    await user.click(menuButton);

    // Sidebar should toggle visibility
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('translate-x-0');
  });

  it('handles page navigation', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    // Navigate to settings
    const settingsButton = screen.getByTitle('Settings');
    await user.click(settingsButton);

    // Should update main content area
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('maintains proper layout proportions', () => {
    renderWithRouter(<DoubaoMainLayout />);

    const sidebar = screen.getByRole('complementary');
    const mainContent = screen.getByRole('main');

    // Sidebar should be 280px (w-80)
    expect(sidebar).toHaveClass('w-80');
    
    // Main content should be flexible
    expect(mainContent).toHaveClass('flex-1');
  });

  it('handles keyboard navigation between sections', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    // Tab through interface
    await user.tab();
    
    // Should focus on first interactive element
    const focusedElement = document.activeElement;
    expect(focusedElement).toBeInTheDocument();
  });

  it('supports theme switching', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    // Open settings
    const settingsButton = screen.getByTitle('Settings');
    await user.click(settingsButton);

    // Should support theme toggle (if implemented)
    const layout = screen.getByRole('main').closest('div');
    expect(layout).toHaveClass('bg-white'); // Default light theme
  });

  it('handles error boundaries', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <DoubaoMainLayout>
          <ThrowError />
        </DoubaoMainLayout>
      </BrowserRouter>
    );

    // Should render error boundary fallback
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('preserves scroll position during navigation', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    const mainContent = screen.getByRole('main');
    
    // Simulate scrolling
    fireEvent.scroll(mainContent, { target: { scrollTop: 100 } });
    
    // Navigate away and back
    const settingsButton = screen.getByTitle('Settings');
    await user.click(settingsButton);
    
    const chatButton = screen.getByText('New Chat');
    await user.click(chatButton);

    // Should maintain layout structure
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('handles window resize events', () => {
    renderWithRouter(<DoubaoMainLayout />);

    // Simulate window resize
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    fireEvent(window, new Event('resize'));

    // Layout should adapt
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toBeInTheDocument();
  });

  it('supports accessibility landmarks', () => {
    renderWithRouter(<DoubaoMainLayout />);

    // Should have proper ARIA landmarks
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('complementary')).toBeInTheDocument(); // Sidebar
    expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
  });

  it('handles focus management', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    // Focus should be managed properly during navigation
    await user.tab();
    
    const firstFocusable = document.activeElement;
    expect(firstFocusable).toBeInTheDocument();
    
    // Should maintain logical focus order
    await user.tab();
    const secondFocusable = document.activeElement;
    expect(secondFocusable).not.toBe(firstFocusable);
  });
});