'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import ContactModal from '../../components/ContactModal';
import PackagingModel from '../../components/PackagingModel';
import { CopyEditorProvider } from '../../components/CopyEditorContext';
import Footer from '../../components/Footer';

// Bright juice colours — one per step
const STEP_COLORS = [
  '#39ff14', // step 1 – neon lime (Whole Fruit)
  '#ff6b00', // step 2 – mango orange (Probiotic Power)
  '#ff1f6d', // step 3 – cherry pink (Immunity Booster)
  '#ffe600', // step 4 – pineapple yellow (No Added Sugar)
  '#c800ff', // step 5 – grape purple (Farm to Bottle)
  '#00e5ff', // step 6 – tropical cyan (Gut-Healthy)
];

const LEFT_STEPS = [
  { num: '01', title: 'Beverages', body: 'Seamlessly integrates across modern beverage applications, from functional smoothies and juices to wellness shots, hydration blends, and instant drink powders.', rotY: -0.28 },
  { num: '02', title: 'Confectionery', body: "Built for gummies, functional chews, fruit leathers, hard candies, lozenges, and chocolate inclusions, ANVAYA expands possibilities across confectionery. ", rotY: 0.3 },
  { num: '03', title: 'Frozen & Dairy', body: 'Blends seamlessly into ice creams, sorbets, yogurt blends, plant-based alternatives, and frozen novelty bars ', rotY: 0.9 },
];

const RIGHT_STEPS = [
  { num: '04', title: 'Nutraceuticals', body: 'Adapts effortlessly to nutraceutical formulations, including stick packs, effervescent tablets, capsules, pill formats, and sports nutrition blends', rotY: 1.4 },
  { num: '05', title: 'Bakery & Snacks', body: 'Fruit fillings, toppings, granola bars, functional cookies, and breakfast cereal coatings - ANVAYA enhances a wide range of bakery and snack products.', rotY: 1.9 },
  { num: '06', title: 'Foodservice', body: 'Supports diverse foodservice applications such as ready-to-blend smoothie kits, functional syrups, café premixes, and bulk ingredient supply.', rotY: 2.5 },
];

const ALL_STEPS = [...LEFT_STEPS, ...RIGHT_STEPS];

/* ─── Timeline dot ─────────────────────────────────────── */
function TimelineDot({
  step,
  isActive,
  isDone,
  color,
}: {
  step: { num: string; title: string; body: string };
  isActive: boolean;
  isDone: boolean;
  color: string;
}) {
  return (
    <motion.div
      animate={{
        scale: isActive ? 1.3 : 1,
        borderColor: isActive ? color : isDone ? `${color}99` : 'rgba(255,255,255,0.15)',
        backgroundColor: isActive ? `${color}33` : isDone ? `${color}55` : 'rgba(255,255,255,0.03)',
        boxShadow: isActive
          ? `0 0 0 7px ${color}1f, 0 0 28px ${color}60`
          : '0 0 0 0px transparent',
      }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: '2px solid',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {isDone ? (
        <motion.svg
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          width="16"
          height="16"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M2.5 7L5.5 10L11.5 4"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      ) : (
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '0.65rem',
            fontWeight: 700,
            color: isActive ? color : 'rgba(255,255,255,0.35)',
            transition: 'color 0.4s',
          }}
        >
          {step.num}
        </span>
      )}
    </motion.div>
  );
}

