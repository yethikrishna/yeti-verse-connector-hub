import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';
import { useNotifications } from '@/hooks/useNotifications';
import { Search, Plus, Filter, BookOpen, Zap, Code, FileText, MessageSquare, Sparkles } from 'lucide-react';

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  tags: string[];
  content: string;
  usageCount: number;
}

const categories = [
  'All',
  'Writing',
  'Coding',
  'Analysis',
  'Creative',
  'Business',
  'Education'
];

const sampleTemplates: PromptTemplate[] = [
  {
    id: '1',
    title: 'Blog Post Writer',
    description: 'Generate engaging blog posts on any topic with SEO optimization',
    category: 'Writing',
    icon: '📝',
    tags: ['blog', 'seo', 'content'],
    content: 'Write a comprehensive blog post about {topic}. Include an engaging introduction, well-structured main points, and a compelling conclusion. Optimize for SEO with relevant keywords.',
    usageCount: 1250
  },
  {
    id: '2',
    title: 'Code Reviewer',
    description: 'Review code for best practices, bugs, and improvements',
    category: 'Coding',
    icon: '🔍',
    tags: ['code', 'review', 'debugging'],
    content: 'Review the following code for:\n1. Best practices\n2. Potential bugs\n3. Performance improvements\n4. Security issues\n\nCode:\n{code}',
    usageCount: 890
  },
  {
    id: '3',
    title: 'Data Analyst',
    description: 'Analyze data patterns and provide insights',
    category: 'Analysis',
    icon: '📊',
    tags: ['data', 'analysis', 'insights'],
    content: 'Analyze the following data and provide:\n1. Key patterns and trends\n2. Statistical insights\n3. Actionable recommendations\n\nData: {data}',
    usageCount: 675
  },
  {
    id: '4',
    title: 'Creative Story Writer',
    description: 'Create engaging stories with compelling characters',
    category: 'Creative',
    icon: '✨',
    tags: ['story', 'creative', 'fiction'],
    content: 'Write a creative story about {theme}. Include:\n1. Compelling characters\n2. Engaging plot\n3. Vivid descriptions\n4. Satisfying conclusion',
    usageCount: 543
  },
  {
    id: '5',
    title: 'Business Plan Generator',
    description: 'Create comprehensive business plans and strategies',
    category: 'Business',
    icon: '💼',
    tags: ['business', 'strategy', 'planning'],
    content: 'Create a business plan for {business_idea}. Include:\n1. Executive summary\n2. Market analysis\n3. Financial projections\n4. Marketing strategy',
    usageCount: 432
  },
  {
    id: '6',
    title: 'Learning Tutor',
    description: 'Explain complex topics in simple, understandable terms',
    category: 'Education',
    icon: '🎓',
    tags: ['education', 'learning', 'explanation'],
    content: 'Explain {topic} in a clear, educational manner:\n1. Start with basic concepts\n2. Use analogies and examples\n3. Break down complex ideas\n4. Provide practice questions',
    usageCount: 789
  }
];

export const DoubaoPromptTemplates: React.FC = () => {
  const [templates] = useState<PromptTemplate[]>(sampleTemplates);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const { hasNotifications } = useNotifications();

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = useCallback((template: PromptTemplate) => {
    setSelectedTemplate(template);
  }, []);

  const handleUseTemplate = useCallback((template: PromptTemplate) => {
    // In a real implementation, this would navigate to chat with the template pre-filled
    console.log('Using template:', template.title);
  }, []);

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
              📋 Prompt Templates
            </h1>
            <p className="doubao-text-base text-doubao-text-secondary">
              Ready-to-use prompt templates for various tasks and workflows
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
                placeholder="Search templates..."
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

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                variants={doubaoAnimations.staggerItem}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 + index * 0.05 }}
                className="doubao-card-base p-6 hover:shadow-lg doubao-transition-all cursor-pointer"
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{template.icon}</div>
                  <div className="text-xs text-doubao-text-muted">
                    {template.usageCount} uses
                  </div>
                </div>

                <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-2">
                  {template.title}
                </h3>
                
                <p className="doubao-text-sm text-doubao-text-secondary mb-4 line-clamp-2">
                  {template.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-doubao-bg-secondary text-doubao-text-muted text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <motion.button
                    variants={doubaoAnimations.buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseTemplate(template);
                    }}
                    className="flex-1 doubao-button-primary py-2 text-sm"
                  >
                    Use Template
                  </motion.button>
                  <motion.button
                    variants={doubaoAnimations.buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTemplate(template);
                    }}
                    className="px-3 py-2 border border-doubao-border-light rounded-lg hover:bg-doubao-hover doubao-transition-colors"
                  >
                    <BookOpen className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Create New Template Button */}
          <motion.div
            variants={doubaoAnimations.staggerItem}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <motion.button
              variants={doubaoAnimations.buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="doubao-button-secondary px-6 py-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Template
            </motion.button>
          </motion.div>

          {/* Template Preview Modal */}
          {selectedTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedTemplate(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{selectedTemplate.icon}</div>
                      <div>
                        <h2 className="doubao-text-xl font-semibold text-doubao-text-primary">
                          {selectedTemplate.title}
                        </h2>
                        <p className="doubao-text-sm text-doubao-text-secondary">
                          {selectedTemplate.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className="p-2 hover:bg-doubao-hover rounded-lg doubao-transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mb-4">
                    <h3 className="doubao-text-sm font-medium text-doubao-text-primary mb-2">
                      Template Content:
                    </h3>
                    <div className="bg-doubao-bg-secondary p-4 rounded-lg">
                      <pre className="doubao-text-sm text-doubao-text-primary whitespace-pre-wrap">
                        {selectedTemplate.content}
                      </pre>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      variants={doubaoAnimations.buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleUseTemplate(selectedTemplate)}
                      className="flex-1 doubao-button-primary py-3"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Use This Template
                    </motion.button>
                    <motion.button
                      variants={doubaoAnimations.buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      className="px-4 py-3 border border-doubao-border-light rounded-lg hover:bg-doubao-hover doubao-transition-colors"
                    >
                      <Code className="h-4 w-4" />
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

export default DoubaoPromptTemplates;