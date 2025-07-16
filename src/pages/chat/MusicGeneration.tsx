import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations, createSlideAnimation } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';
import { Play, Pause, Download, Volume2, RotateCcw } from 'lucide-react';

interface MusicGenerationProps {}

type MusicStyle = 'upbeat-pop' | 'soft-classical' | 'jazz-smooth' | 'rock-energetic' | 'ambient-chill' | 'folk-acoustic';
type InstrumentType = 'piano' | 'guitar' | 'drums' | 'violin' | 'synthesizer' | 'bass' | 'flute' | 'saxophone';
type MoodType = 'happy' | 'sad' | 'energetic' | 'calm' | 'mysterious' | 'romantic';
type DurationType = '30s' | '1min' | '2min' | '3min';

const musicStyles = [
  { id: 'upbeat-pop', label: 'Upbeat Pop', icon: '🎵', description: 'Catchy, energetic pop music' },
  { id: 'soft-classical', label: 'Soft Classical', icon: '🎼', description: 'Gentle, orchestral melodies' },
  { id: 'jazz-smooth', label: 'Smooth Jazz', icon: '🎷', description: 'Relaxing jazz with smooth rhythms' },
  { id: 'rock-energetic', label: 'Energetic Rock', icon: '🎸', description: 'Powerful rock with strong beats' },
  { id: 'ambient-chill', label: 'Ambient Chill', icon: '🌊', description: 'Atmospheric, relaxing soundscapes' },
  { id: 'folk-acoustic', label: 'Folk Acoustic', icon: '🪕', description: 'Warm, acoustic folk melodies' },
];

const instruments = [
  { id: 'piano', label: 'Piano', icon: '🎹' },
  { id: 'guitar', label: 'Guitar', icon: '🎸' },
  { id: 'drums', label: 'Drums', icon: '🥁' },
  { id: 'violin', label: 'Violin', icon: '🎻' },
  { id: 'synthesizer', label: 'Synthesizer', icon: '🎛️' },
  { id: 'bass', label: 'Bass', icon: '🎸' },
  { id: 'flute', label: 'Flute', icon: '🪈' },
  { id: 'saxophone', label: 'Saxophone', icon: '🎷' },
];

const moods = [
  { id: 'happy', label: 'Happy', icon: '😊', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'sad', label: 'Sad', icon: '😢', color: 'bg-blue-100 text-blue-800' },
  { id: 'energetic', label: 'Energetic', icon: '⚡', color: 'bg-orange-100 text-orange-800' },
  { id: 'calm', label: 'Calm', icon: '🧘', color: 'bg-green-100 text-green-800' },
  { id: 'mysterious', label: 'Mysterious', icon: '🔮', color: 'bg-purple-100 text-purple-800' },
  { id: 'romantic', label: 'Romantic', icon: '💕', color: 'bg-pink-100 text-pink-800' },
];

const durations = [
  { id: '30s', label: '30 seconds', description: 'Quick sample' },
  { id: '1min', label: '1 minute', description: 'Short piece' },
  { id: '2min', label: '2 minutes', description: 'Standard length' },
  { id: '3min', label: '3 minutes', description: 'Full composition' },
];

