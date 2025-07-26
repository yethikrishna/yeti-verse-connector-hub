import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';

interface DoubaoSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

const shimmerVariants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 1.5,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

export const DoubaoSkeleton: React.FC<DoubaoSkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animate = true,
}) => {
  const baseClasses = cn(
    'bg-gradient-to-r from-doubao-bg-secondary via-doubao-bg-tertiary to-doubao-bg-secondary',
    'bg-[length:200%_100%]',
    {
      'rounded-full': variant === 'circular',
      'rounded-md': variant === 'rectangular',
      'rounded-sm h-4': variant === 'text',
    },
    className
  );

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'circular' ? width : undefined),
  };

  return (
    <motion.div
      className={baseClasses}
      style={style}
      variants={animate ? shimmerVariants : undefined}
      animate={animate ? 'animate' : undefined}
    />
  );
};

// Predefined skeleton components for common use cases
export const DoubaoMessageSkeleton: React.FC<{ isUser?: boolean }> = ({ isUser = false }) => (
  <div className={cn('flex gap-3 mb-4', isUser && 'justify-end')}>
    {!isUser && (
      <DoubaoSkeleton variant="circular" width={32} height={32} className="flex-shrink-0" />
    )}
    <div className={cn('flex flex-col gap-2', isUser ? 'items-end' : 'items-start')}>
      <DoubaoSkeleton 
        variant="rectangular" 
        width={isUser ? 200 : 250} 
        height={60} 
        className="rounded-2xl"
      />
      <DoubaoSkeleton variant="text" width={80} height={12} />
    </div>
  </div>
);

export const DoubaoConversationSkeleton: React.FC = () => (
  <div className="p-3 space-y-2">
    <DoubaoSkeleton variant="text" width="80%" height={16} />
    <DoubaoSkeleton variant="text" width="60%" height={12} />
    <DoubaoSkeleton variant="text" width="40%" height={10} />
  </div>
);

export const DoubaoPageSkeleton: React.FC<{ type?: 'chat' | 'settings' | 'list' }> = ({ 
  type = 'chat' 
}) => {
  switch (type) {
    case 'chat':
      return (
        <div className="h-full flex flex-col">
          {/* Header skeleton */}
          <div className="h-[60px] border-b border-doubao-border-light px-6 flex items-center justify-between">
            <DoubaoSkeleton variant="text" width={120} height={20} />
            <DoubaoSkeleton variant="circular" width={32} height={32} />
          </div>
          
          {/* Messages skeleton */}
          <div className="flex-1 p-6 space-y-6">
            <DoubaoMessageSkeleton />
            <DoubaoMessageSkeleton isUser />
            <DoubaoMessageSkeleton />
            <DoubaoMessageSkeleton isUser />
          </div>
          
          {/* Input skeleton */}
          <div className="p-6 border-t border-doubao-border-light">
            <DoubaoSkeleton variant="rectangular" width="100%" height={48} className="rounded-full" />
          </div>
        </div>
      );
      
    case 'settings':
      return (
        <div className="h-full p-6 space-y-6">
          <DoubaoSkeleton variant="text" width={200} height={24} />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <DoubaoSkeleton variant="text" width={150} height={16} />
                <DoubaoSkeleton variant="rectangular" width="100%" height={40} />
              </div>
            ))}
          </div>
        </div>
      );
      
    case 'list':
      return (
        <div className="h-full p-6 space-y-4">
          <DoubaoSkeleton variant="text" width={180} height={24} />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4 border border-doubao-border-light rounded-lg space-y-2">
              <DoubaoSkeleton variant="text" width="70%" height={16} />
              <DoubaoSkeleton variant="text" width="50%" height={12} />
            </div>
          ))}
        </div>
      );
      
    default:
      return (
        <div className="h-full p-6">
          <DoubaoSkeleton variant="rectangular" width="100%" height="100%" />
        </div>
      );
  }
};

export default DoubaoSkeleton;