import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';

interface DoubaoButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  ripple?: boolean;
  className?: string;
}

const buttonVariants = {
  rest: {
    scale: 1,
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
  },
  hover: {
    scale: 1.02,
    backgroundColor: 'var(--bg-hover-color)',
    color: 'var(--text-hover-color)',
    transition: {
      duration: 0.15,
      ease: [0.0, 0.0, 0.2, 1],
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: [0.4, 0.0, 1, 1],
    },
  },
  focus: {
    boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.3)',
    transition: {
      duration: 0.15,
    },
  },
};

const rippleVariants = {
  initial: {
    scale: 0,
    opacity: 0.6,
  },
  animate: {
    scale: 4,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

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

export const DoubaoButton: React.FC<DoubaoButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  ripple = true,
  className,
  onClick,
  ...props
}) => {
  const [ripplePosition, setRipplePosition] = React.useState<{ x: number; y: number } | null>(null);
  const [showRipple, setShowRipple] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    if (ripple) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      setRipplePosition({ x, y });
      setShowRipple(true);
      
      setTimeout(() => setShowRipple(false), 600);
    }

    onClick?.(event);
  };

  const baseClasses = cn(
    'relative overflow-hidden font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    {
      // Variants
      'bg-doubao-primary text-white hover:bg-doubao-primary-hover focus:ring-doubao-primary/30': variant === 'primary',
      'bg-doubao-bg-secondary text-doubao-text-primary hover:bg-doubao-bg-tertiary focus:ring-doubao-primary/30': variant === 'secondary',
      'bg-transparent text-doubao-text-primary hover:bg-doubao-hover focus:ring-doubao-primary/30': variant === 'ghost',
      'border border-doubao-border-light bg-transparent text-doubao-text-primary hover:bg-doubao-hover focus:ring-doubao-primary/30': variant === 'outline',
      
      // Sizes
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-sm': size === 'md',
      'px-6 py-3 text-base': size === 'lg',
    },
    className
  );

  return (
    <motion.button
      className={baseClasses}
      variants={buttonVariants}
      initial="rest"
      whileHover={!disabled && !isLoading ? "hover" : "rest"}
      whileTap={!disabled && !isLoading ? "tap" : "rest"}
      whileFocus={!disabled && !isLoading ? "focus" : "rest"}
      disabled={disabled || isLoading}
      onClick={handleClick}
      style={{
        '--bg-color': variant === 'primary' ? 'rgb(74, 144, 226)' : 
                     variant === 'secondary' ? 'rgb(248, 249, 250)' : 'transparent',
        '--bg-hover-color': variant === 'primary' ? 'rgb(53, 122, 189)' : 
                           variant === 'secondary' ? 'rgb(241, 243, 244)' : 'rgba(0, 0, 0, 0.05)',
        '--text-color': variant === 'primary' ? 'white' : 'rgb(44, 62, 80)',
        '--text-hover-color': variant === 'primary' ? 'white' : 'rgb(44, 62, 80)',
      } as React.CSSProperties}
      {...props}
    >
      {/* Loading spinner */}
      {isLoading && (
        <motion.div
          variants={spinnerVariants}
          animate="animate"
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        </motion.div>
      )}

      {/* Button content */}
      <span className={cn('flex items-center justify-center gap-2', isLoading && 'opacity-0')}>
        {children}
      </span>

      {/* Ripple effect */}
      {showRipple && ripplePosition && (
        <motion.div
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripplePosition.x - 10,
            top: ripplePosition.y - 10,
            width: 20,
            height: 20,
          }}
          variants={rippleVariants}
          initial="initial"
          animate="animate"
        />
      )}
    </motion.button>
  );
};

export default DoubaoButton;