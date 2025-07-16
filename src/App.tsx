
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthWrapper } from "@/components/AuthWrapper";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthWrapper>
          <Routes>
            <Route path="/" element={<Index />} />
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
            <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthWrapper>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
