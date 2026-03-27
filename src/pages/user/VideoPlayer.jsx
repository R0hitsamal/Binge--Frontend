import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Hls from 'hls.js';
import { videoAPI, commentAPI, historyAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import VideoCard from '../../components/common/VideoCard';
import './VideoPlayer.css';

const commentValidationSchema = Yup.object().shape({
  text: Yup.string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment must be less than 500 characters')
    .required('Comment is required'),
});

const formatTime = (secs) => {
  if (!secs) return '0:00';
  const m = Math.floor(secs / 60), s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const VideoPlayer = () => {
  const { videoId } = useParams();
  const { isAuth, user } = useAuth();
  const navigate = useNavigate();
  const videoRef  = useRef(null);
  const hlsRef    = useRef(null);

  const [video, setVideo]           = useState(null);
  const [related, setRelated]       = useState([]);
  const [comments, setComments]     = useState([]);
  const [liked, setLiked]           = useState(false);
  const [loading, setLoading]       = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [error, setError]           = useState('');

  const commentFormik = useFormik({
    initialValues: { text: '' },
    validationSchema: commentValidationSchema,
    onSubmit: async (values) => {
      if (!isAuth) { navigate('/login'); return; }
      setCommentLoading(true);
      try {
        await commentAPI.add(videoId, { text: values.text, comment: values.text });
        commentFormik.resetForm();
        await loadComments();
      } catch (err) {
        alert(err?.response?.data?.message || 'Could not post comment.');
      } finally { setCommentLoading(false); }
    },
  });

  // Load video
  const loadVideo = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data } = await videoAPI.getById(videoId);
      setVideo(data.video || data);
      // Add to watch history
      if (isAuth) {
        historyAPI.add(videoId).catch(() => {});
      }
    } catch {
      setError('Video not found or unavailable.');
    } finally { setLoading(false); }
  }, [videoId, isAuth]);

  const loadComments = useCallback(async () => {
    try {
      const { data } = await commentAPI.get(videoId);
      const comments = data.data || data.comments || data;
      setComments(Array.isArray(comments) ? comments : []);
    } catch { setComments([]); }
  }, [videoId]);

  const loadRelated = useCallback(async () => {
    try {
      const { data } = await videoAPI.getAll({ limit: 6 });
      const all = data.videos || data || [];
      setRelated(all.filter(v => v._id !== videoId).slice(0, 5));
    } catch {}
  }, [videoId]);

  useEffect(() => {
    loadVideo(); loadComments(); loadRelated();
  }, [loadVideo, loadComments, loadRelated]);

  // Setup HLS player
  useEffect(() => {
    if (!video?.videoUrl || !videoRef.current) return;
    const url = video.videoUrl;

    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }

    if (url.includes('.m3u8') && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);
      hlsRef.current = hls;
    } else {
      videoRef.current.src = url;
    }

    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } };
  }, [video]);

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await commentAPI.delete(videoId, commentId);
      await loadComments();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Could not delete comment');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const handleLike = () => {
    if (!isAuth) { navigate('/login'); return; }
    setLiked(l => !l);
  };

  if (loading) return (
    <div className="vp-loading">
      <div className="spinner" />
      <p>Loading video...</p>
    </div>
  );

  if (error) return (
    <div className="vp-error">
      <div className="vp-error__icon">🎬</div>
      <h2>Oops!</h2>
      <p>{error}</p>
      <Link to="/browse" className="btn-primary">Browse Videos</Link>
    </div>
  );

  if (!video) return null;

  return (
    <div className="vp">
      <div className="vp__layout">
        {/* Main Column */}
        <div className="vp__main">
          {/* Player */}
          <div className="vp__player-wrap animate-fadeIn">
            <video
              ref={videoRef}
              className="vp__player"
              controls
              playsInline
              poster={video.thumbnailUrl}
            />
          </div>

          {/* Video Info */}
          <div className="vp__info animate-fadeInUp delay-100">
            {video.category && <span className="badge badge-primary" style={{ marginBottom: 10 }}>{video.category}</span>}
            <h1 className="vp__title">{video.title}</h1>

            <div className="vp__meta-row">
              <div className="vp__stats">
                {video.views !== undefined && (
                  <span className="vp__stat">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    {(video.views || 0).toLocaleString()} views
                  </span>
                )}
                {video.createdAt && (
                  <span className="vp__stat vp__stat--dot">
                    {new Date(video.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                )}
              </div>

              <div className="vp__actions">
                <button
                  className={`vp__action-btn ${liked ? 'vp__action-btn--active' : ''}`}
                  onClick={handleLike}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill={liked ? 'var(--accent-primary)' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {liked ? 'Liked' : 'Like'}
                  {video.likeCount !== undefined && ` (${video.likeCount + (liked ? 1 : 0)})`}
                </button>

                <button className="vp__action-btn" onClick={handleShare}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  Share
                </button>
              </div>
            </div>

            {shareToast && (
              <div className="vp__share-toast animate-fadeInUp">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Link copied to clipboard!
              </div>
            )}
          </div>

          {/* Uploader + Description */}
          {(video.uploader || video.description) && (
            <div className="vp__desc-box animate-fadeInUp delay-200">
              {video.uploader && (
                <div className="vp__uploader">
                  <div className="vp__uploader-avatar">
                    {(video.uploader?.username || video.uploader?.name || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <span className="vp__uploader-name">{video.uploader?.username || video.uploader?.name}</span>
                    <span className="vp__uploader-label">Creator</span>
                  </div>
                </div>
              )}
              {video.description && (
                <p className="vp__description">{video.description}</p>
              )}
            </div>
          )}

          {/* Comments */}
          <div className="vp__comments animate-fadeInUp delay-300">
            <h3 className="vp__section-title">
              Comments
              <span className="vp__comment-count">{comments.length}</span>
            </h3>

            {isAuth ? (
              <form className="vp__comment-form" onSubmit={commentFormik.handleSubmit}>
                <div className="vp__comment-avatar">
                  {(user?.username || user?.name || 'U')[0].toUpperCase()}
                </div>
                <div className="vp__comment-input-wrap">
                  <textarea
                    name="text"
                    value={commentFormik.values.text}
                    onChange={commentFormik.handleChange}
                    onBlur={commentFormik.handleBlur}
                    placeholder="Share your thoughts..."
                    className={`form-input vp__comment-textarea ${commentFormik.touched.text && commentFormik.errors.text ? 'form-input--error' : ''}`}
                    rows={2}
                  />
                  {commentFormik.touched.text && commentFormik.errors.text && (
                    <span className="form-error">{commentFormik.errors.text}</span>
                  )}
                  <div className="vp__comment-actions">
                    <button type="button" className="btn-ghost" onClick={() => commentFormik.resetForm()}>Cancel</button>
                    <button type="submit" className="btn-primary" disabled={commentFormik.isSubmitting || !commentFormik.values.text.trim()}
                      style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                      {commentFormik.isSubmitting ? <span className="spinner spinner-sm" /> : 'Post'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="vp__comment-login">
                <Link to="/login" className="btn-secondary">Sign in to comment</Link>
              </div>
            )}

            <div className="vp__comment-list">
              {comments.length === 0 ? (
                <div className="vp__comment-empty">
                  <p>No comments yet. Be the first!</p>
                </div>
              ) : (
                comments.map((c, i) => (
                  <div key={c._id || i} className="vp__comment animate-fadeInUp" style={{ animationDelay: `${i*0.05}s` }}>
                    <div className="vp__comment-user-avatar">
                      {(c.userId?.username || c.username || 'U')[0].toUpperCase()}
                    </div>
                    <div className="vp__comment-body">
                      <div className="vp__comment-header">
                        <span className="vp__comment-name">{c.userId?.username || c.username || 'User'}</span>
                        {c.createdAt && (
                          <span className="vp__comment-time">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="vp__comment-text">{c.text || c.comment}</p>
                      {(isAuth && (user?._id === c.userId?._id || user?.role === 'admin')) && (
                        <button className="vp__comment-delete" onClick={() => handleDeleteComment(c._id)}>Delete</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Related Videos */}
        <div className="vp__sidebar">
          <h3 className="vp__section-title" style={{ marginBottom: 16 }}>Up Next</h3>
          <div className="vp__related">
            {related.map((v, i) => (
              <Link key={v._id} to={`/watch/${v._id}`} className="vp__related-card animate-slideLeft" style={{ animationDelay: `${i*0.08}s` }}>
                <div className="vp__related-thumb">
                  {v.thumbnailUrl
                    ? <img src={v.thumbnailUrl} alt={v.title} />
                    : <div className="vp__related-thumb-fallback" />
                  }
                  <div className="vp__related-play">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  </div>
                </div>
                <div className="vp__related-info">
                  <span className="vp__related-title">{v.title}</span>
                  {v.uploader && <span className="vp__related-uploader">{v.uploader?.username}</span>}
                  {v.views !== undefined && (
                    <span className="vp__related-views">{(v.views || 0).toLocaleString()} views</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
