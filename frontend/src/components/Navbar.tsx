import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { usePwa } from "../contexts/PwaContext";
import { messagesAPI } from "../services/api";
import "./Navbar.css";

// Pages that have their own search bar — hide the Navbar desktop search on these
const PAGES_WITH_OWN_SEARCH = ["/community", "/weather", "/officers", "/messages", "/irrigation", "/ai-advisor"];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { canInstall, isInstalling, installApp } = usePwa();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [exploreMenuOpen, setExploreMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const exploreMenuRef = useRef<HTMLDivElement>(null);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Poll unread message count every 30s
  useEffect(() => {
    if (!user) { setUnreadMessages(0); return; }
    const fetch = () => {
      messagesAPI.getUnreadCount().then(res => {
        setUnreadMessages(res.data.data?.count ?? 0);
      }).catch(() => {});
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (exploreMenuRef.current && !exploreMenuRef.current.contains(e.target as Node)) {
        setExploreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setUserMenuOpen(false);
    setExploreMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  // Detect scroll for shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [searchOpen]);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const isExploreActive = () => {
    return ["/about", "/contact", "/officers"].some(p => location.pathname.startsWith(p));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleInstallClick = async () => {
    await installApp();
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "Farmer") return "/farmer";
    if (user.role === "Admin") return "/admin";
    if (user.role === "AgriculturalOfficer") return "/community";
    return "/orders";
  };

  const getDashboardLabel = () => {
    if (!user) return "Account";
    if (user.role === "Farmer") return "Farmer Dashboard";
    if (user.role === "Admin") return "Admin Panel";
    if (user.role === "AgriculturalOfficer") return "Officer Hub";
    return "My Orders";
  };

  const getDashboardIcon = () => {
    if (!user) return "fa-user";
    if (user.role === "Farmer") return "fa-tractor";
    if (user.role === "Admin") return "fa-shield-alt";
    if (user.role === "AgriculturalOfficer") return "fa-user-tie";
    return "fa-box";
  };

  return (
    <>
      <nav className={`topnav${scrolled ? " scrolled" : ""}`}>
        <div className="topnav-inner">
          {/* ── Logo ─────────────────────────────────────────── */}
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

          {/* ── Desktop nav links ─────────────────────────────── */}
          <div className="nav-links" role="navigation" aria-label="Site pages">
            <Link to="/" className={`nav-link${isActive("/") ? " active" : ""}`}>
              Home
            </Link>
            <Link to="/shop" className={`nav-link${isActive("/shop") ? " active" : ""}`}>
              Shop
            </Link>
            <Link to="/ai-advisor" className={`nav-link${isActive("/ai-advisor") ? " active" : ""}`}>
              AI Advisor
            </Link>
            <Link to="/community" className={`nav-link${isActive("/community") ? " active" : ""}`}>
              Community
            </Link>
            <Link to="/weather" className={`nav-link${isActive("/weather") ? " active" : ""}`}>
              Weather
            </Link>

            {/* Explore Dropdown for secondary links */}
            <div className="nav-dropdown-wrap" ref={exploreMenuRef}>
              <button
                type="button"
                className={`nav-link nav-dropdown-trigger${isExploreActive() ? " active" : ""}`}
                onClick={() => setExploreMenuOpen(v => !v)}
                aria-expanded={exploreMenuOpen}
              >
                More <i className={`fas fa-chevron-${exploreMenuOpen ? 'up' : 'down'} nav-caret`} />
              </button>
              {exploreMenuOpen && (
                <div className="nav-dropdown-menu">
                  <Link to="/officers" className={`nav-dropdown-item${isActive("/officers") ? " active" : ""}`}>
                    <i className="fas fa-user-tie" />
                    <span>Agric Officers</span>
                  </Link>
                  <Link to="/about" className={`nav-dropdown-item${isActive("/about") ? " active" : ""}`}>
                    <i className="fas fa-leaf" />
                    <span>About Us</span>
                  </Link>
                  <Link to="/contact" className={`nav-dropdown-item${isActive("/contact") ? " active" : ""}`}>
                    <i className="fas fa-envelope" />
                    <span>Contact &amp; Support</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ── Desktop search bar ─────────────────────────────── */}
          {!PAGES_WITH_OWN_SEARCH.some(p => location.pathname.startsWith(p)) && (
            <form
              className="nav-search"
              onSubmit={handleSearchSubmit}
              role="search"
            >
              <i className="fas fa-search nav-search-icon" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
            </form>
          )}

          {/* ── Desktop actions ───────────────────────────────── */}
          <div className="nav-actions">
            {canInstall && (
              <button
                type="button"
                className="nav-btn nav-btn-install"
                onClick={handleInstallClick}
                disabled={isInstalling}
                title="Install Smart Farming 360 app"
              >
                <i className="fas fa-download" aria-hidden="true" />
                <span className="install-text">App</span>
              </button>
            )}

            {user ? (
              <>
                {/* Messages shortcut with badge */}
                <Link
                  to="/messages"
                  className="nav-icon-link"
                  title="Messages"
                  aria-label="Messages"
                >
                  <i className="fas fa-envelope" />
                  {unreadMessages > 0 && (
                    <span className="nav-icon-badge">
                      {unreadMessages > 9 ? "9+" : unreadMessages}
                    </span>
                  )}
                </Link>

                {/* Cart icon */}
                <Link
                  to="/cart"
                  className="cart-btn"
                  aria-label={`Cart, ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
                  title="Shopping Cart"
                >
                  <i className="fas fa-shopping-cart" aria-hidden="true" />
                  {cartCount > 0 && (
                    <span className="cart-count show" aria-hidden="true">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* User Profile Dropdown Menu */}
                <div className="nav-user-menu-wrap" ref={userMenuRef}>
                  <button
                    type="button"
                    className="nav-user-chip"
                    onClick={() => setUserMenuOpen(v => !v)}
                    aria-expanded={userMenuOpen}
                    title="Open user menu"
                  >
                    <div className="nav-user-avatar">
                      {user.first_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="chip-name">{user.first_name}</span>
                    <span className="chip-role">{user.role}</span>
                    <i className={`fas fa-chevron-${userMenuOpen ? 'up' : 'down'} nav-chip-caret`} />
                  </button>

                  {userMenuOpen && (
                    <div className="nav-user-dropdown">
                      <div className="nav-user-dropdown-header">
                        <strong>{user.first_name} {user.last_name}</strong>
                        <small>{user.email}</small>
                        <span className="nav-user-role-badge">{user.role}</span>
                      </div>

                      <div className="nav-user-dropdown-body">
                        <Link to={getDashboardPath()} className="nav-dropdown-item">
                          <i className={`fas ${getDashboardIcon()}`} />
                          <span>{getDashboardLabel()}</span>
                        </Link>

                        {user.role === "Farmer" && (
                          <Link to="/irrigation" className="nav-dropdown-item">
                            <i className="fas fa-tint" />
                            <span>Irrigation Manager</span>
                          </Link>
                        )}

                        <Link to="/messages" className="nav-dropdown-item">
                          <i className="fas fa-envelope" />
                          <span>Messages</span>
                          {unreadMessages > 0 && (
                            <span className="nav-dropdown-badge">{unreadMessages}</span>
                          )}
                        </Link>

                        <Link to="/ai-advisor" className="nav-dropdown-item">
                          <i className="fas fa-brain" />
                          <span>AI Advisor</span>
                        </Link>

                        <div className="nav-dropdown-divider" />

                        <button
                          type="button"
                          className="nav-dropdown-item nav-dropdown-logout"
                          onClick={handleLogout}
                        >
                          <i className="fas fa-sign-out-alt" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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

          {/* ── Mobile right-side icons ───────────────────────── */}
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
              aria-label="Open AI advisor"
            >
              <i className="fas fa-brain" aria-hidden="true" />
            </Link>

            {/* Search toggle */}
            <button
              className={`nav-icon-btn${searchOpen ? " active" : ""}`}
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
              type="button"
            >
              <i
                className={`fas ${searchOpen ? "fa-times" : "fa-search"}`}
                aria-hidden="true"
              />
            </button>

            {/* Cart shortcut */}
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

            {/* Mobile quick sign out / sign in button */}
            {user ? (
              <button
                className="nav-icon-btn"
                onClick={handleLogout}
                aria-label="Sign Out"
                title="Sign Out"
                type="button"
                style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '50%' }}
              >
                <i className="fas fa-sign-out-alt" aria-hidden="true" />
              </button>
            ) : (
              <Link
                to="/login"
                className="nav-icon-btn"
                aria-label="Sign in"
                title="Sign In"
                style={{ color: '#0d5415' }}
              >
                <i className="fas fa-user-circle" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>

        {/* ── Mobile expanding search bar ───────────────────── */}
        {searchOpen && (
          <div
            className="nav-mobile-search open"
            aria-hidden={!searchOpen}
          >
            <form onSubmit={handleSearchSubmit} role="search">
              <i className="fas fa-search" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Search tomatoes, eggs, rice…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                tabIndex={0}
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <i className="fas fa-times" aria-hidden="true" />
                </button>
              )}
            </form>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
