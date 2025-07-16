import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';

interface BotDiscoveryProps {}

type BotCategory = 'education' | 'fitness' | 'business' | 'creative' | 'productivity' | 'entertainment';

interface Bot {
  id: string;
  name: string;
  description: string;
  category: BotCategory;
  icon: string;
  tags: string[];
  rating: number;
  usageCount: number;
  featured: boolean;
}

const categories = [
  { id: 'education', label: 'Education', icon: '🎓', color: 'bg-blue-500' },
  { id: 'fitness', label: 'Fitness', icon: '💪', color: 'bg-green-500' },
  { id: 'business', label: 'Business', icon: '💼', color: 'bg-purple-500' },
  { id: 'creative', label: 'Creative', icon: '🎨', color: 'bg-pink-500' },
  { id: 'productivity', label: 'Productivity', icon: '⚡', color: 'bg-yellow-500' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎮', color: 'bg-red-500' },
];

const sampleBots: Bot[] = [
  // Education Bots
  {
    id: 'homework-helper',
    name: 'Homework Helper',
    description: 'Get step-by-step solutions for math, science, and other subjects',
    category: 'education',
    icon: '📚',
    tags: ['math', 'science', 'homework', 'tutoring'],
    rating: 4.8,
    usageCount: 15420,
    featured: true,
  },
  {
    id: 'language-tutor',
    name: 'Language Tutor',
    description: 'Practice conversations and learn new languages with AI guidance',
    category: 'education',
    icon: '🗣️',
    tags: ['language', 'conversation', 'learning'],
    rating: 4.7,
    usageCount: 8930,
    featured: false,
  },
  {
    id: 'study-planner',
    name: 'Study Planner',
    description: 'Create personalized study schedules and track your progress',
    category: 'education',
    icon: '📅',
    tags: ['planning', 'schedule', 'study'],
    rating: 4.6,
    usageCount: 6750,
    featured: false,
  },
  
  // Fitness Bots
  {
    id: 'workout-coach',
    name: 'Personal Workout Coach',
    description: 'Get customized workout plans based on your fitness goals',
    category: 'fitness',
    icon: '🏋️',
    tags: ['workout', 'fitness', 'exercise', 'health'],
    rating: 4.9,
    usageCount: 12340,
    featured: true,
  },
  {
    id: 'nutrition-advisor',
    name: 'Nutrition Advisor',
    description: 'Receive meal plans and nutritional guidance for healthy living',
    category: 'fitness',
    icon: '🥗',
    tags: ['nutrition', 'diet', 'health', 'meals'],
    rating: 4.5,
    usageCount: 9870,
    featured: false,
  },
  {
    id: 'yoga-instructor',
    name: 'Yoga Instructor',
    description: 'Learn yoga poses and meditation techniques for mind-body wellness',
    category: 'fitness',
    icon: '🧘',
    tags: ['yoga', 'meditation', 'wellness'],
    rating: 4.7,
    usageCount: 5420,
    featured: false,
  },
  
  // Business Bots
  {
    id: 'sales-script-writer',
    name: 'Sales Script Writer',
    description: 'Generate compelling sales scripts and pitch presentations',
    category: 'business',
    icon: '📈',
    tags: ['sales', 'scripts', 'presentations', 'marketing'],
    rating: 4.6,
    usageCount: 7890,
    featured: true,
  },
  {
    id: 'business-analyst',
    name: 'Business Analyst',
    description: 'Analyze market trends and provide business insights',
    category: 'business',
    icon: '📊',
    tags: ['analysis', 'market', 'insights', 'strategy'],
    rating: 4.8,
    usageCount: 4560,
    featured: false,
  },
  {
    id: 'email-assistant',
    name: 'Email Assistant',
    description: 'Craft professional emails and manage communication effectively',
    category: 'business',
    icon: '📧',
    tags: ['email', 'communication', 'professional'],
    rating: 4.4,
    usageCount: 11230,
    featured: false,
  },
  
  // Creative Bots
  {
    id: 'story-writer',
    name: 'Creative Story Writer',
    description: 'Generate creative stories, poems, and fictional content',
    category: 'creative',
    icon: '✍️',
    tags: ['writing', 'stories', 'creative', 'fiction'],
    rating: 4.7,
    usageCount: 8760,
    featured: false,
  },
  {
    id: 'design-consultant',
    name: 'Design Consultant',
    description: 'Get design advice for graphics, layouts, and visual projects',
    category: 'creative',
    icon: '🎨',
    tags: ['design', 'graphics', 'visual', 'creative'],
    rating: 4.5,
    usageCount: 6540,
    featured: false,
  },
  
  // Productivity Bots
  {
    id: 'task-manager',
    name: 'Smart Task Manager',
    description: 'Organize tasks, set priorities, and boost your productivity',
    category: 'productivity',
    icon: '✅',
    tags: ['tasks', 'productivity', 'organization'],
    rating: 4.6,
    usageCount: 9340,
    featured: false,
  },
  {
    id: 'meeting-assistant',
    name: 'Meeting Assistant',
    description: 'Prepare agendas, take notes, and follow up on action items',
    category: 'productivity',
    icon: '🤝',
    tags: ['meetings', 'notes', 'agenda', 'productivity'],
    rating: 4.8,
    usageCount: 5670,
    featured: true,
  },
  
  // Entertainment Bots
  {
    id: 'trivia-master',
    name: 'Trivia Master',
    description: 'Challenge yourself with trivia questions across various topics',
    category: 'entertainment',
    icon: '🧠',
    tags: ['trivia', 'quiz', 'games', 'knowledge'],
    rating: 4.3,
    usageCount: 12890,
    featured: false,
  },
  {
    id: 'joke-generator',
    name: 'Joke Generator',
    description: 'Get funny jokes, puns, and humorous content for any occasion',
    category: 'entertainment',
    icon: '😄',
    tags: ['jokes', 'humor', 'entertainment', 'fun'],
    rating: 4.2,
    usageCount: 18760,
    featured: false,
  },
];

export const BotDiscovery: React.FC<BotDiscoveryProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<BotCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');

  const filteredBots = sampleBots.filter(bot => {
    const matchesCategory = selectedCategory === 'all' || bot.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const sortedBots = [...filteredBots].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.usageCount - a.usageCount;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return a.name.localeCompare(b.name); // Placeholder for actual date sorting
      default:
        return 0;
    }
  });

  const featuredBots = sampleBots.filter(bot => bot.featured);

  const handleBotSelect = (bot: Bot) => {
    // In a real implementation, this would navigate to the bot or start a conversation
    console.log('Selected bot:', bot);
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
              variants={doubaoAnimations.fadeInUp}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <h1 className="doubao-text-2xl text-doubao-text-primary mb-2">
                🤖 Bot Discovery
              </h1>
              <p className="doubao-text-base text-doubao-text-secondary">
                Discover specialized AI bots for education, fitness, business, and more. Find the perfect assistant for your needs.
              </p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              variants={doubaoAnimations.fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="doubao-card-base p-6 mb-6"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bots by name, description, or tags..."
                    className="w-full doubao-input-base"
                  />
                </div>
                
                {/* Sort */}
                <div className="flex gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'popular' | 'rating' | 'newest')}
                    className="doubao-input-base min-w-[140px]"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Category Filters */}
            <motion.div
              variants={doubaoAnimations.fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex flex-wrap gap-3">
                <motion.button
                  variants={doubaoAnimations.buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    'px-4 py-2 rounded-full border doubao-transition-colors',
                    selectedCategory === 'all'
                      ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10 text-doubao-primary-blue'
                      : 'border-doubao-border-light hover:border-doubao-border-medium text-doubao-text-secondary'
                  )}
                >
                  All Categories
                </motion.button>
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    variants={doubaoAnimations.buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setSelectedCategory(category.id as BotCategory)}
                    className={cn(
                      'px-4 py-2 rounded-full border doubao-transition-colors flex items-center gap-2',
                      selectedCategory === category.id
                        ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10 text-doubao-primary-blue'
                        : 'border-doubao-border-light hover:border-doubao-border-medium text-doubao-text-secondary'
                    )}
                  >
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Featured Bots */}
            {selectedCategory === 'all' && (
              <motion.div
                variants={doubaoAnimations.fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <h2 className="doubao-text-xl font-semibold text-doubao-text-primary mb-4">
                  ⭐ Featured Bots
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredBots.map((bot, index) => (
                    <motion.div
                      key={bot.id}
                      variants={doubaoAnimations.fadeInUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.1 * index }}
                      className="doubao-card-base p-6 cursor-pointer hover:shadow-lg doubao-transition-all"
                      onClick={() => handleBotSelect(bot)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{bot.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="doubao-text-base font-semibold text-doubao-text-primary">
                              {bot.name}
                            </h3>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Featured
                            </span>
                          </div>
                          <p className="doubao-text-sm text-doubao-text-secondary mb-3">
                            {bot.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">⭐</span>
                              <span className="doubao-text-sm text-doubao-text-primary">
                                {bot.rating}
                              </span>
                            </div>
                            <div className="doubao-text-xs text-doubao-text-muted">
                              {bot.usageCount.toLocaleString()} uses
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* All Bots Grid */}
            <motion.div
              variants={doubaoAnimations.fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="doubao-text-xl font-semibold text-doubao-text-primary">
                  {selectedCategory === 'all' ? 'All Bots' : `${categories.find(c => c.id === selectedCategory)?.label} Bots`}
                </h2>
                <div className="doubao-text-sm text-doubao-text-muted">
                  {sortedBots.length} bot{sortedBots.length !== 1 ? 's' : ''} found
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedBots.map((bot, index) => (
                  <motion.div
                    key={bot.id}
                    variants={doubaoAnimations.fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.05 * index }}
                    className="doubao-card-base p-6 cursor-pointer hover:shadow-lg doubao-transition-all group"
                    onClick={() => handleBotSelect(bot)}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{bot.icon}</div>
                      <h3 className="doubao-text-base font-semibold text-doubao-text-primary mb-2 group-hover:text-doubao-primary-blue doubao-transition-colors">
                        {bot.name}
                      </h3>
                      <p className="doubao-text-sm text-doubao-text-secondary mb-4 line-clamp-2">
                        {bot.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4 justify-center">
                        {bot.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-doubao-bg-secondary text-doubao-text-muted text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {bot.tags.length > 3 && (
                          <span className="px-2 py-1 bg-doubao-bg-secondary text-doubao-text-muted text-xs rounded-full">
                            +{bot.tags.length - 3}
                          </span>
                        )}
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-doubao-text-primary">{bot.rating}</span>
                        </div>
                        <div className="text-doubao-text-muted">
                          {bot.usageCount > 1000 
                            ? `${(bot.usageCount / 1000).toFixed(1)}k` 
                            : bot.usageCount} uses
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {sortedBots.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-2">
                    No bots found
                  </h3>
                  <p className="doubao-text-base text-doubao-text-secondary">
                    Try adjusting your search or category filters
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </DoubaoMainLayout>
  );
};

export default BotDiscovery;