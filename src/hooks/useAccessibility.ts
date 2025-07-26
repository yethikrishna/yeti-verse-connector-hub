import { useEffect, useState, useCallback } from 'react';

export interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export const useAccessibility = () => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
    screenReader: false,
    fontSize: 'medium',
  });

  // Detect user preferences
  useEffect(() => {
    const detectPreferences = () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const highContrast = window.matchMedia('(prefers-contrast: high)').matches;
      const screenReader = window.navigator.userAgent.includes('NVDA') || 
                          window.navigator.userAgent.includes('JAWS') ||
                          window.navigator.userAgent.includes('VoiceOver') ||
                          !!document.querySelector('[aria-live]');

      setPreferences(prev => ({
        ...prev,
        reducedMotion,
        highContrast,
        screenReader,
      }));
    };

    detectPreferences();

    // Listen for changes
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({ ...prev, highContrast: e.matches }));
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    highContrastQuery.addEventListener('change', handleHighContrastChange);

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
    };
  }, []);

  return preferences;
};

// Hook for managing ARIA live regions
export const useAriaLiveRegion = () => {
  const [announcements, setAnnouncements] = useState<string[]>([]);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, message]);
    
    // Create temporary live region for announcement
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.textContent = message;
    
    document.body.appendChild(liveRegion);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(liveRegion);
      setAnnouncements(prev => prev.filter(a => a !== message));
    }, 1000);
  }, []);

  return { announce, announcements };
};

// Hook for managing focus indicators
export const useFocusVisible = () => {
  const [focusVisible, setFocusVisible] = useState(false);

  useEffect(() => {
    let hadKeyboardEvent = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ' || e.key.startsWith('Arrow')) {
        hadKeyboardEvent = true;
      }
    };

    const handleFocus = () => {
      if (hadKeyboardEvent) {
        setFocusVisible(true);
      }
    };

    const handleBlur = () => {
      setFocusVisible(false);
    };

    const handleMouseDown = () => {
      hadKeyboardEvent = false;
      setFocusVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return focusVisible;
};

// Hook for managing skip links
export const useSkipLinks = () => {
  const skipToContent = useCallback(() => {
    const mainContent = document.querySelector('main, [role="main"], #main-content');
    if (mainContent) {
      (mainContent as HTMLElement).focus();
      (mainContent as HTMLElement).scrollIntoView();
    }
  }, []);

  const skipToNavigation = useCallback(() => {
    const navigation = document.querySelector('nav, [role="navigation"], #navigation');
    if (navigation) {
      (navigation as HTMLElement).focus();
      (navigation as HTMLElement).scrollIntoView();
    }
  }, []);

  return { skipToContent, skipToNavigation };
};

// Utility functions for ARIA attributes
export const getAriaProps = (options: {
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  live?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  role?: string;
}) => {
  const ariaProps: Record<string, any> = {};

  if (options.label) ariaProps['aria-label'] = options.label;
  if (options.labelledBy) ariaProps['aria-labelledby'] = options.labelledBy;
  if (options.describedBy) ariaProps['aria-describedby'] = options.describedBy;
  if (options.expanded !== undefined) ariaProps['aria-expanded'] = options.expanded;
  if (options.selected !== undefined) ariaProps['aria-selected'] = options.selected;
  if (options.disabled !== undefined) ariaProps['aria-disabled'] = options.disabled;
  if (options.required !== undefined) ariaProps['aria-required'] = options.required;
  if (options.invalid !== undefined) ariaProps['aria-invalid'] = options.invalid;
  if (options.live) ariaProps['aria-live'] = options.live;
  if (options.atomic !== undefined) ariaProps['aria-atomic'] = options.atomic;
  if (options.role) ariaProps['role'] = options.role;

  return ariaProps;
};

// Hook for managing color contrast
export const useColorContrast = () => {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const checkHighContrast = () => {
      const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
      setHighContrast(highContrastQuery.matches);
    };

    checkHighContrast();

    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const handleChange = (e: MediaQueryListEvent) => setHighContrast(e.matches);
    
    highContrastQuery.addEventListener('change', handleChange);
    return () => highContrastQuery.removeEventListener('change', handleChange);
  }, []);

  const getContrastClass = useCallback((baseClass: string) => {
    return highContrast ? `${baseClass} high-contrast` : baseClass;
  }, [highContrast]);

  return { highContrast, getContrastClass };
};