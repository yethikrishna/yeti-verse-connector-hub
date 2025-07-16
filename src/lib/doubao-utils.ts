import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Enhanced cn function for Doubao components
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Doubao color utilities
export const doubaoColors = {
  // Primary colors
  primaryBlue: 'hsl(214 100% 59%)',
  primaryBlueDark: 'hsl(214 100% 45%)',
  secondaryBlue: 'hsl(214 100% 85%)',
  purple: 'hsl(258 90% 66%)',
  purpleLight: 'hsl(258 90% 85%)',
  
  // Background colors
  bgPrimary: 'hsl(0 0% 100%)',
  bgSecondary: 'hsl(210 17% 98%)',
  bgTertiary: 'hsl(210 17% 95%)',
  bgSidebar: 'hsl(210 17% 98%)',
  
  // Text colors
  textPrimary: 'hsl(210 11% 15%)',
  textSecondary: 'hsl(210 9% 31%)',
  textTertiary: 'hsl(210 8% 50%)',
  textMuted: 'hsl(210 8% 65%)',
  
  // Message bubble colors
  userBubble: 'hsl(214 100% 59%)',
  userBubbleDark: 'hsl(214 100% 45%)',
  aiBubble: 'hsl(210 17% 95%)',
  aiBubbleText: 'hsl(210 11% 15%)',
  
  // Border colors
  borderLight: 'hsl(210 17% 90%)',
  borderMedium: 'hsl(210 17% 85%)',
  borderStrong: 'hsl(210 17% 75%)',
  
  // Interactive colors
  hover: 'hsl(210 17% 92%)',
  active: 'hsl(210 17% 88%)',
  focus: 'hsl(214 100% 59%)',
} as const;

// Doubao typography utilities
export const doubaoTypography = {
  xs: 'text-doubao-xs',
  sm: 'text-doubao-sm',
  base: 'text-doubao-base',
  lg: 'text-doubao-lg',
  xl: 'text-doubao-xl',
  '2xl': 'text-doubao-2xl',
  
  // Semantic typography
  message: 'doubao-message-text',
  sidebar: 'doubao-sidebar-text',
  input: 'doubao-input-text',
  timestamp: 'doubao-timestamp-text',
  button: 'doubao-button-text',
  heading: 'doubao-heading',
} as const;

// Doubao spacing utilities (following 8px grid)
export const doubaoSpacing = {
  xs: '4px',   // 0.5 * 8px
  sm: '8px',   // 1 * 8px
  md: '16px',  // 2 * 8px
  lg: '24px',  // 3 * 8px
  xl: '32px',  // 4 * 8px
  '2xl': '48px', // 6 * 8px
  '3xl': '64px', // 8 * 8px
} as const;

// Doubao border radius utilities
export const doubaoBorderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
  
  // Message bubble specific
  messageBubble: '16px',
  messageBubbleCorner: '4px',
} as const;

// Doubao shadow utilities
export const doubaoShadows = {
  soft: '0 2px 8px rgba(0, 0, 0, 0.06)',
  medium: '0 4px 16px rgba(0, 0, 0, 0.1)',
  strong: '0 8px 32px rgba(0, 0, 0, 0.15)',
  glow: '0 0 0 2px hsl(214 100% 59% / 0.2)',
} as const;

// Doubao component size utilities
export const doubaoSizes = {
  sidebar: {
    width: '280px',
    collapsedWidth: '60px',
  },
  header: {
    height: '60px',
  },
  input: {
    height: '80px',
    minHeight: '40px',
  },
  avatar: {
    sm: '24px',
    md: '32px',
    lg: '40px',
  },
  button: {
    sm: { height: '32px', padding: '0 12px' },
    md: { height: '40px', padding: '0 16px' },
    lg: { height: '48px', padding: '0 20px' },
  },
} as const;

// Doubao animation duration utilities
export const doubaoAnimationDurations = {
  fast: 150,
  normal: 300,
  slow: 500,
  
  // Specific animations
  messageAppear: 300,
  sidebarToggle: 200,
  buttonHover: 150,
  pageTransition: 300,
  typingIndicator: 1400,
} as const;

// Utility function to create consistent component variants
export const createDoubaoVariants = <T extends Record<string, any>>(variants: T): T => {
  return variants;
};

// Utility function to generate consistent class names
export const doubaoClass = {
  button: {
    base: 'doubao-button-base',
    primary: 'doubao-button-primary',
    secondary: 'doubao-button-secondary',
  },
  input: {
    base: 'doubao-input-base',
  },
  card: {
    base: 'doubao-card-base',
  },
  message: {
    user: 'doubao-message-bubble-user',
    ai: 'doubao-message-bubble-ai',
  },
  animation: {
    fadeIn: 'doubao-fade-in',
    slideInLeft: 'doubao-slide-in-left',
    slideInRight: 'doubao-slide-in-right',
    typing: 'doubao-typing-indicator',
    hoverScale: 'doubao-hover-scale',
    hoverLift: 'doubao-hover-lift',
    focusRing: 'doubao-focus-ring',
    transitionColors: 'doubao-transition-colors',
    transitionTransform: 'doubao-transition-transform',
    transitionAll: 'doubao-transition-all',
  },
  gradient: {
    blue: 'doubao-gradient-blue',
    purple: 'doubao-gradient-purple',
  },
  shadow: {
    soft: 'doubao-shadow-soft',
    medium: 'doubao-shadow-medium',
    strong: 'doubao-shadow-strong',
  },
} as const;

// Utility function for responsive breakpoints
export const doubaoBreakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Utility function to check if reduced motion is preferred
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Utility function to get animation duration based on user preference
export const getAnimationDuration = (duration: number): number => {
  return prefersReducedMotion() ? 0 : duration;
};