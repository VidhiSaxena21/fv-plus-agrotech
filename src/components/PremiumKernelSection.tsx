'use client';

import { useEffect, useMemo, useRef, useState, type MutableRefObject, type RefObject } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type Slide = {
  title: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    title: 'PROBLEM',
    body: `45% of all harvested fruit never reaches a consumer.
The global post-harvest supply chain operates on intuition — visual inspection, arbitrary timelines, and manual grading.
No one is measuring the actual biochemical signal driving spoilage.
THIS IS WHERE WE GET THE CLUTCH`,
  },
  {
    title: 'VISION',
    body: `Every fruit lost is a number we missed.
A world where not a single fruit is lost to ignorance.
We envision a future where every point in the fresh produce supply chain — from the orchard floor to the cold storage bay to the last-mile truck — is instrumented with precision ethylene sensing. Where harvest decisions are driven by molecular data, not calendar dates. Where "best before" is calculated, not guessed.`,
  },
  {
    title: 'IMPACT',
    body: `We don't just measure ripeness. We redefine what it means to know your produce.
Reducing fruit wastage through intelligent ethylene monitoring and quality assessment, empowering farmers, suppliers, and retailers to extend shelf life, improve decision-making, increase profitability, and build a more sustainable food ecosystem.`,
  },
];

const STEP_ROTATIONS = [Math.PI * 0.9, Math.PI * 1.2, Math.PI * 1.55];

const ORBIT = {
  radiusXDesktop: 248,
  radiusYDesktop: 138,
  radiusXMobile: 118,
  radiusYMobile: 66,
  boxWidthDesktop: 520,
  boxHeightDesktop: 288,
  rightPercent: '9%',
  topPercent: '56%',
  anglePerStep: Math.PI * 0.62,
  dragPixelsPerStep: 220,
  modelYOffsetPx: 0,
};

function getOrbitArcPaths(width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const rx = width / 2;
  const ry = height / 2;
  return {
    back: `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`,
    front: `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`,
  };
}

function KernelModelCanvas({ phase }: { phase: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
    camera.position.set(0, 0, 10);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      console.warn('WebGL not available for kernel model');
      return;
    }
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 2.0));

    const dir1 = new THREE.DirectionalLight(0xffffff, 3);
    dir1.position.set(5, 8, 5);
    scene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0xffffff, 1.5);
    dir2.position.set(-5, 3, -3);
    scene.add(dir2);

    const pinkLight = new THREE.PointLight(0xff69b4, 4, 15);
    pinkLight.position.set(0, 0, 3);
    scene.add(pinkLight);

    const rimLight = new THREE.PointLight(0x10b981, 2.5, 20);
    rimLight.position.set(-3, 0, 5);
    scene.add(rimLight);

    const mouse = { tx: 0, ty: 0, x: 0, y: 0 };
    let model: THREE.Group | null = null;
    let targetY = STEP_ROTATIONS[0];
    let raf = 0;

    const getLayout = () => ({
      mobile: W < 960,
      scale: W < 960 ? 0.04 : 0.06,
    });

    const getOrbitWorldPosition = () => {
      const mobile = W < 960;
      const boxW = mobile ? ORBIT.radiusXMobile * 2 : ORBIT.boxWidthDesktop;
      const right = parseFloat(ORBIT.rightPercent) / 100;
      const top = mobile ? 0.73 : parseFloat(ORBIT.topPercent) / 100;
      const cx = mobile ? (W / 2) : (W * (1 - right) - boxW / 2);
      const cy = H * top + ORBIT.modelYOffsetPx;

      const ndcX = (cx / W) * 2 - 1;
      const ndcY = -(cy / H) * 2 + 1;
      const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
      vec.unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      return camera.position.clone().add(dir.multiplyScalar(dist));
    };

    let layout = getLayout();

    const loader = new GLTFLoader();
    loader.load(
      '/3dmodel1/scene.gltf',
      (gltf) => {
        const raw = gltf.scene;
        const box = new THREE.Box3().setFromObject(raw);
        const center = box.getCenter(new THREE.Vector3());
        raw.position.sub(center);

        raw.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((mat) => {
            if (!(mat instanceof THREE.MeshStandardMaterial)) return;
            const name = (mat.name + child.name).toLowerCase();
            const isInner =
              name.includes('flesh') ||
              name.includes('inner') ||
              name.includes('pulp') ||
              name.includes('inside') ||
              name.includes('meat');
            if (isInner) {
              mat.emissive = new THREE.Color(0xff4da6);
              mat.emissiveIntensity = 0.55;
            } else {
              mat.emissive = new THREE.Color(0xff2d78);
              mat.emissiveIntensity = 0.12;
            }
            mat.needsUpdate = true;
          });
        });

        layout = getLayout();
        const orbit = getOrbitWorldPosition();
        const pivot = new THREE.Group();
        pivot.add(raw);
        pivot.scale.setScalar(layout.scale);
        pivot.position.copy(orbit);
        pivot.rotation.y = targetY;
        scene.add(pivot);
        model = pivot;
      },
      undefined,
      (err) => console.error('Failed to load /3dmodel1/scene.gltf:', err),
    );

    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / W - 0.5) * 2;
      mouse.ty = (e.clientY / H - 0.5) * 2;
    };

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      layout = getLayout();
      if (model) {
        model.scale.setScalar(layout.scale);
        model.position.copy(getOrbitWorldPosition());
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      mouse.x = lerp(mouse.x, mouse.tx, 0.06);
      mouse.y = lerp(mouse.y, mouse.ty, 0.06);

      if (model) {
        const clamped = Math.max(0, Math.min(2, phaseRef.current));
        const low = Math.floor(clamped);
        const high = Math.min(2, low + 1);
        const t = clamped - low;
        targetY = lerp(STEP_ROTATIONS[low], STEP_ROTATIONS[high], t);

        const orbit = getOrbitWorldPosition();
        model.position.x = orbit.x + mouse.x * 0.22;
        model.position.y = orbit.y + -mouse.y * 0.1 + Math.sin(Date.now() * 0.0013) * 0.06;
        model.position.z = orbit.z;
        model.rotation.x = lerp(model.rotation.x, mouse.y * 0.13, 0.08);
        model.rotation.y = lerp(model.rotation.y, targetY + mouse.x * 0.16, 0.08);
        model.rotation.z = lerp(model.rotation.z, -mouse.x * 0.06, 0.08);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-[15] pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" style={{ background: 'transparent' }} />
    </div>
  );
}

