import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

interface SplashParticle {
  x: number;
  y: number;
  id: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export const CursorTrail: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [splashParticles, setSplashParticles] = useState<SplashParticle[]>([]);
  const [isClicking, setIsClicking] = useState(false);
  const trailIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const animationFrameRef = useRef<number>();

  // Trail configuration
  const TRAIL_LENGTH = 8;
  const TRAIL_DECAY = 0.85;

  // Particle configuration
  const PARTICLE_COUNT = 12;
  const PARTICLE_SPEED = 3;
  const PARTICLE_LIFE = 60;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      createSplashParticles(mousePos.x, mousePos.y);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mousePos.x, mousePos.y]);

  const createSplashParticles = (x: number, y: number) => {
    const newParticles: SplashParticle[] = [];
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const speed = PARTICLE_SPEED * (0.5 + Math.random() * 0.5);
      
      newParticles.push({
        x,
        y,
        id: particleIdRef.current++,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: PARTICLE_LIFE,
        maxLife: PARTICLE_LIFE,
      });
    }

    setSplashParticles(prev => [...prev, ...newParticles]);
  };

  useEffect(() => {
    const updateTrail = () => {
      setTrail(prevTrail => {
        const newTrail = [
          { x: mousePos.x, y: mousePos.y, id: trailIdRef.current++ },
          ...prevTrail.slice(0, TRAIL_LENGTH - 1)
        ];

        return newTrail.map((point, index) => ({
          ...point,
          x: point.x + (mousePos.x - point.x) * (1 - Math.pow(TRAIL_DECAY, index + 1)),
          y: point.y + (mousePos.y - point.y) * (1 - Math.pow(TRAIL_DECAY, index + 1)),
        }));
      });
    };

    const updateParticles = () => {
      setSplashParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
            vy: particle.vy + 0.1, // gravity
          }))
          .filter(particle => particle.life > 0)
      );
    };

    const animate = () => {
      updateTrail();
      updateParticles();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePos.x, mousePos.y]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Main cursor */}
      <motion.div
        className="fixed w-6 h-6 rounded-full pointer-events-none"
        style={{
          left: mousePos.x - 12,
          top: mousePos.y - 12,
          background: isClicking 
            ? 'radial-gradient(circle, hsl(var(--cream-accent)) 0%, hsl(var(--cream-primary)) 70%)'
            : 'radial-gradient(circle, hsl(var(--cream-primary-light)) 0%, hsl(var(--cream-primary)) 70%)',
          boxShadow: isClicking 
            ? '0 0 20px hsl(var(--cream-accent)), 0 0 40px hsl(var(--cream-accent-light))'
            : '0 0 15px hsl(var(--cream-primary-light))',
        }}
        animate={{
          scale: isClicking ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      />

      {/* Trail points */}
      <AnimatePresence>
        {trail.map((point, index) => (
          <motion.div
            key={point.id}
            className="fixed rounded-full pointer-events-none"
            style={{
              left: point.x - (8 - index),
              top: point.y - (8 - index),
              width: Math.max(2, 16 - index * 2),
              height: Math.max(2, 16 - index * 2),
              background: `hsl(var(--cream-primary-light))`,
              opacity: Math.max(0.1, 1 - index * 0.15),
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Splash particles */}
      <AnimatePresence>
        {splashParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="fixed w-2 h-2 rounded-full pointer-events-none"
            style={{
              left: particle.x - 4,
              top: particle.y - 4,
              background: `hsl(var(--cream-accent))`,
              opacity: particle.life / particle.maxLife,
            }}
            initial={{ scale: 1 }}
            animate={{ 
              scale: 0.5,
              opacity: 0 
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: particle.life / 60,
              ease: "easeOut"
            }}
          />
        ))}
      </AnimatePresence>

      {/* Hover ring */}
      <motion.div
        className="fixed rounded-full pointer-events-none border-2"
        style={{
          left: mousePos.x - 20,
          top: mousePos.y - 20,
          width: 40,
          height: 40,
          borderColor: 'hsl(var(--cream-primary-light))',
          opacity: 0.3,
        }}
        animate={{
          scale: isClicking ? 1.8 : 1,
          opacity: isClicking ? 0.6 : 0.3,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      />
    </div>
  );
};