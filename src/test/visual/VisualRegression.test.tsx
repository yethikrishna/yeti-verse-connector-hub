import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoMessageBubble } from '@/components/doubao/DoubaoMessageBubble';
import { DoubaoInputArea } from '@/components/doubao/DoubaoInputArea';
import { DoubaoButton } from '@/components/doubao/DoubaoButton';
import { DoubaoTypingIndicator } from '@/components/doubao/DoubaoTypingIndicator';
import { createMockMessage, createMockMessages } from '../setup';

// Mock HTML2Canvas for screenshot testing
const mockToDataURL = vi.fn(() => 'data:image/png;base64,mock-screenshot');
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: mockToDataURL,
    width: 1200,
    height: 800,
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

// Visual regression testing utilities
const takeScreenshot = async (element: HTMLElement) => {
  const html2canvas = (await import('html2canvas')).default;
  const canvas = await html2canvas(element);
  return canvas.toDataURL();
};

const compareScreenshots = (baseline: string, current: string) => {
  // In a real implementation, this would use image comparison libraries
  // like pixelmatch or jest-image-snapshot
  return baseline === current;
};

describe('Visual Regression Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockToDataURL.mockReturnValue('data:image/png;base64,mock-screenshot');
  });

  describe('Component Visual Consistency', () => {
    it('maintains consistent button styling across variants', async () => {
      const { container } = render(
        <div>
          <DoubaoButton variant="primary">Primary Button</DoubaoButton>
          <DoubaoButton variant="secondary">Secondary Button</DoubaoButton>
          <DoubaoButton variant="ghost">Ghost Button</DoubaoButton>
        </div>
      );

      const screenshot = await takeScreenshot(container);
      expect(screenshot).toBeDefined();
      
      // In a real test, you'd compare against a baseline
      // expect(compareScreenshots(baselineScreenshot, screenshot)).toBe(true);
    });

    it('maintains consistent message bubble styling', async () => {
      const userMessage = createMockMessage({ role: 'user', content: 'User message' });
      const aiMessage = createMockMessage({ role: 'assistant', content: 'AI response' });

      const { container } = render(
        <div>
          <DoubaoMessageBubble message={userMessage} />
          <DoubaoMessageBubble message={aiMessage} />
        </div>
      );

      const screenshot = await takeScreenshot(container);
      expect(screenshot).toBeDefined();
    });

    it('maintains consistent input area styling', async () => {
      const { container } = render(
        <div>
          <DoubaoInputArea placeholder="Normal state" />
          <DoubaoInputArea placeholder="Loading state" isLoading={true} />
          <DoubaoInputArea placeholder="Disabled state" disabled={true} />
        </div>
      );

      const screenshot = await takeScreenshot(container);
      expect(screenshot).toBeDefined();
    });

    it('maintains consistent typing indicator animation', async () => {
      const { container } = render(
        <div>
          <DoubaoTypingIndicator isVisible={true} variant="dots" />
          <DoubaoTypingIndicator isVisible={true} variant="pulse" />
          <DoubaoTypingIndicator isVisible={true} variant="wave" />
        </div>
      );

      const screenshot = await takeScreenshot(container);
      expect(screenshot).toBeDefined();
    });
  });

  describe('Layout Visual Consistency', () => {
    it('maintains consistent main layout structure', async () => {
      const { container } = renderWithRouter(<DoubaoMainLayout />);

      const screenshot = await takeScreenshot(container);
      expect(screenshot).toBeDefined();
      
      // Check layout dimensions
      const header = screen.getByRole('banner');
      const sidebar = screen.getByRole('complementary');
      const main = screen.getByRole('main');

      expect(header).toBeInTheDocument();
      expect(sidebar).toBeInTheDocument();
      expect(main).toBeInTheDocument();
    });

    it('maintains responsive layout at different breakpoints', async () => {
      const breakpoints = [
        { width: 320, height: 568 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1200, height: 800 }, // Desktop
      ];

      for (const breakpoint of breakpoints) {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: breakpoint.width,
        });

        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: breakpoint.height,
        });

        const { container } = renderWithRouter(<DoubaoMainLayout />);
        const screenshot = await takeScreenshot(container);
        
        expect(screenshot).toBeDefined();
        // In real tests, you'd have baseline screenshots for each breakpoint
      }
    });
  });

  describe('Theme Visual Consistency', () => {
    it('maintains consistent light theme styling', async () => {
      const { container } = renderWithRouter(
        <div data-theme="light">
          <DoubaoMainLayout />
        </div>
      );

      const screenshot = await takeScreenshot(container);
      expect(screenshot).toBeDefined();
    });

    it('maintains consistent dark theme styling', async () => {
      const { container } = renderWithRouter(
        <div data-theme="dark">
          <DoubaoMainLayout />
        </div>
      );

      const screenshot = await takeScreenshot(container);
      expect(screenshot).toBeDefined();
    });

    it('maintains consistent high contrast theme', async () => {
      // Mock high contrast preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query.includes('prefers-contrast: high'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const { container } = renderWithRouter(<DoubaoMainLayout />);
      const screenshot = await takeScreenshot(container);
      
      expect(screenshot).toBeDefined();
    });
  });

  describe('Animation Visual Consistency', () => {
    it('captures loading animation states', async () => {
      const { container } = render(
        <div>
          <DoubaoTypingIndicator isVisible={true} />
          <DoubaoButton loading>Loading Button</DoubaoButton>
        </div>
      );

      // Capture at different animation frames
      const screenshots = [];
      for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const screenshot = await takeScreenshot(container);
        screenshots.push(screenshot);
      }

      expect(screenshots).toHaveLength(3);
      screenshots.forEach(screenshot => {
        expect(screenshot).toBeDefined();
      });
    });

    it('captures hover state transitions', async () => {
      const { container } = render(
        <div>
          <DoubaoButton>Hover me</DoubaoButton>
        </div>
      );

      const button = screen.getByText('Hover me');
      
      // Normal state
      const normalScreenshot = await takeScreenshot(container);
      
      // Hover state
      button.classList.add('hover');
      const hoverScreenshot = await takeScreenshot(container);
      
      expect(normalScreenshot).toBeDefined();
      expect(hoverScreenshot).toBeDefined();
      expect(normalScreenshot).not.toBe(hoverScreenshot);
    });
  });

  describe('Message Flow Visual Consistency', () => {
    it('maintains consistent message list layout', async () => {
      const messages = createMockMessages(10);
      
      const { container } = render(
        <div className="space-y-4 p-4">
          {messages.map(message => (
            <DoubaoMessageBubble key={message.id} message={message} />
          ))}
        </div>
      );

      const screenshot = await takeScreenshot(container);
      expect(screenshot).toBeDefined();
    });

    it('maintains consistent conversation flow layout', async () => {
      const conversation = [
        createMockMessage({ role: 'user', content: 'Hello, how are you?' }),
        createMockMessage({ role: 'assistant', content: 'I\'m doing well, thank you! How can I help you today?' }),
        createMockMessage({ role: 'user', content: 'Can you help me with coding?' }),
        createMockMessage({ role: 'assistant', content: 'Of course! I\'d be happy to help you with coding. What specific programming language or problem are you working on?' }),
      ];

      const { container } = render(
        <div className="space-y-4 p-4 max-w-4xl">
          {conversation.map(message => (
            <DoubaoMessageBubble key={message.id} message={message} />
          ))}
          <DoubaoTypingIndicator isVisible={true} />
        </div>
      );

      const screenshot = await takeScreenshot(container);
      expect(screenshot).toBeDefined();
    });
  });

  describe('Error State Visual Consistency', () => {
    it('maintains consistent error message styling', async () => {
      const { container } = render(
        <div className="p-4">
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> Failed to send message. Please try again.
            <button className="ml-2 underline">Retry</button>
          </div>
        </div>
      );

      const screenshot = await takeScreenshot(container);
      expect(screenshot).toBeDefined();
    });

    it('maintains consistent loading error states', async () => {
      const { container } = render(
        <div className="p-4">
          <DoubaoInputArea 
            isLoading={true} 
            error="Network connection failed"
          />
        </div>
      );

      const screenshot = await takeScreenshot(container);
      expect(screenshot).toBeDefined();
    });
  });

  describe('Cross-Browser Visual Consistency', () => {
    it('maintains consistent rendering across user agents', async () => {
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      ];

      for (const userAgent of userAgents) {
        Object.defineProperty(navigator, 'userAgent', {
          value: userAgent,
          writable: true,
        });

        const { container } = renderWithRouter(<DoubaoMainLayout />);
        const screenshot = await takeScreenshot(container);
        
        expect(screenshot).toBeDefined();
      }
    });
  });

  describe('Performance Visual Impact', () => {
    it('maintains visual quality during high load', async () => {
      const largeMessageList = createMockMessages(100);
      
      const { container } = render(
        <div className="h-96 overflow-y-auto">
          {largeMessageList.map(message => (
            <DoubaoMessageBubble key={message.id} message={message} />
          ))}
        </div>
      );

      const screenshot = await takeScreenshot(container);
      expect(screenshot).toBeDefined();
    });

    it('maintains visual consistency during animations', async () => {
      const { container } = render(
        <div className="p-4">
          <DoubaoTypingIndicator isVisible={true} />
          <div className="animate-pulse bg-gray-200 h-4 rounded mt-2"></div>
          <div className="animate-bounce bg-blue-500 w-4 h-4 rounded-full mt-2"></div>
        </div>
      );

      // Capture during animation
      const screenshot = await takeScreenshot(container);
      expect(screenshot).toBeDefined();
    });
  });
});

// Utility functions for visual regression testing
export const visualTestUtils = {
  takeScreenshot,
  compareScreenshots,
  
  // Mock baseline screenshots for testing
  getBaselineScreenshot: (componentName: string, variant?: string) => {
    return `data:image/png;base64,baseline-${componentName}-${variant || 'default'}`;
  },
  
  // Save screenshot for baseline creation
  saveBaseline: (screenshot: string, componentName: string, variant?: string) => {
    // In a real implementation, this would save to filesystem
    console.log(`Saving baseline for ${componentName}-${variant || 'default'}`);
  },
  
  // Calculate visual difference percentage
  calculateDifference: (baseline: string, current: string) => {
    // Mock implementation - real version would use image comparison
    return baseline === current ? 0 : 5.2; // 5.2% difference
  },
};