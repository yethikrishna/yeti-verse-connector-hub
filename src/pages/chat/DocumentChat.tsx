import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';

interface DocumentChatProps {}

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  summary?: string;
  pageCount?: number;
  wordCount?: number;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  documentId?: string;
}

type FeatureType = 'summarize' | 'qa' | 'translate' | 'extract';

const supportedFileTypes = [
  { type: 'pdf', label: 'PDF', icon: '📄', accept: '.pdf' },
  { type: 'doc', label: 'Word', icon: '📝', accept: '.doc,.docx' },
  { type: 'txt', label: 'Text', icon: '📋', accept: '.txt' },
  { type: 'rtf', label: 'RTF', icon: '📄', accept: '.rtf' },
];

const features = [
  {
    id: 'summarize',
    label: 'Summarize',
    icon: '📋',
    description: 'Generate concise summaries of your documents',
    color: 'bg-blue-500'
  },
  {
    id: 'qa',
    label: 'Q&A',
    icon: '❓',
    description: 'Ask questions about document content',
    color: 'bg-green-500'
  },
  {
    id: 'translate',
    label: 'Translate',
    icon: '🌐',
    description: 'Translate documents to different languages',
    color: 'bg-purple-500'
  },
  {
    id: 'extract',
    label: 'Extract Data',
    icon: '🔍',
    description: 'Extract key information and data points',
    color: 'bg-orange-500'
  },
];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ru', label: 'Русский' },
];

