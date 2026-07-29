import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../common/Button';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const NAV_ITEMS = [
  { label: 'Beranda', href: '/', hasChevron: false },
  { label: 'Dashboard', href: '/dashboard', hasChevron: false },
  { label: 'Warga', href: '/residents', hasChevron: false },
  { label: 'Pembayaran', href: '/payments', hasChevron: false },
  { label: 'Laporan', href: '/reports/summary', hasChevron: true },
] as const;

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= 0) {
        setIsHidden(false);
      } else if (y > lastScrollY.current) {
        setIsHidden(true);
      } else if (y < lastScrollY.current) {
        setIsHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'transparent',
        transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'transform',
      }}
    >
      <div
        className="header-container"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          height: '8.4rem',
        }}
      >
        {/* Logo - Left */}
        <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'start' }}>
          <a href="/" aria-label="RESIDA" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <span className="text-[2.6rem] font-black tracking-tighter" style={{ color: 'inherit' }}>
              RESIDA.
            </span>
          </a>
        </div>

        {/* Navigation - Center */}
        <nav
          className="header-nav"
          style={{
            justifySelf: 'center',
            fontWeight: 500,
            fontSize: '1.8rem',
            lineHeight: 1.25,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                color: 'inherit',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'opacity 0.2s ease',
              }}
              className="hover:opacity-60"
            >
              {item.label}
              {item.hasChevron && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              )}
            </a>
          ))}
        </nav>

        {/* Actions - Right */}
        <div
          className="header-actions"
          style={{
            justifySelf: 'end',
          }}
        >
          <Button variant="primary" href="/login">
            Masuk
          </Button>
        </div>

        {/* Mobile Burger */}
        <button
          className="mobile-only"
          onClick={onMenuToggle}
          style={{
            gridColumn: '-1',
            justifySelf: 'end',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.8rem',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Open Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
};
