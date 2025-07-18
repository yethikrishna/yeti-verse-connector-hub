import { Variants } from 'framer-motion';

// Doubao-specific animation variants for Framer Motion
export const doubaoAnimations = {
  // Message animations
  messageVariants: {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  } as Variants,

  // Sidebar animations
  sidebarVariants: {
    hidden: {
      x: -280,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    exit: {
      x: -280,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  } as Variants,

  // Page transition animations
  pageVariants: {
    hidden: {
      opacity: 0,
      x: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  } as Variants,

  // Button hover animations
  buttonVariants: {
    rest: {
      scale: 1,
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.15,
        ease: 'easeOut',
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
        ease: 'easeOut',
      },
    },
  } as Variants,

  // Typing indicator animation
  typingVariants: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 1.4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  } as Variants,

  // Stagger container for multiple elements
  staggerContainer: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  } as Variants,

  // Stagger item for use with staggerContainer
  staggerItem: {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  } as Variants,

  // Fade in up animation (commonly used)
  fadeInUp: {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  } as Variants,

  // Modal/Dialog animations
  modalVariants: {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.15,
        ease: 'easeIn',
      },
    },
  } as Variants,

  // Backdrop animations
  backdropVariants: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.15,
      },
    },
  } as Variants,
};

// Common animation configurations
export const doubaoTransitions = {
  // Standard easing curves
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  
  // Doubao-specific timing
  fast: { duration: 0.15 },
  normal: { duration: 0.3 },
  slow: { duration: 0.5 },
  
  // Spring configurations
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  
  gentleSpring: {
    type: 'spring',
    stiffness: 200,
    damping: 25,
  },
};

// Animation utility functions
export const createStaggeredAnimation = (delay: number = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: delay,
      delayChildren: delay,
    },
  },
});

export const createSlideAnimation = (direction: 'left' | 'right' | 'up' | 'down' = 'up') => {
  const directions = {
    left: { x: -20, y: 0 },
    right: { x: 20, y: 0 },
    up: { x: 0, y: 20 },
    down: { x: 0, y: -20 },
  };

  return {
    hidden: {
      opacity: 0,
      ...directions[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.3,
        ease: doubaoTransitions.easeOut,
      },
    },
  };
};

export const createFadeAnimation = (duration: number = 0.3) => ({
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration,
      ease: doubaoTransitions.easeOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration * 0.7,
      ease: doubaoTransitions.easeIn,
    },
  },
});