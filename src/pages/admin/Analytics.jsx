import React, { useState, useEffect } from 'react';
import { videoAPI } from '../../utils/api';
import '../admin/Admin.css';
import './Analytics.css';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    avgViews: 0,
    engagementRate: 0,
    topVideos: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await videoAPI.analytics();
        setAnalytics(data.analytics || {
          totalVideos: 0,
          totalViews: 0,
          totalLikes: 0,
          avgViews: 0,
          engagementRate: 0,
          topVideos: [],
          categories: [],
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fmt = (n) => {
    if (n >= 1_000_000) return `${(n/1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n/1_000).toFixed(1)}K`;
    return (n || 0).toString();
  };

  const maxViews = analytics.topVideos[0]?.views || 1;
  const maxCat = analytics.categories[0]?.count || 1;

  return (
    <div className="admin-page analytics-page">
      <div className="admin-page__container">
        <div className="admin-page__header animate-fadeInUp">
          <div>
            <div className="badge badge-gold" style={{ marginBottom: 10 }}>⚡ Admin</div>
            <h1 className="admin-page__title">Analytics <span className="text-accent">Overview</span></h1>
            <p className="admin-page__sub">Platform performance and insights</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="analytics-kpis animate-fadeInUp delay-100">
          {[
            { label: 'Total Videos',   value: fmt(analytics.totalVideos), icon: '🎬', color: 'var(--accent-primary)' },
            { label: 'Total Views',    value: fmt(analytics.totalViews),    icon: '👁️',  color: '#6495ed' },
            { label: 'Total Likes',    value: fmt(analytics.totalLikes),    icon: '❤️',  color: 'var(--accent-gold)' },
            { label: 'Avg Views/Video',value: fmt(analytics.avgViews),      icon: '📊',  color: '#2abc77' },
          ].map((kpi, i) => (
            <div key={kpi.label} className="analytics-kpi animate-fadeInUp" style={{ animationDelay: `${i*0.1}s`, borderColor: kpi.color + '30' }}>
              <div className="analytics-kpi__icon" style={{ background: kpi.color + '18', color: kpi.color }}>{kpi.icon}</div>
              <div>
                <div className="analytics-kpi__value">{loading ? '—' : kpi.value}</div>
                <div className="analytics-kpi__label">{kpi.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="analytics-grid">
          {/* Top Videos by Views */}
          <div className="analytics-card animate-fadeInUp delay-200">
            <h3 className="analytics-card__title">
              <span>🏆</span> Top Videos by Views
            </h3>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 44, borderRadius: 8 }} />)}
              </div>
            ) : analytics.topVideos.length === 0 ? (
              <p className="analytics-empty">No video data yet</p>
            ) : (
              <div className="analytics-bar-list">
                {analytics.topVideos.map((v, i) => (
                  <div key={v._id} className="analytics-bar-item animate-fadeInUp" style={{ animationDelay: `${i*0.08}s` }}>
                    <div className="analytics-bar-item__meta">
                      <span className="analytics-bar-item__rank">#{i+1}</span>
                      <span className="analytics-bar-item__title">{v.title}</span>
                      <span className="analytics-bar-item__views">{fmt(v.views || 0)}</span>
                    </div>
                    <div className="analytics-bar-wrap">
                      <div
                        className="analytics-bar"
                        style={{
                          width: `${((v.views || 0) / maxViews) * 100}%`,
                          background: i === 0 ? 'linear-gradient(90deg, var(--accent-primary), var(--accent-gold))' : 'var(--accent-primary)'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="analytics-card animate-fadeInUp delay-300">
            <h3 className="analytics-card__title">
              <span>🎭</span> Videos by Category
            </h3>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 44, borderRadius: 8 }} />)}
              </div>
            ) : analytics.categories.length === 0 ? (
              <p className="analytics-empty">No category data yet</p>
            ) : (
              <div className="analytics-bar-list">
                {analytics.categories.map(({ name, count }, i) => (
                  <div key={name} className="analytics-bar-item animate-fadeInUp" style={{ animationDelay: `${i*0.07}s` }}>
                    <div className="analytics-bar-item__meta">
                      <span className="analytics-bar-item__title">{name}</span>
                      <span className="analytics-bar-item__views">{count} video{count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="analytics-bar-wrap">
                      <div className="analytics-bar" style={{ width: `${(count / maxCat) * 100}%`, background: '#6495ed' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="analytics-card analytics-card--wide animate-fadeInUp delay-400">
          <h3 className="analytics-card__title"><span>💡</span> Insights</h3>
          <div className="analytics-insights">
            <div className="analytics-insight">
              <span className="analytics-insight__icon">📈</span>
              <div>
                <strong>Engagement Rate</strong>
                <p>{analytics.engagementRate}% of viewers liked content</p>
              </div>
            </div>
            <div className="analytics-insight">
              <span className="analytics-insight__icon">🎯</span>
              <div>
                <strong>Top Category</strong>
                <p>{analytics.categories[0]?.name || 'None'} with {analytics.categories[0]?.count || 0} videos</p>
              </div>
            </div>
            <div className="analytics-insight">
              <span className="analytics-insight__icon">⭐</span>
              <div>
                <strong>Most Viewed</strong>
                <p>{analytics.topVideos[0]?.title || 'No data'} ({fmt(analytics.topVideos[0]?.views || 0)} views)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
