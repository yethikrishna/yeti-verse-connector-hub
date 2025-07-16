import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';

interface ImageGenerationProps {}

type ImageStyle = 'realistic' | 'anime' | 'oil-painting' | 'watercolor' | 'digital-art' | 'sketch';
type ImageSize = '512x512' | '768x768' | '1024x1024' | '1024x768' | '768x1024';
type ImageQuality = 'standard' | 'high' | 'ultra';

const imageStyles = [
  { id: 'realistic', label: 'Realistic', icon: '📷', description: 'Photorealistic images' },
  { id: 'anime', label: 'Anime', icon: '🎌', description: 'Japanese animation style' },
  { id: 'oil-painting', label: 'Oil Painting', icon: '🎨', description: 'Classical oil painting style' },
  { id: 'watercolor', label: 'Watercolor', icon: '🖌️', description: 'Soft watercolor painting' },
  { id: 'digital-art', label: 'Digital Art', icon: '💻', description: 'Modern digital artwork' },
  { id: 'sketch', label: 'Sketch', icon: '✏️', description: 'Hand-drawn sketch style' },
];

const imageSizes = [
  { id: '512x512', label: '512×512', description: 'Square (Small)' },
  { id: '768x768', label: '768×768', description: 'Square (Medium)' },
  { id: '1024x1024', label: '1024×1024', description: 'Square (Large)' },
  { id: '1024x768', label: '1024×768', description: 'Landscape' },
  { id: '768x1024', label: '768×1024', description: 'Portrait' },
];

const qualityOptions = [
  { id: 'standard', label: 'Standard', description: 'Good quality, faster generation' },
  { id: 'high', label: 'High', description: 'Better quality, moderate speed' },
  { id: 'ultra', label: 'Ultra', description: 'Best quality, slower generation' },
];

const promptSuggestions = [
  'A serene mountain landscape at sunset',
  'A futuristic city with flying cars',
  'A cute cat wearing a wizard hat',
  'An abstract geometric pattern',
  'A cozy coffee shop interior',
  'A majestic dragon in the clouds',
  'A beautiful garden with flowers',
  'A space station orbiting Earth',
];

export const ImageGeneration: React.FC<ImageGenerationProps> = () => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>('realistic');
  const [selectedSize, setSelectedSize] = useState<ImageSize>('1024x1024');
  const [selectedQuality, setSelectedQuality] = useState<ImageQuality>('high');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate image generation
    setTimeout(() => {
      // Add placeholder images
      setGeneratedImages([
        'https://via.placeholder.com/512x512/4A90E2/FFFFFF?text=Generated+Image+1',
        'https://via.placeholder.com/512x512/357ABD/FFFFFF?text=Generated+Image+2',
        'https://via.placeholder.com/512x512/2C5AA0/FFFFFF?text=Generated+Image+3',
        'https://via.placeholder.com/512x512/1E3A8A/FFFFFF?text=Generated+Image+4',
      ]);
      setIsGenerating(false);
    }, 4000);
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
              variants={doubaoAnimations.fadeInUp}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <h1 className="doubao-text-2xl text-doubao-text-primary mb-2">
                🎨 Image Generation
              </h1>
              <p className="doubao-text-base text-doubao-text-secondary">
                Create stunning images from text descriptions with AI. Choose your style, size, and quality preferences.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Configuration Panel */}
              <div className="xl:col-span-2 space-y-6">
                {/* Prompt Input */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Image Description
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                        Prompt *
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the image you want to create..."
                        rows={4}
                        className="w-full doubao-input-base resize-none"
                      />
                    </div>
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                        Negative Prompt (Optional)
                      </label>
                      <textarea
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="What you don't want in the image..."
                        rows={2}
                        className="w-full doubao-input-base resize-none"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Style Selection */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Art Style
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {imageStyles.map((style) => (
                      <motion.button
                        key={style.id}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedStyle(style.id as ImageStyle)}
                        className={cn(
                          'p-4 rounded-lg border-2 text-center doubao-transition-colors',
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

                {/* Size and Quality */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Image Settings
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Size */}
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-3">
                        Size
                      </label>
                      <div className="space-y-2">
                        {imageSizes.map((size) => (
                          <motion.button
                            key={size.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedSize(size.id as ImageSize)}
                            className={cn(
                              'w-full p-3 rounded-lg border text-left doubao-transition-colors',
                              selectedSize === size.id
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
                            <div className="doubao-text-sm font-medium text-doubao-text-primary">
                              {size.label}
                            </div>
                            <div className="doubao-text-xs text-doubao-text-muted">
                              {size.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Quality */}
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-3">
                        Quality
                      </label>
                      <div className="space-y-2">
                        {qualityOptions.map((quality) => (
                          <motion.button
                            key={quality.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedQuality(quality.id as ImageQuality)}
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

                {/* Generate Button */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    variants={doubaoAnimations.buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className={cn(
                      'w-full doubao-button-primary py-4 text-lg',
                      (!prompt.trim() || isGenerating) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating Images...
                      </div>
                    ) : (
                      '🎨 Generate Images'
                    )}
                  </motion.button>
                </motion.div>

                {/* Generated Images */}
                {generatedImages.length > 0 && (
                  <motion.div
                    variants={doubaoAnimations.fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.5 }}
                    className="doubao-card-base p-6"
                  >
                    <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                      Generated Images
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {generatedImages.map((image, index) => (
                        <motion.div
                          key={index}
                          variants={doubaoAnimations.fadeInUp}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.1 * index }}
                          className="relative group"
                        >
                          <img
                            src={image}
                            alt={`Generated image ${index + 1}`}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 doubao-transition-all rounded-lg flex items-center justify-center">
                            <div className="flex gap-2">
                              <motion.button
                                variants={doubaoAnimations.buttonVariants}
                                initial="rest"
                                whileHover="hover"
                                whileTap="tap"
                                className="doubao-button-primary px-4 py-2"
                              >
                                Download
                              </motion.button>
                              <motion.button
                                variants={doubaoAnimations.buttonVariants}
                                initial="rest"
                                whileHover="hover"
                                whileTap="tap"
                                className="doubao-button-secondary px-4 py-2"
                              >
                                Share
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                {/* Settings Preview */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                  className="doubao-card-base p-6 sticky top-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Current Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Style</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {imageStyles.find(s => s.id === selectedStyle)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Size</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {selectedSize}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Quality</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {qualityOptions.find(q => q.id === selectedQuality)?.label}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Prompt Suggestions */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.6 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    💡 Prompt Ideas
                  </h3>
                  <div className="space-y-2">
                    {promptSuggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setPrompt(suggestion)}
                        className="w-full p-3 bg-doubao-bg-secondary rounded-lg hover:bg-doubao-hover doubao-transition-colors text-left"
                      >
                        <div className="doubao-text-sm text-doubao-text-primary">
                          {suggestion}
                        </div>
                      </motion.button>
                    ))}
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

export default ImageGeneration;