// Progressive Enhancement Utilities for Cross-Browser Compatibility

export interface BrowserSupport {
  supportsCSS: {
    grid: boolean;
    flexbox: boolean;
    customProperties: boolean;
    backdropFilter: boolean;
    clipPath: boolean;
    objectFit: boolean;
  };
  supportsJS: {
    intersectionObserver: boolean;
    resizeObserver: boolean;
    webAnimations: boolean;
    fetch: boolean;
    promises: boolean;
    asyncAwait: boolean;
    modules: boolean;
  };
  supportsHTML: {
    webComponents: boolean;
    dialog: boolean;
    details: boolean;
  };
}

// Detect browser support for various features
export const detectBrowserSupport = (): BrowserSupport => {
  const testElement = document.createElement('div');
  
  return {
    supportsCSS: {
      grid: CSS.supports('display', 'grid'),
      flexbox: CSS.supports('display', 'flex'),
      customProperties: CSS.supports('--test', '0'),
      backdropFilter: CSS.supports('backdrop-filter', 'blur(1px)'),
      clipPath: CSS.supports('clip-path', 'circle(50%)'),
      objectFit: CSS.supports('object-fit', 'cover'),
    },
    supportsJS: {
      intersectionObserver: 'IntersectionObserver' in window,
      resizeObserver: 'ResizeObserver' in window,
      webAnimations: 'animate' in testElement,
      fetch: 'fetch' in window,
      promises: 'Promise' in window,
      asyncAwait: (() => {
        try {
          return (async () => {})().constructor === (async () => {}).constructor;
        } catch {
          return false;
        }
      })(),
      modules: 'noModule' in document.createElement('script'),
    },
    supportsHTML: {
      webComponents: 'customElements' in window,
      dialog: 'HTMLDialogElement' in window,
      details: 'HTMLDetailsElement' in window,
    },
  };
};

// Polyfill loader for missing features
export const loadPolyfills = async (support: BrowserSupport) => {
  const polyfills: Promise<any>[] = [];

  // IntersectionObserver polyfill
  if (!support.supportsJS.intersectionObserver) {
    polyfills.push(
      Promise.resolve().then(() => {
        // Create a simple polyfill fallback
        if (!('IntersectionObserver' in window)) {
          (window as any).IntersectionObserver = class {
            constructor(callback: any) {
              this.callback = callback;
            }
            observe() {}
            unobserve() {}
            disconnect() {}
            callback: any;
          };
        }
      }).catch(() => {
        console.warn('Failed to load IntersectionObserver polyfill');
      })
    );
  }

  // ResizeObserver polyfill
  if (!support.supportsJS.resizeObserver) {
    polyfills.push(
      Promise.resolve().then(() => {
        // Create a simple ResizeObserver polyfill
        if (!('ResizeObserver' in window)) {
          (window as any).ResizeObserver = class {
            constructor(callback: any) {
              this.callback = callback;
            }
            observe() {}
            unobserve() {}
            disconnect() {}
            callback: any;
          };
        }
      }).catch(() => {
        console.warn('Failed to load ResizeObserver polyfill');
      })
    );
  }

  // Fetch polyfill
  if (!support.supportsJS.fetch) {
    polyfills.push(
      Promise.resolve().then(() => {
        // Simple fetch polyfill using XMLHttpRequest
        if (!('fetch' in window)) {
          (window as any).fetch = (url: string, options: any = {}) => {
            return new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open(options.method || 'GET', url);
              xhr.onload = () => resolve({
                ok: xhr.status >= 200 && xhr.status < 300,
                status: xhr.status,
                text: () => Promise.resolve(xhr.responseText),
                json: () => Promise.resolve(JSON.parse(xhr.responseText))
              });
              xhr.onerror = () => reject(new Error('Network error'));
              xhr.send(options.body);
            });
          };
        }
      }).catch(() => {
        console.warn('Failed to load fetch polyfill');
      })
    );
  }

  // Promise polyfill
  if (!support.supportsJS.promises) {
    polyfills.push(
      Promise.resolve().then(() => {
        // Simple Promise polyfill is not practical to implement here
        // In real scenarios, you would load a proper polyfill
        console.warn('Promise polyfill needed but not implemented');
      }).catch(() => {
        console.warn('Failed to load Promise polyfill');
      })
    );
  }

  await Promise.allSettled(polyfills);
};

// CSS fallbacks for unsupported features
export const getCSSFallbacks = (support: BrowserSupport) => {
  const fallbacks: string[] = [];

  // Grid fallback to flexbox
  if (!support.supportsCSS.grid) {
    fallbacks.push(`
      .doubao-grid-fallback {
        display: flex;
        flex-wrap: wrap;
      }
      .doubao-grid-item-fallback {
        flex: 1 1 auto;
      }
    `);
  }

  // Custom properties fallback
  if (!support.supportsCSS.customProperties) {
    fallbacks.push(`
      .doubao-fallback-colors {
        --doubao-primary-blue: #4A90E2;
        --doubao-bg-primary: #FFFFFF;
        --doubao-text-primary: #2C3E50;
      }
    `);
  }

  // Backdrop filter fallback
  if (!support.supportsCSS.backdropFilter) {
    fallbacks.push(`
      .doubao-glass-fallback {
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    `);
  }

  return fallbacks.join('\n');
};

// Feature detection utilities
export const supportsFeature = {
  // Check if CSS feature is supported
  css: (property: string, value: string): boolean => {
    if (typeof CSS !== 'undefined' && CSS.supports) {
      return CSS.supports(property, value);
    }
    
    // Fallback for older browsers
    const testElement = document.createElement('div');
    const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    
    try {
      (testElement.style as any)[camelProperty] = value;
      return (testElement.style as any)[camelProperty] === value;
    } catch {
      return false;
    }
  },

  // Check if JavaScript API is available
  js: (feature: string): boolean => {
    try {
      return feature.split('.').reduce((obj, prop) => obj && obj[prop], window as any) !== undefined;
    } catch {
      return false;
    }
  },

  // Check if HTML element is supported
  html: (tagName: string): boolean => {
    return document.createElement(tagName).constructor !== HTMLUnknownElement;
  },
};

// Enhanced event listener with passive support detection
export const addEnhancedEventListener = (
  element: Element,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
) => {
  let supportsPassive = false;
  
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get() {
        supportsPassive = true;
        return false;
      },
    });
    window.addEventListener('testPassive', () => {}, opts);
    window.removeEventListener('testPassive', () => {}, opts);
  } catch {}

  const finalOptions = supportsPassive && options ? options : false;
  element.addEventListener(event, handler, finalOptions);
  
  return () => element.removeEventListener(event, handler, finalOptions);
};

// Graceful animation fallbacks
export const createAnimationFallback = (
  element: HTMLElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions
) => {
  // Try Web Animations API first
  if ('animate' in element) {
    return element.animate(keyframes, options);
  }

  // Fallback to CSS transitions/animations
  const animationName = `doubao-fallback-${Math.random().toString(36).substr(2, 9)}`;
  
  // Create CSS keyframes
  const keyframeCSS = keyframes.map((frame, index) => {
    const percentage = index === 0 ? 0 : index === keyframes.length - 1 ? 100 : (index / (keyframes.length - 1)) * 100;
    const properties = Object.entries(frame)
      .filter(([key]) => key !== 'offset')
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join('; ');
    return `${percentage}% { ${properties} }`;
  }).join('\n');

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ${animationName} {
      ${keyframeCSS}
    }
  `;
  document.head.appendChild(style);

  // Apply animation
  element.style.animation = `${animationName} ${options.duration || 1000}ms ${options.easing || 'ease'} ${options.delay || 0}ms ${options.iterations || 1} ${options.direction || 'normal'} ${options.fill || 'none'}`;

  // Cleanup
  const cleanup = () => {
    element.style.animation = '';
    document.head.removeChild(style);
  };

  setTimeout(cleanup, (options.duration || 1000) + (options.delay || 0));

  return {
    cancel: cleanup,
    finished: Promise.resolve(),
  };
};

// Initialize progressive enhancement
export const initializeProgressiveEnhancement = async () => {
  const support = detectBrowserSupport();
  
  // Load necessary polyfills
  await loadPolyfills(support);
  
  // Apply CSS fallbacks
  const fallbackCSS = getCSSFallbacks(support);
  if (fallbackCSS) {
    const style = document.createElement('style');
    style.textContent = fallbackCSS;
    document.head.appendChild(style);
  }
  
  // Add support classes to document
  document.documentElement.classList.add(
    support.supportsCSS.grid ? 'supports-grid' : 'no-grid',
    support.supportsCSS.flexbox ? 'supports-flexbox' : 'no-flexbox',
    support.supportsCSS.customProperties ? 'supports-custom-props' : 'no-custom-props',
    support.supportsJS.intersectionObserver ? 'supports-intersection-observer' : 'no-intersection-observer',
    support.supportsJS.webAnimations ? 'supports-web-animations' : 'no-web-animations'
  );
  
  return support;
};