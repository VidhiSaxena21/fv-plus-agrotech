'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useFrameSequence } from '../hooks/useFrameSequence';
import LoadingScreen from '../components/LoadingScreen';
import ScrollyCanvas from '../components/ScrollyCanvas';
import PlaceholderSections from '../components/PlaceholderSections';
import HorizontalStorySection from '../components/HorizontalStorySection';
import CircularGallerySection from '../components/CircularGallerySection';
import Seq23Section from '../components/Seq23Section';
import Footer from '../components/Footer';
import { CopyEditorProvider, useCopy } from '../components/CopyEditorContext';
import CopyEditorPanel from '../components/CopyEditorPanel';
import Navbar from '../components/Navbar';

interface ClientScrollyWrapperProps {
  sequence1Urls: string[];
  sequence2Urls: string[]; // seq2 + seq3 combined
}

function MainScrollyContent({
  seq1Images,
  sequence2Urls,
}: {
  seq1Images: HTMLImageElement[];
  sequence2Urls: string[];
}) {
  const { copy } = useCopy();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 4000);
    }, 1500);
  };

  return (
    <main className="relative bg-[#061206] min-h-screen">
      <Navbar />

      {/* ① Hero — vertical scroll */}
      <div className="relative z-0">
        <ScrollyCanvas images={seq1Images} />
        <PlaceholderSections seq1TotalFrames={seq1Images.length} />
      </div>

      {/* ② Horizontal track: Kernel → Product1 → Product2 → Product3 */}
      <HorizontalStorySection />

      {/* ③ Circular gallery */}
      <CircularGallerySection />

      {/* ④ Seq2 + Seq3 canvas with content card overlays */}
      <Seq23Section imageUrls={sequence2Urls} />

      {/* Floating customize panel */}
      <CopyEditorPanel />

      {/* Contact form */}
      <section className="relative z-20 w-full bg-gradient-to-b from-transparent to-[#0a1a0a] pt-32 pb-24 px-4 md:px-8 border-t border-emerald-950/20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">

          <div className="md:col-span-5 space-y-6">
            <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs tracking-[0.2em] font-semibold uppercase rounded-full border border-emerald-500/20">
              GET IN TOUCH
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
              {copy.contact.title}
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">
              {copy.contact.subtitle}
            </p>
            <div className="h-[1px] w-full bg-emerald-950" />
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-1">Headquarters</h4>
                  <p className="text-gray-300 text-xs md:text-sm font-light leading-relaxed whitespace-pre-line">{copy.contact.address}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-1">Email Inquiries</h4>
                  <p className="text-gray-300 text-xs md:text-sm font-light">contact@fvplusagrotech.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 bg-[#0c1e0c]/40 border border-emerald-800/20 backdrop-blur-xl p-8 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
            <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Send a message</h3>
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter name" className="w-full bg-black/40 border border-emerald-800/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition duration-200 text-white placeholder-gray-600" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">Email Address *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="name@example.com" className="w-full bg-black/40 border border-emerald-800/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition duration-200 text-white placeholder-gray-600" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">Subject</label>
                <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="How can we help?" className="w-full bg-black/40 border border-emerald-800/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition duration-200 text-white placeholder-gray-600" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">Message Content *</label>
                <textarea rows={4} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Type your message details here..." className="w-full bg-black/40 border border-emerald-800/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition duration-200 text-white placeholder-gray-600 resize-none" />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                  className={`w-full py-3.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 ${formStatus === 'success' ? 'bg-emerald-500 text-black' : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.99] border border-emerald-400/20'} flex items-center justify-center gap-2`}
                >
                  {formStatus === 'idle' && 'Submit Message'}
                  {formStatus === 'submitting' && (<><svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Sending Message...</>)}
                  {formStatus === 'success' && 'Message Sent Successfully!'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

const SEQ1_TRIM_START = 25;
const SEQ1_TRIM_END = 25;

export default function ClientScrollyWrapper({ sequence1Urls, sequence2Urls }: ClientScrollyWrapperProps) {
  const trimmedSeq1Urls = useMemo(
    () =>
      sequence1Urls.length > SEQ1_TRIM_START + SEQ1_TRIM_END
        ? sequence1Urls.slice(SEQ1_TRIM_START, sequence1Urls.length - SEQ1_TRIM_END)
        : sequence1Urls,
    [sequence1Urls],
  );

  const { images: seq1Images, progress, isLoaded } = useFrameSequence(trimmedSeq1Urls);

  useEffect(() => {
    document.body.style.overflow = isLoaded ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isLoaded]);

  return (
    <CopyEditorProvider>
      <AnimatePresence>
        {!isLoaded && <LoadingScreen progress={progress} />}
      </AnimatePresence>
      {isLoaded && (
        <MainScrollyContent
          seq1Images={seq1Images}
          sequence2Urls={sequence2Urls}
        />
      )}
    </CopyEditorProvider>
  );
}
