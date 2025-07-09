import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Brain, Sparkles, Zap, RefreshCw, Plus, Image, Video, History, Save, Menu, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { VoiceInput } from "@/components/VoiceInput";
import { VoiceControls } from "@/components/VoiceControls";
import { useVoiceOutput } from "@/hooks/useVoiceOutput";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useYetiChatMemory, ChatMessage } from "@/hooks/useYetiChatMemory";
import { YetiChatHistory } from "@/components/YetiChatHistory";

interface LocalChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function YetiChatInterface() {
  const [inputMessage, setInputMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("yeti-core-alpha");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Voice system integration
  const { 
    generateSpeech, 
    isGenerating: isVoiceGenerating, 
    isPlaying, 
    stopAudio,
    voiceSettings,
    updateVoiceSettings 
  } = useVoiceOutput();

  // Memory system integration
  const {
    messages,
    setMessages,
    currentSession,
    saveMessage,
    loadSession,
    startNewSession
  } = useYetiChatMemory();

  // Predefined Yeti AI models with backend routing and fallback
  const yetiModels = [
    { 
      id: "yeti-core-alpha", 
      name: "Yeti Core Alpha", 
      description: "GPT-4o with multi-provider fallback",
      provider: "openai",
      model_name: "gpt-4o"
    },
    { 
      id: "yeti-claude-sonnet", 
      name: "Yeti Claude Sonnet", 
      description: "Claude 3.5 Sonnet with OpenAI fallback",
      provider: "openrouter",
      model_name: "anthropic/claude-3.5-sonnet"
    },
    { 
      id: "yeti-gemini-flash", 
      name: "Yeti Gemini Flash", 
      description: "Gemini 1.5 Flash with multi-provider fallback",
      provider: "gemini",
      model_name: "gemini-1.5-flash"
    },
    { 
      id: "yeti-claude-opus", 
      name: "Yeti Claude Opus", 
      description: "Claude 3 Opus via OpenRouter",
      provider: "openrouter",
      model_name: "anthropic/claude-3-opus"
    },
    { 
      id: "yeti-gpt-4o-mini", 
      name: "Yeti GPT-4o Mini", 
      description: "Fast and efficient GPT-4o Mini",
      provider: "openai",
      model_name: "gpt-4o-mini"
    },
    { 
      id: "yeti-llama-3-70b", 
      name: "Yeti Llama 3 70B", 
      description: "Meta Llama 3 70B via OpenRouter",
      provider: "openrouter",
      model_name: "meta-llama/llama-3.1-70b-instruct"
    },
    { 
      id: "yeti-novita-llama", 
      name: "Yeti Novita Llama", 
      description: "Llama 3.1 8B via Novita with fallbacks",
      provider: "novita",
      model_name: "meta-llama/llama-3.1-8b-instruct"
    }
  ];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    console.log('🧊 Yeti Chat: Starting message send process');
    
    let sessionId = currentSession;
    
    // Create new session if none exists
    if (!sessionId) {
      console.log('🧊 Yeti Chat: Creating new session');
      sessionId = await startNewSession(selectedModel);
      if (!sessionId) {
        console.error('❄️ Yeti Chat: Failed to create session');
        return;
      }
      console.log('🧊 Yeti Chat: Session created:', sessionId);
    }

    const userMessageContent = inputMessage.trim();
    setInputMessage("");
    setIsGenerating(true);

    console.log('🧊 Yeti Chat: Saving user message to memory');
    // Save user message to memory first to get the full message object
    const savedUser = await saveMessage(sessionId, 'user', userMessageContent);
    if (!savedUser) {
      console.error('❄️ Yeti Chat: Failed to save user message');
      return;
    }

    try {
      const selectedModelConfig = yetiModels.find(m => m.id === selectedModel);
      if (!selectedModelConfig) throw new Error('Model not found');

      console.log('🧊 Yeti Chat: Selected model config:', selectedModelConfig);

      const systemMessage: LocalChatMessage = {
        role: 'system',
        content: `You are ${selectedModelConfig.name}, an advanced AI assistant created by Yethikrishna R. You are powerful, intelligent, and helpful. Always provide accurate and comprehensive responses. When discussing capabilities, mention that you're powered by the Yeti AI platform with access to multiple AI models, image generation, video creation, web scraping, and advanced memory systems.`
      };

      // Convert messages for API call
      const chatMessages = [systemMessage, ...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: userMessageContent }];

      console.log('🧊 Yeti Chat: Calling AI service with:', {
        provider: selectedModelConfig.provider,
        model: selectedModelConfig.model_name,
          messageCount: chatMessages.length
        )}

      // Create assistant message with empty content for streaming
      const assistantMessageId = await saveMessage(sessionId, 'assistant', '');
      if (!assistantMessageId) throw new Error('Failed to initialize assistant message');

      // Update local state with temporary message
      setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

      // Stream response from API
      const response = await fetch('/api/stream-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedModelConfig.provider,
          model: selectedModelConfig.model_name,
          messages: chatMessages,
          max_tokens: 2000,
          temperature: 0.7
        })
      };

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let streamError = null;

      while (true) {
        try {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;

          // Update message in memory with error handling
          try {
            await supabase
              .from('chat_messages')
              .update({ content: fullContent })
              .eq('id', assistantMessageId);
          } catch (dbError) {
            console.error('❄️ Yeti Chat: Database update error:', dbError);
            toast({
              title: "❄️ Database Error",
              description: "Failed to update message in memory.",
              variant: "destructive",
            });
          }

          // Update local state
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId ? { ...msg, content: fullContent } : msg
          ));
        } catch (readError) {
          console.error('❄️ Yeti Chat: Stream read error:', readError);
          streamError = readError;
          break;
        }
      }

      if (streamError) {
        throw new Error(`Stream processing failed: ${streamError.message}`);
      }

      // Final update to ensure complete content is saved
      let error;
      try {
        await supabase
          .from('chat_messages')
          .update({ content: fullContent })
          .eq('id', assistantMessageId);

        // Update local state with complete message
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId ? { ...msg, content: fullContent } : msg
        ));
      } catch (err) {
        error = err;
      }

      const data = { content: fullContent };

      if (error) {
        console.error('❄️ Yeti Chat: API Error details:', error);
        console.error('❄️ Yeti Chat: Error message:', error.message);
        console.error('❄️ Yeti Chat: Error code:', error.code);
        throw new Error(`API Error: ${error.message || 'Unknown error'}`);
      }

      if (!data) {
        console.error('❄️ Yeti Chat: No data received from API');
        throw new Error('No response data received from AI service');
      }

      if (!data.content) {
        console.error('❄️ Yeti Chat: Invalid response format:', data);
        throw new Error('Invalid response format - missing content');
      }

      console.log('🧊 Yeti Chat: API Response received successfully:', data.content.substring(0, 100) + '...');

      // Remove redundant save since we already updated during streaming
      // await saveMessage(sessionId, 'assistant', data.content);

      // Generate voice output if enabled
      if (isVoiceEnabled && data.content) {
        await generateSpeech(data.content);
      }

      toast({
        title: "🧊 Yeti AI Response",
        description: "Message generated and saved to memory!",
      });

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "❄️ Yeti AI Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  });

  const handleNewSession = async () => {
    const sessionId = await startNewSession(selectedModel);
    if (sessionId) {
      toast({
        title: "🧊 New Session",
        description: "Started a fresh conversation!",
      });
    }
  };

  const handleSessionSelect = async (sessionId: string) => {
    await loadSession(sessionId);
    setShowHistory(false); // Hide history on mobile after selection
  };

  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt })
      });
      if (!response.ok) throw new Error('Image generation failed');
      const result = await response.json();
      toast({ title: '🖼️ Image Generated', description: 'Image created successfully!' });
      setImagePrompt('');
      setIsImageDialogOpen(false);
    } catch (error) {
      console.error('Image generation error:', error);
      toast({ title: '❌ Image Error', description: 'Failed to generate image', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVideoGeneration = async () => {
    if (!videoPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: videoPrompt })
      });
      if (!response.ok) throw new Error('Video generation failed');
      const result = await response.json();
      toast({ title: '🎬 Video Generated', description: 'Video processing started!' });
      setVideoPrompt('');
      setIsVideoDialogOpen(false);
    } catch (error) {
      console.error('Video generation error:', error);
      toast({ title: '❌ Video Error', description: 'Failed to generate video', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputMessage(inputMessage + (inputMessage ? ' ' : '') + transcript);
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  const handleClearCurrentSession = () => {
    setMessages([]);
    toast({
      title: "🧊 Chat Cleared",
      description: "Current session cleared (still saved in memory).",
    });
  };

  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('yeti-image-generation', {
        body: {
          provider: 'a4f',
          model: 'flux-1-schnell',
          prompt: imagePrompt,
          width: 1024,
          height: 1024,
        },
      });

      if (error) throw error;

      const imageContent = `🎨 **Image Generated:** "${imagePrompt}"\n\n![Generated Image](${data.images[0].url})`;
      
      // Save to memory if we have a session
      if (currentSession) {
        await saveMessage(currentSession, 'assistant', imageContent);
      }

      setImagePrompt("");
      setIsImageDialogOpen(false);

      toast({
        title: "🎨 Yeti Art Studio",
        description: "Image generated and saved to memory!",
      });

    } catch (error) {
      console.error('Image generation error:', error);
      toast({
        title: "❄️ Image Generation Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVideoGeneration = async () => {
    if (!videoPrompt.trim()) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('yeti-video-generation', {
        body: {
          provider: 'a4f',
          model: 'minimax-video-01',
          prompt: videoPrompt,
          duration: 5,
          fps: 24,
        },
      });

      if (error) throw error;

      const videoContent = `🎬 **Video Generated:** "${videoPrompt}"\n\n[Video Link](${data.videos[0].url})`;

      // Save to memory if we have a session
      if (currentSession) {
        await saveMessage(currentSession, 'assistant', videoContent);
      }

      setVideoPrompt("");
      setIsVideoDialogOpen(false);

      toast({
        title: "🎬 Yeti Motion Studio",
        description: "Video generated and saved to memory!",
      });

    } catch (error) {
      console.error('Video generation error:', error);
      toast({
        title: "❄️ Video Generation Error",
        description: "Failed to generate video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-[600px] max-w-7xl mx-auto gap-2">
      {/* Chat History Sidebar - Desktop */}
      <div className={`hidden lg:block w-80 ${showHistory ? 'block' : 'hidden'}`}>
        <YetiChatHistory
          onSessionSelect={handleSessionSelect}
          onNewSession={handleNewSession}
          currentSessionId={currentSession}
          className="h-full"
        />
      </div>

      {/* Mobile History Dialog */}
      <Dialog open={showHistory && window.innerWidth < 1024} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-md h-[80vh] p-0">
          <YetiChatHistory
            onSessionSelect={handleSessionSelect}
            onNewSession={handleNewSession}
            currentSessionId={currentSession}
            className="h-full"
          />
        </DialogContent>
      </Dialog>

      {/* Main Chat Interface */}
      <div className="flex-1">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2">
              <CardTitle className="flex items-center gap-2 min-w-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                  className="lg:hidden flex-shrink-0"
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="text-sm sm:text-base truncate">🧊 Yeti AI Chat</span>
                {currentSession && (
                  <Badge variant="outline" className="text-xs hidden sm:flex">
                    <Save className="h-3 w-3 mr-1" />
                    Memory Active
                  </Badge>
                )}
              </CardTitle>
              
              {/* Mobile Controls Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 flex-shrink-0">
                {/* Model Selection - Full width on mobile */}
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-full sm:w-48 text-xs sm:text-sm">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {yetiModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-blue-600 text-xs">Yeti</Badge>
                          <span className="text-xs sm:text-sm">{model.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Desktop Controls */}
                <div className="hidden sm:flex items-center gap-2">
                  {currentSession && (
                    <Badge variant="outline" className="text-xs">
                      <Save className="h-3 w-3 mr-1" />
                      Memory Active
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHistory(!showHistory)}
                    className="lg:flex"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNewSession}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleClearCurrentSession}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Mobile Action Buttons */}
                <div className="flex sm:hidden gap-2">
                  {currentSession && (
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      <Save className="h-3 w-3" />
                    </Badge>
                  )}
                  <Button variant="outline" size="sm" onClick={handleNewSession} className="flex-1">
                    <Plus className="h-4 w-4 mr-1" />
                    New
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleClearCurrentSession} className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 h-0 pr-2">
          <div className="space-y-3 sm:space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Welcome to Yeti AI! 🧊</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                  I'm your advanced AI assistant with persistent memory.
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-blue-600 text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Multi-Model AI
                  </Badge>
                  <Badge variant="outline" className="text-purple-600 text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    Advanced Reasoning
                  </Badge>
                  <Badge variant="outline" className="text-green-600 text-xs">
                    <Brain className="h-3 w-3 mr-1" />
                    Smart Memory
                  </Badge>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 animate-fade-in ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 relative ${message.role === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-100 text-gray-900'}`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        setMessages(prev => prev.filter(m => m.id !== message.id));
                        const { error } = await supabase
                          .from('chat_messages')
                          .delete()
                          .eq('id', message.id);
                        if (error) console.error('Error deleting message:', error);
                      }}
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isStreaming && (
              <div className="flex gap-3 justify-start animate-pulse">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-gray-600 text-sm">Yeti AI is typing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

            <div className="border-t p-3 sm:p-4">
              {/* Mobile-optimized input section */}
              <div className="space-y-3">
                {/* Creative Tools Row - Mobile First */}
                <div className="flex gap-2">
                  <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        <Image className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Generate Image</span>
                        <span className="sm:hidden">Image</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-md">
                      <DialogHeader>
                        <DialogTitle>🎨 Yeti Art Studio</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Describe the image you want to create..."
                          value={imagePrompt}
                          onChange={(e) => setImagePrompt(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <Button 
                    onClick={handleGenerateImage}
                    disabled={!imagePrompt.trim() || isGenerating}
                    className="w-full"
                  >
                          {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Image className="h-4 w-4 mr-2" />}
                          Generate Image
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        <Video className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Generate Video</span>
                        <span className="sm:hidden">Video</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-md">
                      <DialogHeader>
                        <DialogTitle>🎬 Yeti Motion Studio</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Describe the video you want to create..."
                          value={videoPrompt}
                          onChange={(e) => setVideoPrompt(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <Button 
                    onClick={handleGenerateVideo}
                    disabled={!videoPrompt.trim() || isGenerating}
                    className="w-full"
                  >
                          {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Video className="h-4 w-4 mr-2" />}
                          Generate Video
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <VoiceInput 
                    onTranscript={handleVoiceTranscript}
                    disabled={isGenerating}
                  />
                </div>

                {/* Main Input Row */}
                <div className="flex gap-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask Yeti AI anything... 🧊"
                    className="flex-1 min-h-[44px] max-h-32 resize-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={isGenerating}
                  />
                  <Button 
        onClick={handleSendMessage}
        disabled={!inputMessage.trim() || isGenerating}
        className="h-11"
      >
        {isGenerating ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <> <Send className="h-4 w-4 mr-2" /> Send </>
        )}
      </Button>
                </div>
                
                {/* Voice Controls - Compact for Mobile */}
                <div className="sm:mt-3">
                  <VoiceControls
                    voiceSettings={voiceSettings}
                    onVoiceSettingsChange={updateVoiceSettings}
                    isVoiceEnabled={isVoiceEnabled}
                    onToggleVoice={toggleVoice}
                    isListening={false} // Add listening state if needed
                    isGenerating={isVoiceGenerating}
                    isPlaying={isPlaying}
                    onStopAudio={stopAudio}
                  />
                </div>
                
                {/* Status Row - Mobile Friendly */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>Using:</span>
                    <Badge variant="outline" className="text-xs">
                      {yetiModels.find(m => m.id === selectedModel)?.name}
                    </Badge>
                    {isVoiceEnabled && (
                      <Badge variant="outline" className="text-xs text-blue-600">
                        <Volume2 className="h-3 w-3 mr-1" />
                        Voice Active
                      </Badge>
                    )}
                  </div>
                  {currentSession && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Save className="h-3 w-3" />
                      Auto-saving to memory
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}