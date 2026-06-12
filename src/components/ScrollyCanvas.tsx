'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useScroll, useTransform, useMotionValueEvent, motion } from 'framer-motion';

interface ScrollyCanvasProps {
  images: HTMLImageElement[];
  sequenceLengths?: number[];
  durationVh?: number;
}

const CENTER_ZONE = 0.28;
const MAX_PARALLAX_X = 14;
const MAX_PARALLAX_Y = 10;
const MAX_CURSOR_ZOOM = 0.022;
const SCROLL_ZOOM_MAX = 0.06;
const LERP = 0.08;
const BASE_SHIFT_X = 56;
const BASE_SHIFT_Y = -8;
const BASE_ZOOM = 1.1;
const EXIT_START = 0.84;
const EXIT_SHIFT_X = 0;
const EXIT_ROLL_Z = 0;
const EXIT_EXTRA_ZOOM = 0.06;

function isInCenterZone(clientX: number, clientY: number) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const minX = w * CENTER_ZONE;
  const maxX = w * (1 - CENTER_ZONE);
  const minY = h * CENTER_ZONE;
  const maxY = h * (1 - CENTER_ZONE);
  return clientX >= minX && clientX <= maxX && clientY >= minY && clientY <= maxY;
}

export default function ScrollyCanvas({ images, durationVh = 1400 }: ScrollyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderFrameRef = useRef(0);
  const parallaxRef = useRef({ x: 0, y: 0, scale: 1 });
  const targetParallaxRef = useRef({ x: 0, y: 0, scale: 1 });
  const scrollZoomRef = useRef(1);
  const parallaxRafRef = useRef<number>();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const frameIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, Math.max(0, images.length - 1)],
  );

  const scrollZoom = useTransform(scrollYProgress, [0, 0.45, 1], [1, 1 + SCROLL_ZOOM_MAX * 0.55, 1 + SCROLL_ZOOM_MAX]);
  const exitOpacity = useTransform(scrollYProgress, [0.9, 0.98], [1, 0]);
  const heroVisibility = useTransform(scrollYProgress, (p) => (p >= 0.98 ? 'hidden' : 'visible'));

  const drawImageCover = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      canvas: HTMLCanvasElement,
      offsetX: number,
      offsetY: number,
      scale: number,
      rollZ: number,
    ) => {
      const cr = canvas.width / canvas.height;
      const ir = img.width / img.height;
      let dw = canvas.width;
      let dh = canvas.height;
      let ox = 0;
      let oy = 0;

      if (cr > ir) {
        dh = canvas.width / ir;
        oy = (canvas.height - dh) / 2;
      } else {
        dw = canvas.height * ir;
        ox = (canvas.width - dw) / 2;
      }

      dw *= scale;
      dh *= scale;
      ox = (canvas.width - dw) / 2 + offsetX;
      oy = (canvas.height - dh) / 2 + offsetY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rollZ);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      ctx.drawImage(img, ox, oy, dw, dh);
      ctx.restore();
    },
    [],
  );

  const renderFrame = useCallback(
    (index: number) => {
      if (!canvasRef.current || images.length === 0) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = images[Math.round(Math.max(0, Math.min(images.length - 1, index)))];
      if (!img?.complete || img.naturalWidth === 0) return;

      const progress = scrollYProgress.get();
      const t = Math.max(0, Math.min(1, (progress - EXIT_START) / (1 - EXIT_START)));
      const exitEase = t * t * (3 - 2 * t);
      const { x, y, scale } = parallaxRef.current;
      const totalScale =
        scale *
        scrollZoomRef.current *
        BASE_ZOOM *
        (1 + exitEase * EXIT_EXTRA_ZOOM);
      const offsetX = x + BASE_SHIFT_X + exitEase * EXIT_SHIFT_X;
      const offsetY = y + BASE_SHIFT_Y;
      const rollZ = exitEase * EXIT_ROLL_Z;
      drawImageCover(ctx, img, canvas, offsetX, offsetY, totalScale, rollZ);
    },
    [images, drawImageCover, scrollYProgress],
  );

  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const next = Math.round(latest);
    if (next !== renderFrameRef.current) {
      renderFrameRef.current = next;
      requestAnimationFrame(() => renderFrame(next));
    }
  });

  // Paint first frame when images arrive (motion value does not fire on mount)
  useEffect(() => {
    if (images.length === 0) return;
    renderFrameRef.current = Math.round(frameIndex.get());
    requestAnimationFrame(() => renderFrame(renderFrameRef.current));
  }, [images, frameIndex, renderFrame]);

  useMotionValueEvent(scrollZoom, 'change', (latest) => {
    scrollZoomRef.current = latest;
    requestAnimationFrame(() => renderFrame(renderFrameRef.current));
  });

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!isInCenterZone(e.clientX, e.clientY)) {
        targetParallaxRef.current = { x: 0, y: 0, scale: 1 };
        return;
      }

      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2;
      const cy = h / 2;
      const nx = (e.clientX - cx) / (w * (0.5 - CENTER_ZONE));
      const ny = (e.clientY - cy) / (h * (0.5 - CENTER_ZONE));
      const dist = Math.min(1, Math.hypot(nx, ny));

      targetParallaxRef.current = {
        x: nx * MAX_PARALLAX_X,
        y: ny * MAX_PARALLAX_Y,
        scale: 1 + (1 - dist) * MAX_CURSOR_ZOOM,
      };
    };

    const onPointerLeave = () => {
      targetParallaxRef.current = { x: 0, y: 0, scale: 1 };
    };

    const tickParallax = () => {
      const cur = parallaxRef.current;
      const tgt = targetParallaxRef.current;

      const x = cur.x + (tgt.x - cur.x) * LERP;
      const y = cur.y + (tgt.y - cur.y) * LERP;
      const scale = cur.scale + (tgt.scale - cur.scale) * LERP;

      const moved =
        Math.abs(x - cur.x) > 0.02 ||
        Math.abs(y - cur.y) > 0.02 ||
        Math.abs(scale - cur.scale) > 0.0001;

      parallaxRef.current = { x, y, scale };

      if (moved) {
        renderFrame(renderFrameRef.current);
      }

      parallaxRafRef.current = requestAnimationFrame(tickParallax);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerleave', onPointerLeave);
    parallaxRafRef.current = requestAnimationFrame(tickParallax);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      if (parallaxRafRef.current) cancelAnimationFrame(parallaxRafRef.current);
    };
  }, [renderFrame]);

  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      requestAnimationFrame(() => renderFrame(renderFrameRef.current));
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [images, renderFrame]);

  return (
    <div ref={containerRef} className="relative z-0 w-full" style={{ height: `${durationVh}vh` }}>
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden z-0 pointer-events-none"
        style={{ opacity: exitOpacity, visibility: heroVisibility }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />
      </motion.div>
    </div>
  );
}
