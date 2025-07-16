import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';

interface AcademicSearchProps {}

type ResourceType = 'paper' | 'journal' | 'conference' | 'book' | 'thesis';
type AcademicField = 'physics' | 'medicine' | 'social-sciences' | 'computer-science' | 'biology' | 'chemistry' | 'mathematics' | 'engineering' | 'psychology' | 'economics';
type SortBy = 'relevance' | 'date' | 'citations' | 'title';
type TimeRange = 'all' | 'last-year' | 'last-5-years' | 'last-10-years';

interface AcademicResult {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  type: ResourceType;
  field: AcademicField;
  publicationDate: Date;
  journal?: string;
  conference?: string;
  citations: number;
  doi?: string;
  url: string;
  keywords: string[];
  relevanceScore: number;
}

const resourceTypes = [
  { id: 'paper', label: 'Research Papers', icon: '📄', description: 'Peer-reviewed research articles' },
  { id: 'journal', label: 'Journal Articles', icon: '📚', description: 'Published journal articles' },
  { id: 'conference', label: 'Conference Papers', icon: '🎤', description: 'Conference proceedings and presentations' },
  { id: 'book', label: 'Academic Books', icon: '📖', description: 'Academic textbooks and monographs' },
  { id: 'thesis', label: 'Theses', icon: '🎓', description: 'Doctoral and master\'s theses' },
];

const academicFields = [
  { id: 'physics', label: 'Physics', icon: '⚛️', color: 'bg-blue-500' },
  { id: 'medicine', label: 'Medicine', icon: '🏥', color: 'bg-red-500' },
  { id: 'social-sciences', label: 'Social Sciences', icon: '👥', color: 'bg-green-500' },
  { id: 'computer-science', label: 'Computer Science', icon: '💻', color: 'bg-purple-500' },
  { id: 'biology', label: 'Biology', icon: '🧬', color: 'bg-emerald-500' },
  { id: 'chemistry', label: 'Chemistry', icon: '🧪', color: 'bg-orange-500' },
  { id: 'mathematics', label: 'Mathematics', icon: '📐', color: 'bg-indigo-500' },
  { id: 'engineering', label: 'Engineering', icon: '⚙️', color: 'bg-gray-500' },
  { id: 'psychology', label: 'Psychology', icon: '🧠', color: 'bg-pink-500' },
  { id: 'economics', label: 'Economics', icon: '📈', color: 'bg-yellow-500' },
];

