'use client';

import { useCopy } from './CopyEditorContext';

export default function Footer() {
  const { copy } = useCopy();
  
  return (
    <footer className="relative z-20 w-full py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <h2 className="text-white font-black text-2xl tracking-tighter uppercase">
            {copy.brandLogo}
          </h2>
          <p className="text-white/40 text-xs tracking-widest uppercase">
            © {new Date().getFullYear()} {copy.brandName}
          </p>
        </div>
        
        <div className="flex gap-8">
          <a href="#" className="text-white/60 hover:text-white transition-colors text-xs tracking-widest uppercase font-light">
            Privacy Policy
          </a>
          <a href="#" className="text-white/60 hover:text-white transition-colors text-xs tracking-widest uppercase font-light">
            Terms of Service
          </a>
          <a href="#" className="text-white/60 hover:text-white transition-colors text-xs tracking-widest uppercase font-light">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
