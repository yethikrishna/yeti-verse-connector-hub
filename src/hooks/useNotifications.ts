import { useState, useEffect } from 'react';

interface ProductUpdate {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: Date;
  type: 'feature' | 'improvement' | 'announcement' | 'event';
  isNew: boolean;
  isRead: boolean;
}

// Mock data for product updates (same as in ProductUpdates.tsx)
const mockUpdates: ProductUpdate[] = [
  {
    id: '1',
    title: 'New AI Image Generation Models',
    description: 'We\'ve added support for DALL-E 3 and Midjourney v6 with enhanced quality and faster generation times.',
    image: '/placeholder.svg',
    date: new Date('2024-01-15'),
    type: 'feature',
    isNew: true,
    isRead: false,
  },
  {
    id: '2',
    title: 'Enhanced Voice Conversation',
    description: 'Improved speech recognition accuracy and added support for 12 new languages including Japanese and Korean.',
    image: '/placeholder.svg',
    date: new Date('2024-01-10'),
    type: 'improvement',
    isNew: true,
    isRead: false,
  },
  {
    id: '3',
    title: 'Document Analysis Upgrade',
    description: 'Now supports PDF, Word, Excel, and PowerPoint files up to 50MB with advanced OCR capabilities.',
    image: '/placeholder.svg',
    date: new Date('2024-01-05'),
    type: 'feature',
    isNew: false,
    isRead: true,
  },
  {
    id: '4',
    title: 'Winter Feature Festival',
    description: 'Join our month-long celebration with daily challenges, exclusive templates, and community showcases.',
    image: '/placeholder.svg',
    date: new Date('2024-01-01'),
    type: 'event',
    isNew: false,
    isRead: false,
  },
  {
    id: '5',
    title: 'Performance Improvements',
    description: 'Faster response times, reduced memory usage, and improved stability across all features.',
    date: new Date('2023-12-28'),
    type: 'improvement',
    isNew: false,
    isRead: true,
  },
];

export const useNotifications = () => {
  const [updates, setUpdates] = useState<ProductUpdate[]>(mockUpdates);

  const unreadCount = updates.filter(update => !update.isRead).length;
  const hasNotifications = unreadCount > 0;

  const markAsRead = (updateId: string) => {
    setUpdates(prev => prev.map(update => 
      update.id === updateId ? { ...update, isRead: true } : update
    ));
  };

  const markAllAsRead = () => {
    setUpdates(prev => prev.map(update => ({ ...update, isRead: true })));
  };

  return {
    updates,
    unreadCount,
    hasNotifications,
    markAsRead,
    markAllAsRead,
    setUpdates,
  };
};