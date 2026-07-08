'use client';

import React, { useRef, useEffect } from 'react';
import { useTransform, useMotionValueEvent, MotionValue } from 'framer-motion';
import { useImageSequence } from './useImageSequence';
import { CanvasRenderer } from './CanvasRenderer';

interface ScrollyCanvasProps {
  imageUrls: string[];
  progress: MotionValue<number>;
}

export const ScrollyCanvas: React.FC<ScrollyCanvasProps> = ({ imageUrls, progress }) => {
  const { images, isLoaded } = useImageSequence(imageUrls);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const renderFrameRef = useRef<number>(0);

  const frameIndex = useTransform(
    progress,
    [0, 1],
    [0, Math.max(0, images.length - 1)]
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    rendererRef.current = new CanvasRenderer(canvasRef.current);
    rendererRef.current.resize();

    const handleResize = () => {
      if (rendererRef.current) {
        rendererRef.current.resize();
        if (images.length > 0) {
          rendererRef.current.draw(images[renderFrameRef.current]);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [images]);

  useMotionValueEvent(frameIndex, 'change', (latest) => {
    if (!isLoaded || images.length === 0) return;
    const next = Math.round(latest);
    if (next !== renderFrameRef.current) {
      renderFrameRef.current = next;
      requestAnimationFrame(() => {
        if (rendererRef.current && images[next]) {
          rendererRef.current.draw(images[next]);
        }
      });
    }
  });

  // Draw initial frame once loaded
  useEffect(() => {
    if (isLoaded && images.length > 0 && rendererRef.current) {
      requestAnimationFrame(() => {
        rendererRef.current?.draw(images[renderFrameRef.current]);
      });
    }
  }, [isLoaded, images]);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#020502] overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Subtle overlay gradient & vignette for cinematic feel */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#020502]/60 via-transparent to-[#020502]/90" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(2,5,2,0.4) 100%)' }} />
    </div>
  );
};
