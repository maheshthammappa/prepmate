import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { dashboardApi } from '../dashboard.api';
import { TrendingUp, Award, CalendarDays, ChevronRight, Play, FileText, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getInterviewHistory()
      .then(setHistory)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '14px' }}>
        <div style={{ width: '44px', height: '44px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const total = history.length;
  const avg = total > 0 ? Math.round(history.reduce((a, c) => a + c.overallScore, 0) / total) : 0;
  const best = total > 0 ? Math.max(...history.map(h => h.overallScore)) : 0;

  const stats = [
    { label: 'Total Interviews', value: total, icon: CalendarDays, gradient: 'linear-gradient(135deg, #6366f1, #818cf8)', glow: 'rgba(99,102,241,0.35)' },
    { label: 'Average Score', value: `${avg}%`, icon: TrendingUp, gradient: 'linear-gradient(135deg, #10b981, #34d399)', glow: 'rgba(16,185,129,0.35)' },
    { label: 'Best Score', value: `${best}%`, icon: Award, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', glow: 'rgba(245,158,11,0.35)' },
  ];

  const scoreColor = (s) => s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : '#ef4444';
  const scoreBg = (s) => s >= 80 ? 'rgba(16,185,129,0.1)' : s >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';

  return (
    <div style={{ padding: '36px 32px 64px', animation: 'fadeInUp 0.3s ease' }}>

      {/* Page heading */}
      <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Here's your interview preparation progress, <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{user?.username}</span>.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="pm-card" style={{ padding: '24px 22px', display: 'flex', alignItems: 'center', gap: '18px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '90px', height: '90px', borderRadius: '50%', background: s.gradient, opacity: 0.07 }} />
              <div style={{ width: '52px', height: '52px', borderRadius: '15px', background: s.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 6px 16px ${s.glow}` }}>
                <Icon style={{ width: '23px', height: '23px', color: '#fff' }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</p>
                <p style={{ margin: '4px 0 0', fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-heading)', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' }}>

        {/* Recent Interviews */}
        <div className="pm-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-muted)' }}>
            <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-heading)' }}>Recent Interviews</h2>
            <Link to="/app/history" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
              View all <ChevronRight style={{ width: '13px', height: '13px' }} />
            </Link>
          </div>

          {history.length > 0 ? (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {history.slice(0, 5).map((item, i) => (
                <li key={item.id}
                  style={{ padding: '14px 22px', borderBottom: i < Math.min(history.length, 5) - 1 ? '1px solid var(--border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background-color 0.15s', cursor: 'default' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 3px 10px rgba(99,102,241,0.25)' }}>
                      <Zap style={{ width: '16px', height: '16px', color: '#fff' }} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.875rem' }}>{item.topic}</p>
                      <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.experienceLevel} • {format(new Date(item.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="pm-badge" style={{ backgroundColor: scoreBg(item.overallScore), color: scoreColor(item.overallScore) }}>{item.overallScore}%</span>
                    <Link to={`/app/interviews/result/${item.id}`} style={{ color: 'var(--text-muted)', display: 'flex', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <ChevronRight style={{ width: '18px', height: '18px' }} />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ padding: '60px 32px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', border: '1px dashed var(--border)' }}>
                <CalendarDays style={{ width: '28px', height: '28px', color: 'var(--primary)', opacity: 0.5 }} />
              </div>
              <h3 style={{ margin: '0 0 8px', fontWeight: 800, color: 'var(--text-heading)', fontSize: '1.05rem' }}>No interviews yet</h3>
              <p style={{ margin: '0 0 22px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Start your first interview to see your progress here.</p>
              <button onClick={() => navigate('/app/interviews/new')} className="pm-btn-primary" style={{ fontSize: '0.85rem', padding: '9px 20px' }}>
                <Play style={{ width: '14px', height: '14px' }} /> Start Interview
              </button>
            </div>
          )}
        </div>

        {/* Quick Start */}
        <div className="pm-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', background: 'var(--bg-muted)' }}>
            <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-heading)' }}>Start an Interview</h2>
          </div>
          <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Standard Interview', sub: 'Practice with a custom topic', icon: Play, path: '/app/interviews/new', gradient: 'linear-gradient(135deg, #6366f1, #818cf8)', glow: 'rgba(99,102,241,0.3)' },
              { label: 'Resume Interview', sub: 'Based on your experience', icon: FileText, path: '/app/interviews/resume', gradient: 'linear-gradient(135deg, #a855f7, #c084fc)', glow: 'rgba(168,85,247,0.3)' },
            ].map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.label}
                  onClick={() => navigate(btn.path)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    width: '100%', padding: '14px 16px',
                    border: '1.5px solid var(--border)', borderRadius: '12px',
                    background: 'transparent', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: btn.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 12px ${btn.glow}` }}>
                    <Icon style={{ width: '18px', height: '18px', color: '#fff' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, color: 'var(--text-heading)', fontSize: '0.875rem' }}>{btn.label}</p>
                    <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>{btn.sub}</p>
                  </div>
                </button>
              );
            })}

            {/* Tip */}
            <div style={{ marginTop: '4px', padding: '14px 16px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(99,102,241,0.07), rgba(168,85,247,0.07))', border: '1px solid rgba(99,102,241,0.12)' }}>
              <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '5px' }}>💡 Daily Tip</p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-body)', lineHeight: 1.6 }}>Practice answering questions out loud — it builds confidence and improves your clarity.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
