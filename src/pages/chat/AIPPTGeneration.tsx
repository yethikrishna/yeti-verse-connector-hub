import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';

interface AIPPTGenerationProps {}

type PresentationType = 'business' | 'academic' | 'educational' | 'marketing' | 'report';
type SlideCount = '5-10' | '10-15' | '15-20' | '20+';
type TemplateStyle = 'professional' | 'modern' | 'creative' | 'minimal';

interface SlideStructure {
  id: string;
  type: 'title' | 'content' | 'conclusion' | 'agenda' | 'summary';
  title: string;
  description: string;
}

const presentationTypes = [
  { id: 'business', label: 'Business Presentation', icon: '💼', description: 'Corporate meetings, proposals, reports' },
  { id: 'academic', label: 'Academic Presentation', icon: '🎓', description: 'Research presentations, thesis defense' },
  { id: 'educational', label: 'Educational Content', icon: '📚', description: 'Training materials, workshops, courses' },
  { id: 'marketing', label: 'Marketing Pitch', icon: '📈', description: 'Product launches, sales presentations' },
  { id: 'report', label: 'Report & Analysis', icon: '📊', description: 'Data analysis, progress reports' },
];

const slideCountOptions = [
  { id: '5-10', label: '5-10 slides', description: 'Short presentation (10-15 minutes)' },
  { id: '10-15', label: '10-15 slides', description: 'Medium presentation (15-25 minutes)' },
  { id: '15-20', label: '15-20 slides', description: 'Long presentation (25-35 minutes)' },
  { id: '20+', label: '20+ slides', description: 'Extended presentation (35+ minutes)' },
];

const templateStyles = [
  { id: 'professional', label: 'Professional', icon: '🏢', description: 'Clean, corporate design' },
  { id: 'modern', label: 'Modern', icon: '✨', description: 'Contemporary, stylish layout' },
  { id: 'creative', label: 'Creative', icon: '🎨', description: 'Colorful, engaging design' },
  { id: 'minimal', label: 'Minimal', icon: '⚪', description: 'Simple, focused layout' },
];

const defaultSlideStructures: Record<PresentationType, SlideStructure[]> = {
  business: [
    { id: '1', type: 'title', title: 'Title Slide', description: 'Presentation title, presenter, date' },
    { id: '2', type: 'agenda', title: 'Agenda', description: 'Overview of topics to be covered' },
    { id: '3', type: 'content', title: 'Problem Statement', description: 'Define the business challenge' },
    { id: '4', type: 'content', title: 'Solution Overview', description: 'Proposed solution approach' },
    { id: '5', type: 'content', title: 'Implementation Plan', description: 'Timeline and resources' },
    { id: '6', type: 'conclusion', title: 'Next Steps', description: 'Action items and follow-up' },
  ],
  academic: [
    { id: '1', type: 'title', title: 'Title Slide', description: 'Research title, author, institution' },
    { id: '2', type: 'content', title: 'Introduction', description: 'Background and motivation' },
    { id: '3', type: 'content', title: 'Literature Review', description: 'Related work and context' },
    { id: '4', type: 'content', title: 'Methodology', description: 'Research approach and methods' },
    { id: '5', type: 'content', title: 'Results', description: 'Findings and analysis' },
    { id: '6', type: 'conclusion', title: 'Conclusion', description: 'Summary and future work' },
  ],
  educational: [
    { id: '1', type: 'title', title: 'Course Title', description: 'Subject, instructor, session info' },
    { id: '2', type: 'agenda', title: 'Learning Objectives', description: 'What students will learn' },
    { id: '3', type: 'content', title: 'Key Concepts', description: 'Main topics and definitions' },
    { id: '4', type: 'content', title: 'Examples', description: 'Practical applications' },
    { id: '5', type: 'content', title: 'Activities', description: 'Interactive exercises' },
    { id: '6', type: 'summary', title: 'Summary', description: 'Recap and takeaways' },
  ],
  marketing: [
    { id: '1', type: 'title', title: 'Product Launch', description: 'Product name, launch date' },
    { id: '2', type: 'content', title: 'Market Opportunity', description: 'Target market and needs' },
    { id: '3', type: 'content', title: 'Product Features', description: 'Key benefits and advantages' },
    { id: '4', type: 'content', title: 'Competitive Analysis', description: 'Market positioning' },
    { id: '5', type: 'content', title: 'Go-to-Market Strategy', description: 'Launch plan and tactics' },
    { id: '6', type: 'conclusion', title: 'Call to Action', description: 'Next steps for audience' },
  ],
  report: [
    { id: '1', type: 'title', title: 'Report Title', description: 'Report name, period, author' },
    { id: '2', type: 'agenda', title: 'Executive Summary', description: 'Key findings overview' },
    { id: '3', type: 'content', title: 'Data Analysis', description: 'Charts, graphs, metrics' },
    { id: '4', type: 'content', title: 'Key Insights', description: 'Important discoveries' },
    { id: '5', type: 'content', title: 'Recommendations', description: 'Suggested actions' },
    { id: '6', type: 'conclusion', title: 'Conclusion', description: 'Summary and next steps' },
  ],
};

