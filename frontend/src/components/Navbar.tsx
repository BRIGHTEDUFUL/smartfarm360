import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { usePwa } from "../contexts/PwaContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { canInstall, isInstalling, installApp } = usePwa();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleInstallClick = async () => {
    await installApp();
  };

  return (
    <nav className={`topnav${scrolled ? " scrolled" : ""}`}>
      <div className="topnav-inner">
        <Link
          to="/"
          className="nav-logo"
          aria-label="Smart Farming 360 – Home"
        >
          <div className="nav-logo-icon" aria-hidden="true">
            <img src="/icons/icon-base.svg" alt="" />
          </div>
          <span className="nav-logo-text">
            Smart Farming <span className="dot">360</span>
          </span>
        </Link>

        <div className="nav-links" role="navigation" aria-label="Site pages">
          <Link to="/" className={`nav-link${isActive("/") ? " active" : ""}`}>
            Home
          </Link>
          <Link
            to="/shop"
            className={`nav-link${isActive("/shop") ? " active" : ""}`}
          >
            Shop
          </Link>
          <Link
            to="/ai-advisor"
            className={`nav-link${isActive("/ai-advisor") ? " active" : ""}`}
          >
            Crop Vision Lab
          </Link>
          <Link
            to="/about"
            className={`nav-link${isActive("/about") ? " active" : ""}`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`nav-link${isActive("/contact") ? " active" : ""}`}
          >
            Contact
          </Link>
        </div>

        <div className="nav-actions">
          {canInstall && (
            <button
              type="button"
              className="nav-btn nav-btn-install"
              onClick={handleInstallClick}
              disabled={isInstalling}
            >
              <i className="fas fa-download" aria-hidden="true" />
              {isInstalling ? "Installing..." : "Install App"}
            </button>
          )}

          {user ? (
            <>
              <div className="nav-user-chip" title={user.email}>
                <i className="fas fa-user-circle" aria-hidden="true" />
                <span className="chip-name">{user.first_name}</span>
                <span className="chip-role">{user.role}</span>
              </div>

              {user.role === "Farmer" && (
                <Link to="/farmer" className="nav-btn nav-btn-outline">
                  <i className="fas fa-tractor" aria-hidden="true" />
                  Dashboard
                </Link>
              )}

              {user.role === "Admin" && (
                <Link to="/admin" className="nav-btn nav-btn-outline">
                  <i className="fas fa-shield-alt" aria-hidden="true" />
                  Admin
                </Link>
              )}

              {user.role === "Consumer" && (
                <Link to="/orders" className="nav-btn nav-btn-outline">
                  <i className="fas fa-box" aria-hidden="true" />
                  Orders
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="nav-btn nav-btn-outline"
                type="button"
              >
                <i className="fas fa-sign-out-alt" aria-hidden="true" />
                Logout
              </button>

              <Link
                to="/cart"
                className="cart-btn"
                aria-label={`Cart, ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
              >
                <i className="fas fa-shopping-cart" aria-hidden="true" />
                {cartCount > 0 && (
                  <span className="cart-count show" aria-hidden="true">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
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

        <div className="nav-mobile-actions">
          {canInstall && (
            <button
              className="nav-icon-btn nav-install-icon"
              onClick={handleInstallClick}
              aria-label="Install app"
              type="button"
              disabled={isInstalling}
            >
              <i className="fas fa-download" aria-hidden="true" />
            </button>
          )}

          <Link
            to="/ai-advisor"
            className={`nav-icon-btn nav-ai-icon${isActive("/ai-advisor") ? " active" : ""}`}
            aria-label="Open Crop Vision Lab"
          >
            <i className="fas fa-brain" aria-hidden="true" />
          </Link>

          {user?.role === "Consumer" && (
            <Link
              to="/cart"
              className="nav-icon-btn nav-cart-icon"
              aria-label={`Cart, ${cartCount} items`}
            >
              <i className="fas fa-shopping-cart" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="nav-cart-dot" aria-hidden="true">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
