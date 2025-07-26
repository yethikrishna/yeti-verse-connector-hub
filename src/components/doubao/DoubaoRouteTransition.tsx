import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getRouteTransition } from '@/lib/doubao-animations';
import { DoubaoLoadingState, useDoubaoLoading } from './DoubaoLoadingState';

interface DoubaoRouteTransitionProps {
  children: React.ReactNode;
  loadingDelay?: number;
  skeletonType?: 'chat' | 'settings' | 'list';
}

export const DoubaoRouteTransition: React.FC<DoubaoRouteTransitionProps> = ({
  children,
  loadingDelay = 150,
  skeletonType = 'chat',
}) => {
  const location = useLocation();
  const { isLoading, startLoading, stopLoading } = useDoubaoLoading();
  const [previousPath, setPreviousPath] = React.useState(location.pathname);

  // Handle route changes with loading states
  React.useEffect(() => {
    if (location.pathname !== previousPath) {
      startLoading();
      
      // Simulate loading time for smooth transitions
      const timer = setTimeout(() => {
        stopLoading();
        setPreviousPath(location.pathname);
      }, loadingDelay);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, previousPath, loadingDelay, startLoading, stopLoading]);

  const transitionVariants = getRouteTransition(previousPath, location.pathname);

  return (
    <DoubaoLoadingState isLoading={isLoading} skeletonType={skeletonType}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.3,
            ease: [0.0, 0.0, 0.2, 1],
          }}
          className="h-full w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </DoubaoLoadingState>
  );
};

export default DoubaoRouteTransition;