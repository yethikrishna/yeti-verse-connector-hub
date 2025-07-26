import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  X as Disconnect, 
  Loader2, 
  Plus as PlusCircle, 
  Settings, 
  Sparkles, 
  Zap, 
  Globe, 
  Shield 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

// Supported platforms with enhanced metadata
const SUPPORTED_PLATFORMS = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Professional networking and career development',
    category: 'Social',
    color: 'from-blue-600 to-blue-700',
    icon: '💼',
    features: ['Auto-posting', 'Connection management', 'Analytics']
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    description: 'Real-time social media engagement',
    category: 'Social',
    color: 'from-sky-500 to-sky-600',
    icon: '🐦',
    features: ['Tweet automation', 'Trend analysis', 'Engagement tracking']
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Code repository and collaboration platform',
    category: 'Development',
    color: 'from-gray-800 to-gray-900',
    icon: '💻',
    features: ['Repository management', 'Issue tracking', 'CI/CD integration']
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Social media marketing and community building',
    category: 'Social',
    color: 'from-blue-600 to-blue-800',
    icon: '📘',
    features: ['Page management', 'Audience insights', 'Ad campaigns']
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Visual content sharing and brand building',
    category: 'Social',
    color: 'from-pink-500 to-purple-600',
    icon: '📷',
    features: ['Content scheduling', 'Story automation', 'Hashtag optimization']
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication and workflow automation',
    category: 'Productivity',
    color: 'from-green-500 to-green-600',
    icon: '💬',
    features: ['Channel management', 'Bot integration', 'Workflow automation']
  }
] as const;

type Platform = typeof SUPPORTED_PLATFORMS[number];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [0, 5, 0, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function ConnectionsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(SUPPORTED_PLATFORMS.map(p => p.category)))];

  // Filter platforms by category
  const filteredPlatforms = selectedCategory === 'All' 
    ? SUPPORTED_PLATFORMS 
    : SUPPORTED_PLATFORMS.filter(p => p.category === selectedCategory);

  // Load connections on mount
  useEffect(() => {
    fetchConnectedPlatforms();
  }, []);

  // Mock fetch function - replace with actual API call
  const fetchConnectedPlatforms = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock some connected platforms
      setConnectedPlatforms(['github', 'linkedin']);
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'Failed to load your connections' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if a platform is connected
  const isPlatformConnected = (platformId: string): boolean => {
    return connectedPlatforms.includes(platformId);
  };

  // Connect to a platform
  const handleConnect = async (platform: Platform) => {
    try {
      setActionLoading(prev => ({ ...prev, [platform.id]: true }));
      
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setConnectedPlatforms(prev => [...prev, platform.id]);
      toast({ 
        title: 'Connected!', 
        description: `Successfully connected to ${platform.name}` 
      });
    } catch (error) {
      console.error(`Error connecting to ${platform.name}:`, error);
      toast({ 
        variant: 'destructive', 
        title: 'Connection failed', 
        description: `Could not connect to ${platform.name}` 
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [platform.id]: false }));
    }
  };

  // Disconnect from a platform
  const handleDisconnect = async (platform: Platform) => {
    try {
      setActionLoading(prev => ({ ...prev, [platform.id]: true }));
      
      // Simulate disconnection process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConnectedPlatforms(prev => prev.filter(id => id !== platform.id));
      toast({ 
        title: 'Disconnected', 
        description: `Successfully disconnected from ${platform.name}` 
      });
    } catch (error) {
      console.error(`Error disconnecting from ${platform.name}:`, error);
      toast({ 
        variant: 'destructive', 
        title: 'Disconnection failed', 
        description: 'Could not disconnect' 
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [platform.id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-lg">Loading your connections...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          {...floatingVariants}
          className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
        />
        <motion.div
          {...floatingVariants}
          transition={{ delay: 2, duration: 8, repeat: Infinity }}
          className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"
        />
        <motion.div
          {...floatingVariants}
          transition={{ delay: 4, duration: 10, repeat: Infinity }}
          className="absolute bottom-20 left-1/3 w-40 h-40 bg-pink-500/10 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-10 container mx-auto py-8 px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6"
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">Professional Connections Hub</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-4">
            Platform Connections
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Connect your favorite apps and services to unlock powerful automation capabilities with Grammy-winning aesthetics.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Platforms Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="wait">
            {filteredPlatforms.map((platform) => {
              const isConnected = isPlatformConnected(platform.id);
              const isLoading = actionLoading[platform.id];

              return (
                <motion.div
                  key={platform.id}
                  variants={cardVariants}
                  whileHover="hover"
                  layout
                  className="group"
                >
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:border-white/40 transition-all duration-300 overflow-hidden">
                    <CardHeader className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-r ${platform.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                      <div className="relative flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl"
                          >
                            {platform.icon}
                          </motion.div>
                          <div>
                            <CardTitle className="text-white flex items-center gap-2">
                              {platform.name}
                              {isConnected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500 }}
                                >
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                </motion.div>
                              )}
                            </CardTitle>
                            <CardDescription className="text-gray-300">
                              {platform.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="bg-white/20 text-white border-white/30"
                        >
                          {platform.category}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="relative">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Features
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {platform.features.map((feature, index) => (
                              <motion.span
                                key={feature}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-xs bg-white/10 text-gray-200 px-2 py-1 rounded-full"
                              >
                                {feature}
                              </motion.span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {isConnected ? (
                            <>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDisconnect(platform)}
                                disabled={isLoading}
                                className="flex-1"
                              >
                                {isLoading ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Disconnect className="mr-2 h-4 w-4" />
                                )}
                                Disconnect
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={() => handleConnect(platform)}
                              disabled={isLoading}
                              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                              {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <PlusCircle className="mr-2 h-4 w-4" />
                              )}
                              Connect {platform.name}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-center">
            <CardContent className="p-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                className="text-3xl font-bold text-white mb-2"
              >
                {connectedPlatforms.length}
              </motion.div>
              <p className="text-gray-300">Connected Platforms</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-center">
            <CardContent className="p-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2"
              >
                <Globe className="w-8 h-8" />
                {SUPPORTED_PLATFORMS.length}
              </motion.div>
              <p className="text-gray-300">Available Integrations</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-center">
            <CardContent className="p-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2"
              >
                <Shield className="w-8 h-8" />
                100%
              </motion.div>
              <p className="text-gray-300">Secure & Encrypted</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}