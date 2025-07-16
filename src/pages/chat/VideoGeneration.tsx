import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations, createSlideAnimation } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';
import { Play, Pause, Download, Volume2, VolumeX, RotateCcw, Maximize2 } from 'lucide-react';

interface VideoGenerationProps {}

type VideoStyle = 'realistic' | 'animated' | 'cinematic' | 'documentary' | 'artistic' | 'commercial';
type VideoLength = '15s' | '30s' | '1min' | '2min' | '5min';
type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3';
type VideoQuality = '720p' | '1080p' | '4k';

const videoStyles = [
  { id: 'realistic', label: 'Realistic', icon: '🎬', description: 'Photorealistic video content' },
  { id: 'animated', label: 'Animated', icon: '🎨', description: 'Cartoon and animated style' },
  { id: 'cinematic', label: 'Cinematic', icon: '🎭', description: 'Movie-like dramatic scenes' },
  { id: 'documentary', label: 'Documentary', icon: '📹', description: 'Educational and informative' },
  { id: 'artistic', label: 'Artistic', icon: '🖼️', description: 'Creative and abstract visuals' },
  { id: 'commercial', label: 'Commercial', icon: '📺', description: 'Advertisement style content' },
];

const videoLengths = [
  { id: '15s', label: '15 seconds', description: 'Quick clip' },
  { id: '30s', label: '30 seconds', description: 'Short video' },
  { id: '1min', label: '1 minute', description: 'Standard length' },
  { id: '2min', label: '2 minutes', description: 'Extended content' },
  { id: '5min', label: '5 minutes', description: 'Long form video' },
];

const aspectRatios = [
  { id: '16:9', label: '16:9', description: 'Landscape (YouTube, TV)' },
  { id: '9:16', label: '9:16', description: 'Portrait (TikTok, Stories)' },
  { id: '1:1', label: '1:1', description: 'Square (Instagram)' },
  { id: '4:3', label: '4:3', description: 'Classic TV format' },
];

const videoQualities = [
  { id: '720p', label: '720p HD', description: 'Good quality, smaller file' },
  { id: '1080p', label: '1080p Full HD', description: 'High quality, balanced' },
  { id: '4k', label: '4K Ultra HD', description: 'Highest quality, large file' },
];

const backgroundMusicOptions = [
  { id: 'none', label: 'No Music', description: 'Silent video' },
  { id: 'upbeat', label: 'Upbeat', description: 'Energetic background music' },
  { id: 'calm', label: 'Calm', description: 'Peaceful ambient music' },
  { id: 'dramatic', label: 'Dramatic', description: 'Cinematic orchestral music' },
  { id: 'corporate', label: 'Corporate', description: 'Professional background music' },
  { id: 'custom', label: 'Custom Upload', description: 'Upload your own music' },
];

export const VideoGeneration: React.FC<VideoGenerationProps> = () => {
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle>('realistic');
  const [selectedLength, setSelectedLength] = useState<VideoLength>('30s');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>('16:9');
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>('1080p');
  const [selectedMusic, setSelectedMusic] = useState<string>('upbeat');
  const [description, setDescription] = useState('');
  const [subtitles, setSubtitles] = useState('');
  const [enableSubtitles, setEnableSubtitles] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate video generation progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsGenerating(false);
          // Simulate generated video URL (in real implementation, this would be from the API)
          setGeneratedVideo('https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4');
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const handlePlayPause = () => {
    if (!videoRef.current || !generatedVideo) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleDownload = () => {
    if (!generatedVideo) return;
    
    const link = document.createElement('a');
    link.href = generatedVideo;
    link.download = `generated-video-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegenerate = () => {
    setGeneratedVideo(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setGenerationProgress(0);
    handleGenerate();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
                🎥 Video Generation
              </h1>
              <p className="doubao-text-base text-doubao-text-secondary">
                Create stunning videos from text descriptions. Customize style, length, music, and subtitles.
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
                    Video Description
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                        Describe your video *
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the video you want to create... e.g., 'A serene sunset over a mountain lake with birds flying across the sky, peaceful and cinematic'"
                        rows={4}
                        className="w-full doubao-input-base resize-none"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Video Style and Length */}
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Video Style
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                    {videoStyles.map((style) => (
                      <motion.button
                        key={style.id}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedStyle(style.id as VideoStyle)}
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

                  <h4 className="doubao-text-base font-semibold text-doubao-text-primary mb-3">
                    Video Length
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {videoLengths.map((length) => (
                      <motion.button
                        key={length.id}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedLength(length.id as VideoLength)}
                        className={cn(
                          'p-3 rounded-lg border text-center doubao-transition-colors',
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
                </motion.div>

                {/* Video Settings */}
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Video Settings
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Aspect Ratio */}
                    <div>
                      <h4 className="doubao-text-base font-semibold text-doubao-text-primary mb-3">
                        Aspect Ratio
                      </h4>
                      <div className="space-y-2">
                        {aspectRatios.map((ratio) => (
                          <motion.button
                            key={ratio.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedAspectRatio(ratio.id as AspectRatio)}
                            className={cn(
                              'w-full p-3 rounded-lg border text-left doubao-transition-colors',
                              selectedAspectRatio === ratio.id
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
                            <div className="doubao-text-sm font-medium text-doubao-text-primary">
                              {ratio.label}
                            </div>
                            <div className="doubao-text-xs text-doubao-text-muted">
                              {ratio.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Quality */}
                    <div>
                      <h4 className="doubao-text-base font-semibold text-doubao-text-primary mb-3">
                        Quality
                      </h4>
                      <div className="space-y-2">
                        {videoQualities.map((quality) => (
                          <motion.button
                            key={quality.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedQuality(quality.id as VideoQuality)}
                            className={cn(
                              'w-full p-3 rounded-lg border text-left doubao-transition-colors',
                              selectedQuality === quality.id
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
                            <div className="doubao-text-sm font-medium text-doubao-text-primary">
                              {quality.label}
                            </div>
                            <div className="doubao-text-xs text-doubao-text-muted">
                              {quality.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Background Music and Subtitles */}
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                  className="doubao-card-base p-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Background Music */}
                    <div>
                      <h4 className="doubao-text-base font-semibold text-doubao-text-primary mb-3">
                        Background Music
                      </h4>
                      <div className="space-y-2">
                        {backgroundMusicOptions.map((music) => (
                          <motion.button
                            key={music.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedMusic(music.id)}
                            className={cn(
                              'w-full p-3 rounded-lg border text-left doubao-transition-colors',
                              selectedMusic === music.id
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
                            <div className="doubao-text-sm font-medium text-doubao-text-primary">
                              {music.label}
                            </div>
                            <div className="doubao-text-xs text-doubao-text-muted">
                              {music.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Subtitles */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="checkbox"
                          id="enableSubtitles"
                          checked={enableSubtitles}
                          onChange={(e) => setEnableSubtitles(e.target.checked)}
                          className="rounded border-doubao-border-medium"
                        />
                        <label htmlFor="enableSubtitles" className="doubao-text-base font-semibold text-doubao-text-primary">
                          Enable Subtitles
                        </label>
                      </div>
                      
                      {enableSubtitles && (
                        <div>
                          <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                            Subtitle Text
                          </label>
                          <textarea
                            value={subtitles}
                            onChange={(e) => setSubtitles(e.target.value)}
                            placeholder="Enter subtitle text or leave empty for auto-generated subtitles..."
                            rows={4}
                            className="w-full doubao-input-base resize-none"
                          />
                        </div>
                      )}
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
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Generating Video... {generationProgress}%
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-white h-2 rounded-full transition-all duration-300"
                            style={{ width: `${generationProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      '🎥 Generate Video'
                    )}
                  </motion.button>
                </motion.div>

                {/* Generated Video Player */}
                {generatedVideo && (
                  <motion.div
                    variants={createSlideAnimation('up')}
                    initial="hidden"
                    animate="visible"
                    className="doubao-card-base p-6"
                  >
                    <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                      Generated Video
                    </h3>
                    
                    <div className="bg-doubao-bg-secondary rounded-lg p-4">
                      {/* Video Player */}
                      <div className="relative mb-4 bg-black rounded-lg overflow-hidden">
                        <video
                          ref={videoRef}
                          src={generatedVideo}
                          className="w-full h-auto"
                          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                          onEnded={() => setIsPlaying(false)}
                          style={{ aspectRatio: selectedAspectRatio.replace(':', '/') }}
                        />
                        
                        {/* Video Controls Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <div className="flex items-center gap-4">
                            <motion.button
                              variants={doubaoAnimations.buttonVariants}
                              initial="rest"
                              whileHover="hover"
                              whileTap="tap"
                              onClick={handlePlayPause}
                              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center"
                            >
                              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            </motion.button>
                            
                            <div className="flex-1">
                              <div className="w-full bg-white/20 rounded-full h-1 mb-1">
                                <div 
                                  className="bg-white h-1 rounded-full transition-all duration-300"
                                  style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                                />
                              </div>
                              <div className="text-white text-xs">
                                {formatTime(currentTime)} / {formatTime(duration)}
                              </div>
                            </div>
                            
                            <motion.button
                              variants={doubaoAnimations.buttonVariants}
                              initial="rest"
                              whileHover="hover"
                              whileTap="tap"
                              onClick={handleMuteToggle}
                              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center"
                            >
                              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Video Info and Actions */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="doubao-text-sm font-medium text-doubao-text-primary mb-1">
                            Generated Video
                          </div>
                          <div className="doubao-text-xs text-doubao-text-muted">
                            {selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1)} • {selectedLength} • {selectedAspectRatio} • {selectedQuality}
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
                    Video Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Style</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {videoStyles.find(s => s.id === selectedStyle)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Length</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {videoLengths.find(l => l.id === selectedLength)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Format</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {selectedAspectRatio} • {selectedQuality}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Music</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {backgroundMusicOptions.find(m => m.id === selectedMusic)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Subtitles</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {enableSubtitles ? 'Enabled' : 'Disabled'}
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

export default VideoGeneration;