import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { videoAPI } from '../../utils/api';
import './UploadVideo.css';

const CATEGORIES = ['Action', 'Drama', 'Comedy', 'Thriller', 'Documentary', 'Sci-Fi', 'Horror', 'Romance', 'Other'];

const uploadValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .required('Description is required'),
  category: Yup.string()
    .required('Category is required'),
});

const UploadVideo = () => {
  const navigate = useNavigate();
  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  const [videoFile, setVideoFile]   = useState(null);
  const [thumbFile, setThumbFile]   = useState(null);
  const [thumbPreview, setThumb]    = useState('');
  const [progress, setProgress]     = useState(0);
  const [uploading, setUploading]   = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState('');
  const [dragOver, setDragOver]     = useState(false);

  const formik = useFormik({
    initialValues: { title: '', description: '', category: '' },
    validationSchema: uploadValidationSchema,
    onSubmit: async (values) => {
      if (!videoFile) { setError('Please select a video file.'); return; }
      setError(''); setUploading(true); setProgress(0);

      const fd = new FormData();
      
      fd.append('video', videoFile);
      fd.append('title', values.title);
      fd.append('description', values.description);
      fd.append('category', values.category);
      if (thumbFile) fd.append('thumbnail', thumbFile);
      
      console.log('FormData entries:');
      for (let pair of fd.entries()) {
        console.log(`  ${pair[0]}:`, pair[1] instanceof File ? `File(${pair[1].name})` : pair[1]);
      }
      
      try {
        const response = await videoAPI.upload(fd, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(percentCompleted);
            }
          }
        });
        console.log('✓ Upload response:', response.data);
        setSuccess(true);
        setTimeout(() => navigate('/admin'), 1800);
      } catch (err) {
        console.error('❌ Upload error:', err.response?.data || err.message);
        setError(err?.response?.data?.message || 'Upload failed. Please try again.');
      } finally { setUploading(false); }
    }
  });

  const handleVideo = (file) => {
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setError('');
    } else {
      setError('Please select a valid video file.');
    }
  };

  const handleThumb = (file) => {
    if (file && file.type.startsWith('image/')) {
      setThumbFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setThumb(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleVideo(file);
  };

  return (
    <div className="upload-page">
      <div className="upload-page__container">
        <div className="upload-page__header animate-fadeInUp">
          <div className="badge badge-gold">⚡ Admin</div>
          <h1 className="upload-page__title">Upload <span className="text-accent">Video</span></h1>
          <p className="upload-page__sub">Add new content to the platform</p>
        </div>

        {success ? (
          <div className="upload-success animate-scaleIn">
            <div className="upload-success__icon">🎉</div>
            <h2>Video Uploaded Successfully!</h2>
            <p>Redirecting to dashboard...</p>
            <div className="spinner" style={{ marginTop: 20 }} />
          </div>
        ) : (
          <form className="upload-form animate-fadeInUp delay-100" onSubmit={formik.handleSubmit}>
            <div className="upload-form__grid">
              {/* Left Column */}
              <div className="upload-form__left">
                {/* Video Dropzone */}
                <div
                  className={`upload-dropzone ${dragOver ? 'upload-dropzone--over' : ''} ${videoFile ? 'upload-dropzone--filled' : ''}`}
                  onClick={() => videoInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                >
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleVideo(e.target.files[0])}
                  />
                  {videoFile ? (
                    <div className="upload-dropzone__filled">
                      <div className="upload-dropzone__file-icon">🎬</div>
                      <div className="upload-dropzone__file-info">
                        <span className="upload-dropzone__file-name">{videoFile.name}</span>
                        <span className="upload-dropzone__file-size">{(videoFile.size / (1024*1024)).toFixed(1)} MB</span>
                      </div>
                      <button type="button" className="upload-dropzone__change" onClick={(e) => { e.stopPropagation(); setVideoFile(null); }}>Change</button>
                    </div>
                  ) : (
                    <>
                      <div className="upload-dropzone__icon">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                      </div>
                      <p className="upload-dropzone__main">Drag & drop your video here</p>
                      <p className="upload-dropzone__sub">or click to browse • MP4, MOV, AVI, MKV, M3U8</p>
                    </>
                  )}
                </div>

                {/* Upload Progress */}
                {uploading && (
                  <div className="upload-progress animate-fadeInUp">
                    <div className="upload-progress__bar-wrap">
                      <div className="upload-progress__bar" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="upload-progress__text">Uploading... {progress}%</span>
                  </div>
                )}

                {/* Thumbnail */}
                <div className="upload-thumb-section">
                  <label className="form-label">Thumbnail (optional)</label>
                  <div
                    className="upload-thumb-picker"
                    onClick={() => thumbInputRef.current?.click()}
                    style={{ backgroundImage: thumbPreview ? `url(${thumbPreview})` : 'none' }}
                  >
                    <input
                      ref={thumbInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleThumb(e.target.files[0])}
                    />
                    {!thumbPreview && (
                      <div className="upload-thumb-picker__placeholder">
                        <span style={{ fontSize: '2rem' }}>🖼️</span>
                        <span>Click to add thumbnail</span>
                      </div>
                    )}
                    {thumbPreview && (
                      <div className="upload-thumb-picker__overlay">Change Image</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="upload-form__right">
                {error && (
                  <div className="alert alert-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={formik.values.title} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter a compelling title..." 
                    className={`form-input ${formik.touched.title && formik.errors.title ? 'form-input--error' : ''}`}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <span className="form-error">{formik.errors.title}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea 
                    name="description" 
                    value={formik.values.description} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Describe your video..." 
                    className={`form-input ${formik.touched.description && formik.errors.description ? 'form-input--error' : ''}`}
                    rows={5}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <span className="form-error">{formik.errors.description}</span>
                  )}
                </div>

                <div className="upload-form__row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select 
                      name="category" 
                      value={formik.values.category} 
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`form-input ${formik.touched.category && formik.errors.category ? 'form-input--error' : ''}`}
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {formik.touched.category && formik.errors.category && (
                      <span className="form-error">{formik.errors.category}</span>
                    )}
                  </div>
                </div>

                <div className="upload-form__actions">
                  <button type="button" className="btn-secondary" onClick={() => navigate('/admin')}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={uploading || !videoFile || formik.isSubmitting}>
                    {uploading ? (
                      <><span className="spinner spinner-sm" /> Uploading {progress}%</>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        Publish Video
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UploadVideo;
