import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';

interface WebpageSummaryProps {}

type AnalysisType = 'summary' | 'keypoints' | 'arguments' | 'data-extraction';
type SummaryLength = 'brief' | 'detailed' | 'comprehensive';

const analysisTypes = [
  { 
    id: 'summary', 
    label: 'Summary', 
    icon: '📄', 
    description: 'Generate a concise summary of the webpage content' 
  },
  { 
    id: 'keypoints', 
    label: 'Key Points', 
    icon: '🔑', 
    description: 'Extract main points and important information' 
  },
  { 
    id: 'arguments', 
    label: 'Arguments', 
    icon: '💭', 
    description: 'Identify main arguments and supporting evidence' 
  },
  { 
    id: 'data-extraction', 
    label: 'Data Extraction', 
    icon: '📊', 
    description: 'Extract structured data, statistics, and facts' 
  },
];

const summaryLengths = [
  { id: 'brief', label: 'Brief', description: '2-3 sentences' },
  { id: 'detailed', label: 'Detailed', description: '1-2 paragraphs' },
  { id: 'comprehensive', label: 'Comprehensive', description: 'Full analysis' },
];

interface AnalysisResult {
  url: string;
  title: string;
  summary: string;
  keyPoints: string[];
  mainArguments: string[];
  extractedData: {
    statistics: string[];
    facts: string[];
    dates: string[];
    names: string[];
  };
  metadata: {
    wordCount: number;
    readingTime: string;
    domain: string;
    lastUpdated?: string;
  };
}

