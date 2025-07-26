import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoSidebar, type Conversation } from './DoubaoSidebar';
import { useKeyboardNavigation, useFocusManagement } from '@/hooks/useKeyboardNavigation';
import { useAccessibility, useAriaLiveRegion, getAriaProps } from '@/hooks/useAccessibility';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';
import { DoubaoErrorBoundary, ChatErrorBoundary, SidebarErrorBoundary } from './DoubaoErrorBoundary';
import { LoadingProvider, LoadingOverlay, useComponentLoading } from './DoubaoLoadingManager';
import { NetworkStatus } from './DoubaoErrorMessages';
import { PageSkeleton } from './DoubaoSkeletonLoader';

export interface DoubaoMainLayoutProps {
  children: React.ReactNode;
  currentPage?: 'chat' | 'prompts' | 'functions' | 'settings' | 'history';
  onPageChange?: (page: string) => void;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  conversations?: Conversation[];
  activeConversationId?: string;
  onNewChat?: () => void;
  onSelectConversation?: (conversationId: string) => void;
  onDeleteConversation?: (conversationId: string) => void;
}

export const DoubaoMainLayout: React.FC<DoubaoMainLayoutProps> = ({
  children,
  currentPage = 'chat',
  onPageChange,
  sidebarCollapsed = false,
  onSidebarToggle,
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(!sidebarCollapsed);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Loading state management
  const { isLoading, startLoading, stopLoading } = useComponentLoading('main-layout');

  // Accessibility and responsive design hooks
  const { screenSize } = useResponsiveDesign();
  const accessibility = useAccessibility();
  const { announce } = useAriaLiveRegion();
  const { containerRef, focusFirst, trapFocus } = useFocusManagement();

  // Enhanced responsive breakpoint detection
  const checkScreenSize = useCallback(() => {
    const width = window.innerWidth;
    setIsMobile(width < 768);
    setIsTablet(width >= 768 && width < 1024);
    
    // Auto-collapse sidebar on mobile
    if (width < 768) {
      setSidebarOpen(false);
    } else if (width >= 1024) {
      setSidebarOpen(!sidebarCollapsed);
    }
  }, [sidebarCollapsed]);

  // Handle sidebar toggle with mobile considerations
  const handleSidebarToggle = useCallback(() => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      onSidebarToggle?.();
    }
  }, [isMobile, sidebarOpen, onSidebarToggle]);

  // Handle touch gestures for mobile sidebar
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isMobile) {
      if (isRightSwipe && !sidebarOpen) {
        setSidebarOpen(true);
      } else if (isLeftSwipe && sidebarOpen) {
        setSidebarOpen(false);
      }
    }
  };

  // Keyboard navigation
  useKeyboardNavigation({
    onEscape: () => {
      if (sidebarOpen && isMobile) {
        setSidebarOpen(false);
        announce('Sidebar closed');
      }
    },
    enabled: true,
  });

  // Handle sidebar toggle with accessibility announcements
  const handleSidebarToggleWithA11y = useCallback(() => {
    const wasOpen = sidebarOpen;
    handleSidebarToggle();
    
    // Announce state change
    setTimeout(() => {
      announce(wasOpen ? 'Sidebar closed' : 'Sidebar opened');
    }, 100);
  }, [handleSidebarToggle, sidebarOpen, announce]);

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [checkScreenSize]);

  // Handle initial loading
  useEffect(() => {
    startLoading('Initializing application...');
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
      stopLoading();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [startLoading, stopLoading]);

  // Show loading skeleton during initial load
  if (isInitialLoading) {
    return <PageSkeleton />;
  }

  return (
    <LoadingProvider>
      <DoubaoErrorBoundary>
        <NetworkStatus />
        <div 
          ref={containerRef}
          className="flex h-screen bg-doubao-bg-primary overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onKeyDown={trapFocus}
          {...getAriaProps({
            role: 'application',
            label: 'Doubao Chat Application'
          })}
        >
      {/* Skip Links for Accessibility */}
      <div className="sr-only">
        <button
          onClick={() => focusFirst()}
          className="doubao-focus-ring p-2"
        >
          Skip to main content
        </button>
      </div>

      {/* Sidebar Container - Mobile Overlay Style */}
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <SidebarErrorBoundary>
            <DoubaoSidebar
              conversations={conversations}
              activeConversationId={activeConversationId}
              onNewChat={onNewChat}
              onSelectConversation={onSelectConversation}
              onDeleteConversation={onDeleteConversation}
              isCollapsed={!sidebarOpen}
              isMobile={isMobile}
              isTablet={isTablet}
              onClose={() => setSidebarOpen(false)}
              className={cn(
                'flex-shrink-0 relative',
                isMobile ? 'fixed inset-y-0 left-0 z-50' : 'z-10',
                isTablet && 'w-64' // Narrower on tablet
              )}
            />
          </SidebarErrorBoundary>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className={cn(
        'flex-1 flex flex-col min-w-0',
        isMobile && sidebarOpen && 'pointer-events-none'
      )}>
        {/* Header Container */}
        <header 
          className={cn(
            'bg-doubao-bg-primary border-b border-doubao-border-light flex-shrink-0 z-20',
            'h-14 sm:h-[60px]', // Shorter on mobile
            'px-4 sm:px-6' // Less padding on mobile
          )}
          {...getAriaProps({
            role: 'banner',
            label: 'Application header'
          })}
        >
          <div className="h-full flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile sidebar toggle */}
              <button
                onClick={handleSidebarToggleWithA11y}
                className={cn(
                  'p-2 rounded-lg hover:bg-doubao-hover',
                  'doubao-transition-colors touch-manipulation',
                  'min-h-[44px] min-w-[44px] flex items-center justify-center', // Touch-friendly size
                  isMobile ? 'block' : 'hidden lg:hidden' // Show on mobile and hide on desktop unless needed
                )}
                {...getAriaProps({
                  label: sidebarOpen ? 'Close sidebar' : 'Open sidebar',
                  expanded: sidebarOpen,
                  role: 'button'
                })}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              
              {/* Logo - responsive sizing */}
              <div className={cn(
                'text-doubao-text-primary font-semibold',
                'text-lg sm:text-xl' // Smaller on mobile
              )}>
                Doubao
              </div>
            </div>

            {/* Navigation Tabs - Desktop */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onPageChange?.('chat')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium doubao-transition-colors',
                  currentPage === 'chat'
                    ? 'bg-doubao-primary-blue text-white'
                    : 'text-doubao-text-primary hover:bg-doubao-hover'
                )}
              >
                💬 Chat
              </button>
              <button
                onClick={() => onPageChange?.('prompts')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium doubao-transition-colors',
                  currentPage === 'prompts'
                    ? 'bg-doubao-primary-blue text-white'
                    : 'text-doubao-text-primary hover:bg-doubao-hover'
                )}
              >
                📋 Prompts
              </button>
              <button
                onClick={() => onPageChange?.('functions')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium doubao-transition-colors',
                  currentPage === 'functions'
                    ? 'bg-doubao-primary-blue text-white'
                    : 'text-doubao-text-primary hover:bg-doubao-hover'
                )}
              >
                ⚡ Functions
              </button>
            </div>

            {/* Header right side - responsive */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={cn(
                'text-doubao-text-muted',
                'text-xs sm:text-sm', // Smaller on mobile
                'hidden sm:block' // Hide on very small screens
              )}>
                Header actions
              </div>
              
              {/* Mobile-specific header actions */}
              {isMobile && (
                <button
                  className={cn(
                    'p-2 rounded-lg hover:bg-doubao-hover',
                    'doubao-transition-colors touch-manipulation',
                    'min-h-[44px] min-w-[44px] flex items-center justify-center'
                  )}
                  aria-label="More options"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main 
          className="flex-1 overflow-hidden relative"
          {...getAriaProps({
            role: 'main',
            label: 'Chat interface'
          })}
          id="main-content"
          tabIndex={-1}
        >
          <ChatErrorBoundary>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                variants={accessibility.reducedMotion ? {} : doubaoAnimations.navigationSlide}
                initial={accessibility.reducedMotion ? false : "initial"}
                animate={accessibility.reducedMotion ? false : "animate"}
                exit={accessibility.reducedMotion ? false : "exit"}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </ChatErrorBoundary>
        </main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: accessibility.reducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
            {...getAriaProps({
              role: 'button',
              label: 'Close sidebar overlay'
            })}
          />
        )}
      </AnimatePresence>

      {/* Live region for announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="announcements"
      />
        </div>
        
        {/* Loading overlay for main layout */}
        <LoadingOverlay isVisible={isLoading} />
      </DoubaoErrorBoundary>
    </LoadingProvider>
  );
};

export default DoubaoMainLayout;