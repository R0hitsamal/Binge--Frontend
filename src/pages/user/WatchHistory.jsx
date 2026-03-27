import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { historyAPI } from "../../utils/api";
import VideoCard from "../../components/common/VideoCard";
import "./History.css";

const WatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await historyAPI.get();
      const historyData = data.data || data.history || data || [];
      setHistory(Array.isArray(historyData) ? historyData : []);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleRemove = async (videoId) => {
    setDeleting(videoId);
    try {
      await historyAPI.remove(videoId);
      setHistory((h) =>
        h.filter((item) => (item.video?._id || item._id) !== videoId),
      );
      loadHistory();
    } catch {
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="history-page">
      <div className="history-page__container">
        <div className="history-page__header animate-fadeInUp">
          <div>
            <h1 className="history-page__title">
              Watch <span className="text-accent">History</span>
            </h1>
            <p className="history-page__sub">Pick up where you left off</p>
          </div>
          {history.length > 0 && (
            <span className="badge badge-primary">
              {history.length} video{history.length !== 1 ? "s" : ""}
            </span>
          )}
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
                    height: 280,
                    borderRadius: "var(--radius-lg)",
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
          </div>
        ) : history.length === 0 ? (
          <div className="history-page__empty animate-scaleIn">
            <div className="history-page__empty-icon">🕐</div>
            <h2>No watch history yet</h2>
            <p>Videos you watch will appear here</p>
            <Link
              to="/browse"
              className="btn-primary"
              style={{ marginTop: 16 }}
            >
              Start Browsing
            </Link>
          </div>
        ) : (
          <div className="grid-videos">
            {history.map((item, i) => {
              const video = item.videoId || item;
              return (
                <div
                  key={video._id || i}
                  className="history-card-wrap animate-fadeInUp"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <VideoCard video={video} />
                  <button
                    className="history-remove-btn"
                    onClick={() => handleRemove(item.videoId?._id || video._id)}
                    disabled={deleting === (item.videoId?._id || video._id)}
                    title="Remove from history"
                  >
                    {deleting === video._id ? (
                      <span className="spinner spinner-sm" />
                    ) : (
                      <>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Remove
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchHistory;
