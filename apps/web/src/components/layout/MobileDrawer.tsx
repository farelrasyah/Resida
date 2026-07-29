import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { label: 'Beranda', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Data Warga', href: '/residents' },
  { label: 'Pembayaran', href: '/payments' },
  { label: 'Laporan', href: '/reports/summary' },
  { label: 'Pengeluaran', href: '/expenses' },
] as const;

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: '#151717',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2.4rem 2.5rem',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        visibility: isOpen ? 'visible' : 'hidden',
        willChange: 'transform',
      }}
    >
      {/* Top: Logo + Close */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" aria-label="RESIDA" style={{ display: 'flex', alignItems: 'center' }}>
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
        <button
          onClick={onClose}
          style={{
            padding: '1.2rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: 'none',
            cursor: 'pointer',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
          }}
          aria-label="Close Menu"
        >
          <X size={24} />
        </button>
      </div>

      {/* Nav Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2.4rem' }}>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={onClose}
            style={{
              fontSize: '3.2rem',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.9)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Bottom: Copyright + Sign In */}
      <div style={{ paddingTop: '2.4rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem', alignItems: 'center' }}>
          <div style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.5)' }}>
            &copy; {new Date().getFullYear()} RESIDA. Hak Cipta Dilindungi.
          </div>
          <Button variant="emerald" href="/login" showArrow>
            Masuk
          </Button>
        </div>
      </div>
    </div>
  );
};
