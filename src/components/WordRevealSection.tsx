'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface WordRevealSectionProps {
  text: string;
}

/**
 * A real page section (not an overlay).
 * Dark green background. Text slides up on entry, then each word
 * lights up from dim grey → white as you scroll through.
 */
export default function WordRevealSection({ text }: WordRevealSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const words = text.split(' ');

  // Whole block slides up into view at the start
  const blockY       = useTransform(scrollYProgress, [0, 0.12], [60, 0]);
  const blockOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '300vh', background: '#061206' }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-start px-8 md:px-16 lg:px-24 overflow-hidden">
        <motion.div
          style={{ y: blockY, opacity: blockOpacity }}
          className="w-full max-w-5xl"
        >
          <p
            className="font-black uppercase leading-snug tracking-tight"
            style={{ fontSize: 'clamp(1.1rem, 2.2vw, 2.4rem)' }}
          >
            {words.map((word, i) => {
              // Words light up progressively from 15% → 85% of scroll
              const start = 0.15 + (i / words.length) * 0.65;
              const end   = start + 0.10;
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const color = useTransform(
                scrollYProgress,
                [Math.max(0, start - 0.04), start, end],
                ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,1)'],
              );
              return (
                <motion.span key={i} style={{ color }} className="inline-block mr-[0.25em]">
                  {word}
                </motion.span>
              );
            })}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
