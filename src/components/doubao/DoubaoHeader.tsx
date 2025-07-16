import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';

export interface DoubaoHeaderProps {
  onSidebarToggle?: () => void;
  showSidebarToggle?: boolean;
  userAvatar?: string;
  userName?: string;
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
  hasNotifications?: boolean;
}

export const DoubaoHeader: React.FC<DoubaoHeaderProps> = ({
  onSidebarToggle,
  showSidebarToggle = false,
  userAvatar,
  userName = 'User',
  onSettingsClick,
  onNotificationsClick,
  hasNotifications = false,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserMenu]);

  return (
    <header className="h-[60px] bg-doubao-bg-primary border-b border-doubao-border-light flex-shrink-0 z-20">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left side - Logo and mobile toggle */}
        <div className="flex items-center gap-4">
          {/* Mobile sidebar toggle */}
          {showSidebarToggle && (
            <motion.button
              variants={doubaoAnimations.buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={onSidebarToggle}
              className={cn(
                'p-2 rounded-lg hover:bg-doubao-hover',
                'doubao-transition-colors',
                'md:hidden' // Only show on mobile
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
                className="text-doubao-text-secondary"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </motion.button>
          )}
          
          {/* Doubao Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-doubao-primary-blue to-doubao-purple flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-doubao-text-primary doubao-text-xl font-semibold">
              Doubao
            </h1>
          </div>
        </div>

        {/* Right side - Notifications, Settings, User Avatar */}
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <motion.button
            variants={doubaoAnimations.buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={onNotificationsClick}
            className={cn(
              'relative p-2 rounded-lg hover:bg-doubao-hover',
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
              className="text-doubao-text-secondary"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            {hasNotifications && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-doubao-bg-primary" />
            )}
          </motion.button>

          {/* Settings */}
          <motion.button
            variants={doubaoAnimations.buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={onSettingsClick}
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
              className="text-doubao-text-secondary"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m17-4a4 4 0 0 1-8 0 4 4 0 0 1 8 0zM7 21a4 4 0 0 1 0-8 4 4 0 0 1 0 8z" />
            </svg>
          </motion.button>

          {/* User Avatar and Menu */}
          <div className="relative" ref={menuRef}>
            <motion.button
              variants={doubaoAnimations.buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={cn(
                'flex items-center gap-2 p-1 rounded-lg hover:bg-doubao-hover',
                'doubao-transition-colors'
              )}
              aria-expanded={showUserMenu}
              aria-haspopup="true"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-doubao-primary-blue flex items-center justify-center overflow-hidden">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white doubao-text-sm font-medium">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Dropdown arrow */}
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-doubao-text-muted"
                animate={{ rotate: showUserMenu ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <polyline points="6,9 12,15 18,9" />
              </motion.svg>
            </motion.button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  variants={doubaoAnimations.modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={cn(
                    'absolute right-0 top-full mt-2 w-48',
                    'bg-doubao-bg-primary border border-doubao-border-light rounded-lg',
                    'doubao-shadow-medium z-50'
                  )}
                >
                  <div className="p-3 border-b border-doubao-border-light">
                    <div className="doubao-text-sm font-medium text-doubao-text-primary">
                      {userName}
                    </div>
                    <div className="doubao-text-xs text-doubao-text-muted">
                      user@example.com
                    </div>
                  </div>
                  
                  <div className="p-1">
                    <motion.button 
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-doubao-hover doubao-transition-colors"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.1 }}
                    >
                      <span className="doubao-text-sm text-doubao-text-primary">Profile</span>
                    </motion.button>
                    <motion.button 
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-doubao-hover doubao-transition-colors"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.1 }}
                      onClick={onSettingsClick}
                    >
                      <span className="doubao-text-sm text-doubao-text-primary">Settings</span>
                    </motion.button>
                    <motion.button 
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-doubao-hover doubao-transition-colors"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.1 }}
                    >
                      <span className="doubao-text-sm text-doubao-text-primary">Help</span>
                    </motion.button>
                    <div className="border-t border-doubao-border-light my-1" />
                    <motion.button 
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-doubao-hover doubao-transition-colors"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.1 }}
                    >
                      <span className="doubao-text-sm text-red-600">Sign out</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DoubaoHeader;