// Sample academic results
const sampleResults: AcademicResult[] = [
  {
    id: '1',
    title: 'Deep Learning Approaches for Natural Language Processing: A Comprehensive Survey',
    authors: ['Zhang, L.', 'Wang, M.', 'Chen, X.'],
    abstract: 'This paper presents a comprehensive survey of deep learning approaches in natural language processing, covering recent advances in transformer architectures, attention mechanisms, and their applications in various NLP tasks including machine translation, sentiment analysis, and question answering.',
    type: 'paper',
    field: 'computer-science',
    publicationDate: new Date('2023-08-15'),
    journal: 'Journal of Artificial Intelligence Research',
    citations: 342,
    doi: '10.1613/jair.1.13456',
    url: 'https://example.com/paper1',
    keywords: ['deep learning', 'NLP', 'transformers', 'attention mechanism'],
    relevanceScore: 0.95,
  },
  {
    id: '2',
    title: 'Quantum Computing Applications in Cryptography and Security',
    authors: ['Smith, J.', 'Johnson, R.', 'Brown, A.', 'Davis, K.'],
    abstract: 'We explore the implications of quantum computing on modern cryptographic systems, analyzing both the threats posed by quantum algorithms and the opportunities for quantum-resistant security protocols.',
    type: 'conference',
    field: 'physics',
    publicationDate: new Date('2023-06-20'),
    conference: 'International Conference on Quantum Computing',
    citations: 128,
    doi: '10.1109/ICQC.2023.456789',
    url: 'https://example.com/paper2',
    keywords: ['quantum computing', 'cryptography', 'security', 'quantum algorithms'],
    relevanceScore: 0.88,
  },
  {
    id: '3',
    title: 'CRISPR-Cas9 Gene Editing: Recent Advances and Therapeutic Applications',
    authors: ['Martinez, C.', 'Thompson, S.', 'Lee, H.'],
    abstract: 'This review examines recent developments in CRISPR-Cas9 technology, focusing on improved precision, reduced off-target effects, and emerging therapeutic applications in treating genetic disorders.',
    type: 'journal',
    field: 'biology',
    publicationDate: new Date('2023-09-10'),
    journal: 'Nature Biotechnology',
    citations: 567,
    doi: '10.1038/nbt.4567',
    url: 'https://example.com/paper3',
    keywords: ['CRISPR', 'gene editing', 'therapeutics', 'genetic disorders'],
    relevanceScore: 0.92,
  },
  {
    id: '4',
    title: 'Climate Change Impact on Global Food Security: A Meta-Analysis',
    authors: ['Wilson, P.', 'Garcia, M.', 'Anderson, T.'],
    abstract: 'Through meta-analysis of 150 studies, we assess the impact of climate change on global food security, examining crop yields, nutritional quality, and regional variations in agricultural productivity.',
    type: 'paper',
    field: 'social-sciences',
    publicationDate: new Date('2023-07-05'),
    journal: 'Environmental Research Letters',
    citations: 234,
    doi: '10.1088/1748-9326/abc123',
    url: 'https://example.com/paper4',
    keywords: ['climate change', 'food security', 'agriculture', 'meta-analysis'],
    relevanceScore: 0.85,
  },
  {
    id: '5',
    title: 'Novel Drug Delivery Systems for Cancer Therapy: Nanoparticle Approaches',
    authors: ['Kumar, A.', 'Patel, N.', 'Singh, R.'],
    abstract: 'We present innovative nanoparticle-based drug delivery systems designed to improve cancer treatment efficacy while minimizing side effects through targeted delivery mechanisms.',
    type: 'paper',
    field: 'medicine',
    publicationDate: new Date('2023-05-18'),
    journal: 'Advanced Drug Delivery Reviews',
    citations: 189,
    doi: '10.1016/j.addr.2023.789',
    url: 'https://example.com/paper5',
    keywords: ['drug delivery', 'nanoparticles', 'cancer therapy', 'targeted delivery'],
    relevanceScore: 0.90,
  },
  {
    id: '6',
    title: 'Machine Learning in Financial Risk Assessment: Challenges and Opportunities',
    authors: ['Taylor, M.', 'White, J.', 'Clark, D.'],
    abstract: 'This study examines the application of machine learning techniques in financial risk assessment, discussing implementation challenges, regulatory considerations, and future opportunities.',
    type: 'conference',
    field: 'economics',
    publicationDate: new Date('2023-04-12'),
    conference: 'International Conference on Financial Engineering',
    citations: 95,
    doi: '10.1145/3456789.3456790',
    url: 'https://example.com/paper6',
    keywords: ['machine learning', 'financial risk', 'assessment', 'regulation'],
    relevanceScore: 0.82,
  },
];

