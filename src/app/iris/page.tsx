'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import Navbar from '../../components/Navbar';
import ContactModal from '../../components/ContactModal';
import { CopyEditorProvider } from '../../components/CopyEditorContext';
import ScrollReveal from '../../components/ScrollReveal';
import Footer from '../../components/Footer';
import { ScrollyCanvas } from '../../components/Hero/ScrollyCanvas';
import { HeroOverlay } from '../../components/Hero/HeroOverlay';

const irisFrameUrls = Array.from({ length: 93 }, (_, i) => `/iris/Iris/frame_${String(i).padStart(2, '0')}_delay-0.041s.png`);

/* ─── SVG Icons ─────────────────────────────────────────────────────────────── */

function ActivityIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
function ScanIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10" />
    </svg>
  );
}
function ThermometerIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
  );
}
function DropletsIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.09 3 12.25c0 2.22 1.8 4.05 4 4.05Z" />
      <path d="M17 18.5c1.37 0 2.5-1.14 2.5-2.53 0-.72-.35-1.41-1.07-2-.72-.58-1.56-1.46-1.75-2.37-.18.91-.71 1.77-1.43 2.35S14.5 15.25 14.5 15.97c0 1.39 1.13 2.53 2.5 2.53Z" />
    </svg>
  );
}

/* ─── Simple FadeIn wrapper ─────────────────────────────────────────────────── */
const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

