'use client';

import { useState } from 'react';
import UnicornHero from '../components/UnicornHero';
import PremiumKernelSection from '../components/PremiumKernelSection';
import HorizontalProductSection from '../components/HorizontalProductSection';
import CircularGallerySection from '../components/CircularGallerySection';
import Seq23Section from '../components/Seq23Section';
import Footer from '../components/Footer';
import { CopyEditorProvider } from '../components/CopyEditorContext';
import Navbar from '../components/Navbar';
import ContactModal from '../components/ContactModal';

interface ClientScrollyWrapperProps {
  sequence2Urls: string[];
}

function MainScrollyContent({
  sequence2Urls,
}: {
  sequence2Urls: string[];
}) {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <main className="relative bg-transparent min-h-screen">
      {/* Light dark overlay & blur to ensure text readability against the public/image.png background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black/40 backdrop-blur-[2px]" />

      <div className="relative z-10">
        <Navbar onConnectClick={() => setIsContactOpen(true)} />

        {/* ① Hero — Framer Iframe */}
        <UnicornHero />

        {/* ② Premium Kernel — full 3D scrollytelling */}
        <PremiumKernelSection />

        {/* ③ Horizontal track: Product1 → Product2 */}
        <HorizontalProductSection />

        {/* ④ Circular gallery */}
        <CircularGallerySection />

        {/* ⑤ Seq2 + Seq3 canvas with content card overlays */}
        <Seq23Section imageUrls={sequence2Urls} />

        <Footer />
      </div>

      {/* Connect Popup Modal */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </main>
  );
}

export default function ClientScrollyWrapper({ sequence2Urls }: ClientScrollyWrapperProps) {
  return (
    <CopyEditorProvider>
      <MainScrollyContent sequence2Urls={sequence2Urls} />
    </CopyEditorProvider>
  );
}