export const AcademicSearch: React.FC<AcademicSearchProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResourceTypes, setSelectedResourceTypes] = useState<ResourceType[]>(['paper', 'journal']);
  const [selectedFields, setSelectedFields] = useState<AcademicField[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('relevance');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [results, setResults] = useState<AcademicResult[]>(sampleResults);
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search process
    setTimeout(() => {
      // Filter and sort results based on current criteria
      let filteredResults = sampleResults.filter(result => {
        const matchesQuery = searchQuery === '' || 
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
          result.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesResourceType = selectedResourceTypes.length === 0 || selectedResourceTypes.includes(result.type);
        const matchesField = selectedFields.length === 0 || selectedFields.includes(result.field);
        
        const matchesTimeRange = (() => {
          if (timeRange === 'all') return true;
          const now = new Date();
          const yearsDiff = now.getFullYear() - result.publicationDate.getFullYear();
          
          switch (timeRange) {
            case 'last-year': return yearsDiff <= 1;
            case 'last-5-years': return yearsDiff <= 5;
            case 'last-10-years': return yearsDiff <= 10;
            default: return true;
          }
        })();
        
        return matchesQuery && matchesResourceType && matchesField && matchesTimeRange;
      });

      // Sort results
      filteredResults.sort((a, b) => {
        switch (sortBy) {
          case 'relevance':
            return b.relevanceScore - a.relevanceScore;
          case 'date':
            return b.publicationDate.getTime() - a.publicationDate.getTime();
          case 'citations':
            return b.citations - a.citations;
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });

      setResults(filteredResults);
      setIsSearching(false);
    }, 1500);
  };

  const handleResourceTypeToggle = (type: ResourceType) => {
    setSelectedResourceTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleFieldToggle = (field: AcademicField) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getResourceTypeIcon = (type: ResourceType): string => {
    return resourceTypes.find(rt => rt.id === type)?.icon || '📄';
  };

  const getFieldInfo = (field: AcademicField) => {
    return academicFields.find(af => af.id === field);
  };

  return (
    <DoubaoMainLayout>
      <div className="flex flex-col h-full">
        <DoubaoHeader 
          showSidebarToggle={true}
          hasNotifications={false}
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <motion.div
              variants={doubaoAnimations.pageVariants}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <h1 className="doubao-text-2xl text-doubao-text-primary mb-2">
                🎓 Academic Search
              </h1>
              <p className="doubao-text-base text-doubao-text-secondary">
                Search through millions of academic papers, journals, and conference proceedings across all fields of study.
              </p>
            </motion.div>

            {/* Search Interface */}
            <motion.div
              variants={doubaoAnimations.pageVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="doubao-card-base p-6 mb-6"
            >
              <div className="space-y-4">
                {/* Main Search */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for papers, authors, keywords, or topics..."
                      className="w-full doubao-input-base text-lg py-3"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <motion.button
                    variants={doubaoAnimations.buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isSearching}
                    className={cn(
                      'doubao-button-primary px-8 py-3 text-lg',
                      (!searchQuery.trim() || isSearching) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isSearching ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Searching...
                      </div>
                    ) : (
                      '🔍 Search'
                    )}
                  </motion.button>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="doubao-text-sm font-medium text-doubao-text-primary">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                      className="doubao-input-base py-1 text-sm"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="date">Publication Date</option>
                      <option value="citations">Citations</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="doubao-text-sm font-medium text-doubao-text-primary">Time:</span>
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                      className="doubao-input-base py-1 text-sm"
                    >
                      <option value="all">All Time</option>
                      <option value="last-year">Last Year</option>
                      <option value="last-5-years">Last 5 Years</option>
                      <option value="last-10-years">Last 10 Years</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="doubao-text-sm text-doubao-primary-blue hover:underline"
                  >
                    {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                  </button>
                </div>

                {/* Advanced Filters */}
                {showAdvancedFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-4 border-t border-doubao-border-light"
                  >
                    {/* Resource Types */}
                    <div>
                      <h4 className="doubao-text-sm font-medium text-doubao-text-primary mb-3">
                        Resource Types
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {resourceTypes.map((type) => (
                          <motion.button
                            key={type.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => handleResourceTypeToggle(type.id as ResourceType)}
                            className={cn(
                              'px-3 py-2 rounded-full border doubao-transition-colors flex items-center gap-2',
                              selectedResourceTypes.includes(type.id as ResourceType)
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10 text-doubao-primary-blue'
                                : 'border-doubao-border-light hover:border-doubao-border-medium text-doubao-text-secondary'
                            )}
                          >
                            <span>{type.icon}</span>
                            <span className="doubao-text-sm">{type.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Academic Fields */}
                    <div>
                      <h4 className="doubao-text-sm font-medium text-doubao-text-primary mb-3">
                        Academic Fields
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {academicFields.map((field) => (
                          <motion.button
                            key={field.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => handleFieldToggle(field.id as AcademicField)}
                            className={cn(
                              'px-3 py-2 rounded-full border doubao-transition-colors flex items-center gap-2',
                              selectedFields.includes(field.id as AcademicField)
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10 text-doubao-primary-blue'
                                : 'border-doubao-border-light hover:border-doubao-border-medium text-doubao-text-secondary'
                            )}
                          >
                            <span>{field.icon}</span>
                            <span className="doubao-text-sm">{field.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              variants={doubaoAnimations.pageVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="doubao-text-xl font-semibold text-doubao-text-primary">
                  Search Results
                </h2>
                <div className="doubao-text-sm text-doubao-text-muted">
                  {results.length} result{results.length !== 1 ? 's' : ''} found
                </div>
              </div>

              <div className="space-y-4">
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    variants={doubaoAnimations.staggerItem}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.05 * index }}
                    className="doubao-card-base p-6 hover:shadow-lg doubao-transition-all cursor-pointer"
                    onClick={() => window.open(result.url, '_blank')}
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{getResourceTypeIcon(result.type)}</span>
                            <span className="doubao-text-xs px-2 py-1 bg-doubao-bg-secondary rounded-full text-doubao-text-muted">
                              {resourceTypes.find(rt => rt.id === result.type)?.label}
                            </span>
                            {getFieldInfo(result.field) && (
                              <span className={cn(
                                'doubao-text-xs px-2 py-1 rounded-full text-white',
                                getFieldInfo(result.field)?.color
                              )}>
                                {getFieldInfo(result.field)?.icon} {getFieldInfo(result.field)?.label}
                              </span>
                            )}
                          </div>
                          <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-2 hover:text-doubao-primary-blue doubao-transition-colors">
                            {result.title}
                          </h3>
                          <div className="doubao-text-sm text-doubao-text-secondary mb-2">
                            {result.authors.join(', ')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="doubao-text-sm font-medium text-doubao-text-primary">
                            {result.citations} citations
                          </div>
                          <div className="doubao-text-xs text-doubao-text-muted">
                            {formatDate(result.publicationDate)}
                          </div>
                        </div>
                      </div>

                      {/* Abstract */}
                      <p className="doubao-text-sm text-doubao-text-secondary line-clamp-3">
                        {result.abstract}
                      </p>

                      {/* Publication Info */}
                      <div className="flex items-center justify-between">
                        <div className="doubao-text-sm text-doubao-text-muted">
                          {result.journal && `Published in ${result.journal}`}
                          {result.conference && `Presented at ${result.conference}`}
                          {result.doi && ` • DOI: ${result.doi}`}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="doubao-text-xs text-doubao-text-muted">Relevance:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={cn(
                                  'text-xs',
                                  star <= result.relevanceScore * 5 ? 'text-yellow-500' : 'text-gray-300'
                                )}
                              >
                                ⭐
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Keywords */}
                      <div className="flex flex-wrap gap-1">
                        {result.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="px-2 py-1 bg-doubao-bg-secondary text-doubao-text-muted text-xs rounded-full"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {results.length === 0 && !isSearching && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-2">
                    No results found
                  </h3>
                  <p className="doubao-text-base text-doubao-text-secondary mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <div className="space-y-2 doubao-text-sm text-doubao-text-muted">
                    <p>• Use broader keywords</p>
                    <p>• Check spelling and try synonyms</p>
                    <p>• Remove some filters to expand results</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </DoubaoMainLayout>
  );
};

export default AcademicSearch;