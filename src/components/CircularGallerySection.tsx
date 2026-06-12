'use client';

import { useMemo } from 'react';
import Carousel3D from './Carousel3D';

const GALLERY_FRAMES = [
  { image: '/gallery1.png', text: 'Innovation' },
  { image: '/gallery2.png', text: 'Biotech' },
  { image: '/gallery3 .png', text: 'Quality' },
  { image: '/gallery1.png', text: 'Agrotech' },
  { image: '/gallery2.png', text: 'Processing' },
  { image: '/gallery3 .png', text: 'Sustainability' },
];

export default function CircularGallerySection() {
  const items = useMemo(() => GALLERY_FRAMES, []);

  return (
    <section className="relative z-20 w-full py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-10">
        <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs tracking-[0.25em] font-bold uppercase rounded-full border border-emerald-500/20">
          Gallery
        </span>
        <h2 className="mt-4 font-black uppercase text-white tracking-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
          Our Journey in Motion
        </h2>
        <p className="mt-3 text-gray-400 text-sm md:text-base max-w-xl font-light">
          Explore our interactive 3D carousel gallery showcasing our processes.
        </p>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <Carousel3D items={items} />
      </div>
    </section>
  );
}
