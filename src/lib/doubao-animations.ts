import { Variants } from 'framer-motion';

// GPU-optimized animation configurations
const GPU_OPTIMIZED_TRANSITION = {
  type: 'tween' as const,
  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
};

const PERFORMANCE_OPTIMIZED_PROPS = {
  // Enable GPU acceleration
  style: {
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden' as const,
    perspective: 1000,
  },
};

// Doubao-specific animation variants for Framer Motion (GPU-optimized)
export const doubaoAnimations = {
  // Message animations (GPU-optimized)
  messageVariants: {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      ...PERFORMANCE_OPTIMIZED_PROPS.style,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        ...GPU_OPTIMIZED_TRANSITION,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        ...GPU_OPTIMIZED_TRANSITION,
        duration: 0.2,
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

  // Enhanced page transitions with different directions
  pageSlideLeft: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  } as Variants,

  pageSlideRight: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  } as Variants,

  pageSlideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  } as Variants,

  pageSlideDown: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  } as Variants,

  // Smooth fade transitions
  pageFade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,

  // Scale transitions for modal-like pages
  pageScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  } as Variants,

  // Navigation-specific transitions
  navigationSlide: {
    initial: { opacity: 0, x: 20, y: 10 },
    animate: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: {
        duration: 0.25,
        ease: [0.0, 0.0, 0.2, 1],
      },
    },
    exit: { 
      opacity: 0, 
      x: -20, 
      y: -10,
      transition: {
        duration: 0.2,
        ease: [0.4, 0.0, 1, 1],
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

  // Enhanced button interactions
  primaryButtonVariants: {
    rest: {
      scale: 1,
      backgroundColor: 'rgb(74, 144, 226)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    hover: {
      scale: 1.02,
      backgroundColor: 'rgb(53, 122, 189)',
      boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
      transition: {
        duration: 0.15,
        ease: [0.0, 0.0, 0.2, 1],
      },
    },
    tap: {
      scale: 0.98,
      backgroundColor: 'rgb(37, 99, 161)',
      transition: {
        duration: 0.1,
        ease: [0.4, 0.0, 1, 1],
      },
    },
    focus: {
      boxShadow: '0 0 0 3px rgba(74, 144, 226, 0.3)',
      transition: {
        duration: 0.15,
      },
    },
  } as Variants,

  // Icon button animations
  iconButtonVariants: {
    rest: {
      scale: 1,
      backgroundColor: 'transparent',
      rotate: 0,
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
      rotate: 5,
      transition: {
        duration: 0.1,
        ease: [0.4, 0.0, 1, 1],
      },
    },
  } as Variants,

  // Interactive card animations
  cardVariants: {
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
  } as Variants,

  // Input focus animations
  inputVariants: {
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

// Advanced page transition utilities
export const createPageTransition = (
  type: 'slide' | 'fade' | 'scale' | 'navigation' = 'slide',
  direction?: 'left' | 'right' | 'up' | 'down'
) => {
  switch (type) {
    case 'slide':
      const slideDirection = direction || 'right';
      return doubaoAnimations[`pageSlide${slideDirection.charAt(0).toUpperCase() + slideDirection.slice(1)}` as keyof typeof doubaoAnimations] || doubaoAnimations.pageSlideRight;
    
    case 'fade':
      return doubaoAnimations.pageFade;
    
    case 'scale':
      return doubaoAnimations.pageScale;
    
    case 'navigation':
      return doubaoAnimations.navigationSlide;
    
    default:
      return doubaoAnimations.pageVariants;
  }
};

// Loading state animations
export const loadingAnimations = {
  skeleton: {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration: 1.5,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  } as Variants,

  spinner: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  } as Variants,

  pulse: {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  } as Variants,

  dots: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  } as Variants,
};

// Route-based transition mapping
export const getRouteTransition = (fromRoute: string, toRoute: string) => {
  // Define route hierarchy for smart transitions
  const routeHierarchy = {
    '/': 0,
    '/chat': 1,
    '/settings': 1,
    '/product-updates': 1,
  };

  const fromLevel = routeHierarchy[fromRoute as keyof typeof routeHierarchy] ?? 1;
  const toLevel = routeHierarchy[toRoute as keyof typeof routeHierarchy] ?? 1;

  // Determine transition direction based on hierarchy
  if (toLevel > fromLevel) {
    return createPageTransition('slide', 'left');
  } else if (toLevel < fromLevel) {
    return createPageTransition('slide', 'right');
  } else {
    return createPageTransition('fade');
  }
};