import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronRight, Star, Sparkles, Zap, Brain, Globe, Shield } from 'lucide-react';

export const LandingDemo = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    controls.start({
      rotateY: (mousePosition.x - 50) * 0.1,
      rotateX: (mousePosition.y - 50) * -0.1,
    });
  }, [mousePosition, controls]);

  const features = [
    { icon: Brain, title: "AI-Powered", desc: "Advanced intelligence at your fingertips" },
    { icon: Globe, title: "Global Scale", desc: "Connect with platforms worldwide" },
    { icon: Shield, title: "Enterprise Security", desc: "Bank-level security protocols" },
    { icon: Zap, title: "Lightning Fast", desc: "Instant processing and responses" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10" />
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"
        style={{
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 flex justify-between items-center p-6 md:p-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Yeti</span>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-gray-300">
          <span className="text-sm">Features</span>
          <span className="text-sm">About</span>
          <span className="text-sm">Contact</span>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6 text-center">
        {/* Hero Section */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Founder Badge */}
          <motion.div 
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Star className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-sm text-gray-300">Founded & Built by</span>
            <span className="text-sm font-semibold text-blue-400 ml-1">Yethikrishna R</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            The Future of
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              AI Integration
            </span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Connect, automate, and scale your workflows with our award-winning 
            AI-powered platform. Experience the next generation of digital transformation.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.button 
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-2xl transition-all duration-300 flex items-center min-w-[200px] justify-center"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started Free
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button 
              className="px-8 py-4 border-2 border-gray-600 hover:border-blue-500 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-300 min-w-[200px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign In
            </motion.button>
          </motion.div>
        </motion.div>

        {/* 3D Floating Card */}
        <motion.div
          className="relative perspective-1000"
          animate={controls}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        >
          <div className="w-80 h-48 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl transform-gpu">
            <div className="p-6 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg" />
                <div className="text-green-400 text-sm font-semibold">ONLINE</div>
              </div>
              <div>
                <div className="text-white font-semibold text-lg mb-2">Yeti Verse Hub</div>
                <div className="text-gray-400 text-sm">Advanced AI Platform</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div 
        className="relative z-10 max-w-6xl mx-auto px-6 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                borderColor: "rgba(59, 130, 246, 0.3)"
              }}
            >
              <feature.icon className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer 
        className="relative z-10 text-center py-8 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        <p className="text-gray-400 text-sm">
          © 2024 Yeti Verse Hub. Crafted with ❤️ by Yethikrishna R
        </p>
      </motion.footer>
    </div>
  );
};