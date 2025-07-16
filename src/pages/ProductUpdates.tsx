import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { useNotifications } from '@/hooks/useNotifications';

interface ProductUpdatesProps {
  onClose?: () => void;
}

const typeColors = {
  feature: 'bg-blue-100 text-blue-800',
  improvement: 'bg-green-100 text-green-800',
  announcement: 'bg-purple-100 text-purple-800',
  event: 'bg-orange-100 text-orange-800',
};

const typeIcons = {
  feature: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  improvement: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  announcement: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  ),
  event: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

export const ProductUpdates: React.FC<ProductUpdatesProps> = ({ onClose }) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const navigate = useNavigate();
  const { updates, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  const filteredUpdates = updates.filter(update => 
    filter === 'all' || !update.isRead
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-doubao-bg-primary">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-doubao-bg-primary border-b border-doubao-border-light">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                variants={doubaoAnimations.buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-doubao-hover doubao-transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5m7-7l-7 7 7 7" />
                </svg>
              </motion.button>
              
              <div>
                <h1 className="doubao-text-2xl font-semibold text-doubao-text-primary">
                  Product Updates
                </h1>
                <p className="doubao-text-sm text-doubao-text-muted mt-1">
                  Explore new features and discover the latest activities
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <motion.button
                  variants={doubaoAnimations.buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={markAllAsRead}
                  className="px-3 py-1.5 text-sm bg-doubao-primary-blue text-white rounded-lg hover:bg-blue-600 doubao-transition-colors"
                >
                  Mark all as read
                </motion.button>
              )}
              
              <div className="flex bg-doubao-bg-secondary rounded-lg p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-md doubao-transition-colors',
                    filter === 'all' 
                      ? 'bg-white text-doubao-text-primary shadow-sm' 
                      : 'text-doubao-text-muted hover:text-doubao-text-primary'
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-md doubao-transition-colors flex items-center gap-2',
                    filter === 'unread' 
                      ? 'bg-white text-doubao-text-primary shadow-sm' 
                      : 'text-doubao-text-muted hover:text-doubao-text-primary'
                  )}
                >
                  Unread
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {filteredUpdates.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-doubao-bg-secondary rounded-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-doubao-text-muted">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                </div>
                <h3 className="doubao-text-lg font-medium text-doubao-text-primary mb-2">
                  No {filter === 'unread' ? 'unread ' : ''}updates
                </h3>
                <p className="text-doubao-text-muted">
                  {filter === 'unread' 
                    ? "You're all caught up! Check back later for new updates."
                    : "No updates available at the moment."
                  }
                </p>
              </div>
            ) : (
              filteredUpdates.map((update, index) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => !update.isRead && markAsRead(update.id)}
                  className={cn(
                    'bg-white rounded-xl border border-doubao-border-light p-6 hover:shadow-md doubao-transition-all cursor-pointer',
                    !update.isRead && 'ring-2 ring-blue-100'
                  )}
                >
                  <div className="flex gap-4">
                    {update.image && (
                      <div className="flex-shrink-0">
                        <img
                          src={update.image}
                          alt={update.title}
                          className="w-16 h-16 rounded-lg object-cover bg-doubao-bg-secondary"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="doubao-text-lg font-semibold text-doubao-text-primary">
                            {update.title}
                          </h3>
                          {!update.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                            typeColors[update.type]
                          )}>
                            {typeIcons[update.type]}
                            {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                          </span>
                          {update.isNew && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-doubao-text-secondary doubao-text-sm leading-relaxed mb-3">
                        {update.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-doubao-text-muted doubao-text-xs">
                          {formatDate(update.date)}
                        </span>
                        
                        {!update.isRead && (
                          <motion.button
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(update.id);
                            }}
                            className="text-doubao-primary-blue hover:text-blue-600 doubao-text-xs font-medium"
                          >
                            Mark as read
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductUpdates;