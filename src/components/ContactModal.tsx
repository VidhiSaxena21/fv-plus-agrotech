'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCopy } from './CopyEditorContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { copy } = useCopy();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // ↓↓↓ CHANGE THIS TO YOUR EMAIL ADDRESS ↓↓↓
  const RECIPIENT_EMAIL = 'vidzzz.zzz2110@gmail.com';

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const subject = encodeURIComponent(
      formData.subject || `Website enquiry from ${formData.name}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );

    // Opens the user's default mail client with all fields pre-filled
    window.location.href = `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;

    setFormStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => {
      setFormStatus('idle');
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark blur backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
            className="relative w-full max-w-xl glass-card rounded-2xl p-6 md:p-8 border-emerald-500/20 shadow-[0_45px_100px_rgba(0,0,0,0.85)] z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-6">
              <div className="text-center">
                <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs tracking-[0.2em] font-semibold uppercase rounded-full border border-emerald-500/20 mb-3">
                  GET IN TOUCH
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                  {copy?.contact?.title || 'Connect With Us'}
                </h2>
                <p className="text-gray-400 text-xs md:text-sm font-light leading-relaxed mt-2 max-w-md mx-auto">
                  {copy?.contact?.subtitle || 'Send us a message and we will respond shortly.'}
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter name"
                      className="w-full bg-black/40 border border-emerald-800/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition duration-200 text-white placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full bg-black/40 border border-emerald-800/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition duration-200 text-white placeholder-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help?"
                    className="w-full bg-black/40 border border-emerald-800/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition duration-200 text-white placeholder-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Message Content *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Type your message details here..."
                    className="w-full bg-black/40 border border-emerald-800/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition duration-200 text-white placeholder-gray-600 resize-none"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting' || formStatus === 'success'}
                    className={`w-full py-3.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                      formStatus === 'success'
                        ? 'bg-emerald-500 text-black'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.99] border border-emerald-400/20'
                    } flex items-center justify-center gap-2`}
                  >
                    {formStatus === 'idle' && 'Submit Message'}
                    {formStatus === 'submitting' && (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    )}
                    {formStatus === 'success' && 'Message Sent Successfully!'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
