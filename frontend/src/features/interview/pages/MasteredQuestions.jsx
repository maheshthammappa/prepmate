import { useState, useEffect } from 'react';
import { interviewApi } from '../interview.api';
import { CheckCircle, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MasteredQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination and Filtering State
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [topicFilter, setTopicFilter] = useState('');
  
  // Hardcoded topics for filter (could also be fetched dynamically)
  const availableTopics = ['Java', 'SQL', 'Python', 'System Design', 'React', 'Data Structures', 'Algorithms', 'Spring Boot'];

  useEffect(() => {
    fetchMasteredQuestions();
  }, [page, topicFilter]);

  const fetchMasteredQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, size: 10 };
      if (topicFilter) {
        params.topic = topicFilter;
      }
      const data = await interviewApi.getMasteredQuestions(params);
      setQuestions(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError('Failed to load your success questions. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (e) => {
    setTopicFilter(e.target.value);
    setPage(0); // Reset to first page on filter change
  };

  return (
    <div style={{ padding: '36px 32px 64px', animation: 'fadeInUp 0.3s ease' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle style={{ color: '#10b981' }} /> My Knowledge Vault
          </h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Review all the concepts you have successfully mastered.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Filter style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
            <select 
              className="pm-input" 
              style={{ paddingLeft: '36px', minWidth: '160px', height: '42px' }}
              value={topicFilter}
              onChange={handleTopicChange}
            >
              <option value="">All Topics</option>
              {availableTopics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <div style={{ padding: '16px', backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      ) : loading && questions.length === 0 ? (
        <div style={{ padding: '64px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading your vault...</div>
      ) : questions.length === 0 ? (
        <div className="pm-card" style={{ padding: '64px 32px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', marginBottom: '24px' }}>
            <Search style={{ width: '48px', height: '48px', color: '#10b981' }} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '8px' }}>No Mastered Questions Yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>{topicFilter ? `You haven't mastered any questions in ${topicFilter} yet.` : "Complete standard interviews and score above 70% to fill your vault!"}</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {questions.map((q) => (
              <div key={q.id} className="pm-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', backgroundColor: '#10b981' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {q.topic}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(q.masteredAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.05rem', lineHeight: 1.5, fontWeight: 500 }}>
                  {q.questionText}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={() => setPage(p => Math.max(0, p - 1))} 
                disabled={page === 0}
                className="pm-btn pm-btn-secondary"
                style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', opacity: page === 0 ? 0.5 : 1, cursor: page === 0 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={18} /> Previous
              </button>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
                Page {page + 1} of {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} 
                disabled={page === totalPages - 1}
                className="pm-btn pm-btn-secondary"
                style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', opacity: page === totalPages - 1 ? 0.5 : 1, cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer' }}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
