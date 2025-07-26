import { useState, useEffect, useCallback } from 'react';

export interface ScreenSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
}

export interface DeviceCapabilities {
  hasTouch: boolean;
  hasHover: boolean;
  hasPointer: boolean;
  supportsWebGL: boolean;
  supportsWebP: boolean;
  connectionType: 'slow' | 'fast' | 'unknown';
  deviceMemory: number;
  hardwareConcurrency: number;
}

export const useResponsiveDesign = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
  });

  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities>({
    hasTouch: false,
    hasHover: false,
    hasPointer: false,
    supportsWebGL: false,
    supportsWebP: false,
    connectionType: 'unknown',
    deviceMemory: 4,
    hardwareConcurrency: 4,
  });

  // Update screen size
  const updateScreenSize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setScreenSize({
      width,
      height,
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024 && width < 1440,
      isLargeDesktop: width >= 1440,
    });
  }, []);

  // Detect device capabilities
  const detectDeviceCapabilities = useCallback(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasHover = window.matchMedia('(hover: hover)').matches;
    const hasPointer = window.matchMedia('(pointer: fine)').matches;

    // WebGL support
    const canvas = document.createElement('canvas');
    const supportsWebGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));

    // WebP support
    const supportsWebP = (() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    })();

    // Connection type
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    let connectionType: 'slow' | 'fast' | 'unknown' = 'unknown';
    
    if (connection) {
      const effectiveType = connection.effectiveType;
      connectionType = effectiveType === 'slow-2g' || effectiveType === '2g' ? 'slow' : 'fast';
    }

    // Device memory and hardware concurrency
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;

    setDeviceCapabilities({
      hasTouch,
      hasHover,
      hasPointer,
      supportsWebGL,
      supportsWebP,
      connectionType,
      deviceMemory,
      hardwareConcurrency,
    });
  }, []);

  useEffect(() => {
    updateScreenSize();
    detectDeviceCapabilities();

    window.addEventListener('resize', updateScreenSize);
    window.addEventListener('orientationchange', updateScreenSize);

    return () => {
      window.removeEventListener('resize', updateScreenSize);
      window.removeEventListener('orientationchange', updateScreenSize);
    };
  }, [updateScreenSize, detectDeviceCapabilities]);

  return { screenSize, deviceCapabilities };
};

// Hook for managing breakpoint-specific behavior
export const useBreakpoint = () => {
  const { screenSize } = useResponsiveDesign();

  const getBreakpointValue = useCallback(<T>(values: {
    mobile?: T;
    tablet?: T;
    desktop?: T;
    largeDesktop?: T;
    default: T;
  }): T => {
    if (screenSize.isMobile && values.mobile !== undefined) return values.mobile;
    if (screenSize.isTablet && values.tablet !== undefined) return values.tablet;
    if (screenSize.isDesktop && values.desktop !== undefined) return values.desktop;
    if (screenSize.isLargeDesktop && values.largeDesktop !== undefined) return values.largeDesktop;
    return values.default;
  }, [screenSize]);

  return { ...screenSize, getBreakpointValue };
};

// Hook for managing orientation changes
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    updateOrientation();
    window.addEventListener('orientationchange', updateOrientation);
    window.addEventListener('resize', updateOrientation);

    return () => {
      window.removeEventListener('orientationchange', updateOrientation);
      window.removeEventListener('resize', updateOrientation);
    };
  }, []);

  return orientation;
};

// Hook for managing safe area insets (for mobile devices with notches)
export const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
        right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
        left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0'),
      });
    };

    updateSafeArea();
    window.addEventListener('orientationchange', updateSafeArea);

    return () => {
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);

  return safeArea;
};

// Hook for managing viewport units that work consistently across browsers
export const useViewportUnits = () => {
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const updateViewportHeight = () => {
      // Use the actual viewport height, accounting for mobile browser UI
      setViewportHeight(window.visualViewport?.height || window.innerHeight);
    };

    updateViewportHeight();
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight);
      return () => window.visualViewport?.removeEventListener('resize', updateViewportHeight);
    } else {
      window.addEventListener('resize', updateViewportHeight);
      return () => window.removeEventListener('resize', updateViewportHeight);
    }
  }, []);

  return { viewportHeight };
};