export const WebpageSummary: React.FC<WebpageSummaryProps> = () => {
  const [url, setUrl] = useState('');
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<AnalysisType>('summary');
  const [selectedLength, setSelectedLength] = useState<SummaryLength>('detailed');
  const [customInstructions, setCustomInstructions] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }
    
    setError('');
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        url: url,
        title: "Sample Webpage Title",
        summary: "This is a sample summary of the webpage content. The analysis shows key insights about the topic discussed in the article, providing valuable information for readers.",
        keyPoints: [
          "Main topic focuses on technological advancement",
          "Statistical data supports the primary argument",
          "Expert opinions are cited throughout",
          "Future implications are discussed in detail"
        ],
        mainArguments: [
          "Technology is rapidly changing our daily lives",
          "Data-driven decisions lead to better outcomes",
          "Expert consensus supports the main thesis"
        ],
        extractedData: {
          statistics: ["75% increase in adoption", "2.3 million users", "$1.2B market value"],
          facts: ["Founded in 2020", "Headquartered in San Francisco", "Available in 15 countries"],
          dates: ["March 2023", "Q4 2022", "January 2024"],
          names: ["Dr. Sarah Johnson", "Tech Corp Inc.", "Innovation Lab"]
        },
        metadata: {
          wordCount: 1250,
          readingTime: "5 min read",
          domain: new URL(url).hostname,
          lastUpdated: "2024-01-15"
        }
      };
      
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleClearResults = () => {
    setAnalysisResult(null);
    setUrl('');
    setError('');
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
                🌐 Webpage Summary
              </h1>
              <p className="doubao-text-base text-doubao-text-secondary">
                Analyze and summarize webpage content. Extract key points, arguments, and structured data from any URL.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Input Panel */}
              <div className="xl:col-span-2 space-y-6">
                {/* URL Input */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Webpage URL
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                        Enter URL to analyze *
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => {
                            setUrl(e.target.value);
                            setError('');
                          }}
                          placeholder="https://example.com/article"
                          className={cn(
                            'w-full doubao-input-base pl-10',
                            error && 'border-red-300 focus:border-red-500'
                          )}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-doubao-text-muted">
                          🌐
                        </div>
                      </div>
                      {error && (
                        <p className="mt-2 doubao-text-sm text-red-600">{error}</p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Analysis Type Selection */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Analysis Type
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysisTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedAnalysisType(type.id as AnalysisType)}
                        className={cn(
                          'p-4 rounded-lg border-2 text-left doubao-transition-colors',
                          selectedAnalysisType === type.id
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

                {/* Summary Settings */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Analysis Settings
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Summary Length */}
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-3">
                        Summary Length
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {summaryLengths.map((length) => (
                          <motion.button
                            key={length.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedLength(length.id as SummaryLength)}
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
                    </div>

                    {/* Custom Instructions */}
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                        Custom Instructions (Optional)
                      </label>
                      <textarea
                        value={customInstructions}
                        onChange={(e) => setCustomInstructions(e.target.value)}
                        placeholder="Specific aspects to focus on, questions to answer, or particular data to extract..."
                        rows={3}
                        className="w-full doubao-input-base resize-none"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Analyze Button */}
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
                    onClick={handleAnalyze}
                    disabled={!url.trim() || isAnalyzing}
                    className={cn(
                      'w-full doubao-button-primary py-4 text-lg',
                      (!url.trim() || isAnalyzing) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing Webpage...
                      </div>
                    ) : (
                      '🔍 Analyze Webpage'
                    )}
                  </motion.button>
                </motion.div>
              </div>

              {/* Settings Preview Panel */}
              <div className="xl:col-span-1">
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                  className="doubao-card-base p-6 sticky top-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Analysis Preview
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Analysis Type</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {analysisTypes.find(t => t.id === selectedAnalysisType)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Summary Length</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {summaryLengths.find(l => l.id === selectedLength)?.label}
                      </div>
                    </div>
                    
                    {url && (
                      <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                        <div className="doubao-text-sm text-doubao-text-muted mb-2">Target URL</div>
                        <div className="doubao-text-sm font-medium text-doubao-text-primary break-all">
                          {url}
                        </div>
                      </div>
                    )}

                    {customInstructions && (
                      <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                        <div className="doubao-text-sm text-doubao-text-muted mb-2">Custom Instructions</div>
                        <div className="doubao-text-sm text-doubao-text-primary">
                          {customInstructions}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Results Section */}
            {analysisResult && (
              <motion.div
                variants={doubaoAnimations.fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.6 }}
                className="mt-8 space-y-6"
              >
                {/* Results Header */}
                <div className="flex items-center justify-between">
                  <h2 className="doubao-text-xl font-semibold text-doubao-text-primary">
                    Analysis Results
                  </h2>
                  <motion.button
                    variants={doubaoAnimations.buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleClearResults}
                    className="doubao-button-secondary px-4 py-2"
                  >
                    Clear Results
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Main Summary */}
                  <div className="doubao-card-base p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">📄</span>
                      <h3 className="doubao-text-lg font-semibold text-doubao-text-primary">
                        Summary
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="doubao-text-base font-medium text-doubao-text-primary mb-2">
                          {analysisResult.title}
                        </h4>
                        <p className="doubao-text-sm text-doubao-text-secondary leading-relaxed">
                          {analysisResult.summary}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-4 pt-4 border-t border-doubao-border-light">
                        <div className="doubao-text-xs text-doubao-text-muted">
                          📊 {analysisResult.metadata.wordCount} words
                        </div>
                        <div className="doubao-text-xs text-doubao-text-muted">
                          ⏱️ {analysisResult.metadata.readingTime}
                        </div>
                        <div className="doubao-text-xs text-doubao-text-muted">
                          🌐 {analysisResult.metadata.domain}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Points */}
                  <div className="doubao-card-base p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">🔑</span>
                      <h3 className="doubao-text-lg font-semibold text-doubao-text-primary">
                        Key Points
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {analysisResult.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-doubao-primary-blue rounded-full mt-2 flex-shrink-0" />
                          <span className="doubao-text-sm text-doubao-text-secondary">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Main Arguments */}
                  <div className="doubao-card-base p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">💭</span>
                      <h3 className="doubao-text-lg font-semibold text-doubao-text-primary">
                        Main Arguments
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {analysisResult.mainArguments.map((argument, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-doubao-secondary-blue/20 text-doubao-primary-blue rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="doubao-text-sm text-doubao-text-secondary">
                            {argument}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Extracted Data */}
                  <div className="doubao-card-base p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">📊</span>
                      <h3 className="doubao-text-lg font-semibold text-doubao-text-primary">
                        Extracted Data
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {analysisResult.extractedData.statistics.length > 0 && (
                        <div>
                          <h4 className="doubao-text-sm font-medium text-doubao-text-primary mb-2">
                            Statistics
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.extractedData.statistics.map((stat, index) => (
                              <span key={index} className="px-3 py-1 bg-doubao-secondary-blue/10 text-doubao-primary-blue rounded-full doubao-text-xs">
                                {stat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {analysisResult.extractedData.facts.length > 0 && (
                        <div>
                          <h4 className="doubao-text-sm font-medium text-doubao-text-primary mb-2">
                            Facts
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.extractedData.facts.map((fact, index) => (
                              <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full doubao-text-xs">
                                {fact}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {analysisResult.extractedData.names.length > 0 && (
                        <div>
                          <h4 className="doubao-text-sm font-medium text-doubao-text-primary mb-2">
                            Names & Entities
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.extractedData.names.map((name, index) => (
                              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full doubao-text-xs">
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DoubaoMainLayout>
  );
};

export default WebpageSummary;