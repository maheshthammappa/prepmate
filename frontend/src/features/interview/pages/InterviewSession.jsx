import { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useInterview } from '../hooks/InterviewContext';
import { Loader2, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare, AlertCircle, Mic, MicOff } from 'lucide-react';
import { interviewApi } from '../interview.api';

export default function InterviewSession() {
  const navigate = useNavigate();
  const { activeSession, answers, setAnswers, saveAnswer, submitInterview, isEvaluating, sessionEndTime } = useInterview();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [mentorQuery, setMentorQuery] = useState('');
  const [mentorResponse, setMentorResponse] = useState('');
  const [isAskingMentor, setIsAskingMentor] = useState(false);
  const [mentorError, setMentorError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const toggleListening = async () => {
    if (isListening) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsListening(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach(track => track.stop());
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.webm');
          
          setIsTranscribing(true);
          try {
            const transcribedText = await interviewApi.transcribeAudio(formData);
            if (transcribedText) {
              setAnswers(prev => {
                const cur = prev[currentQuestion.id] || '';
                return { ...prev, [currentQuestion.id]: cur + (cur ? ' ' : '') + transcribedText };
              });
            }
          } catch (err) {
            console.error("Transcription failed", err);
            alert("Failed to transcribe audio. Please try again.");
          } finally {
            setIsTranscribing(false);
          }
        };

        mediaRecorder.start();
        setIsListening(true);
      } catch (err) {
        console.error("Error accessing microphone", err);
        alert("Microphone access denied or not available.");
      }
    }
  };

  useEffect(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!sessionEndTime) return;
    const calculateTimeLeft = () => Math.max(0, Math.floor((sessionEndTime - Date.now()) / 1000));
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [sessionEndTime]);

  if (!activeSession) return <Navigate to="/app/interviews/new" replace />;

  const questions = activeSession.questions || [];
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswerChange = (e) => saveAnswer(currentQuestion.id, e.target.value);
  const handleNext = () => { if (currentIndex < questions.length - 1) { setCurrentIndex(p => p + 1); setMentorResponse(''); setMentorQuery(''); } };
  const handlePrev = () => { if (currentIndex > 0) { setCurrentIndex(p => p - 1); setMentorResponse(''); setMentorQuery(''); } };
  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit your interview for evaluation?')) {
      try {
        const id = await submitInterview();
        navigate(`/app/interviews/result/${id}`, { replace: true });
      } catch (err) { alert('Failed to submit interview. Please try again.'); }
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const askMentor = async () => {
    if (!mentorQuery.trim()) return;
    setIsAskingMentor(true); setMentorError('');
    try {
      const res = await interviewApi.askDoubt(`Context Question: ${currentQuestion.text}\n\nMy Doubt: ${mentorQuery}`);
      setMentorResponse(res.response);
    } catch (e) { setMentorError('Failed to get answer from mentor.'); }
    finally { setIsAskingMentor(false); }
  };

  if (isEvaluating) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '24px' }}>
        <Loader2 style={{ width: '48px', height: '48px', color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)', margin: '0 0 6px' }}>Evaluating Your Answers</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Our AI is analyzing your responses and generating personalized feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 64px)', padding: '24px 20px', display: 'flex', justifyContent: 'center', background: 'var(--bg-page)', boxSizing: 'border-box' }}>
      <div className="pm-card" style={{ width: '100%', maxWidth: '860px', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'fadeInUp 0.3s ease', height: '100%' }}>
        
        {/* Header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.01em' }}>{activeSession.topic} Interview</h1>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Question {currentIndex + 1} of {questions.length}</p>
          </div>
          <div style={{
            padding: '8px 16px', borderRadius: '50px', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem',
            backgroundColor: timeLeft < 300 ? 'rgba(239,68,68,0.1)' : 'var(--bg-muted)',
            color: timeLeft < 300 ? '#ef4444' : 'var(--text-heading)',
            border: `1px solid ${timeLeft < 300 ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`,
          }}>
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress */}
        <div style={{ height: '4px', backgroundColor: 'var(--border)', flexShrink: 0 }}>
          <div style={{ height: '100%', backgroundColor: 'var(--primary)', width: `${progress}%`, transition: 'width 0.4s' }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-heading)', lineHeight: 1.6 }}>
            {currentQuestion.questionText}
          </h2>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <label className="pm-label" style={{ marginBottom: 0 }}>Your Answer</label>
              <button
                onClick={toggleListening}
                disabled={isTranscribing}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                  borderRadius: '50px', border: `1.5px solid ${isListening ? 'rgba(239,68,68,0.4)' : 'rgba(99,102,241,0.3)'}`,
                  backgroundColor: isListening ? 'rgba(239,68,68,0.08)' : 'rgba(99,102,241,0.08)',
                  color: isListening ? '#ef4444' : 'var(--primary)',
                  cursor: isTranscribing ? 'wait' : 'pointer', fontSize: '0.85rem', fontWeight: 700,
                  transition: 'all 0.2s',
                  animation: isListening ? 'pulse 2s infinite' : 'none',
                  opacity: isTranscribing ? 0.6 : 1
                }}
                onMouseEnter={e => { if (!isListening && !isTranscribing) { e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.15)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; } }}
                onMouseLeave={e => { if (!isListening && !isTranscribing) { e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; } }}
              >
                {isTranscribing ? <><Loader2 style={{ width: '14px', height: '14px' }} className="spin" /> Transcribing...</> : 
                 isListening ? <><MicOff style={{ width: '14px', height: '14px' }} /> Stop</> : 
                 <><Mic style={{ width: '14px', height: '14px' }} /> Speak</>}
              </button>
            </div>
            <textarea
              className="pm-input"
              style={{
                flex: 1, minHeight: '140px', padding: '20px', borderRadius: '12px',
                fontSize: '0.95rem', resize: 'none', lineHeight: 1.6
              }}
              placeholder="Type your answer here..."
              value={answers[currentQuestion.id] || ''}
              onChange={handleAnswerChange}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 28px', borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handlePrev} disabled={currentIndex === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px',
              border: '2px solid var(--border)', borderRadius: '10px',
              backgroundColor: 'transparent', color: 'var(--text-secondary)',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentIndex === 0 ? 0.4 : 1,
              fontSize: '0.95rem', fontWeight: 700, transition: 'all 0.2s'
            }}
            onMouseEnter={e => { if (currentIndex !== 0) { e.currentTarget.style.borderColor = 'var(--text-muted)'; e.currentTarget.style.color = 'var(--text-heading)'; } }}
            onMouseLeave={e => { if (currentIndex !== 0) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
          >
            <ChevronLeft style={{ width: '16px', height: '16px' }} /> Previous
          </button>
          
          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="pm-btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 28px', fontSize: '0.95rem' }}
            >
              Next <ChevronRight style={{ width: '16px', height: '16px' }} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 28px',
                border: 'none', borderRadius: '10px', backgroundColor: '#10b981',
                color: '#fff', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 700,
                boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
              }}
            >
              <CheckCircle2 style={{ width: '18px', height: '18px' }} /> Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
