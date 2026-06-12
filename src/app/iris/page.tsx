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
    <div style={{ minHeight: '100vh', overflowX: 'hidden', backgroundColor: 'transparent' }}>
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
              Absolute certainty, beneath the skin. The precision instrument for tropical agriculture.
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
              The subjective era of fruit grading is over.
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
              For generations, determining the perfect moment of harvest meant relying on intuition. A squeeze. A tap. A guess. Millions lost to overripeness, inconsistency, and transport decay. We engineered a solution that turns guesswork into absolute data.
            </ScrollReveal>
          </div>
        </section>

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
                  Forged from aerospace-grade aluminum and embedded with an array of biometric sensors. It non-destructively penetrates the dermal layer to read brix levels, firmness, and internal moisture with laboratory precision.
                </p>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    { icon: <ActivityIcon />, title: 'Spectroscopic Analysis', desc: 'Instant cellular breakdown.' },
                    { icon: <ScanIcon />, title: 'Non-destructive Micro-Entry', desc: 'Preserves fruit integrity.' },
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
        <section style={{ ...sectionBase, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <img src="/iris/guava-cross-section.png" alt="Guava Cross Section" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(4,9,4,0.97) 0%, rgba(4,9,4,0.82) 50%, rgba(4,9,4,0.4) 100%)' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
            <FadeIn>
              <span style={{ color: '#fbbf24', textTransform: 'uppercase', fontWeight: 800, fontSize: '0.85rem', marginBottom: '1rem', display: 'block', letterSpacing: '0.25em' }}>The Science of Sweetness</span>
              <h2 style={{ fontFamily: "'Arial Black','Arial Bold',Arial,Impact,sans-serif", fontWeight: 900, fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: '#ffffff', textTransform: 'uppercase', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                99.9%<br /><span style={{ color: '#10b981' }}>Accuracy.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p style={{ fontSize: 'clamp(1rem, 1.3vw, 1.2rem)', color: 'rgba(255,255,255,0.7)', maxWidth: 550, lineHeight: 1.8 }}>
                By analyzing the spectral signature of the mesocarp, Iris Probe calculates the exact ratio of fructose to structural fiber. It knows what a perfect guava tastes like before you ever bite into it.
              </p>
            </FadeIn>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem', marginTop: '4rem', maxWidth: 800 }}>
              {[
                { val: '0.2s', label: 'Read Time', delay: 0.4 },
                { val: '±0.1%', label: 'Brix Variance', delay: 0.5 },
                { val: 'IP68', label: 'Weatherproof', delay: 0.6 },
                { val: '10k', label: 'Scans / Charge', delay: 0.7 },
              ].map((stat) => (
                <FadeIn key={stat.label} delay={stat.delay}>
                  <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '1.25rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{stat.val}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>{stat.label}</div>
                  </div>
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
                { icon: <ThermometerIcon />, title: 'Cultivation', body: 'Map orchard ripeness continuously. Direct harvesting teams to specific zones where fruit has hit peak metrics.', delay: 0.1 },
                { icon: <DropletsIcon />, title: 'Processing', body: 'Automate quality control on the packing line. Reject sub-par fruit instantly based on internal, invisible metrics.', delay: 0.3 },
                { icon: <ActivityIcon size={40} />, title: 'Distribution', body: 'Guarantee shelf-life to buyers. Export granular batch data that proves the exact physiological state of your yield.', delay: 0.5 },
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



        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer style={{ padding: '3rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(16,185,129,0.1)', position: 'relative', zIndex: 20 }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', margin: 0, letterSpacing: '0.05em' }}>
            &copy; {new Date().getFullYear()} Iris Probe Technologies. Precision instruments for agriculture.
          </p>
        </footer>
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
