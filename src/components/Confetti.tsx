import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const COLORS = [
  '#2F6B4F', // Forest green (brand)
  '#C77700', // Warm orange (brand)
  '#E89B2E', // Bright yellow/gold (brand)
  '#2D3748', // Charcoal/dark slate (brand)
  '#25D366', // Joyful WhatsApp green
  '#FFF8EE', // Off-white contrast spark
];

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
  durationMs?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  shape: string;
  delay: number;
  duration: number;
  drift: number;
  rotation: number;
  spinSpeed: number;
}

export default function Confetti({ active, onComplete, durationMs = 3500 }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const count = 120; // Perfect balance of visual density and performance
      const generated = Array.from({ length: count }).map((_, idx) => {
        const shape = ['square', 'circle', 'triangle', 'rectangle'][Math.floor(Math.random() * 4)];
        return {
          id: idx,
          x: Math.random() * 100, // random percentage across viewport width
          y: -10 - Math.random() * 15, // start above the viewport
          size: 6 + Math.random() * 10, // sizes from 6px to 16px
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape,
          delay: Math.random() * 0.8, // smooth cascading delays
          duration: 2.2 + Math.random() * 1.5, // gravity/fall speeds
          drift: (Math.random() - 0.5) * 160, // sway drift to the left/right
          rotation: Math.random() * 360,
          spinSpeed: 2 + Math.random() * 4, // rotation flips
        };
      });
      setParticles(generated);

      const timer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, durationMs);

      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [active, durationMs, onComplete]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              x: `${p.x}vw`,
              y: `${p.y}vh`,
              rotate: p.rotation,
              opacity: 1,
            }}
            animate={{
              y: '105vh',
              x: `calc(${p.x}vw + ${p.drift}px)`,
              rotate: p.rotation + p.spinSpeed * 360,
              opacity: [1, 1, 0.8, 0], // subtle fade out toward the bottom
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: [0.215, 0.61, 0.355, 1], // easeOutCubic-like for floating feel
            }}
            className="absolute"
            style={{
              width: p.size,
              height: p.shape === 'rectangle' ? p.size * 1.6 : p.size,
              backgroundColor: p.shape !== 'triangle' ? p.color : 'transparent',
              borderRadius: p.shape === 'circle' ? '50%' : '0%',
              borderLeft: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
              borderRight: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
              borderBottom: p.shape === 'triangle' ? `${p.size}px solid ${p.color}` : undefined,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
