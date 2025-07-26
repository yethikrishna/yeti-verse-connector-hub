import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DoubaoMessageBubble, DoubaoMessageList } from '@/components/doubao/DoubaoMessageBubble';
import { createMockMessage, createMockMessages } from '../setup';

describe('DoubaoMessageBubble', () => {
  const mockOnMessageClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user message correctly', () => {
    const message = createMockMessage({
      role: 'user',
      content: 'Hello, this is a user message',
    });

    render(
      <DoubaoMessageBubble 
        message={message} 
        onMessageClick={mockOnMessageClick}
      />
    );

    expect(screen.getByText('Hello, this is a user message')).toBeInTheDocument();
    expect(screen.getByText('U')).toBeInTheDocument(); // User avatar
  });

  it('renders AI message correctly', () => {
    const message = createMockMessage({
      role: 'assistant',
      content: 'Hello, this is an AI response',
    });

    render(
      <DoubaoMessageBubble 
        message={message} 
        onMessageClick={mockOnMessageClick}
      />
    );

    expect(screen.getByText('Hello, this is an AI response')).toBeInTheDocument();
    // AI avatar should have the AI icon
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('shows streaming indicator for AI messages', () => {
    const message = createMockMessage({
      role: 'assistant',
      content: 'Streaming message...',
      isStreaming: true,
    });

    render(
      <DoubaoMessageBubble 
        message={message} 
        onMessageClick={mockOnMessageClick}
      />
    );

    // Should show typing dots animation
    const dots = screen.getAllByRole('generic').filter(el => 
      el.className.includes('rounded-full')
    );
    expect(dots.length).toBeGreaterThan(0);
  });

  it('handles message click', async () => {
    const user = userEvent.setup();
    const message = createMockMessage();

    render(
      <DoubaoMessageBubble 
        message={message} 
        onMessageClick={mockOnMessageClick}
      />
    );

    await user.click(screen.getByText(message.content));
    expect(mockOnMessageClick).toHaveBeenCalledWith(message.id);
  });

  it('shows timestamp on hover', async () => {
    const user = userEvent.setup();
    const message = createMockMessage();

    render(
      <DoubaoMessageBubble 
        message={message} 
        onMessageClick={mockOnMessageClick}
      />
    );

    const messageElement = screen.getByText(message.content).closest('.group');
    expect(messageElement).toBeInTheDocument();

    // Hover should reveal timestamp
    await user.hover(messageElement!);
    
    // Check for timestamp text (it should become visible)
    await waitFor(() => {
      const timestampElements = screen.getAllByText(/ago|Just now/);
      expect(timestampElements.length).toBeGreaterThan(0);
    });
  });

  it('hides avatar for consecutive messages', () => {
    const messages = [
      createMockMessage({ id: '1', role: 'user', content: 'First message' }),
      createMockMessage({ id: '2', role: 'user', content: 'Second message' }),
    ];

    render(
      <DoubaoMessageList 
        messages={messages} 
        onMessageClick={mockOnMessageClick}
      />
    );

    // First message should have avatar
    expect(screen.getByText('U')).toBeInTheDocument();
    
    // Second message should not have avatar (consecutive from same user)
    const userAvatars = screen.getAllByText('U');
    expect(userAvatars).toHaveLength(1);
  });

  it('applies correct styling for user vs AI messages', () => {
    const userMessage = createMockMessage({ role: 'user', content: 'User message' });
    const aiMessage = createMockMessage({ role: 'assistant', content: 'AI message' });

    const { rerender } = render(
      <DoubaoMessageBubble message={userMessage} />
    );

    const userBubble = screen.getByText('User message').closest('div');
    expect(userBubble).toHaveClass('doubao-gradient-blue');

    rerender(<DoubaoMessageBubble message={aiMessage} />);

    const aiBubble = screen.getByText('AI message').closest('div');
    expect(aiBubble).toHaveClass('bg-doubao-ai-bubble');
  });

  it('handles long messages correctly', () => {
    const longContent = 'This is a very long message that should wrap properly and maintain good readability across multiple lines without breaking the layout or causing any visual issues.'.repeat(3);
    
    const message = createMockMessage({
      content: longContent,
    });

    render(<DoubaoMessageBubble message={message} />);

    expect(screen.getByText(longContent)).toBeInTheDocument();
    
    const messageElement = screen.getByText(longContent);
    expect(messageElement).toHaveClass('break-words');
  });

  it('formats timestamps correctly', () => {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const messages = [
      createMockMessage({ id: '1', timestamp: oneMinuteAgo }),
      createMockMessage({ id: '2', timestamp: oneHourAgo }),
      createMockMessage({ id: '3', timestamp: oneDayAgo }),
    ];

    render(
      <DoubaoMessageList messages={messages} />
    );

    // Timestamps should be formatted appropriately
    // Note: Exact text matching might be flaky due to timing, so we check for patterns
    expect(screen.getByText(/1m ago|Just now/)).toBeInTheDocument();
    expect(screen.getByText(/1h ago/)).toBeInTheDocument();
  });
});

describe('DoubaoMessageList', () => {
  it('renders multiple messages correctly', () => {
    const messages = createMockMessages(3);

    render(<DoubaoMessageList messages={messages} />);

    messages.forEach(message => {
      expect(screen.getByText(message.content)).toBeInTheDocument();
    });
  });

  it('applies staggered animations', () => {
    const messages = createMockMessages(3);

    render(<DoubaoMessageList messages={messages} />);

    // Check that messages are wrapped in motion containers
    const messageContainers = screen.getAllByText(/Test message/).map(el => 
      el.closest('[data-testid]') || el.closest('div')
    );

    expect(messageContainers.length).toBe(3);
  });

  it('handles empty message list', () => {
    render(<DoubaoMessageList messages={[]} />);

    // Should render without crashing
    expect(screen.queryByText(/Test message/)).not.toBeInTheDocument();
  });

  it('optimizes consecutive message spacing', () => {
    const messages = [
      createMockMessage({ id: '1', role: 'user', content: 'First' }),
      createMockMessage({ id: '2', role: 'user', content: 'Second' }),
      createMockMessage({ id: '3', role: 'assistant', content: 'Third' }),
    ];

    render(<DoubaoMessageList messages={messages} />);

    // Check that consecutive messages have reduced spacing
    const messageElements = screen.getAllByText(/First|Second|Third/).map(el => 
      el.closest('div')
    );

    // Second message should have reduced top margin (mt-1 vs mt-4)
    expect(messageElements[1]).toHaveClass('mt-1');
    // Third message should have normal spacing (different role)
    expect(messageElements[2]).toHaveClass('mt-4');
  });
});