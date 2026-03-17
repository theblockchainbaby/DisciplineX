import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/workouts', label: 'Workouts', icon: '💪' },
  { path: '/habits', label: 'Habits', icon: '✅' },
  { path: '/goals', label: 'Goals', icon: '🎯' },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f1f5f9', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <nav style={{
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🏋️</span>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DisciplineX
            </span>
          </Link>

          <div style={{ display: 'flex', gap: '0.25rem' }} className="desktop-nav">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: location.pathname === link.path ? '#6366f1' : '#94a3b8',
                  backgroundColor: location.pathname === link.path ? 'rgba(99,102,241,0.15)' : 'transparent',
                  transition: 'all 0.2s',
                }}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer', display: 'none' }}
            className="mobile-menu-btn"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {menuOpen && (
          <div style={{ padding: '0.5rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', borderTop: '1px solid #334155' }} className="mobile-menu">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                style={{
                  textDecoration: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: location.pathname === link.path ? '#6366f1' : '#94a3b8',
                  backgroundColor: location.pathname === link.path ? 'rgba(99,102,241,0.15)' : 'transparent',
                }}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
        {children}
      </main>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>
    </div>
  );
};

export default Layout;
