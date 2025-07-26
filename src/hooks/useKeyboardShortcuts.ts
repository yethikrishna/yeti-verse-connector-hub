import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  preventDefault?: boolean;
  enabled?: boolean;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
  target?: HTMLElement | Document;
}

export const useKeyboardShortcuts = ({
  shortcuts,
  enabled = true,
  target = document,
}: UseKeyboardShortcutsOptions) => {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const activeShortcuts = shortcutsRef.current.filter(
      shortcut => shortcut.enabled !== false
    );

    for (const shortcut of activeShortcuts) {
      const matches = 
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        !!event.ctrlKey === !!shortcut.ctrlKey &&
        !!event.altKey === !!shortcut.altKey &&
        !!event.shiftKey === !!shortcut.shiftKey &&
        !!event.metaKey === !!shortcut.metaKey;

      if (matches) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        shortcut.action();
        break;
      }
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    target.addEventListener('keydown', handleKeyDown as EventListener);
    return () => {
      target.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [handleKeyDown, enabled, target]);
};

// Global keyboard shortcuts for the Doubao app
export const DOUBAO_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'n',
    ctrlKey: true,
    action: () => {
      // Will be implemented by the component using this hook
    },
    description: 'New chat',
  },
  {
    key: 's',
    ctrlKey: true,
    action: () => {
      // Save current conversation
    },
    description: 'Save conversation',
  },
  {
    key: 'k',
    ctrlKey: true,
    action: () => {
      // Open command palette
    },
    description: 'Open command palette',
  },
  {
    key: 'Enter',
    ctrlKey: true,
    action: () => {
      // Send message
    },
    description: 'Send message',
  },
  {
    key: 'Escape',
    action: () => {
      // Close modals/overlays
    },
    description: 'Close modal or overlay',
  },
  {
    key: '/',
    ctrlKey: true,
    action: () => {
      // Toggle sidebar
    },
    description: 'Toggle sidebar',
  },
  {
    key: 'f',
    ctrlKey: true,
    action: () => {
      // Search conversations
    },
    description: 'Search conversations',
  },
  {
    key: 'ArrowUp',
    action: () => {
      // Navigate up in chat history
    },
    description: 'Previous message',
  },
  {
    key: 'ArrowDown',
    action: () => {
      // Navigate down in chat history
    },
    description: 'Next message',
  },
  {
    key: 'r',
    ctrlKey: true,
    action: () => {
      // Regenerate response
    },
    description: 'Regenerate response',
  },
];

// Hook for managing global shortcuts
export const useGlobalShortcuts = (actions: Partial<Record<string, () => void>>) => {
  const shortcuts: KeyboardShortcut[] = DOUBAO_SHORTCUTS.map(shortcut => ({
    ...shortcut,
    action: actions[shortcut.description.toLowerCase().replace(/\s+/g, '_')] || shortcut.action,
  }));

  useKeyboardShortcuts({ shortcuts });

  return shortcuts;
};

// Utility to format shortcut display
export const formatShortcut = (shortcut: KeyboardShortcut): string => {
  const parts: string[] = [];
  
  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.shiftKey) parts.push('Shift');
  if (shortcut.metaKey) parts.push('Cmd');
  
  parts.push(shortcut.key.charAt(0).toUpperCase() + shortcut.key.slice(1));
  
  return parts.join(' + ');
};

// Check if shortcut is available (not conflicting with browser shortcuts)
export const isShortcutAvailable = (shortcut: KeyboardShortcut): boolean => {
  const browserShortcuts = [
    { key: 'r', ctrlKey: true }, // Refresh
    { key: 't', ctrlKey: true }, // New tab
    { key: 'w', ctrlKey: true }, // Close tab
    { key: 'l', ctrlKey: true }, // Address bar
    { key: 'd', ctrlKey: true }, // Bookmark
    { key: 'h', ctrlKey: true }, // History
    { key: 'j', ctrlKey: true }, // Downloads
    { key: 'u', ctrlKey: true }, // View source
    { key: 'p', ctrlKey: true }, // Print
  ];

  return !browserShortcuts.some(browser => 
    browser.key === shortcut.key.toLowerCase() &&
    !!browser.ctrlKey === !!shortcut.ctrlKey &&
    !!browser.altKey === !!shortcut.altKey &&
    !!browser.shiftKey === !!shortcut.shiftKey &&
    !!browser.metaKey === !!shortcut.metaKey
  );
};

// Context-aware shortcuts hook
export const useContextualShortcuts = (
  context: 'chat' | 'sidebar' | 'settings' | 'global',
  actions: Record<string, () => void>
) => {
  const contextShortcuts: Record<string, KeyboardShortcut[]> = {
    chat: [
      {
        key: 'Enter',
        ctrlKey: true,
        action: actions.sendMessage || (() => {}),
        description: 'Send message',
      },
      {
        key: 'ArrowUp',
        action: actions.editLastMessage || (() => {}),
        description: 'Edit last message',
      },
      {
        key: 'r',
        ctrlKey: true,
        action: actions.regenerateResponse || (() => {}),
        description: 'Regenerate response',
      },
    ],
    sidebar: [
      {
        key: 'n',
        ctrlKey: true,
        action: actions.newChat || (() => {}),
        description: 'New chat',
      },
      {
        key: 'Delete',
        action: actions.deleteChat || (() => {}),
        description: 'Delete selected chat',
      },
      {
        key: 'f',
        ctrlKey: true,
        action: actions.searchChats || (() => {}),
        description: 'Search chats',
      },
    ],
    settings: [
      {
        key: 's',
        ctrlKey: true,
        action: actions.saveSettings || (() => {}),
        description: 'Save settings',
      },
      {
        key: 'r',
        ctrlKey: true,
        action: actions.resetSettings || (() => {}),
        description: 'Reset settings',
      },
    ],
    global: [
      {
        key: 'Escape',
        action: actions.closeModal || (() => {}),
        description: 'Close modal',
      },
      {
        key: '/',
        ctrlKey: true,
        action: actions.toggleSidebar || (() => {}),
        description: 'Toggle sidebar',
      },
      {
        key: 'k',
        ctrlKey: true,
        action: actions.openCommandPalette || (() => {}),
        description: 'Command palette',
      },
    ],
  };

  const shortcuts = contextShortcuts[context] || [];
  useKeyboardShortcuts({ shortcuts });

  return shortcuts;
};