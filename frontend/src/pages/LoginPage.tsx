import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/shop');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setLoading(true);
    try {
      await login(testEmail, testPassword);
      toast.success('Login successful!');
      navigate('/shop');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
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
              <span>Farm to Table</span>
            </div>
            <h1 className="auth-hero-title">
              Welcome to <span className="gradient-text">Smart Farming 360</span>
            </h1>
            <p className="auth-hero-desc">
              Connect with local farmers, discover fresh organic produce, and support sustainable agriculture in your community.
            </p>
            <div className="auth-features">
              <div className="auth-feature">
                <i className="fas fa-check-circle"></i>
                <span>100% Fresh & Organic</span>
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
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-logo">
                <i className="fas fa-leaf"></i>
              </div>
              <h1>Welcome Back</h1>
              <p>Login to your account</p>
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
                    placeholder="••••••••"
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

            <div className="auth-divider">
              <span>or quick login as</span>
            </div>

            <div className="quick-login-buttons">
              <button
                className="quick-login-btn consumer"
                onClick={() => quickLogin('consumer@test.com', 'consumer123')}
                disabled={loading}
              >
                <i className="fas fa-shopping-bag"></i>
                Consumer
              </button>
              <button
                className="quick-login-btn farmer"
                onClick={() => quickLogin('farmer1@test.com', 'farmer123')}
                disabled={loading}
              >
                <i className="fas fa-tractor"></i>
                Farmer
              </button>
              <button
                className="quick-login-btn admin"
                onClick={() => quickLogin('admin@smartfarming.com', 'admin123')}
                disabled={loading}
              >
                <i className="fas fa-user-shield"></i>
                Admin
              </button>
            </div>

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
