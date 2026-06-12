'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useFrameSequence } from '../hooks/useFrameSequence';
import { useCopy } from './CopyEditorContext';
import dynamic from 'next/dynamic';

const GuavaModelCanvas = dynamic(() => import('./GuavaModelCanvas'), {
  ssr: false,
});

// ─── Layout ───────────────────────────────────────────────────────────────────
// 4 panels × 100vw. Vertical scroll 0→1 sweeps the track from 0 → -300vw.
// Each panel occupies 1/4 of the total scroll range.
// Total height: 1200vh (300vh per panel — enough for internal animations).
const N_PANELS  = 4;
const PER_PANEL = 300; // vh per panel
const TOTAL_VH  = N_PANELS * PER_PANEL; // 1200

// For panel i, its scroll window is [i/N, (i+1)/N]
// panelLocal(p, i) = clamp((p - i/N) / (1/N), 0, 1)  → 0..1 within that panel
function panelLocal(global: MotionValue<number>, i: number): MotionValue<number> {
  const start = i / N_PANELS;
  const end   = (i + 1) / N_PANELS;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useTransform(global, [start, end], [0, 1], { clamp: true });
}

// ─── Seq4 canvas ──────────────────────────────────────────────────────────────
function Seq4Canvas({ images, progress }: { images: HTMLImageElement[]; progress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef(0);
  const frameIdx  = useTransform(progress, [0, 1], [0, Math.max(0, images.length - 1)]);

  const draw = (idx: number) => {
    const c = canvasRef.current; if (!c || !images.length) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const img = images[Math.round(Math.max(0, Math.min(images.length - 1, idx)))];
    if (!img) return;
    const cr = c.width / c.height, ir = img.width / img.height;
    let dw = c.width, dh = c.height, ox = 0, oy = 0;
    if (cr > ir) { dh = c.width / ir; oy = (c.height - dh) / 2; }
    else { dw = c.height * ir; ox = (c.width - dw) / 2; }
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(img, ox, oy, dw, dh);
  };

  useEffect(() => frameIdx.on('change', (v: number) => {
    const n = Math.round(v);
    if (n !== frameRef.current) { frameRef.current = n; requestAnimationFrame(() => draw(n)); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [images]);

  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width  = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;
      draw(frameRef.current);
    };
    window.addEventListener('resize', resize); resize();
    return () => window.removeEventListener('resize', resize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ background: '#061206' }} />;
}

// ─── Word reveal panel ────────────────────────────────────────────────────────
function WordRevealPanel({ text, progress }: { text: string; progress: MotionValue<number> }) {
  const words      = text.split(' ');
  const blockY     = useTransform(progress, [0, 0.15], [60, 0]);
  const blockAlpha = useTransform(progress, [0, 0.15, 0.80, 1.0], [0, 1, 1, 0]);

  return (
    <div className="w-screen h-full shrink-0 relative flex items-center justify-start px-8 md:px-16 lg:px-24 overflow-hidden"
      style={{ background: '#061206' }}>
      {/* subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(16,185,129,1) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,1) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <motion.div style={{ y: blockY, opacity: blockAlpha }} className="relative z-10 w-full max-w-2xl lg:max-w-3xl">
        <p className="font-black uppercase leading-snug tracking-tight" style={{ fontSize: 'clamp(1.1rem, 2.2vw, 2.4rem)' }}>
          {words.map((word, i) => {
            const s = 0.20 + (i / words.length) * 0.50;
            const e = s + 0.08;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const color = useTransform(progress,
              [Math.max(0, s - 0.05), s, e],
              ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.12)', 'rgba(255,255,255,1)'],
            );
            return <motion.span key={i} style={{ color }} className="inline-block mr-[0.25em]">{word}</motion.span>;
          })}
        </p>
      </motion.div>
    </div>
  );
}

// ─── Gate panel ───────────────────────────────────────────────────────────────
interface GateProps {
  accent: 'emerald' | 'amber';
  tag: string; title: string; subtitle: string;
  description: string; slogan: string;
  features: { icon: string; title: string; desc: string }[];
  watermark: string; blobSide: 'left' | 'right';
  progress: MotionValue<number>;
}

function GatePanel({ accent, tag, title, subtitle, description, slogan, features, watermark, blobSide, progress }: GateProps) {
  const leftX  = useTransform(progress, [0.02, 0.35], ['0%',   '-102%']);
  const rightX = useTransform(progress, [0.02, 0.35], ['0%',   '102%']);
  const cAlpha = useTransform(progress, [0.25, 0.45, 0.90, 1.0], [0, 1, 1, 0]);
  const cY     = useTransform(progress, [0.25, 0.45], [40, 0]);

  const e = accent === 'emerald';
  const aText   = e ? 'text-emerald-400'      : 'text-amber-400';
  const aBg     = e ? 'bg-emerald-500/10'     : 'bg-amber-500/10';
  const aBorder = e ? 'border-emerald-500/30' : 'border-amber-500/30';
  const aLine   = e ? 'bg-emerald-500'        : 'bg-amber-500';
  const aTag    = e ? 'border-emerald-500/20' : 'border-amber-500/20';
  const seam    = e ? 'via-emerald-500/50'    : 'via-amber-500/50';
  const gc      = e ? 'rgba(16,185,129,1)'    : 'rgba(245,158,11,1)';
  const wm      = e ? 'rgba(16,185,129,0.05)' : 'rgba(245,158,11,0.05)';
  const blob    = e
    ? 'radial-gradient(circle,rgba(16,185,129,0.09) 0%,transparent 70%)'
    : 'radial-gradient(circle,rgba(245,158,11,0.08) 0%,transparent 70%)';
  const grid = {
    backgroundImage: `linear-gradient(${gc} 1px,transparent 1px),linear-gradient(90deg,${gc} 1px,transparent 1px)`,
    backgroundSize: '60px 60px',
  };

  return (
    <div className="w-screen h-full shrink-0 relative overflow-hidden">
      {/* Gate left */}
      <motion.div style={{ x: leftX, zIndex: 20 }} className="absolute inset-0 w-1/2 origin-left">
        <div className="w-full h-full" style={{ background: '#061206' }}>
          <div className={`absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent ${seam} to-transparent`} />
          <div className="absolute inset-0 opacity-[0.04]" style={grid} />
          <div className="absolute bottom-8 right-6 font-black uppercase select-none pointer-events-none"
            style={{ fontSize: 'clamp(5rem, 14vw, 13rem)', color: wm, lineHeight: 1, letterSpacing: '-0.05em' }}>
            {watermark[0]}
          </div>
        </div>
      </motion.div>

      {/* Gate right */}
      <motion.div style={{ x: rightX, zIndex: 20 }} className="absolute inset-0 left-1/2 w-1/2 origin-right">
        <div className="w-full h-full" style={{ background: '#061206' }}>
          <div className={`absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent ${seam} to-transparent`} />
          <div className="absolute inset-0 opacity-[0.04]" style={grid} />
          <div className="absolute bottom-8 left-6 font-black uppercase select-none pointer-events-none"
            style={{ fontSize: 'clamp(5rem, 14vw, 13rem)', color: wm, lineHeight: 1, letterSpacing: '-0.05em' }}>
            {watermark.slice(1) || watermark[0]}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6 md:px-12 lg:px-20"
        style={{ background: 'linear-gradient(135deg,#040904 0%,#061a0a 50%,#040904 100%)' }}>
        <div className={`absolute ${blobSide === 'left' ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 w-[55vw] h-[55vw] rounded-full pointer-events-none`}
          style={{ background: blob }} />

        <motion.div style={{ opacity: cAlpha, y: cY }}
          className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Text */}
          <div className={blobSide === 'right' ? 'lg:order-2' : ''}>
            <span className={`inline-block px-3 py-1 ${aBg} ${aText} text-xs tracking-[0.25em] font-bold uppercase rounded-full mb-5 border ${aTag}`}>{tag}</span>
            <h2 className="font-black uppercase text-white leading-none tracking-tight mb-3"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4.5rem)' }}>{title}</h2>
            <p className={`${aText} text-xs font-bold tracking-widest uppercase mb-5`}>{subtitle}</p>
            <div className={`h-[2px] w-14 ${aLine} mb-5`} />
            <p className="text-gray-300 text-sm leading-relaxed font-light mb-6 max-w-md">{description}</p>
            <div className={`inline-block px-4 py-2.5 rounded-xl border ${aBorder} ${aBg} mb-6`}>
              <p className={`${aText} text-xs font-medium tracking-wide italic`}>&ldquo;{slogan}&rdquo;</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {features.map((f) => (
                <div key={f.title} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${aBorder} bg-black/30`}>
                  <span className="text-sm">{f.icon}</span>
                  <span className={`${aText} text-[10px] font-bold uppercase tracking-wide`}>{f.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature cards */}
          <div className={`space-y-3 ${blobSide === 'right' ? 'lg:order-1' : ''}`}>
            {features.map((f, i) => (
              <div key={f.title}
                className={`flex gap-4 items-start p-4 rounded-2xl border ${aBorder} bg-black/25 backdrop-blur-sm`}
                style={{ opacity: 0, animation: 'fadeSlideIn 0.5s ease forwards', animationDelay: `${i * 0.1}s` }}>
                <div className={`text-xl shrink-0 w-10 h-10 rounded-xl ${aBg} flex items-center justify-center`}>{f.icon}</div>
                <div>
                  <h4 className={`${aText} font-bold text-xs uppercase tracking-wide mb-1`}>{f.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed font-light">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
// One sticky container. Vertical scroll 0→1 sweeps the 4-panel track
// linearly from translateX(0) → translateX(-300vw).
// Each panel's internal animations are driven by its slice of global progress.
export default function HorizontalChapter({ sequence4Urls }: { sequence4Urls: string[] }) {
  const { copy }   = useCopy();
  const wrapRef    = useRef<HTMLDivElement>(null);
  const { images } = useFrameSequence(sequence4Urls);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  // Custom stepped sweep to make each panel stick while its animation plays:
  const trackX = useTransform(
    scrollYProgress,
    [0, 0.20, 0.25, 0.45, 0.50, 0.70, 0.75, 1.00],
    ['0vw', '0vw', '-100vw', '-100vw', '-200vw', '-200vw', '-300vw', '-300vw']
  );

  // Per-panel local progress (0→1 within each panel's scroll slice)
  const p0 = panelLocal(scrollYProgress, 0);
  const p1 = panelLocal(scrollYProgress, 1);
  const p2 = panelLocal(scrollYProgress, 2);
  const p3 = panelLocal(scrollYProgress, 3);

  // Panel indicator: active when panel is centred
  const dotScales = [p0, p1, p2, p3].map((p) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(p, [0, 0.4, 0.6, 1], [0.6, 1.4, 1.4, 0.6])
  );

  const guavaFeatures = [
    { icon: '🛡️', title: copy.guavaProbi.feature1Title, desc: copy.guavaProbi.feature1Desc },
    { icon: '🌿', title: copy.guavaProbi.feature2Title, desc: copy.guavaProbi.feature2Desc },
    { icon: '✨', title: copy.guavaProbi.feature3Title, desc: copy.guavaProbi.feature3Desc },
  ];

  const irisFeatures = [
    { icon: '📡', title: 'IoT-Enabled Sensors',    desc: 'Real-time environmental monitoring across the entire supply chain.' },
    { icon: '📊', title: 'Real-Time Telemetry',    desc: 'Live data streams for instant quality and condition assessment.' },
    { icon: '🎯', title: 'Precision Monitoring',   desc: 'Pinpoint accuracy in tracking produce from farm to table.' },
    { icon: '🔗', title: 'Supply Chain Analytics', desc: 'End-to-end visibility and actionable insights for every stakeholder.' },
  ];

  return (
    <div ref={wrapRef} className="relative" style={{ height: `${TOTAL_VH}vh` }}>
      {/* Sticky viewport — clips the track */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* 3D Guava Model Canvas */}
        <GuavaModelCanvas scrollYProgress={scrollYProgress} />

        {/* 4-panel track, 400vw wide, slides left as you scroll */}
        <motion.div style={{ x: trackX }} className="flex h-full" aria-hidden="false">

          {/* Panel 0 — Word Reveal */}
          <WordRevealPanel text={copy.objectives.description} progress={p0} />

          {/* Panel 1 — Sequence 4 video */}
          <div className="w-screen h-full shrink-0 relative overflow-hidden">
            {images.length > 0 && <Seq4Canvas images={images} progress={p1} />}
            <div className="absolute bottom-8 left-8 pointer-events-none z-10">
              <span className="text-white/25 text-xs tracking-[0.3em] uppercase font-light">Sequence 4</span>
            </div>
          </div>

          {/* Panel 2 — Guava Probi gate */}
          <GatePanel
            accent="emerald" tag="Biotech Product"
            title={copy.guavaProbi.title} subtitle={copy.guavaProbi.subtitle}
            description={copy.guavaProbi.description} slogan={copy.guavaProbi.slogan}
            features={guavaFeatures} watermark="GP" blobSide="left" progress={p2}
          />

          {/* Panel 3 — IRIS gate */}
          <GatePanel
            accent="amber" tag="IoT Platform"
            title={copy.iris.title} subtitle={copy.iris.subtitle}
            description={copy.iris.description}
            slogan="From farm to table — every step monitored, every fruit protected."
            features={irisFeatures} watermark="IR" blobSide="right" progress={p3}
          />
        </motion.div>

        {/* Panel dots — bottom centre */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30 pointer-events-none">
          {dotScales.map((scale, i) => (
            <motion.div key={i} style={{ scale }}
              className="w-2 h-2 rounded-full bg-white/60 origin-center" />
          ))}
        </div>

        {/* Scroll hint arrow — fades out after first panel */}
        <motion.div
          style={{ opacity: useTransform(p0, [0.7, 1], [1, 0]) }}
          className="absolute bottom-6 right-8 z-30 pointer-events-none flex items-center gap-2"
        >
          <span className="text-white/30 text-xs tracking-widest uppercase font-light">scroll</span>
          <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
