import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';

// Loading skeleton component
const LoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <motion.div
    variants={doubaoAnimations.fadeInUp}
    initial="hidden"
    animate="visible"
    className={cn('animate-pulse', className)}
  >
    <div className="space-y-4">
      <div className="h-4 bg-doubao-bg-tertiary rounded w-3/4"></div>
      <div className="h-4 bg-doubao-bg-tertiary rounded w-1/2"></div>
      <div className="h-4 bg-doubao-bg-tertiary rounded w-5/6"></div>
    </div>
  </motion.div>
);

// Enhanced loading component with Doubao styling
const DoubaoLoadingFallback: React.FC<{ 
  message?: string;
  className?: string;
}> = ({ 
  message = 'Loading...', 
  className 
}) => (
  <motion.div
    variants={doubaoAnimations.fadeInUp}
    initial="hidden"
    animate="visible"
    className={cn(
      'flex flex-col items-center justify-center p-8 space-y-4',
      className
    )}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-8 h-8 border-2 border-doubao-border-medium border-t-doubao-primary-blue rounded-full"
    />
    <p className="text-doubao-text-muted text-sm">{message}</p>
  </motion.div>
);

// Lazy-loaded chat feature pages
export const LazyWritingAssistance = React.lazy(() => 
  import('../../pages/chat/WritingAssistance').then(module => ({
    default: module.default
  }))
);

export const LazyAIProgramming = React.lazy(() => 
  import('../../pages/chat/AIProgramming').then(module => ({
    default: module.default
  }))
);

export const LazyAISearch = React.lazy(() => 
  import('../../pages/chat/AISearch').then(module => ({
    default: module.default
  }))
);

export const LazyImageGeneration = React.lazy(() => 
  import('../../pages/chat/ImageGeneration').then(module => ({
    default: module.default
  }))
);

export const LazyDocumentChat = React.lazy(() => 
  import('../../pages/chat/DocumentChat').then(module => ({
    default: module.default
  }))
);

export const LazyPCAIGuidance = React.lazy(() => 
  import('../../pages/chat/PCAIGuidance').then(module => ({
    default: module.default
  }))
);

export const LazyBotDiscovery = React.lazy(() => 
  import('../../pages/chat/BotDiscovery').then(module => ({
    default: module.default
  }))
);

export const LazyDataStorageAnalysis = React.lazy(() => 
  import('../../pages/chat/DataStorageAnalysis').then(module => ({
    default: module.default
  }))
);

export const LazyMusicGeneration = React.lazy(() => 
  import('../../pages/chat/MusicGeneration').then(module => ({
    default: module.default
  }))
);

export const LazyVideoGeneration = React.lazy(() => 
  import('../../pages/chat/VideoGeneration').then(module => ({
    default: module.default
  }))
);

export const LazyTranslation = React.lazy(() => 
  import('../../pages/chat/Translation').then(module => ({
    default: module.default
  }))
);

export const LazyAcademicSearch = React.lazy(() => 
  import('../../pages/chat/AcademicSearch').then(module => ({
    default: module.default
  }))
);

export const LazyQuestionsAnswers = React.lazy(() => 
  import('../../pages/chat/QuestionsAnswers').then(module => ({
    default: module.default
  }))
);

export const LazyAIPPTGeneration = React.lazy(() => 
  import('../../pages/chat/AIPPTGeneration').then(module => ({
    default: module.default
  }))
);

export const LazyWebpageSummary = React.lazy(() => 
  import('../../pages/chat/WebpageSummary').then(module => ({
    default: module.default
  }))
);

export const LazyVoiceCall = React.lazy(() => 
  import('../../pages/chat/VoiceCall').then(module => ({
    default: module.default
  }))
);

export const LazyFurtherResearch = React.lazy(() => 
  import('../../pages/chat/FurtherResearch').then(module => ({
    default: module.default
  }))
);

export const LazyAIPodcast = React.lazy(() => 
  import('../../pages/chat/AIPodcast').then(module => ({
    default: module.default
  }))
);

export const LazyMeetingRecording = React.lazy(() => 
  import('../../pages/chat/MeetingRecording').then(module => ({
    default: module.default
  }))
);

export const LazyScreenSharing = React.lazy(() => 
  import('../../pages/chat/ScreenSharing').then(module => ({
    default: module.default
  }))
);

// Settings and configuration pages
export const LazyDoubaoSettings = React.lazy(() => 
  import('../../pages/DoubaoSettings').then(module => ({
    default: module.default
  }))
);

export const LazyProductUpdates = React.lazy(() => 
  import('../../pages/ProductUpdates').then(module => ({
    default: module.default
  }))
);

export const LazyDoubaoConversationHistory = React.lazy(() => 
  import('../../pages/DoubaoConversationHistory').then(module => ({
    default: module.default
  }))
);

