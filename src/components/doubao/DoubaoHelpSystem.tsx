import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, HelpCircle, Search, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DoubaoTooltip, KeyboardShortcutTooltip } from './DoubaoTooltip';
import { formatShortcut, DOUBAO_SHORTCUTS } from '@/hooks/useKeyboardShortcuts';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoubaoHelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'shortcuts' | 'features' | 'tips'>('shortcuts');

  const shortcuts = DOUBAO_SHORTCUTS.filter(shortcut => shortcut.description);

  const features = [
    {
      icon: '💬',
      title: 'Smart Chat',
      description: 'Engage in natural conversations with AI assistance for various tasks.',
    },
    {
      icon: '📝',
      title: 'Writing Assistant',
      description: 'Get help with writing, editing, and improving your content.',
    },
    {
      icon: '🔍',
      title: 'AI Search',
      description: 'Search and get real-time information from multiple sources.',
    },
    {
      icon: '🎨',
      title: 'Image Generation',
      description: 'Create images from text descriptions with various styles.',
    },
    {
      icon: '📄',
      title: 'Document Chat',
      description: 'Upload and chat with your documents for quick insights.',
    },
    {
      icon: '🎵',
      title: 'Music & Video',
      description: 'Generate music and video content with AI assistance.',
    },
  ];

  const tips = [
    {
      title: 'Use specific prompts',
      description: 'Be clear and specific in your requests for better AI responses.',
    },
    {
      title: 'Organize conversations',
      description: 'Use the sidebar to manage and organize your chat history.',
    },
    {
      title: 'Keyboard shortcuts',
      description: 'Learn keyboard shortcuts to navigate faster and be more productive.',
    },
    {
      title: 'Upload documents',
      description: 'Upload PDFs, Word docs, and other files to chat about their content.',
    },
    {
      title: 'Save important chats',
      description: 'Star or bookmark important conversations for easy access later.',
    },
    {
      title: 'Customize settings',
      description: 'Adjust AI model settings and preferences in the settings panel.',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Help & Support</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              {[
                { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
                { id: 'features', label: 'Features', icon: Zap },
                { id: 'tips', label: 'Tips & Tricks', icon: HelpCircle },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={cn(
                    'flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors',
                    activeTab === id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              {activeTab === 'shortcuts' && (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-6">
                    Use these keyboard shortcuts to navigate Doubao more efficiently:
                  </p>
                  <div className="grid gap-3">
                    {shortcuts.map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-900">{shortcut.description}</span>
                        <kbd className="px-3 py-1 text-sm bg-white border border-gray-300 rounded shadow-sm">
                          {formatShortcut(shortcut)}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-6">
                    Explore the powerful features available in Doubao:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{feature.icon}</span>
                          <div>
                            <h3 className="font-medium text-gray-900 mb-1">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tips' && (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-6">
                    Pro tips to get the most out of your Doubao experience:
                  </p>
                  <div className="space-y-4">
                    {tips.map((tip, index) => (
                      <div
                        key={index}
                        className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <h3 className="font-medium text-blue-900 mb-2">
                          💡 {tip.title}
                        </h3>
                        <p className="text-blue-800 text-sm">
                          {tip.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Need more help? Contact support or check our documentation.
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    Documentation
                  </button>
                  <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Help button component
interface HelpButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DoubaoHelpButton: React.FC<HelpButtonProps> = ({ 
  className, 
  size = 'md' 
}) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <>
      <DoubaoTooltip content="Help & Keyboard Shortcuts" position="bottom">
        <button
          onClick={() => setIsHelpOpen(true)}
          className={cn(
            'rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900',
            sizeClasses[size],
            className
          )}
          aria-label="Open help"
        >
          <HelpCircle className={iconSizes[size]} />
        </button>
      </DoubaoTooltip>
      
      <DoubaoHelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />
    </>
  );
};

// Quick help tooltip for specific features
interface QuickHelpProps {
  title: string;
  description: string;
  shortcut?: string;
  children: React.ReactNode;
}

export const QuickHelp: React.FC<QuickHelpProps> = ({
  title,
  description,
  shortcut,
  children,
}) => {
  const content = (
    <div className="space-y-2 max-w-xs">
      <div className="font-medium text-white">{title}</div>
      <div className="text-xs text-gray-300 leading-relaxed">{description}</div>
      {shortcut && (
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs text-gray-400">Shortcut:</span>
          <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
            {shortcut}
          </kbd>
        </div>
      )}
    </div>
  );

  return (
    <DoubaoTooltip content={content} position="top" delay={500}>
      {children}
    </DoubaoTooltip>
  );
};