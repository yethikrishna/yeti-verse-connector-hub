import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations, createSlideAnimation } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';
import { Play, Pause, Download, Volume2, RotateCcw, Mic, Users, Clock, FileText } from 'lucide-react';

interface AIPodcastProps {}

type PodcastFormat = 'interview' | 'solo-monologue' | 'panel-discussion' | 'news-roundup' | 'storytelling' | 'educational';
type PodcastTone = 'professional' | 'casual' | 'humorous' | 'serious' | 'conversational' | 'energetic';
type PodcastLength = '5min' | '10min' | '15min' | '30min' | '45min' | '60min';
type HostVoice = 'male-professional' | 'female-professional' | 'male-casual' | 'female-casual' | 'male-energetic' | 'female-energetic';

const podcastFormats = [
  { id: 'interview', label: 'Interview', icon: '🎤', description: 'Q&A style conversation with expert insights' },
  { id: 'solo-monologue', label: 'Solo Monologue', icon: '🗣️', description: 'Single host presenting information' },
  { id: 'panel-discussion', label: 'Panel Discussion', icon: '👥', description: 'Multiple perspectives on a topic' },
  { id: 'news-roundup', label: 'News Roundup', icon: '📰', description: 'Current events and news analysis' },
  { id: 'storytelling', label: 'Storytelling', icon: '📚', description: 'Narrative-driven content' },
  { id: 'educational', label: 'Educational', icon: '🎓', description: 'Learning-focused content' },
];

const podcastTones = [
  { id: 'professional', label: 'Professional', icon: '💼', color: 'bg-blue-100 text-blue-800' },
  { id: 'casual', label: 'Casual', icon: '😊', color: 'bg-green-100 text-green-800' },
  { id: 'humorous', label: 'Humorous', icon: '😄', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'serious', label: 'Serious', icon: '🎯', color: 'bg-gray-100 text-gray-800' },
  { id: 'conversational', label: 'Conversational', icon: '💬', color: 'bg-purple-100 text-purple-800' },
  { id: 'energetic', label: 'Energetic', icon: '⚡', color: 'bg-orange-100 text-orange-800' },
];

const podcastLengths = [
  { id: '5min', label: '5 minutes', description: 'Quick update or summary' },
  { id: '10min', label: '10 minutes', description: 'Brief discussion' },
  { id: '15min', label: '15 minutes', description: 'Standard segment' },
  { id: '30min', label: '30 minutes', description: 'Full episode' },
  { id: '45min', label: '45 minutes', description: 'Extended discussion' },
  { id: '60min', label: '60 minutes', description: 'Long-form content' },
];

const hostVoices = [
  { id: 'male-professional', label: 'Male Professional', description: 'Deep, authoritative voice' },
  { id: 'female-professional', label: 'Female Professional', description: 'Clear, confident voice' },
  { id: 'male-casual', label: 'Male Casual', description: 'Friendly, approachable voice' },
  { id: 'female-casual', label: 'Female Casual', description: 'Warm, conversational voice' },
  { id: 'male-energetic', label: 'Male Energetic', description: 'Dynamic, enthusiastic voice' },
  { id: 'female-energetic', label: 'Female Energetic', description: 'Vibrant, engaging voice' },
];

export const AIPodcast: React.FC<AIPodcastProps> = () => {
  const [selectedFormat, setSelectedFormat] = useState<PodcastFormat>('interview');
  const [selectedTone, setSelectedTone] = useState<PodcastTone>('conversational');
  const [selectedLength, setSelectedLength] = useState<PodcastLength>('15min');
  const [selectedHostVoice, setSelectedHostVoice] = useState<HostVoice>('female-professional');
  const [topic, setTopic] = useState('');
  const [keyPoints, setKeyPoints] = useState<string[]>(['']);
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showScript, setShowScript] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleAddKeyPoint = () => {
    setKeyPoints([...keyPoints, '']);
  };

  const handleRemoveKeyPoint = (index: number) => {
    if (keyPoints.length > 1) {
      setKeyPoints(keyPoints.filter((_, i) => i !== index));
    }
  };

  const handleKeyPointChange = (index: number, value: string) => {
    const newKeyPoints = [...keyPoints];
    newKeyPoints[index] = value;
    setKeyPoints(newKeyPoints);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setGeneratedScript(null);
    setGeneratedAudio(null);
    
    // Simulate podcast generation process
    setTimeout(() => {
      // Generate mock script
      const mockScript = `
# ${topic} - Podcast Script

## Introduction
Welcome to today's ${selectedFormat.replace('-', ' ')} on ${topic}. I'm your host, and we're going to explore this fascinating topic in a ${selectedTone} manner.

## Main Content
${keyPoints.filter(point => point.trim()).map((point, index) => `
### Key Point ${index + 1}: ${point}
[Detailed discussion about ${point}. This would include relevant examples, statistics, and insights that make this topic engaging for our ${targetAudience || 'audience'}.]
`).join('')}

## Conclusion
That wraps up our discussion on ${topic}. Thank you for listening, and we'll see you next time!

---
*Generated for ${selectedLength} ${selectedFormat} in ${selectedTone} tone*
      `;
      
      setGeneratedScript(mockScript);
      
      // Simulate audio generation (in real implementation, this would be from TTS API)
      setTimeout(() => {
        setIsGenerating(false);
        setGeneratedAudio('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');
      }, 2000);
    }, 3000);
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !generatedAudio) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    if (!generatedAudio) return;
    
    const link = document.createElement('a');
    link.href = generatedAudio;
    link.download = `podcast-${topic.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadScript = () => {
    if (!generatedScript) return;
    
    const blob = new Blob([generatedScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `podcast-script-${topic.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = () => {
    setGeneratedScript(null);
    setGeneratedAudio(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    handleGenerate();
  };

  return (
    <DoubaoMainLayout>
      <div className="flex flex-col h-full">
        <DoubaoHeader 
          showSidebarToggle={true}
          hasNotifications={false}
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <motion.div
              variants={createSlideAnimation('up')}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <h1 className="doubao-text-2xl text-doubao-text-primary mb-2">
                🎙️ AI Podcast Generation
              </h1>
              <p className="doubao-text-base text-doubao-text-secondary">
                Create professional podcast scripts and generate simulated host voices. Perfect for content creators and educators.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Configuration Panel */}
              <div className="xl:col-span-3 space-y-6">
                {/* Topic and Key Points */}
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Podcast Content
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                        Podcast Topic *
                      </label>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., The Future of Artificial Intelligence in Healthcare"
                        className="w-full doubao-input-base"
                      />
                    </div>
                    
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                        Key Points to Cover
                      </label>
                      <div className="space-y-2">
                        {keyPoints.map((point, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={point}
                              onChange={(e) => handleKeyPointChange(index, e.target.value)}
                              placeholder={`Key point ${index + 1}...`}
                              className="flex-1 doubao-input-base"
                            />
                            {keyPoints.length > 1 && (
                              <button
                                onClick={() => handleRemoveKeyPoint(index)}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg doubao-transition-colors"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={handleAddKeyPoint}
                          className="text-doubao-primary-blue hover:text-doubao-primary-blue/80 doubao-text-sm font-medium doubao-transition-colors"
                        >
                          + Add Key Point
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                        Target Audience (Optional)
                      </label>
                      <input
                        type="text"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder="e.g., Healthcare professionals, Tech enthusiasts, General audience"
                        className="w-full doubao-input-base"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Podcast Format */}
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Podcast Format
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {podcastFormats.map((format) => (
                      <motion.button
                        key={format.id}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedFormat(format.id as PodcastFormat)}
                        className={cn(
                          'p-4 rounded-lg border-2 text-left doubao-transition-colors',
                          selectedFormat === format.id
                            ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                            : 'border-doubao-border-light hover:border-doubao-border-medium'
                        )}
                      >
                        <div className="text-2xl mb-2">{format.icon}</div>
                        <div className="doubao-text-sm font-medium text-doubao-text-primary mb-1">
                          {format.label}
                        </div>
                        <div className="doubao-text-xs text-doubao-text-muted">
                          {format.description}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Tone and Length */}
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className="doubao-card-base p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tone */}
                    <div>
                      <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                        Tone & Style
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {podcastTones.map((tone) => (
                          <motion.button
                            key={tone.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedTone(tone.id as PodcastTone)}
                            className={cn(
                              'p-3 rounded-lg border text-center doubao-transition-colors',
                              selectedTone === tone.id
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
                            <div className="text-lg mb-1">{tone.icon}</div>
                            <div className="doubao-text-sm font-medium text-doubao-text-primary">
                              {tone.label}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Length */}
                    <div>
                      <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                        Episode Length
                      </h3>
                      <div className="space-y-2">
                        {podcastLengths.map((length) => (
                          <motion.button
                            key={length.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedLength(length.id as PodcastLength)}
                            className={cn(
                              'w-full p-3 rounded-lg border text-left doubao-transition-colors',
                              selectedLength === length.id
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
                            <div className="doubao-text-sm font-medium text-doubao-text-primary">
                              {length.label}
                            </div>
                            <div className="doubao-text-xs text-doubao-text-muted">
                              {length.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Host Voice Selection */}
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Host Voice
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {hostVoices.map((voice) => (
                      <motion.button
                        key={voice.id}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedHostVoice(voice.id as HostVoice)}
                        className={cn(
                          'p-4 rounded-lg border text-left doubao-transition-colors',
                          selectedHostVoice === voice.id
                            ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                            : 'border-doubao-border-light hover:border-doubao-border-medium'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Mic size={16} className="text-doubao-primary-blue" />
                          <div className="doubao-text-sm font-medium text-doubao-text-primary">
                            {voice.label}
                          </div>
                        </div>
                        <div className="doubao-text-xs text-doubao-text-muted">
                          {voice.description}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Generate Button */}
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    variants={doubaoAnimations.buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleGenerate}
                    disabled={!topic.trim() || isGenerating}
                    className={cn(
                      'w-full doubao-button-primary py-4 text-lg',
                      (!topic.trim() || isGenerating) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating Podcast...
                      </div>
                    ) : (
                      '🎙️ Generate Podcast'
                    )}
                  </motion.button>
                </motion.div>

                {/* Generated Content */}
                {(generatedScript || generatedAudio) && (
                  <motion.div
                    variants={createSlideAnimation('up')}
                    initial="hidden"
                    animate="visible"
                    className="doubao-card-base p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="doubao-text-lg font-semibold text-doubao-text-primary">
                        Generated Podcast
                      </h3>
                      <div className="flex gap-2">
                        {generatedScript && (
                          <motion.button
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setShowScript(!showScript)}
                            className={cn(
                              'px-3 py-2 rounded-lg border doubao-transition-colors flex items-center gap-2',
                              showScript 
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10 text-doubao-primary-blue'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
                            <FileText size={16} />
                            Script
                          </motion.button>
                        )}
                        <motion.button
                          variants={doubaoAnimations.buttonVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                          onClick={handleRegenerate}
                          className="p-2 rounded-lg border border-doubao-border-light hover:border-doubao-border-medium doubao-transition-colors"
                          title="Regenerate"
                        >
                          <RotateCcw size={16} />
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Audio Player */}
                    {generatedAudio && (
                      <div className="bg-doubao-bg-secondary rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-4 mb-4">
                          <motion.button
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={handlePlayPause}
                            className="w-12 h-12 rounded-full bg-doubao-primary-blue text-white flex items-center justify-center"
                          >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                          </motion.button>
                          
                          <div className="flex-1">
                            <div className="doubao-text-sm font-medium text-doubao-text-primary mb-1">
                              {topic}
                            </div>
                            <div className="doubao-text-xs text-doubao-text-muted">
                              {selectedFormat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {selectedLength} • {selectedHostVoice.replace('-', ' ')}
                            </div>
                          </div>
                          
                          <motion.button
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={handleDownload}
                            className="p-2 rounded-lg border border-doubao-border-light hover:border-doubao-border-medium doubao-transition-colors"
                            title="Download Audio"
                          >
                            <Download size={16} />
                          </motion.button>
                        </div>
                        
                        {/* Audio Progress Bar */}
                        <div className="w-full bg-doubao-border-light rounded-full h-2">
                          <div 
                            className="bg-doubao-primary-blue h-2 rounded-full transition-all duration-300"
                            style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                          />
                        </div>
                        
                        <audio
                          ref={audioRef}
                          src={generatedAudio}
                          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                          onEnded={() => setIsPlaying(false)}
                          className="hidden"
                        />
                      </div>
                    )}

                    {/* Script Display */}
                    {generatedScript && showScript && (
                      <div className="bg-doubao-bg-secondary rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="doubao-text-base font-semibold text-doubao-text-primary">
                            Podcast Script
                          </h4>
                          <motion.button
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={handleDownloadScript}
                            className="px-3 py-1 rounded-lg border border-doubao-border-light hover:border-doubao-border-medium doubao-transition-colors doubao-text-sm"
                          >
                            Download Script
                          </motion.button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          <pre className="doubao-text-sm text-doubao-text-primary whitespace-pre-wrap font-mono">
                            {generatedScript}
                          </pre>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Settings Preview Panel */}
              <div className="xl:col-span-1">
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.6 }}
                  className="doubao-card-base p-6 sticky top-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Podcast Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Format</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {podcastFormats.find(f => f.id === selectedFormat)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Tone</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {podcastTones.find(t => t.id === selectedTone)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Length</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {podcastLengths.find(l => l.id === selectedLength)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Host Voice</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {hostVoices.find(v => v.id === selectedHostVoice)?.label}
                      </div>
                    </div>
                    
                    {keyPoints.filter(p => p.trim()).length > 0 && (
                      <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                        <div className="doubao-text-sm text-doubao-text-muted mb-2">Key Points</div>
                        <div className="space-y-1">
                          {keyPoints.filter(p => p.trim()).map((point, index) => (
                            <div key={index} className="doubao-text-sm text-doubao-text-primary">
                              • {point.length > 30 ? `${point.substring(0, 30)}...` : point}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {topic && (
                      <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                        <div className="doubao-text-sm text-doubao-text-muted mb-2">Topic</div>
                        <div className="doubao-text-sm text-doubao-text-primary">
                          {topic.length > 50 ? `${topic.substring(0, 50)}...` : topic}
                        </div>
                      </div>
                    )}
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

export default AIPodcast;