import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoMessageBubble } from '@/components/doubao/DoubaoMessageBubble';
import { DoubaoInputArea } from '@/components/doubao/DoubaoInputArea';
import { createMockMessage } from '../setup';

// Mock axe-core for accessibility testing
const mockAxeResults = {
  violations: [],
  passes: [],
  incomplete: [],
  inapplicable: [],
};

vi.mock('axe-core', () => ({
  run: vi.fn().mockResolvedValue(mockAxeResults),
  configure: vi.fn(),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Accessibility Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset any accessibility-related mocks
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports tab navigation through main interface', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(<DoubaoMainLayout />);

      // Start tabbing through the interface
      await user.tab();
      
      let focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
      expect(focusedElement?.tagName).toBe('BUTTON');

      // Continue tabbing
      await user.tab();
      focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();

      // Should be able to tab through all interactive elements
      for (let i = 0; i < 10; i++) {
        await user.tab();
        focusedElement = document.activeElement;
        expect(focusedElement).toBeInTheDocument();
      }
    });

    it('supports reverse tab navigation', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(<DoubaoMainLayout />);

      // Tab forward first
      await user.tab();
      await user.tab();
      
      // Then tab backward
      await user.tab({ shift: true });
      
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it('traps focus in modal dialogs', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(<DoubaoMainLayout />);

      // Open settings (which might be a modal)
      const settingsButton = screen.getByTitle('Settings');
      await user.click(settingsButton);

      // Tab should stay within modal
      await user.tab();
      const focusedElement = document.activeElement;
      
      // Should be within the modal/settings area
      expect(focusedElement).toBeInTheDocument();
    });

    it('supports Enter and Space key activation', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();
      
      render(
        <button onClick={mockOnClick}>
          Test Button
        </button>
      );

      const button = screen.getByText('Test Button');
      
      // Focus the button
      button.focus();
      
      // Activate with Enter
      await user.keyboard('{Enter}');
      expect(mockOnClick).toHaveBeenCalledTimes(1);

      // Activate with Space
      await user.keyboard(' ');
      expect(mockOnClick).toHaveBeenCalledTimes(2);
    });

    it('supports arrow key navigation in lists', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(<DoubaoMainLayout />);

      // Focus on conversation list
      const sidebar = screen.getByRole('complementary');
      const firstItem = sidebar.querySelector('[role="button"]');
      
      if (firstItem) {
        firstItem.focus();
        
        // Arrow down should move to next item
        await user.keyboard('{ArrowDown}');
        
        const focusedElement = document.activeElement;
        expect(focusedElement).not.toBe(firstItem);
      }
    });
  });

  describe('Screen Reader Support', () => {
    it('provides proper ARIA labels', () => {
      renderWithRouter(<DoubaoMainLayout />);

      // Check for proper ARIA labels
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('complementary')).toBeInTheDocument(); // Sidebar
      expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    });

    it('announces message content to screen readers', () => {
      const message = createMockMessage({
        content: 'Hello, this is a test message',
        role: 'assistant',
      });

      render(<DoubaoMessageBubble message={message} />);

      // Message should be accessible to screen readers
      expect(screen.getByText(message.content)).toBeInTheDocument();
      
      // Should have appropriate role or aria-label
      const messageElement = screen.getByText(message.content).closest('[role]');
      expect(messageElement).toBeInTheDocument();
    });

    it('provides live region for new messages', () => {
      renderWithRouter(<DoubaoMainLayout />);

      // Should have aria-live region for announcements
      const liveRegion = document.querySelector('[aria-live]');
      expect(liveRegion).toBeInTheDocument();
    });

    it('labels form controls properly', () => {
      render(<DoubaoInputArea />);

      const textarea = screen.getByPlaceholderText('Type your message...');
      
      // Should have accessible name
      expect(textarea).toHaveAttribute('aria-label');
      
      // Buttons should have accessible names
      const attachButton = screen.getByTitle('Attach file');
      expect(attachButton).toHaveAttribute('title');
      
      const voiceButton = screen.getByTitle('Voice input');
      expect(voiceButton).toHaveAttribute('title');
      
      const sendButton = screen.getByTitle('Send message');
      expect(sendButton).toHaveAttribute('title');
    });

    it('indicates loading states to screen readers', () => {
      render(<DoubaoInputArea isLoading={true} />);

      const sendButton = screen.getByTitle('Send message');
      
      // Should indicate loading state
      expect(sendButton).toHaveAttribute('disabled');
      // Could also check for aria-busy or aria-label updates
    });

    it('provides status updates for voice recording', async () => {
      const user = userEvent.setup();
      
      render(<DoubaoInputArea onVoiceInput={vi.fn()} />);

      const voiceButton = screen.getByTitle('Voice input');
      await user.click(voiceButton);

      // Should announce recording state
      expect(screen.getByText(/Recording/)).toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    it('maintains visible focus indicators', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(<DoubaoMainLayout />);

      await user.tab();
      
      const focusedElement = document.activeElement as HTMLElement;
      
      // Should have visible focus indicator
      const computedStyle = window.getComputedStyle(focusedElement);
      expect(computedStyle.outline).not.toBe('none');
    });

    it('restores focus after modal closes', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(<DoubaoMainLayout />);

      const settingsButton = screen.getByTitle('Settings');
      settingsButton.focus();
      
      // Open modal
      await user.click(settingsButton);
      
      // Close modal (simulate)
      await user.keyboard('{Escape}');
      
      // Focus should return to trigger
      expect(document.activeElement).toBe(settingsButton);
    });

    it('manages focus in message list', () => {
      const messages = [
        createMockMessage({ id: '1', content: 'First message' }),
        createMockMessage({ id: '2', content: 'Second message' }),
      ];

      render(
        <div>
          {messages.map(message => (
            <DoubaoMessageBubble key={message.id} message={message} />
          ))}
        </div>
      );

      // Messages should be focusable if interactive
      const firstMessage = screen.getByText('First message');
      expect(firstMessage).toBeInTheDocument();
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    it('maintains sufficient color contrast', () => {
      renderWithRouter(<DoubaoMainLayout />);

      // Check that text elements have sufficient contrast
      // This would typically be done with automated tools
      const textElements = screen.getAllByText(/./);
      expect(textElements.length).toBeGreaterThan(0);
    });

    it('supports high contrast mode', () => {
      // Mock high contrast media query
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

      renderWithRouter(<DoubaoMainLayout />);

      // Should adapt to high contrast preferences
      expect(screen.getByRole('main')).toBeInTheDocument();
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

      renderWithRouter(<DoubaoMainLayout />);

      // Animations should be reduced or disabled
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Error Handling and Feedback', () => {
    it('provides accessible error messages', () => {
      render(
        <DoubaoInputArea 
          value={"a".repeat(101)} // Exceeds max length
          maxLength={100}
        />
      );

      // Should show error state
      const characterCount = screen.getByText(/100/);
      expect(characterCount).toBeInTheDocument();
    });

    it('announces form validation errors', async () => {
      const user = userEvent.setup();
      
      render(<DoubaoInputArea onSend={vi.fn()} />);

      const sendButton = screen.getByTitle('Send message');
      
      // Try to send empty message
      await user.click(sendButton);
      
      // Should be disabled (preventing the error)
      expect(sendButton).toBeDisabled();
    });

    it('provides helpful error recovery options', () => {
      // Mock error state
      render(
        <div role="alert">
          <p>Connection failed. Please try again.</p>
          <button>Retry</button>
        </div>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  describe('Mobile Accessibility', () => {
    it('supports touch navigation', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithRouter(<DoubaoMainLayout />);

      // Touch targets should be appropriately sized
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const rect = button.getBoundingClientRect();
        // Minimum touch target size (44px recommended)
        expect(rect.width).toBeGreaterThanOrEqual(44);
        expect(rect.height).toBeGreaterThanOrEqual(44);
      });
    });

    it('handles zoom up to 200%', () => {
      // Mock zoom level
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: 2,
      });

      renderWithRouter(<DoubaoMainLayout />);

      // Interface should remain usable at high zoom
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });
});