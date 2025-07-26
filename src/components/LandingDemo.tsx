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
    <div className="min-h-screen relative overflow-hidden" style={{ 
      background: `linear-gradient(135deg, hsl(var(--cream-bg-primary)) 0%, hsl(var(--cream-bg-secondary)) 50%, hsl(var(--cream-bg-tertiary)) 100%)`
    }}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(circle at 25% 25%, hsl(var(--cream-accent-light) / 0.1) 0%, transparent 50%), 
                     radial-gradient(circle at 75% 75%, hsl(var(--cream-accent) / 0.08) 0%, transparent 50%)`
      }} />
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--cream-border-light)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--cream-border-light)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: `hsl(var(--cream-accent) / 0.4)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 0.8, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
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
          <div className="w-10 h-10 rounded-xl flex items-center justify-center cream-gradient-primary cream-shadow-soft">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold" style={{ color: 'hsl(var(--cream-text-primary))' }}>Yeti</span>
        </div>
        <div className="hidden md:flex items-center space-x-6" style={{ color: 'hsl(var(--cream-text-secondary))' }}>
          <span className="text-sm hover:text-cream-text-primary transition-colors cursor-pointer">Features</span>
          <span className="text-sm hover:text-cream-text-primary transition-colors cursor-pointer">About</span>
          <span className="text-sm hover:text-cream-text-primary transition-colors cursor-pointer">Contact</span>
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
            className="inline-flex items-center px-4 py-2 backdrop-blur-sm border rounded-full mb-8 cream-glass-effect"
            style={{ 
              background: 'hsl(var(--cream-bg-overlay) / 0.7)',
              borderColor: 'hsl(var(--cream-border-medium))'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Star className="w-4 h-4 mr-2" style={{ color: 'hsl(var(--cream-accent))' }} />
            <span className="text-sm" style={{ color: 'hsl(var(--cream-text-secondary))' }}>Founded & Built by</span>
            <span className="text-sm font-semibold ml-1" style={{ color: 'hsl(var(--cream-primary))' }}>Yethikrishna R</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{ color: 'hsl(var(--cream-text-primary))' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            The Future of
            <br />
            <span className="cream-gradient-primary bg-clip-text text-transparent">
              AI Integration
            </span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'hsl(var(--cream-text-secondary))' }}
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
              className="group px-8 py-4 text-white font-semibold rounded-xl cream-shadow-medium transition-all duration-300 flex items-center min-w-[200px] justify-center cream-gradient-primary"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 40px hsl(var(--cream-primary) / 0.3)" 
              }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started Free
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button 
              className="px-8 py-4 border-2 font-semibold rounded-xl transition-all duration-300 min-w-[200px]"
              style={{ 
                borderColor: 'hsl(var(--cream-border-medium))',
                color: 'hsl(var(--cream-text-primary))',
                background: 'hsl(var(--cream-bg-overlay))'
              }}
              whileHover={{ 
                scale: 1.05,
                borderColor: 'hsl(var(--cream-primary))',
                boxShadow: "0 8px 25px hsl(var(--cream-primary) / 0.1)"
              }}
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
          <div className="w-80 h-48 backdrop-blur-lg border rounded-2xl cream-shadow-strong transform-gpu cream-glass-effect"
               style={{ borderColor: 'hsl(var(--cream-border-light))' }}>
            <div className="p-6 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg cream-gradient-accent" />
                <div className="text-sm font-semibold" style={{ color: 'hsl(var(--cream-accent))' }}>ONLINE</div>
              </div>
              <div>
                <div className="font-semibold text-lg mb-2" style={{ color: 'hsl(var(--cream-text-primary))' }}>Yeti Verse Hub</div>
                <div className="text-sm" style={{ color: 'hsl(var(--cream-text-tertiary))' }}>Advanced AI Platform</div>
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
              className="p-6 backdrop-blur-sm border rounded-xl cream-glass-effect cream-hover-lift"
              style={{ borderColor: 'hsl(var(--cream-border-light))' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 40px hsl(var(--cream-primary) / 0.1)",
                borderColor: "hsl(var(--cream-primary) / 0.3)"
              }}
            >
              <feature.icon className="w-8 h-8 mb-4" style={{ color: 'hsl(var(--cream-primary))' }} />
              <h3 className="font-semibold mb-2" style={{ color: 'hsl(var(--cream-text-primary))' }}>{feature.title}</h3>
              <p className="text-sm" style={{ color: 'hsl(var(--cream-text-tertiary))' }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer 
        className="relative z-10 text-center py-8 border-t"
        style={{ borderColor: 'hsl(var(--cream-border-light))' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        <p className="text-sm" style={{ color: 'hsl(var(--cream-text-tertiary))' }}>
          © 2024 Yeti Verse Hub. Crafted with ❤️ by Yethikrishna R
        </p>
      </motion.footer>
    </div>
  );
};