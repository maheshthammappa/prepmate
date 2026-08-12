import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { Loader2, Mail, Lock, User as UserIcon, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../auth.api';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameStatus, setUsernameStatus] = useState(null); // 'checking' | 'available' | 'taken' | null
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    
    if (name === 'username' && value.length >= 4) {
        checkUsernameAvailability(value);
    } else if (name === 'username') {
        setUsernameStatus(null);
    }
  };

  const checkUsernameAvailability = async (username) => {
      setUsernameStatus('checking');
      try {
          const res = await authApi.checkUsername(username);
          setUsernameStatus(res.exists ? 'taken' : 'available');
      } catch {
          setUsernameStatus(null);
      }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (usernameStatus === 'taken') {
        setError('Username is already taken');
        return;
    }
    
    setIsLoading(true);
    try {
      await register({
          username: formData.username,
          email: formData.email,
          password: formData.password
      });
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', background: 'var(--bg-page)', backgroundImage: 'radial-gradient(circle at 85% 50%, rgba(99, 102, 241, 0.08), transparent 25%), radial-gradient(circle at 15% 30%, rgba(168, 85, 247, 0.08), transparent 25%)' }}>
      
      <div style={{ width: '100%', maxWidth: '380px' }}>


        <div className="pm-card" style={{ padding: '28px 24px', animation: 'fadeInUp 0.5s ease 0.1s both' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)', margin: '0 0 4px 0' }}>Create an account</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Join Prepmate to get started.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {error && (
              <div style={{ padding: '10px 14px', backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="pm-label" style={{ fontSize: '0.8rem', marginBottom: '6px' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <UserIcon style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  className="pm-input"
                  style={{ paddingLeft: '38px', padding: '10px 10px 10px 38px', fontSize: '0.9rem', borderColor: usernameStatus === 'taken' ? '#ef4444' : 'var(--border)' }}
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                />
                <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, paddingRight: '12px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  {usernameStatus === 'checking' && <Loader2 style={{ width: '14px', height: '14px', color: 'var(--text-muted)', animation: 'spin 1s linear infinite' }} />}
                  {usernameStatus === 'available' && <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>Available</span>}
                  {usernameStatus === 'taken' && <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 600 }}>Taken</span>}
                </div>
              </div>
            </div>

            <div>
              <label className="pm-label" style={{ fontSize: '0.8rem', marginBottom: '6px' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <Mail style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="pm-input"
                  style={{ paddingLeft: '38px', padding: '10px 10px 10px 38px', fontSize: '0.9rem' }}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="pm-label" style={{ fontSize: '0.8rem', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <Lock style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pm-input"
                  style={{ padding: '10px 38px 10px 38px', fontSize: '0.9rem' }}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            <div>
              <label className="pm-label" style={{ fontSize: '0.8rem', marginBottom: '6px' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <Lock style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                </div>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="pm-input"
                  style={{ padding: '10px 38px 10px 38px', fontSize: '0.9rem' }}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showConfirmPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || usernameStatus === 'taken' || usernameStatus === 'checking'}
              className="pm-btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '4px', fontSize: '0.95rem' }}
            >
              {isLoading ? <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} /> : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
