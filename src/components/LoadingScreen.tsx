'use client';

import { motion } from 'framer-motion';

interface LoadingScreenProps {
  progress: number;
}

export default function LoadingScreen({ progress }: LoadingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a1a0a]"
    >
      <div className="w-64 max-w-[80%] flex flex-col items-center gap-4">
        {/* Minimal thin line progress bar */}
        <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: 'linear' }}
          />
        </div>
        
        {/* Subtle progress text */}
        <p className="text-white/50 text-xs tracking-[0.2em] font-light uppercase">
          Loading {Math.round(progress)}%
        </p>
      </div>
    </motion.div>
  );
}
