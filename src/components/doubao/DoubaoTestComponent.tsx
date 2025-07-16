import React, { useState } from 'react';
import { DoubaoHeader } from './DoubaoHeader';
import { DoubaoMainLayout } from './DoubaoMainLayout';
import { type Conversation } from './DoubaoSidebar';

export const DoubaoTestComponent: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string>('1');
  const [notifications, setNotifications] = useState(true);

  // Mock conversations for testing
  const mockConversations: Conversation[] = [
    {
      id: '1',
      title: 'How to build a React component with TypeScript',
      lastMessage: 'Here are the best practices for building React components...',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: '2', 
      title: 'JavaScript async/await patterns and error handling',
      lastMessage: 'Async/await makes asynchronous code much more readable...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: '3',
      title: 'CSS Grid vs Flexbox: When to use which?',
      lastMessage: 'Both CSS Grid and Flexbox are powerful layout tools...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
      id: '4',
      title: 'TypeScript best practices for large projects',
      lastMessage: 'When working with TypeScript in large codebases...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    {
      id: '5',
      title: 'Framer Motion animations guide',
      lastMessage: 'Creating smooth animations with Framer Motion...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    },
  ];

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    console.log('Sidebar toggled:', !sidebarCollapsed);
  };

  const handleNewChat = () => {
    const newId = String(mockConversations.length + 1);
    console.log('New chat created with ID:', newId);
    setActiveConversationId(newId);
  };

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    console.log('Selected conversation:', conversationId);
  };

  const handleDeleteConversation = (conversationId: string) => {
    console.log('Delete conversation:', conversationId);
    // In a real app, you would remove the conversation from the list
    if (activeConversationId === conversationId) {
      setActiveConversationId(mockConversations[0]?.id || '');
    }
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  const handleNotificationsClick = () => {
    setNotifications(false);
    console.log('Notifications clicked');
  };

  return (
    <div className="h-screen bg-doubao-bg-primary">
      <DoubaoMainLayout
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={handleSidebarToggle}
        conversations={mockConversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
      >
        {/* Main Content Area */}
        <div className="h-full flex flex-col">
          {/* Header */}
          <DoubaoHeader
            onSidebarToggle={handleSidebarToggle}
            showSidebarToggle={true}
            userAvatar=""
            userName="Test User"
            onSettingsClick={handleSettingsClick}
            onNotificationsClick={handleNotificationsClick}
            hasNotifications={notifications}
          />
          
          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="doubao-text-2xl text-doubao-text-primary mb-4">
                DoubaoSidebar Test Component
              </h2>
              
              <div className="doubao-card-base p-6 space-y-4">
                <h3 className="doubao-text-lg font-semibold text-doubao-text-primary">
                  Sidebar Features Test
                </h3>
                
                <div className="space-y-2 doubao-text-sm text-doubao-text-secondary">
                  <p>✅ <strong>280px fixed width sidebar:</strong> Sidebar maintains exact 280px width when expanded</p>
                  <p>✅ <strong>Light gray background:</strong> Uses doubao-bg-sidebar color with proper border</p>
                  <p>✅ <strong>"New Chat" button with plus icon:</strong> Blue gradient button with + icon at the top</p>
                  <p>✅ <strong>Conversation list with hover states:</strong> Interactive conversation items with smooth hover effects</p>
                  <p>✅ <strong>Conversation title truncation:</strong> Long titles are truncated with ellipsis (...)</p>
                  <p>✅ <strong>Smooth slide animations:</strong> Framer Motion animations for all sidebar interactions</p>
                  <p>✅ <strong>Active conversation highlighting:</strong> Currently selected conversation is highlighted in blue</p>
                  <p>✅ <strong>Delete functionality:</strong> Hover over conversations to see delete button</p>
                </div>
                
                <div className="pt-4 border-t border-doubao-border-light">
                  <p className="doubao-text-sm text-doubao-text-muted">
                    Try interacting with the sidebar to test functionality:
                  </p>
                  <ul className="doubao-text-sm text-doubao-text-muted mt-2 space-y-1">
                    <li>• Click "New Chat" button to create a new conversation</li>
                    <li>• Click on different conversations to select them</li>
                    <li>• Hover over conversations to see the delete button</li>
                    <li>• Toggle the sidebar using the hamburger menu in the header</li>
                    <li>• Resize the window to test responsive behavior</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 doubao-card-base p-6">
                <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                  Current State
                </h3>
                <div className="space-y-2 doubao-text-sm text-doubao-text-secondary">
                  <p><strong>Sidebar Collapsed:</strong> {sidebarCollapsed ? 'Yes' : 'No'}</p>
                  <p><strong>Active Conversation:</strong> {activeConversationId}</p>
                  <p><strong>Total Conversations:</strong> {mockConversations.length}</p>
                  <p><strong>Has Notifications:</strong> {notifications ? 'Yes' : 'No'}</p>
                </div>
              </div>
              
              <div className="mt-6 doubao-card-base p-6">
                <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                  Animation Features
                </h3>
                <div className="space-y-2 doubao-text-sm text-doubao-text-secondary">
                  <p>• <strong>Sidebar slide animation:</strong> 0.2s ease-out transition when toggling</p>
                  <p>• <strong>Conversation hover effects:</strong> Smooth 2px slide on hover</p>
                  <p>• <strong>Button animations:</strong> Scale and color transitions on interaction</p>
                  <p>• <strong>Staggered list animations:</strong> Conversations animate in with staggered timing</p>
                  <p>• <strong>Delete button animation:</strong> Fade and scale animation on hover</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DoubaoMainLayout>
    </div>
  );
};

export default DoubaoTestComponent;