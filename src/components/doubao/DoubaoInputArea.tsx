import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';

export interface DoubaoInputAreaProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: (message: string) => void;
  onAttachFile?: (files: FileList) => void;
  onVoiceInput?: () => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  maxLength?: number;
  className?: string;
  showAttachment?: boolean;
  showVoiceInput?: boolean;
  autoFocus?: boolean;
}

export const DoubaoInputArea: React.FC<DoubaoInputAreaProps> = ({
  value = '',
  onChange,
  onSend,
  onAttachFile,
  onVoiceInput,
  placeholder = 'Type your message...',
  disabled = false,
  isLoading = false,
  maxLength = 4000,
  className,
  showAttachment = true,
  showVoiceInput = true,
  autoFocus = false,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 120; // Max height in pixels (about 5 lines)
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      setInputValue(newValue);
      onChange?.(newValue);
      adjustTextareaHeight();
    }
  };

  // Handle send message
  const handleSend = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !disabled && !isLoading) {
      onSend?.(trimmedValue);
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle file attachment
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAttachFile?.(files);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle voice input
  const handleVoiceInput = () => {
    setIsVoiceRecording(!isVoiceRecording);
    onVoiceInput?.();
  };

  // Auto-focus on mount if specified
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Update internal state when external value changes
  useEffect(() => {
    setInputValue(value);
    adjustTextareaHeight();
  }, [value]);

  const canSend = inputValue.trim().length > 0 && !disabled && !isLoading;

  return (
    <div className={cn(
      'bg-doubao-bg-primary border-t border-doubao-border-light',
      'p-4 flex-shrink-0',
      className
    )}>
      <motion.div
        animate={{
          boxShadow: isFocused 
            ? '0 0 0 2px hsl(var(--doubao-focus) / 0.2)' 
            : '0 2px 8px rgba(0, 0, 0, 0.06)'
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          'relative flex items-end gap-3 p-3',
          'bg-doubao-bg-primary border border-doubao-border-light',
          'rounded-2xl doubao-transition-all',
          isFocused && 'border-doubao-focus',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {/* Attachment Button */}
        {showAttachment && (
          <motion.button
            variants={doubaoAnimations.buttonVariants}
            initial="rest"
            whileHover={!disabled ? "hover" : "rest"}
            whileTap={!disabled ? "tap" : "rest"}
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className={cn(
              'flex-shrink-0 p-2 rounded-lg',
              'text-doubao-text-secondary hover:text-doubao-text-primary',
              'hover:bg-doubao-hover doubao-transition-colors',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            title="Attach file"
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
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49" />
            </svg>
          </motion.button>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        />

        {/* Text Input Area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              'w-full resize-none border-none outline-none',
              'bg-transparent doubao-input-text',
              'text-doubao-text-primary placeholder:text-doubao-text-muted',
              'min-h-[24px] max-h-[120px] py-1',
              'disabled:cursor-not-allowed'
            )}
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: 'hsl(var(--doubao-border-medium)) transparent'
            }}
          />

          {/* Character count */}
          <AnimatePresence>
            {inputValue.length > maxLength * 0.8 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={cn(
                  'absolute -top-6 right-0 doubao-text-xs',
                  inputValue.length >= maxLength 
                    ? 'text-red-500' 
                    : 'text-doubao-text-muted'
                )}
              >
                {inputValue.length}/{maxLength}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Voice Input Button */}
        {showVoiceInput && (
          <motion.button
            variants={doubaoAnimations.buttonVariants}
            initial="rest"
            whileHover={!disabled ? "hover" : "rest"}
            whileTap={!disabled ? "tap" : "rest"}
            onClick={handleVoiceInput}
            disabled={disabled}
            className={cn(
              'flex-shrink-0 p-2 rounded-lg',
              'text-doubao-text-secondary hover:text-doubao-text-primary',
              'hover:bg-doubao-hover doubao-transition-colors',
              'disabled:cursor-not-allowed disabled:opacity-50',
              isVoiceRecording && 'text-red-500 bg-red-50'
            )}
            title={isVoiceRecording ? "Stop recording" : "Voice input"}
          >
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={isVoiceRecording ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 1, repeat: isVoiceRecording ? Infinity : 0 }}
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="8" y1="22" x2="16" y2="22" />
            </motion.svg>
          </motion.button>
        )}

        {/* Send Button */}
        <motion.button
          variants={doubaoAnimations.buttonVariants}
          initial="rest"
          whileHover={canSend ? "hover" : "rest"}
          whileTap={canSend ? "tap" : "rest"}
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'flex-shrink-0 p-2 rounded-lg doubao-transition-all',
            canSend
              ? 'doubao-gradient-blue text-white doubao-shadow-soft'
              : 'bg-doubao-bg-tertiary text-doubao-text-muted cursor-not-allowed'
          )}
          title="Send message"
        >
          {isLoading ? (
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </motion.svg>
          ) : (
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
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          )}
        </motion.button>
      </motion.div>

      {/* Voice Recording Indicator */}
      <AnimatePresence>
        {isVoiceRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-2 flex items-center justify-center gap-2 text-doubao-text-muted doubao-text-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-red-500 rounded-full"
            />
            Recording... Tap to stop
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoubaoInputArea;