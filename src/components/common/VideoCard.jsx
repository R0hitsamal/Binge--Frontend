import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './VideoCard.css';

const formatDuration = (secs) => {
  if (!secs) return '';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const formatViews = (n) => {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
};

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 30) return `${Math.floor(d/30)}mo ago`;
  if (d > 0)  return `${d}d ago`;
  if (h > 0)  return `${h}h ago`;
  return `${m}m ago`;
};

const VideoCard = ({ video, onDelete, isAdmin, style }) => {
  const [hovered, setHovered] = useState(false);
  const [imgErr, setImgErr]   = useState(false);

  if (!video) return null;

  const {
    _id, title, description, thumbnailUrl, duration,
    views, likeCount, category, createdAt, uploader
  } = video;

  return (
    <div
      className={`video-card ${hovered ? 'video-card--hovered' : ''}`}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <Link to={`/watch/${_id}`} className="video-card__thumb-wrap">
        {!imgErr && thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="video-card__thumb"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="video-card__thumb-fallback">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        )}
        {/* Play Overlay */}
        <div className="video-card__overlay">
          <div className="video-card__play-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
        {/* Duration badge */}
        {duration && (
          <div className="video-card__duration">{formatDuration(duration)}</div>
        )}
        {/* Category badge */}
        {category && (
          <div className="video-card__category">{category}</div>
        )}
      </Link>

      {/* Info */}
      <div className="video-card__info">
        <Link to={`/watch/${_id}`} className="video-card__title" title={title}>
          {title}
        </Link>
        {description && (
          <p className="video-card__desc">{description}</p>
        )}
        <div className="video-card__meta">
          {uploader?.username && (
            <span className="video-card__uploader">{uploader.username}</span>
          )}
          <div className="video-card__stats">
            {views !== undefined && (
              <span className="video-card__stat">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                {formatViews(views)}
              </span>
            )}
            {likeCount !== undefined && (
              <span className="video-card__stat">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {formatViews(likeCount)}
              </span>
            )}
            <span className="video-card__stat video-card__time">{timeAgo(createdAt)}</span>
          </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && onDelete && (
          <div className="video-card__admin-actions">
            <button
              className="video-card__delete-btn"
              onClick={() => onDelete(_id, title)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
