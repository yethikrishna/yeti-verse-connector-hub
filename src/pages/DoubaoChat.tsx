import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';
import { DoubaoMessageBubble } from '@/components/doubao/DoubaoMessageBubble';
import { DoubaoInputArea } from '@/components/doubao/DoubaoInputArea';
import { DoubaoTypingIndicator } from '@/components/doubao/DoubaoTypingIndicator';
import { useNotifications } from '@/hooks/useNotifications';
import { useYetiChatMemory, type ChatSession, type ChatMessage } from '@/hooks/useYetiChatMemory';
import { useToast } from '@/hooks/use-toast';

// Convert ChatMessage to Doubao format
interface DoubaoMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// Convert ChatSession to Doubao format
interface DoubaoConversation {
  id: string;
  title: string;
  messages: DoubaoMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export const DoubaoChat: React.FC = () => {
  const [isTyping, setIsTyping] = useState(false);
  const { hasNotifications } = useNotifications();
  const { toast } = useToast();
  
  // Use existing Yeti chat memory system
  const {
    sessions,
    currentSession,
    messages,
    loadSessions,
    loadSession,
    saveMessage,
    deleteSession,
    startNewSession,
    setMessages
  } = useYetiChatMemory();

  // Convert ChatMessage[] to DoubaoMessage[] for display
  const convertMessages = useCallback((chatMessages: ChatMessage[]): DoubaoMessage[] => {
    return chatMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      role: msg.role as 'user' | 'assistant',
      timestamp: new Date(msg.created_at)
    }));
  }, []);

  // Convert ChatSession[] to DoubaoConversation[] for sidebar
  const convertConversations = useCallback((chatSessions: ChatSession[]): DoubaoConversation[] => {
    return chatSessions.map(session => ({
      id: session.id,
      title: session.title,
      messages: [], // Messages are loaded separately when needed
      createdAt: new Date(session.created_at),
      updatedAt: new Date(session.updated_at)
    }));
  }, []);

  const conversations = convertConversations(sessions);
  const currentMessages = convertMessages(messages);

  // Load sessions on component mount
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleNewChat = useCallback(async () => {
    await startNewSession('yeti-core-alpha');
    toast({
      title: "🧊 New Chat",
      description: "Started a fresh conversation!",
    });
  }, [startNewSession, toast]);

  const handleSelectConversation = useCallback(async (conversationId: string) => {
    await loadSession(conversationId);
  }, [loadSession]);

  const handleDeleteConversation = useCallback(async (conversationId: string) => {
    await deleteSession(conversationId);
  }, [deleteSession]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!currentSession || !content.trim()) return;

    // Create new session if none exists
    let sessionId = currentSession;
    if (!sessionId) {
      sessionId = await startNewSession('yeti-core-alpha');
      if (!sessionId) return;
    }

    // Save user message
    const success = await saveMessage(sessionId, 'user', content.trim());
    if (!success) return;

    // Show typing indicator
    setIsTyping(true);

    try {
      // Simulate AI response (in real implementation, this would call the AI service)
      setTimeout(async () => {
        const response = `I understand you're asking about "${content}". This is a simulated response from Doubao. In a real implementation, this would connect to an AI service to generate appropriate responses.`;
        
        await saveMessage(sessionId, 'assistant', response);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Error generating response:', error);
      setIsTyping(false);
      toast({
        title: "❄️ Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    }
  }, [currentSession, startNewSession, saveMessage, toast]);

  return (
    <DoubaoMainLayout
      conversations={conversations}
      activeConversationId={currentSession}
      onNewChat={handleNewChat}
      onSelectConversation={handleSelectConversation}
      onDeleteConversation={handleDeleteConversation}
    >
      <div className="flex flex-col h-full">
        <DoubaoHeader 
          showSidebarToggle={true}
          hasNotifications={hasNotifications}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {currentMessages.length === 0 ? (
              <motion.div
                variants={doubaoAnimations.messageVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <div className="text-6xl mb-4">💬</div>
                <h2 className="doubao-text-xl font-semibold text-doubao-text-primary mb-2">
                  Start a new conversation
                </h2>
                <p className="doubao-text-base text-doubao-text-secondary max-w-md">
                  Ask me anything! I can help with writing, coding, research, and much more.
                </p>
              </motion.div>
            ) : (
              <div className="max-w-4xl mx-auto w-full space-y-4">
                {currentMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    variants={doubaoAnimations.messageVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <DoubaoMessageBubble
                      message={message.content}
                      isUser={message.role === 'user'}
                      timestamp={message.timestamp}
                      avatar={message.role === 'assistant' ? '🤖' : undefined}
                    />
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    variants={doubaoAnimations.messageVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <DoubaoTypingIndicator />
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 p-4 border-t border-doubao-border-light">
            <div className="max-w-4xl mx-auto">
              <DoubaoInputArea
                onSendMessage={handleSendMessage}
                disabled={isTyping}
                placeholder="Message Doubao..."
              />
            </div>
          </div>
        </div>
      </div>
    </DoubaoMainLayout>
  );
};

export default DoubaoChat;