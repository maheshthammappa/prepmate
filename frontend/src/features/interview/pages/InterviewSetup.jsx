import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../hooks/InterviewContext';
import { Play, Settings2 } from 'lucide-react';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const { startStandardInterview, isGenerating } = useInterview();
  const [formData, setFormData] = useState({ topic: 'Java', experienceLevel: 'Intermediate', questionCount: '1', duration: '5', questionStyle: 'Mixed' });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.topic.trim()) { setError('Please enter a topic or skill.'); return; }
    setError('');
    try {
      await startStandardInterview(formData);
      navigate('/app/interviews/session/active');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate interview. Please try again.');
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
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-heading)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Generating Your Interview</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Our AI is preparing tailored questions based on your selections...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '36px 32px 64px', animation: 'fadeInUp 0.3s ease' }}>

      <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Set up your practice session parameters below.</p>
      </div>

      <div className="pm-card" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {error && (
            <div style={{ padding: '13px 16px', backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.875rem', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <div>
            <label className="pm-label">Topic or Skill</label>
            <select className="pm-input" name="topic" value={formData.topic} onChange={handleChange} required>
              <option value="" disabled>Select a topic</option>
              <option value="Java">Java</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="SQL">SQL</option>
              <option value="React">React</option>
              <option value="Spring Boot">Spring Boot</option>
              <option value="Django">Django</option>
              <option value="FastAPI">FastAPI</option>
              <option value="Git/GitHub">Git / GitHub</option>
              <option value="Docker/DockerHub">Docker / DockerHub</option>
              <option value="Operating Systems">Operating Systems (OS)</option>
              <option value="Computer Networks">Computer Networks (CN)</option>
              <option value="DBMS">DBMS</option>
              <option value="OOPs">Object Oriented Programming (OOPs)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div>
              <label className="pm-label">Experience Level</label>
              <select className="pm-input" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="pm-label">Number of Questions</label>
              <select className="pm-input" name="questionCount" value={formData.questionCount} onChange={handleChange}>
                <option value="1">1 Question</option>
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="20">20 Questions</option>
                <option value="25">25 Questions</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div>
              <label className="pm-label">Question Style</label>
              <select className="pm-input" name="questionStyle" value={formData.questionStyle} onChange={handleChange}>
                <option value="Mixed">Mixed (Recommended)</option>
                <option value="Definitions">Definitions</option>
                <option value="Conceptual">Conceptual</option>
                <option value="Scenario-Based">Scenario-Based</option>
              </select>
            </div>
            <div>
              <label className="pm-label">Target Duration</label>
              <select className="pm-input" name="duration" value={formData.duration} onChange={handleChange}>
                <option value="5">5 Minutes</option>
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
              <p style={{ margin: '7px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Just for the timer. You can submit early or late.</p>
            </div>
          </div>

          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
            <button 
              type="submit" 
              className="pm-btn-primary" 
              style={{ 
                width: '100%', padding: '14px', fontSize: '0.95rem',
                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                boxShadow: '0 6px 20px rgba(168,85,247,0.35)',
                border: 'none',
                color: '#fff'
              }}
            >
              <Play style={{ width: '17px', height: '17px' }} /> Start Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
