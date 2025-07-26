import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';

interface DoubaoPageTransitionProps {
  children: React.ReactNode;
  transitionKey: string;
  direction?: 'horizontal' | 'vertical' | 'fade';
  className?: string;
}

const transitionVariants = {
  horizontal: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  vertical: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

const transitionConfig = {
  type: 'tween',
  duration: 0.3,
  ease: [0.0, 0.0, 0.2, 1], // Doubao's easeOut curve
};

export const DoubaoPageTransition: React.FC<DoubaoPageTransitionProps> = ({
  children,
  transitionKey,
  direction = 'horizontal',
  className,
}) => {
  const variants = transitionVariants[direction];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={transitionConfig}
        className={cn('h-full w-full', className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default DoubaoPageTransition;