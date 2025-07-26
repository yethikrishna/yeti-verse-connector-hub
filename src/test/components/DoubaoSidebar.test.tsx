import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { DoubaoSidebar } from '@/components/doubao/DoubaoSidebar';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

const mockConversations = [
  {
    id: '1',
    title: 'First conversation',
    lastMessage: 'Hello world',
    timestamp: new Date('2024-01-01'),
    isActive: true,
  },
  {
    id: '2',
    title: 'Second conversation',
    lastMessage: 'How are you?',
    timestamp: new Date('2024-01-02'),
    isActive: false,
  },
];

describe('DoubaoSidebar', () => {
  const mockOnNewChat = vi.fn();
  const mockOnSelectConversation = vi.fn();
  const mockOnDeleteConversation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sidebar with correct width', () => {
    renderWithRouter(
      <DoubaoSidebar 
        conversations={mockConversations}
        onNewChat={mockOnNewChat}
        onSelectConversation={mockOnSelectConversation}
        onDeleteConversation={mockOnDeleteConversation}
      />
    );

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('w-80'); // 280px width
  });

  it('renders New Chat button', () => {
    renderWithRouter(
      <DoubaoSidebar 
        conversations={mockConversations}
        onNewChat={mockOnNewChat}
        onSelectConversation={mockOnSelectConversation}
        onDeleteConversation={mockOnDeleteConversation}
      />
    );

    expect(screen.getByText('New Chat')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new chat/i })).toBeInTheDocument();
  });

  it('renders conversation list', () => {
    renderWithRouter(
      <DoubaoSidebar 
        conversations={mockConversations}
        onNewChat={mockOnNewChat}
        onSelectConversation={mockOnSelectConversation}
        onDeleteConversation={mockOnDeleteConversation}
      />
    );

    expect(screen.getByText('First conversation')).toBeInTheDocument();
    expect(screen.getByText('Second conversation')).toBeInTheDocument();
  });

  it('handles new chat button click', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(
      <DoubaoSidebar 
        conversations={mockConversations}
        onNewChat={mockOnNewChat}
        onSelectConversation={mockOnSelectConversation}
        onDeleteConversation={mockOnDeleteConversation}
      />
    );

    const newChatButton = screen.getByText('New Chat');
    await user.click(newChatButton);

    expect(mockOnNewChat).toHaveBeenCalledTimes(1);
  });

  it('handles conversation selection', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(
      <DoubaoSidebar 
        conversations={mockConversations}
        onNewChat={mockOnNewChat}
        onSelectConversation={mockOnSelectConversation}
        onDeleteConversation={mockOnDeleteConversation}
      />
    );

    const firstConversation = screen.getByText('First conversation');
    await user.click(firstConversation);

    expect(mockOnSelectConversation).toHaveBeenCalledWith('1');
  });

  it('highlights active conversation', () => {
    renderWithRouter(
      <DoubaoSidebar 
        conversations={mockConversations}
        onNewChat={mockOnNewChat}
        onSelectConversation={mockOnSelectConversation}
        onDeleteConversation={mockOnDeleteConversation}
      />
    );

    const activeConversation = screen.getByText('First conversation').closest('button');
    expect(activeConversation).toHaveClass('bg-doubao-selected');
  });

  it('truncates long conversation titles', () => {
    const longTitleConversations = [
      {
        id: '1',
        title: 'This is a very long conversation title that should be truncated with ellipsis',
        lastMessage: 'Hello',
        timestamp: new Date(),
        isActive: false,
      },
    ];

    renderWithRouter(
      <DoubaoSidebar 
        conversations={longTitleConversations}
        onNewChat={mockOnNewChat}
        onSelectConversation={mockOnSelectConversation}
        onDeleteConversation={mockOnDeleteConversation}
      />
    );

    const titleElement = screen.getByText(/This is a very long conversation/);
    expect(titleElement).toHaveClass('truncate');
  });

  it('shows conversation timestamps', () => {
    renderWithRouter(
      <DoubaoSidebar 
        conversations={mockConversations}
        onNewChat={mockOnNewChat}
        onSelectConversation={mockOnSelectConversation}
        onDeleteConversation={mockOnDeleteConversation}
      />
    );

    // Should show relative timestamps
    expect(screen.getByText(/ago|Just now/)).toBeInTheDocument();
  });

  it('handles conversation deletion', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(
      <DoubaoSidebar 
        conversations={mockConversations}
        onNewChat={mockOnNewChat}
        onSelectConversation={mockOnSelectConversation}
        onDeleteConversation={mockOnDeleteConversation}
      />
    );

    // Hover over conversation to show delete button
    const conversation = screen.getByText('First conversation').closest('button');
    await user.hover(conversation!);

    const deleteButton = screen.getByTitle('Delete conversation');
    await user.click(deleteButton);

    expect(mockOnDeleteConversation).toHaveBeenCalledWith('1');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(
      <DoubaoSidebar 
        conversations={mockConversations}
        onNewChat={mockOnNewChat}
        onSelectConversation={mockOnSelectConversation}
        onDeleteConversation={mockOnDeleteConversation}
      />
    );

    // Tab to first conversation
    await user.tab();
    expect(document.activeElement).toBe(screen.getByText('New Chat'));

    // Arrow down to next conversation
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement?.textContent).toContain('First conversation');
  });

  it('handles empty conversation list', () => {
    renderWithRouter(
      <DoubaoSidebar 
        conversations={[]}
        onNewChat={mockOnNewChat}
        onSelectConversation={mockOnSelectConversation}
        onDeleteConversation={mockOnDeleteConversation}
      />
    );

    expect(screen.getByText('New Chat')).toBeInTheDocument();
    expect(screen.queryByText('First conversation')).not.toBeInTheDocument();
  });

  it('supports collapsed state', () => {
    renderWithRouter(
      <DoubaoSidebar 
        conversations={mockConversations}
        onNewChat={mockOnNewChat}
        onSelectConversation={mockOnSelectConversation}
        onDeleteConversation={mockOnDeleteConversation}
        isCollapsed={true}
      />
    );

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('w-16'); // Collapsed width
  });

  it('shows hover effects on conversations', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(
      <DoubaoSidebar 
        conversations={mockConversations}
        onNewChat={mockOnNewChat}
        onSelectConversation={mockOnSelectConversation}
        onDeleteConversation={mockOnDeleteConversation}
      />
    );

    const conversation = screen.getByText('First conversation').closest('button');
    
    await user.hover(conversation!);
    expect(conversation).toHaveClass('hover:bg-doubao-hover');
  });
});