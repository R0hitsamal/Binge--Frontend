import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BingeLogo from "./BingeLogo";
import "./Navbar.css";

const Navbar = () => {
  const { user, isAuth, isAdmin, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdown] = useState(false);

  const dropRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const close = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // 🔥 Sync input with URL
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // Submit search
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = search.trim();

    if (!trimmed) {
      navigate("/browse");
      return;
    }

    navigate(`/browse?search=${encodeURIComponent(trimmed)}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdown(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <BingeLogo size={34} />
        </Link>

        {/* Nav Links */}
        <div
          className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}
        >
          <Link
            to="/browse"
            className={`navbar__link ${location.pathname === "/browse" ? "active" : ""}`}
          >
            Browse
          </Link>
          {isAuth && !isAdmin && (
            <>
              <Link
                to="/history"
                className={`navbar__link ${location.pathname === "/history" ? "active" : ""}`}
              >
                History
              </Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link
                to="/admin"
                className={`navbar__link ${location.pathname.startsWith("/admin") ? "active" : ""}`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/upload"
                className={`navbar__link ${location.pathname === "/admin/upload" ? "active" : ""}`}
              >
                Upload
              </Link>
              <Link
                to="/admin/users"
                className={`navbar__link ${location.pathname === "/admin/users" ? "active" : ""}`}
              >
                Users
              </Link>
            </>
          )}
          {!isAuth && (
            <div className="navbar__auth-btns navbar__auth-btns--mobile">
              <Link
                to="/login"
                className="btn-ghost"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="btn-ghost"
                onClick={() => setMenuOpen(false)}
              >
                Join Free
              </Link>
            </div>
          )}
        </div>

        {/* Search */}
        <form className="navbar__search" onSubmit={handleSearch}>
          <div className="navbar__search-wrap">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                const val = e.target.value;
                setSearch(val);
                const trimmed = val.trim();
                if (!trimmed) {
                  navigate("/browse", { replace: true });
                } else {
                  navigate(`/browse?search=${encodeURIComponent(trimmed)}`, {
                    replace: true,
                  });
                }
              }}
              placeholder="Search videos..."
              className="navbar__search-input"
            />
          </div>
        </form>

        {/* Auth Zone */}
        <div className="navbar__auth">
          {isAuth ? (
            <div className="navbar__profile" ref={dropRef}>
              <button
                className="navbar__avatar"
                onClick={() => setDropdown(!dropdownOpen)}
              >
                <div className="navbar__avatar-circle">
                  {user?.username?.[0]?.toUpperCase() ||
                    user?.name?.[0]?.toUpperCase() ||
                    "U"}
                </div>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="navbar__dropdown animate-scaleIn">
                  <div className="navbar__dropdown-user">
                    <span className="navbar__dropdown-name">
                      {user?.username || user?.name}
                    </span>
                    <span className="navbar__dropdown-role">
                      {isAdmin ? "⚡ Admin" : "👤 Member"}
                    </span>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  {isAdmin ? (
                    <>
                      <Link
                        to="/admin"
                        className="navbar__dropdown-item"
                        onClick={() => setDropdown(false)}
                      >
                        <span>📊</span> Dashboard
                      </Link>
                      <Link
                        to="/admin/upload"
                        className="navbar__dropdown-item"
                        onClick={() => setDropdown(false)}
                      >
                        <span>⬆️</span> Upload Video
                      </Link>
                      <Link
                        to="/admin/users"
                        className="navbar__dropdown-item"
                        onClick={() => setDropdown(false)}
                      >
                        <span>👥</span> Manage Users
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/history"
                        className="navbar__dropdown-item"
                        onClick={() => setDropdown(false)}
                      >
                        <span>🕐</span> Watch History
                      </Link>
                    </>
                  )}
                  <div className="navbar__dropdown-divider" />
                  <button
                    className="navbar__dropdown-item navbar__dropdown-item--danger"
                    onClick={handleLogout}
                  >
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth-btns">
              <Link to="/login" className="btn-ghost">
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary"
                style={{ padding: "9px 20px", fontSize: "0.85rem" }}
              >
                Join Free
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span
            className={`navbar__bar ${menuOpen ? "navbar__bar--open" : ""}`}
          />
          <span
            className={`navbar__bar ${menuOpen ? "navbar__bar--open" : ""}`}
          />
          <span
            className={`navbar__bar ${menuOpen ? "navbar__bar--open" : ""}`}
          />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
