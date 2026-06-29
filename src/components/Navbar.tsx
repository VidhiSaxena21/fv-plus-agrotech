'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SectionLink {
  label: string;
  hash: string;
}

interface NavLink {
  label: string;
  href: string;
  sections: SectionLink[];
}

const navLinks: NavLink[] = [
  {
    label: 'HOME',
    href: '/',
    sections: [
      { label: 'Hero', hash: '#hero' },
      { label: 'Premium Kernel', hash: '#premium-kernel' },
      { label: 'Products Showcase', hash: '#products' },
      { label: 'Circular Gallery', hash: '#gallery' },
      { label: 'Sequence Preview', hash: '#sequence' },
    ],
  },
  {
    label: 'ANVAYA',
    href: '/guavi-probi',
    sections: [
      { label: 'Hero Showcase', hash: '#hero' },
      { label: 'Benefits & Timeline', hash: '#benefits' },
      { label: 'Nutrition & Processing', hash: '#nutrition' },
    ],
  },
  {
    label: 'IRIS',
    href: '/iris',
    sections: [
      { label: 'Hero', hash: '#hero' },
      { label: 'The Problem', hash: '#problem' },
      { label: 'Wastage Numbers', hash: '#wastage' },
      { label: 'Market Opportunity', hash: '#market-size' },
      { label: 'Inside Iris', hash: '#inside-iris' },
      { label: 'Storehouse Stats', hash: '#stats' },
      { label: 'Industry Applications', hash: '#applications' },
      { label: 'Under the Hood (Tech)', hash: '#tech' },
      { label: 'Partners & Rollout', hash: '#partners' },
    ],
  },
];

export default function Navbar({ onConnectClick }: { onConnectClick?: () => void }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null);

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

  // Listen for hash in URL and scroll to it
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          if (hash === '#market-size') {
            const container = document.getElementById('wastage-container-parent');
            if (container) {
              const rect = container.getBoundingClientRect();
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              window.scrollTo({
                top: scrollTop + rect.top + (rect.height / 2),
                behavior: 'smooth'
              });
              return;
            }
          }
          if (hash === '#partners') {
            const container = document.getElementById('tech-container-parent');
            if (container) {
              const rect = container.getBoundingClientRect();
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              window.scrollTo({
                top: scrollTop + rect.top + (rect.height / 2),
                behavior: 'smooth'
              });
              return;
            }
          }
          const element = document.getElementById(hash.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 500);
      }
    };

    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, [pathname]);

  const handleSectionClick = (e: React.MouseEvent, href: string, hash: string) => {
    if (pathname === href) {
      e.preventDefault();
      if (hash === '#market-size') {
        const container = document.getElementById('wastage-container-parent');
        if (container) {
          const rect = container.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          window.scrollTo({
            top: scrollTop + rect.top + (rect.height / 2),
            behavior: 'smooth'
          });
        }
      } else if (hash === '#partners') {
        const container = document.getElementById('tech-container-parent');
        if (container) {
          const rect = container.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          window.scrollTo({
            top: scrollTop + rect.top + (rect.height / 2),
            behavior: 'smooth'
          });
        }
      } else {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

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
        <Link href="/" className="flex items-center select-none group">
          <img
            src="/logo.png"
            alt="FV Plus Agrotech Logo"
            className="h-10 md:h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setHoveredLinkId(link.label)}
                onMouseLeave={() => setHoveredLinkId(null)}
              >
                <Link
                  href={link.href}
                  className={`relative px-4 py-2 text-[13px] font-semibold tracking-wider uppercase transition-all duration-300 rounded-lg block ${
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

                {/* Desktop dropdown */}
                <AnimatePresence>
                  {hoveredLinkId === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 rounded-xl border z-50 overflow-hidden shadow-2xl"
                      style={{
                        background: 'rgba(4, 9, 4, 0.92)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderColor: 'rgba(16, 185, 129, 0.15)',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.03)',
                      }}
                    >
                      <div className="py-2 flex flex-col">
                        {link.sections.map((sec) => (
                          <Link
                            key={sec.hash}
                            href={`${link.href}${sec.hash}`}
                            onClick={(e) => handleSectionClick(e, link.href, sec.hash)}
                            className="px-4 py-2.5 text-[11px] font-bold text-left tracking-wider uppercase transition-colors text-white/70 hover:text-[#10b981] hover:bg-emerald-500/5 flex items-center gap-2 group"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 group-hover:bg-[#10b981] transition-all duration-300 scale-75 group-hover:scale-100 shrink-0" />
                            <span>{sec.label}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
                    className="flex flex-col"
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

                    {/* Mobile sub-sections */}
                    <div className="pl-6 mt-1 mb-2 flex flex-col gap-1 border-l border-emerald-500/10 ml-4">
                      {link.sections.map((sec) => (
                        <Link
                          key={sec.hash}
                          href={`${link.href}${sec.hash}`}
                          onClick={(e) => {
                            setIsMobileMenuOpen(false);
                            handleSectionClick(e, link.href, sec.hash);
                          }}
                          className="text-left text-[11px] font-bold tracking-wider uppercase text-white/50 hover:text-[#10b981] transition-colors py-2 flex items-center gap-2"
                        >
                          <span className="w-1 h-1 rounded-full bg-emerald-500/30 shrink-0" />
                          <span>{sec.label}</span>
                        </Link>
                      ))}
                    </div>
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
