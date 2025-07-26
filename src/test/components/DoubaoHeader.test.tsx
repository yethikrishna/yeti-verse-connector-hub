import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('DoubaoHeader', () => {
  const mockOnSettingsClick = vi.fn();
  const mockOnNotificationsClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders header with Doubao logo', () => {
    renderWithRouter(
      <DoubaoHeader 
        onSettingsClick={mockOnSettingsClick}
        onNotificationsClick={mockOnNotificationsClick}
      />
    );

    expect(screen.getByText('Doubao')).toBeInTheDocument();
  });

  it('renders user avatar and settings button', () => {
    renderWithRouter(
      <DoubaoHeader 
        onSettingsClick={mockOnSettingsClick}
        onNotificationsClick={mockOnNotificationsClick}
      />
    );

    expect(screen.getByTitle('Settings')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /user avatar/i })).toBeInTheDocument();
  });

  it('renders notification bell icon', () => {
    renderWithRouter(
      <DoubaoHeader 
        onSettingsClick={mockOnSettingsClick}
        onNotificationsClick={mockOnNotificationsClick}
      />
    );

    expect(screen.getByTitle('Product Updates')).toBeInTheDocument();
  });

  it('handles settings button click', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(
      <DoubaoHeader 
        onSettingsClick={mockOnSettingsClick}
        onNotificationsClick={mockOnNotificationsClick}
      />
    );

    const settingsButton = screen.getByTitle('Settings');
    await user.click(settingsButton);

    expect(mockOnSettingsClick).toHaveBeenCalledTimes(1);
  });

  it('handles notifications button click', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(
      <DoubaoHeader 
        onSettingsClick={mockOnSettingsClick}
        onNotificationsClick={mockOnNotificationsClick}
      />
    );

    const notificationsButton = screen.getByTitle('Product Updates');
    await user.click(notificationsButton);

    expect(mockOnNotificationsClick).toHaveBeenCalledTimes(1);
  });

  it('shows notification badge when there are unread notifications', () => {
    renderWithRouter(
      <DoubaoHeader 
        onSettingsClick={mockOnSettingsClick}
        onNotificationsClick={mockOnNotificationsClick}
        unreadNotifications={3}
      />
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    renderWithRouter(
      <DoubaoHeader 
        onSettingsClick={mockOnSettingsClick}
        onNotificationsClick={mockOnNotificationsClick}
      />
    );

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white', 'border-b');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    
    renderWithRouter(
      <DoubaoHeader 
        onSettingsClick={mockOnSettingsClick}
        onNotificationsClick={mockOnNotificationsClick}
      />
    );

    // Tab to first interactive element
    await user.tab();
    expect(document.activeElement).toBe(screen.getByTitle('Product Updates'));

    // Tab to next element
    await user.tab();
    expect(document.activeElement).toBe(screen.getByTitle('Settings'));
  });

  it('handles user avatar click', async () => {
    const user = userEvent.setup();
    const mockOnAvatarClick = vi.fn();
    
    renderWithRouter(
      <DoubaoHeader 
        onSettingsClick={mockOnSettingsClick}
        onNotificationsClick={mockOnNotificationsClick}
        onAvatarClick={mockOnAvatarClick}
      />
    );

    const avatar = screen.getByRole('button', { name: /user avatar/i });
    await user.click(avatar);

    expect(mockOnAvatarClick).toHaveBeenCalledTimes(1);
  });
});