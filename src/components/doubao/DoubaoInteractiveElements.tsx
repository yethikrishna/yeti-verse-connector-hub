import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';

// Interactive Card Component
interface DoubaoCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hoverable?: boolean;
  clickable?: boolean;
  className?: string;
}

const cardVariants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    scale: 1.01,
    y: -2,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: {
      duration: 0.15,
      ease: [0.0, 0.0, 0.2, 1],
    },
  },
  tap: {
    scale: 0.99,
    y: 0,
    transition: {
      duration: 0.1,
      ease: [0.4, 0.0, 1, 1],
    },
  },
};

export const DoubaoCard: React.FC<DoubaoCardProps> = ({
  children,
  hoverable = true,
  clickable = false,
  className,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        'bg-white rounded-lg border border-doubao-border-light p-4',
        clickable && 'cursor-pointer',
        className
      )}
      variants={cardVariants}
      initial="rest"
      whileHover={hoverable ? "hover" : "rest"}
      whileTap={clickable ? "tap" : "rest"}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Interactive Input Component
interface DoubaoInputProps extends Omit<HTMLMotionProps<'input'>, 'onChange'> {
  label?: string;
  error?: string;
  className?: string;
  onChange?: (value: string) => void;
}

const inputVariants = {
  rest: {
    borderColor: 'rgb(229, 231, 235)',
    boxShadow: 'none',
  },
  focus: {
    borderColor: 'rgb(74, 144, 226)',
    boxShadow: '0 0 0 3px rgba(74, 144, 226, 0.1)',
    transition: {
      duration: 0.15,
      ease: [0.0, 0.0, 0.2, 1],
    },
  },
  error: {
    borderColor: 'rgb(239, 68, 68)',
    boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
  },
};

export const DoubaoInput: React.FC<DoubaoInputProps> = ({
  label,
  error,
  className,
  onChange,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="space-y-1">
      {label && (
        <motion.label
          className="block text-sm font-medium text-doubao-text-primary"
          animate={{ color: isFocused ? 'rgb(74, 144, 226)' : 'rgb(44, 62, 80)' }}
          transition={{ duration: 0.15 }}
        >
          {label}
        </motion.label>
      )}
      <motion.input
        className={cn(
          'w-full px-3 py-2 border rounded-lg bg-white text-doubao-text-primary',
          'placeholder:text-doubao-text-muted focus:outline-none',
          error && 'border-red-500',
          className
        )}
        variants={inputVariants}
        initial="rest"
        animate={error ? "error" : isFocused ? "focus" : "rest"}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
      {error && (
        <motion.p
          className="text-sm text-red-500"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// Interactive Icon Button
interface DoubaoIconButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'filled';
  className?: string;
}

const iconButtonVariants = {
  rest: {
    scale: 1,
    backgroundColor: 'transparent',
  },
  hover: {
    scale: 1.05,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    transition: {
      duration: 0.15,
      ease: [0.0, 0.0, 0.2, 1],
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: [0.4, 0.0, 1, 1],
    },
  },
};

export const DoubaoIconButton: React.FC<DoubaoIconButtonProps> = ({
  children,
  size = 'md',
  variant = 'ghost',
  className,
  ...props
}) => {
  return (
    <motion.button
      className={cn(
        'rounded-lg flex items-center justify-center transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-doubao-primary/30',
        {
          'w-8 h-8': size === 'sm',
          'w-10 h-10': size === 'md',
          'w-12 h-12': size === 'lg',
          'bg-doubao-bg-secondary': variant === 'filled',
        },
        className
      )}
      variants={iconButtonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Interactive List Item
interface DoubaoListItemProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  selected?: boolean;
  className?: string;
}

const listItemVariants = {
  rest: {
    backgroundColor: 'transparent',
    x: 0,
  },
  hover: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    x: 2,
    transition: {
      duration: 0.15,
      ease: [0.0, 0.0, 0.2, 1],
    },
  },
  selected: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    x: 4,
  },
  tap: {
    scale: 0.99,
    transition: {
      duration: 0.1,
      ease: [0.4, 0.0, 1, 1],
    },
  },
};

export const DoubaoListItem: React.FC<DoubaoListItemProps> = ({
  children,
  selected = false,
  className,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        'px-3 py-2 rounded-lg cursor-pointer border-l-2 border-transparent',
        selected && 'border-l-doubao-primary',
        className
      )}
      variants={listItemVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate={selected ? "selected" : "rest"}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Interactive Toggle Switch
interface DoubaoToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const toggleVariants = {
  off: {
    backgroundColor: 'rgb(209, 213, 219)',
  },
  on: {
    backgroundColor: 'rgb(74, 144, 226)',
  },
};

const thumbVariants = {
  off: {
    x: 2,
  },
  on: {
    x: 22,
  },
};

export const DoubaoToggle: React.FC<DoubaoToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {label && (
        <span className="text-sm font-medium text-doubao-text-primary">
          {label}
        </span>
      )}
      <motion.button
        className={cn(
          'relative w-11 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-doubao-primary/30',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        variants={toggleVariants}
        animate={checked ? "on" : "off"}
        transition={{ duration: 0.15, ease: [0.0, 0.0, 0.2, 1] }}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
          variants={thumbVariants}
          animate={checked ? "on" : "off"}
          transition={{ duration: 0.15, ease: [0.0, 0.0, 0.2, 1] }}
        />
      </motion.button>
    </div>
  );
};

export default {
  DoubaoCard,
  DoubaoInput,
  DoubaoIconButton,
  DoubaoListItem,
  DoubaoToggle,
};