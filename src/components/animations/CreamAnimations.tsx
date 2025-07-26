import React from 'react';
import { motion } from 'framer-motion';

// Cream-themed custom animations and components

// Floating elements animation
export const FloatingElements: React.FC = () => {
  const elements = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {elements.map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(var(--cream-accent-light)) 0%, transparent 70%)',
            width: 20 + i * 10,
            height: 20 + i * 10,
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
};

// Page transition wrapper
interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

// Hover-enhanced card wrapper
interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`${className}`}
      style={{
        background: 'hsl(var(--cream-bg-overlay))',
        border: '1px solid hsl(var(--cream-border-light))',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
        borderColor: 'hsl(var(--cream-border-medium))',
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

// Staggered list animation
interface StaggeredListProps {
  children: React.ReactNode[];
  className?: string;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Cream-themed button with animations
interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
}) => {
  const baseStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, hsl(var(--cream-primary)) 0%, hsl(var(--cream-primary-light)) 100%)',
      color: 'hsl(var(--cream-bg-primary))',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    secondary: {
      background: 'hsl(var(--cream-bg-overlay))',
      color: 'hsl(var(--cream-text-primary))',
      border: '1px solid hsl(var(--cream-border-medium))',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
    },
  };

  return (
    <motion.button
      className={className}
      style={{ ...baseStyle, ...variantStyles[variant] }}
      onClick={onClick}
      whileHover={{
        scale: 1.05,
        boxShadow: variant === 'primary' 
          ? '0 6px 20px rgba(0, 0, 0, 0.15)'
          : '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
      whileTap={{
        scale: 0.95,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      {children}
    </motion.button>
  );
};

// Pulse animation for loading states
export const PulseLoader: React.FC = () => {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full"
          style={{ background: 'hsl(var(--cream-primary))' }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Typing indicator animation
export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-1 p-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: 'hsl(var(--cream-text-muted))' }}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};