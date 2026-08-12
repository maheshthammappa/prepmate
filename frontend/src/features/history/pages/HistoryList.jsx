import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../dashboard/dashboard.api';
import { CalendarDays, ChevronRight, Zap } from 'lucide-react';
import { format } from 'date-fns';

export default function HistoryList() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi.getInterviewHistory()
      .then(setHistory)
      .catch(() => setError('Failed to load interview history.'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '44px', height: '44px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const scoreColor = (s) => s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : '#ef4444';
  const scoreBg = (s) => s >= 80 ? 'rgba(16,185,129,0.1)' : s >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';

  return (
    <div style={{ padding: '36px 32px 64px', animation: 'fadeInUp 0.3s ease' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Review your past performance and track your progress.</p>
      </div>

      {error && (
        <div style={{ padding: '14px 18px', backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '20px', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {history.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {history.map((item, i) => (
            <div key={item.id} className="pm-card"
              style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s', animation: `fadeInUp 0.3s ease ${i * 0.04}s both` }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '13px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}>
                  <Zap style={{ width: '20px', height: '20px', color: '#fff' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-heading)' }}>{item.topic}</h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {item.experienceLevel} • Completed {format(new Date(item.createdAt), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Score</p>
                  <p style={{ margin: '2px 0 0', fontSize: '1.3rem', fontWeight: 900, color: scoreColor(item.overallScore), lineHeight: 1 }}>{item.overallScore}%</p>
                </div>
                <Link to={`/app/interviews/result/${item.id}`} className="pm-btn-secondary" style={{ textDecoration: 'none' }}>
                  View Report <ChevronRight style={{ width: '14px', height: '14px' }} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pm-card" style={{ padding: '80px 40px', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px dashed var(--border)' }}>
            <CalendarDays style={{ width: '32px', height: '32px', color: 'var(--primary)', opacity: 0.5 }} />
          </div>
          <h3 style={{ margin: '0 0 10px', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-heading)' }}>No interviews yet</h3>
          <p style={{ margin: '0 0 28px', color: 'var(--text-muted)', maxWidth: '360px', marginLeft: 'auto', marginRight: 'auto', fontSize: '0.9rem' }}>
            You haven't completed any interviews. Start practicing to see your reports here.
          </p>
          <Link to="/app/interviews/new" className="pm-btn-primary" style={{ textDecoration: 'none' }}>
            Start Your First Interview
          </Link>
        </div>
      )}
    </div>
  );
}
