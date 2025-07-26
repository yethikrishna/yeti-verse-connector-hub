import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DoubaoPageSkeleton } from './DoubaoSkeleton';
import { cn } from '@/lib/doubao-utils';

interface DoubaoLoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeletonType?: 'chat' | 'settings' | 'list';
  loadingText?: string;
  className?: string;
  showSpinner?: boolean;
}

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const DoubaoLoadingState: React.FC<DoubaoLoadingStateProps> = ({
  isLoading,
  children,
  skeletonType = 'chat',
  loadingText,
  className,
  showSpinner = false,
}) => {
  return (
    <div className={cn('relative h-full w-full', className)}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            {showSpinner ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    variants={spinnerVariants}
                    animate="animate"
                    className="w-8 h-8 border-2 border-doubao-primary border-t-transparent rounded-full"
                  />
                  {loadingText && (
                    <p className="text-doubao-text-muted doubao-text-sm">
                      {loadingText}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <DoubaoPageSkeleton type={skeletonType} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Hook for managing loading states
export const useDoubaoLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [loadingText, setLoadingText] = React.useState<string>();

  const startLoading = (text?: string) => {
    setLoadingText(text);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setLoadingText(undefined);
  };

  const withLoading = async <T,>(
    asyncFn: () => Promise<T>,
    text?: string
  ): Promise<T> => {
    startLoading(text);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading();
    }
  };

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    withLoading,
  };
};

export default DoubaoLoadingState;