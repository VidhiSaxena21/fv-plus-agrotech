'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useCopy } from './CopyEditorContext';

/* 100 vh sticky + 150 vh scrub for panel 2 */
const SECTION_VH = 250;

function GuavaVisual() {
  return (
    <div className="relative w-full max-w-[360px] mx-auto">
      <div className="absolute inset-0 rounded-full blur-3xl scale-75" style={{ background: 'rgba(16,185,129,0.18)' }} />
      <div
        className="relative rounded-3xl border overflow-hidden"
        style={{
          borderColor: 'rgba(16,185,129,0.2)',
          background: 'linear-gradient(145deg, rgba(16,185,129,0.12) 0%, rgba(6,18,6,0.95) 65%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(16,185,129,0.08)',
        }}
      >
        <div className="p-8 space-y-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <span className="text-2xl">🧬</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[['50%', 'Food Loss Reduced'], ['$50B', 'Global Market'], ['100%', 'Natural Process'], ['JUICES · BAKERY', 'Formats']].map(([v, l]) => (
              <div key={l} className="rounded-xl p-3 text-center" style={{ border: '1px solid rgba(16,185,129,0.15)', background: 'rgba(0,0,0,0.3)' }}>
                <p className="font-black text-base leading-tight" style={{ color: '#10b981' }}>{v}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{l}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10b981' }} />
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: 'rgba(16,185,129,0.7)' }}>Postbiotic Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function IrisVisual() {
  return (
    <div className="relative w-full max-w-[360px] mx-auto">
      <div className="absolute inset-0 rounded-full blur-3xl scale-75" style={{ background: 'rgba(245,158,11,0.12)' }} />
      <div
        className="relative rounded-3xl border overflow-hidden"
        style={{
          borderColor: 'rgba(245,158,11,0.2)',
          background: 'linear-gradient(145deg, rgba(245,158,11,0.1) 0%, rgba(6,18,6,0.95) 65%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(245,158,11,0.06)',
        }}
      >
        <div className="p-8 space-y-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <span className="text-2xl">📡</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[['4–5 Cr', 'Food Lost Annually'], ['₹1.5L Cr', 'Economic Loss'], ['40%', 'Avoidable w/ Better Mgmt'], ['₹3,800 Cr', 'Market Opportunity']].map(([v, l]) => (
              <div key={l} className="rounded-xl p-3 text-center" style={{ border: '1px solid rgba(245,158,11,0.15)', background: 'rgba(0,0,0,0.3)' }}>
                <p className="font-black text-base leading-tight" style={{ color: '#f59e0b' }}>{v}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{l}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#f59e0b' }} />
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: 'rgba(245,158,11,0.7)' }}>Live Fruit Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HorizontalProductSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useCopy();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const trackX = useTransform(scrollYProgress, [0, 1], ['0vw', '-100vw']);
  const dot0Op = useTransform(scrollYProgress, [0, 0.4], [1, 0.3]);
  const dot1Op = useTransform(scrollYProgress, [0.6, 1], [0.3, 1]);

  const panels = [
    {
      tag: 'Biotech Product',
      title: 'ANVAYA',
      subtitle: 'POSTBIOTIC GUAVA INGREDIENT',
      desc: 'ANVAYA™ transforms fragile, surplus guava into resilient functional nutrition through advanced lacto-fermentation technology. Controlled fermentation converts fruit sugars into bioactive metabolites — generating postbiotics, antioxidants, and organic acids that support gut health. Dehydrated powder form eliminates cold chain requirements. No synthetic additives. No preservatives. One ingredient. Beverages, bakery, dairy, pharma, and wellness.',
      features: ['🧬 Postbiotic Power', '📦 Shelf-Stable', '🚫 Zero Preservatives', '🏭 B2B Ingredient'],
      accentColor: '#10b981',
      borderColor: 'rgba(16,185,129,0.2)',
      tagStyle: { background: 'rgba(16,185,129,0.08)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' },
      visual: <GuavaVisual />,
      href: '/guavi-probi',
    },
    {
      tag: 'IoT Platform',
      title: 'IRIS',
      subtitle: 'VOC DETECTION. REAL-TIME MONITORING. ZERO POST-HARVEST LOSSES.',
      desc: 'IRIS is a portable, non-invasive fruit monitoring system that detects ripeness using VOC release — no touching, no damage. Powered by IoT, embedded ML, and smart sensors, it delivers real-time health data for fruits simultaneously, built for transit and storage. It continuously tracks VOC levels to predict spoilage, optimize dispatch, and reduce post-harvest losses in real time.',
      features: ['📡 VOC Detection', '🔬 Non-Invasive', '🧠 Embedded ML', '📶 IoT Monitoring'],
      accentColor: '#f59e0b',
      borderColor: 'rgba(245,158,11,0.2)',
      tagStyle: { background: 'rgba(245,158,11,0.08)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' },
      visual: <IrisVisual />,
      href: '/iris',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative z-30 -mt-px"
      style={{ height: `${SECTION_VH}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Track */}
        <motion.div style={{ x: trackX, willChange: 'transform' }} className="relative z-10 flex h-full">
          {panels.map((p, i) => (
            <div
              key={i}
              className="relative w-screen h-full shrink-0 flex items-center justify-center px-5 sm:px-10 md:px-16 lg:px-24"
              style={{ overflowY: 'hidden' }}
            >
              <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center">
                {/* Text */}
                <div className="space-y-3 sm:space-y-4 lg:space-y-5 order-1">
                  <span className="inline-block px-3 py-1 text-[10px] sm:text-xs tracking-[0.25em] font-bold uppercase rounded-full" style={p.tagStyle}>
                    {p.tag}
                  </span>
                  <h2
                    className="font-black uppercase text-white leading-none tracking-tight"
                    style={{ fontSize: 'clamp(2rem, 8vw, 5rem)' }}
                  >
                    {p.title}
                  </h2>
                  <p className="text-[9px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase leading-snug" style={{ color: p.accentColor }}>
                    {p.subtitle}
                  </p>
                  <div className="h-[2px] w-10 rounded-full" style={{ background: p.accentColor }} />
                  <p className="text-gray-300 text-[13px] sm:text-[15px] leading-relaxed font-light max-w-md line-clamp-4 sm:line-clamp-none">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5">
                    {p.features.map((f) => (
                      <span key={f} className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold text-white/80"
                        style={{ border: `1px solid ${p.borderColor}`, background: 'rgba(0,0,0,0.3)' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={p.href}
                    className="mt-1 inline-block px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:opacity-80 text-center"
                    style={{ border: `1px solid ${p.borderColor}`, color: p.accentColor }}
                  >
                    Learn More →
                  </Link>
                </div>

                {/* Visual — hidden on mobile, shown on lg+ */}
                <div className="hidden lg:flex order-2 justify-center">{p.visual}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20 items-center">
          <motion.div style={{ opacity: dot0Op }} className="h-1.5 w-8 rounded-full bg-white" />
          <motion.div style={{ opacity: dot1Op }} className="h-1.5 w-8 rounded-full bg-white" />
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-8 z-20 flex items-center gap-2" style={{ opacity: 0.35 }}>
          <span className="text-white text-[10px] font-bold tracking-widest uppercase">Scroll</span>
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>

      </div>
    </section>
  );
}
