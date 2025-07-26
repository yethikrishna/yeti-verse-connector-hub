import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';
import { useNotifications } from '@/hooks/useNotifications';
import { Search, Settings, Play, Code, Database, Globe, Image, FileText, Calculator, Zap, Bot, Cpu } from 'lucide-react';

interface AIFunction {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  status: 'active' | 'inactive' | 'beta';
  parameters: FunctionParameter[];
  examples: string[];
  usageCount: number;
}

interface FunctionParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: any;
}

const categories = [
  'All',
  'Text Processing',
  'Image Generation',
  'Data Analysis',
  'Web Scraping',
  'Code Generation',
  'Math & Logic'
];

const sampleFunctions: AIFunction[] = [
  {
    id: '1',
    name: 'Text Summarizer',
    description: 'Summarize long text content into key points',
    category: 'Text Processing',
    icon: <FileText className="h-5 w-5" />,
    status: 'active',
    parameters: [
      { name: 'text', type: 'string', required: true, description: 'Text to summarize' },
      { name: 'length', type: 'number', required: false, description: 'Summary length', defaultValue: 100 }
    ],
    examples: ['Summarize this article...', 'Create bullet points from...'],
    usageCount: 2340
  },
  {
    id: '2',
    name: 'Image Generator',
    description: 'Generate images from text descriptions',
    category: 'Image Generation',
    icon: <Image className="h-5 w-5" />,
    status: 'active',
    parameters: [
      { name: 'prompt', type: 'string', required: true, description: 'Image description' },
      { name: 'style', type: 'string', required: false, description: 'Art style', defaultValue: 'realistic' },
      { name: 'size', type: 'string', required: false, description: 'Image size', defaultValue: '1024x1024' }
    ],
    examples: ['A sunset over mountains', 'Abstract digital art'],
    usageCount: 1890
  },
  {
    id: '3',
    name: 'Data Analyzer',
    description: 'Analyze datasets and extract insights',
    category: 'Data Analysis',
    icon: <Database className="h-5 w-5" />,
    status: 'active',
    parameters: [
      { name: 'data', type: 'object', required: true, description: 'Dataset to analyze' },
      { name: 'analysis_type', type: 'string', required: false, description: 'Type of analysis', defaultValue: 'summary' }
    ],
    examples: ['Analyze sales data', 'Find patterns in user behavior'],
    usageCount: 1456
  },
  {
    id: '4',
    name: 'Web Scraper',
    description: 'Extract data from web pages',
    category: 'Web Scraping',
    icon: <Globe className="h-5 w-5" />,
    status: 'beta',
    parameters: [
      { name: 'url', type: 'string', required: true, description: 'URL to scrape' },
      { name: 'selector', type: 'string', required: false, description: 'CSS selector' }
    ],
    examples: ['Scrape product prices', 'Extract article content'],
    usageCount: 876
  },
  {
    id: '5',
    name: 'Code Generator',
    description: 'Generate code in various programming languages',
    category: 'Code Generation',
    icon: <Code className="h-5 w-5" />,
    status: 'active',
    parameters: [
      { name: 'description', type: 'string', required: true, description: 'Code description' },
      { name: 'language', type: 'string', required: false, description: 'Programming language', defaultValue: 'python' }
    ],
    examples: ['Create a sorting algorithm', 'Build a REST API'],
    usageCount: 2100
  },
  {
    id: '6',
    name: 'Math Solver',
    description: 'Solve mathematical equations and problems',
    category: 'Math & Logic',
    icon: <Calculator className="h-5 w-5" />,
    status: 'active',
    parameters: [
      { name: 'problem', type: 'string', required: true, description: 'Math problem to solve' },
      { name: 'show_steps', type: 'boolean', required: false, description: 'Show solution steps', defaultValue: true }
    ],
    examples: ['Solve quadratic equation', 'Calculate derivatives'],
    usageCount: 1234
  }
];

