import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { videoAPI } from '../../utils/api';
import VideoCard from '../../components/common/VideoCard';
import './Admin.css';

const StatCard = ({ icon, label, value, color, delay }) => (
  <div className={`admin-stat animate-fadeInUp`} style={{ animationDelay: delay, borderColor: color + '30' }}>
    <div className="admin-stat__icon" style={{ background: color + '18', color }}>
      {icon}
    </div>
    <div className="admin-stat__info">
      <span className="admin-stat__value">{value}</span>
      <span className="admin-stat__label">{label}</span>
    </div>
    <div className="admin-stat__glow" style={{ background: color }} />
  </div>
);

const AdminDashboard = () => {
  const [videos, setVideos]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast]       = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await videoAPI.getAll();
        setVideos(data.videos || data || []);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleDelete = async (videoId, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(videoId);
    try {
      await videoAPI.delete(videoId);
      setVideos(v => v.filter(vid => vid._id !== videoId));
      showToast(`"${title}" deleted successfully`);
    } catch (err) {
      showToast('Failed to delete video.');
    } finally { setDeleting(null); }
  };

  const totalViews = videos.reduce((s, v) => s + (v.views || 0), 0);
  const totalLikes = videos.reduce((s, v) => s + (v.likeCount || 0), 0);

  const formatNum = (n) => {
    if (n >= 1_000_000) return `${(n/1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n/1_000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <div className="admin-page">
      {toast && (
        <div className="admin-toast animate-fadeInUp">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          {toast}
        </div>
      )}

      <div className="admin-page__container">
        {/* Header */}
        <div className="admin-page__header animate-fadeInUp">
          <div>
            <div className="badge badge-gold" style={{ marginBottom: 10 }}>⚡ Admin Panel</div>
            <h1 className="admin-page__title">Dashboard</h1>
            <p className="admin-page__sub">Manage your streaming platform</p>
          </div>
          <Link to="/admin/upload" className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Upload Video
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="admin-stats-grid">
          <StatCard icon="🎬" label="Total Videos"  value={loading ? '—' : formatNum(videos.length)} color="var(--accent-primary)" delay="0s" />
          <StatCard icon="👁️" label="Total Views"   value={loading ? '—' : formatNum(totalViews)}   color="#6495ed"                delay="0.1s" />
          <StatCard icon="❤️" label="Total Likes"   value={loading ? '—' : formatNum(totalLikes)}   color="var(--accent-gold)"    delay="0.2s" />
          <StatCard icon="📊" label="Avg Views"     value={loading || !videos.length ? '—' : formatNum(Math.round(totalViews / videos.length))} color="#2abc77" delay="0.3s" />
        </div>

        {/* Quick Actions */}
        <div className="admin-quick-actions animate-fadeInUp delay-300">
          <h2 className="admin-section-title">Quick Actions</h2>
          <div className="admin-actions-grid">
            <Link to="/admin/upload" className="admin-action-card">
              <div className="admin-action-card__icon">⬆️</div>
              <span className="admin-action-card__label">Upload Video</span>
            </Link>
            <Link to="/admin/users" className="admin-action-card">
              <div className="admin-action-card__icon">👥</div>
              <span className="admin-action-card__label">Manage Users</span>
            </Link>
            <Link to="/admin/analytics" className="admin-action-card">
              <div className="admin-action-card__icon">📈</div>
              <span className="admin-action-card__label">Analytics</span>
            </Link>
            <Link to="/browse" className="admin-action-card">
              <div className="admin-action-card__icon">🎬</div>
              <span className="admin-action-card__label">Browse Site</span>
            </Link>
          </div>
        </div>

        {/* Videos Table */}
        <div className="animate-fadeInUp delay-400">
          <div className="section-heading" style={{ marginTop: 40 }}>
            <h2>Manage Videos</h2>
            <div className="accent-line" />
            <span className="badge badge-primary">{videos.length} total</span>
          </div>

          {loading ? (
            <div className="admin-table-skeleton">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 64, borderRadius: 'var(--radius-md)', animationDelay: `${i*0.05}s` }} />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="admin-empty">
              <p>No videos yet. <Link to="/admin/upload" className="auth-card__link">Upload the first one!</Link></p>
            </div>
          ) : (
            <div className="admin-videos-table">
              <div className="admin-table-header">
                <span>Video</span>
                <span>Views</span>
                <span>Likes</span>
                <span>Date</span>
                <span>Actions</span>
              </div>
              {videos.map((v, i) => (
                <div key={v._id} className="admin-table-row animate-fadeInUp" style={{ animationDelay: `${i*0.04}s` }}>
                  <div className="admin-table-video">
                    <div className="admin-table-thumb">
                      {v.thumbnailUrl
                        ? <img src={v.thumbnailUrl} alt={v.title} />
                        : <div className="admin-table-thumb-fallback">🎬</div>
                      }
                    </div>
                    <div className="admin-table-info">
                      <Link to={`/watch/${v._id}`} className="admin-table-title">{v.title}</Link>
                      {v.category && <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{v.category}</span>}
                    </div>
                  </div>
                  <span className="admin-table-cell">{(v.views || 0).toLocaleString()}</span>
                  <span className="admin-table-cell">{(v.likeCount || 0).toLocaleString()}</span>
                  <span className="admin-table-cell admin-table-date">
                    {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : '—'}
                  </span>
                  <div className="admin-table-actions">
                    <Link to={`/watch/${v._id}`} className="btn-ghost" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                      View
                    </Link>
                    <button
                      className="btn-danger"
                      style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                      onClick={() => handleDelete(v._id, v.title)}
                      disabled={deleting === v._id}
                    >
                      {deleting === v._id ? <span className="spinner spinner-sm" /> : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
