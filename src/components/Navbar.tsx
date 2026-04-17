'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useNavbarScroll } from '@/hooks/useNavbarScroll';

function StampifyLogo({ white = false }: { white?: boolean }) {
  const color = white ? '#ffffff' : '#1d9e75';
  const textColor = white ? '#ffffff' : '#1a1a1a';
  return (
    <div className="flex items-center gap-2.5">
      {/* 3×3 stamp grid */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Row 1 */}
        <circle cx="6"  cy="6"  r="4" fill={color} />
        <circle cx="16" cy="6"  r="4" fill={color} />
        <circle cx="26" cy="6"  r="4" fill={color} />
        {/* Row 2 */}
        <circle cx="6"  cy="16" r="4" fill={color} />
        <circle cx="16" cy="16" r="4" fill={color} />
        <circle cx="26" cy="16" r="4" fill={color} />
        {/* Row 3 */}
        <circle cx="6"  cy="26" r="4" fill={color} />
        <circle cx="16" cy="26" r="4" fill={color} />
        <circle cx="26" cy="26" r="4" fill={color} />
      </svg>
      <span
        className="text-xl font-bold tracking-tight"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: textColor,
          letterSpacing: '-0.02em',
        }}
      >
        Stampify
      </span>
    </div>
  );
}

const navLinks = [
  { label: 'Accueil', href: '#' },
  { label: 'Comment ça marche', href: '#solution' },
  { label: 'Tarif', href: '#pricing' },
  { label: 'Démos', href: '#demos' },
];

export default function Navbar() {
  const scrolled = useNavbarScroll();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.07)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <StampifyLogo />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#1d9e75] transition-colors duration-200 group"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-[#1d9e75] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium transition-colors duration-200"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: '#1d9e75',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#0d7a5a')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#1d9e75')}
          >
            Se connecter
          </Link>
          <Link
            href="#pricing"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            style={{
              fontFamily: "'Inter', sans-serif",
              background: '#1d9e75',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#0d7a5a')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#1d9e75')}
          >
            Démarrer
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
        >
          <span
            className="block h-0.5 w-5 bg-gray-700 rounded-full transition-all duration-300 origin-center"
            style={{
              transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            }}
          />
          <span
            className="block h-0.5 w-5 bg-gray-700 rounded-full transition-all duration-300"
            style={{
              opacity: menuOpen ? 0 : 1,
              transform: menuOpen ? 'scaleX(0)' : 'none',
            }}
          />
          <span
            className="block h-0.5 w-5 bg-gray-700 rounded-full transition-all duration-300 origin-center"
            style={{
              transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: menuOpen ? '400px' : '0px',
          opacity: menuOpen ? 1 : 0,
        }}
      >
        <div
          className="px-5 pb-5 pt-2 flex flex-col gap-1"
          style={{
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(0,0,0,0.07)',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="py-3 px-2 text-sm font-medium text-gray-700 hover:text-[#1d9e75] border-b border-gray-100 last:border-b-0 transition-colors duration-200"
              style={{ fontFamily: "'Inter', sans-serif" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-3">
            <Link
              href="/login"
              className="py-2.5 px-4 text-sm font-medium text-center rounded-xl border transition-colors duration-200"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: '#1d9e75',
                borderColor: '#1d9e75',
              }}
              onClick={() => setMenuOpen(false)}
            >
              Se connecter
            </Link>
            <Link
              href="#pricing"
              className="py-2.5 px-4 text-sm font-semibold text-center text-white rounded-xl transition-all duration-200"
              style={{
                fontFamily: "'Inter', sans-serif",
                background: '#1d9e75',
              }}
              onClick={() => setMenuOpen(false)}
            >
              Démarrer
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