export const MusicGeneration: React.FC<MusicGenerationProps> = () => {
  const [selectedStyle, setSelectedStyle] = useState<MusicStyle>('upbeat-pop');
  const [selectedInstruments, setSelectedInstruments] = useState<InstrumentType[]>(['piano']);
  const [selectedMood, setSelectedMood] = useState<MoodType>('happy');
  const [selectedDuration, setSelectedDuration] = useState<DurationType>('1min');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMusic, setGeneratedMusic] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleInstrumentToggle = (instrument: InstrumentType) => {
    setSelectedInstruments(prev => 
      prev.includes(instrument)
        ? prev.filter(i => i !== instrument)
        : [...prev, instrument]
    );
  };

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    // Simulate music generation process
    setTimeout(() => {
      setIsGenerating(false);
      // Simulate generated audio URL (in real implementation, this would be from the API)
      setGeneratedMusic('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');
    }, 5000);
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !generatedMusic) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    if (!generatedMusic) return;
    
    const link = document.createElement('a');
    link.href = generatedMusic;
    link.download = `generated-music-${Date.now()}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegenerate = () => {
    setGeneratedMusic(null);
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
                🎵 Music Generation
              </h1>
              <p className="doubao-text-base text-doubao-text-secondary">
                Create original music compositions with AI. Describe your vision and customize the style, instruments, and mood.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Configuration Panel */}
              <div className="xl:col-span-3 space-y-6">
                {/* Description Input */}
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Music Description
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                        Describe your music *
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the music you want to create... e.g., 'A peaceful morning melody with gentle piano and soft strings, perfect for meditation'"
                        rows={4}
                        className="w-full doubao-input-base resize-none"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Music Style Selection */}
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Music Style
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {musicStyles.map((style) => (
                      <motion.button
                        key={style.id}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedStyle(style.id as MusicStyle)}
                        className={cn(
                          'p-4 rounded-lg border-2 text-left doubao-transition-colors',
                          selectedStyle === style.id
                            ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                            : 'border-doubao-border-light hover:border-doubao-border-medium'
                        )}
                      >
                        <div className="text-2xl mb-2">{style.icon}</div>
                        <div className="doubao-text-sm font-medium text-doubao-text-primary mb-1">
                          {style.label}
                        </div>
                        <div className="doubao-text-xs text-doubao-text-muted">
                          {style.description}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Instruments Selection */}
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Instruments
                  </h3>
                  <p className="doubao-text-sm text-doubao-text-muted mb-4">
                    Select one or more instruments for your composition
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    {instruments.map((instrument) => (
                      <motion.button
                        key={instrument.id}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleInstrumentToggle(instrument.id as InstrumentType)}
                        className={cn(
                          'p-3 rounded-lg border-2 text-center doubao-transition-colors',
                          selectedInstruments.includes(instrument.id as InstrumentType)
                            ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                            : 'border-doubao-border-light hover:border-doubao-border-medium'
                        )}
                      >
                        <div className="text-xl mb-1">{instrument.icon}</div>
                        <div className="doubao-text-xs font-medium text-doubao-text-primary">
                          {instrument.label}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Mood and Duration */}
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                  className="doubao-card-base p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mood */}
                    <div>
                      <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                        Mood
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {moods.map((mood) => (
                          <motion.button
                            key={mood.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedMood(mood.id as MoodType)}
                            className={cn(
                              'p-3 rounded-lg border text-center doubao-transition-colors',
                              selectedMood === mood.id
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
                            <div className="text-lg mb-1">{mood.icon}</div>
                            <div className="doubao-text-sm font-medium text-doubao-text-primary">
                              {mood.label}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                        Duration
                      </h3>
                      <div className="space-y-2">
                        {durations.map((dur) => (
                          <motion.button
                            key={dur.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedDuration(dur.id as DurationType)}
                            className={cn(
                              'w-full p-3 rounded-lg border text-left doubao-transition-colors',
                              selectedDuration === dur.id
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
                            <div className="doubao-text-sm font-medium text-doubao-text-primary">
                              {dur.label}
                            </div>
                            <div className="doubao-text-xs text-doubao-text-muted">
                              {dur.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
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
                    disabled={!description.trim() || isGenerating}
                    className={cn(
                      'w-full doubao-button-primary py-4 text-lg',
                      (!description.trim() || isGenerating) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating Music...
                      </div>
                    ) : (
                      '🎵 Generate Music'
                    )}
                  </motion.button>
                </motion.div>

                {/* Generated Music Player */}
                {generatedMusic && (
                  <motion.div
                    variants={createSlideAnimation('up')}
                    initial="hidden"
                    animate="visible"
                    className="doubao-card-base p-6"
                  >
                    <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                      Generated Music
                    </h3>
                    
                    <div className="bg-doubao-bg-secondary rounded-lg p-4">
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
                            Generated Composition
                          </div>
                          <div className="doubao-text-xs text-doubao-text-muted">
                            {selectedStyle.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {selectedDuration}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
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
                          
                          <motion.button
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={handleDownload}
                            className="p-2 rounded-lg border border-doubao-border-light hover:border-doubao-border-medium doubao-transition-colors"
                            title="Download"
                          >
                            <Download size={16} />
                          </motion.button>
                        </div>
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
                        src={generatedMusic}
                        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                      />
                    </div>
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
                    Composition Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Style</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {musicStyles.find(s => s.id === selectedStyle)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Instruments</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedInstruments.map((inst) => (
                          <span
                            key={inst}
                            className="px-2 py-1 bg-doubao-primary-blue/10 text-doubao-primary-blue rounded text-xs"
                          >
                            {instruments.find(i => i.id === inst)?.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Mood</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {moods.find(m => m.id === selectedMood)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Duration</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {durations.find(d => d.id === selectedDuration)?.label}
                      </div>
                    </div>
                    
                    {description && (
                      <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                        <div className="doubao-text-sm text-doubao-text-muted mb-2">Description</div>
                        <div className="doubao-text-sm text-doubao-text-primary">
                          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
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

export default MusicGeneration;