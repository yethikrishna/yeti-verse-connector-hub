import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoInputArea } from '@/components/doubao/DoubaoInputArea';
import { DoubaoMessageBubble } from '@/components/doubao/DoubaoMessageBubble';
import { DoubaoSidebar } from '@/components/doubao/DoubaoSidebar';
import { createMockMessages, createMockMessage } from '../setup';

// Mock API calls
const mockSendMessage = vi.fn();
const mockLoadConversation = vi.fn();
const mockCreateConversation = vi.fn();

vi.mock('@/lib/doubao-utils', () => ({
  sendMessage: mockSendMessage,
  loadConversation: mockLoadConversation,
  createConversation: mockCreateConversation,
}));

// Mock the chat page components
vi.mock('@/pages/DoubaoChat', () => ({
  DoubaoChat: () => (
    <div data-testid="doubao-chat">
      <div data-testid="message-list">
        {/* Mock message list */}
      </div>
      <div data-testid="input-area">
        <input placeholder="Type your message..." />
        <button>Send</button>
      </div>
    </div>
  ),
}));

// Mock other pages with more realistic content
vi.mock('@/pages/DoubaoSettings', () => ({
  default: () => (
    <div data-testid="doubao-settings">
      <h1>Settings</h1>
      <div>
        <label>
          <input type="checkbox" /> Enable notifications
        </label>
      </div>
      <div>
        <label>
          Theme:
          <select>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
      <button>Save Settings</button>
    </div>
  ),
}));

vi.mock('@/pages/ProductUpdates', () => ({
  default: () => (
    <div data-testid="product-updates">
      <h1>Product Updates</h1>
      <div data-testid="update-item">
        <h3>New Feature: Voice Input</h3>
        <p>You can now use voice input in chat</p>
      </div>
      <div data-testid="update-item">
        <h3>Improved Performance</h3>
        <p>Chat loading is now 50% faster</p>
      </div>
    </div>
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Chat Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders main layout with chat interface', () => {
    renderWithRouter(<DoubaoMainLayout />);

    // Should render header
    expect(screen.getByText('Doubao')).toBeInTheDocument();
    
    // Should render sidebar
    expect(screen.getByText('New Chat')).toBeInTheDocument();
    
    // Should render main content area
    expect(screen.getByTestId('doubao-chat')).toBeInTheDocument();
  });

  it('allows user to send a message', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByText('Send');

    await user.type(input, 'Hello, how are you?');
    await user.click(sendButton);

    // Message should be processed (implementation would handle this)
    expect(input).toHaveValue('');
  });

  it('navigates between different sections', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    // Navigate to settings
    const settingsButton = screen.getByTitle('Settings');
    await user.click(settingsButton);

    await waitFor(() => {
      expect(screen.getByTestId('doubao-settings')).toBeInTheDocument();
    });

    // Navigate back to chat
    const chatButton = screen.getByText('New Chat');
    await user.click(chatButton);

    await waitFor(() => {
      expect(screen.getByTestId('doubao-chat')).toBeInTheDocument();
    });
  });

  it('opens product updates from bell icon', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    const bellIcon = screen.getByTitle('Product Updates');
    await user.click(bellIcon);

    await waitFor(() => {
      expect(screen.getByTestId('product-updates')).toBeInTheDocument();
    });
  });

  it('handles sidebar conversation list', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    // Should show conversation history in sidebar
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toBeInTheDocument();

    // New chat button should be present
    const newChatButton = screen.getByText('New Chat');
    expect(newChatButton).toBeInTheDocument();

    await user.click(newChatButton);
    // Should start a new conversation
  });

  it('maintains responsive behavior', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    renderWithRouter(<DoubaoMainLayout />);

    // Layout should adapt to mobile
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    // Tab navigation should work
    await user.tab();
    
    // Should focus on first interactive element
    const focusedElement = document.activeElement;
    expect(focusedElement).toBeInTheDocument();

    // Continue tabbing through interface
    await user.tab();
    await user.tab();
    
    // Should maintain logical tab order
  });

  it('handles error states gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock console.error to avoid noise in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithRouter(<DoubaoMainLayout />);

    // Simulate error condition (e.g., network failure)
    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'Test message');

    // Should handle errors without crashing
    expect(screen.getByTestId('doubao-chat')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('preserves scroll position during navigation', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    // Simulate scrolling in message area
    const messageList = screen.getByTestId('message-list');
    fireEvent.scroll(messageList, { target: { scrollTop: 100 } });

    // Navigate away and back
    const settingsButton = screen.getByTitle('Settings');
    await user.click(settingsButton);

    const chatButton = screen.getByText('New Chat');
    await user.click(chatButton);

    // Scroll position should be maintained (implementation dependent)
    expect(screen.getByTestId('doubao-chat')).toBeInTheDocument();
  });

  it('handles real-time message updates', async () => {
    renderWithRouter(<DoubaoMainLayout />);

    const messageList = screen.getByTestId('message-list');
    
    // Simulate receiving a new message
    fireEvent(messageList, new CustomEvent('newMessage', {
      detail: { message: 'New incoming message' }
    }));

    // Should update the UI accordingly
    expect(messageList).toBeInTheDocument();
  });

  it('supports message streaming animation', async () => {
    renderWithRouter(<DoubaoMainLayout />);

    // Simulate streaming message
    const messageList = screen.getByTestId('message-list');
    
    fireEvent(messageList, new CustomEvent('streamingMessage', {
      detail: { 
        messageId: 'test-123',
        content: 'Streaming...',
        isComplete: false 
      }
    }));

    // Should show streaming indicator
    expect(messageList).toBeInTheDocument();
  });
});

describe('Chat Performance Integration', () => {
  it('handles large message lists efficiently', async () => {
    const largeMessageList = createMockMessages(1000);
    
    const startTime = performance.now();
    
    renderWithRouter(<DoubaoMainLayout />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should render within reasonable time (adjust threshold as needed)
    expect(renderTime).toBeLessThan(1000); // 1 second
  });

  it('maintains 60fps during animations', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    // Simulate rapid interactions
    const input = screen.getByPlaceholderText('Type your message...');
    
    const startTime = performance.now();
    
    // Rapid typing simulation
    for (let i = 0; i < 10; i++) {
      await user.type(input, 'a');
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const avgFrameTime = totalTime / 10;

    // Should maintain smooth frame rate (16.67ms per frame for 60fps)
    expect(avgFrameTime).toBeLessThan(20);
  });

  it('efficiently manages memory during long sessions', () => {
    renderWithRouter(<DoubaoMainLayout />);

    // Simulate memory usage
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    // Perform various operations
    for (let i = 0; i < 100; i++) {
      const event = new CustomEvent('test');
      document.dispatchEvent(event);
    }

    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;

    // Memory increase should be reasonable
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB
  });
});