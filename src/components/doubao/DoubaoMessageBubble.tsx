import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
}

export interface DoubaoMessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
  className?: string;
  onMessageClick?: (messageId: string) => void;
}

export const DoubaoMessageBubble: React.FC<DoubaoMessageBubbleProps> = ({
  message,
  showAvatar = true,
  className,
  onMessageClick,
}) => {
  const isUser = message.role === 'user';
  const isAI = message.role === 'assistant';

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <motion.div
      variants={doubaoAnimations.messageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        'flex gap-3 mb-4 group',
        isUser ? 'justify-end' : 'justify-start',
        className
      )}
      onClick={() => onMessageClick?.(message.id)}
    >
      {/* AI Avatar (left side) */}
      {isAI && showAvatar && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-doubao-primary-blue to-doubao-purple flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Message Content Container */}
      <div className={cn(
        'flex flex-col max-w-[70%]',
        isUser ? 'items-end' : 'items-start'
      )}>
        {/* Message Bubble */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'px-4 py-3 rounded-2xl relative',
            'doubao-message-text break-words',
            // User message styling
            isUser && [
              'doubao-gradient-blue text-white',
              'rounded-br-md', // Sharp corner on bottom-right
              'doubao-shadow-soft'
            ],
            // AI message styling
            isAI && [
              'bg-doubao-ai-bubble text-doubao-ai-bubble-text',
              'rounded-bl-md', // Sharp corner on bottom-left
              'border border-doubao-border-light'
            ]
          )}
        >
          {/* Message Content */}
          <div className="whitespace-pre-wrap">
            {message.content}
          </div>

          {/* Streaming indicator for AI messages */}
          {isAI && message.isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center ml-2"
            >
              <div className="flex space-x-1">
                <motion.div
                  variants={doubaoAnimations.typingVariants}
                  animate="animate"
                  className="w-1 h-1 bg-doubao-text-muted rounded-full"
                />
                <motion.div
                  variants={doubaoAnimations.typingVariants}
                  animate="animate"
                  style={{ animationDelay: '0.2s' }}
                  className="w-1 h-1 bg-doubao-text-muted rounded-full"
                />
                <motion.div
                  variants={doubaoAnimations.typingVariants}
                  animate="animate"
                  style={{ animationDelay: '0.4s' }}
                  className="w-1 h-1 bg-doubao-text-muted rounded-full"
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Timestamp */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            'doubao-timestamp-text mt-1 px-2',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            isUser ? 'text-right' : 'text-left'
          )}
        >
          {formatTimestamp(message.timestamp)}
        </motion.div>
      </div>

      {/* User Avatar (right side) - placeholder for future implementation */}
      {isUser && showAvatar && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-doubao-primary-blue flex items-center justify-center">
            <span className="text-white doubao-text-sm font-medium">
              U
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Component for rendering multiple messages with proper spacing
export interface DoubaoMessageListProps {
  messages: Message[];
  showAvatars?: boolean;
  className?: string;
  onMessageClick?: (messageId: string) => void;
}

export const DoubaoMessageList: React.FC<DoubaoMessageListProps> = ({
  messages,
  showAvatars = true,
  className,
  onMessageClick,
}) => {
  return (
    <motion.div
      variants={doubaoAnimations.staggerContainer}
      initial="hidden"
      animate="visible"
      className={cn('space-y-0', className)}
    >
      {messages.map((message, index) => {
        const prevMessage = messages[index - 1];
        const isConsecutive = prevMessage && prevMessage.role === message.role;
        
        return (
          <motion.div
            key={message.id}
            variants={doubaoAnimations.staggerItem}
            custom={index}
            className={cn(
              // Reduce spacing between consecutive messages from same sender
              isConsecutive ? 'mt-1' : 'mt-4'
            )}
          >
            <DoubaoMessageBubble
              message={message}
              showAvatar={showAvatars && !isConsecutive}
              onMessageClick={onMessageClick}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default DoubaoMessageBubble;