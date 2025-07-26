
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthWrapper } from "@/components/AuthWrapper";
import { DoubaoProgressiveEnhancement, DoubaoFallbackComponent } from "@/components/doubao/DoubaoProgressiveEnhancement";
import { CustomSignIn } from "@/components/auth/CustomSignIn";
import { CustomSignUp } from "@/components/auth/CustomSignUp";
import { LandingDemo } from "@/components/LandingDemo";
import { SignInDemo } from "@/components/SignInDemo";
import { SignUpDemo } from "@/components/SignUpDemo";
import DoubaoChat from "./pages/DoubaoChat";
import DoubaoPromptTemplates from "./pages/DoubaoPromptTemplates";
import DoubaoFunctionLibrary from "./pages/DoubaoFunctionLibrary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BuildSettings from "./pages/BuildSettings";
import YetiWorkflows from "./pages/YetiWorkflows";
import YetiTools from "./pages/YetiTools";
import YetiModels from "./pages/YetiModels";
import YetiSecurity from "./pages/YetiSecurity";
import YetiTeams from "./pages/YetiTeams";
import YetiAnalytics from "./pages/YetiAnalytics";
import YetiComputer from "./pages/YetiComputer";
import YetiBrowser from "./pages/YetiBrowser";
import YetiVocoder from "./pages/YetiVocoder";
import YetiImageStudio from "./pages/YetiImageStudio";
import YetiStudio from "./pages/YetiStudio";
import SystemTest from "./pages/SystemTest";
import LinkedInCallback from "./pages/auth/linkedin/callback";
import WritingAssistance from "./pages/chat/WritingAssistance";
import AIProgramming from "./pages/chat/AIProgramming";
import AISearch from "./pages/chat/AISearch";
import ImageGeneration from "./pages/chat/ImageGeneration";
import DocumentChat from "./pages/chat/DocumentChat";
import PCAIGuidance from "./pages/chat/PCAIGuidance";
import BotDiscovery from "./pages/chat/BotDiscovery";
import DataStorageAnalysis from "./pages/chat/DataStorageAnalysis";
import MusicGeneration from "./pages/chat/MusicGeneration";
import VideoGeneration from "./pages/chat/VideoGeneration";
import Translation from "./pages/chat/Translation";
import AcademicSearch from "./pages/chat/AcademicSearch";
import QuestionsAnswers from "./pages/chat/QuestionsAnswers";
import AIPPTGeneration from "./pages/chat/AIPPTGeneration";
import WebpageSummary from "./pages/chat/WebpageSummary";
import VoiceCall from "./pages/chat/VoiceCall";
import AIPodcast from "./pages/chat/AIPodcast";
import MeetingRecording from "./pages/chat/MeetingRecording";
import ScreenSharing from "./pages/chat/ScreenSharing";
import FurtherResearch from "./pages/chat/FurtherResearch";
import ProductUpdates from "./pages/ProductUpdates";
import DoubaoSettings from "./pages/DoubaoSettings";
import { DoubaoMainLayout } from "@/components/doubao/DoubaoMainLayout";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState<'chat' | 'prompts' | 'functions' | 'settings' | 'history'>('chat');
  const location = useLocation();
  const navigate = useNavigate();

  // Update current page based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setCurrentPage('chat');
    } else if (path === '/prompts') {
      setCurrentPage('prompts');
    } else if (path === '/functions') {
      setCurrentPage('functions');
    } else if (path === '/settings') {
      setCurrentPage('settings');
    } else {
      setCurrentPage('chat');
    }
  }, [location.pathname]);

  const handlePageChange = (page: string) => {
    switch (page) {
      case 'chat':
        navigate('/');
        break;
      case 'prompts':
        navigate('/prompts');
        break;
      case 'functions':
        navigate('/functions');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <DoubaoMainLayout
      currentPage={currentPage}
      onPageChange={handlePageChange}
    >
      <Routes>
        <Route path="/" element={<DoubaoChat />} />
        <Route path="/prompts" element={<DoubaoPromptTemplates />} />
        <Route path="/functions" element={<DoubaoFunctionLibrary />} />
        <Route path="/build-settings" element={<BuildSettings />} />
        <Route path="/workflows" element={<YetiWorkflows />} />
        <Route path="/tools" element={<YetiTools />} />
        <Route path="/models" element={<YetiModels />} />
        <Route path="/security" element={<YetiSecurity />} />
        <Route path="/teams" element={<YetiTeams />} />
        <Route path="/analytics" element={<YetiAnalytics />} />
        <Route path="/computer" element={<YetiComputer />} />
        <Route path="/browser" element={<YetiBrowser />} />
        <Route path="/vocoder" element={<YetiVocoder />} />
        <Route path="/image-studio" element={<YetiImageStudio />} />
        <Route path="/studio" element={<YetiStudio />} />
        <Route path="/system-test" element={<SystemTest />} />
        <Route path="/chat/write" element={<WritingAssistance />} />
        <Route path="/chat/coding" element={<AIProgramming />} />
        <Route path="/chat/search" element={<AISearch />} />
        <Route path="/chat/create-image" element={<ImageGeneration />} />
        <Route path="/chat/chat-with-doc" element={<DocumentChat />} />
        <Route path="/chat/pc-ai-guidance" element={<PCAIGuidance />} />
        <Route path="/chat/bot/discover" element={<BotDiscovery />} />
        <Route path="/chat/drive/" element={<DataStorageAnalysis />} />
        <Route path="/chat/music" element={<MusicGeneration />} />
        <Route path="/chat/video" element={<VideoGeneration />} />
        <Route path="/chat/translate" element={<Translation />} />
        <Route path="/chat/academic-search" element={<AcademicSearch />} />
        <Route path="/chat/questions-answers" element={<QuestionsAnswers />} />
        <Route path="/chat/ppt" element={<AIPPTGeneration />} />
        <Route path="/chat/webpage-summary" element={<WebpageSummary />} />
        <Route path="/chat/voice-call" element={<VoiceCall />} />
        <Route path="/chat/podcast" element={<AIPodcast />} />
        <Route path="/chat/meeting-recording" element={<MeetingRecording />} />
        <Route path="/chat/screen-sharing" element={<ScreenSharing />} />
        <Route path="/chat/further-research" element={<FurtherResearch />} />
        <Route path="/product-updates" element={<ProductUpdates />} />
        <Route path="/settings" element={<DoubaoSettings />} />
        <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DoubaoMainLayout>
  );
};

const App = () => (
  <DoubaoProgressiveEnhancement fallbackComponent={DoubaoFallbackComponent}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Demo Routes for Showcase */}
            <Route path="/demo" element={<LandingDemo />} />
            <Route path="/demo-signin" element={<SignInDemo />} />
            <Route path="/demo-signup" element={<SignUpDemo />} />
            
            {/* Public Auth Routes */}
            <Route path="/sign-in" element={<CustomSignIn />} />
            <Route path="/sign-up" element={<CustomSignUp />} />
            
            {/* Protected Routes with Doubao UI */}
            <Route path="/*" element={
              <AuthWrapper>
                <AppContent />
              </AuthWrapper>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </DoubaoProgressiveEnhancement>
);

export default App;
