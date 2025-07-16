import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoSidebar, type Conversation } from './DoubaoSidebar';

export interface DoubaoMainLayoutProps {
  children: React.ReactNode;
  currentPage?: 'chat' | 'settings' | 'history';
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

  // Check if mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-screen bg-doubao-bg-primary overflow-hidden">
      {/* Sidebar Container */}
      <DoubaoSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={onNewChat}
        onSelectConversation={onSelectConversation}
        onDeleteConversation={onDeleteConversation}
        isCollapsed={sidebarCollapsed}
        className={cn(
          'flex-shrink-0 relative z-10',
          isMobile && sidebarCollapsed && 'hidden'
        )}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Container */}
        <header className="h-[60px] bg-doubao-bg-primary border-b border-doubao-border-light flex-shrink-0 z-20">
          {/* Header content will be rendered here by DoubaoHeader component */}
          <div className="h-full flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              {/* Mobile sidebar toggle */}
              {isMobile && (
                <button
                  onClick={onSidebarToggle}
                  className={cn(
                    'p-2 rounded-lg hover:bg-doubao-hover',
                    'doubao-transition-colors'
                  )}
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
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              )}
              
              {/* Logo placeholder */}
              <div className="text-doubao-text-primary doubao-text-xl font-semibold">
                Doubao
              </div>
            </div>

            {/* Header right side placeholder */}
            <div className="flex items-center gap-3">
              <div className="text-doubao-text-muted doubao-text-sm">
                Header actions
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative">
          <motion.div
            key={currentPage}
            variants={doubaoAnimations.pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && !sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-5"
            onClick={onSidebarToggle}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoubaoMainLayout;