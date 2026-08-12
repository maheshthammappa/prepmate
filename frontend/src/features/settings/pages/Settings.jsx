import { Bell, Lock, Palette, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

const settings = [
  {
    icon: Palette, gradient: 'linear-gradient(135deg, #6366f1, #818cf8)', glow: 'rgba(99,102,241,0.3)',
    title: 'Appearance', desc: 'Customize the look and feel of PrepMate.',
    note: 'Use the "Dark / Light" button in the top header to switch between themes.',
    tag: 'Available', tagColor: '#10b981', tagBg: 'rgba(16,185,129,0.1)', tagBorder: 'rgba(16,185,129,0.2)',
  },
  {
    icon: Bell, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', glow: 'rgba(245,158,11,0.3)',
    title: 'Notifications', desc: 'Choose what notifications you want to receive.',
    note: 'Email notifications configuration is currently disabled.',
    tag: 'Coming Soon', tagColor: 'var(--primary)', tagBg: 'rgba(99,102,241,0.08)', tagBorder: 'rgba(99,102,241,0.18)',
  },
  {
    icon: Lock, gradient: 'linear-gradient(135deg, #10b981, #34d399)', glow: 'rgba(16,185,129,0.3)',
    title: 'Security', desc: 'Manage your password and security settings.',
    note: 'Password reset functionality will be available in the next release.',
    tag: 'Coming Soon', tagColor: 'var(--primary)', tagBg: 'rgba(99,102,241,0.08)', tagBorder: 'rgba(99,102,241,0.18)',
  },
];

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div style={{ padding: '36px 32px 64px', animation: 'fadeInUp 0.3s ease' }}>

      <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Manage your application preferences.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {settings.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="pm-card"
              style={{ padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '20px', transition: 'all 0.2s', animation: `fadeInUp 0.3s ease ${i * 0.07}s both` }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ width: '52px', height: '52px', borderRadius: '15px', background: s.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 5px 16px ${s.glow}` }}>
                <Icon style={{ width: '23px', height: '23px', color: '#fff' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)' }}>{s.title}</h3>
                  <span style={{ padding: '3px 9px', borderRadius: '50px', fontSize: '0.68rem', fontWeight: 700, backgroundColor: s.tagBg, color: s.tagColor, border: `1px solid ${s.tagBorder}` }}>
                    {s.tag}
                  </span>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{s.desc}</p>
                <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-muted)', borderRadius: '9px', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {s.title === 'Appearance' ? (
                    <>
                      <span>Choose between Light and Dark mode for the platform interface.</span>
                      <button
                        onClick={toggleTheme}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)',
                          background: 'var(--bg-card)', color: 'var(--text-heading)',
                          fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                          boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-heading)'; }}
                      >
                        {theme === 'dark' ? <><Sun style={{ width: '16px', height: '16px' }} /> Light Mode</> : <><Moon style={{ width: '16px', height: '16px' }} /> Dark Mode</>}
                      </button>
                    </>
                  ) : (
                    <span style={{ fontStyle: 'italic' }}>{s.note}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