export type PremiumKernelPanelProps = {
  embedded?: boolean;
  sectionRef?: RefObject<HTMLElement | null>;
  scrollDriveRef?: RefObject<number | null>;
  isDraggingRef?: MutableRefObject<boolean>;
  onManualControl?: () => void;
};

/** Full kernel viewport — 3D model, orbit, 1/2/3 buttons, drag area. */
export function PremiumKernelPanel({
  embedded = false,
  sectionRef,
  scrollDriveRef,
  isDraggingRef: externalDraggingRef,
  onManualControl,
}: PremiumKernelPanelProps) {
  const dragAreaRef = useRef<HTMLDivElement>(null);
  const internalDraggingRef = useRef(false);
  const isDraggingRef = externalDraggingRef ?? internalDraggingRef;
  const dragStartXRef = useRef(0);
  const dragStartPhaseRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);
  const [phase, setPhase] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 960);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (!scrollDriveRef) return;
    let raf = 0;
    let lastStep = -1;

    const tick = () => {
      if (!isDraggingRef.current && scrollDriveRef.current !== null) {
        const driven = scrollDriveRef.current;
        setPhase((prev) => (Math.abs(prev - driven) > 0.001 ? driven : prev));
        const step = Math.min(2, Math.round(driven));
        if (step !== lastStep) {
          lastStep = step;
          setActiveStep(step);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(raf);
  }, [scrollDriveRef, isDraggingRef]);

  const slide = useMemo(() => SLIDES[activeStep], [activeStep]);
  const orbitAngle = phase * ORBIT.anglePerStep;
  const orbitRX = isMobile ? ORBIT.radiusXMobile : ORBIT.radiusXDesktop;
  const orbitRY = isMobile ? ORBIT.radiusYMobile : ORBIT.radiusYDesktop;
  const dot1X = Math.cos(orbitAngle) * orbitRX;
  const dot1Y = Math.sin(orbitAngle) * orbitRY;
  const dot2X = Math.cos(orbitAngle + Math.PI) * orbitRX;
  const dot2Y = Math.sin(orbitAngle + Math.PI) * orbitRY;

  const orbitBoxW = ORBIT.boxWidthDesktop;
  const orbitBoxH = ORBIT.boxHeightDesktop;
  const orbitArcs = getOrbitArcPaths(orbitBoxW, orbitBoxH);
  const orbitWrapStyle = {
    right: ORBIT.rightPercent,
    top: ORBIT.topPercent,
  } as const;

  const jumpToStep = (step: number) => {
    onManualControl?.();
    setPhase(step);
    setActiveStep(step);
    if (embedded || !sectionRef?.current) return;
    const node = sectionRef.current;
    const top = node.offsetTop;
    const height = node.offsetHeight - window.innerHeight;
    const target = top + height * (step / (SLIDES.length - 1));
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMobile) return;
    onManualControl?.();
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartPhaseRef.current = phase;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || isMobile) return;
    const dx = e.clientX - dragStartXRef.current;
    const nextPhase = Math.max(0, Math.min(2, dragStartPhaseRef.current + dx / ORBIT.dragPixelsPerStep));
    setPhase(nextPhase);
    setActiveStep(Math.round(nextPhase));
  };

  const onPointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const snapped = Math.round(phase);
    if (embedded) {
      setPhase(snapped);
      setActiveStep(snapped);
    } else {
      jumpToStep(snapped);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">

      {!isMobile && (
        <div className="absolute -translate-y-1/2 pointer-events-none z-[10]" style={orbitWrapStyle}>
          <svg width={orbitBoxW} height={orbitBoxH} className="overflow-visible" aria-hidden>
            <path d={orbitArcs.back} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={1} strokeDasharray="5 5" />
          </svg>
        </div>
      )}

      <KernelModelCanvas phase={phase} />

      {isMobile ? (
        <div className="absolute inset-0 z-[20] flex flex-col justify-start items-center px-6 pt-24 pointer-events-none">
          <div className="flex flex-col justify-center items-center pointer-events-auto w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full glass-card rounded-2xl p-6 border-emerald-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl text-center relative overflow-hidden"
              >
                <span className="text-emerald-500/80 text-xs font-bold tracking-[0.25em] uppercase block mb-2">
                  {activeStep === 0 ? '01' : activeStep === 1 ? '02' : '03'} / 03
                </span>
                <h3 className="text-white font-black uppercase tracking-tight leading-tight text-xl mb-3">
                  {slide.title}
                </h3>
                <p className="text-gray-300 text-xs md:text-sm font-light leading-relaxed">
                  {slide.body}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Pagination dots */}
            <div className="flex gap-2 mt-6">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => jumpToStep(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeStep === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-white/20'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-[20] grid grid-cols-1 lg:grid-cols-2 px-6 md:px-14 lg:px-20 py-16 pointer-events-none">
          <div className="self-center max-w-2xl pointer-events-auto">
            <motion.p
              key={`t-${activeStep}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-white font-black uppercase tracking-tight leading-[0.95]"
              style={{ fontSize: 'clamp(2.2rem, 6vw, 5.4rem)' }}
            >
              {slide.title}
            </motion.p>
            <motion.p
              key={`b-${activeStep}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.07 }}
              className="mt-5 text-gray-200/85 max-w-xl text-sm md:text-xl leading-relaxed"
            >
              {slide.body}
            </motion.p>
          </div>
        </div>
      )}

      {!isMobile && (
        <>
          <div className="absolute -translate-y-1/2 pointer-events-none z-[25]" style={orbitWrapStyle}>
            <div className="relative" style={{ width: orbitBoxW, height: orbitBoxH }}>
              <svg width={orbitBoxW} height={orbitBoxH} className="absolute inset-0 overflow-visible" aria-hidden>
                <path d={orbitArcs.front} fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth={1} strokeDasharray="5 5" />
              </svg>
              <div className="absolute left-1/2 top-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/45 bg-white/10 z-[1]" />
              <div className="absolute left-1/2 top-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 z-[1]" />
              <div className="orbit-dot z-[2]" style={{ transform: `translate(${dot1X}px, ${dot1Y}px)` }} />
              <div className="orbit-dot z-[2]" style={{ transform: `translate(${dot2X}px, ${dot2Y}px)` }} />
            </div>
          </div>

          <div
            ref={dragAreaRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="absolute right-[7%] top-[24%] w-[47%] h-[56%] z-30 cursor-grab active:cursor-grabbing"
          />

          <div className="absolute right-[18%] bottom-16 flex gap-5 z-30">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => jumpToStep(i)}
                className={`h-14 w-14 rounded-full border text-lg font-semibold transition-all ${
                  activeStep === i
                    ? 'border-white text-white bg-white/10 shadow-[0_0_35px_rgba(255,255,255,0.15)]'
                    : 'border-white/25 text-white/70 hover:border-white/65'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        .orbit-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 8px;
          height: 8px;
          margin-left: -4px;
          margin-top: -4px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
        }
      `}</style>
    </div>
  );
}

export default function PremiumKernelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDraggingRef = useRef(false);
  const scrollDriveRef = useRef<number | null>(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (isDraggingRef.current) return;
    const idx = latest < 0.34 ? 0 : latest < 0.67 ? 1 : 2;
    scrollDriveRef.current = idx;
  });

  return (
    <section ref={sectionRef} className="relative" style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen">
        <PremiumKernelPanel
          sectionRef={sectionRef}
          scrollDriveRef={scrollDriveRef}
          isDraggingRef={isDraggingRef}
        />
      </div>
    </section>
  );
}
