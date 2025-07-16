import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';
import { useNotifications } from '@/hooks/useNotifications';

interface AISearchProps {}

type SearchCategory = 'all' | 'news' | 'sports' | 'entertainment' | 'technology' | 'business' | 'science' | 'health';

const searchCategories = [
  { id: 'all', label: 'All', icon: '🌐', description: 'Search across all categories' },
  { id: 'news', label: 'News', icon: '📰', description: 'Latest news and current events' },
  { id: 'sports', label: 'Sports', icon: '⚽', description: 'Sports matches, scores, and updates' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', description: 'Celebrity news, movies, TV shows' },
  { id: 'technology', label: 'Technology', icon: '💻', description: 'Tech news, gadgets, innovations' },
  { id: 'business', label: 'Business', icon: '💼', description: 'Market news, company updates' },
  { id: 'science', label: 'Science', icon: '🔬', description: 'Scientific discoveries and research' },
  { id: 'health', label: 'Health', icon: '🏥', description: 'Health news and medical updates' },
];

const trendingTopics = [
  { title: 'AI Technology Breakthrough', category: 'Technology', time: '2 hours ago' },
  { title: 'Global Climate Summit 2024', category: 'News', time: '4 hours ago' },
  { title: 'Championship Finals Results', category: 'Sports', time: '6 hours ago' },
  { title: 'New Medical Research', category: 'Health', time: '8 hours ago' },
  { title: 'Stock Market Update', category: 'Business', time: '1 day ago' },
];

const quickSearches = [
  'Latest AI developments',
  'Climate change news',
  'Stock market trends',
  'Sports scores today',
  'Celebrity news',
  'Tech product launches',
  'Health research updates',
  'Global events',
];

export const AISearch: React.FC<AISearchProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { hasNotifications } = useNotifications();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate search process
    setTimeout(() => {
      setSearchResults([
        {
          id: 1,
          title: 'Breaking: Major AI Breakthrough Announced',
          summary: 'Researchers have developed a new AI model that shows significant improvements in natural language understanding...',
          source: 'Tech News Daily',
          category: 'Technology',
          time: '1 hour ago',
          url: '#'
        },
        {
          id: 2,
          title: 'Global Climate Summit Reaches Historic Agreement',
          summary: 'World leaders have agreed on new climate targets and funding mechanisms for developing countries...',
          source: 'Global News Network',
          category: 'News',
          time: '3 hours ago',
          url: '#'
        },
        {
          id: 3,
          title: 'Championship Match Ends in Dramatic Victory',
          summary: 'The final match saw an incredible comeback in the last quarter, with the home team securing victory...',
          source: 'Sports Central',
          category: 'Sports',
          time: '5 hours ago',
          url: '#'
        }
      ]);
      setIsSearching(false);
    }, 2000);
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    // Auto-trigger search
    setTimeout(() => handleSearch(), 100);
  };

  return (
    <DoubaoMainLayout>
      <div className="flex flex-col h-full">
        <DoubaoHeader 
          showSidebarToggle={true}
          hasNotifications={hasNotifications}
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <motion.div
              variants={doubaoAnimations.messageVariants}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <h1 className="doubao-text-2xl text-doubao-text-primary mb-2">
                🔍 AI Search
              </h1>
              <p className="doubao-text-base text-doubao-text-secondary">
                Real-time multi-source information integration across news, events, and data from different fields.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              variants={doubaoAnimations.staggerItem}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="doubao-card-base p-6 mb-6"
            >
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for news, events, data, and more..."
                    className="w-full doubao-input-base text-lg py-4"
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
                    'doubao-button-primary px-8 py-4 text-lg',
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
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Categories */}
                <motion.div
                  variants={doubaoAnimations.staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {searchCategories.map((category) => (
                      <motion.button
                        key={category.id}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedCategory(category.id as SearchCategory)}
                        className={cn(
                          'w-full p-3 rounded-lg border text-left doubao-transition-colors',
                          selectedCategory === category.id
                            ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                            : 'border-doubao-border-light hover:border-doubao-border-medium'
                        )}
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-lg">{category.icon}</span>
                          <span className="doubao-text-sm font-medium text-doubao-text-primary">
                            {category.label}
                          </span>
                        </div>
                        <div className="doubao-text-xs text-doubao-text-muted ml-8">
                          {category.description}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Trending Topics */}
                <motion.div
                  variants={doubaoAnimations.staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    🔥 Trending
                  </h3>
                  <div className="space-y-3">
                    {trendingTopics.map((topic, index) => (
                      <motion.button
                        key={index}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleQuickSearch(topic.title)}
                        className="w-full p-3 bg-doubao-bg-secondary rounded-lg hover:bg-doubao-hover doubao-transition-colors text-left"
                      >
                        <div className="doubao-text-sm font-medium text-doubao-text-primary mb-1">
                          {topic.title}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="doubao-text-xs text-doubao-text-muted">
                            {topic.category}
                          </span>
                          <span className="doubao-text-xs text-doubao-text-muted">
                            {topic.time}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                {/* Quick Searches */}
                {!searchResults.length && (
                  <motion.div
                    variants={doubaoAnimations.staggerItem}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 }}
                    className="doubao-card-base p-6"
                  >
                    <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                      Quick Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {quickSearches.map((search, index) => (
                        <motion.button
                          key={index}
                          variants={doubaoAnimations.buttonVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => handleQuickSearch(search)}
                          className="px-4 py-2 bg-doubao-bg-secondary rounded-full hover:bg-doubao-hover doubao-transition-colors"
                        >
                          <span className="doubao-text-sm text-doubao-text-primary">
                            {search}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <motion.div
                    variants={doubaoAnimations.staggerItem}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="doubao-text-lg font-semibold text-doubao-text-primary">
                        Search Results
                      </h3>
                      <span className="doubao-text-sm text-doubao-text-muted">
                        {searchResults.length} results found
                      </span>
                    </div>
                    
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        variants={doubaoAnimations.staggerItem}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 * index }}
                        className="doubao-card-base p-6 hover:doubao-shadow-medium doubao-transition-all cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="doubao-text-lg font-semibold text-doubao-text-primary">
                            {result.title}
                          </h4>
                          <span className="doubao-text-xs text-doubao-text-muted bg-doubao-bg-secondary px-2 py-1 rounded">
                            {result.category}
                          </span>
                        </div>
                        
                        <p className="doubao-text-base text-doubao-text-secondary mb-4 leading-relaxed">
                          {result.summary}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="doubao-text-sm font-medium text-doubao-text-primary">
                              {result.source}
                            </span>
                            <span className="doubao-text-sm text-doubao-text-muted">
                              • {result.time}
                            </span>
                          </div>
                          <motion.button
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            className="doubao-button-secondary px-4 py-2"
                          >
                            Read More
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Real-time Updates */}
                <motion.div
                  variants={doubaoAnimations.staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    📡 Real-time Updates
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-doubao-bg-secondary rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <div className="doubao-text-sm font-medium text-doubao-text-primary">
                          Live monitoring active
                        </div>
                        <div className="doubao-text-xs text-doubao-text-muted">
                          Scanning 1,247 sources for real-time updates
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-doubao-bg-secondary rounded-lg">
                        <div className="doubao-text-lg font-bold text-doubao-primary-blue">
                          1.2K
                        </div>
                        <div className="doubao-text-xs text-doubao-text-muted">
                          News Articles
                        </div>
                      </div>
                      <div className="text-center p-3 bg-doubao-bg-secondary rounded-lg">
                        <div className="doubao-text-lg font-bold text-doubao-primary-blue">
                          847
                        </div>
                        <div className="doubao-text-xs text-doubao-text-muted">
                          Sports Updates
                        </div>
                      </div>
                      <div className="text-center p-3 bg-doubao-bg-secondary rounded-lg">
                        <div className="doubao-text-lg font-bold text-doubao-primary-blue">
                          623
                        </div>
                        <div className="doubao-text-xs text-doubao-text-muted">
                          Tech News
                        </div>
                      </div>
                      <div className="text-center p-3 bg-doubao-bg-secondary rounded-lg">
                        <div className="doubao-text-lg font-bold text-doubao-primary-blue">
                          456
                        </div>
                        <div className="doubao-text-xs text-doubao-text-muted">
                          Global Events
                        </div>
                      </div>
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

export default AISearch;