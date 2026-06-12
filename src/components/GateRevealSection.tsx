'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCopy } from './CopyEditorContext';

// ─── Single gate panel ────────────────────────────────────────────────────────
// Two halves split apart horizontally (left gate slides left, right gate slides right)
// revealing the product content inside as you scroll.

interface GatePanelProps {
  /** accent color class for borders/glows */
  accent: 'emerald' | 'amber';
  /** label above the title */
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  slogan: string;
  features: { icon: string; title: string; desc: string }[];
  /** large decorative letter(s) */
  watermark: string;
  /** which side the decorative blob sits */
  blobSide: 'left' | 'right';
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}

function GatePanel({
  accent,
  tag,
  title,
  subtitle,
  description,
  slogan,
  features,
  watermark,
  blobSide,
  scrollYProgress,
}: GatePanelProps) {
  // Gates open: left half slides to -100%, right half slides to +100%
  // 0→20% scroll: gates closed (content hidden)
  // 20→55% scroll: gates swing open
  // 55→85% scroll: content fully visible
  // 85→100% scroll: content fades out
  const leftX   = useTransform(scrollYProgress, [0.05, 0.45], ['0%',  '-102%']);
  const rightX  = useTransform(scrollYProgress, [0.05, 0.45], ['0%',  '102%']);
  const contentOpacity = useTransform(scrollYProgress, [0.35, 0.55, 0.85, 1.0], [0, 1, 1, 0]);
  const contentY       = useTransform(scrollYProgress, [0.35, 0.55], [40, 0]);

  const accentBorder  = accent === 'emerald' ? 'border-emerald-500/30' : 'border-amber-500/30';
  const accentText    = accent === 'emerald' ? 'text-emerald-400'      : 'text-amber-400';
  const accentBg      = accent === 'emerald' ? 'bg-emerald-500/10'     : 'bg-amber-500/10';
  const accentGlow    = accent === 'emerald'
    ? 'shadow-[0_0_120px_rgba(16,185,129,0.12)]'
    : 'shadow-[0_0_120px_rgba(245,158,11,0.10)]';
  const accentLine    = accent === 'emerald' ? 'bg-emerald-500'        : 'bg-amber-500';
  const tagBorder     = accent === 'emerald' ? 'border-emerald-500/20' : 'border-amber-500/20';

  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* ── Gate left half ── */}
      <motion.div
        style={{ x: leftX, zIndex: 20 }}
        className="absolute inset-0 w-1/2 origin-left"
      >
        <div className="w-full h-full" style={{ background: '#061206' }}>
          {/* Vertical seam line */}
          <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-emerald-500/40 to-transparent" />
          {/* Decorative grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          {/* Watermark */}
          <div
            className="absolute bottom-8 right-6 font-black uppercase select-none pointer-events-none"
            style={{
              fontSize: 'clamp(5rem, 15vw, 14rem)',
              color: 'rgba(16,185,129,0.04)',
              lineHeight: 1,
              letterSpacing: '-0.05em',
            }}
          >
            {watermark[0]}
          </div>
        </div>
      </motion.div>

      {/* ── Gate right half ── */}
      <motion.div
        className="absolute inset-0 left-1/2 w-1/2 z-20 origin-right"
        style={{ x: rightX, zIndex: 20 }}
      >
        <div className="w-full h-full" style={{ background: '#061206' }}>
          {/* Vertical seam line */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-emerald-500/40 to-transparent" />
          {/* Decorative grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          {/* Watermark */}
          <div
            className="absolute bottom-8 left-6 font-black uppercase select-none pointer-events-none"
            style={{
              fontSize: 'clamp(5rem, 15vw, 14rem)',
              color: 'rgba(16,185,129,0.04)',
              lineHeight: 1,
              letterSpacing: '-0.05em',
            }}
          >
            {watermark.slice(1) || watermark[0]}
          </div>
        </div>
      </motion.div>

      {/* ── Content revealed behind the gates ── */}
      <div
        className={`absolute inset-0 z-10 flex items-center justify-center px-6 md:px-16 ${accentGlow}`}
        style={{ background: 'linear-gradient(135deg, #040904 0%, #061a0a 50%, #040904 100%)' }}
      >
        {/* Ambient glow blob */}
        <div
          className={`absolute ${blobSide === 'left' ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full pointer-events-none`}
          style={{
            background: accent === 'emerald'
              ? 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
          }}
        />

        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* ── Text side ── */}
          <div className={blobSide === 'right' ? 'lg:order-2' : ''}>
            <span className={`inline-block px-3 py-1 ${accentBg} ${accentText} text-xs tracking-[0.25em] font-bold uppercase rounded-full mb-5 border ${tagBorder}`}>
              {tag}
            </span>

            <h2
              className="font-black uppercase text-white leading-none tracking-tight mb-3"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
            >
              {title}
            </h2>

            <p className={`${accentText} text-sm font-semibold tracking-widest uppercase mb-6`}>
              {subtitle}
            </p>

            <div className={`h-[2px] w-16 ${accentLine} mb-6`} />

            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light mb-8 max-w-lg">
              {description}
            </p>

            {/* Slogan pill */}
            <div className={`inline-block px-5 py-3 rounded-xl border ${accentBorder} ${accentBg} mb-8`}>
              <p className={`${accentText} text-xs font-medium tracking-wide italic`}>
                &ldquo;{slogan}&rdquo;
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border ${accentBorder} bg-black/30`}
                >
                  <span className="text-base">{f.icon}</span>
                  <span className={`${accentText} text-xs font-bold uppercase tracking-wide`}>{f.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Visual side — feature cards ── */}
          <div className={`space-y-4 ${blobSide === 'right' ? 'lg:order-1' : ''}`}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: blobSide === 'left' ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={`flex gap-4 items-start p-5 rounded-2xl border ${accentBorder} bg-black/25 backdrop-blur-sm hover:bg-black/40 transition-colors duration-300`}
              >
                <div className={`text-2xl shrink-0 w-12 h-12 rounded-xl ${accentBg} flex items-center justify-center`}>
                  {f.icon}
                </div>
                <div>
                  <h4 className={`${accentText} font-bold text-sm uppercase tracking-wide mb-1`}>{f.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed font-light">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Gate reveal section — two products, each with its own gate ───────────────
// Each product gets 300vh:
//   0→100vh  : gate closed, scroll to open
//   100→200vh: content visible
//   200→300vh: content fades, next gate begins
export default function GateRevealSection() {
  const { copy } = useCopy();

  const guavaRef = useRef<HTMLDivElement>(null);
  const irisRef  = useRef<HTMLDivElement>(null);

  const { scrollYProgress: guavaProgress } = useScroll({
    target: guavaRef,
    offset: ['start start', 'end end'],
  });

  const { scrollYProgress: irisProgress } = useScroll({
    target: irisRef,
    offset: ['start start', 'end end'],
  });

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
    <>
      {/* ── Product 1: Guava Probi ── */}
      <div ref={guavaRef} className="relative" style={{ height: '300vh' }}>
        <div className="sticky top-0 h-screen w-full">
          <GatePanel
            accent="emerald"
            tag="Biotech Product"
            title={copy.guavaProbi.title}
            subtitle={copy.guavaProbi.subtitle}
            description={copy.guavaProbi.description}
            slogan={copy.guavaProbi.slogan}
            features={guavaFeatures}
            watermark="GP"
            blobSide="left"
            scrollYProgress={guavaProgress}
          />
        </div>
      </div>

      {/* ── Product 2: IRIS ── */}
      <div ref={irisRef} className="relative" style={{ height: '300vh' }}>
        <div className="sticky top-0 h-screen w-full">
          <GatePanel
            accent="amber"
            tag="IoT Platform"
            title={copy.iris.title}
            subtitle={copy.iris.subtitle}
            description={copy.iris.description}
            slogan="From farm to table — every step monitored, every fruit protected."
            features={irisFeatures}
            watermark="IR"
            blobSide="right"
            scrollYProgress={irisProgress}
          />
        </div>
      </div>
    </>
  );
}
