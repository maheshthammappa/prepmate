import { useState, useRef, useEffect } from 'react';
import { Loader2, Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { interviewApi } from '../../interview/interview.api';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am your AI Mentor. Ask me any doubts regarding interviews, coding, or preparation, and I will help you out!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // Re-use the existing askDoubt endpoint, treating the chat context simply.
      // In a real app we might pass the full conversation history.
      const res = await interviewApi.askDoubt(`My Question: ${userMessage}`);
      setMessages(prev => [...prev, { role: 'ai', content: res.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I am having trouble connecting to the server right now. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', padding: '24px', display: 'flex', justifyContent: 'center', background: 'var(--bg-page)', boxSizing: 'border-box' }}>
      <div className="pm-card" style={{ width: '100%', maxWidth: '860px', display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
        
        {/* Header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Bot size={22} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)' }}>AI Mentor</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Always here to help you prepare</p>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'var(--bg-muted)' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: msg.role === 'user' ? 'var(--text-heading)' : 'var(--primary)', 
                color: 'white' 
              }}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div style={{ 
                maxWidth: '75%', padding: '14px 18px', borderRadius: '14px',
                backgroundColor: msg.role === 'user' ? 'var(--primary)' : 'var(--bg-card)',
                color: msg.role === 'user' ? 'white' : 'var(--text-heading)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                borderTopRightRadius: msg.role === 'user' ? '4px' : '14px',
                borderTopLeftRadius: msg.role === 'ai' ? '4px' : '14px',
                lineHeight: 1.6, fontSize: '0.95rem',
                boxShadow: msg.role === 'user' ? '0 4px 12px rgba(99,102,241,0.2)' : 'none'
              }}>
                {msg.role === 'ai' ? (
                  <div className="markdown-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} />
              </div>
              <div style={{ padding: '14px 18px', borderRadius: '14px', borderTopLeftRadius: '4px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <Loader2 size={18} className="spin" color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '20px 28px', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}
          >
            <textarea
              className="pm-input"
              style={{ 
                flex: 1, padding: '12px 20px', borderRadius: '24px', fontSize: '0.95rem',
                minHeight: '48px', maxHeight: '150px', resize: 'none', lineHeight: '1.5'
              }}
              rows={1}
              placeholder="Type your question here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="pm-btn-primary"
              disabled={isLoading || !input.trim()}
              style={{ 
                borderRadius: '50px', width: '48px', height: '48px', padding: 0, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                opacity: (isLoading || !input.trim()) ? 0.6 : 1
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