// Higher-order component for lazy loading with custom fallback
export const withLazyLoading = <P extends object>(
  Component: React.LazyExoticComponent<React.ComponentType<P>>,
  fallback?: React.ComponentType,
  loadingMessage?: string
) => {
  const WrappedComponent: React.FC<P> = (props) => (
    <Suspense 
      fallback={
        fallback ? 
          React.createElement(fallback) : 
          <DoubaoLoadingFallback message={loadingMessage} />
      }
    >
      <Component {...props} />
    </Suspense>
  );

  WrappedComponent.displayName = `withLazyLoading(${Component.displayName || 'Component'})`;
  return WrappedComponent;
};

// Pre-configured lazy components with appropriate loading states
export const LazyComponents = {
  WritingAssistance: withLazyLoading(LazyWritingAssistance, undefined, 'Loading Writing Assistant...'),
  AIProgramming: withLazyLoading(LazyAIProgramming, undefined, 'Loading AI Programming...'),
  AISearch: withLazyLoading(LazyAISearch, undefined, 'Loading AI Search...'),
  ImageGeneration: withLazyLoading(LazyImageGeneration, undefined, 'Loading Image Generator...'),
  DocumentChat: withLazyLoading(LazyDocumentChat, undefined, 'Loading Document Chat...'),
  PCAIGuidance: withLazyLoading(LazyPCAIGuidance, undefined, 'Loading PC AI Guidance...'),
  BotDiscovery: withLazyLoading(LazyBotDiscovery, undefined, 'Loading Bot Discovery...'),
  DataStorageAnalysis: withLazyLoading(LazyDataStorageAnalysis, undefined, 'Loading Data Analysis...'),
  MusicGeneration: withLazyLoading(LazyMusicGeneration, undefined, 'Loading Music Generator...'),
  VideoGeneration: withLazyLoading(LazyVideoGeneration, undefined, 'Loading Video Generator...'),
  Translation: withLazyLoading(LazyTranslation, undefined, 'Loading Translation...'),
  AcademicSearch: withLazyLoading(LazyAcademicSearch, undefined, 'Loading Academic Search...'),
  QuestionsAnswers: withLazyLoading(LazyQuestionsAnswers, undefined, 'Loading Q&A...'),
  AIPPTGeneration: withLazyLoading(LazyAIPPTGeneration, undefined, 'Loading PPT Generator...'),
  WebpageSummary: withLazyLoading(LazyWebpageSummary, undefined, 'Loading Webpage Summary...'),
  VoiceCall: withLazyLoading(LazyVoiceCall, undefined, 'Loading Voice Call...'),
  FurtherResearch: withLazyLoading(LazyFurtherResearch, undefined, 'Loading Research Tools...'),
  AIPodcast: withLazyLoading(LazyAIPodcast, undefined, 'Loading Podcast Generator...'),
  MeetingRecording: withLazyLoading(LazyMeetingRecording, undefined, 'Loading Meeting Recorder...'),
  ScreenSharing: withLazyLoading(LazyScreenSharing, undefined, 'Loading Screen Sharing...'),
  DoubaoSettings: withLazyLoading(LazyDoubaoSettings, undefined, 'Loading Settings...'),
  ProductUpdates: withLazyLoading(LazyProductUpdates, undefined, 'Loading Updates...'),
  DoubaoConversationHistory: withLazyLoading(LazyDoubaoConversationHistory, undefined, 'Loading History...'),
};

// Preload utility for better UX
export const preloadComponent = (componentName: keyof typeof LazyComponents) => {
  const componentMap = {
    WritingAssistance: LazyWritingAssistance,
    AIProgramming: LazyAIProgramming,
    AISearch: LazyAISearch,
    ImageGeneration: LazyImageGeneration,
    DocumentChat: LazyDocumentChat,
    PCAIGuidance: LazyPCAIGuidance,
    BotDiscovery: LazyBotDiscovery,
    DataStorageAnalysis: LazyDataStorageAnalysis,
    MusicGeneration: LazyMusicGeneration,
    VideoGeneration: LazyVideoGeneration,
    Translation: LazyTranslation,
    AcademicSearch: LazyAcademicSearch,
    QuestionsAnswers: LazyQuestionsAnswers,
    AIPPTGeneration: LazyAIPPTGeneration,
    WebpageSummary: LazyWebpageSummary,
    VoiceCall: LazyVoiceCall,
    FurtherResearch: LazyFurtherResearch,
    AIPodcast: LazyAIPodcast,
    MeetingRecording: LazyMeetingRecording,
    ScreenSharing: LazyScreenSharing,
    DoubaoSettings: LazyDoubaoSettings,
    ProductUpdates: LazyProductUpdates,
    DoubaoConversationHistory: LazyDoubaoConversationHistory,
  };

  const component = componentMap[componentName];
  if (component) {
    // Trigger the import to preload the component
    component._payload._result.catch(() => {
      // Ignore errors during preload
    });
  }
};

// Batch preload multiple components
export const preloadComponents = (componentNames: (keyof typeof LazyComponents)[]) => {
  componentNames.forEach(preloadComponent);
};

export { LoadingSkeleton, DoubaoLoadingFallback };
export default LazyComponents;