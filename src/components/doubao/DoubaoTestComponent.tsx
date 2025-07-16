import React, { useState } from 'react';
import { DoubaoMessageBubble, DoubaoMessageList, Message } from './DoubaoMessageBubble';
import { DoubaoInputArea } from './DoubaoInputArea';
import { DoubaoTypingIndicator } from './DoubaoTypingIndicator';

export const DoubaoTestComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      role: 'assistant',
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: '2',
      content: 'I need help with creating a React component.',
      role: 'user',
      timestamp: new Date(Date.now() - 30000),
    },
    {
      id: '3',
      content: 'I\'d be happy to help you create a React component! What specific functionality are you looking to implement?',
      role: 'assistant',
      timestamp: new Date(Date.now() - 15000),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you said: "${content}". Let me help you with that!`,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      setIsLoading(false);
    }, 2000);
  };

  const handleAttachFile = (files: FileList) => {
    console.log('Files attached:', files);
    // Handle file attachment logic here
  };

  const handleVoiceInput = () => {
    console.log('Voice input activated');
    // Handle voice input logic here
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-doubao-bg-primary">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-doubao-border-light">
        <h1 className="doubao-heading">Doubao Chat Interface Test</h1>
        <p className="doubao-text-sm text-doubao-text-secondary mt-1">
          Testing all chat interface components with animations
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <DoubaoMessageList
          messages={messages}
          showAvatars={true}
          onMessageClick={(messageId) => console.log('Message clicked:', messageId)}
        />

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-doubao-primary-blue to-doubao-purple flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
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
              <div className="bg-doubao-ai-bubble px-4 py-3 rounded-2xl rounded-bl-md">
                <DoubaoTypingIndicator variant="dots" size="md" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test Controls */}
      <div className="flex-shrink-0 p-4 border-t border-doubao-border-light bg-doubao-bg-secondary">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleSendMessage('This is a test message')}
            className="doubao-button-secondary"
            disabled={isLoading}
          >
            Send Test Message
          </button>
          <button
            onClick={() => setIsTyping(!isTyping)}
            className="doubao-button-secondary"
          >
            Toggle Typing Indicator
          </button>
          <button
            onClick={() => setMessages([])}
            className="doubao-button-secondary"
          >
            Clear Messages
          </button>
        </div>

        {/* Typing Indicator Variants */}
        <div className="flex flex-wrap gap-4 mb-4 p-3 bg-doubao-bg-primary rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <span className="doubao-text-xs text-doubao-text-muted">Dots</span>
            <DoubaoTypingIndicator variant="dots" size="md" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="doubao-text-xs text-doubao-text-muted">Pulse</span>
            <DoubaoTypingIndicator variant="pulse" size="md" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="doubao-text-xs text-doubao-text-muted">Wave</span>
            <DoubaoTypingIndicator variant="wave" size="md" />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <DoubaoInputArea
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        onAttachFile={handleAttachFile}
        onVoiceInput={handleVoiceInput}
        placeholder="Type your message here..."
        disabled={isLoading}
        isLoading={isLoading}
        showAttachment={true}
        showVoiceInput={true}
        autoFocus={true}
      />
    </div>
  );
};

export default DoubaoTestComponent;