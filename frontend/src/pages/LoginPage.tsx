import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const getRoleRedirect = (role: string): string => {
    const r = String(role || '').toLowerCase();
    if (r === 'farmer') return '/farmer';
    if (r === 'admin') return '/admin';
    if (r === 'agriculturalofficer') return '/officers';
    return '/shop';
  };

  const executeLogin = async (targetEmail: string, targetPass: string) => {
    setLoading(true);
    try {
      const loggedUser = await login(targetEmail, targetPass);
      const role = loggedUser?.role || 'Consumer';
      const name = loggedUser?.first_name || 'there';
      toast.success(`Welcome back, ${name}! Redirecting…`);
      const path = getRoleRedirect(role);
      navigate(path, { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;
    executeLogin(email, password);
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    executeLogin(demoEmail, demoPass);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
        <div className="auth-orb auth-orb-3"></div>
      </div>

      <div className="auth-split-container">
        <div className="auth-hero">
          <div className="auth-hero-content">
            <div className="auth-hero-badge">
              <i className="fas fa-seedling"></i>
              <span>Trusted Marketplace</span>
            </div>
            <h1 className="auth-hero-title">
              Welcome to <span className="gradient-text">Smart Farming 360</span>
            </h1>
            <p className="auth-hero-desc">
              Sign in to a refined marketplace experience built for fresh
              produce shopping, farmer connections, and dependable delivery.
            </p>
            <div className="auth-features">
              <div className="auth-feature">
                <i className="fas fa-check-circle"></i>
                <span>100% Fresh &amp; Organic</span>
              </div>
              <div className="auth-feature">
                <i className="fas fa-check-circle"></i>
                <span>Direct from Farmers</span>
              </div>
              <div className="auth-feature">
                <i className="fas fa-check-circle"></i>
                <span>Secure Payments</span>
              </div>
            </div>
          </div>

          <div className="floating-products">
            <div className="floating-product fp-1">
              <img src="/images/tomato.jpg" alt="Tomatoes" />
            </div>
            <div className="floating-product fp-2">
              <img src="/images/banana.jpg" alt="Bananas" />
            </div>
            <div className="floating-product fp-3">
              <img src="/images/carrot.jpg" alt="Carrots" />
            </div>
            <div className="floating-product fp-4">
              <img src="/images/avocado.jpg" alt="Avocado" />
            </div>
            <div className="floating-product fp-5">
              <img src="/images/pepper.jpg" alt="Pepper" />
            </div>
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-logo">
                <img src="/icons/icon-base.svg" alt="Smart Farming 360" />
              </div>
              <h1>Welcome Back</h1>
              <p>Sign in to continue shopping and managing your farm</p>
            </div>

            {/* 1-Click Instant Demo Login Accounts */}
            <div style={{ margin: '1.25rem 0', padding: '1rem', background: '#f0fdf4', borderRadius: '12px', border: '1.5px solid #bbf7d0' }}>
              <p style={{ margin: '0 0 0.6rem', fontSize: '0.8rem', fontWeight: 700, color: '#166534', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ⚡ 1-Click Instant Demo Login
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickLogin('farmer@smartfarm360.com', 'Password123!')}
                  style={{ padding: '0.55rem 0.6rem', borderRadius: '8px', border: '1.5px solid #86efac', background: '#ffffff', fontSize: '0.82rem', fontWeight: 700, color: '#166534', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
                >
                  👨‍🌾 Farmer
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickLogin('consumer@smartfarm360.com', 'Password123!')}
                  style={{ padding: '0.55rem 0.6rem', borderRadius: '8px', border: '1.5px solid #86efac', background: '#ffffff', fontSize: '0.82rem', fontWeight: 700, color: '#166534', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
                >
                  🛒 Consumer
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickLogin('officer@smartfarm360.com', 'Password123!')}
                  style={{ padding: '0.55rem 0.6rem', borderRadius: '8px', border: '1.5px solid #86efac', background: '#ffffff', fontSize: '0.82rem', fontWeight: 700, color: '#166534', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
                >
                  🏛️ Agric Officer
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickLogin('admin@smartfarm360.com', 'Password123!')}
                  style={{ padding: '0.55rem 0.6rem', borderRadius: '8px', border: '1.5px solid #86efac', background: '#ffffff', fontSize: '0.82rem', fontWeight: 700, color: '#166534', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
                >
                  🛡️ Admin
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>
                  <i className="fas fa-envelope"></i>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-lock"></i>
                  Password
                </label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Logging in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    Login
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account? <Link to="/register">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
