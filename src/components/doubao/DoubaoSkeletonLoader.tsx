import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, animate = true }) => (
  <div
    className={cn(
      'bg-gray-200 rounded',
      animate && 'animate-pulse',
      className
    )}
  />
);

// Message skeleton for chat loading
export const MessageSkeleton: React.FC<{ isUser?: boolean }> = ({ isUser = false }) => (
  <div className={cn('flex gap-3 mb-4', isUser && 'justify-end')}>
    {!isUser && (
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
    )}
    <div className={cn('flex flex-col gap-2', isUser ? 'items-end' : 'items-start')}>
      <Skeleton className={cn('h-4', isUser ? 'w-32' : 'w-24')} />
      <div className={cn(
        'rounded-2xl p-3 max-w-xs',
        isUser ? 'bg-blue-50' : 'bg-gray-50'
      )}>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  </div>
);

// Chat list skeleton for sidebar
export const ChatListSkeleton: React.FC = () => (
  <div className="space-y-2 p-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-2">
        <Skeleton className="w-6 h-6 rounded" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-1" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// Settings panel skeleton
export const SettingsSkeleton: React.FC = () => (
  <div className="space-y-6 p-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

// Page loading skeleton
export const PageSkeleton: React.FC = () => (
  <div className="flex h-screen">
    {/* Sidebar skeleton */}
    <div className="w-80 bg-gray-50 border-r">
      <div className="p-4">
        <Skeleton className="h-10 w-full mb-4" />
        <ChatListSkeleton />
      </div>
    </div>
    
    {/* Main content skeleton */}
    <div className="flex-1 flex flex-col">
      {/* Header skeleton */}
      <div className="h-16 border-b bg-white flex items-center justify-between px-6">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded" />
        </div>
      </div>
      
      {/* Chat area skeleton */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <MessageSkeleton key={i} isUser={i % 2 === 0} />
          ))}
        </div>
      </div>
      
      {/* Input area skeleton */}
      <div className="border-t bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

// Typing indicator skeleton
export const TypingIndicatorSkeleton: React.FC = () => (
  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl max-w-xs">
    <div className="flex gap-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
    <span className="text-sm text-gray-500">AI is typing...</span>
  </div>
);

// Card skeleton for feature pages
export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border p-6 space-y-4">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

// Grid skeleton for feature pages
export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);