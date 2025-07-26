import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

interface LoadingContextType {
  loadingStates: Record<string, LoadingState>;
  setLoading: (key: string, state: LoadingState | boolean) => void;
  clearLoading: (key: string) => void;
  isAnyLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    // Return a default context for testing or when provider is not available
    return {
      loadingStates: {},
      setLoading: () => {},
      clearLoading: () => {},
      isAnyLoading: false,
    };
  }
  return context;
};

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState>>({});

  const setLoading = (key: string, state: LoadingState | boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: typeof state === 'boolean' ? { isLoading: state } : state
    }));
  };

  const clearLoading = (key: string) => {
    setLoadingStates(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  const isAnyLoading = Object.values(loadingStates).some(state => state.isLoading);

  return (
    <LoadingContext.Provider value={{ loadingStates, setLoading, clearLoading, isAnyLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Loading overlay component
interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Loading...',
  progress,
  className
}) => {
  if (!isVisible) return null;

  return (
    <div className={cn(
      'absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50',
      className
    )}>
      <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg border">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">{message}</p>
          {progress !== undefined && (
            <div className="mt-2 w-48">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Inline loading spinner
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  message
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-blue-600', sizeClasses[size])} />
      {message && (
        <span className={cn(
          'text-gray-600',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base'
        )}>
          {message}
        </span>
      )}
    </div>
  );
};

// Button with loading state
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        'relative flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all',
        'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      <span className={cn(isLoading && 'opacity-70')}>
        {isLoading && loadingText ? loadingText : children}
      </span>
    </button>
  );
};

// Hook for managing component loading state
export const useComponentLoading = (key: string) => {
  const { loadingStates, setLoading, clearLoading } = useLoading();
  
  const startLoading = (message?: string, progress?: number) => {
    setLoading(key, { isLoading: true, message, progress });
  };
  
  const updateProgress = (progress: number, message?: string) => {
    setLoading(key, { isLoading: true, progress, message });
  };
  
  const stopLoading = () => {
    clearLoading(key);
  };
  
  const isLoading = loadingStates[key]?.isLoading || false;
  const loadingState = loadingStates[key];
  
  return {
    isLoading,
    loadingState,
    startLoading,
    updateProgress,
    stopLoading
  };
};