export const DocumentChat: React.FC<DocumentChatProps> = () => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState<FeatureType>('summarize');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = useCallback((files: FileList) => {
    Array.from(files).forEach((file) => {
      const newDoc: UploadedDocument = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
        status: 'uploading',
      };

      setDocuments(prev => [...prev, newDoc]);

      // Simulate file processing
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => 
          doc.id === newDoc.id 
            ? { 
                ...doc, 
                status: 'processing',
                pageCount: Math.floor(Math.random() * 50) + 1,
                wordCount: Math.floor(Math.random() * 5000) + 500
              }
            : doc
        ));

        setTimeout(() => {
          setDocuments(prev => prev.map(doc => 
            doc.id === newDoc.id 
              ? { 
                  ...doc, 
                  status: 'ready',
                  summary: `This document contains ${doc.pageCount} pages with approximately ${doc.wordCount} words. It covers various topics and contains structured information that can be analyzed and discussed.`
                }
              : doc
          ));
        }, 2000);
      }, 1000);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedDocument) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      documentId: selectedDocument,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateResponse(activeFeature, inputValue),
        timestamp: new Date(),
        documentId: selectedDocument,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 2000);
  };

  const generateResponse = (feature: FeatureType, query: string): string => {
    const selectedDoc = documents.find(doc => doc.id === selectedDocument);
    const docName = selectedDoc?.name || 'document';

    switch (feature) {
      case 'summarize':
        return `Here's a summary of "${docName}": This document provides comprehensive information on the topic discussed. It contains key insights, detailed analysis, and relevant data points that support the main arguments presented. The content is well-structured and covers multiple aspects of the subject matter.`;
      
      case 'qa':
        return `Based on the content of "${docName}", I can help answer your question: "${query}". The document contains relevant information that addresses this topic. Let me provide you with the specific details and context from the document that relate to your inquiry.`;
      
      case 'translate':
        const targetLang = languages.find(lang => lang.code === selectedLanguage)?.label || 'the selected language';
        return `I'll translate the relevant sections of "${docName}" to ${targetLang}. Here's the translation of the content related to your request: "${query}". The translation maintains the original meaning while adapting to the linguistic conventions of the target language.`;
      
      case 'extract':
        return `I've extracted the following key data points from "${docName}" based on your request: "${query}". The document contains structured information including dates, names, numbers, and other relevant data that I can organize and present in a clear format for your analysis.`;
      
      default:
        return `I've processed your request regarding "${docName}". Please let me know if you need any clarification or have additional questions about the document content.`;
    }
  };

  const selectedDoc = documents.find(doc => doc.id === selectedDocument);

  return (
    <DoubaoMainLayout>
      <div className="flex flex-col h-full">
        <DoubaoHeader 
          showSidebarToggle={true}
          hasNotifications={false}
        />
        
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Left Panel - Document Management */}
            <div className="w-80 border-r border-doubao-border-light bg-doubao-bg-primary flex flex-col">
              {/* Upload Area */}
              <div className="p-4 border-b border-doubao-border-light">
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="mb-4"
                >
                  <h2 className="doubao-text-lg font-semibold text-doubao-text-primary mb-2">
                    📄 Document Chat
                  </h2>
                  <p className="doubao-text-sm text-doubao-text-secondary">
                    Upload documents to chat, summarize, translate, and extract data
                  </p>
                </motion.div>

                <motion.div
                  ref={dropZoneRef}
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={cn(
                    'border-2 border-dashed rounded-lg p-6 text-center doubao-transition-colors cursor-pointer',
                    isDragOver 
                      ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10' 
                      : 'border-doubao-border-medium hover:border-doubao-border-dark'
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-3xl mb-2">📁</div>
                  <div className="doubao-text-sm font-medium text-doubao-text-primary mb-1">
                    Drop files here or click to upload
                  </div>
                  <div className="doubao-text-xs text-doubao-text-muted">
                    PDF, Word, Text files supported
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={supportedFileTypes.map(t => t.accept).join(',')}
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </motion.div>

                {/* Supported File Types */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="mt-4"
                >
                  <div className="doubao-text-xs text-doubao-text-muted mb-2">Supported formats:</div>
                  <div className="flex flex-wrap gap-2">
                    {supportedFileTypes.map((type) => (
                      <div
                        key={type.type}
                        className="flex items-center gap-1 px-2 py-1 bg-doubao-bg-secondary rounded text-xs"
                      >
                        <span>{type.icon}</span>
                        <span className="text-doubao-text-muted">{type.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Document List */}
              <div className="flex-1 overflow-auto p-4">
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      variants={doubaoAnimations.fadeInUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedDocument(doc.id)}
                      className={cn(
                        'p-3 rounded-lg border cursor-pointer doubao-transition-colors',
                        selectedDocument === doc.id
                          ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                          : 'border-doubao-border-light hover:border-doubao-border-medium'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">📄</div>
                        <div className="flex-1 min-w-0">
                          <div className="doubao-text-sm font-medium text-doubao-text-primary truncate">
                            {doc.name}
                          </div>
                          <div className="doubao-text-xs text-doubao-text-muted mt-1">
                            {(doc.size / 1024).toFixed(1)} KB
                          </div>
                          
                          {doc.status === 'uploading' && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-3 h-3 border-2 border-doubao-primary-blue/30 border-t-doubao-primary-blue rounded-full animate-spin" />
                              <span className="doubao-text-xs text-doubao-text-muted">Uploading...</span>
                            </div>
                          )}
                          
                          {doc.status === 'processing' && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-3 h-3 border-2 border-doubao-primary-blue/30 border-t-doubao-primary-blue rounded-full animate-spin" />
                              <span className="doubao-text-xs text-doubao-text-muted">Processing...</span>
                            </div>
                          )}
                          
                          {doc.status === 'ready' && (
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                <span className="doubao-text-xs text-doubao-text-muted">Ready</span>
                              </div>
                              {doc.pageCount && (
                                <div className="doubao-text-xs text-doubao-text-muted">
                                  {doc.pageCount} pages • {doc.wordCount} words
                                </div>
                              )}
                            </div>
                          )}
                          
                          {doc.status === 'error' && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full" />
                              <span className="doubao-text-xs text-red-600">Error processing</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {documents.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📄</div>
                      <div className="doubao-text-sm text-doubao-text-muted">
                        No documents uploaded yet
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Chat Interface */}
            <div className="flex-1 flex flex-col">
              {selectedDoc ? (
                <>
                  {/* Document Info Header */}
                  <div className="p-4 border-b border-doubao-border-light bg-doubao-bg-primary">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">📄</div>
                        <div>
                          <div className="doubao-text-base font-medium text-doubao-text-primary">
                            {selectedDoc.name}
                          </div>
                          <div className="doubao-text-sm text-doubao-text-secondary">
                            {selectedDoc.pageCount} pages • {selectedDoc.wordCount} words
                          </div>
                        </div>
                      </div>
                      
                      {/* Feature Selection */}
                      <div className="flex gap-2">
                        {features.map((feature) => (
                          <motion.button
                            key={feature.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setActiveFeature(feature.id as FeatureType)}
                            className={cn(
                              'px-3 py-2 rounded-lg doubao-text-sm font-medium doubao-transition-colors',
                              activeFeature === feature.id
                                ? 'bg-doubao-primary-blue text-white'
                                : 'bg-doubao-bg-secondary text-doubao-text-primary hover:bg-doubao-border-light'
                            )}
                          >
                            <span className="mr-1">{feature.icon}</span>
                            {feature.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Feature Description */}
                    <div className="mt-3 p-3 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-secondary">
                        {features.find(f => f.id === activeFeature)?.description}
                      </div>
                      
                      {/* Translation Language Selector */}
                      {activeFeature === 'translate' && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="doubao-text-sm text-doubao-text-primary">Translate to:</span>
                          <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="doubao-input-base py-1 px-2 text-sm"
                          >
                            {languages.map((lang) => (
                              <option key={lang.code} value={lang.code}>
                                {lang.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-auto p-4 space-y-4">
                    {selectedDoc.summary && messages.length === 0 && (
                      <motion.div
                        variants={doubaoAnimations.fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="p-4 bg-doubao-bg-secondary rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-doubao-primary-blue rounded-full flex items-center justify-center text-white text-sm">
                            AI
                          </div>
                          <div className="flex-1">
                            <div className="doubao-text-sm font-medium text-doubao-text-primary mb-2">
                              Document Summary
                            </div>
                            <div className="doubao-text-sm text-doubao-text-secondary">
                              {selectedDoc.summary}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {messages
                      .filter(msg => msg.documentId === selectedDocument)
                      .map((message, index) => (
                        <motion.div
                          key={message.id}
                          variants={doubaoAnimations.fadeInUp}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: index * 0.1 }}
                          className={cn(
                            'flex gap-3',
                            message.type === 'user' ? 'justify-end' : 'justify-start'
                          )}
                        >
                          {message.type === 'assistant' && (
                            <div className="w-8 h-8 bg-doubao-primary-blue rounded-full flex items-center justify-center text-white text-sm">
                              AI
                            </div>
                          )}
                          
                          <div
                            className={cn(
                              'max-w-[70%] p-3 rounded-lg',
                              message.type === 'user'
                                ? 'bg-doubao-primary-blue text-white'
                                : 'bg-doubao-bg-secondary text-doubao-text-primary'
                            )}
                          >
                            <div className="doubao-text-sm">{message.content}</div>
                            <div
                              className={cn(
                                'doubao-text-xs mt-2',
                                message.type === 'user'
                                  ? 'text-white/70'
                                  : 'text-doubao-text-muted'
                              )}
                            >
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                          
                          {message.type === 'user' && (
                            <div className="w-8 h-8 bg-doubao-border-medium rounded-full flex items-center justify-center text-doubao-text-primary text-sm">
                              U
                            </div>
                          )}
                        </motion.div>
                      ))}
                    
                    {isProcessing && (
                      <motion.div
                        variants={doubaoAnimations.fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="flex gap-3"
                      >
                        <div className="w-8 h-8 bg-doubao-primary-blue rounded-full flex items-center justify-center text-white text-sm">
                          AI
                        </div>
                        <div className="bg-doubao-bg-secondary p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-doubao-text-muted rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-doubao-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-doubao-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <span className="doubao-text-sm text-doubao-text-muted">Processing...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-doubao-border-light bg-doubao-bg-primary">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder={`Ask about ${selectedDoc.name}...`}
                          className="w-full doubao-input-base"
                          disabled={selectedDoc.status !== 'ready' || isProcessing}
                        />
                      </div>
                      <motion.button
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || selectedDoc.status !== 'ready' || isProcessing}
                        className={cn(
                          'px-4 py-2 doubao-button-primary',
                          (!inputValue.trim() || selectedDoc.status !== 'ready' || isProcessing) && 
                          'opacity-50 cursor-not-allowed'
                        )}
                      >
                        Send
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                /* No Document Selected */
                <div className="flex-1 flex items-center justify-center">
                  <motion.div
                    variants={doubaoAnimations.fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="text-center"
                  >
                    <div className="text-6xl mb-4">📄</div>
                    <div className="doubao-text-xl font-medium text-doubao-text-primary mb-2">
                      Select a document to start chatting
                    </div>
                    <div className="doubao-text-base text-doubao-text-secondary">
                      Upload documents on the left to begin analysis and conversation
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DoubaoMainLayout>
  );
};

export default DocumentChat;