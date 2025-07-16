import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';

export interface DoubaoTypingIndicatorProps {
  isVisible?: boolean;
  variant?: 'dots' | 'pulse' | 'wave';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DoubaoTypingIndicator: React.FC<DoubaoTypingIndicatorProps> = ({
  isVisible = true,
  variant = 'dots',
  size = 'md',
  className,
}) => {
  if (!isVisible) return null;

  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2',
  };

  const containerClasses = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  };

  if (variant === 'dots') {
    return (
      <div className={cn(
        'flex items-center justify-center',
        containerClasses[size],
        className
      )}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            variants={doubaoAnimations.typingVariants}
            animate="animate"
            style={{ animationDelay: `${index * 0.2}s` }}
            className={cn(
              'bg-doubao-text-muted rounded-full',
              sizeClasses[size]
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        animate={{
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={cn(
          'flex items-center gap-1 text-doubao-text-muted doubao-text-sm',
          className
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
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        AI is thinking...
      </motion.div>
    );
  }

  if (variant === 'wave') {
    return (
      <div className={cn(
        'flex items-center',
        containerClasses[size],
        className
      )}>
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            animate={{
              scaleY: [1, 2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.1,
              ease: 'easeInOut',
            }}
            className={cn(
              'bg-doubao-text-muted rounded-full',
              sizeClasses[size],
              'origin-bottom'
            )}
          />
        ))}
      </div>
    );
  }

  return null;
};

export default DoubaoTypingIndicator;