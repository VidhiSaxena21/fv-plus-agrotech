'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: 'Home',        href: '/' },
  { label: 'Guavi Probi', href: '/guavi-probi' },
  { label: 'Iris',        href: '/iris' },
];

export default function Navbar({ onConnectClick }: { onConnectClick?: () => void }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-2.5'
          : 'py-4'
      }`}
    >
      {/* Glassmorphism background */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: isScrolled
            ? 'rgba(4, 9, 4, 0.75)'
            : 'rgba(4, 9, 4, 0.45)',
          backdropFilter: `blur(${isScrolled ? 20 : 12}px)`,
          WebkitBackdropFilter: `blur(${isScrolled ? 20 : 12}px)`,
          borderBottom: `1px solid rgba(16, 185, 129, ${isScrolled ? 0.15 : 0.08})`,
          boxShadow: isScrolled
            ? '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)'
            : 'none',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-baseline select-none group">
          <span className="text-yellow-400 font-extrabold text-xl md:text-2xl tracking-wide transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
            FV Plus
          </span>
          <span className="text-white/80 font-light italic text-xs md:text-sm ml-1.5 tracking-wider">
            Agrotech
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-[13px] font-semibold tracking-wider uppercase transition-all duration-300 rounded-lg ${
                  isActive
                    ? 'text-white'
                    : 'text-white/60 hover:text-white/90'
                }`}
              >
                {/* Active background glow */}
                {isActive && (
                  <motion.div
                    layoutId="navActiveGlow"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      boxShadow: '0 0 20px rgba(16, 185, 129, 0.08)',
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                {/* Active underline */}
                {isActive && (
                  <motion.div
                    layoutId="navActiveBar"
                    className="absolute -bottom-0.5 left-3 right-3 h-[2px] rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)',
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}

          {/* Connect CTA */}
          <button
            onClick={onConnectClick}
            className="ml-4 px-5 py-2 text-[13px] font-bold tracking-wider uppercase rounded-full transition-all duration-300 border bg-emerald-600/80 text-white border-emerald-500/30 hover:bg-emerald-500 hover:text-black hover:shadow-[0_0_24px_rgba(16,185,129,0.25)] hover:border-emerald-400"
          >
            Connect
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden relative p-2 text-white/80 hover:text-white focus:outline-none z-10"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden"
            style={{
              background: 'rgba(4, 9, 4, 0.92)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(16, 185, 129, 0.15)',
            }}
          >
            <div className="px-6 py-6 space-y-1 flex flex-col">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      className={`block py-3 text-sm font-semibold tracking-widest uppercase transition-all duration-200 border-l-2 pl-4 rounded-r-lg ${
                        isActive
                          ? 'border-yellow-400 text-yellow-400 bg-yellow-400/5'
                          : 'border-transparent text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.06, duration: 0.3 }}
                className="pt-3"
              >
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onConnectClick?.();
                  }}
                  className="w-full block text-center py-3 text-sm font-bold tracking-widest uppercase rounded-xl bg-emerald-600/80 text-white border border-emerald-500/30 hover:bg-emerald-500 hover:text-black transition-all duration-300"
                >
                  Connect
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