export const DoubaoFunctionLibrary: React.FC = () => {
  const [functions] = useState<AIFunction[]>(sampleFunctions);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFunction, setSelectedFunction] = useState<AIFunction | null>(null);
  const { hasNotifications } = useNotifications();

  const filteredFunctions = functions.filter(func => {
    const matchesCategory = selectedCategory === 'All' || func.category === selectedCategory;
    const matchesSearch = func.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         func.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectFunction = useCallback((func: AIFunction) => {
    setSelectedFunction(func);
  }, []);

  const handleUseFunction = useCallback((func: AIFunction) => {
    // In a real implementation, this would integrate the function with the chat
    console.log('Using function:', func.name);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'beta': return 'text-orange-600 bg-orange-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <DoubaoHeader 
        showSidebarToggle={true}
        hasNotifications={hasNotifications}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <motion.div
            variants={doubaoAnimations.messageVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <h1 className="doubao-text-2xl text-doubao-text-primary mb-2">
              ⚡ Function Library
            </h1>
            <p className="doubao-text-base text-doubao-text-secondary">
              AI-powered functions and tools to enhance your workflow
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            variants={doubaoAnimations.staggerItem}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="mb-6 space-y-4"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-doubao-text-muted" />
              <input
                type="text"
                placeholder="Search functions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 doubao-input-base"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  variants={doubaoAnimations.buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium doubao-transition-colors',
                    selectedCategory === category
                      ? 'bg-doubao-primary-blue text-white'
                      : 'bg-doubao-bg-secondary text-doubao-text-primary hover:bg-doubao-hover'
                  )}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Functions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFunctions.map((func, index) => (
              <motion.div
                key={func.id}
                variants={doubaoAnimations.staggerItem}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 + index * 0.05 }}
                className="doubao-card-base p-6 hover:shadow-lg doubao-transition-all cursor-pointer"
                onClick={() => handleSelectFunction(func)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-doubao-secondary-blue/10 rounded-lg text-doubao-primary-blue">
                      {func.icon}
                    </div>
                    <div>
                      <h3 className="doubao-text-lg font-semibold text-doubao-text-primary">
                        {func.name}
                      </h3>
                      <span className={cn(
                        'text-xs px-2 py-1 rounded-full font-medium',
                        getStatusColor(func.status)
                      )}>
                        {func.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-doubao-text-muted">
                    {func.usageCount} uses
                  </div>
                </div>
                
                <p className="doubao-text-sm text-doubao-text-secondary mb-4 line-clamp-2">
                  {func.description}
                </p>

                <div className="mb-4">
                  <div className="doubao-text-xs text-doubao-text-muted mb-2">
                    Parameters: {func.parameters.length}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {func.parameters.slice(0, 3).map((param) => (
                      <span
                        key={param.name}
                        className={cn(
                          'px-2 py-1 text-xs rounded',
                          param.required 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-doubao-bg-secondary text-doubao-text-muted'
                        )}
                      >
                        {param.name}
                      </span>
                    ))}
                    {func.parameters.length > 3 && (
                      <span className="px-2 py-1 bg-doubao-bg-secondary text-doubao-text-muted text-xs rounded">
                        +{func.parameters.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    variants={doubaoAnimations.buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseFunction(func);
                    }}
                    className="flex-1 doubao-button-primary py-2 text-sm"
                    disabled={func.status === 'inactive'}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Use Function
                  </motion.button>
                  <motion.button
                    variants={doubaoAnimations.buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectFunction(func);
                    }}
                    className="px-3 py-2 border border-doubao-border-light rounded-lg hover:bg-doubao-hover doubao-transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Function Details Modal */}
          {selectedFunction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedFunction(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-doubao-secondary-blue/10 rounded-lg text-doubao-primary-blue">
                        {selectedFunction.icon}
                      </div>
                      <div>
                        <h2 className="doubao-text-xl font-semibold text-doubao-text-primary">
                          {selectedFunction.name}
                        </h2>
                        <p className="doubao-text-sm text-doubao-text-secondary">
                          {selectedFunction.description}
                        </p>
                        <span className={cn(
                          'inline-block text-xs px-2 py-1 rounded-full font-medium mt-2',
                          getStatusColor(selectedFunction.status)
                        )}>
                          {selectedFunction.status}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFunction(null)}
                      className="p-2 hover:bg-doubao-hover rounded-lg doubao-transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Parameters */}
                    <div>
                      <h3 className="doubao-text-lg font-medium text-doubao-text-primary mb-4">
                        Parameters
                      </h3>
                      <div className="space-y-3">
                        {selectedFunction.parameters.map((param) => (
                          <div key={param.name} className="p-4 bg-doubao-bg-secondary rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="doubao-text-sm font-medium text-doubao-text-primary">
                                {param.name}
                              </span>
                              <span className="text-xs text-doubao-text-muted">
                                ({param.type})
                              </span>
                              {param.required && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                  required
                                </span>
                              )}
                            </div>
                            <p className="doubao-text-xs text-doubao-text-secondary">
                              {param.description}
                            </p>
                            {param.defaultValue && (
                              <p className="doubao-text-xs text-doubao-text-muted mt-1">
                                Default: {param.defaultValue}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Examples */}
                    <div>
                      <h3 className="doubao-text-lg font-medium text-doubao-text-primary mb-4">
                        Usage Examples
                      </h3>
                      <div className="space-y-3">
                        {selectedFunction.examples.map((example, index) => (
                          <div key={index} className="p-4 bg-doubao-bg-secondary rounded-lg">
                            <code className="doubao-text-sm text-doubao-text-primary">
                              {example}
                            </code>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                        <h4 className="doubao-text-sm font-medium text-doubao-text-primary mb-2">
                          Usage Statistics
                        </h4>
                        <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-doubao-primary-blue" />
                            <span className="doubao-text-sm text-doubao-text-primary">
                              {selectedFunction.usageCount} total uses
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-6 border-t border-doubao-border-light">
                    <motion.button
                      variants={doubaoAnimations.buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleUseFunction(selectedFunction)}
                      className="flex-1 doubao-button-primary py-3"
                      disabled={selectedFunction.status === 'inactive'}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Use This Function
                    </motion.button>
                    <motion.button
                      variants={doubaoAnimations.buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      className="px-4 py-3 border border-doubao-border-light rounded-lg hover:bg-doubao-hover doubao-transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubaoFunctionLibrary;