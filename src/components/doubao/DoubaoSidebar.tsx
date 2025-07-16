import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';

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
  className?: string;
}

export const DoubaoSidebar: React.FC<DoubaoSidebarProps> = ({
  conversations = [],
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  isCollapsed = false,
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

  const truncateTitle = (title: string, maxLength: number = 35) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '…';
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? 0 : 280,
        opacity: isCollapsed ? 0 : 1,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
      className={cn(
        'h-full bg-doubao-bg-sidebar border-r border-doubao-border-light',
        'flex flex-col overflow-hidden',
        className
      )}
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
            {/* New Chat Button */}
            <div className="p-4 border-b border-doubao-border-light">
              <motion.button
                variants={doubaoAnimations.buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={onNewChat}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3',
                  'bg-doubao-primary-blue hover:bg-doubao-primary-blue-dark',
                  'text-white rounded-lg doubao-transition-colors',
                  'doubao-text-sm font-medium'
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
                  variants={doubaoAnimations.staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-1"
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
                        onClick={() => onSelectConversation?.(conversation.id)}
                        className={cn(
                          'w-full text-left p-3 rounded-lg doubao-transition-colors',
                          'flex flex-col gap-1 relative',
                          activeConversationId === conversation.id
                            ? 'bg-doubao-primary-blue text-white shadow-sm'
                            : 'hover:bg-doubao-hover text-doubao-text-primary'
                        )}
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