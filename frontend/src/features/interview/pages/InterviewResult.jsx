import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { interviewApi } from '../interview.api';
import { Loader2, ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function InterviewResult() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await interviewApi.getHistoryDetails(id);
        setResult(data);
      } catch (err) {
        setError('Failed to load interview results.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: 'var(--color-primary)', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertCircle style={{ width: '18px', height: '18px' }} />
          {error || 'Result not found.'}
        </div>
        <div style={{ marginTop: '16px' }}>
          <Link to="/app/history" style={{ color: 'var(--color-primary)' }}>Return to History</Link>
        </div>
      </div>
    );
  }

  const scoreColor = result.overallScore >= 80 ? '#10b981' : result.overallScore >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ padding: '36px 32px 64px', animation: 'fadeInUp 0.3s ease' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '28px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {result.topic} &bull; {result.experienceLevel} &bull; {format(new Date(result.createdAt), 'MMMM d, yyyy')}
        </p>
      </div>

      {/* Score Card */}
      <div className="pm-card" style={{ padding: '28px', display: 'flex', gap: '32px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        {/* Circle */}
        <div style={{ flexShrink: 0, textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            <svg style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 128 128" width="120" height="120">
              <circle cx="64" cy="64" r="54" fill="none" stroke="var(--border)" strokeWidth="12" />
              <circle cx="64" cy="64" r="54" fill="none" stroke={scoreColor} strokeWidth="12"
                strokeDasharray={`${54 * 2 * Math.PI}`}
                strokeDashoffset={`${54 * 2 * Math.PI - (result.overallScore / 100) * 54 * 2 * Math.PI}`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.9rem', fontWeight: 900, color: scoreColor, letterSpacing: '-0.04em' }}>{result.overallScore}</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Score</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)' }}>Overall Summary</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>{result.overallSummary}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 6px', fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>
                <CheckCircle style={{ width: '14px', height: '14px' }} /> Strengths
              </h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{result.strengths}</p>
            </div>
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 6px', fontSize: '0.85rem', fontWeight: 700, color: '#ef4444' }}>
                <XCircle style={{ width: '14px', height: '14px' }} /> Weaknesses
              </h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{result.weaknesses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Improvements */}
      <div className="pm-card" style={{ padding: '24px', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 10px', fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)' }}>Recommended Improvements</h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '0.875rem' }}>{result.improvementSuggestions}</p>
      </div>

      {/* Q&A Analysis */}
      <div>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-heading)', margin: '32px 0 24px', letterSpacing: '-0.03em', textAlign: 'center' }}>Question Analysis</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {result.evaluations.map((evalItem, index) => {
            const qColor = evalItem.score >= 8 ? '#10b981' : evalItem.score >= 6 ? '#f59e0b' : '#ef4444';
            const qBg = evalItem.score >= 8 ? 'rgba(16,185,129,0.1)' : evalItem.score >= 6 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';
            return (
              <div key={evalItem.id} className="pm-card" style={{ overflow: 'hidden' }}>
                {/* Q Header */}
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-heading)', flex: 1, lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 900 }}>Q{index + 1}. </span>
                    {evalItem.questionText}
                  </h4>
                  <span className="pm-badge" style={{ backgroundColor: qBg, color: qColor, flexShrink: 0, fontWeight: 800 }}>
                    {evalItem.score} / 10
                  </span>
                </div>

                {/* Q Body */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <p style={{ margin: '0 0 8px', fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Your Answer</p>
                    <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-muted)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.875rem', color: 'var(--text-heading)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {evalItem.userAnswer || <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No answer provided.</span>}
                    </div>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 8px', fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>AI Feedback</p>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-body)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{evalItem.feedback}</p>
                  </div>
                  {evalItem.suggestedAnswer && (
                    <div>
                      <p style={{ margin: '0 0 8px', fontSize: '0.68rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Ideal Answer</p>
                      <div style={{ padding: '12px 16px', backgroundColor: 'rgba(16,185,129,0.06)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.15)', fontSize: '0.875rem', color: 'var(--text-heading)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                        {evalItem.suggestedAnswer}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Back button at bottom */}
      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
        <Link to="/app/history" className="pm-btn-secondary" style={{ textDecoration: 'none', padding: '11px 32px', fontSize: '0.875rem' }}>
          <ArrowLeft style={{ width: '15px', height: '15px' }} /> Back to Interview History
        </Link>
      </div>

    </div>
  );
}
