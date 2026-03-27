import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { videoAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import BingeLogo from "../../components/common/BingeLogo";
import VideoCard from "../../components/common/VideoCard";
import "./Home.css";

const CATEGORIES = [
  "Action",
  "Drama",
  "Comedy",
  "Thriller",
  "Documentary",
  "Sci-Fi",
  "Horror",
  "Romance",
];

const Home = () => {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await videoAPI.getAll({ limit: 12 });
        const videos = data.videos || data || [];
        setFeatured(videos.slice(0, 4));
        setRecent(videos.slice(0, 8));
      } catch {
        /* use empty */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim())
      navigate(`/browse?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="home__hero">
        <div className="home__hero-bg">
          <div className="home__hero-orb home__hero-orb--1" />
          <div className="home__hero-orb home__hero-orb--2" />
          <div className="home__hero-grid" />
        </div>

        <div className="home__hero-content">
          <div className="animate-fadeInUp">
            <div className="home__hero-badge">
              <span className="home__hero-badge-dot" />
              Stream Unlimited Content
            </div>
          </div>
          <br />
          <div className="hero-title-wrap">
            <h1 className="home__hero-title animate-fadeInUp delay-100">
              Everything <span className="home__hero-title-accent">Worth</span>{" "}
              Watching
            </h1>
           
          </div>

          <p className="home__hero-sub animate-fadeInUp delay-200">
            Discover thousands of videos, movies, and series. Curated for those
            who demand more.
          </p>

          <br />
          <div className="home__hero-actions animate-fadeInUp delay-400">
            <Link to="/browse" className="btn-primary home__hero-cta">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Start Watching
            </Link>
            {!isAuth && (
              <Link to="/register" className="btn-secondary">
                Join Free
              </Link>
            )}
          </div>
          <br />
          <div className="home__hero-stats animate-fadeInUp delay-500">
            <div className="home__stat">
              <span className="home__stat-num">10K+</span>
              <span className="home__stat-label">Videos</span>
            </div>
            <div className="home__stat-divider" />
            <div className="home__stat">
              <span className="home__stat-num">1M+</span>
              <span className="home__stat-label">Viewers</span>
            </div>
            <div className="home__stat-divider" />
            <div className="home__stat">
              <span className="home__stat-num">4K</span>
              <span className="home__stat-label">Quality</span>
            </div>
          </div>
        </div>

        {/* Floating video previews */}
        {featured.length > 0 && (
          <div className="home__hero-preview animate-fadeIn delay-300">
            {featured.map((v, i) => (
              <Link
                key={v._id}
                to={`/watch/${v._id}`}
                className="home__preview-card"
                style={{ animationDelay: `${0.4 + i * 0.15}s` }}
              >
                <div className="home__preview-thumb">
                  {v.thumbnailUrl ? (
                    <img src={v.thumbnailUrl} alt={v.title} />
                  ) : (
                    <div className="home__preview-thumb-fallback" />
                  )}
                </div>
                <span className="home__preview-title">{v.title}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="home__categories">
        <div className="home__container">
          <div className="section-heading">
            <h2>Browse by Genre</h2>
            <div className="accent-line" />
          </div>
          <div className="home__categories-grid">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat}
                to={`/browse?category=${cat}`}
                className="home__category-pill animate-fadeInUp"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Videos */}
      <section className="home__section">
        <div className="home__container">
          <div className="section-heading">
            <h2>Recently Added</h2>
            <div className="accent-line" />
            <Link to="/browse" className="btn-ghost">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid-videos">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="skeleton"
                    style={{
                      height: 260,
                      borderRadius: "var(--radius-lg)",
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}
            </div>
          ) : recent.length > 0 ? (
            <div className="grid-videos">
              {recent.map((video, i) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  style={{ animationDelay: `${i * 0.07}s` }}
                />
              ))}
            </div>
          ) : (
            <div className="home__empty">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.3"
              >
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                <polyline points="17 2 12 7 7 2" />
              </svg>
              <p>No videos available yet. Check back soon!</p>
              {isAuth && (
                <Link
                  to="/browse"
                  className="btn-primary"
                  style={{ marginTop: 16 }}
                >
                  Browse All
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      {!isAuth && (
        <section className="home__cta-banner">
          <div className="home__container">
            <div className="home__cta-inner">
              <div className="home__cta-text">
                <h2>Start Your Binge Journey</h2>
                <p>Create your free account and unlock unlimited streaming</p>
              </div>
              <div className="home__cta-btns">
                <Link to="/register" className="btn-primary">
                  Create Account
                </Link>
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
