import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, X, Wifi, WifiOff, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ErrorType = 'network' | 'validation' | 'server' | 'auth' | 'unknown';

interface ErrorState {
  type: ErrorType;
  message: string;
  code?: string;
  retryable: boolean;
  timestamp: Date;
  details?: string;
}

interface ErrorMessageProps {
  error: ErrorState;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

const getErrorIcon = (type: ErrorType) => {
  switch (type) {
    case 'network':
      return WifiOff;
    case 'validation':
      return AlertCircle;
    case 'server':
      return AlertTriangle;
    case 'auth':
      return AlertCircle;
    default:
      return AlertTriangle;
  }
};

const getErrorColor = (type: ErrorType) => {
  switch (type) {
    case 'network':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'validation':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'server':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'auth':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    default:
      return 'text-red-600 bg-red-50 border-red-200';
  }
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  onDismiss,
  className
}) => {
  const Icon = getErrorIcon(error.type);
  const colorClasses = getErrorColor(error.type);

  return (
    <div className={cn(
      'flex items-start gap-3 p-4 rounded-lg border',
      colorClasses,
      className
    )}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm mb-1">
          {error.message}
        </h4>
        
        {error.details && (
          <p className="text-xs opacity-80 mb-2">
            {error.details}
          </p>
        )}
        
        {error.code && (
          <p className="text-xs font-mono opacity-60">
            Error Code: {error.code}
          </p>
        )}
        
        {(error.retryable && onRetry) && (
          <button
            onClick={onRetry}
            className="mt-2 flex items-center gap-1 text-xs font-medium hover:underline"
          >
            <RefreshCw className="w-3 h-3" />
            Try Again
          </button>
        )}
      </div>
      
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 hover:bg-black/5 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Toast-style error notifications
interface ErrorToastProps extends ErrorMessageProps {
  isVisible: boolean;
  autoHide?: boolean;
  duration?: number;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({
  isVisible,
  autoHide = true,
  duration = 5000,
  onDismiss,
  ...props
}) => {
  const [isHiding, setIsHiding] = useState(false);

  React.useEffect(() => {
    if (isVisible && autoHide && onDismiss) {
      const timer = setTimeout(() => {
        setIsHiding(true);
        setTimeout(onDismiss, 300); // Allow fade out animation
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, duration, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 max-w-md transition-all duration-300',
      isHiding ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
    )}>
      <ErrorMessage
        {...props}
        onDismiss={onDismiss}
        className="shadow-lg"
      />
    </div>
  );
};

// Network status indicator
export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-2">
      <div className="flex items-center justify-center gap-2 text-sm">
        <WifiOff className="w-4 h-4" />
        <span>You're offline. Some features may not work properly.</span>
      </div>
    </div>
  );
};

// Error boundary fallback with retry
interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md">
        We encountered an unexpected error. This has been logged and we're working to fix it.
      </p>
      
      <div className="flex gap-3 mb-4">
        <button
          onClick={resetError}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Refresh Page
        </button>
      </div>
      
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-sm text-gray-500 hover:text-gray-700 underline"
      >
        {showDetails ? 'Hide' : 'Show'} Error Details
      </button>
      
      {showDetails && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left max-w-2xl w-full">
          <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </div>
      )}
    </div>
  );
};

// Hook for managing error states
export const useErrorHandler = () => {
  const [errors, setErrors] = useState<Record<string, ErrorState>>({});

  const addError = (key: string, error: Partial<ErrorState> & { message: string }) => {
    setErrors(prev => ({
      ...prev,
      [key]: {
        type: 'unknown',
        retryable: true,
        timestamp: new Date(),
        ...error
      }
    }));
  };

  const removeError = (key: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    addError,
    removeError,
    clearAllErrors,
    hasErrors
  };
};

// Common error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTH_ERROR: 'Authentication failed. Please log in again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};