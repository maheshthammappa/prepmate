import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { Loader2, User as UserIcon, Mail, CheckCircle2, AlertCircle, Shield, Camera } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({ username: '', email: '', bio: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) setFormData({ username: user.username || '', email: user.email || '', bio: user.bio || '' });
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(''); setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setIsLoading(true); setError(''); setSuccess('');
    try { await updateProfile(formData); setSuccess('Profile updated successfully!'); }
    catch (err) { setError(err.response?.data?.message || 'Failed to update profile.'); }
    finally { setIsLoading(false); }
  };

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : 'U';

  return (
    <div style={{ padding: '36px 32px 64px', animation: 'fadeInUp 0.3s ease' }}>

      <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Manage your personal information and account details.</p>
      </div>

      {/* Avatar Card */}
      <div className="pm-card" style={{ marginBottom: '16px', padding: '28px', display: 'flex', alignItems: 'center', gap: '26px', background: 'linear-gradient(135deg, rgba(99,102,241,0.04), rgba(168,85,247,0.04))' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.7rem', fontWeight: 900, color: '#fff', boxShadow: '0 8px 28px rgba(99,102,241,0.38)', letterSpacing: '-0.02em' }}>
            {initials}
          </div>
          <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
            <Camera style={{ width: '11px', height: '11px', color: 'var(--text-muted)' }} />
          </div>
        </div>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-heading)', letterSpacing: '-0.03em' }}>{user?.username}</h2>
          <p style={{ margin: '0 0 12px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user?.email}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 11px', borderRadius: '50px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <Shield style={{ width: '11px', height: '11px', color: '#10b981' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981' }}>Verified Account</span>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="pm-card" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 16px', backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.875rem', fontWeight: 500 }}>
              <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} /> {error}
            </div>
          )}
          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 16px', backgroundColor: 'rgba(16,185,129,0.08)', color: '#10b981', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)', fontSize: '0.875rem', fontWeight: 500 }}>
              <CheckCircle2 style={{ width: '16px', height: '16px', flexShrink: 0 }} /> {success}
            </div>
          )}

          <div>
            <label className="pm-label">Username</label>
            <div style={{ position: 'relative' }}>
              <UserIcon style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input className="pm-input pm-input-icon" type="text" name="username" value={formData.username} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="pm-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input className="pm-input pm-input-icon" type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="pm-label">Bio</label>
            <textarea className="pm-input" name="bio" value={formData.bio} onChange={handleChange} rows={4}
              placeholder="Tell us a bit about your experience..." style={{ resize: 'none' }} />
          </div>

          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
            <button type="submit" disabled={isLoading} className="pm-btn-primary" style={{ padding: '12px 52px' }}>
              {isLoading && <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 0.8s linear infinite' }} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
