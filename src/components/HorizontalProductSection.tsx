'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useCopy } from './CopyEditorContext';

/* 100 vh sticky + 150 vh scrub for panel 2 */
const SECTION_VH = 250;

function GuavaVisual() {
  const stats = [
    {
      value: '50%',
      label: 'Food Loss Reduced',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="M18.5 16.5L13.5 11.5L9.5 15.5L5.5 11.5" />
        </svg>
      )
    },
    {
      value: '$50B',
      label: 'Global Market',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    },
    {
      value: '100%',
      label: 'Natural Process',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 22c1.25-3.27 3.3-6.17 5.85-8.47C11.36 10.45 16.34 9 22 9c-5 6.25-9.8 9-16.5 11.5L2 22z" />
          <path d="M12 13.5l3.5-3.5" />
        </svg>
      )
    },
    {
      value: 'JUICES • BAKERY',
      label: 'Formats',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22L18 8H6l3 14h6z" />
          <path d="M14 2l-3 6" />
        </svg>
      )
    }
  ];

  return (
    <div className="relative w-full max-w-[360px] mx-auto">
      {/* Background glow */}
      <div className="absolute inset-0 rounded-full blur-3xl scale-75" style={{ background: 'rgba(16,185,129,0.18)' }} />
      
      {/* List container */}
      <div className="relative p-6 space-y-7">
        <div className="flex flex-col gap-6">
          {stats.map(({ value, label, icon }) => (
            <div key={label} className="flex items-center gap-5 group">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105" 
                style={{ 
                  border: '1px solid rgba(16,185,129,0.3)', 
                  background: 'rgba(16,185,129,0.06)',
                  color: '#10b981'
                }}
              >
                {icon}
              </div>
              <div className="space-y-0.5">
                <p className="font-black text-2xl tracking-wide leading-none" style={{ color: '#10b981' }}>
                  {value}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}

function IrisVisual() {
  const stats = [
    {
      value: '4–5 Cr',
      label: 'Food Lost Annually',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      )
    },
    {
      value: '₹1.5L Cr',
      label: 'Economic Loss',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 5h12M6 9h12M6 13h8.5a4 4 0 0 0 0-8H6M6 13l9 9" />
        </svg>
      )
    },
    {
      value: '40%',
      label: 'Avoidable w/ Better Mgmt',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    },
    {
      value: '₹3,800 Cr',
      label: 'Market Opportunity',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 6l-9.5 9.5-5-5L1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      )
    }
  ];

  return (
    <div className="relative w-full max-w-[360px] mx-auto">
      {/* Background glow */}
      <div className="absolute inset-0 rounded-full blur-3xl scale-75" style={{ background: 'rgba(245,158,11,0.12)' }} />
      
      {/* List container */}
      <div className="relative p-6 space-y-7">
        <div className="flex flex-col gap-6">
          {stats.map(({ value, label, icon }) => (
            <div key={label} className="flex items-center gap-5 group">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105" 
                style={{ 
                  border: '1px solid rgba(245,158,11,0.3)', 
                  background: 'rgba(245,158,11,0.06)',
                  color: '#f59e0b'
                }}
              >
                {icon}
              </div>
              <div className="space-y-0.5">
                <p className="font-black text-2xl tracking-wide leading-none" style={{ color: '#f59e0b' }}>
                  {value}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {label}
                </p>
              </div>
            </div>
          ))}
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
    
      title: 'ANVAYA',
      subtitle: 'POSTBIOTIC FRUIT INGREDIENT',
      desc: 'ANVAYA™ transforms fragile, surplus fruit into resilient functional nutrition through advanced lacto-fermentation technology. Controlled fermentation converts fruit sugars into bioactive metabolites — generating postbiotics, antioxidants, and organic acids that support gut health. Dehydrated powder form eliminates cold chain requirements. No synthetic additives. No preservatives. One ingredient. Beverages, bakery, dairy, pharma, and wellness.',
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
