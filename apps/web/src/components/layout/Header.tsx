import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../common/Button';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const NAV_ITEMS = [
  { label: 'Search', href: '/search', hasChevron: false },
  { label: 'Agents', href: '/agents', hasChevron: false },
  { label: 'Join', href: '/join', hasChevron: true },
  { label: 'Paperwork', href: '/paperwork', hasChevron: true },
  { label: 'Resources', href: '/resources', hasChevron: true },
  { label: 'About', href: '/about', hasChevron: true },
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
          <a href="/" aria-label="FIND Real Estate" style={{ display: 'flex', alignItems: 'center' }}>
            <svg
              style={{ width: '9.1rem', height: '2.6rem' }}
              fill="none"
              viewBox="0 0 975 280"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="currentColor" d="M836.06 1.01c77.3 0 139.94 62.69 139.94 140C976 218.33 913.35 281 836.06 281H702.61V1.01zm-52.82 80.17v119.44h44.58a59.5 59.5 0 0 0 42.21-17.5 59.7 59.7 0 0 0-42.2-101.94z" />
              <path fill="currentColor" d="M595.45 183.2V1h80.14v279.99H556.68l-73.33-152.93V281H403.2V1h110.33z" />
              <path fill="currentColor" d="M376.19 280.99h-141l61.26-140.29L235.2 1h141v279.99Z" />
              <path fill="currentColor" d="M244.55 81.28H81.14v59.42h101.02v80.17H81.14v60.12H1V1h207.91z" />
            </svg>
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
            Sign In
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
