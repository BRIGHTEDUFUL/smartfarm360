import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="topnav">
      <div className="topnav-inner">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">
            <i className="fas fa-leaf"></i>
          </div>
          <span>Smart Farming <span className="dot">360</span></span>
        </Link>

        <button 
          className="mobile-menu-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className={isActive('/')} onClick={closeMobileMenu}>Home</Link>
          <Link to="/shop" className={isActive('/shop')} onClick={closeMobileMenu}>Shop</Link>
          <Link to="/about" className={isActive('/about')} onClick={closeMobileMenu}>About</Link>
          <Link to="/contact" className={isActive('/contact')} onClick={closeMobileMenu}>Contact</Link>
        </div>

        <div className="nav-search">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search fresh products..." />
        </div>

        <div className={`nav-actions ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {user ? (
            <>
              <div className="nav-user-chip">
                <i className="fas fa-user-circle"></i>
                <span>{user.first_name}</span>
                <span className="role">{user.role}</span>
              </div>

              {user.role === 'Farmer' && (
                <Link to="/farmer" className="nav-btn nav-btn-outline" onClick={closeMobileMenu}>
                  <i className="fas fa-tachometer-alt"></i>
                  Dashboard
                </Link>
              )}

              {user.role === 'Admin' && (
                <Link to="/admin" className="nav-btn nav-btn-outline" onClick={closeMobileMenu}>
                  <i className="fas fa-shield-alt"></i>
                  Admin
                </Link>
              )}

              {user.role === 'Consumer' && (
                <Link to="/orders" className="nav-btn nav-btn-outline" onClick={closeMobileMenu}>
                  <i className="fas fa-box"></i>
                  Orders
                </Link>
              )}

              <button onClick={handleLogout} className="nav-btn nav-btn-outline">
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>

              <Link to="/cart" className="cart-btn" onClick={closeMobileMenu}>
                <i className="fas fa-shopping-cart"></i>
                {items.length > 0 && (
                  <span className="cart-count show">{items.length}</span>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn nav-btn-outline" onClick={closeMobileMenu}>
                Login
              </Link>
              <Link to="/register" className="nav-btn nav-btn-primary" onClick={closeMobileMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
