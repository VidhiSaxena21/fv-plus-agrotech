'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import Navbar from '../../components/Navbar';
import ContactModal from '../../components/ContactModal';
import { CopyEditorProvider } from '../../components/CopyEditorContext';
import ScrollReveal from '../../components/ScrollReveal';
import Footer from '../../components/Footer';

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

  /* Mouse parallax for hero */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 45, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 22 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set(((e.clientX - cx) / cx) * 18);
      mouseY.set(((e.clientY - cy) / cy) * 12);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '45%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

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
      <div className="fixed inset-0 z-0 pointer-events-none bg-black/40 backdrop-blur-[2px]" />

      <div className="relative z-10">
        <Navbar onConnectClick={() => setIsContactOpen(true)} />

        {/* ── 1. Hero ────────────────────────────────────────────────────── */}
        {/* backgroundColor blocks the global image.png; only hero-probe.png shows */}
        <section style={{ ...sectionBase, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#020502' }}>

          {/* Hero-probe.png with mouse parallax */}
          <motion.div style={{ position: 'absolute', inset: 0, zIndex: 0, y: heroY, opacity: heroOpacity }}>
            <motion.div
              style={{ width: '100%', height: '100%', x: springX, y: springY, scale: 1.08 }}
              animate={{ scale: [1.08, 1.12, 1.08] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src="/iris/hero-probe.png" alt="Iris Probe Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
            </motion.div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(2,5,2,0.08) 0%, rgba(2,5,2,0.45) 60%, #020502 100%)' }} />
          </motion.div>
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 1000, padding: '0 1.5rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <h1
                style={{
                  fontFamily: "'Arial Black','Arial Bold',Arial,Impact,sans-serif",
                  fontWeight: 900,
                  fontSize: 'clamp(2.5rem, 8vw, 6.5rem)',
                  color: '#ffffff',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '1.5rem',
                  lineHeight: 0.95,
                }}
              >
                IRIS <span style={{ color: '#10b981' }}></span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              style={{ fontSize: 'clamp(1rem, 1.5vw, 1.4rem)', color: 'rgba(255,255,255,0.75)', fontWeight: 300, letterSpacing: '0.05em', maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}
            >
              Freshness Shouldn&apos;t Be a Guessing Game.<br></br>
              A portable, non-invasive fruit monitoring system powered by IoT, embedded ML, and smart sensors — built for transit and storage.
            </motion.p>
          </div>

          {/* Scroll cue */}
          <div style={{ position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none', opacity: 0.5 }}>
            <span style={{ color: 'white', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Scroll</span>
            <motion.div
              animate={{ scaleY: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 1.5, height: 35, background: 'linear-gradient(to bottom, #10b981, transparent)', transformOrigin: 'top' }}
            />
          </div>
        </section>

        {/* ── 2. The Problem — ScrollReveal headline + paragraph ─────────── */}
        <section style={{ ...sectionBase, minHeight: '80vh', display: 'flex', alignItems: 'center', padding: '8rem 2rem' }}>
          {/* ambient glow */}
          <div style={{ position: 'absolute', top: '10%', left: '15%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

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
        <div ref={horizontalScrollRef} className="horizontal-scroll-container">
          <div className="horizontal-sticky-wrapper">
            <motion.div
              className="horizontal-motion-div"
              style={{
                x: isMobile ? 0 : horizontalX,
              }}
            >

              {/* ── NEW: The Wastage Numbers ─────────────────────────────────────── */}
              <section className="horizontal-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                  <img src="/imported.png" alt="Background" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,5,2,0.75)' }} />
                </div>
                <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
                  <FadeIn>
                    <h2 className="section-title">
                      THE WASTAGE NUMBERS —<br /><span style={{ color: '#10b981' }}>AND THE PRIZE FOR SOLVING THEM.</span>
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
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                            <span style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, color: '#10b981', lineHeight: 1, fontFamily: "'Arial Black',Arial,sans-serif", letterSpacing: '-0.02em' }}>{stat.val}</span>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'rgba(16,185,129,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.unit}</span>
                          </div>
                          <div style={{ width: '2rem', height: '2px', background: 'linear-gradient(to right, #10b981, transparent)', borderRadius: '999px' }} />
                          <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{stat.desc}</div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                  <FadeIn delay={0.5}>
                    <div style={{ marginTop: '1rem' }}>
                      <p style={{ color: 'rgba(16,185,129,0.7)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Wastage by Crop</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                          { crop: 'Mango', loss: 30, value: '₹14,500 Cr/yr' },
                          { crop: 'Banana', loss: 28, value: '₹12,800 Cr/yr' },
                          { crop: 'Guava', loss: 35, value: '₹10,200 Cr/yr' },
                          { crop: 'Papaya', loss: 40, value: '₹6,400 Cr/yr' },
                        ].map((c, i) => (
                          <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 110px', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '0.95rem' }}>{c.crop}</span>
                            <div style={{ position: 'relative', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${c.loss * 2}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: 0.1 * i, ease: [0.16,1,0.3,1] }}
                                style={{ height: '100%', background: 'linear-gradient(to right, #10b981, rgba(16,185,129,0.4))', borderRadius: '999px' }}
                              />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                              <span style={{ color: '#10b981', fontWeight: 700 }}>{c.loss}%</span>
                              <span style={{ color: 'rgba(255,255,255,0.45)' }}>{c.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                </div>
              </section>

              {/* ── NEW: Market Size ─────────────────────────────────────────────── */}
              <section className="horizontal-section" style={{ display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                  <img src="/imported.png" alt="Background" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,9,4,0.75)' }} />
                </div>
                <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                  <FadeIn>
                    <h2 className="market-section-title">
                      A ₹3,800 CRORE<br /><span style={{ color: '#10b981' }}>GREENFIELD OPPORTUNITY.</span>
                    </h2>
                  </FadeIn>
                  <div className="circle-cards-container">
                    {[
                      { title: 'TAM — ₹2,10,000 Cr', desc: "Total Addressable Market: India's full fruits and vegetables market from farm-gate to consumer." },
                      { title: 'SAM — ₹38,000 Cr', desc: 'Serviceable Addressable Market: Modern trade, cold chain, and export segment.' },
                      { title: 'SOM — ₹3,800 Cr', desc: 'Serviceable Obtainable Market: Early adopters across 5 key states in Years 1–3.' },
                    ].map((circle, i) => (
                      <FadeIn key={i} delay={0.2 * i}>
                        <div className="circle-card-item">
                          <div className="circle-card-title" style={{ color: '#10b981', fontWeight: 800, fontSize: '1.2rem', textAlign: 'center' }}>{circle.title}</div>
                          <div className="circle-card-desc" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', textAlign: 'center', lineHeight: 1.5 }}>{circle.desc}</div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                  <FadeIn delay={0.6}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: 800, margin: '0 auto', lineHeight: 1.6 }}>
                      India&apos;s F&amp;V market is growing at ~8% CAGR. Cold chain infrastructure is set to double by 2030 under PM Gati Shakti. Sensor-based quality control is a ₹3,800+ Crore greenfield opportunity with virtually no organized competition today.
                    </p>
                  </FadeIn>
                </div>
              </section>

            </motion.div>
          </div>
        </div>

        {/* ── 3. Probe Reveal ──────────────────────────────────────────────── */}
        <section style={{ ...sectionBase, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '8rem 2rem', overflow: 'hidden' }}>
          {/* Orchard backdrop */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img src="/iris/orchard.png" alt="Orchard" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.07 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(4,9,4,0.7), transparent 20%, transparent 80%, rgba(4,9,4,0.7))' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1200, margin: '0 auto' }} className="flex flex-col lg:flex-row items-center gap-16">
            <div style={{ flex: 1 }}>
              <FadeIn>
                <span style={{ color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.25em', fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '1rem' }}>Meet the Future</span>
                <h2 style={{ fontFamily: "'Arial Black','Arial Bold',Arial,Impact,sans-serif", fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#ffffff', textTransform: 'uppercase', marginBottom: '2rem', lineHeight: 1.1 }}>
                  Enter the Iris.
                </h2>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                  IRIS is a portable, non-invasive fruit monitoring system that detects ripeness using Volatile Organic Compound (VOC) release — no touching, no damage, no guesswork. Powered by IoT connectivity, embedded machine learning, and smart sensors, it delivers real-time freshness data for multiple fruits simultaneously, built specifically for transit and storage environments. </p>
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
                      <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', flexShrink: 0, justifyContent: 'center', color: '#10b981' }}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.2rem' }}>{item.title}</h4>
                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            <div style={{ flex: 1, position: 'relative', width: '100%', maxWidth: 500 }} className="aspect-square">
              <motion.div style={{ scale: probeScale, rotate: probeRotate, width: '100%', height: '100%', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '10%', background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 60%)', filter: 'blur(30px)', borderRadius: '50%' }} className="animate-pulse" />
                <img src="/iris/probe-in-hand.png" alt="Iris Probe in Hand" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 1 }} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── 4. Precision Stats ────────────────────────────────────────────── */}
        <section className="precision-stats-section" style={{ ...sectionBase, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <img src="/iris/guava-cross-section.png" alt="Guava Cross Section" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(4,9,4,0.97) 0%, rgba(4,9,4,0.82) 50%, rgba(4,9,4,0.4) 100%)' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <FadeIn>
              <h2 className="precision-stats-title" style={{ fontFamily: "'Arial Black','Arial Bold',Arial,Impact,sans-serif", fontWeight: 900, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#ffffff', textTransform: 'uppercase', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                YOUR STOREHOUSE <br /><span style={{ color: '#10b981' }}>JUST GOT A BRAIN.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="precision-stats-desc" style={{ fontSize: 'clamp(1rem, 1.3vw, 1.2rem)', color: 'rgba(255,255,255,0.7)', maxWidth: 650, lineHeight: 1.8 }}>
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
                    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(16,185,129,0.12)' }}
                    transition={{ duration: 0.25 }}
                    style={{ background: 'rgba(10,18,10,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '16px', padding: '1.75rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', overflow: 'hidden' }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, #10b981, transparent)' }} />
                    <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(16,185,129,0.5)', letterSpacing: '0.15em' }}>{cap.num}</span>
                    <div className="precision-stat-card-title" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{cap.title}</div>
                    <div className="precision-stat-card-desc" style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, flex: 1 }}>{cap.desc}</div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. Journey ───────────────────────────────────────────────────── */}
        <section style={{ ...sectionBase, padding: '8rem 2rem' }}>
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
                    <div style={{ height: 90, width: 90, borderRadius: '20px', backgroundColor: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', color: '#10b981' }}>
                      {card.icon}
                    </div>
                    <h3 style={{ fontFamily: "'Arial Black',Arial,sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>{card.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontSize: '0.95rem' }}>{card.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>



        {/* ── HORIZONTAL SCROLL CONTAINER 2 for Tech and Target Partners ──────── */}
        <div ref={horizontalScrollRef2} className="horizontal-scroll-container">
          <div className="horizontal-sticky-wrapper">
            <motion.div
              className="horizontal-motion-div"
              style={{
                x: isMobile ? 0 : horizontalX2,
              }}
            >

              {/* ── NEW: Under the Hood (Tech) ───────────────────────────────────── */}
              <section className="horizontal-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                  <img src="/imported.png" alt="Background" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
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
                height: 100vh;
                display: flex;
                flex-shrink: 0;
                padding: 8rem 2rem;
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
                .scatter-card-0 { top: 0%; left: 2%; width: 28%; }
                .scatter-card-1 { top: -5%; left: 70%; width: 28%; }
                .scatter-card-2 { top: 32%; left: 5%; width: 28%; }
                .scatter-card-3 { top: 25%; left: 36%; width: 28%; z-index: 5; }
                .scatter-card-4 { top: 38%; left: 68%; width: 28%; }
                .scatter-card-5 { top: 68%; left: 15%; width: 28%; }
                .scatter-card-6 { top: 62%; left: 55%; width: 28%; }
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
                      { title: 'TCS34725 Color Sensor', desc: "Reads the VOC-indicator film's green-to-blue color shift as fruit ripeness progresses." },
                      { title: 'DHT11 Ambient Sensor', desc: 'Tracks temperature and humidity inside the monitoring chamber for environmental accuracy.' },
                      { title: 'Airtight Observation Box', desc: 'A controlled environment that ensures accurate, interference-free VOC readings every time.' },
                      { title: 'Embedded ML Engine', desc: 'Interprets color-change and VOC patterns to classify and predict ripeness stage automatically.' },
                      { title: 'IoT Data Layer', desc: 'Real-time data logging and remote monitoring via Wi-Fi and Bluetooth to your dashboard.' },
                      { title: 'On-Device Display', desc: 'Live readout directly on the device. No app required to get an immediate freshness reading.' },
                    ].map((comp, i) => (
                      <motion.div
                        key={i}
                        className={`scatter-card scatter-card-${i}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.1 * i }}
                        animate={{ y: [0, -10, 0] }}
                        // Add subtle continuous floating after entrance
                        style={{ backgroundColor: 'rgba(10,15,10,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                      >
                        <div style={{ color: '#10b981', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{comp.title}</div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.5 }}>{comp.desc}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── NEW: Target Partners ─────────────────────────────────────────── */}
              <section className="horizontal-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                  <img src="/imported.png" alt="Background" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
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
                            <strong style={{ color: '#fff' }}>North India (UP, Punjab, Haryana, West Bengal)</strong>
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
