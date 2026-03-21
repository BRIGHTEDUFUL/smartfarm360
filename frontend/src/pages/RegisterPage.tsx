import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'Consumer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
      toast.success('Registration successful!');
      navigate('/shop');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Registration failed');
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
              <span>Join Our Community</span>
            </div>
            <h1 className="auth-hero-title">
              Start Your Journey with <span className="gradient-text">Smart Farming 360</span>
            </h1>
            <p className="auth-hero-desc">
              Whether you're a farmer looking to sell your produce or a consumer seeking fresh organic products, we've got you covered.
            </p>
            <div className="auth-features">
              <div className="auth-feature">
                <i className="fas fa-check-circle"></i>
                <span>Easy Setup</span>
              </div>
              <div className="auth-feature">
                <i className="fas fa-check-circle"></i>
                <span>Verified Farmers</span>
              </div>
              <div className="auth-feature">
                <i className="fas fa-check-circle"></i>
                <span>Safe Transactions</span>
              </div>
            </div>
          </div>

          <div className="floating-products">
            <div className="floating-product fp-1">
              <img src="/images/eggs.jpg" alt="Eggs" />
            </div>
            <div className="floating-product fp-2">
              <img src="/images/pineapple.jpg" alt="Pineapple" />
            </div>
            <div className="floating-product fp-3">
              <img src="/images/milk.jpg" alt="Milk" />
            </div>
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-logo">
                <i className="fas fa-leaf"></i>
              </div>
              <h1>Create Account</h1>
              <p>Join our farming community</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="role-selector">
                <label className={`role-option ${formData.role === 'Consumer' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="Consumer"
                    checked={formData.role === 'Consumer'}
                    onChange={handleChange}
                  />
                  <div className="role-content">
                    <i className="fas fa-shopping-bag"></i>
                    <span>Consumer</span>
                    <small>Buy fresh produce</small>
                  </div>
                </label>
                <label className={`role-option ${formData.role === 'Farmer' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="Farmer"
                    checked={formData.role === 'Farmer'}
                    onChange={handleChange}
                  />
                  <div className="role-content">
                    <i className="fas fa-tractor"></i>
                    <span>Farmer</span>
                    <small>Sell your products</small>
                  </div>
                </label>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <i className="fas fa-user"></i>
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="John"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-user"></i>
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-envelope"></i>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-phone"></i>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+233501234567"
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    minLength={8}
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
                <small className="password-hint">Minimum 8 characters</small>
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Creating account...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus"></i>
                    Sign Up
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
