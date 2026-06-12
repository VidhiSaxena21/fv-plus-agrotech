'use client';

import { useRef } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { PremiumKernelPanel } from './PremiumKernelSection';
import PackagingModelCanvas from './PackagingModelCanvas';
import { useCopy } from './CopyEditorContext';

const PANEL_COUNT = 4;
/** Vertical scroll distance: 100vh sticky + (panels-1) × 130vh scrub */
const SECTION_VH = 100 + (PANEL_COUNT - 1) * 130;
const KERNEL_SEGMENT = 1 / PANEL_COUNT;

function FeatureChip({ icon, title, accent }: { icon: string; title: string; accent: 'emerald' | 'amber' | 'cyan' }) {
  const border =
    accent === 'emerald' ? 'border-emerald-500/30' : accent === 'amber' ? 'border-amber-500/30' : 'border-cyan-500/30';
  const text =
    accent === 'emerald' ? 'text-emerald-400' : accent === 'amber' ? 'text-amber-400' : 'text-cyan-400';
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${border} bg-black/30 backdrop-blur-sm`}>
      <span className="text-sm">{icon}</span>
      <span className={`${text} text-[10px] font-bold uppercase tracking-wide`}>{title}</span>
    </div>
  );
}

function GlassProductPanel({
  accent,
  tag,
  title,
  subtitle,
  description,
  slogan,
  features,
  visual,
}: {
  accent: 'emerald' | 'amber' | 'cyan';
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  slogan: string;
  features: { icon: string; title: string }[];
  visual?: React.ReactNode;
}) {
  const accentMap = {
    emerald: {
      tag: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      line: 'bg-emerald-500',
      subtitle: 'text-emerald-400',
      quote: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      glow: 'from-emerald-500/8 to-emerald-900/10',
      shadow: '0 0 80px rgba(16,185,129,0.12)',
    },
    amber: {
      tag: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      line: 'bg-amber-500',
      subtitle: 'text-amber-400',
      quote: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      glow: 'from-amber-500/8 to-amber-900/12',
      shadow: '0 0 100px rgba(245,158,11,0.1)',
    },
    cyan: {
      tag: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      line: 'bg-cyan-500',
      subtitle: 'text-cyan-400',
      quote: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
      glow: 'from-cyan-500/8 to-cyan-900/12',
      shadow: '0 0 90px rgba(34,211,238,0.1)',
    },
  };
  const a = accentMap[accent];

  return (
    <div className="relative w-screen h-full shrink-0 flex items-center justify-center px-6 md:px-12 bg-[#061206]">
      <div
        className="relative w-full max-w-6xl rounded-[2rem] md:rounded-[2.5rem] border border-white/12 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 35%, rgba(0,0,0,0.25) 100%)',
          boxShadow: `0 50px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06) inset, ${a.shadow}`,
          backdropFilter: 'blur(28px)',
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${a.glow} via-transparent pointer-events-none`} />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 md:p-12 lg:p-14 items-center min-h-[420px] md:min-h-[480px]">
          {visual && <div className="lg:col-span-5 order-2 lg:order-1">{visual}</div>}
          <div className={`space-y-4 ${visual ? 'lg:col-span-7 order-1 lg:order-2' : 'lg:col-span-8 lg:col-start-3'}`}>
            <span className={`inline-block px-3 py-1 text-xs tracking-[0.25em] font-bold uppercase rounded-full border ${a.tag}`}>{tag}</span>
            <h2 className="font-black uppercase text-white leading-none tracking-tight" style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)' }}>
              {title}
            </h2>
            <p className={`${a.subtitle} text-xs font-bold tracking-widest uppercase`}>{subtitle}</p>
            <div className={`h-[2px] w-14 ${a.line}`} />
            <p className="text-gray-300 text-sm leading-relaxed font-light max-w-lg">{description}</p>
            <div className={`inline-block px-4 py-2.5 rounded-xl border ${a.quote}`}>
              <p className="text-xs font-medium tracking-wide italic">&ldquo;{slogan}&rdquo;</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {features.map((f) => (
                <FeatureChip key={f.title} icon={f.icon} title={f.title} accent={accent} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IoTDeviceVisual() {
  return (
    <div className="relative w-full max-w-[280px] md:max-w-[320px] aspect-[3/4] mx-auto">
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-amber-500/20 via-transparent to-amber-900/10 blur-2xl scale-110" />
      <div
        className="relative h-full rounded-[2rem] border border-white/15 overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, rgba(0,0,0,0.35) 100%)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.25)',
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8">
          <div className="relative w-28 h-28">
            {[0, 1, 2].map((i) => (
              <div key={i} className="absolute inset-0 rounded-full border border-amber-400/30" style={{ transform: `scale(${0.55 + i * 0.22})`, opacity: 0.35 - i * 0.08 }} />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/40 to-amber-600/20 border border-amber-300/30 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 w-full">
            {['TEMP', 'HUM', 'CO₂'].map((label) => (
              <div key={label} className="rounded-xl border border-amber-500/20 bg-black/25 px-2 py-2 text-center">
                <p className="text-[9px] text-amber-400/70 font-bold">{label}</p>
                <p className="text-white text-xs font-semibold">Live</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PostHarvestVisual() {
  return (
    <div className="relative w-full max-w-[300px] mx-auto aspect-square">
      <div className="absolute inset-0 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="relative h-full rounded-[2rem] border border-cyan-400/20 flex items-center justify-center bg-[#0a1a0a]" style={{ backdropFilter: 'blur(20px)' }}>
        <div className="text-center space-y-3 p-6">
          <div className="text-5xl">🥭</div>
          <div className="flex justify-center gap-1">
            {[100, 85, 70, 55].map((w, i) => (
              <div key={i} className="w-8 h-16 rounded-full bg-white/5 overflow-hidden flex flex-col justify-end">
                <div className="w-full bg-gradient-to-t from-cyan-500/80 to-cyan-300/40 rounded-full" style={{ height: `${w}%` }} />
              </div>
            ))}
          </div>
          <p className="text-cyan-400/80 text-[10px] font-bold tracking-widest uppercase">Shelf-Life Extended</p>
        </div>
      </div>
    </div>
  );
}

/** Horizontal track: Kernel → Product1 → Product2 → Product3 (CSS sticky + Framer Motion). */
export default function HorizontalStorySection() {
  const { copy } = useCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef({ value: 0 });
  const kernelScrollDriveRef = useRef<number | null>(0);
  const kernelDraggingRef = useRef(false);
  const kernelManualLockRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const trackX = useTransform(scrollYProgress, [0, 1], ['0vw', `-${(PANEL_COUNT - 1) * 100}vw`]);
  const parallaxFarX = useTransform(scrollYProgress, [0, 1], ['0vw', '-22vw']);
  const parallaxMidX = useTransform(scrollYProgress, [0, 1], ['0vw', '-38vw']);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    progressRef.current.value = p;
    if (p > KERNEL_SEGMENT) {
      kernelManualLockRef.current = false;
    }
    if (p <= KERNEL_SEGMENT && !kernelDraggingRef.current && !kernelManualLockRef.current) {
      kernelScrollDriveRef.current = (p / KERNEL_SEGMENT) * 2;
    }
  });

  const guavaFeatures = [
    { icon: '🛡️', title: copy.guavaProbi.feature1Title },
    { icon: '🌿', title: copy.guavaProbi.feature2Title },
    { icon: '✨', title: copy.guavaProbi.feature3Title },
  ];

  const irisFeatures = [
    { icon: '📡', title: 'IoT Sensors' },
    { icon: '📊', title: 'Telemetry' },
    { icon: '🎯', title: 'Precision' },
    { icon: '🔗', title: 'Analytics' },
  ];

  const postHarvestFeatures = [
    { icon: '⏳', title: 'Shelf Life' },
    { icon: '🧬', title: 'Nutrition' },
    { icon: '♻️', title: 'Zero Waste' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative z-30 bg-[#061206]"
      style={{ height: `${SECTION_VH}vh` }}
    >
      {/* Sticky viewport — same pattern as HorizontalSequenceSection */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#061206]">
        {/* Background layers */}
        <motion.div
          style={{ x: parallaxFarX }}
          className="absolute inset-0 pointer-events-none z-0"
          aria-hidden
        >
          <div
            className="absolute inset-0 bg-[#061206]"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(16,101,68,0.35) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 75% 60%, rgba(245,158,11,0.12) 0%, transparent 50%), #061206',
            }}
          />
        </motion.div>

        <motion.div
          style={{ x: parallaxMidX }}
          className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />
        </motion.div>

        {/* Horizontal track */}
        <motion.div
          style={{ x: trackX }}
          className="relative z-10 flex h-full"
        >
          <div className="relative w-screen h-full shrink-0 bg-[#061206]">
            <PremiumKernelPanel
              embedded
              scrollDriveRef={kernelScrollDriveRef}
              isDraggingRef={kernelDraggingRef}
              onManualControl={() => {
                kernelManualLockRef.current = true;
              }}
            />
          </div>

          <GlassProductPanel
            accent="emerald"
            tag="Biotech Product"
            title={copy.guavaProbi.title}
            subtitle={copy.guavaProbi.subtitle}
            description={copy.guavaProbi.description}
            slogan={copy.guavaProbi.slogan}
            features={guavaFeatures}
          />

          <GlassProductPanel
            accent="amber"
            tag="IoT Platform"
            title={copy.iris.title}
            subtitle={copy.iris.subtitle}
            description={copy.iris.description}
            slogan="From farm to table — every step monitored, every fruit protected."
            features={irisFeatures}
            visual={<IoTDeviceVisual />}
          />

          <GlassProductPanel
            accent="cyan"
            tag="Processing Technology"
            title={copy.postHarvest.title}
            subtitle={copy.postHarvest.subtitle}
            description={copy.postHarvest.description}
            slogan={copy.postHarvest.slogan}
            features={postHarvestFeatures}
            visual={<PostHarvestVisual />}
          />
        </motion.div>

        <PackagingModelCanvas getProgress={() => progressRef.current.value} mode="horizontal" />

        <div
          className="absolute inset-0 pointer-events-none z-[15]"
          style={{ background: 'radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.45) 100%)' }}
        />
      </div>
    </section>
  );
}
