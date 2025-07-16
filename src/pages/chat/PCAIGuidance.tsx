import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';

interface PCAIGuidanceProps {}

type GuidanceCategory = 'software' | 'troubleshooting' | 'workflow' | 'system';
type SoftwareType = 'excel' | 'powerpoint' | 'word' | 'outlook' | 'teams' | 'chrome';
type TroubleshootingType = 'performance' | 'network' | 'hardware' | 'software-issues' | 'security';
type WorkflowType = 'productivity' | 'automation' | 'shortcuts' | 'organization' | 'collaboration';
type SystemType = 'windows' | 'mac' | 'linux' | 'mobile';

const guidanceCategories = [
  { 
    id: 'software', 
    label: 'Software Tutorials', 
    icon: '💻', 
    description: 'Learn to use popular software applications effectively',
    color: 'bg-blue-50 border-blue-200 text-blue-700'
  },
  { 
    id: 'troubleshooting', 
    label: 'System Troubleshooting', 
    icon: '🔧', 
    description: 'Solve common computer problems and technical issues',
    color: 'bg-red-50 border-red-200 text-red-700'
  },
  { 
    id: 'workflow', 
    label: 'Workflow Optimization', 
    icon: '⚡', 
    description: 'Improve productivity and streamline your work processes',
    color: 'bg-green-50 border-green-200 text-green-700'
  },
  { 
    id: 'system', 
    label: 'System Operations', 
    icon: '⚙️', 
    description: 'Master operating system features and configurations',
    color: 'bg-purple-50 border-purple-200 text-purple-700'
  },
];

const softwareOptions = [
  { id: 'excel', label: 'Microsoft Excel', icon: '📊', description: 'Spreadsheets, formulas, charts, pivot tables' },
  { id: 'powerpoint', label: 'PowerPoint', icon: '📽️', description: 'Presentations, animations, design tips' },
  { id: 'word', label: 'Microsoft Word', icon: '📝', description: 'Document formatting, templates, collaboration' },
  { id: 'outlook', label: 'Outlook', icon: '📧', description: 'Email management, calendar, tasks' },
  { id: 'teams', label: 'Microsoft Teams', icon: '👥', description: 'Video calls, collaboration, file sharing' },
  { id: 'chrome', label: 'Google Chrome', icon: '🌐', description: 'Browser tips, extensions, productivity' },
];

const troubleshootingOptions = [
  { id: 'performance', label: 'Performance Issues', icon: '🚀', description: 'Slow computer, memory usage, optimization' },
  { id: 'network', label: 'Network Problems', icon: '🌐', description: 'Internet connection, WiFi, network settings' },
  { id: 'hardware', label: 'Hardware Issues', icon: '🔌', description: 'Printer, monitor, keyboard, mouse problems' },
  { id: 'software-issues', label: 'Software Problems', icon: '🐛', description: 'App crashes, installation issues, updates' },
  { id: 'security', label: 'Security Concerns', icon: '🔒', description: 'Virus removal, privacy settings, safe browsing' },
];

const workflowOptions = [
  { id: 'productivity', label: 'Productivity Tips', icon: '📈', description: 'Time management, focus techniques, efficiency' },
  { id: 'automation', label: 'Task Automation', icon: '🤖', description: 'Scripts, shortcuts, automated workflows' },
  { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: '⌨️', description: 'Essential shortcuts for faster work' },
  { id: 'organization', label: 'File Organization', icon: '📁', description: 'Folder structure, naming conventions, backup' },
  { id: 'collaboration', label: 'Team Collaboration', icon: '🤝', description: 'Sharing files, remote work, communication' },
];

const systemOptions = [
  { id: 'windows', label: 'Windows', icon: '🪟', description: 'Windows 10/11 features and settings' },
  { id: 'mac', label: 'macOS', icon: '🍎', description: 'Mac system preferences and utilities' },
  { id: 'linux', label: 'Linux', icon: '🐧', description: 'Linux distributions and command line' },
  { id: 'mobile', label: 'Mobile Devices', icon: '📱', description: 'iOS and Android tips and tricks' },
];

