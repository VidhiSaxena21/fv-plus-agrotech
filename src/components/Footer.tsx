'use client';

export default function Footer() {
  return (
    <footer className="relative z-20 w-full border-t border-white/10 px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Brand row */}
        <div className="mb-6 text-center">
          <h2 className="text-white font-black text-2xl uppercase tracking-widest">
            FV PLUS
          </h2>
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase mt-1">
            AGROTECH INNOVATIONS
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-6" />

        {/* Contact row — email left, phone right */}
        <div className="flex justify-between items-center">
          <a
            href="mailto:directoryfvplus@gmail.com"
            className="text-white/50 text-sm hover:text-[#10b981] transition-colors"
          >
            directoryfvplus@gmail.com
          </a>

          <a
            href="tel:+919878249089"
            className="text-white/50 text-sm hover:text-[#10b981] transition-colors"
          >
            +91 98782 49089
          </a>
        </div>

        {/* Copyright row — centered below */}
        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} FV Plus Agrotech Innovations. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}