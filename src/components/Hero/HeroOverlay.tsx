'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface HeroOverlayProps {
  progress: MotionValue<number>;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({ progress }) => {
  // Pinned for the first 10% (frame ~24)
  // Drifts upward slowly between 10% and 25%
  const yOffset = useTransform(progress, [0, 0.1, 0.25], ['0%', '0%', '-150%']);
  const opacity = useTransform(progress, [0, 0.1, 0.22], [1, 1, 0]);
  const ctaOpacity = useTransform(progress, [0, 0.12, 0.25], [1, 1, 0]); // CTA fades slightly later

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
      <motion.div
        style={{ y: yOffset, opacity: opacity }}
        className="flex flex-col items-center text-center px-4"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-black text-white uppercase tracking-widest text-[clamp(1.2rem,2.5vw,2.5rem)] leading-[1.3] mb-4 drop-shadow-2xl text-center max-w-[90vw]"
          style={{ fontFamily: "'Arial Black','Arial Bold',Arial,Impact,sans-serif" }}
        >
          <span className="text-[clamp(1.8rem,4vw,4rem)] text-[#10b981]">I</span>NTELLIGENT{' '}
          <span className="text-[clamp(1.8rem,4vw,4rem)] text-[#10b981]">R</span>IPENING{' '}
          <span className="text-[clamp(1.8rem,4vw,4rem)] text-[#10b981]">I</span>NDICATOR{' '}
          <span className="text-[clamp(1.8rem,4vw,4rem)] text-[#10b981]">S</span>ENSOR
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(1rem,2vw,1.5rem)] text-white/80 font-light tracking-[0.2em] max-w-2xl leading-relaxed uppercase"
        >
          AI Powered Fruit Intelligence
        </motion.p>
      </motion.div>

      <motion.div
        style={{ y: yOffset, opacity: ctaOpacity }}
        className="mt-12 pointer-events-auto"
      >
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white font-medium tracking-widest text-sm uppercase transition-all duration-300 shadow-[0_0_40px_rgba(16,185,129,0.1)] hover:shadow-[0_0_60px_rgba(16,185,129,0.2)] hover:border-emerald-500/50"
        >
          Explore IRIS
        </motion.button>
      </motion.div>

      {/* Floating particles (very subtle) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-30">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-emerald-400"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};
