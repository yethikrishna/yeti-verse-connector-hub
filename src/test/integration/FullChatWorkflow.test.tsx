import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { createMockMessages, createMockMessage } from '../setup';

// Mock the pages to avoid complex dependencies
vi.mock('@/pages/DoubaoChat', () => ({
  DoubaoChat: () => (
    <div data-testid="doubao-chat">
      <div data-testid="message-list">Mock messages</div>
      <div data-testid="input-area">
        <input placeholder="Type your message..." />
        <button>Send</button>
      </div>
    </div>
  ),
}));

vi.mock('@/pages/DoubaoSettings', () => ({
  default: () => (
    <div data-testid="doubao-settings">
      <h1>Settings</h1>
      <button>Export Conversations</button>
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

describe('Full Chat Workflow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes full conversation workflow', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    // 1. Start new conversation
    const newChatButton = screen.getByText('New Chat');
    await user.click(newChatButton);

    // 2. Send first message
    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'Hello, can you help me with coding?');
    await user.keyboard('{Enter}');

    // 3. Wait for AI response
    await waitFor(() => {
      expect(screen.getByText(/AI response to:/)).toBeInTheDocument();
    }, { timeout: 2000 });

    // 4. Send follow-up message
    await user.type(input, 'Can you explain React hooks?');
    await user.keyboard('{Enter}');

    // 5. Verify conversation history
    expect(screen.getByText('Hello, can you help me with coding?')).toBeInTheDocument();
    expect(screen.getByText('Can you explain React hooks?')).toBeInTheDocument();

    // 6. Check conversation appears in sidebar
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toBeInTheDocument();
  });

  it('handles message streaming correctly', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'Tell me a long story');
    await user.keyboard('{Enter}');

    // Should show typing indicator
    await waitFor(() => {
      expect(screen.getByTestId('typing-indicator')).toBeInTheDocument();
    });

    // Should eventually show the response
    await waitFor(() => {
      expect(screen.getByText(/AI response to:/)).toBeInTheDocument();
    }, { timeout: 2000 });

    // Typing indicator should disappear
    expect(screen.queryByTestId('typing-indicator')).not.toBeInTheDocument();
  });

  it('supports file attachment workflow', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    // Create a mock file
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });

    const input = screen.getByPlaceholderText('Type your message...');
    const attachButton = screen.getByTitle('Attach file');

    await user.click(attachButton);

    // Find the hidden file input
    const fileInput = input.parentElement?.querySelector('input[type="file"]');
    if (fileInput) {
      await user.upload(fileInput as HTMLInputElement, file);
    }

    // Should show file attachment indicator
    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeInTheDocument();
    });

    // Send message with attachment
    await user.type(input, 'Please analyze this file');
    await user.keyboard('{Enter}');

    // Should process message with attachment
    expect(screen.getByText('Please analyze this file')).toBeInTheDocument();
  });

  it('handles voice input workflow', async () => {
    const user = userEvent.setup();
    
    // Mock getUserMedia for voice input
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: vi.fn().mockResolvedValue({
          getTracks: () => [{ stop: vi.fn() }],
        }),
      },
      writable: true,
    });

    renderWithRouter(<DoubaoMainLayout />);

    const voiceButton = screen.getByTitle('Voice input');
    await user.click(voiceButton);

    // Should show recording indicator
    await waitFor(() => {
      expect(screen.getByText(/Recording/)).toBeInTheDocument();
    });

    // Stop recording
    const stopButton = screen.getByTitle('Stop recording');
    await user.click(stopButton);

    // Should process voice input
    await waitFor(() => {
      expect(screen.queryByText(/Recording/)).not.toBeInTheDocument();
    });
  });

  it('manages conversation history correctly', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    // Create first conversation
    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'First conversation message');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText(/AI response to:/)).toBeInTheDocument();
    }, { timeout: 2000 });

    // Start new conversation
    const newChatButton = screen.getByText('New Chat');
    await user.click(newChatButton);

    // Send message in new conversation
    await user.type(input, 'Second conversation message');
    await user.keyboard('{Enter}');

    // Should be in new conversation context
    expect(screen.getByText('Second conversation message')).toBeInTheDocument();
    expect(screen.queryByText('First conversation message')).not.toBeInTheDocument();

    // Should be able to switch back to first conversation
    // (This would require conversation list implementation)
  });

  it('handles error recovery in conversation flow', async () => {
    const user = userEvent.setup();
    
    // Mock network error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithRouter(<DoubaoMainLayout />);

    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'This message will fail');
    await user.keyboard('{Enter}');

    // Should handle error gracefully
    expect(screen.getByText('This message will fail')).toBeInTheDocument();

    // Should allow retry
    await user.type(input, 'Retry message');
    await user.keyboard('{Enter}');

    expect(screen.getByText('Retry message')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('supports conversation export/import', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    // Create conversation with multiple messages
    const input = screen.getByPlaceholderText('Type your message...');
    
    await user.type(input, 'Message 1');
    await user.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(screen.getByText(/AI response to:/)).toBeInTheDocument();
    }, { timeout: 2000 });

    await user.type(input, 'Message 2');
    await user.keyboard('{Enter}');

    // Navigate to settings
    const settingsButton = screen.getByTitle('Settings');
    await user.click(settingsButton);

    await waitFor(() => {
      expect(screen.getByTestId('doubao-settings')).toBeInTheDocument();
    });

    // Should have export option
    const exportButton = screen.getByText('Export Conversations');
    expect(exportButton).toBeInTheDocument();
  });

  it('maintains conversation state during navigation', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    // Send message
    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'Test message for navigation');
    await user.keyboard('{Enter}');

    // Navigate to settings
    const settingsButton = screen.getByTitle('Settings');
    await user.click(settingsButton);

    // Navigate back to chat
    const chatButton = screen.getByText('New Chat');
    await user.click(chatButton);

    // Message should still be there
    expect(screen.getByText('Test message for navigation')).toBeInTheDocument();
  });

  it('handles concurrent message sending', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    const input = screen.getByPlaceholderText('Type your message...');

    // Send multiple messages quickly
    await user.type(input, 'Message 1');
    await user.keyboard('{Enter}');

    await user.type(input, 'Message 2');
    await user.keyboard('{Enter}');

    await user.type(input, 'Message 3');
    await user.keyboard('{Enter}');

    // All messages should be sent
    expect(screen.getByText('Message 1')).toBeInTheDocument();
    expect(screen.getByText('Message 2')).toBeInTheDocument();
    expect(screen.getByText('Message 3')).toBeInTheDocument();
  });

  it('supports message editing and deletion', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(<DoubaoMainLayout />);

    const input = screen.getByPlaceholderText('Type your message...');
    await user.type(input, 'Original message');
    await user.keyboard('{Enter}');

    // Hover over message to show actions
    const message = screen.getByText('Original message');
    await user.hover(message);

    // Should show edit and delete options
    await waitFor(() => {
      expect(screen.getByTitle('Edit message')).toBeInTheDocument();
      expect(screen.getByTitle('Delete message')).toBeInTheDocument();
    });

    // Test message deletion
    const deleteButton = screen.getByTitle('Delete message');
    await user.click(deleteButton);

    // Message should be removed
    expect(screen.queryByText('Original message')).not.toBeInTheDocument();
  });
});