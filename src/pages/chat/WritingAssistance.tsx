import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';
import { useNotifications } from '@/hooks/useNotifications';

interface WritingAssistanceProps {}

type WritingType = 'article' | 'essay' | 'copywriting' | 'email' | 'script';
type ToneType = 'formal' | 'casual';
type GenreType = 'narrative' | 'argumentative';
type LengthType = 'short' | 'medium' | 'long';

const writingTypes = [
  { id: 'article', label: 'Article', icon: '📄', description: 'News articles, blog posts, informative content' },
  { id: 'essay', label: 'Essay', icon: '📝', description: 'Academic essays, opinion pieces, analysis' },
  { id: 'copywriting', label: 'Copywriting', icon: '✨', description: 'Marketing copy, advertisements, sales content' },
  { id: 'email', label: 'Email', icon: '📧', description: 'Professional emails, newsletters, communications' },
  { id: 'script', label: 'Script', icon: '🎬', description: 'Video scripts, presentations, dialogues' },
];

const toneOptions = [
  { id: 'formal', label: 'Formal', description: 'Professional, academic, business tone' },
  { id: 'casual', label: 'Casual', description: 'Friendly, conversational, relaxed tone' },
];

const genreOptions = [
  { id: 'narrative', label: 'Narrative', description: 'Storytelling, descriptive, chronological' },
  { id: 'argumentative', label: 'Argumentative', description: 'Persuasive, analytical, debate-focused' },
];

const lengthOptions = [
  { id: 'short', label: 'Short', description: '100-300 words' },
  { id: 'medium', label: 'Medium', description: '300-800 words' },
  { id: 'long', label: 'Long', description: '800+ words' },
];

export const WritingAssistance: React.FC<WritingAssistanceProps> = () => {
  const [selectedType, setSelectedType] = useState<WritingType>('article');
  const [selectedTone, setSelectedTone] = useState<ToneType>('formal');
  const [selectedGenre, setSelectedGenre] = useState<GenreType>('narrative');
  const [selectedLength, setSelectedLength] = useState<LengthType>('medium');
  const [topic, setTopic] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { hasNotifications } = useNotifications();

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <DoubaoMainLayout>
      <div className="flex flex-col h-full">
        <DoubaoHeader 
          showSidebarToggle={true}
          hasNotifications={hasNotifications}
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <motion.div
              variants={doubaoAnimations.messageVariants}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <h1 className="doubao-text-2xl text-doubao-text-primary mb-2">
                ✍️ Writing Assistance
              </h1>
              <p className="doubao-text-base text-doubao-text-secondary">
                Generate high-quality content with AI assistance. Choose your writing type, tone, and requirements.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Configuration Panel */}
              <div className="lg:col-span-2 space-y-6">
                {/* Writing Type Selection */}
                <motion.div
                  variants={doubaoAnimations.staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Writing Type
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {writingTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedType(type.id as WritingType)}
                        className={cn(
                          'p-4 rounded-lg border-2 text-left doubao-transition-colors',
                          selectedType === type.id
                            ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                            : 'border-doubao-border-light hover:border-doubao-border-medium'
                        )}
                      >
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <div className="doubao-text-sm font-medium text-doubao-text-primary mb-1">
                          {type.label}
                        </div>
                        <div className="doubao-text-xs text-doubao-text-muted">
                          {type.description}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Topic Input */}
                <motion.div
                  variants={doubaoAnimations.staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Topic & Content
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                        Topic or Title *
                      </label>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter your topic or title..."
                        className="w-full doubao-input-base"
                      />
                    </div>
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                        Additional Requirements
                      </label>
                      <textarea
                        value={additionalRequirements}
                        onChange={(e) => setAdditionalRequirements(e.target.value)}
                        placeholder="Any specific requirements, key points to include, target audience, etc..."
                        rows={4}
                        className="w-full doubao-input-base resize-none"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Settings */}
                <motion.div
                  variants={doubaoAnimations.staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Writing Settings
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tone */}
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-3">
                        Tone
                      </label>
                      <div className="space-y-2">
                        {toneOptions.map((tone) => (
                          <motion.button
                            key={tone.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedTone(tone.id as ToneType)}
                            className={cn(
                              'w-full p-3 rounded-lg border text-left doubao-transition-colors',
                              selectedTone === tone.id
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
                            <div className="doubao-text-sm font-medium text-doubao-text-primary">
                              {tone.label}
                            </div>
                            <div className="doubao-text-xs text-doubao-text-muted">
                              {tone.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Genre */}
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-3">
                        Genre
                      </label>
                      <div className="space-y-2">
                        {genreOptions.map((genre) => (
                          <motion.button
                            key={genre.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedGenre(genre.id as GenreType)}
                            className={cn(
                              'w-full p-3 rounded-lg border text-left doubao-transition-colors',
                              selectedGenre === genre.id
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
                            <div className="doubao-text-sm font-medium text-doubao-text-primary">
                              {genre.label}
                            </div>
                            <div className="doubao-text-xs text-doubao-text-muted">
                              {genre.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Length */}
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-3">
                        Length
                      </label>
                      <div className="space-y-2">
                        {lengthOptions.map((length) => (
                          <motion.button
                            key={length.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedLength(length.id as LengthType)}
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

                {/* Generate Button */}
                <motion.div
                  variants={doubaoAnimations.staggerItem}
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
                    disabled={!topic.trim() || isGenerating}
                    className={cn(
                      'w-full doubao-button-primary py-4 text-lg',
                      (!topic.trim() || isGenerating) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </div>
                    ) : (
                      '✨ Generate Content'
                    )}
                  </motion.button>
                </motion.div>
              </div>

              {/* Preview Panel */}
              <div className="lg:col-span-1">
                <motion.div
                  variants={doubaoAnimations.staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                  className="doubao-card-base p-6 sticky top-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Preview Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Type</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {writingTypes.find(t => t.id === selectedType)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Tone</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {toneOptions.find(t => t.id === selectedTone)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Genre</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {genreOptions.find(g => g.id === selectedGenre)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Length</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {lengthOptions.find(l => l.id === selectedLength)?.label}
                      </div>
                    </div>
                    
                    {topic && (
                      <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                        <div className="doubao-text-sm text-doubao-text-muted mb-2">Topic</div>
                        <div className="doubao-text-base font-medium text-doubao-text-primary">
                          {topic}
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

export default WritingAssistance;