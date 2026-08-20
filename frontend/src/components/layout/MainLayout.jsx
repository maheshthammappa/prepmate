import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthProvider';
import { useTheme } from '../../contexts/ThemeContext';
import { LayoutDashboard, Users, FileText, History, Settings, LogOut, User, Sun, Moon, MessageSquare, Dumbbell, CheckCircle } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Standard Interview', path: '/app/interviews', icon: Users },
  { name: 'Resume Interview', path: '/app/interviews/resume', icon: FileText },
  { name: 'Practice Questions', path: '/app/interviews/practice', icon: Dumbbell },
  { name: 'Success Questions', path: '/app/interviews/mastered', icon: CheckCircle },
  { name: 'History', path: '/app/history', icon: History },
  { name: 'AI Chatbot', path: '/app/chat', icon: MessageSquare },
  { name: 'Settings', path: '/app/settings', icon: Settings },
];

export default function MainLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/app/interviews') {
      return location.pathname.startsWith('/app/interviews') && 
             !location.pathname.startsWith('/app/interviews/resume') &&
             !location.pathname.startsWith('/app/interviews/practice') &&
             !location.pathname.startsWith('/app/interviews/mastered');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      backgroundColor: 'var(--bg-page)', fontFamily: "'Inter', sans-serif",
    }}>

      {/* ━━━━━━━━━━━━ SIDEBAR ━━━━━━━━━━━━ */}
      <aside style={{
        width: '260px', minWidth: '260px',
        background: 'var(--bg-sidebar)',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
        boxShadow: '4px 0 24px rgba(79,70,229,0.2)',
      }}>
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '80px', left: '-50px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        {/* Logo — same height as top header (60px) */}
        <div style={{ height: '60px', flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 22px', position: 'relative' }}>
          <div style={{
            fontSize: '1.9rem', fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.05em',
            fontFamily: "'Dancing Script', cursive",
          }}>
            Prepmate
          </div>
        </div>

        {/* Separator */}
        <div style={{ margin: '0 20px', height: '1px', background: 'rgba(255,255,255,0.12)' }} />

        {/* Nav */}
        <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map(({ name, path, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={name}
                to={path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '11px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#ffffff' : 'rgba(255,255,255,0.65)',
                  backgroundColor: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                  boxShadow: active ? 'inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.15)' : 'none',
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = '#fff'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; } }}
              >
                {active && (
                  <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '24px', borderRadius: '0 3px 3px 0', background: '#fff' }} />
                )}
                <Icon style={{ width: '17px', height: '17px', flexShrink: 0 }} />
                {name}
              </Link>
            );
          })}
        </nav>

        {/* Separator */}
        <div style={{ margin: '0 20px', height: '1px', background: 'rgba(255,255,255,0.12)' }} />

        {/* Sign Out */}
        <div style={{ padding: '8px 12px 12px' }}>
          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              width: '100%', padding: '9px 14px',
              borderRadius: '10px', border: 'none', background: 'none', cursor: 'pointer',
              color: 'rgba(255,200,200,0.75)', fontSize: '0.875rem', fontWeight: 500,
              fontFamily: "'Inter', sans-serif", transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,100,100,0.15)'; e.currentTarget.style.color = '#fca5a5'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,200,200,0.75)'; }}
          >
            <LogOut style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ━━━━━━━━━━━━ MAIN AREA ━━━━━━━━━━━━ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <header style={{
          height: '60px', flexShrink: 0,
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative', zIndex: 10,
        }}>
          {/* Breadcrumb label */}
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Interview Practice Platform
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Profile */}
            <Link
              to="/app/profile"
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '6px 12px 6px 8px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontSize: '0.8rem', fontWeight: 500,
                textDecoration: 'none', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-muted)'; e.currentTarget.style.color = 'var(--text-heading)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <User style={{ width: '12px', height: '12px', color: '#fff' }} />
              </div>
              <span style={{ textTransform: 'uppercase' }}>{user?.username}</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
