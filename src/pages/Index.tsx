import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Zap, 
  Rocket, 
  Star, 
  ArrowRight, 
  Play,
  Settings,
  Users,
  BarChart3,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ParticleBackground } from "@/components/ParticleBackground";

// Animation variants
const heroVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 1,
      type: "spring",
      stiffness: 100
    }
  }
};

const floatingVariants = {
  animate: {
    y: [-20, 20, -20],
    rotate: [0, 5, 0, -5, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
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
    y: -10,
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.5
    }
  }
};

const Index = () => {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI-Powered Automation",
      description: "Connect platforms and let AI handle your workflows seamlessly",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Work together with your team in perfect synchronization",
      color: "from-blue-400 to-purple-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Get insights that matter with real-time data visualization",
      color: "from-green-400 to-cyan-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption",
      color: "from-red-400 to-pink-500"
    }
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
        <motion.div
          {...floatingVariants}
          className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          {...floatingVariants}
          transition={{ delay: 2, duration: 10, repeat: Infinity }}
          className="absolute top-40 right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          {...floatingVariants}
          transition={{ delay: 4, duration: 12, repeat: Infinity }}
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"
        />
        <motion.div
          {...floatingVariants}
          transition={{ delay: 6, duration: 9, repeat: Infinity }}
          className="absolute top-1/2 right-1/4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative p-6"
        style={{ zIndex: 10 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Yeti Verse</span>
          </motion.div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10"
              onClick={() => navigate('/connections')}
            >
              Connections
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Get Started
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative container mx-auto px-6 py-12" style={{ zIndex: 10 }}>
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8"
          >
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">Welcome to the Future of Automation</span>
            <Sparkles className="w-5 h-5 text-blue-400" />
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-6">
            Yeti Verse
            <br />
            <span className="text-4xl md:text-6xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Connector Hub
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Experience Grammy-winning UI design with powerful automation capabilities. 
            Connect your platforms, automate your workflows, and watch your productivity soar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6"
                onClick={() => navigate('/connections')}
              >
                <Rocket className="w-6 h-6 mr-2" />
                Explore Connections
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                <Play className="w-6 h-6 mr-2" />
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Feature Showcase */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className={`group cursor-pointer ${
                currentFeature === index ? 'ring-2 ring-white/50' : ''
              }`}
              onClick={() => setCurrentFeature(index)}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                <CardHeader className="text-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}
                  >
                    {feature.icon}
                  </motion.div>
                  <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFeature}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 max-w-2xl mx-auto">
              <CardHeader>
                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${features[currentFeature].color} flex items-center justify-center text-white mb-4`}>
                  {features[currentFeature].icon}
                </div>
                <CardTitle className="text-white text-2xl">{features[currentFeature].title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-lg">
                  {features[currentFeature].description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-center">
            <CardContent className="p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                className="text-4xl font-bold text-white mb-2"
              >
                50+
              </motion.div>
              <p className="text-gray-300">Platform Integrations</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-center">
            <CardContent className="p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                className="text-4xl font-bold text-white mb-2"
              >
                99.9%
              </motion.div>
              <p className="text-gray-300">Uptime Guarantee</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-center">
            <CardContent className="p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
                className="text-4xl font-bold text-white mb-2"
              >
                24/7
              </motion.div>
              <p className="text-gray-300">AI Support</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border-white/20 max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Transform Your Workflow?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of teams already using Yeti Verse to automate their success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6"
                  onClick={() => navigate('/connections')}
                >
                  <Sparkles className="w-6 h-6 mr-2" />
                  Start Your Journey
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
                >
                  <Settings className="w-6 h-6 mr-2" />
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;