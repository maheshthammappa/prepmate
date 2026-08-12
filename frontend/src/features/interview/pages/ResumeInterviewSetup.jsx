import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../hooks/InterviewContext';
import { Play, UploadCloud, File, Settings2, X } from 'lucide-react';

export default function ResumeInterviewSetup() {
  const navigate = useNavigate();
  const { startResumeInterview, isGenerating } = useInterview();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({ experienceLevel: 'Intermediate', questionCount: '1', duration: '5', questionStyle: 'Mixed' });
  const [resumeText, setResumeText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('File size must be less than 5MB'); return; }
    setSelectedFile(file); setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) { setSelectedFile(file); setError(''); }
  };

  const clearFile = () => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === 'upload' && !selectedFile) { setError('Please select a resume file'); return; }
    if (activeTab === 'text' && !resumeText.trim()) { setError('Please paste your resume text'); return; }
    setError('');
    const apiFormData = new FormData();
    apiFormData.append('experienceLevel', formData.experienceLevel);
    apiFormData.append('questionCount', formData.questionCount);
    apiFormData.append('questionStyle', formData.questionStyle);
    if (activeTab === 'upload') apiFormData.append('file', selectedFile);
    else apiFormData.append('resumeText', resumeText);
    try {
      await startResumeInterview(apiFormData, formData.duration);
      navigate('/app/interviews/session/active');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process resume.');
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
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-heading)', margin: '0 0 8px' }}>Analyzing Resume...</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Our AI is extracting your experience and preparing tailored questions.</p>
        </div>
      </div>
    );
  }

  const canSubmit = activeTab === 'upload' ? !!selectedFile : resumeText.trim().length > 0;

  return (
    <div style={{ padding: '36px 32px 64px', animation: 'fadeInUp 0.3s ease' }}>

      <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Upload your resume to get personalized, experience-based questions.</p>
      </div>

      <div className="pm-card" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {error && (
            <div style={{ padding: '13px 16px', backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', borderRadius: '10px', border: '1.5px solid var(--border)', overflow: 'hidden', background: 'var(--bg-muted)' }}>
            {[{ id: 'upload', label: '📁  Upload File' }, { id: 'text', label: '📋  Paste Text' }].map((tab) => (
              <button
                key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1, padding: '11px 0', border: 'none', cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: 700, fontFamily: "'Inter', sans-serif",
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #a855f7, #7c3aed)' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                  transition: 'all 0.2s',
                  boxShadow: activeTab === tab.id ? '0 4px 12px rgba(168,85,247,0.25)' : 'none',
                }}
                onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--text-heading)'; }}
                onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Upload / Text area */}
          {activeTab === 'upload' ? (
            <div
              onClick={() => !selectedFile && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              style={{
                height: '180px', borderRadius: '12px',
                border: `2px dashed ${selectedFile ? 'var(--primary)' : isDragging ? '#a855f7' : 'rgba(168,85,247,0.3)'}`,
                background: selectedFile ? 'rgba(99,102,241,0.06)' : isDragging ? 'rgba(168,85,247,0.08)' : 'rgba(168,85,247,0.02)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: selectedFile ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'center', padding: '24px',
              }}
              onMouseEnter={e => { if (!selectedFile && !isDragging) e.currentTarget.style.background = 'rgba(168,85,247,0.05)'; }}
              onMouseLeave={e => { if (!selectedFile && !isDragging) e.currentTarget.style.background = 'rgba(168,85,247,0.02)'; }}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".pdf,.txt" />
              {selectedFile ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--primary), #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(99,102,241,0.35)' }}>
                    <File style={{ width: '22px', height: '22px', color: '#fff' }} />
                  </div>
                  <p style={{ margin: 0, fontWeight: 800, color: 'var(--text-heading)', fontSize: '0.9rem' }}>{selectedFile.name}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button type="button" onClick={(e) => { e.stopPropagation(); clearFile(); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 12px', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', background: 'transparent', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                    <X style={{ width: '12px', height: '12px' }} /> Remove
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud style={{ width: '38px', height: '38px', color: isDragging ? '#a855f7' : 'var(--text-muted)', marginBottom: '12px', transition: 'color 0.2s' }} />
                  <p style={{ margin: 0, fontWeight: 800, color: 'var(--text-heading)', fontSize: '0.9rem' }}>Drop your resume here or click to browse</p>
                  <p style={{ margin: '5px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supports PDF or Text files up to 5MB</p>
                </>
              )}
            </div>
          ) : (
            <textarea
              className="pm-input"
              value={resumeText} onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste the content of your resume here..."
              style={{ resize: 'none', height: '180px' }}
            />
          )}

          {/* Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
            <div>
              <label className="pm-label">Experience</label>
              <select className="pm-input" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="pm-label">Style</label>
              <select className="pm-input" name="questionStyle" value={formData.questionStyle} onChange={handleChange}>
                <option value="Mixed">Mixed</option>
                <option value="Definitions">Definitions</option>
                <option value="Conceptual">Conceptual</option>
                <option value="Scenario-Based">Scenario-Based</option>
              </select>
            </div>
            <div>
              <label className="pm-label">Questions</label>
              <select className="pm-input" name="questionCount" value={formData.questionCount} onChange={handleChange}>
                <option value="1">1 Question</option>
                {['5', '10', '15', '20', '25'].map(v => <option key={v} value={v}>{v} Questions</option>)}
              </select>
            </div>
            <div>
              <label className="pm-label">Duration</label>
              <select className="pm-input" name="duration" value={formData.duration} onChange={handleChange}>
                {['5', '15', '30', '45', '60'].map(v => <option key={v} value={v}>{v} Minutes</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit" className="pm-btn-primary"
            disabled={!canSubmit}
            style={{ 
              width: '100%', padding: '14px', fontSize: '0.95rem', 
              background: canSubmit ? 'linear-gradient(135deg, #a855f7, #7c3aed)' : 'rgba(168,85,247,0.15)', 
              color: canSubmit ? '#fff' : 'rgba(168,85,247,0.6)',
              cursor: canSubmit ? 'pointer' : 'not-allowed', 
              boxShadow: canSubmit ? '0 6px 20px rgba(168,85,247,0.35)' : 'none' 
            }}
          >
            <Play style={{ width: '17px', height: '17px' }} /> Analyze & Start
          </button>
        </form>
      </div>
    </div>
  );
}