export const AIPPTGeneration: React.FC<AIPPTGenerationProps> = () => {
  const [selectedType, setSelectedType] = useState<PresentationType>('business');
  const [selectedSlideCount, setSelectedSlideCount] = useState<SlideCount>('10-15');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>('professional');
  const [topic, setTopic] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [customStructure, setCustomStructure] = useState<SlideStructure[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [useCustomStructure, setUseCustomStructure] = useState(false);

  const currentStructure = useCustomStructure ? customStructure : defaultSlideStructures[selectedType];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    // Simulate PPT generation process
    setTimeout(() => {
      setIsGenerating(false);
    }, 5000);
  };

  const addCustomSlide = () => {
    const newSlide: SlideStructure = {
      id: Date.now().toString(),
      type: 'content',
      title: 'New Slide',
      description: 'Slide description',
    };
    setCustomStructure([...customStructure, newSlide]);
  };

  const removeCustomSlide = (id: string) => {
    setCustomStructure(customStructure.filter(slide => slide.id !== id));
  };

  const updateCustomSlide = (id: string, updates: Partial<SlideStructure>) => {
    setCustomStructure(customStructure.map(slide => 
      slide.id === id ? { ...slide, ...updates } : slide
    ));
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
                📊 AI PPT Generation
              </h1>
              <p className="doubao-text-base text-doubao-text-secondary">
                Create professional presentations with AI assistance. Specify your topic, structure, and design preferences.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Configuration Panel */}
              <div className="xl:col-span-3 space-y-6">
                {/* Presentation Type Selection */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Presentation Type
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {presentationTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedType(type.id as PresentationType)}
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

                {/* Topic and Content */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Presentation Content
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                        Presentation Topic *
                      </label>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter your presentation topic..."
                        className="w-full doubao-input-base"
                      />
                    </div>
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                        Key Points to Include
                      </label>
                      <textarea
                        value={keyPoints}
                        onChange={(e) => setKeyPoints(e.target.value)}
                        placeholder="List the main points, data, or arguments you want to include..."
                        rows={4}
                        className="w-full doubao-input-base resize-none"
                      />
                    </div>
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                        Target Audience
                      </label>
                      <input
                        type="text"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder="Who is your audience? (e.g., executives, students, clients)"
                        className="w-full doubao-input-base"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Presentation Settings */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Presentation Settings
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Slide Count */}
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-3">
                        Number of Slides
                      </label>
                      <div className="space-y-2">
                        {slideCountOptions.map((option) => (
                          <motion.button
                            key={option.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedSlideCount(option.id as SlideCount)}
                            className={cn(
                              'w-full p-3 rounded-lg border text-left doubao-transition-colors',
                              selectedSlideCount === option.id
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
                            <div className="doubao-text-sm font-medium text-doubao-text-primary">
                              {option.label}
                            </div>
                            <div className="doubao-text-xs text-doubao-text-muted">
                              {option.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Template Style */}
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-3">
                        Template Style
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {templateStyles.map((style) => (
                          <motion.button
                            key={style.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedTemplate(style.id as TemplateStyle)}
                            className={cn(
                              'p-3 rounded-lg border text-center doubao-transition-colors',
                              selectedTemplate === style.id
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
                            <div className="text-xl mb-1">{style.icon}</div>
                            <div className="doubao-text-xs font-medium text-doubao-text-primary">
                              {style.label}
                            </div>
                            <div className="doubao-text-xs text-doubao-text-muted">
                              {style.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Slide Structure */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                  className="doubao-card-base p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="doubao-text-lg font-semibold text-doubao-text-primary">
                      Slide Structure
                    </h3>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="customStructure"
                        checked={useCustomStructure}
                        onChange={(e) => {
                          setUseCustomStructure(e.target.checked);
                          if (e.target.checked && customStructure.length === 0) {
                            setCustomStructure([...defaultSlideStructures[selectedType]]);
                          }
                        }}
                        className="rounded border-doubao-border-medium"
                      />
                      <label htmlFor="customStructure" className="doubao-text-sm text-doubao-text-primary">
                        Customize structure
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {currentStructure.map((slide, index) => (
                      <div
                        key={slide.id}
                        className="flex items-center gap-3 p-3 bg-doubao-bg-secondary rounded-lg"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-doubao-primary-blue text-white rounded-full flex items-center justify-center doubao-text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          {useCustomStructure ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={slide.title}
                                onChange={(e) => updateCustomSlide(slide.id, { title: e.target.value })}
                                className="w-full doubao-input-base doubao-text-sm"
                              />
                              <input
                                type="text"
                                value={slide.description}
                                onChange={(e) => updateCustomSlide(slide.id, { description: e.target.value })}
                                className="w-full doubao-input-base doubao-text-xs"
                                placeholder="Slide description..."
                              />
                            </div>
                          ) : (
                            <div>
                              <div className="doubao-text-sm font-medium text-doubao-text-primary">
                                {slide.title}
                              </div>
                              <div className="doubao-text-xs text-doubao-text-muted">
                                {slide.description}
                              </div>
                            </div>
                          )}
                        </div>
                        {useCustomStructure && (
                          <button
                            onClick={() => removeCustomSlide(slide.id)}
                            className="flex-shrink-0 w-6 h-6 text-doubao-text-muted hover:text-red-500 doubao-transition-colors"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {useCustomStructure && (
                      <motion.button
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={addCustomSlide}
                        className="w-full p-3 border-2 border-dashed border-doubao-border-medium rounded-lg text-doubao-text-muted hover:border-doubao-primary-blue hover:text-doubao-primary-blue doubao-transition-colors"
                      >
                        + Add Slide
                      </motion.button>
                    )}
                  </div>
                </motion.div>

                {/* Generate Button */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
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
                        Generating PPT...
                      </div>
                    ) : (
                      '🎯 Generate Presentation'
                    )}
                  </motion.button>
                </motion.div>
              </div>

              {/* Preview Panel */}
              <div className="xl:col-span-1">
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.6 }}
                  className="doubao-card-base p-6 sticky top-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Preview Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Type</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {presentationTypes.find(t => t.id === selectedType)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Slides</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {selectedSlideCount} slides
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Style</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {templateStyles.find(s => s.id === selectedTemplate)?.label}
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
                    
                    {targetAudience && (
                      <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                        <div className="doubao-text-sm text-doubao-text-muted mb-2">Audience</div>
                        <div className="doubao-text-base font-medium text-doubao-text-primary">
                          {targetAudience}
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Structure</div>
                      <div className="doubao-text-sm text-doubao-text-primary">
                        {currentStructure.length} slides planned
                      </div>
                    </div>
                  </div>

                  {/* Export Options */}
                  <div className="mt-6 pt-4 border-t border-doubao-border-light">
                    <h4 className="doubao-text-sm font-medium text-doubao-text-primary mb-3">
                      Export Options
                    </h4>
                    <div className="space-y-2">
                      <button className="w-full p-2 text-left doubao-text-sm text-doubao-text-muted hover:text-doubao-text-primary doubao-transition-colors">
                        📄 PowerPoint (.pptx)
                      </button>
                      <button className="w-full p-2 text-left doubao-text-sm text-doubao-text-muted hover:text-doubao-text-primary doubao-transition-colors">
                        📊 Google Slides
                      </button>
                      <button className="w-full p-2 text-left doubao-text-sm text-doubao-text-muted hover:text-doubao-text-primary doubao-transition-colors">
                        📋 PDF Document
                      </button>
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

export default AIPPTGeneration;