/* ─── Page body ─────────────────────────────────────────────────────────────── */
function IrisContent() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });



  /* Probe reveal section transforms */
  const probeScale = useTransform(scrollYProgress, [0.15, 0.45], [0.85, 1]);
  const probeRotate = useTransform(scrollYProgress, [0.15, 0.45], [-8, 0]);

  /* Horizontal scroll for Wastage & Market sections */
  const horizontalScrollRef = useRef(null);
  const { scrollYProgress: horizontalProgress } = useScroll({
    target: horizontalScrollRef,
    offset: ['start start', 'end end'],
  });
  const horizontalX = useTransform(horizontalProgress, [0, 1], ['0%', '-50%']);

  /* Horizontal scroll for Tech & Partners sections */
  const horizontalScrollRef2 = useRef(null);
  const { scrollYProgress: horizontalProgress2 } = useScroll({
    target: horizontalScrollRef2,
    offset: ['start start', 'end end'],
  });
  const horizontalX2 = useTransform(horizontalProgress2, [0, 1], ['0%', '-50%']);

  /* ─── Shared section bg: transparent so the site's fixed image.png shows ── */
  const sectionBase: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
  };

  return (
    /*
      Outer wrapper mimics the home page structure:
        • No solid background (transparent) so globals.css body bg-image shows through
        • A light dark overlay identical to ClientScrollyWrapper
    */
    <div style={{ minHeight: '100vh', overflowX: 'clip', backgroundColor: 'transparent' }}>
      {/* Same fixed overlay used on all pages */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'rgba(0,17,19,0.55)', backdropFilter: 'blur(2px)' }} />

      <div className="relative z-10">
        <Navbar onConnectClick={() => setIsContactOpen(true)} />

        {/* ── BACKGROUND SEQUENCE WRAPPER ── */}
        <div ref={heroRef} style={{ position: 'relative' }}>
          
          <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ zIndex: 0 }}>
            {/* Cinematic Background Canvas Sequence plays across Hero & Problem */}
            <ScrollyCanvas imageUrls={irisFrameUrls} progress={heroProgress} />
          </div>

          <div style={{ position: 'relative', zIndex: 1, marginTop: '-100vh' }}>
            {/* ── 1. Hero ────────────────────────────────────────────────────── */}
            <section id="hero" style={{ ...sectionBase, height: '400vh', backgroundColor: 'transparent', position: 'relative' }}>
              <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
                {/* Overlay Elements (Title, CTA, Effects) */}
                <HeroOverlay progress={heroProgress} />
              </div>
            </section>

            {/* ── 2. The Problem — ScrollReveal headline + paragraph ─────────── */}
            <section id="problem" style={{ ...sectionBase, minHeight: '120vh', display: 'flex', alignItems: 'center', padding: '8rem 2rem', backgroundColor: 'transparent' }}>
              {/* ambient glow */}
              <div style={{ position: 'absolute', top: '10%', left: '15%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(18,169,122,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

              <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 10 }}>
                {/* ── BIG headline with word-reveal ── */}
                <ScrollReveal
                  baseOpacity={0}
                  enableBlur
                  baseRotation={4}
                  blurStrength={8}
                  containerClassName="iris-headline-reveal"
                  textClassName="iris-headline-text"
                  wordAnimationEnd="bottom center"
                >
                  EVERY YEAR, ₹1.5 LAKH CRORE IS LOST. SILENTLY.
                </ScrollReveal>

                {/* ── Body paragraph with word-reveal ── */}
                <ScrollReveal
                  baseOpacity={0}
                  enableBlur
                  baseRotation={2}
                  blurStrength={5}
                  containerClassName="iris-body-reveal"
                  textClassName="iris-body-text"
                  wordAnimationEnd="bottom center"
                >
                  India produces ~16 crore tonnes of fruits and vegetables annually — the 2nd largest globally. Yet 4–5 crore tonnes are lost post-harvest every single year, ~30–35% of total production, before anyone notices. Not in the field. In transit. In storage. In the dark.<br></br>
                  IRIS was built to turn that darkness into data.
                </ScrollReveal>
              </div>
            </section>

            {/* ── HORIZONTAL SCROLL CONTAINER for Wastage and Market Size ──────── */}
            <div id="wastage-container-parent" ref={horizontalScrollRef} className="horizontal-scroll-container" style={{ position: 'relative', zIndex: 10, backgroundColor: 'transparent' }}>
          <div className="horizontal-sticky-wrapper">
            <motion.div
              className="horizontal-motion-div"
              style={{
                x: isMobile ? 0 : horizontalX,
              }}
            >

              {/* ── NEW: The Wastage Numbers ─────────────────────────────────────── */}
              <section id="wastage" className="horizontal-section wastage-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
                  <FadeIn>
                    <h2 className="section-title" style={{ letterSpacing: '-0.03em' }}>
                      THE WASTAGE NUMBERS —<br /><span style={{ color: '#ea9616ff' }}>AND THE PRIZE FOR SOLVING THEM.</span>
                    </h2>
                  </FadeIn>
                  <div className="stat-card-grid">
                    {[
                      { val: '~16 Cr', unit: 'Tonnes', desc: 'Fruits & vegetables produced in India annually — 2nd largest producer globally.' },
                      { val: '4–5 Cr', unit: 'Tonnes', desc: 'Lost post-harvest every year. That is 30–35% of total production gone before it reaches a consumer.' },
                      { val: '₹1.5L', unit: 'Crore', desc: 'Economic loss annually (~$18 Billion USD). 40% of this is avoidable with better monitoring.' },
                      { val: '₹60K', unit: 'Crore', desc: 'Recoverable value — the immediate financial opportunity that better post-harvest technology can unlock.' },
                    ].map((stat, i) => (
                      <FadeIn key={i} delay={0.1 * i}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.5rem 0' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            <span style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 700, color: '#ea9616ff', lineHeight: 1, fontFamily: 'var(--font-primary)', letterSpacing: '-0.04em' }}>{stat.val}</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#ea9616ff', textTransform: 'uppercase', letterSpacing: '0.2em' }}>{stat.unit}</span>
                          </div>
                          <div style={{ width: '1.5rem', height: '1px', background: 'linear-gradient(to right, #ea9616ff, transparent)', borderRadius: '999px' }} />
                          <div style={{ fontSize: '0.85rem', color: '#b7c0be', lineHeight: 1.65 }}>{stat.desc}</div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                  <FadeIn delay={0.5}>
                    <div style={{ marginTop: '2rem' }}>
                      <p style={{ color: '#ea9616ff', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.25rem', opacity: 0.7 }}>Wastage by Crop</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                          { crop: 'Mango', loss: 30, value: '₹14,500 Cr/yr' },
                          { crop: 'Banana', loss: 28, value: '₹12,800 Cr/yr' },
                          { crop: 'Fruit', loss: 35, value: '₹10,200 Cr/yr' },
                          { crop: 'Papaya', loss: 40, value: '₹6,400 Cr/yr' },
                        ].map((c, i) => (
                          <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 90px', gap: '0.75rem', alignItems: 'center' }}>
                            <span style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '-0.01em' }}>{c.crop}</span>
                            <div style={{ position: 'relative', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${c.loss * 2}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.4, delay: 0.1 * i, ease: [0.22,1,0.36,1] }}
                                style={{ height: '100%', background: 'linear-gradient(to right, #ea9616ff, rgba(18,169,122,0.35))', borderRadius: '999px' }}
                              />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                              <span style={{ color: '#ea9616ff', fontWeight: 600 }}>{c.loss}%</span>
                              <span style={{ color: '#7c8886' }}>{c.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                </div>
              </section>

              {/* ── NEW: Market Size ─────────────────────────────────────────────── */}
              <section id="market-size" className="horizontal-section" style={{ display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                  <img src="/iris/2.jpeg" alt="Background" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,9,4,0.75)' }} />
                </div>
                <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                  <FadeIn>
                    <h2 className="market-section-title">
                      A ₹3,800 CRORE<br /><span style={{ color: '#10b981' }}>GREENFIELD OPPORTUNITY.</span>
                    </h2>
                  </FadeIn>

                  {/* Single featured opportunity card */}
                  <FadeIn delay={0.2}>
                    <motion.div
                      whileHover={{ scale: 1.015, boxShadow: '0 40px 80px rgba(16,185,129,0.18)' }}
                      transition={{ duration: 0.35 }}
                      style={{
                        maxWidth: 680,
                        margin: '0 auto 3rem',
                        background: 'rgba(10,18,10,0.75)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(16,185,129,0.25)',
                        borderRadius: '24px',
                        padding: '4rem 3rem',
                        boxShadow: '0 0 60px rgba(16,185,129,0.08), 0 20px 40px rgba(0,0,0,0.5)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Top accent glow bar */}
                      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.6), transparent)' }} />

                      <div style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', fontWeight: 900, color: '#10b981', lineHeight: 1, letterSpacing: '-0.02em', fontFamily: "'Arial Black',Arial,sans-serif", marginBottom: '0.5rem' }}>
                        ₹3,800 Cr
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '2rem' }}>
                        Opportunity Market
                      </div>
                      <div style={{ width: '3rem', height: '2px', background: 'linear-gradient(to right, #10b981, transparent)', borderRadius: '999px', margin: '0 auto 2rem' }} />
                      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
                        Projected opportunity across India&apos;s early fruit quality monitoring and post-harvest technology ecosystem.
                      </p>

                      {/* Bottom corner glow */}
                      <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    </motion.div>
                  </FadeIn>

                  <FadeIn delay={0.6}>
                    <p style={{ color: '#7c8886', fontSize: '0.85rem', maxWidth: 800, margin: '0 auto', lineHeight: 1.7, letterSpacing: '-0.003em' }}>
                      India&apos;s F&amp;V market is growing at ~8% CAGR. Cold chain infrastructure is set to double by 2030 under PM Gati Shakti. Sensor-based quality control is a ₹3,800+ Crore greenfield opportunity with virtually no organized competition today.
                    </p>
                  </FadeIn>
                </div>
              </section>

            </motion.div>
          </div>
        </div>

        </div>
        </div>

        {/* ── 3. Probe Reveal ──────────────────────────────────────────────── */}
        <section id="inside-iris" style={{ ...sectionBase, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '8rem 2rem', overflow: 'hidden' }}>
          {/* Orchard backdrop */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img src="/iris/orchard.png" alt="Orchard" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.07 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(4,9,4,0.7), transparent 20%, transparent 80%, rgba(4,9,4,0.7))' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1200, margin: '0 auto' }} className="flex flex-col lg:flex-row items-center gap-16">
            <div style={{ flex: 1 }}>
              <FadeIn>
                <span style={{ color: '#12a97a', textTransform: 'uppercase', letterSpacing: '0.22em', fontSize: '0.68rem', fontWeight: 600, display: 'block', marginBottom: '1rem', opacity: 0.8 }}>Meet the Future</span>
                <h2 style={{ fontFamily: 'var(--font-primary)', fontWeight: 700, fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)', color: '#ffffff', textTransform: 'uppercase', marginBottom: '1.75rem', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
                  Enter the Iris.
                </h2>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p style={{ fontSize: '0.88rem', color: '#b7c0be', lineHeight: 1.75, marginBottom: '2.5rem', letterSpacing: '-0.005em' }}>
                  IRIS is a portable, non-invasive fruit monitoring system that detects ripeness using Volatile Organic Compound (VOC) release — no touching, no damage, no guesswork. Powered by IoT connectivity, embedded machine learning, and smart sensors, it delivers real-time freshness data for multiple fruits simultaneously, built specifically for transit and storage environments.</p>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    { icon: <ActivityIcon />, title: 'VOC Detection', desc: 'Continuously reads volatile organic compounds released by fruit as they ripen, detecting changes invisible to the human eye or hand.' },
                    { icon: <ScanIcon />, title: 'Non-Invasive Monitoring', desc: 'No touching, no sampling, no damage. Fruit integrity is completely preserved throughout the monitoring process.' },
                    { icon: <ActivityIcon />, title: 'Embedded ML Intelligence', desc: 'Interprets color-change and VOC-pattern data to predict ripeness stage with accuracy, not estimation.' },
                    { icon: <ScanIcon />, title: 'Real-Time IoT Connectivity', desc: 'Live data logging and remote monitoring via Wi-Fi and Bluetooth. Track multiple batches from one dashboard, anywhere.' },
                  ].map((item) => (
                    <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: 'rgba(18,169,122,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', flexShrink: 0, justifyContent: 'center', color: '#12a97a' }}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>{item.title}</h4>
                        <p style={{ fontSize: '0.8rem', color: '#b7c0be', margin: 0, lineHeight: 1.65 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            <div style={{ flex: 1, position: 'relative', width: '100%', maxWidth: 500 }} className="aspect-square">
              <motion.div style={{ scale: probeScale, rotate: probeRotate, width: '100%', height: '100%', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '10%', background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 60%)', filter: 'blur(30px)', borderRadius: '50%' }} className="animate-pulse" />
                <video src="/iris/White_box.mp4" autoPlay loop muted playsInline onTimeUpdate={(e) => { if (e.currentTarget.currentTime >= 6) { e.currentTarget.currentTime = 0; } }} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 1 }} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── 4. Precision Stats ────────────────────────────────────────────── */}
        <section id="stats" className="precision-stats-section" style={{ ...sectionBase, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <img src="/iris/4.png" alt="Fruit Cross Section" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(4,9,4,0.97) 0%, rgba(4,9,4,0.82) 50%, rgba(4,9,4,0.4) 100%)' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <FadeIn>
              <h2 className="precision-stats-title" style={{ fontFamily: 'var(--font-primary)', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3.8rem)', color: '#ffffff', textTransform: 'uppercase', marginBottom: '1.25rem', lineHeight: 0.98, letterSpacing: '-0.03em' }}>
                YOUR STOREHOUSE <br /><span style={{ color: '#12a97a' }}>JUST GOT A BRAIN.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="precision-stats-desc" style={{ fontSize: '0.88rem', color: '#b7c0be', maxWidth: 600, lineHeight: 1.75, letterSpacing: '-0.005em' }}>
                IRIS continuously tracks VOC levels to predict spoilage, optimize dispatch, and reduce post-harvest losses in real time — replacing manual inspection and guesswork with accurate, AI-powered insights.</p>
            </FadeIn>

            <div className="precision-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '4rem', maxWidth: 1000 }}>
              {[
                { num: '01', title: 'Predict Spoilage Early', desc: 'Detect rising VOC levels before visible decay appears, preventing losses before they spread.', delay: 0.3 },
                { num: '02', title: 'Optimize Dispatch', desc: 'Identify which batches are ready to ship and which require more time for peak freshness.', delay: 0.4 },
                { num: '03', title: 'Reduce Post-Harvest Losses', desc: 'Continuously monitor fruit quality without handling or damaging a single fruit.', delay: 0.5 },
                { num: '04', title: 'Real-Time Visibility', desc: 'Track storage conditions and freshness trends across multiple batches from one dashboard.', delay: 0.6 },
                { num: '05', title: 'Data-Driven Decisions', desc: 'Replace manual inspection and guesswork with accurate, AI-powered insights.', delay: 0.7 },
                { num: '06', title: 'Maximize Profitability', desc: 'Improve quality consistency, reduce waste, and increase returns across the supply chain.', delay: 0.8 },
              ].map((cap) => (
                <FadeIn key={cap.title} delay={cap.delay}>
                  <motion.div
                    className="precision-stat-card"
                    whileHover={{ y: -4, boxShadow: '0 24px 48px rgba(0,0,0,0.5), 0 0 24px rgba(18,169,122,0.08)' }}
                    transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
                    style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.75rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)' }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, #10b981, transparent)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 500, color: 'rgba(18,169,122,0.4)', letterSpacing: '0.2em' }}>{cap.num}</span>
                    <div className="precision-stat-card-title" style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em' }}>{cap.title}</div>
                    <div className="precision-stat-card-desc" style={{ fontSize: '0.85rem', color: '#b7c0be', lineHeight: 1.65, flex: 1 }}>{cap.desc}</div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. Journey ───────────────────────────────────────────────────── */}
        <section id="applications" style={{ ...sectionBase, padding: '8rem 2rem' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <FadeIn>
              <h2 style={{ fontFamily: "'Arial Black','Arial Bold',Arial,Impact,sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: '#ffffff', textTransform: 'uppercase', textAlign: 'center', marginBottom: '6rem', letterSpacing: '0.02em' }}>
                From Canopy to Carton.
              </h2>
            </FadeIn>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
              {[
                {
                  icon: <ThermometerIcon />,
                  title: 'Cold Storage & Warehousing',
                  body: 'Optimize storage duration and reduce spoilage of bulk-stored fruits and vegetables. Detect rising VOC levels before visible decay appears — preventing losses before they spread across the batch.',
                  delay: 0.1,
                },
                {
                  icon: <DropletsIcon />,
                  title: 'Cold Chain Logistics & 3PLs',
                  body: 'In-transit VOC monitoring for refrigerated trucks, reefers, and containers to prevent premature ripening and catch spoilage before it reaches the destination.',
                  delay: 0.2,
                },
                {
                  icon: <ActivityIcon size={40} />,
                  title: 'Organized Retail & Supermarkets',
                  body: 'Shelf-life prediction and dynamic markdown and restocking decisions at distribution centers and stores. Know exactly which produce needs to move first.',
                  delay: 0.3,
                },
                {
                  icon: <ScanIcon />,
                  title: 'Quick-Commerce & Online Grocery',
                  body: 'Inventory freshness scoring for dark stores to minimize last-mile delivery of overripe produce and reduce customer complaints and returns.',
                  delay: 0.4,
                },
                {
                  icon: <ActivityIcon size={40} />,
                  title: 'Food Processing & Packaging',
                  body: 'Quality-grading inputs for juice, puree, and ready-to-eat processing units. Ensure only the right-ripeness fruit enters your production line.',
                  delay: 0.5,
                },
                {
                  icon: <ThermometerIcon />,
                  title: 'FPOs, Exporters & Large Growers',
                  body: 'Post-harvest ripening control for export consignments and farm-gate aggregation centers. Meet international quality standards, batch after batch.',
                  delay: 0.6,
                },
              ].map((card) => (
                <FadeIn key={card.title} delay={card.delay}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ height: 90, width: 90, borderRadius: '20px', backgroundColor: 'rgba(18,169,122,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', color: '#12a97a', transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)' }}>
                      {card.icon}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{card.title}</h3>
                    <p style={{ color: '#b7c0be', lineHeight: 1.75, fontSize: '0.9rem' }}>{card.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>



        {/* ── HORIZONTAL SCROLL CONTAINER 2 for Tech and Target Partners ──────── */}
        <div id="tech-container-parent" ref={horizontalScrollRef2} className="horizontal-scroll-container">
          <div className="horizontal-sticky-wrapper">
            <motion.div
              className="horizontal-motion-div"
              style={{
                x: isMobile ? 0 : horizontalX2,
              }}
            >

              {/* ── NEW: Under the Hood (Tech) ───────────────────────────────────── */}
              <section id="tech" className="horizontal-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                  <img src="/iris/3.png" alt="Background" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,5,2,0.75)' }} />
                </div>
                <div style={{ maxWidth: 1400, width: '100%', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                  <FadeIn>
                    <h2 style={{ fontFamily: "'Arial Black','Arial Bold',Arial,Impact,sans-serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: '#ffffff', textTransform: 'uppercase', textAlign: 'center', marginBottom: '2rem', letterSpacing: '0.02em' }}>
                      UNDER THE HOOD.
                    </h2>
                  </FadeIn>
                  <style dangerouslySetInnerHTML={{ __html: `
              .horizontal-scroll-container {
                height: 200vh;
                position: relative;
              }
              .horizontal-sticky-wrapper {
                position: sticky;
                top: 0;
                height: 100vh;
                overflow: hidden;
                display: flex;
              }
              .horizontal-motion-div {
                display: flex;
                width: 200vw;
                height: 100%;
              }
              .horizontal-section {
                width: 100vw;
                min-height: 100vh;
                height: auto;
                display: flex;
                flex-shrink: 0;
                padding: 7rem 3rem 5rem;
                overflow-y: auto;
              }
              .wastage-section {
                align-items: flex-start;
                padding-top: 8rem;
                padding-bottom: 6rem;
              }
              .stat-card-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 2rem;
                margin-bottom: 4rem;
              }
              .crop-table-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
              }
              .circle-cards-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 2rem;
                margin-bottom: 4rem;
              }
              .circle-card-item {
                width: 280px;
                height: 280px;
                border-radius: 50%;
                background-color: rgba(16,185,129,0.05);
                border: 2px solid rgba(16,185,129,0.2);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 2rem;
                gap: 1rem;
              }
              .section-title {
                font-family: 'Arial Black','Arial Bold',Arial,Impact,sans-serif;
                font-weight: 900;
                font-size: clamp(2rem, 5vw, 4rem);
                color: #ffffff;
                text-transform: uppercase;
                margin-bottom: 4rem;
                line-height: 1.1;
                text-align: center;
              }
              .market-section-title {
                font-family: 'Arial Black','Arial Bold',Arial,Impact,sans-serif;
                font-weight: 900;
                font-size: clamp(2rem, 4vw, 3.5rem);
                color: #ffffff;
                text-transform: uppercase;
                margin-bottom: 4rem;
                line-height: 1.1;
                text-align: center;
              }

              .scatter-container {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                position: relative;
                width: 100%;
                height: auto;
              }
              .scatter-card {
                position: relative;
                width: 100%;
                z-index: 2;
              }
              @media (min-width: 1024px) {
                .scatter-container {
                  height: 70vh;
                  display: block;
                  margin-top: 2rem;
                }
                .scatter-card {
                  position: absolute !important;
                }
                .scatter-card-0 { top: 0%;  left: 3%;  width: 28%; }
                .scatter-card-1 { top: -3%; left: 68%; width: 28%; }
                .scatter-card-2 { top: 35%; left: 6%;  width: 28%; }
                .scatter-card-3 { top: 28%; left: 37%; width: 28%; z-index: 5; }
                .scatter-card-4 { top: 42%; left: 68%; width: 28%; }
              }

              @media (max-width: 1023px) {
                /* Vertical stacking: collapse both horizontal scroll containers */
                .horizontal-scroll-container {
                  height: auto !important;
                }
                .horizontal-sticky-wrapper {
                  position: relative !important;
                  top: auto !important;
                  height: auto !important;
                  overflow: visible !important;
                  display: block !important;
                }
                .horizontal-motion-div {
                  width: 100% !important;
                  height: auto !important;
                  flex-direction: column !important;
                  transform: none !important;
                }
                .horizontal-section {
                  width: 100% !important;
                  height: auto !important;
                  min-height: auto !important;
                  padding: 5rem 1.25rem 3rem 1.25rem !important;
                }

                /* Inner layout compaction */
                .stat-card-grid {
                  grid-template-columns: 1fr 1fr !important;
                  gap: 1rem !important;
                  margin-bottom: 1.5rem !important;
                }
                .crop-table-grid {
                  grid-template-columns: 1fr 1fr !important;
                  gap: 0.75rem !important;
                }
                .crop-table-box {
                  padding: 1rem !important;
                }
                .section-title {
                  margin-bottom: 1.5rem !important;
                  font-size: 1.5rem !important;
                }
                .market-section-title {
                  margin-bottom: 1.5rem !important;
                  font-size: 1.5rem !important;
                }

                /* Circle cards — stack vertically, auto size */
                .circle-cards-container {
                  flex-direction: column !important;
                  align-items: center !important;
                  gap: 1.25rem !important;
                  margin-bottom: 2rem !important;
                }
                .circle-card-item {
                  width: clamp(240px, 75vw, 320px) !important;
                  height: auto !important;
                  border-radius: 16px !important;
                  padding: 1.5rem !important;
                  gap: 0.75rem !important;
                }
                .circle-card-title {
                  font-size: 1.1rem !important;
                }
                .circle-card-desc {
                  font-size: 0.85rem !important;
                  line-height: 1.4 !important;
                }

                /* Tech cards — vertical scrollable list */
                .scatter-container {
                  display: flex !important;
                  flex-direction: column !important;
                  gap: 0.75rem !important;
                  height: auto !important;
                }
                .scatter-card {
                  position: relative !important;
                  width: 100% !important;
                  height: auto !important;
                }

                /* Partner groups — vertical list */
                .partners-container {
                  display: grid !important;
                  grid-template-columns: 1fr !important;
                  gap: 1.5rem !important;
                  max-width: 100% !important;
                  margin: 0 !important;
                }
                .partner-group {
                  width: 100% !important;
                  margin-top: 0 !important;
                }
                .partner-group-title {
                  font-size: 1.1rem !important;
                  margin-bottom: 0.5rem !important;
                }
                .partner-group-desc {
                  font-size: 0.9rem !important;
                  line-height: 1.5 !important;
                }

                /* Precision Stats section — auto height, scrollable */
                .precision-stats-section {
                  height: auto !important;
                  overflow: visible !important;
                  padding: 6rem 1.5rem !important;
                }
                .precision-stats-title {
                  font-size: 2rem !important;
                  margin-bottom: 1rem !important;
                }
                .precision-stats-desc {
                  font-size: 0.9rem !important;
                  line-height: 1.5 !important;
                }
                .precision-stats-grid {
                  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important;
                  gap: 1.25rem !important;
                  margin-top: 2rem !important;
                }
                .precision-stat-card {
                  padding-left: 1rem !important;
                }
                .precision-stat-card-title {
                  font-size: 1rem !important;
                  margin-bottom: 0.25rem !important;
                }
                .precision-stat-card-desc {
                  font-size: 0.75rem !important;
                  line-height: 1.4 !important;
                }
              }
            ` }} />
                  <div className="scatter-container">
                    {[
                      { title: 'ESP32-S3 Core', desc: 'The brain of IRIS. Handles all processing and manages Wi-Fi and Bluetooth data transmission.' },
                      { title: 'Airtight Observation Box', desc: 'A controlled environment that ensures accurate, interference-free VOC readings every time.' },
                      { title: 'Embedded ML Engine', desc: 'Interprets color-change and VOC patterns to classify and predict ripeness stage automatically.' },
                      { title: 'Real-Time Data', desc: 'Real-time data logging and remote monitoring via Wi-Fi and Bluetooth to your dashboard.' },
                      { title: 'On-Device Display', desc: 'Live readout directly on the device. No app required to get an immediate freshness reading.' },
                    ].map((comp, i) => (
                      <motion.div
                        key={i}
                        className={`scatter-card scatter-card-${i}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 1.0, delay: 0.12 * i, ease: [0.22,1,0.36,1] }}
                        animate={{ y: [0, -8, 0] }}
                        style={{ backgroundColor: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 24px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)' }}
                      >
                        <div style={{ color: '#12a97a', fontWeight: 600, fontSize: '1rem', marginBottom: '0.6rem', letterSpacing: '-0.01em' }}>{comp.title}</div>
                        <div style={{ color: '#b7c0be', fontSize: '0.88rem', lineHeight: 1.65 }}>{comp.desc}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── NEW: Target Partners ─────────────────────────────────────────── */}
              <section id="partners" className="horizontal-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                  <img src="/iris/3.png" alt="Background" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,9,4,0.75)' }} />
                </div>
                <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 10 }}>
                  <FadeIn>
                    <h2 style={{ fontFamily: "'Arial Black','Arial Bold',Arial,Impact,sans-serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: '#ffffff', textTransform: 'uppercase', textAlign: 'center', marginBottom: '2rem', letterSpacing: '0.02em' }}>
                      BUILT FOR THE <span style={{ color: '#10b981' }}>ENTIRE VALUE CHAIN.</span>
                    </h2>
                  </FadeIn>
                  <div className="partners-container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', maxWidth: 900, margin: '0 auto' }}>
                    <FadeIn delay={0.2}>
                      <div className="partner-group">
                        <h3 className="partner-group-title" style={{ color: '#ffffff', fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>Cold Storage & Cold-Chain Logistics:</h3>
                        <p className="partner-group-desc" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.6 }}>Snowman Logistics · DHL Supply Chain India · TCI Express / Gati Kausar · Blue Dart (cold logistics) · State-run cold storages (UP, WB, Punjab, Haryana)</p>
                      </div>
                    </FadeIn>
                    <FadeIn delay={0.3}>
                      <div className="partner-group">
                        <h3 className="partner-group-title" style={{ color: '#ffffff', fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>Organized Retail, Quick-Commerce & Wholesale:</h3>
                        <p className="partner-group-desc" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.6 }}>Reliance Retail (Fresh / Smart Bazaar) · DMart / Big Bazaar / Spencer&apos;s · BigBasket, Blinkit, Zepto, Swiggy Instamart · Nature&apos;s Basket / Star Bazaar · APMC / Mandi wholesale markets (Azadpur, Vashi)</p>
                      </div>
                    </FadeIn>
                    <FadeIn delay={0.4}>
                      <div className="partner-group" style={{ backgroundColor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '16px', padding: '2rem', marginTop: '1rem' }}>
                        <h3 style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Priority Rollout Regions:</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div>
                            <strong style={{ color: '#fff' }}>North India (UP, Punjab, Haryana)</strong>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', margin: '0.25rem 0 0' }}>largest cold storage capacity, potato-dominant.</p>
                          </div>
                          <div>
                            <strong style={{ color: '#fff' }}>West India (Maharashtra, Gujarat)</strong>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', margin: '0.25rem 0 0' }}>fruit, dairy, and processed food hub with strong organized retail and port connectivity for exports.</p>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  </div>
                </div>
              </section>

            </motion.div>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <Footer />
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}

export default function IrisPage() {
  return (
    <CopyEditorProvider>
      <IrisContent />
    </CopyEditorProvider>
  );
}
