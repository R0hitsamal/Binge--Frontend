import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { videoAPI } from '../../utils/api';
import VideoCard from '../../components/common/VideoCard';
import './Browse.css';

const CATEGORIES = ['All', 'Action', 'Drama', 'Comedy', 'Thriller', 'Documentary', 'Sci-Fi', 'Horror', 'Romance', "Sports"];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Viewed' },
  { value: 'liked', label: 'Most Liked' },
];

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort]         = useState('newest');
  const [inputVal, setInputVal] = useState(search);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;
      if (sort)   params.sort = sort;
      const { data } = await videoAPI.getAll(params);
      setVideos(data.videos || data || []);
    } catch {
      setVideos([]);
    } finally { setLoading(false); }
  }, [search, category, sort]);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(inputVal);
    const p = {};
    if (inputVal) p.search = inputVal;
    if (category !== 'All') p.category = category;
    setSearchParams(p);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    const p = {};
    if (search) p.search = search;
    if (cat !== 'All') p.category = cat;
    setSearchParams(p);
  };

  return (
    <div className="browse">
      <br />
      <br /><br /><br />

      <div className="browse__container">
        {/* Filters Row */}
        <div className="browse__filters animate-fadeInUp delay-200">
          <div className="browse__categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`browse__cat-btn ${category === cat ? 'browse__cat-btn--active' : ''}`}
                onClick={() => handleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="browse__sort">
            <label className="browse__sort-label">Sort by</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="browse__sort-select"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results info */}
        <div className="browse__results-info">
          {!loading && (
            <span>
              {videos.length} video{videos.length !== 1 ? 's' : ''}
              {search && <> for "<strong>{search}</strong>"</>}
              {category !== 'All' && <> in <strong>{category}</strong></>}
            </span>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid-videos">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 280, borderRadius: 'var(--radius-lg)', animationDelay: `${i*0.04}s` }} />
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid-videos">
            {videos.map((video, i) => (
              <VideoCard
                key={video._id}
                video={video}
                style={{ animationDelay: `${i * 0.06}s` }}
              />
            ))}
          </div>
        ) : (
          <div className="browse__empty">
            <div className="browse__empty-icon">🎬</div>
            <h3>No videos found</h3>
            <p>Try a different search term or category</p>
            <button className="btn-secondary" onClick={() => { setSearch(''); setInputVal(''); setCategory('All'); setSearchParams({}); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