/* ─── Step card ────────────────────────────────────────── */
function StepCard({
  step,
  isActive,
  isDone,
  color,
}: {
  step: { num: string; title: string; body: string };
  isActive: boolean;
  isDone: boolean;
  color: string;
}) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '4rem' }}>
      <div style={{ flexShrink: 0, position: 'relative', zIndex: 2 }}>
        <TimelineDot step={step} isActive={isActive} isDone={isDone} color={color} />
      </div>
      <div style={{ paddingTop: 7 }}>
        <motion.h3
          animate={{
            color: isActive ? 'rgba(255,255,255,0.97)' : isDone ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)',
            x: isActive ? 5 : 0,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            fontFamily: "'Arial Black', Arial, sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(0.85rem, 1.2vw, 1.15rem)',
            margin: '0 0 0.45rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {step.title}
        </motion.h3>
        <motion.p
          animate={{
            color: isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.18)',
            x: isActive ? 5 : 0,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(0.75rem, 0.95vw, 0.88rem)',
            lineHeight: 1.75,
            margin: 0,
            maxWidth: 260,
          }}
        >
          {step.body}
        </motion.p>
      </div>
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────── */
function GuaviProbiContent() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [modelTargetX, setModelTargetX] = useState(1.8);
  const [modelRotY, setModelRotY] = useState(ALL_STEPS[0].rotY);
  const [modelOpacity, setModelOpacity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Current accent colour — drives model tint + timeline UI
  const accentColor = STEP_COLORS[activeStep] ?? STEP_COLORS[0];

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });

  const { scrollYProgress: tlProgress } = useScroll({ target: timelineRef, offset: ['start start', 'end end'] });
  const smoothTl = useSpring(tlProgress, { stiffness: 60, damping: 20 });
  const leftLineH = useTransform(smoothTl, [0, 0.5], ['0%', '100%']);
  const rightLineH = useTransform(smoothTl, [0.5, 1], ['0%', '100%']);

  useEffect(() => {
    return heroProgress.on('change', (v) => {
      const isMobileOrTablet = window.innerWidth < 1024;
      setModelTargetX(v > 0.9 ? 0 : isMobileOrTablet ? 0 : 2.5);
    });
  }, [heroProgress]);

  useEffect(() => {
    return tlProgress.on('change', (v) => {
      const idx = Math.min(ALL_STEPS.length - 1, Math.floor(v * ALL_STEPS.length));
      setActiveStep(idx);
      setModelRotY(ALL_STEPS[idx].rotY);
      setModelOpacity(v > 0.92 ? Math.max(0, 1 - (v - 0.92) / 0.08) : 1);
    });
  }, [tlProgress]);

  return (
    <div style={{ backgroundColor: '#040904' }}>

      {/* ══ FIXED MODEL ══ */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 2,
          pointerEvents: 'none',
          opacity: modelOpacity,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: modelOpacity }}
        transition={{ opacity: { duration: 0.6 } }}
      >
        <PackagingModel
          targetX={modelTargetX}
          targetRotY={modelRotY}
         scale={isMobile ? 4 : isTablet ? 6 : 10}
         targetYOffset={isMobile ? -1.5 : isTablet ? -1.4 : -0.5}
          accentColor={accentColor}
        />
      </motion.div>

      {/* ══ SECTION 1: HERO ══ */}
      <div
        id="hero"
        ref={heroRef}
        style={{
          width: '100vw',
          height: '100vh',
          position: 'relative',
          backgroundImage: "url('/image.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#040904',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(4,9,4,0.62)', zIndex: 1 }} />

        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: isMobile || isTablet ? '100%' : '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: isMobile || isTablet ? 'flex-start' : 'center',
            padding: isMobile ? '12vh 6vw 0' : isTablet ? '12vh 5vw 0' : '0 5vw',
            textAlign: isMobile || isTablet ? 'center' : 'left',
            alignItems: isMobile || isTablet ? 'center' : 'flex-start',
          }}
        >
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <h1
              style={{
                fontFamily: "'Arial Black', 'Arial Bold', Arial, Impact, sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(2rem, 6vw, 5rem)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                margin: '0 0 1.5rem 0',
                lineHeight: 1.1,
                color: 'rgba(16,185,129,0.95)',
              }}
            >
              ANVAYA™
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(0.8rem, 1vw, 0.95rem)', letterSpacing: '0.3em', textTransform: 'uppercase', margin: isMobile || isTablet ? '0 auto 2rem' : '0 0 2rem 0', fontWeight: 600 }}>
             Where fermentation science meets functional food innovation
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)', lineHeight: 1.8, margin: isMobile || isTablet ? '0 auto 1.5rem' : '0 0 1.5rem 0', maxWidth: isMobile || isTablet ? '520px' : '95%', fontWeight: 400 }}>
              ANVAYA™ is India&apos;s first postbiotic fruit drink — crafted from 100% whole fruit with live postbiotic cultures and zero added sugar. No artificial flavours. No preservatives.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.85rem, 1vw, 0.95rem)', lineHeight: 1.75, margin: isMobile || isTablet ? '0 auto' : '0', maxWidth: isMobile || isTablet ? '520px' : '95%', fontWeight: 400 }}>
             Powered by POSTBIOTICS, not probiotics.
            </p>
          </motion.div>
        </div>

        {!isMobile && !isTablet && <div style={{ width: '50%' }} />}

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: '5%', left: isMobile || isTablet ? '50%' : '25%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none', opacity: 0.4 }}>
          <span style={{ color: 'white', fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Scroll</span>
          <motion.div
            animate={{ scaleY: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1, height: 38, background: 'linear-gradient(to bottom, white, transparent)', transformOrigin: 'top' }}
          />
        </div>

        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 50 }}>
          <Navbar onConnectClick={() => setIsContactOpen(true)} />
        </div>
      </div>

      {/* ══ SECTION 2: TIMELINE ══ */}
      <div id="benefits" ref={timelineRef} style={{ height: `${ALL_STEPS.length * 100}vh`, position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

          <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/image.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#040904', zIndex: 0 }} />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(4,9,4,0.78)', zIndex: 1 }} />

          {/* Colour wash — subtle background glow that matches the active step colour */}
          <motion.div
            animate={{ background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${accentColor}12 0%, transparent 70%)` }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}
          />

          {/* ── SECTION HEADING — always centered on viewport ── */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: 0,
            right: 0,
            zIndex: 30,
            pointerEvents: 'none',
            textAlign: 'center',
          }}>
            <h2 style={{
              fontFamily: "'Arial Black', 'Arial Bold', Arial, Impact, sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(1.1rem, 2.5vw, 2.2rem)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.92)',
              margin: 0,
              lineHeight: 1.2,
              textShadow: '0 2px 24px rgba(0,0,0,0.5)',
            }}>
              One ingredient — Many formats
            </h2>
          </div>

          {isMobile || isTablet ? (
            <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', padding: '16vh 6vw 4vh' }}>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  style={{
                    background: 'rgba(4, 9, 4, 0.75)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: `1px solid ${accentColor}33`,
                    borderRadius: '24px',
                    padding: isMobile ? '2rem 1.5rem' : '3rem 2.5rem',
                    textAlign: 'center',
                    maxWidth: '440px',
                    boxShadow: `0 25px 60px rgba(0,0,0,0.6), 0 0 40px ${accentColor}20`,
                  }}
                >
                  <span style={{ color: accentColor, fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.25em', display: 'block', marginBottom: '0.5rem', transition: 'color 0.5s' }}>
                    STEP {ALL_STEPS[activeStep].num}
                  </span>
                  <h3 style={{ fontFamily: "'Arial Black', Arial, sans-serif", fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {ALL_STEPS[activeStep].title}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)', lineHeight: 1.7, margin: 0 }}>
                    {ALL_STEPS[activeStep].body}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Step pagination dots */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2.5rem', zIndex: 10 }}>
                {ALL_STEPS.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: activeStep === idx ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '999px',
                      backgroundColor: activeStep === idx ? accentColor : 'rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div style={{ position: 'relative', height: '100%', width: '100%' }}>
              {/* 3-column grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '27% 46% 27%', height: '100%', width: '100%' }}>
                {/* ── LEFT COLUMN — steps 1-3 ── */}
                <div style={{ position: 'relative', zIndex: 10, padding: '0 2vw 0 5vw', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    {/* Track line */}
                    <div style={{ position: 'absolute', left: 21, top: 22, width: 2, height: 'calc(100% - 44px)', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                      <motion.div
                        style={{
                          width: '100%',
                          height: leftLineH,
                          background: `linear-gradient(to bottom, ${accentColor}, ${accentColor}66)`,
                          borderRadius: 2,
                        }}
                      />
                    </div>
                    {LEFT_STEPS.map((step, i) => (
                      <StepCard
                        key={i}
                        step={step}
                        isActive={activeStep === i}
                        isDone={activeStep > i}
                        color={STEP_COLORS[i]}
                      />
                    ))}
                  </div>
                </div>

                {/* ── CENTER COLUMN — empty, model shows through ── */}
                <div style={{ position: 'relative', zIndex: 0 }} />

                {/* ── RIGHT COLUMN — steps 4-6 ── */}
                <div style={{ position: 'relative', zIndex: 10, padding: '0 5vw 0 2vw', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 21, top: 22, width: 2, height: 'calc(100% - 44px)', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                      <motion.div
                        style={{
                          width: '100%',
                          height: rightLineH,
                          background: `linear-gradient(to bottom, ${accentColor}, ${accentColor}66)`,
                          borderRadius: 2,
                        }}
                      />
                    </div>
                    {RIGHT_STEPS.map((step, i) => {
                      const globalIdx = i + LEFT_STEPS.length;
                      return (
                        <StepCard
                          key={i}
                          step={step}
                          isActive={activeStep === globalIdx}
                          isDone={activeStep > globalIdx}
                          color={STEP_COLORS[globalIdx]}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ══ SECTION 3: CONCLUSION ══ */}
      <div
        id="nutrition"
        style={{ width: '100vw', minHeight: '100vh', position: 'relative', backgroundImage: "url('/image.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#040904', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(4,9,4,0.75)', zIndex: 1 }} />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
          style={{ maxWidth: 800, textAlign: 'center', zIndex: 10, position: 'relative' }}
        >
          <h2 style={{ fontFamily: "'Arial Black', 'Arial Bold', Arial, Impact, sans-serif", fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 1.5rem', lineHeight: 1.2, color: 'rgba(16,185,129,0.95)' }}>
            FROM PERISHABLE FRUIT TO POWERFUL NUTRITION
          </h2>
          <p style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.15rem)', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', margin: '1.5rem 0', fontWeight: 400 }}>
            FV Plus Agrotech combines ancient fermentation wisdom, scientific research, and precision biotechnology to transform India&apos;s most wasted fruits into functional nutrition.
          </p>
          <p style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.15rem)', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', margin: '1.5rem 0 2rem', fontWeight: 400 }}>
            Through ANVAYA™ — our patented postbiotic ingredient platform — we help farmers recover value from surplus fruit, empower women-led communities, and give food manufacturers clean-label bioactive ingredients that improve gut health, immunity, and metabolic wellness.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(16,185,129,0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsContactOpen(true)}
            style={{ padding: '1rem 2.5rem', marginTop: '2rem', backgroundColor: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.8)', color: 'rgba(16,185,129,0.95)', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.3s ease' }}
          >
            Connect With Us
          </motion.button>
        </motion.div>
      </div>

      <Footer />

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}

export default function GuaviProbiPage() {
  return (
    <CopyEditorProvider>
      <GuaviProbiContent />
    </CopyEditorProvider>
  );
}
