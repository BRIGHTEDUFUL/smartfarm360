import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "./BottomTabBar.css";

const BottomTabBar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const scrollYRef = useRef<number>(0);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  // Body scroll lock — saves scroll position so page doesn't jump
  const lockBodyScroll = useCallback(() => {
    scrollYRef.current = window.scrollY;
    document.documentElement.style.setProperty(
      "--scroll-y",
      `-${scrollYRef.current}px`,
    );
    document.body.classList.add("scroll-locked");
    document.body.style.top = `-${scrollYRef.current}px`;
  }, []);

  const unlockBodyScroll = useCallback(() => {
    document.body.classList.remove("scroll-locked");
    document.body.style.top = "";
    document.documentElement.style.removeProperty("--scroll-y");
    // Restore scroll position silently
    window.scrollTo({
      top: scrollYRef.current,
      behavior: "instant" as ScrollBehavior,
    });
  }, []);

  // Animate sheet in/out + body scroll lock
  useEffect(() => {
    if (showAccountSheet) {
      lockBodyScroll();
      // Mount first, then animate in on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setSheetVisible(true));
      });
    } else {
      setSheetVisible(false);
      unlockBodyScroll();
    }

    // Always clean up on unmount
    return () => {
      unlockBodyScroll();
    };
  }, [showAccountSheet, lockBodyScroll, unlockBodyScroll]);

  const openAccountSheet = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAccountSheet(true);
  };

  const closeAccountSheet = useCallback(() => {
    setSheetVisible(false);
    setTimeout(() => setShowAccountSheet(false), 320);
  }, []);

  const handleLogout = useCallback(async () => {
    closeAccountSheet();
    setTimeout(async () => {
      await logout();
      navigate("/login");
    }, 320);
  }, [closeAccountSheet, logout, navigate]);

  // Swipe-down to dismiss sheet
  const onSheetTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onSheetTouchMove = (e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - touchStartY.current;
    // Only allow downward drag; prevent upward drag from over-scrolling
    if (deltaY > 0 && sheetRef.current) {
      // If sheet is scrolled to top, apply a visual drag resistance
      if (sheetRef.current.scrollTop === 0) {
        e.stopPropagation();
        const resistance = Math.min(deltaY * 0.4, 80);
        sheetRef.current.style.transform = `translateY(${resistance}px)`;
        sheetRef.current.style.transition = "none";
      }
    }
  };

  const onSheetTouchEnd = (e: React.TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (sheetRef.current) {
      sheetRef.current.style.transform = "";
      sheetRef.current.style.transition = "";
    }
    if (deltaY > 60) {
      closeAccountSheet();
    }
  };

  // Keyboard escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAccountSheet();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeAccountSheet]);

  const getUserInitials = () => {
    if (!user) return "?";
    return `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase();
  };

  const getRoleColor = () => {
    if (!user) return "#9CA3AF";
    switch (user.role) {
      case "Admin":
        return "#DC2626";
      case "Farmer":
        return "#0D5415";
      case "Consumer":
        return "#2563EB";
      default:
        return "#9CA3AF";
    }
  };

  const getRoleIcon = () => {
    if (!user) return "fa-user";
    switch (user.role) {
      case "Admin":
        return "fa-shield-alt";
      case "Farmer":
        return "fa-seedling";
      case "Consumer":
        return "fa-user";
      default:
        return "fa-user";
    }
  };

  // ─── Tab definitions per role ───────────────────────────────────
  type Tab = {
    path: string;
    icon: string;
    label: string;
    badge?: number;
    action?: (e: React.MouseEvent) => void;
    isAccount?: boolean;
  };

  const buildTabs = (): Tab[] => {
    if (!user) {
      return [
        { path: "/", icon: "fa-home", label: "Home" },
        { path: "/shop", icon: "fa-store", label: "Shop" },
        { path: "/about", icon: "fa-leaf", label: "About" },
        { path: "/contact", icon: "fa-envelope", label: "Contact" },
        { path: "/login", icon: "fa-user-circle", label: "Sign In" },
      ];
    }

    if (user.role === "Admin") {
      return [
        { path: "/", icon: "fa-home", label: "Home" },
        { path: "/shop", icon: "fa-store", label: "Shop" },
        { path: "/admin", icon: "fa-shield-alt", label: "Admin" },
        { path: "/orders", icon: "fa-boxes", label: "Orders" },
        {
          path: "#account",
          icon: "fa-user-circle",
          label: "Account",
          action: openAccountSheet,
          isAccount: true,
        },
      ];
    }

    if (user.role === "Farmer") {
      return [
        { path: "/", icon: "fa-home", label: "Home" },
        { path: "/shop", icon: "fa-store", label: "Shop" },
        { path: "/farmer", icon: "fa-tractor", label: "Farm" },
        { path: "/orders", icon: "fa-boxes", label: "Orders" },
        {
          path: "#account",
          icon: "fa-user-circle",
          label: "Account",
          action: openAccountSheet,
          isAccount: true,
        },
      ];
    }

    // Consumer
    return [
      { path: "/", icon: "fa-home", label: "Home" },
      { path: "/shop", icon: "fa-store", label: "Shop" },
      {
        path: "/cart",
        icon: "fa-shopping-cart",
        label: "Cart",
        badge: cartCount > 0 ? cartCount : undefined,
      },
      { path: "/orders", icon: "fa-box", label: "Orders" },
      {
        path: "#account",
        icon: "fa-user-circle",
        label: "Account",
        action: openAccountSheet,
        isAccount: true,
      },
    ];
  };

  const tabs = buildTabs();

  return (
    <>
      {/* ─── Bottom Tab Bar ─────────────────────────────────────── */}
      <nav className="btb" role="navigation" aria-label="Main navigation">
        {tabs.map((tab) => {
          const active = tab.isAccount ? false : isActive(tab.path);

          const content = (
            <>
              {active && (
                <span className="btb-active-pill" aria-hidden="true" />
              )}
              <span className="btb-icon-wrap" aria-hidden="true">
                <i className={`fas ${tab.icon}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="btb-badge" aria-label={`${tab.badge} items`}>
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </span>
                )}
              </span>
              <span className="btb-label">{tab.label}</span>
            </>
          );

          if (tab.action) {
            return (
              <button
                key={tab.path}
                className={`btb-tab${active ? " active" : ""}`}
                onClick={tab.action}
                aria-label={tab.label}
                type="button"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`btb-tab${active ? " active" : ""}`}
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      {/* ─── Account Bottom Sheet ───────────────────────────────── */}
      {showAccountSheet && (
        <div
          className={`btb-overlay${sheetVisible ? " visible" : ""}`}
          onClick={closeAccountSheet}
          aria-hidden="true"
        />
      )}

      {showAccountSheet && (
        <div
          ref={sheetRef}
          className={`btb-sheet${sheetVisible ? " visible" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Account menu"
          onTouchStart={onSheetTouchStart}
          onTouchMove={onSheetTouchMove}
          onTouchEnd={onSheetTouchEnd}
        >
          {/* Drag handle */}
          <div className="btb-sheet-handle" aria-hidden="true" />

          {/* User info */}
          <div className="btb-sheet-profile">
            <div
              className="btb-sheet-avatar"
              style={{
                background: `${getRoleColor()}22`,
                color: getRoleColor(),
              }}
            >
              {getUserInitials()}
            </div>
            <div className="btb-sheet-user-info">
              <p className="btb-sheet-name">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="btb-sheet-email">{user?.email}</p>
              <span
                className="btb-sheet-role-badge"
                style={{
                  background: `${getRoleColor()}18`,
                  color: getRoleColor(),
                }}
              >
                <i className={`fas ${getRoleIcon()}`} />
                {user?.role}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="btb-sheet-divider" />

          {/* Quick actions */}
          <div className="btb-sheet-actions">
            {user?.role === "Farmer" && (
              <button
                className="btb-sheet-action-btn"
                onClick={() => {
                  closeAccountSheet();
                  setTimeout(() => navigate("/farmer"), 320);
                }}
                type="button"
              >
                <span
                  className="btb-action-icon"
                  style={{ background: "#0D541518", color: "#0D5415" }}
                >
                  <i className="fas fa-tractor" />
                </span>
                <span className="btb-action-text">
                  <strong>Farmer Dashboard</strong>
                  <small>Manage your products & orders</small>
                </span>
                <i className="fas fa-chevron-right btb-action-arrow" />
              </button>
            )}

            {user?.role === "Admin" && (
              <button
                className="btb-sheet-action-btn"
                onClick={() => {
                  closeAccountSheet();
                  setTimeout(() => navigate("/admin"), 320);
                }}
                type="button"
              >
                <span
                  className="btb-action-icon"
                  style={{ background: "#DC262618", color: "#DC2626" }}
                >
                  <i className="fas fa-shield-alt" />
                </span>
                <span className="btb-action-text">
                  <strong>Admin Panel</strong>
                  <small>Manage users, products & orders</small>
                </span>
                <i className="fas fa-chevron-right btb-action-arrow" />
              </button>
            )}

            {user?.role === "Consumer" && (
              <button
                className="btb-sheet-action-btn"
                onClick={() => {
                  closeAccountSheet();
                  setTimeout(() => navigate("/orders"), 320);
                }}
                type="button"
              >
                <span
                  className="btb-action-icon"
                  style={{ background: "#2563EB18", color: "#2563EB" }}
                >
                  <i className="fas fa-box" />
                </span>
                <span className="btb-action-text">
                  <strong>My Orders</strong>
                  <small>Track & view your orders</small>
                </span>
                <i className="fas fa-chevron-right btb-action-arrow" />
              </button>
            )}

            <button
              className="btb-sheet-action-btn"
              onClick={() => {
                closeAccountSheet();
                setTimeout(() => navigate("/shop"), 320);
              }}
              type="button"
            >
              <span
                className="btb-action-icon"
                style={{ background: "#F59E0B18", color: "#F59E0B" }}
              >
                <i className="fas fa-store" />
              </span>
              <span className="btb-action-text">
                <strong>Shop</strong>
                <small>Browse fresh products</small>
              </span>
              <i className="fas fa-chevron-right btb-action-arrow" />
            </button>

            <button
              className="btb-sheet-action-btn"
              onClick={() => {
                closeAccountSheet();
                setTimeout(() => navigate("/ai-advisor"), 320);
              }}
              type="button"
            >
              <span
                className="btb-action-icon"
                style={{ background: "#0D541518", color: "#0D5415" }}
              >
                <i className="fas fa-brain" />
              </span>
              <span className="btb-action-text">
                <strong>AI Advisor</strong>
                <small>Scan crops and get field timing guidance</small>
              </span>
              <i className="fas fa-chevron-right btb-action-arrow" />
            </button>

            <button
              className="btb-sheet-action-btn"
              onClick={() => {
                closeAccountSheet();
                setTimeout(() => navigate("/contact"), 320);
              }}
              type="button"
            >
              <span
                className="btb-action-icon"
                style={{ background: "#7C3AED18", color: "#7C3AED" }}
              >
                <i className="fas fa-headset" />
              </span>
              <span className="btb-action-text">
                <strong>Support</strong>
                <small>Get help & contact us</small>
              </span>
              <i className="fas fa-chevron-right btb-action-arrow" />
            </button>
          </div>

          {/* Divider */}
          <div className="btb-sheet-divider" />

          {/* Logout */}
          <button
            className="btb-sheet-logout-btn"
            onClick={handleLogout}
            type="button"
          >
            <i className="fas fa-sign-out-alt" />
            Sign Out
          </button>

          {/* Safe area spacer */}
          <div className="btb-sheet-safe-area" />
        </div>
      )}
    </>
  );
};

export default BottomTabBar;
