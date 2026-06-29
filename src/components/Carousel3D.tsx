'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type CarouselItem = {
  image: string;
  text?: string;
};

interface Carousel3DProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
}

export default function Carousel3D({
  items,
  autoPlay = true,
  interval = 5000,
}: Carousel3DProps) {
  const [angle, setAngle] = useState(0);
  const [radius, setRadius] = useState(400); // Dynamic radius based on screen size
  const [resetKey, setResetKey] = useState(0); // Trigger to restart timer on manual click

  // Screen size detection for responsive radius
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setRadius(180); // Mobile
      } else if (w < 1024) {
        setRadius(280); // Tablet
      } else {
        setRadius(400); // Desktop
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Angle step between each item
  const angleStep = 360 / items.length;

  // Calculate the active index based on current angle
  const activeIndex = useMemo(() => {
    const normalizedAngle = ((angle % 360) + 360) % 360;
    const index = Math.round(normalizedAngle / angleStep) % items.length;
    // Map angle direction correctly to item index
    return (items.length - index) % items.length;
  }, [angle, angleStep, items.length]);

  // Handle auto-rotate timer
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setAngle((prev) => prev - angleStep);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, angleStep, interval, resetKey]);

  const handleNext = () => {
    setAngle((prev) => prev - angleStep);
    setResetKey((prev) => prev + 1); // Reset the 5s timer
  };

  const handlePrev = () => {
    setAngle((prev) => prev + angleStep);
    setResetKey((prev) => prev + 1); // Reset the 5s timer
  };

  return (
    <div
      className="relative w-full flex flex-col items-center justify-center overflow-hidden py-10 select-none"
      style={{ height: '550px' }}
    >
      {/* 3D Carousel Container */}
      <div 
        className="relative w-full flex items-center justify-center"
        style={{ 
          perspective: '1200px', 
          height: '350px',
        }}
      >
        <div
          className="relative w-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${angle}deg)`,
            transition: 'transform 1s cubic-bezier(0.25, 0.8, 0.25, 1)',
            height: '100%',
          }}
        >
          {items.map((item, idx) => {
            // Angle offset for each image in the carousel circle
            const itemAngle = idx * angleStep;
            const isActive = idx === activeIndex;

            return (
              <div
                key={idx}
                className="absolute w-[280px] sm:w-[320px] md:w-[380px] h-[220px] sm:h-[260px] md:h-[300px] rounded-xl overflow-hidden transition-all duration-700"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'visible',
                  border: isActive ? '2px solid rgba(16, 185, 129, 0.7)' : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isActive 
                    ? '0 0 30px rgba(16, 185, 129, 0.4), 0 20px 40px rgba(0, 0, 0, 0.8)' 
                    : '0 10px 25px rgba(0, 0, 0, 0.6)',
                  opacity: isActive ? 1 : 0.45,
                }}
              >
                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.text || ''}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  draggable={false}
                />

                {/* Subtle Inner Shadow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Text overlay on the card */}
                {item.text && (
                  <div className="absolute bottom-0 left-0 w-full p-4 text-center">
                    <span className="text-white text-sm sm:text-base font-bold uppercase tracking-wider block drop-shadow-md">
                      {item.text}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Navigation Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-6 sm:px-12 md:px-24 pointer-events-none z-30">
        <button
          onClick={handlePrev}
          className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-black/45 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-white hover:text-emerald-400 transition-all duration-300 backdrop-blur-sm shadow-lg group"
          aria-label="Previous image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5 transition-transform group-hover:-translate-x-0.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Center active text display with micro-animation */}
        {items[activeIndex]?.text && (
          <div className="hidden sm:block pointer-events-auto bg-black/55 backdrop-blur-md px-6 py-2 rounded-full border border-emerald-500/15 shadow-xl">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="text-emerald-400 font-bold uppercase text-xs tracking-[0.2em] block"
              >
                {items[activeIndex]?.text}
              </motion.span>
            </AnimatePresence>
          </div>
        )}

        <button
          onClick={handleNext}
          className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-black/45 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-white hover:text-emerald-400 transition-all duration-300 backdrop-blur-sm shadow-lg group"
          aria-label="Next image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5 transition-transform group-hover:translate-x-0.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex justify-center items-center gap-2 mt-4 z-20">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              // Calculate direction to rotate to target index with minimal rotation
              const currentNorm = ((angle % 360) + 360) % 360;
              const currentIdx = (items.length - Math.round(currentNorm / angleStep) % items.length) % items.length;
              
              let diff = idx - currentIdx;
              if (diff > items.length / 2) diff -= items.length;
              if (diff < -items.length / 2) diff += items.length;
              
              setAngle((prev) => prev - diff * angleStep);
              setResetKey((prev) => prev + 1); // Reset timer on click
            }}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === activeIndex
                ? 'w-6 bg-emerald-500'
                : 'w-2.5 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
