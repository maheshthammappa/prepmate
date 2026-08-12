import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../hooks/InterviewContext';
import { Settings2, Dumbbell } from 'lucide-react';

export default function PracticeSetup() {
  const navigate = useNavigate();
  const { startPracticeInterview, isGenerating } = useInterview();
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleStartPractice = async () => {
    setError('');
    setSuccessMsg('');
    try {
      const hasQuestions = await startPracticeInterview();
      if (hasQuestions) {
        navigate('/app/interviews/session/active');
      } else {
        setSuccessMsg('You are all caught up! You have no weak concepts due for practice today. Come back tomorrow or start a standard interview.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start practice session. Please try again.');
    }
  };

  if (isGenerating) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '24px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '64px', height: '64px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings2 style={{ width: '20px', height: '20px', color: 'var(--primary)' }} />
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-heading)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Preparing Practice Session</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Our AI is generating variations of your weakest concepts...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '36px 32px 64px', animation: 'fadeInUp 0.3s ease' }}>

      <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>Targeted Practice</h2>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Review and master the concepts you previously struggled with.</p>
      </div>

      <div className="pm-card" style={{ padding: '40px 32px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        
        <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: '50%', marginBottom: '24px' }}>
          <Dumbbell style={{ width: '48px', height: '48px', color: 'var(--primary)' }} />
        </div>
        
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '16px' }}>
          Spaced Repetition Training
        </h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '32px' }}>
          Our AI tracks questions you scored below 70% on. When you start a practice session, 
          we will pull up to 3 of your weakest concepts that are due for review and generate 
          <strong> new variations </strong> of them to test your true understanding.
        </p>

        {error && (
          <div style={{ padding: '13px 16px', backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '24px', textAlign: 'left' }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{ padding: '13px 16px', backgroundColor: 'rgba(16,185,129,0.08)', color: '#10b981', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)', fontSize: '0.95rem', fontWeight: 500, marginBottom: '24px' }}>
            🎉 {successMsg}
          </div>
        )}

        <button 
          className="pm-btn pm-btn-primary" 
          onClick={handleStartPractice}
          style={{ padding: '14px 32px', fontSize: '1.05rem', width: '100%' }}
        >
          Start Practice Session
        </button>
      </div>
    </div>
  );
}
