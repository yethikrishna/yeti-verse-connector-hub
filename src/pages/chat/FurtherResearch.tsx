import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { Search, FileText, Globe, BarChart3, Download, BookOpen, Lightbulb, TrendingUp, Users, Calendar, ExternalLink, Filter, RefreshCw } from 'lucide-react';

interface ResearchTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  sources: number;
  icon: React.ReactNode;
}

interface ResearchSource {
  id: string;
  title: string;
  type: 'academic' | 'news' | 'report' | 'database' | 'expert';
  url: string;
  credibility: number;
  date: string;
  summary: string;
}

interface ResearchReport {
  id: string;
  topic: string;
  sections: {
    title: string;
    content: string;
    sources: string[];
  }[];
  keyFindings: string[];
  recommendations: string[];
  generatedAt: Date;
}

const FurtherResearch: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentReport, setCurrentReport] = useState<ResearchReport | null>(null);

  const [filterCategory, setFilterCategory] = useState<string>('all');

  const researchTopics: ResearchTopic[] = [
    {
      id: 'climate-change',
      title: 'Climate Change Impact Analysis',
      description: 'Comprehensive analysis of climate change effects on global ecosystems, economy, and society',
      category: 'Environment',
      complexity: 'advanced',
      estimatedTime: '45-60 min',
      sources: 150,
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: 'ai-healthcare',
      title: 'AI in Healthcare Revolution',
      description: 'Deep dive into artificial intelligence applications transforming medical diagnosis and treatment',
      category: 'Technology',
      complexity: 'intermediate',
      estimatedTime: '30-45 min',
      sources: 120,
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'renewable-energy',
      title: 'Renewable Energy Transition',
      description: 'Analysis of global shift towards sustainable energy sources and implementation challenges',
      category: 'Energy',
      complexity: 'intermediate',
      estimatedTime: '35-50 min',
      sources: 95,
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      id: 'quantum-computing',
      title: 'Quantum Computing Breakthrough',
      description: 'Exploration of quantum computing advances and potential industry disruptions',
      category: 'Technology',
      complexity: 'advanced',
      estimatedTime: '50-70 min',
      sources: 80,
      icon: <Lightbulb className="w-5 h-5" />
    },
    {
      id: 'social-media-impact',
      title: 'Social Media Psychological Effects',
      description: 'Research on social media influence on mental health and social behavior patterns',
      category: 'Psychology',
      complexity: 'beginner',
      estimatedTime: '25-35 min',
      sources: 110,
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'space-exploration',
      title: 'Future of Space Exploration',
      description: 'Analysis of upcoming space missions, colonization prospects, and technological requirements',
      category: 'Science',
      complexity: 'intermediate',
      estimatedTime: '40-55 min',
      sources: 75,
      icon: <BookOpen className="w-5 h-5" />
    }
  ];

  const mockSources: ResearchSource[] = [
    {
      id: '1',
      title: 'Nature Climate Change Journal - Latest Findings',
      type: 'academic',
      url: 'https://nature.com/climate',
      credibility: 95,
      date: '2024-01-15',
      summary: 'Peer-reviewed research on climate impact models and projections'
    },
    {
      id: '2',
      title: 'WHO Healthcare AI Implementation Report',
      type: 'report',
      url: 'https://who.int/ai-health',
      credibility: 92,
      date: '2024-01-10',
      summary: 'Official guidelines and case studies on AI integration in healthcare systems'
    },
    {
      id: '3',
      title: 'MIT Technology Review - Quantum Computing',
      type: 'news',
      url: 'https://technologyreview.com/quantum',
      credibility: 88,
      date: '2024-01-12',
      summary: 'Latest developments in quantum computing research and commercial applications'
    }
  ];

  const categories = ['all', 'Environment', 'Technology', 'Energy', 'Psychology', 'Science'];

  const filteredTopics = filterCategory === 'all' 
    ? researchTopics 
    : researchTopics.filter(topic => topic.category === filterCategory);

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setCurrentReport(null);
  };

  const handleGenerateReport = async () => {
    if (!selectedTopic && !customTopic.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      const topic = selectedTopic ? researchTopics.find(t => t.id === selectedTopic)?.title : customTopic;
      const mockReport: ResearchReport = {
        id: Date.now().toString(),
        topic: topic || 'Custom Research',
        sections: [
          {
            title: 'Executive Summary',
            content: 'This comprehensive analysis examines the current state and future implications of the research topic, drawing from multiple authoritative sources and expert opinions.',
            sources: ['1', '2']
          },
          {
            title: 'Current State Analysis',
            content: 'The current landscape shows significant developments and emerging trends that indicate substantial changes in the field.',
            sources: ['1', '3']
          },
          {
            title: 'Future Projections',
            content: 'Based on current data and expert analysis, several key trends are expected to shape the future of this domain.',
            sources: ['2', '3']
          },
          {
            title: 'Challenges and Opportunities',
            content: 'While significant challenges exist, there are numerous opportunities for innovation and positive impact.',
            sources: ['1', '2', '3']
          }
        ],
        keyFindings: [
          'Significant growth potential identified in key areas',
          'Multiple stakeholders showing increased interest and investment',
          'Technological barriers are being rapidly overcome',
          'Policy frameworks are evolving to support development'
        ],
        recommendations: [
          'Increase investment in research and development',
          'Establish clear regulatory frameworks',
          'Foster collaboration between industry and academia',
          'Develop comprehensive training programs'
        ],
        generatedAt: new Date()
      };
      
      setCurrentReport(mockReport);
      setIsGenerating(false);
    }, 3000);
  };

  const handleDownloadReport = () => {
    if (!currentReport) return;
    
    // Create downloadable report content
    const reportContent = `
# ${currentReport.topic} - Research Report

Generated on: ${currentReport.generatedAt.toLocaleDateString()}

## Key Findings
${currentReport.keyFindings.map(finding => `• ${finding}`).join('\n')}

## Detailed Analysis
${currentReport.sections.map(section => `
### ${section.title}
${section.content}
`).join('\n')}

## Recommendations
${currentReport.recommendations.map(rec => `• ${rec}`).join('\n')}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentReport.topic.replace(/\s+/g, '-').toLowerCase()}-research-report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      className="flex flex-col h-full bg-white"
      variants={doubaoAnimations.pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Further Research</h1>
              <p className="text-gray-600">In-depth analysis and comprehensive reports on complex topics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <Filter className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Custom Topic Input */}
        <div className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter your custom research topic..."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <motion.button
            onClick={handleGenerateReport}
            disabled={(!selectedTopic && !customTopic.trim()) || isGenerating}
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-all duration-200",
              (!selectedTopic && !customTopic.trim()) || isGenerating
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
            )}
            variants={doubaoAnimations.buttonVariants}
            whileHover={(!selectedTopic && !customTopic.trim()) || isGenerating ? {} : "hover"}
            whileTap={(!selectedTopic && !customTopic.trim()) || isGenerating ? {} : "tap"}
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Generate Report</span>
              </div>
            )}
          </motion.button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Research Topics Sidebar */}
        <div className="w-80 border-r border-gray-100 bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Suggested Research Topics</h3>
            <motion.div
              className="space-y-2"
              variants={doubaoAnimations.staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filteredTopics.map((topic) => (
                <motion.div
                  key={topic.id}
                  variants={doubaoAnimations.staggerItem}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-all duration-200 border",
                    selectedTopic === topic.id
                      ? "bg-blue-50 border-blue-200 shadow-sm"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  )}
                  onClick={() => handleTopicSelect(topic.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      selectedTopic === topic.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                    )}>
                      {topic.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">{topic.title}</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{topic.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className={cn(
                          "px-2 py-1 rounded-full",
                          topic.complexity === 'beginner' ? "bg-green-100 text-green-700" :
                          topic.complexity === 'intermediate' ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {topic.complexity}
                        </span>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{topic.estimatedTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>{topic.category}</span>
                        <span>{topic.sources} sources</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <motion.div
                className="text-center"
                variants={doubaoAnimations.modalVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Research Report</h3>
                <p className="text-gray-600 mb-4">Analyzing multiple sources and compiling comprehensive insights...</p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span>Processing data from {mockSources.length} sources</span>
                </div>
              </motion.div>
            </div>
          ) : currentReport ? (
            <motion.div
              className="p-6"
              variants={doubaoAnimations.pageVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Report Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentReport.topic}</h2>
                  <p className="text-gray-600">Generated on {currentReport.generatedAt.toLocaleDateString()}</p>
                </div>
                <motion.button
                  onClick={handleDownloadReport}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  variants={doubaoAnimations.buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
                </motion.button>
              </div>

              {/* Key Findings */}
              <motion.div
                className="mb-8"
                variants={doubaoAnimations.staggerItem}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                  Key Findings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentReport.keyFindings.map((finding, index) => (
                    <motion.div
                      key={index}
                      className="p-4 bg-blue-50 rounded-lg border border-blue-100"
                      variants={doubaoAnimations.staggerItem}
                    >
                      <p className="text-gray-800">{finding}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Report Sections */}
              <motion.div
                className="mb-8"
                variants={doubaoAnimations.staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-500" />
                  Detailed Analysis
                </h3>
                <div className="space-y-6">
                  {currentReport.sections.map((section, index) => (
                    <motion.div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-6"
                      variants={doubaoAnimations.staggerItem}
                    >
                      <h4 className="text-lg font-medium text-gray-900 mb-3">{section.title}</h4>
                      <p className="text-gray-700 mb-4 leading-relaxed">{section.content}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <ExternalLink className="w-4 h-4" />
                        <span>Sources: {section.sources.length} references</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                variants={doubaoAnimations.staggerItem}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Recommendations
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <ul className="space-y-3">
                    {currentReport.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-800">{recommendation}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <motion.div
                className="text-center max-w-md"
                variants={doubaoAnimations.modalVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Research</h3>
                <p className="text-gray-600 mb-4">
                  Select a suggested topic from the sidebar or enter your own custom research topic to generate a comprehensive analysis report.
                </p>
                <div className="text-sm text-gray-500">
                  <p>Our AI will analyze multiple sources and provide:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Multi-source data integration</li>
                    <li>• Key findings and insights</li>
                    <li>• Actionable recommendations</li>
                    <li>• Downloadable reports</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FurtherResearch;