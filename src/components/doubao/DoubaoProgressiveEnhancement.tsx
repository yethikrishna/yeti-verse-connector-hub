import React, { useEffect, useState } from 'react';
import { initializeProgressiveEnhancement, type BrowserSupport } from '@/lib/progressive-enhancement';

interface DoubaoProgressiveEnhancementProps {
  children: React.ReactNode;
  fallbackComponent?: React.ComponentType;
}

export const DoubaoProgressiveEnhancement: React.FC<DoubaoProgressiveEnhancementProps> = ({
  children,
  fallbackComponent: FallbackComponent,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [browserSupport, setBrowserSupport] = useState<BrowserSupport | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const support = await initializeProgressiveEnhancement();
        setBrowserSupport(support);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize progressive enhancement:', error);
        setHasError(true);
        setIsInitialized(true); // Still allow app to load
      }
    };

    initializeApp();
  }, []);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-doubao-bg-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-doubao-primary-blue mx-auto mb-4"></div>
          <div className="text-doubao-text-muted doubao-text-sm">
            Initializing application...
          </div>
        </div>
      </div>
    );
  }

  // Show fallback component for very old browsers if provided
  if (hasError && FallbackComponent) {
    return <FallbackComponent />;
  }

  // Show compatibility warning for browsers with limited support
  const showCompatibilityWarning = browserSupport && (
    !browserSupport.supportsJS.fetch ||
    !browserSupport.supportsJS.promises ||
    !browserSupport.supportsCSS.flexbox
  );

  return (
    <>
      {showCompatibilityWarning && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your browser has limited support for some features. The application will work but some animations and advanced features may be disabled.
              </p>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

// Fallback component for very old browsers
export const DoubaoFallbackComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Doubao Chat Assistant
        </h1>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Browser Not Supported
          </h2>
          <p className="text-red-700 mb-4">
            Your browser doesn't support the modern features required for this application.
            Please upgrade to a newer version or use a different browser.
          </p>
          
          <div className="space-y-2">
            <h3 className="font-medium text-red-800">Recommended browsers:</h3>
            <ul className="list-disc list-inside text-red-700 space-y-1">
              <li>Chrome 90 or later</li>
              <li>Firefox 88 or later</li>
              <li>Safari 14 or later</li>
              <li>Edge 90 or later</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Basic Chat Interface
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">You:</div>
              <div className="bg-blue-100 rounded-lg p-3 mb-4">
                Hello, I need help with something.
              </div>
              
              <div className="text-sm text-gray-600 mb-2">Assistant:</div>
              <div className="bg-gray-100 rounded-lg p-3">
                I'd be happy to help! However, for the full interactive experience with advanced features, 
                please upgrade your browser to access the complete Doubao chat interface.
              </div>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                disabled
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg opacity-50 cursor-not-allowed"
                disabled
              >
                Send
              </button>
            </div>
            
            <p className="text-sm text-gray-500 text-center">
              Upgrade your browser to enable this functionality
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubaoProgressiveEnhancement;