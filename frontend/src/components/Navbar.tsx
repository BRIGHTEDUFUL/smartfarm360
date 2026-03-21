import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
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

        <div className="nav-links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/shop" className={isActive('/shop')}>Shop</Link>
          <Link to="/about" className={isActive('/about')}>About</Link>
          <Link to="/contact" className={isActive('/contact')}>Contact</Link>
        </div>

        <div className="nav-search">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search fresh products..." />
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <div className="nav-user-chip">
                <i className="fas fa-user-circle"></i>
                <span>{user.first_name}</span>
                <span className="role">{user.role}</span>
              </div>

              {user.role === 'Farmer' && (
                <Link to="/farmer" className="nav-btn nav-btn-outline">
                  <i className="fas fa-tachometer-alt"></i>
                  Dashboard
                </Link>
              )}

              {user.role === 'Admin' && (
                <Link to="/admin" className="nav-btn nav-btn-outline">
                  <i className="fas fa-shield-alt"></i>
                  Admin
                </Link>
              )}

              {user.role === 'Consumer' && (
                <Link to="/orders" className="nav-btn nav-btn-outline">
                  <i className="fas fa-box"></i>
                  Orders
                </Link>
              )}

              <button onClick={handleLogout} className="nav-btn nav-btn-outline">
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>

              <Link to="/cart" className="cart-btn">
                <i className="fas fa-shopping-cart"></i>
                {items.length > 0 && (
                  <span className="cart-count show">{items.length}</span>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn nav-btn-outline">
                Login
              </Link>
              <Link to="/register" className="nav-btn nav-btn-primary">
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
