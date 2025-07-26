import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';

// Hover wrapper for any element
interface DoubaoHoverWrapperProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  effect?: 'lift' | 'scale' | 'glow' | 'slide' | 'rotate';
  intensity?: 'subtle' | 'normal' | 'strong';
  className?: string;
}

const hoverEffects = {
  lift: {
    subtle: { y: -1, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' },
    normal: { y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' },
    strong: { y: -4, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)' },
  },
  scale: {
    subtle: { scale: 1.01 },
    normal: { scale: 1.02 },
    strong: { scale: 1.05 },
  },
  glow: {
    subtle: { boxShadow: '0 0 8px rgba(74, 144, 226, 0.2)' },
    normal: { boxShadow: '0 0 16px rgba(74, 144, 226, 0.3)' },
    strong: { boxShadow: '0 0 24px rgba(74, 144, 226, 0.4)' },
  },
  slide: {
    subtle: { x: 1 },
    normal: { x: 2 },
    strong: { x: 4 },
  },
  rotate: {
    subtle: { rotate: 1 },
    normal: { rotate: 2 },
    strong: { rotate: 5 },
  },
};

export const DoubaoHoverWrapper: React.FC<DoubaoHoverWrapperProps> = ({
  children,
  effect = 'lift',
  intensity = 'normal',
  className,
  ...props
}) => {
  const hoverStyle = hoverEffects[effect][intensity];

  return (
    <motion.div
      className={cn('transition-all duration-150', className)}
      whileHover={hoverStyle}
      transition={{ duration: 0.15, ease: [0.0, 0.0, 0.2, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Focus ring component
interface DoubaoFocusRingProps {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}

const focusColors = {
  primary: 'focus:ring-doubao-primary/30',
  secondary: 'focus:ring-gray-400/30',
  success: 'focus:ring-green-500/30',
  warning: 'focus:ring-yellow-500/30',
  error: 'focus:ring-red-500/30',
};

export const DoubaoFocusRing: React.FC<DoubaoFocusRingProps> = ({
  children,
  color = 'primary',
  className,
}) => {
  return (
    <div className={cn('focus-within:ring-2 focus-within:ring-offset-2 rounded-lg', focusColors[color], className)}>
      {children}
    </div>
  );
};

// Animated border component
interface DoubaoAnimatedBorderProps {
  children: React.ReactNode;
  active?: boolean;
  color?: string;
  width?: number;
  className?: string;
}

export const DoubaoAnimatedBorder: React.FC<DoubaoAnimatedBorderProps> = ({
  children,
  active = false,
  color = 'rgb(74, 144, 226)',
  width = 2,
  className,
}) => {
  return (
    <motion.div
      className={cn('relative overflow-hidden rounded-lg', className)}
      animate={{
        borderColor: active ? color : 'transparent',
        borderWidth: active ? width : 0,
      }}
      transition={{ duration: 0.15, ease: [0.0, 0.0, 0.2, 1] }}
    >
      {children}
      {active && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}20, transparent)`,
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            ease: 'linear',
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );
};

// Pulse animation component
interface DoubaoPulseProps {
  children: React.ReactNode;
  active?: boolean;
  color?: string;
  intensity?: 'subtle' | 'normal' | 'strong';
  className?: string;
}

const pulseIntensity = {
  subtle: { scale: [1, 1.01, 1], opacity: [1, 0.9, 1] },
  normal: { scale: [1, 1.02, 1], opacity: [1, 0.8, 1] },
  strong: { scale: [1, 1.05, 1], opacity: [1, 0.7, 1] },
};

export const DoubaoPulse: React.FC<DoubaoPulseProps> = ({
  children,
  active = true,
  intensity = 'normal',
  className,
}) => {
  return (
    <motion.div
      className={className}
      animate={active ? pulseIntensity[intensity] : {}}
      transition={{
        duration: 2,
        ease: 'easeInOut',
        repeat: active ? Infinity : 0,
      }}
    >
      {children}
    </motion.div>
  );
};

// Magnetic hover effect
interface DoubaoMagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export const DoubaoMagnetic: React.FC<DoubaoMagneticProps> = ({
  children,
  strength = 0.3,
  className,
}) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    setMousePosition({ x: deltaX, y: deltaY });
  };

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      animate={{
        x: isHovered ? mousePosition.x : 0,
        y: isHovered ? mousePosition.y : 0,
      }}
      transition={{ duration: 0.15, ease: [0.0, 0.0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Stagger animation for lists
interface DoubaoStaggerProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const DoubaoStagger: React.FC<DoubaoStaggerProps> = ({
  children,
  delay = 0.1,
  className,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.0, 0.0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default {
  DoubaoHoverWrapper,
  DoubaoFocusRing,
  DoubaoAnimatedBorder,
  DoubaoPulse,
  DoubaoMagnetic,
  DoubaoStagger,
};