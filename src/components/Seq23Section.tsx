'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useFrameSequence } from '../hooks/useFrameSequence';

// ─── Scrollytelling canvas for seq2 + seq3 ───────────────────────────────────
function Seq23Canvas({ images }: { images: HTMLImageElement[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderFrameRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const frameIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, Math.max(0, images.length - 1)],
  );

  const draw = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = images[Math.round(Math.max(0, Math.min(images.length - 1, index)))];
    if (!img) return;

    // Use cover mode + extra zoom to crop watermarks from all edges
    const ZOOM = 1.12; // increase to crop more of the frame edges
    const cr = canvas.width / canvas.height;
    const ir = img.width / img.height;
    let dw: number, dh: number;
    if (cr > ir) {
      dw = canvas.width * ZOOM;
      dh = dw / ir;
    } else {
      dh = canvas.height * ZOOM;
      dw = dh * ir;
    }
    const ox = (canvas.width - dw) / 2;
    const oy = (canvas.height - dh) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, ox, oy, dw, dh);
  };


  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const next = Math.round(latest);
    if (next !== renderFrameRef.current) {
      renderFrameRef.current = next;
      requestAnimationFrame(() => draw(next));
    }
  });

  // Track active tab index based on scroll progress (divided into 3 parts)
  const [activeTab, setActiveTab] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.35) {
      if (activeTab !== 0) setActiveTab(0);
    } else if (latest < 0.7) {
      if (activeTab !== 1) setActiveTab(1);
    } else {
      if (activeTab !== 2) setActiveTab(2);
    }
  });

  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      requestAnimationFrame(() => draw(renderFrameRef.current));
    };
    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  // Content configuration for the three phases
  const tabContent = [
    {
      label: 'ABOUT',
      num: '01',
      title: 'Innovation',
      slogan: 'Harvesting Innovation, Cultivating Prosperity',
      desc: 'Pioneering eco-friendly crop protection solutions. We engineer advanced agricultural biotechnology to increase yields while preserving the ecological balance and vitality of soil ecosystems.',
      bullets: [
        '100% Bio-Organic Formulas',
        'Enhanced Soil Micro-Biomes',
        'Climate-Resilient Plant Growth'
      ]
    },
    {
      label: 'SERVICES',
      num: '02',
      title: 'SMART AGRITECH SERVICES',
      slogan: 'INTELLIGENCE FOR EVERY HARVEST',
      desc: 'Our services combine agricultural expertise, data analytics, and advanced sensing technologies to help growers, distributors, and food businesses make smarter decisions. From fruit quality assessment to post-harvest optimization, we deliver practical solutions that improve efficiency, reduce waste, and maximize value across the supply chain.',
      bullets: [
        'AI-Powered Fruit Quality Assessment',
        'Non-Destructive Maturity Analysis',
        'Post-Harvest Loss Reduction',
        'Supply Chain Quality Intelligence'
      ]
    },
    {
      label: 'CONTACT & SOCIALS',
      num: '03',
      title: 'Partner With Us',
      slogan: 'Support us in our journey',
      desc: 'We collaborate with commercial farming companies, biotech researchers, and distribution networks globally. Reach out to integrate our agrotech solutions into your operations.',
      socials: [
        { name: 'Email Support', val: 'director@fvplus.in', link: 'mailto:director@fvplus.in' },
        { name: 'LinkedIn Company', val: 'FV Plus Agrotech Innovations', link: 'https://www.linkedin.com/company/fv-plus-agrotech-innovations/posts/?feedView=all' },

      ]
    }
  ];

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '700vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Sequence canvas */}
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Centered centerpiece cinematic information card */}
        <div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none z-10">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl glass-card rounded-2xl p-5 md:p-10 border-emerald-500/20 shadow-[0_30px_70px_rgba(0,0,0,0.6)] pointer-events-auto backdrop-blur-xl relative overflow-hidden"
          >
            {/* Header tab navigation indicators */}
            <div className="flex justify-between items-center border-b border-emerald-500/10 pb-4 mb-6">
              <div className="flex gap-6">
                {tabContent.map((tab, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      // Custom scrolling behavior if clicked
                      const targetProgress = idx === 0 ? 0.15 : idx === 1 ? 0.5 : 0.85;
                      const scrollContainer = containerRef.current;
                      if (scrollContainer) {
                        const rect = scrollContainer.getBoundingClientRect();
                        const absoluteTop = window.scrollY + rect.top;
                        const targetScroll = absoluteTop + targetProgress * (scrollContainer.scrollHeight - window.innerHeight);
                        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                      }
                    }}
                    className={`text-xs md:text-sm font-bold tracking-widest transition-all duration-300 relative pb-1.5 ${activeTab === idx ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    {tab.label.split(' ')[0]}
                    {activeTab === idx && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-400"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
              <span className="text-emerald-500/30 font-black text-3xl md:text-4xl tracking-tighter">
                {tabContent[activeTab].num}
              </span>
            </div>

            {/* Content Transition Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-6 min-h-[290px] md:min-h-[340px] flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="text-xs md:text-sm tracking-[0.2em] font-semibold text-emerald-400/80 uppercase">
                    {tabContent[activeTab].label}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase leading-tight">
                    {tabContent[activeTab].title}
                  </h3>
                  <p className="text-yellow-400/95 text-sm md:text-base font-medium tracking-wider uppercase">
                    &quot;{tabContent[activeTab].slogan}&quot;
                  </p>
                  <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed pt-2">
                    {tabContent[activeTab].desc}
                  </p>
                </div>

                {/* Bullets or Links depending on state */}
                <div className="pt-6 border-t border-emerald-500/10">
                  {tabContent[activeTab].bullets ? (
                    <ul className="space-y-3">
                      {tabContent[activeTab].bullets?.map((bullet, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm md:text-base text-gray-400 font-light">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-3">
                      {tabContent[activeTab].socials?.map((social, i) => (
                        <a
                          key={i}
                          href={social.link}
                          className="flex items-center justify-between bg-black/40 hover:bg-black/70 border border-emerald-500/10 hover:border-emerald-500/35 rounded-lg px-4 py-3 transition-all duration-300 group"
                        >
                          <span className="text-xs uppercase font-bold text-gray-500 group-hover:text-emerald-400 transition-colors">
                            {social.name}
                          </span>
                          <span className="text-sm text-gray-300 font-light">
                            {social.val}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Glowing corner indicator */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent blur-xl pointer-events-none" />
          </motion.div>
        </div>

        {/* Top & Bottom decorative gradients for depth */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#061206]/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#061206]/80 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

// ─── Main export — seq2+3 canvas with floating info box ─────────────────────────
export default function Seq23Section({ imageUrls }: { imageUrls: string[] }) {
  const { images, isLoaded } = useFrameSequence(imageUrls);

  if (!isLoaded || images.length === 0) return null;

  return (
    <div className="relative">
      <Seq23Canvas images={images} />
    </div>
  );
}
