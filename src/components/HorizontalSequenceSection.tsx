'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useFrameSequence } from '../hooks/useFrameSequence';

interface HorizontalSequenceSectionProps {
  /** Pre-loaded image URLs for sequence 4 */
  imageUrls: string[];
}

// ─── Inline canvas that plays seq4 frames ────────────────────────────────────
function Seq4Canvas({
  images,
  scrollYProgress,
}: {
  images: HTMLImageElement[];
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const frameRef       = useRef(0);

  const frameIndex = useTransform(
    scrollYProgress,
    // seq4 plays during the middle third of the horizontal section scroll
    // (0→0.15 = slide in, 0.15→0.85 = seq4 plays, 0.85→1 = slide out)
    [0.15, 0.85],
    [0, Math.max(0, images.length - 1)],
  );

  const draw = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = images[Math.round(Math.max(0, Math.min(images.length - 1, index)))];
    if (!img) return;

    const cr = canvas.width / canvas.height;
    const ir = img.width   / img.height;
    let dw = canvas.width, dh = canvas.height, ox = 0, oy = 0;
    if (cr > ir) { dh = canvas.width / ir;  oy = (canvas.height - dh) / 2; }
    else         { dw = canvas.height * ir; ox = (canvas.width  - dw) / 2; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, ox, oy, dw, dh);
  };

  useEffect(() => {
    const unsub = frameIndex.on('change', (v) => {
      const next = Math.round(v);
      if (next !== frameRef.current) {
        frameRef.current = next;
        requestAnimationFrame(() => draw(next));
      }
    });
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width  = canvasRef.current.offsetWidth  * window.devicePixelRatio;
      canvasRef.current.height = canvasRef.current.offsetHeight * window.devicePixelRatio;
      draw(frameRef.current);
    };
    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ backgroundColor: '#061206' }}
    />
  );
}

// ─── Horizontal sequence section ─────────────────────────────────────────────
// Vertical scroll drives a horizontal translate:
//   scroll 0→15%  : current screen slides LEFT, seq4 screen slides in from RIGHT
//   scroll 15→85% : seq4 plays full screen (video scrubs with scroll)
//   scroll 85→100%: seq4 screen slides LEFT, original page slides back in from RIGHT
//
// Total height: 600vh  (150 slide-in + 300 seq4 + 150 slide-out)
export default function HorizontalSequenceSection({ imageUrls }: HorizontalSequenceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { images } = useFrameSequence(imageUrls);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Track (2 panels wide = 200vw) translates left as you scroll
  // 0% scroll   → translateX(0)      — panel 1 (original) visible
  // 15% scroll  → translateX(-100vw) — panel 2 (seq4) fully visible
  // 85% scroll  → translateX(-100vw) — still on seq4
  // 100% scroll → translateX(-200vw) — panel 3 (original resumes) visible
  //
  // We use a 3-panel track: [original-placeholder | seq4 | resume-placeholder]
  // The "original" and "resume" panels are transparent — the vertical page
  // content shows through them. Only seq4 panel has a real background.
  const trackX = useTransform(
    scrollYProgress,
    [0,       0.15,      0.85,      1      ],
    ['0vw', '-100vw', '-100vw', '-200vw'],
  );

  return (
    <section ref={sectionRef} className="relative" style={{ height: '600vh' }}>
      {/* Sticky viewport — clips the sliding track */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 3-panel horizontal track */}
        <motion.div
          style={{ x: trackX }}
          className="flex h-full"
          // track is 300vw wide (3 × 100vw panels)
          // We use inline style because Tailwind can't express 300vw
          // eslint-disable-next-line react/forbid-component-props
        >
          {/* Panel 1 — transparent, original vertical page shows through */}
          <div className="w-screen h-full shrink-0 bg-transparent" />

          {/* Panel 2 — Sequence 4 full-screen video */}
          <div className="w-screen h-full shrink-0 relative overflow-hidden">
            {images.length > 0 && (
              <Seq4Canvas images={images} scrollYProgress={scrollYProgress} />
            )}
            {/* Optional: small label so it's clear what's playing */}
            <div className="absolute bottom-8 left-8 pointer-events-none">
              <span className="text-white/30 text-xs tracking-[0.3em] uppercase font-light">
                Sequence 4
              </span>
            </div>
          </div>

          {/* Panel 3 — transparent, vertical page resumes */}
          <div className="w-screen h-full shrink-0 bg-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
