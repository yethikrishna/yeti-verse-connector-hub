import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  showOnFocus?: boolean;
  maxWidth?: number;
}

interface TooltipPosition {
  top: number;
  left: number;
  position: TooltipPosition;
}

const calculatePosition = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  preferredPosition: TooltipPosition
): TooltipPosition => {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  
  const spacing = 8; // Gap between trigger and tooltip
  
  const positions = {
    top: {
      top: triggerRect.top - tooltipRect.height - spacing,
      left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
    },
    bottom: {
      top: triggerRect.bottom + spacing,
      left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
    },
    left: {
      top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
      left: triggerRect.left - tooltipRect.width - spacing,
    },
    right: {
      top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
      left: triggerRect.right + spacing,
    },
  };
  
  // Check if preferred position fits
  const preferred = positions[preferredPosition];
  const fitsVertically = preferred.top >= 0 && preferred.top + tooltipRect.height <= viewport.height;
  const fitsHorizontally = preferred.left >= 0 && preferred.left + tooltipRect.width <= viewport.width;
  
  if (fitsVertically && fitsHorizontally) {
    return { ...preferred, position: preferredPosition };
  }
  
  // Try alternative positions
  const alternatives: TooltipPosition[] = ['top', 'bottom', 'left', 'right'];
  for (const pos of alternatives) {
    if (pos === preferredPosition) continue;
    
    const alt = positions[pos];
    const altFitsV = alt.top >= 0 && alt.top + tooltipRect.height <= viewport.height;
    const altFitsH = alt.left >= 0 && alt.left + tooltipRect.width <= viewport.width;
    
    if (altFitsV && altFitsH) {
      return { ...alt, position: pos };
    }
  }
  
  // Fallback: clamp to viewport
  return {
    top: Math.max(0, Math.min(preferred.top, viewport.height - tooltipRect.height)),
    left: Math.max(0, Math.min(preferred.left, viewport.width - tooltipRect.width)),
    position: preferredPosition,
  };
};

export const DoubaoTooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  delay = 500,
  disabled = false,
  className,
  children,
  showOnFocus = true,
  maxWidth = 300,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      const pos = calculatePosition(triggerRect, tooltipRect, position);
      setTooltipPosition(pos);
    }
  }, [isVisible, position, content]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getArrowClasses = (pos: TooltipPosition) => {
    const base = 'absolute w-2 h-2 bg-gray-900 transform rotate-45';
    
    switch (pos) {
      case 'top':
        return `${base} -bottom-1 left-1/2 -translate-x-1/2`;
      case 'bottom':
        return `${base} -top-1 left-1/2 -translate-x-1/2`;
      case 'left':
        return `${base} -right-1 top-1/2 -translate-y-1/2`;
      case 'right':
        return `${base} -left-1 top-1/2 -translate-y-1/2`;
      default:
        return base;
    }
  };

  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={cn(
            'fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg',
            'pointer-events-none select-none',
            className
          )}
          style={{
            top: tooltipPosition?.top ?? 0,
            left: tooltipPosition?.left ?? 0,
            maxWidth,
          }}
          role="tooltip"
          aria-hidden={!isVisible}
        >
          {content}
          {tooltipPosition && (
            <div className={getArrowClasses(tooltipPosition.position)} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showOnFocus ? showTooltip : undefined}
        onBlur={showOnFocus ? hideTooltip : undefined}
        className="inline-block"
      >
        {children}
      </div>
      {createPortal(tooltipContent, document.body)}
    </>
  );
};

// Keyboard shortcut tooltip
interface KeyboardShortcutTooltipProps {
  shortcut: string | string[];
  description: string;
  children: React.ReactNode;
}

export const KeyboardShortcutTooltip: React.FC<KeyboardShortcutTooltipProps> = ({
  shortcut,
  description,
  children,
}) => {
  const shortcuts = Array.isArray(shortcut) ? shortcut : [shortcut];
  
  const content = (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-gray-300">{description}</div>
      <div className="flex gap-1">
        {shortcuts.map((key, index) => (
          <React.Fragment key={key}>
            {index > 0 && <span className="text-gray-400">+</span>}
            <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
              {key}
            </kbd>
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <DoubaoTooltip content={content} position="bottom" delay={700}>
      {children}
    </DoubaoTooltip>
  );
};

// Help text tooltip
interface HelpTooltipProps {
  title?: string;
  description: string;
  children: React.ReactNode;
  maxWidth?: number;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  title,
  description,
  children,
  maxWidth = 250,
}) => {
  const content = (
    <div className="space-y-1">
      {title && <div className="font-medium text-white">{title}</div>}
      <div className="text-xs text-gray-300 leading-relaxed">{description}</div>
    </div>
  );

  return (
    <DoubaoTooltip content={content} position="top" delay={300} maxWidth={maxWidth}>
      {children}
    </DoubaoTooltip>
  );
};

// Status tooltip with colored indicator
interface StatusTooltipProps {
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
  children: React.ReactNode;
}

export const StatusTooltip: React.FC<StatusTooltipProps> = ({
  status,
  message,
  children,
}) => {
  const statusColors = {
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  };

  const content = (
    <div className="flex items-center gap-2">
      <div className={cn('w-2 h-2 rounded-full', statusColors[status])} />
      <span className="text-sm">{message}</span>
    </div>
  );

  return (
    <DoubaoTooltip content={content} position="top" delay={200}>
      {children}
    </DoubaoTooltip>
  );
};