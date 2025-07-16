import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';

interface VoiceCallProps {}

type CallState = 'idle' | 'connecting' | 'active' | 'muted' | 'ended';
type VoiceMode = 'conversation' | 'command' | 'dictation';

const voiceModes = [
  { 
    id: 'conversation', 
    label: 'Conversation', 
    icon: '💬', 
    description: 'Natural back-and-forth conversation with AI' 
  },
  { 
    id: 'command', 
    label: 'Voice Commands', 
    icon: '🎯', 
    description: 'Execute specific commands using voice' 
  },
  { 
    id: 'dictation', 
    label: 'Dictation', 
    icon: '📝', 
    description: 'Convert speech to text for writing' 
  },
];

const voiceCommands = [
  'Start new conversation',
  'Summarize last message',
  'Translate to English',
  'Set reminder',
  'Search information',
  'Generate image',
  'Write email',
  'Calculate math',
];

export const VoiceCall: React.FC<VoiceCallProps> = () => {
  const [callState, setCallState] = useState<CallState>('idle');
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('conversation');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    audioUrl?: string;
  }>>([]);
  const [volume, setVolume] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleUserSpeech(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    synthesisRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startCall = async () => {
    setCallState('connecting');
    
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio context for volume visualization
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      setCallState('active');
      startListening();
      startVolumeVisualization();
    } catch (error) {
      console.error('Error starting call:', error);
      setCallState('idle');
    }
  };

  const endCall = () => {
    setCallState('ended');
    stopListening();
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setTimeout(() => setCallState('idle'), 2000);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      setIsRecording(false);
      recognitionRef.current.stop();
    }
  };

  const toggleMute = () => {
    if (callState === 'active') {
      setCallState('muted');
      stopListening();
    } else if (callState === 'muted') {
      setCallState('active');
      startListening();
    }
  };

  const handleUserSpeech = (text: string) => {
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: text,
      timestamp: new Date(),
    };
    
    setConversation(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(text, voiceMode);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setConversation(prev => [...prev, aiMessage]);
      speakText(aiResponse);
    }, 1000);
    
    setTranscript('');
  };

  const generateAIResponse = (userText: string, mode: VoiceMode): string => {
    switch (mode) {
      case 'command':
        if (userText.toLowerCase().includes('time')) {
          return `The current time is ${new Date().toLocaleTimeString()}`;
        }
        if (userText.toLowerCase().includes('weather')) {
          return 'I would need access to weather services to provide current weather information.';
        }
        if (userText.toLowerCase().includes('reminder')) {
          return 'I\'ve noted your reminder request. What would you like to be reminded about?';
        }
        return 'I understand your command. How can I help you with that?';
      
      case 'dictation':
        return `I've transcribed: "${userText}". Would you like me to format or edit this text?`;
      
      default:
        return `I heard you say: "${userText}". That's interesting! Tell me more about that.`;
    }
  };

  const speakText = (text: string) => {
    if (synthesisRef.current) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      synthesisRef.current.speak(utterance);
    }
  };

  const startVolumeVisualization = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateVolume = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(average / 255);
      }
      animationFrameRef.current = requestAnimationFrame(updateVolume);
    };
    
    updateVolume();
  };

  useEffect(() => {
    if (callState === 'active') {
      const timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [callState]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <DoubaoMainLayout>
      <div className="flex flex-col h-full">
        <DoubaoHeader 
          showSidebarToggle={true}
          hasNotifications={false}
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <motion.div
              variants={doubaoAnimations.fadeInUp}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <h1 className="doubao-text-2xl text-doubao-text-primary mb-2">
                🎙️ Voice Call
              </h1>
              <p className="doubao-text-base text-doubao-text-secondary">
                Have natural voice conversations with AI. Speak naturally and get intelligent responses.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Call Interface */}
              <div className="lg:col-span-2 space-y-6">
                {/* Voice Mode Selection */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Voice Mode
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {voiceModes.map((mode) => (
                      <motion.button
                        key={mode.id}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setVoiceMode(mode.id as VoiceMode)}
                        disabled={callState === 'active' || callState === 'muted'}
                        className={cn(
                          'p-4 rounded-lg border-2 text-left doubao-transition-colors',
                          voiceMode === mode.id
                            ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                            : 'border-doubao-border-light hover:border-doubao-border-medium',
                          (callState === 'active' || callState === 'muted') && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <div className="text-2xl mb-2">{mode.icon}</div>
                        <div className="doubao-text-sm font-medium text-doubao-text-primary mb-1">
                          {mode.label}
                        </div>
                        <div className="doubao-text-xs text-doubao-text-muted">
                          {mode.description}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Call Interface */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="doubao-card-base p-8"
                >
                  <div className="text-center">
                    {/* Call Status */}
                    <div className="mb-6">
                      <div className={cn(
                        'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                        callState === 'idle' && 'bg-gray-100 text-gray-600',
                        callState === 'connecting' && 'bg-yellow-100 text-yellow-600',
                        callState === 'active' && 'bg-green-100 text-green-600',
                        callState === 'muted' && 'bg-orange-100 text-orange-600',
                        callState === 'ended' && 'bg-red-100 text-red-600'
                      )}>
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          callState === 'idle' && 'bg-gray-400',
                          callState === 'connecting' && 'bg-yellow-400 animate-pulse',
                          callState === 'active' && 'bg-green-400 animate-pulse',
                          callState === 'muted' && 'bg-orange-400',
                          callState === 'ended' && 'bg-red-400'
                        )} />
                        {callState === 'idle' && 'Ready to start'}
                        {callState === 'connecting' && 'Connecting...'}
                        {callState === 'active' && `Active - ${formatDuration(duration)}`}
                        {callState === 'muted' && `Muted - ${formatDuration(duration)}`}
                        {callState === 'ended' && 'Call ended'}
                      </div>
                    </div>

                    {/* Voice Visualization */}
                    <div className="mb-8">
                      <div className="relative w-32 h-32 mx-auto">
                        <motion.div
                          animate={{
                            scale: callState === 'active' && (isListening || isSpeaking) 
                              ? 1 + (volume * 0.3) 
                              : 1,
                          }}
                          transition={{ duration: 0.1 }}
                          className={cn(
                            'w-full h-full rounded-full flex items-center justify-center text-4xl',
                            callState === 'idle' && 'bg-gray-100',
                            callState === 'connecting' && 'bg-yellow-100 animate-pulse',
                            callState === 'active' && 'bg-green-100',
                            callState === 'muted' && 'bg-orange-100',
                            callState === 'ended' && 'bg-red-100'
                          )}
                        >
                          {callState === 'idle' && '🎙️'}
                          {callState === 'connecting' && '📞'}
                          {callState === 'active' && (isListening ? '👂' : isSpeaking ? '🗣️' : '🎙️')}
                          {callState === 'muted' && '🔇'}
                          {callState === 'ended' && '📴'}
                        </motion.div>
                        
                        {/* Volume rings */}
                        {(callState === 'active' || callState === 'muted') && (
                          <>
                            <motion.div
                              animate={{
                                scale: 1 + (volume * 0.5),
                                opacity: volume * 0.6,
                              }}
                              className="absolute inset-0 rounded-full border-2 border-doubao-primary-blue"
                            />
                            <motion.div
                              animate={{
                                scale: 1 + (volume * 0.7),
                                opacity: volume * 0.4,
                              }}
                              className="absolute inset-0 rounded-full border border-doubao-primary-blue"
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex justify-center gap-4">
                      {callState === 'idle' && (
                        <motion.button
                          variants={doubaoAnimations.buttonVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                          onClick={startCall}
                          className="doubao-button-primary px-8 py-3 text-lg"
                        >
                          🎙️ Start Call
                        </motion.button>
                      )}
                      
                      {(callState === 'active' || callState === 'muted') && (
                        <>
                          <motion.button
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={toggleMute}
                            className={cn(
                              'px-6 py-3 rounded-lg font-medium doubao-transition-colors',
                              callState === 'muted'
                                ? 'bg-orange-500 text-white hover:bg-orange-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            )}
                          >
                            {callState === 'muted' ? '🔇 Unmute' : '🔇 Mute'}
                          </motion.button>
                          
                          <motion.button
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={endCall}
                            className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 doubao-transition-colors"
                          >
                            📴 End Call
                          </motion.button>
                        </>
                      )}
                    </div>

                    {/* Live Transcript */}
                    {transcript && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-doubao-bg-secondary rounded-lg"
                      >
                        <div className="doubao-text-sm text-doubao-text-muted mb-1">
                          Live Transcript:
                        </div>
                        <div className="doubao-text-base text-doubao-text-primary">
                          {transcript}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Conversation History */}
                {conversation.length > 0 && (
                  <motion.div
                    variants={doubaoAnimations.fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                    className="doubao-card-base p-6"
                  >
                    <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                      Conversation History
                    </h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {conversation.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            'p-4 rounded-lg',
                            message.type === 'user'
                              ? 'bg-doubao-secondary-blue/10 ml-8'
                              : 'bg-doubao-bg-secondary mr-8'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">
                              {message.type === 'user' ? '👤' : '🤖'}
                            </div>
                            <div className="flex-1">
                              <div className="doubao-text-base text-doubao-text-primary">
                                {message.content}
                              </div>
                              <div className="doubao-text-xs text-doubao-text-muted mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Side Panel */}
              <div className="lg:col-span-1">
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                  className="doubao-card-base p-6 sticky top-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Voice Commands
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">
                        Current Mode
                      </div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {voiceModes.find(m => m.id === voiceMode)?.label}
                      </div>
                    </div>
                    
                    {voiceMode === 'command' && (
                      <div>
                        <div className="doubao-text-sm font-medium text-doubao-text-primary mb-3">
                          Try saying:
                        </div>
                        <div className="space-y-2">
                          {voiceCommands.map((command, index) => (
                            <div
                              key={index}
                              className="p-2 bg-doubao-bg-secondary rounded text-sm text-doubao-text-secondary"
                            >
                              "{command}"
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-3 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">
                        Tips
                      </div>
                      <ul className="doubao-text-sm text-doubao-text-secondary space-y-1">
                        <li>• Speak clearly and naturally</li>
                        <li>• Wait for AI response before speaking</li>
                        <li>• Use "Hey AI" to get attention</li>
                        <li>• Say "Stop" to end conversation</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DoubaoMainLayout>
  );
};

export default VoiceCall;