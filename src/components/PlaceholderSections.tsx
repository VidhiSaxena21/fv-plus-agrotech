'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useCopy } from './CopyEditorContext';

// ─── Constellation overlay on headline hover ──────────────────────────────────
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number; color: string; alpha: number;
}

function ConstellationOverlay({ containerRef }: { containerRef: React.RefObject<HTMLHeadingElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const el     = containerRef.current;
    if (!canvas || !el) return;

    const PAD_X = 60, PAD_Y = 50;
    const setSize = () => {
      const rect = el.getBoundingClientRect();
      canvas.width  = rect.width  + PAD_X * 2;
      canvas.height = rect.height + PAD_Y * 2;
    };
    setSize();

    const COLORS = ['#ffffff','#ffffff','#ffffff','#ffffff','#10b981','#10b981','#34d399','#cc3333','#888888'];
    let particles: Particle[] = [];
    const spawn = () => {
      const W = canvas.width, H = canvas.height;
      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.55, vy: (Math.random() - 0.5) * 0.55,
        r: Math.random() < 0.18 ? Math.random() * 4 + 3 : Math.random() * 2 + 0.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.45 + 0.55,
      }));
    };
    spawn();

    let hovered = false, fade = 0;
    const onEnter = () => { hovered = true; };
    const onLeave = () => { hovered = false; };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    const ctx = canvas.getContext('2d')!;
    const LINK_DIST = 120;

    const tick = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      fade += ((hovered ? 1 : 0) - fade) * 0.09;
      const f = fade;
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) { p.vx *= -1; p.x = Math.max(0, Math.min(W, p.x)); }
        if (p.y < 0 || p.y > H) { p.vy *= -1; p.y = Math.max(0, Math.min(H, p.y)); }
      }
      if (f > 0.004) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d  = Math.sqrt(dx * dx + dy * dy);
            if (d < LINK_DIST) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(255,255,255,${(1 - d / LINK_DIST) * 0.6 * f})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
        for (const p of particles) {
          if (p.r > 3) {
            const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.5);
            grd.addColorStop(0, p.color + 'cc');
            grd.addColorStop(0.4, p.color + '44');
            grd.addColorStop(1, p.color + '00');
            ctx.globalAlpha = f;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
          const hexA = Math.round(p.alpha * f * 255).toString(16).padStart(2, '0');
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color + hexA;
          ctx.fill();
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const ro = new ResizeObserver(() => { setSize(); spawn(); });
    ro.observe(el);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      ro.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', top: -50, left: -60, pointerEvents: 'none', zIndex: 2 }}
    />
  );
}

// ─── Hero — sticky for the full duration of sequence 1 ───────────────────────
function HeroSection({ heightVh }: { heightVh: number }) {
  const { copy }    = useCopy();
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="relative" style={{ height: `${heightVh}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center text-center px-5 md:px-10">
          {mounted && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="relative inline-block" style={{ pointerEvents: 'auto' }}>
                <h1
                  ref={headlineRef}
                  className="corn-hero-headline select-none text-center relative"
                  style={{ fontSize: 'clamp(2.2rem, 7.5vw, 8.5rem)', zIndex: 1, cursor: 'default' }}
                >
                  FV PLUS AGROTECH.
                </h1>
                <ConstellationOverlay containerRef={headlineRef} />
              </div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="mt-5 text-white/55 text-sm md:text-base font-light tracking-wide text-center max-w-xl"
              >
                {copy.hero.subtitle}
              </motion.p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Overlay on seq1 canvas — only the hero ───────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PlaceholderSections({
  seq1TotalFrames,
  durationVh = 1400,
}: {
  seq1TotalFrames: number;
  durationVh?: number;
}) {
  // seq1 canvas duration is shared with the hero overlay so they stay aligned.
  void seq1TotalFrames;
  return (
    <div className="absolute top-0 left-0 w-full pointer-events-none z-10">
      <HeroSection heightVh={durationVh} />
    </div>
  );
}
