import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { useListNavigation } from '@/hooks/useKeyboardNavigation';
import { useAccessibility, getAriaProps } from '@/hooks/useAccessibility';

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
  isActive?: boolean;
}

export interface DoubaoSidebarProps {
  conversations?: Conversation[];
  activeConversationId?: string;
  onNewChat?: () => void;
  onSelectConversation?: (conversationId: string) => void;
  onDeleteConversation?: (conversationId: string) => void;
  isCollapsed?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  onClose?: () => void;
  className?: string;
}

export const DoubaoSidebar: React.FC<DoubaoSidebarProps> = ({
  conversations = [],
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  isCollapsed = false,
  isMobile = false,
  isTablet = false,
  onClose,
  className,
}) => {
  const [hoveredConversationId, setHoveredConversationId] = useState<string | null>(null);

  // Mock conversations for demonstration if none provided
  const mockConversations: Conversation[] = [
    {
      id: '1',
      title: 'How to build a React component',
      lastMessage: 'Here are the best practices...',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: '2', 
      title: 'JavaScript async/await patterns',
      lastMessage: 'Async/await makes asynchronous code...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: '3',
      title: 'CSS Grid vs Flexbox comparison',
      lastMessage: 'Both CSS Grid and Flexbox...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
      id: '4',
      title: 'TypeScript best practices for large projects',
      lastMessage: 'When working with TypeScript...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
  ];

  const displayConversations = conversations.length > 0 ? conversations : mockConversations;
  
  // Accessibility and keyboard navigation
  const accessibility = useAccessibility();
  const {
    selectedIndex,
    selectNext,
    selectPrevious,
    selectCurrent,
    resetSelection,
    listRef,
  } = useListNavigation(displayConversations, (conversation) => {
    handleConversationSelect(conversation.id);
  });

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const truncateTitle = (title: string, maxLength?: number) => {
    // Adjust max length based on screen size
    const defaultMaxLength = isMobile ? 25 : isTablet ? 30 : 35;
    const actualMaxLength = maxLength || defaultMaxLength;
    
    if (title.length <= actualMaxLength) return title;
    return title.substring(0, actualMaxLength) + '…';
  };

  // Handle conversation selection with mobile considerations
  const handleConversationSelect = (conversationId: string) => {
    onSelectConversation?.(conversationId);
    // Auto-close sidebar on mobile after selection
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Handle new chat with mobile considerations
  const handleNewChat = () => {
    onNewChat?.();
    // Auto-close sidebar on mobile after creating new chat
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Keyboard navigation handlers
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        selectNext();
        break;
      case 'ArrowUp':
        event.preventDefault();
        selectPrevious();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectCurrent();
        break;
      case 'Escape':
        if (isMobile && onClose) {
          event.preventDefault();
          onClose();
        }
        break;
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? 0 : isMobile ? '100vw' : isTablet ? 256 : 280,
        opacity: isCollapsed ? 0 : 1,
        x: isMobile && isCollapsed ? '-100%' : 0,
      }}
      transition={{
        duration: accessibility.reducedMotion ? 0 : (isMobile ? 0.3 : 0.2),
        ease: 'easeOut',
      }}
      className={cn(
        'h-full bg-doubao-bg-sidebar flex flex-col overflow-hidden',
        isMobile ? 'border-r-0 shadow-2xl' : 'border-r border-doubao-border-light',
        isMobile ? 'max-w-[320px]' : '', // Limit mobile width
        className
      )}
      onKeyDown={handleKeyDown}
      {...getAriaProps({
        role: 'navigation',
        label: 'Conversation history'
      })}
    >
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            variants={doubaoAnimations.sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full flex flex-col"
          >
            {/* Mobile Close Button */}
            {isMobile && onClose && (
              <div className="p-4 border-b border-doubao-border-light">
                <button
                  onClick={onClose}
                  className={cn(
                    'p-2 rounded-lg hover:bg-doubao-hover',
                    'doubao-transition-colors touch-manipulation',
                    'min-h-[44px] min-w-[44px] flex items-center justify-center'
                  )}
                  aria-label="Close sidebar"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}

            {/* New Chat Button */}
            <div className={cn(
              'border-b border-doubao-border-light',
              isMobile ? 'p-3' : 'p-4'
            )}>
              <motion.button
                variants={doubaoAnimations.buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={handleNewChat}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg doubao-transition-colors',
                  'bg-doubao-primary-blue hover:bg-doubao-primary-blue-dark',
                  'text-white doubao-text-sm font-medium touch-manipulation',
                  isMobile ? 'px-3 py-3 min-h-[48px]' : 'px-4 py-3'
                )}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Chat
              </motion.button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                <motion.div
                  ref={listRef}
                  variants={doubaoAnimations.staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-1"
                  {...getAriaProps({
                    role: 'listbox',
                    label: 'Conversation list'
                  })}
                >
                  {displayConversations.map((conversation, index) => (
                    <motion.div
                      key={conversation.id}
                      variants={doubaoAnimations.staggerItem}
                      custom={index}
                      className="relative group"
                      onMouseEnter={() => setHoveredConversationId(conversation.id)}
                      onMouseLeave={() => setHoveredConversationId(null)}
                    >
                      <motion.button
                        whileHover={{ x: 2 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        onClick={() => handleConversationSelect(conversation.id)}
                        className={cn(
                          'w-full text-left rounded-lg doubao-transition-colors',
                          'flex flex-col gap-1 relative touch-manipulation',
                          isMobile ? 'p-3 min-h-[56px]' : 'p-3',
                          activeConversationId === conversation.id
                            ? 'bg-doubao-primary-blue text-white shadow-sm'
                            : 'hover:bg-doubao-hover text-doubao-text-primary',
                          selectedIndex === index && 'ring-2 ring-doubao-focus ring-offset-2'
                        )}
                        {...getAriaProps({
                          role: 'option',
                          selected: activeConversationId === conversation.id,
                          label: `Conversation: ${conversation.title}. ${conversation.lastMessage ? `Last message: ${conversation.lastMessage}.` : ''} ${formatTimestamp(conversation.timestamp)}`
                        })}
                        tabIndex={selectedIndex === index ? 0 : -1}
                      >
                        {/* Conversation Title */}
                        <div className={cn(
                          'doubao-text-sm font-medium',
                          activeConversationId === conversation.id
                            ? 'text-white'
                            : 'text-doubao-text-primary'
                        )}>
                          {truncateTitle(conversation.title)}
                        </div>

                        {/* Last Message Preview */}
                        {conversation.lastMessage && (
                          <div className={cn(
                            'doubao-text-xs',
                            activeConversationId === conversation.id
                              ? 'text-white/80'
                              : 'text-doubao-text-muted'
                          )}>
                            {truncateTitle(conversation.lastMessage, 45)}
                          </div>
                        )}

                        {/* Timestamp */}
                        <div className={cn(
                          'doubao-text-xs',
                          activeConversationId === conversation.id
                            ? 'text-white/60'
                            : 'text-doubao-text-muted'
                        )}>
                          {formatTimestamp(conversation.timestamp)}
                        </div>
                      </motion.button>

                      {/* Delete Button (appears on hover) */}
                      <AnimatePresence>
                        {hoveredConversationId === conversation.id && onDeleteConversation && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation(conversation.id);
                            }}
                            className={cn(
                              'absolute top-2 right-2 p-1.5 rounded-md',
                              'bg-red-500 hover:bg-red-600 text-white',
                              'doubao-transition-colors opacity-90 hover:opacity-100'
                            )}
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3,6 5,6 21,6" />
                              <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Empty State */}
                {displayConversations.length === 0 && (
                  <motion.div
                    variants={doubaoAnimations.staggerItem}
                    className="text-center py-8"
                  >
                    <div className="text-doubao-text-muted doubao-text-sm">
                      No conversations yet
                    </div>
                    <div className="text-doubao-text-muted doubao-text-xs mt-1">
                      Start a new chat to begin
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-doubao-border-light">
              <div className="text-doubao-text-muted doubao-text-xs text-center">
                Doubao AI Assistant
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};

export default DoubaoSidebar;