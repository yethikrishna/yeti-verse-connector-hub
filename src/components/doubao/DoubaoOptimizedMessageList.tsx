import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { DoubaoVirtualScroll } from './DoubaoVirtualScroll';
import { DoubaoMessageBubble, Message } from './DoubaoMessageBubble';
import { useBatchedMessages, usePerformanceMonitor } from '@/lib/performance-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';

export interface DoubaoOptimizedMessageListProps {
  messages: Message[];
  className?: string;
  containerHeight: number;
  onMessageClick?: (messageId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  enableVirtualization?: boolean;
  batchSize?: number;
  showAvatars?: boolean;
  autoScroll?: boolean;
}

export const DoubaoOptimizedMessageList: React.FC<DoubaoOptimizedMessageListProps> = ({
  messages,
  className,
  containerHeight,
  onMessageClick,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  enableVirtualization = true,
  batchSize = 50,
  showAvatars = true,
  autoScroll = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { metrics, measureRenderTime } = usePerformanceMonitor();
  const previousMessagesLength = useRef(messages.length);

  // Use batched messages for non-virtualized rendering
  const {
    visibleItems: batchedMessages,
    hasMore: hasBatchedMore,
    isLoading: isBatchLoading,
    loadMore: loadMoreBatch,
  } = useBatchedMessages(messages, batchSize);

  // Calculate estimated item height based on message content
  const estimateMessageHeight = useCallback((message: Message, index: number): number => {
    const baseHeight = 60; // Base height for message bubble
    const contentLength = message.content.length;
    const estimatedLines = Math.ceil(contentLength / 50); // Rough estimate
    const lineHeight = 20;
    
    return baseHeight + (estimatedLines * lineHeight);
  }, []);

  // Optimized render function for virtual scroll
  const renderMessage = useCallback((message: Message, index: number, isVisible: boolean) => {
    const startTime = performance.now();
    
    const prevMessage = messages[index - 1];
    const isConsecutive = prevMessage && prevMessage.role === message.role;
    
    const result = (
      <div className={cn('px-4', isConsecutive ? 'mt-1' : 'mt-4')}>
        <DoubaoMessageBubble
          message={message}
          showAvatar={showAvatars && !isConsecutive}
          onMessageClick={onMessageClick}
        />
      </div>
    );
    
    if (isVisible) {
      measureRenderTime(startTime);
    }
    
    return result;
  }, [messages, showAvatars, onMessageClick, measureRenderTime]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && containerRef.current && messages.length > previousMessagesLength.current) {
      const container = containerRef.current;
      const scrollToBottom = () => {
        container.scrollTop = container.scrollHeight - container.clientHeight;
      };
      
      // Use requestAnimationFrame for smooth scrolling
      requestAnimationFrame(scrollToBottom);
    }
    
    previousMessagesLength.current = messages.length;
  }, [messages.length, autoScroll]);

  // Prepare messages for virtual scrolling
  const virtualScrollItems = useMemo(() => {
    return messages.map(message => ({
      id: message.id,
      data: message,
      height: estimateMessageHeight(message, 0),
    }));
  }, [messages, estimateMessageHeight]);

  // Handle load more for virtual scroll
  const handleLoadMore = useCallback(() => {
    if (enableVirtualization) {
      onLoadMore?.();
    } else {
      loadMoreBatch();
    }
  }, [enableVirtualization, onLoadMore, loadMoreBatch]);

  // Performance monitoring display (development only)
  const showPerformanceMetrics = process.env.NODE_ENV === 'development';

  if (enableVirtualization && messages.length > batchSize) {
    return (
      <div className={cn('relative', className)}>
        {/* Performance metrics overlay */}
        {showPerformanceMetrics && (
          <div className="absolute top-2 right-2 z-50 bg-black/80 text-white text-xs p-2 rounded">
            FPS: {metrics.fps} | Memory: {metrics.memoryUsage}MB | Render: {metrics.renderTime}ms
          </div>
        )}
        
        <DoubaoVirtualScroll
          items={virtualScrollItems}
          itemHeight={estimateMessageHeight}
          renderItem={(item, index, isVisible) => renderMessage(item.data, index, isVisible)}
          containerHeight={containerHeight}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
          enableSmoothScrolling={true}
          maintainScrollPosition={true}
          className="doubao-scrollbar"
        />
      </div>
    );
  }

  // Fallback to batched rendering for smaller lists
  return (
    <div 
      ref={containerRef}
      className={cn(
        'overflow-auto doubao-scrollbar',
        className
      )}
      style={{ height: containerHeight }}
    >
      {/* Performance metrics overlay */}
      {showPerformanceMetrics && (
        <div className="sticky top-2 right-2 z-50 bg-black/80 text-white text-xs p-2 rounded ml-auto w-fit">
          FPS: {metrics.fps} | Memory: {metrics.memoryUsage}MB | Render: {metrics.renderTime}ms
        </div>
      )}

      <motion.div
        variants={doubaoAnimations.staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-0"
      >
        <AnimatePresence mode="popLayout">
          {batchedMessages.map((message, index) => {
            const prevMessage = batchedMessages[index - 1];
            const isConsecutive = prevMessage && prevMessage.role === message.role;
            
            return (
              <motion.div
                key={message.id}
                variants={doubaoAnimations.staggerItem}
                layout
                className={cn(
                  'px-4',
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
        </AnimatePresence>

        {/* Load more button for batched rendering */}
        {hasBatchedMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center py-4"
          >
            <button
              onClick={loadMoreBatch}
              disabled={isBatchLoading}
              className={cn(
                'px-4 py-2 rounded-lg border border-doubao-border-light',
                'hover:bg-doubao-hover transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isBatchLoading ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-doubao-border-medium border-t-doubao-primary-blue rounded-full"
                  />
                  Loading...
                </div>
              ) : (
                'Load more messages'
              )}
            </button>
          </motion.div>
        )}

        {/* End of messages indicator */}
        {!hasBatchedMore && batchedMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-4"
          >
            <div className="text-doubao-text-muted text-sm">
              {messages.length === batchedMessages.length ? 'No more messages' : 'All messages loaded'}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Hook for optimized message list management
export const useOptimizedMessageList = (
  messages: Message[],
  options: {
    containerHeight: number;
    enableVirtualization?: boolean;
    batchSize?: number;
    autoScroll?: boolean;
  }
) => {
  const {
    containerHeight,
    enableVirtualization = true,
    batchSize = 50,
    autoScroll = true,
  } = options;

  // Determine if virtualization should be enabled
  const shouldVirtualize = useMemo(() => {
    return enableVirtualization && messages.length > batchSize;
  }, [enableVirtualization, messages.length, batchSize]);

  // Performance optimization: memoize message processing
  const processedMessages = useMemo(() => {
    return messages.map((message, index) => ({
      ...message,
      // Add computed properties for optimization
      isFirst: index === 0,
      isLast: index === messages.length - 1,
      isConsecutive: index > 0 && messages[index - 1].role === message.role,
    }));
  }, [messages]);

  return {
    processedMessages,
    shouldVirtualize,
    containerHeight,
    autoScroll,
  };
};

export default DoubaoOptimizedMessageList;