export const PCAIGuidance: React.FC<PCAIGuidanceProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<GuidanceCategory>('software');
  const [selectedSoftware, setSelectedSoftware] = useState<SoftwareType>('excel');
  const [selectedTroubleshooting, setSelectedTroubleshooting] = useState<TroubleshootingType>('performance');
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType>('productivity');
  const [selectedSystem, setSelectedSystem] = useState<SystemType>('windows');
  const [question, setQuestion] = useState('');
  const [specificIssue, setSpecificIssue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!question.trim()) return;
    
    setIsGenerating(true);
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const getCurrentOptions = () => {
    switch (selectedCategory) {
      case 'software':
        return softwareOptions;
      case 'troubleshooting':
        return troubleshootingOptions;
      case 'workflow':
        return workflowOptions;
      case 'system':
        return systemOptions;
      default:
        return [];
    }
  };

  const getCurrentSelection = () => {
    switch (selectedCategory) {
      case 'software':
        return selectedSoftware;
      case 'troubleshooting':
        return selectedTroubleshooting;
      case 'workflow':
        return selectedWorkflow;
      case 'system':
        return selectedSystem;
      default:
        return '';
    }
  };

  const setCurrentSelection = (value: string) => {
    switch (selectedCategory) {
      case 'software':
        setSelectedSoftware(value as SoftwareType);
        break;
      case 'troubleshooting':
        setSelectedTroubleshooting(value as TroubleshootingType);
        break;
      case 'workflow':
        setSelectedWorkflow(value as WorkflowType);
        break;
      case 'system':
        setSelectedSystem(value as SystemType);
        break;
    }
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
                🖥️ PC AI Guidance
              </h1>
              <p className="doubao-text-base text-doubao-text-secondary">
                Get expert guidance on PC operations, software tutorials, troubleshooting, and workflow optimization.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Configuration Panel */}
              <div className="lg:col-span-2 space-y-6">
                {/* Category Selection */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Guidance Category
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {guidanceCategories.map((category) => (
                      <motion.button
                        key={category.id}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedCategory(category.id as GuidanceCategory)}
                        className={cn(
                          'p-4 rounded-lg border-2 text-left doubao-transition-colors',
                          selectedCategory === category.id
                            ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                            : 'border-doubao-border-light hover:border-doubao-border-medium'
                        )}
                      >
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <div className="doubao-text-sm font-medium text-doubao-text-primary mb-1">
                          {category.label}
                        </div>
                        <div className="doubao-text-xs text-doubao-text-muted">
                          {category.description}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Specific Options */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    {guidanceCategories.find(c => c.id === selectedCategory)?.label} Options
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {getCurrentOptions().map((option) => (
                      <motion.button
                        key={option.id}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setCurrentSelection(option.id)}
                        className={cn(
                          'p-4 rounded-lg border text-left doubao-transition-colors',
                          getCurrentSelection() === option.id
                            ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                            : 'border-doubao-border-light hover:border-doubao-border-medium'
                        )}
                      >
                        <div className="text-xl mb-2">{option.icon}</div>
                        <div className="doubao-text-sm font-medium text-doubao-text-primary mb-1">
                          {option.label}
                        </div>
                        <div className="doubao-text-xs text-doubao-text-muted">
                          {option.description}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Question Input */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Your Question
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                        What do you need help with? *
                      </label>
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g., How to create a pivot table in Excel?"
                        className="w-full doubao-input-base"
                      />
                    </div>
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                        Specific Issue or Context
                      </label>
                      <textarea
                        value={specificIssue}
                        onChange={(e) => setSpecificIssue(e.target.value)}
                        placeholder="Provide more details about your specific situation, error messages, or what you've already tried..."
                        rows={4}
                        className="w-full doubao-input-base resize-none"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Quick Examples */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Quick Examples
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCategory === 'software' && (
                      <>
                        <button
                          onClick={() => setQuestion("How to create a professional PowerPoint presentation?")}
                          className="p-3 text-left rounded-lg border border-doubao-border-light hover:border-doubao-border-medium doubao-transition-colors"
                        >
                          <div className="doubao-text-sm font-medium text-doubao-text-primary">
                            PowerPoint Design Tips
                          </div>
                          <div className="doubao-text-xs text-doubao-text-muted">
                            Professional presentation creation
                          </div>
                        </button>
                        <button
                          onClick={() => setQuestion("Excel formulas for data analysis and reporting")}
                          className="p-3 text-left rounded-lg border border-doubao-border-light hover:border-doubao-border-medium doubao-transition-colors"
                        >
                          <div className="doubao-text-sm font-medium text-doubao-text-primary">
                            Excel Advanced Formulas
                          </div>
                          <div className="doubao-text-xs text-doubao-text-muted">
                            Data analysis and calculations
                          </div>
                        </button>
                      </>
                    )}
                    {selectedCategory === 'troubleshooting' && (
                      <>
                        <button
                          onClick={() => setQuestion("My computer is running very slowly, how to fix it?")}
                          className="p-3 text-left rounded-lg border border-doubao-border-light hover:border-doubao-border-medium doubao-transition-colors"
                        >
                          <div className="doubao-text-sm font-medium text-doubao-text-primary">
                            Slow Computer Fix
                          </div>
                          <div className="doubao-text-xs text-doubao-text-muted">
                            Performance optimization
                          </div>
                        </button>
                        <button
                          onClick={() => setQuestion("WiFi connection keeps dropping, troubleshooting steps")}
                          className="p-3 text-left rounded-lg border border-doubao-border-light hover:border-doubao-border-medium doubao-transition-colors"
                        >
                          <div className="doubao-text-sm font-medium text-doubao-text-primary">
                            WiFi Connection Issues
                          </div>
                          <div className="doubao-text-xs text-doubao-text-muted">
                            Network troubleshooting
                          </div>
                        </button>
                      </>
                    )}
                    {selectedCategory === 'workflow' && (
                      <>
                        <button
                          onClick={() => setQuestion("Best keyboard shortcuts for productivity")}
                          className="p-3 text-left rounded-lg border border-doubao-border-light hover:border-doubao-border-medium doubao-transition-colors"
                        >
                          <div className="doubao-text-sm font-medium text-doubao-text-primary">
                            Productivity Shortcuts
                          </div>
                          <div className="doubao-text-xs text-doubao-text-muted">
                            Faster work methods
                          </div>
                        </button>
                        <button
                          onClick={() => setQuestion("How to organize files and folders efficiently")}
                          className="p-3 text-left rounded-lg border border-doubao-border-light hover:border-doubao-border-medium doubao-transition-colors"
                        >
                          <div className="doubao-text-sm font-medium text-doubao-text-primary">
                            File Organization
                          </div>
                          <div className="doubao-text-xs text-doubao-text-muted">
                            Better file management
                          </div>
                        </button>
                      </>
                    )}
                    {selectedCategory === 'system' && (
                      <>
                        <button
                          onClick={() => setQuestion("Windows 11 new features and how to use them")}
                          className="p-3 text-left rounded-lg border border-doubao-border-light hover:border-doubao-border-medium doubao-transition-colors"
                        >
                          <div className="doubao-text-sm font-medium text-doubao-text-primary">
                            Windows 11 Features
                          </div>
                          <div className="doubao-text-xs text-doubao-text-muted">
                            Latest system capabilities
                          </div>
                        </button>
                        <button
                          onClick={() => setQuestion("System security settings and privacy configuration")}
                          className="p-3 text-left rounded-lg border border-doubao-border-light hover:border-doubao-border-medium doubao-transition-colors"
                        >
                          <div className="doubao-text-sm font-medium text-doubao-text-primary">
                            Security Settings
                          </div>
                          <div className="doubao-text-xs text-doubao-text-muted">
                            Privacy and protection
                          </div>
                        </button>
                      </>
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
                    disabled={!question.trim() || isGenerating}
                    className={cn(
                      'w-full doubao-button-primary py-4 text-lg',
                      (!question.trim() || isGenerating) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating Guidance...
                      </div>
                    ) : (
                      '🚀 Get AI Guidance'
                    )}
                  </motion.button>
                </motion.div>
              </div>

              {/* Preview Panel */}
              <div className="lg:col-span-1">
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.6 }}
                  className="doubao-card-base p-6 sticky top-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Guidance Summary
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Category</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {guidanceCategories.find(c => c.id === selectedCategory)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Focus Area</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {getCurrentOptions().find(o => o.id === getCurrentSelection())?.label}
                      </div>
                    </div>
                    
                    {question && (
                      <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                        <div className="doubao-text-sm text-doubao-text-muted mb-2">Question</div>
                        <div className="doubao-text-base font-medium text-doubao-text-primary">
                          {question}
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                      <div className="doubao-text-sm font-medium text-blue-700 mb-2">
                        💡 What you'll get:
                      </div>
                      <ul className="doubao-text-xs text-blue-600 space-y-1">
                        <li>• Step-by-step instructions</li>
                        <li>• Screenshots and examples</li>
                        <li>• Best practices and tips</li>
                        <li>• Common pitfalls to avoid</li>
                        <li>• Additional resources</li>
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

export default PCAIGuidance;