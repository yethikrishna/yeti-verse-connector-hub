import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DoubaoInputArea } from '@/components/doubao/DoubaoInputArea';

describe('DoubaoInputArea', () => {
  const mockOnChange = vi.fn();
  const mockOnSend = vi.fn();
  const mockOnAttachFile = vi.fn();
  const mockOnVoiceInput = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<DoubaoInputArea />);

    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByTitle('Attach file')).toBeInTheDocument();
    expect(screen.getByTitle('Voice input')).toBeInTheDocument();
    expect(screen.getByTitle('Send message')).toBeInTheDocument();
  });

  it('handles text input correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <DoubaoInputArea 
        onChange={mockOnChange}
        onSend={mockOnSend}
      />
    );

    const textarea = screen.getByPlaceholderText('Type your message...');
    await user.type(textarea, 'Hello world');

    expect(mockOnChange).toHaveBeenCalledWith('Hello world');
  });

  it('sends message on Enter key', async () => {
    const user = userEvent.setup();
    
    render(
      <DoubaoInputArea 
        onChange={mockOnChange}
        onSend={mockOnSend}
      />
    );

    const textarea = screen.getByPlaceholderText('Type your message...');
    await user.type(textarea, 'Test message');
    await user.keyboard('{Enter}');

    expect(mockOnSend).toHaveBeenCalledWith('Test message');
  });

  it('does not send on Shift+Enter', async () => {
    const user = userEvent.setup();
    
    render(
      <DoubaoInputArea 
        onChange={mockOnChange}
        onSend={mockOnSend}
      />
    );

    const textarea = screen.getByPlaceholderText('Type your message...');
    await user.type(textarea, 'Test message');
    await user.keyboard('{Shift>}{Enter}{/Shift}');

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('sends message on send button click', async () => {
    const user = userEvent.setup();
    
    render(
      <DoubaoInputArea 
        onChange={mockOnChange}
        onSend={mockOnSend}
      />
    );

    const textarea = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByTitle('Send message');

    await user.type(textarea, 'Test message');
    await user.click(sendButton);

    expect(mockOnSend).toHaveBeenCalledWith('Test message');
  });

  it('disables send button when input is empty', () => {
    render(<DoubaoInputArea onSend={mockOnSend} />);

    const sendButton = screen.getByTitle('Send message');
    expect(sendButton).toBeDisabled();
  });

  it('enables send button when input has content', async () => {
    const user = userEvent.setup();
    
    render(<DoubaoInputArea onSend={mockOnSend} />);

    const textarea = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByTitle('Send message');

    await user.type(textarea, 'Test');
    expect(sendButton).not.toBeDisabled();
  });

  it('clears input after sending', async () => {
    const user = userEvent.setup();
    
    render(<DoubaoInputArea onSend={mockOnSend} />);

    const textarea = screen.getByPlaceholderText('Type your message...');
    
    await user.type(textarea, 'Test message');
    await user.keyboard('{Enter}');

    expect(textarea).toHaveValue('');
  });

  it('handles file attachment', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    render(
      <DoubaoInputArea 
        onAttachFile={mockOnAttachFile}
      />
    );

    const attachButton = screen.getByTitle('Attach file');
    await user.click(attachButton);

    // Find the hidden file input
    const fileInput = screen.getByRole('textbox').parentElement?.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();

    if (fileInput) {
      await user.upload(fileInput as HTMLInputElement, file);
      expect(mockOnAttachFile).toHaveBeenCalled();
    }
  });

  it('handles voice input toggle', async () => {
    const user = userEvent.setup();
    
    render(
      <DoubaoInputArea 
        onVoiceInput={mockOnVoiceInput}
      />
    );

    const voiceButton = screen.getByTitle('Voice input');
    await user.click(voiceButton);

    expect(mockOnVoiceInput).toHaveBeenCalled();
  });

  it('shows character count when approaching limit', async () => {
    const user = userEvent.setup();
    const maxLength = 100;
    
    render(
      <DoubaoInputArea 
        maxLength={maxLength}
        onChange={mockOnChange}
      />
    );

    const textarea = screen.getByPlaceholderText('Type your message...');
    const longText = 'a'.repeat(85); // 85% of limit

    await user.type(textarea, longText);

    await waitFor(() => {
      expect(screen.getByText(`${longText.length}/${maxLength}`)).toBeInTheDocument();
    });
  });

  it('prevents input beyond max length', async () => {
    const user = userEvent.setup();
    const maxLength = 10;
    
    render(
      <DoubaoInputArea 
        maxLength={maxLength}
        onChange={mockOnChange}
      />
    );

    const textarea = screen.getByPlaceholderText('Type your message...');
    const longText = 'a'.repeat(15); // Exceeds limit

    await user.type(textarea, longText);

    expect(textarea).toHaveValue('a'.repeat(maxLength));
  });

  it('auto-resizes textarea', async () => {
    const user = userEvent.setup();
    
    render(<DoubaoInputArea />);

    const textarea = screen.getByPlaceholderText('Type your message...');
    const initialHeight = textarea.style.height;

    await user.type(textarea, 'Line 1\nLine 2\nLine 3\nLine 4');

    // Height should have changed (auto-resize)
    expect(textarea.style.height).not.toBe(initialHeight);
  });

  it('shows loading state', () => {
    render(
      <DoubaoInputArea 
        isLoading={true}
        onSend={mockOnSend}
      />
    );

    const sendButton = screen.getByTitle('Send message');
    
    // Should show loading spinner instead of send icon
    expect(sendButton.querySelector('svg')).toBeInTheDocument();
    expect(sendButton).toBeDisabled();
  });

  it('handles disabled state', async () => {
    const user = userEvent.setup();
    
    render(
      <DoubaoInputArea 
        disabled={true}
        onChange={mockOnChange}
        onSend={mockOnSend}
      />
    );

    const textarea = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByTitle('Send message');
    const attachButton = screen.getByTitle('Attach file');
    const voiceButton = screen.getByTitle('Voice input');

    expect(textarea).toBeDisabled();
    expect(sendButton).toBeDisabled();
    expect(attachButton).toBeDisabled();
    expect(voiceButton).toBeDisabled();

    // Should not respond to user input
    await user.type(textarea, 'Test');
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('shows voice recording indicator', async () => {
    const user = userEvent.setup();
    
    render(
      <DoubaoInputArea 
        onVoiceInput={mockOnVoiceInput}
      />
    );

    const voiceButton = screen.getByTitle('Voice input');
    await user.click(voiceButton);

    // Should show recording indicator
    await waitFor(() => {
      expect(screen.getByText(/Recording/)).toBeInTheDocument();
    });

    // Button title should change
    expect(screen.getByTitle('Stop recording')).toBeInTheDocument();
  });

  it('handles focus and blur events', async () => {
    const user = userEvent.setup();
    
    render(<DoubaoInputArea />);

    const textarea = screen.getByPlaceholderText('Type your message...');
    
    await user.click(textarea);
    // Should have focus styling (tested via class changes)
    
    await user.tab(); // Move focus away
    // Should lose focus styling
  });

  it('supports custom placeholder', () => {
    const customPlaceholder = 'Enter your question here...';
    
    render(
      <DoubaoInputArea 
        placeholder={customPlaceholder}
      />
    );

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it('can hide attachment and voice buttons', () => {
    render(
      <DoubaoInputArea 
        showAttachment={false}
        showVoiceInput={false}
      />
    );

    expect(screen.queryByTitle('Attach file')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Voice input')).not.toBeInTheDocument();
  });

  it('handles controlled value prop', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <DoubaoInputArea 
        value="Initial value"
        onChange={mockOnChange}
      />
    );

    const textarea = screen.getByPlaceholderText('Type your message...');
    expect(textarea).toHaveValue('Initial value');

    // Update value prop
    rerender(
      <DoubaoInputArea 
        value="Updated value"
        onChange={mockOnChange}
      />
    );

    expect(textarea).toHaveValue('Updated value');
  });
});