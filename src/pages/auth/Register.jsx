import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import BingeLogo from '../../components/common/BingeLogo';
import './Auth.css';

const registerValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formik = useFormik({
    initialValues: { username: '', email: '', password: '', confirm: '' },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      setError(''); setSuccess('');
      try {
        await register({ username: values.username, email: values.email, password: values.password });
        setSuccess('Account created! Redirecting...');
        setTimeout(() => navigate('/browse'), 1200);
      } catch (err) {
        setError(err?.response?.data?.message || 'Registration failed. Try a different email.');
      }
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg__orb auth-bg__orb--1" />
        <div className="auth-bg__orb auth-bg__orb--2" />
      </div>

      <div className="auth-card auth-card--wide animate-scaleIn">
        <div className="auth-card__logo">
          <BingeLogo size={42} animate />
        </div>

        <div className="auth-card__header">
          <h1 className="auth-card__title">Join Binge</h1>
          <p className="auth-card__subtitle">Create your free account today</p>
        </div>

        {error   && <div className="alert alert-error"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</div>}
        {success && <div className="alert alert-success"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>{success}</div>}

        <form onSubmit={formik.handleSubmit} className="auth-form">
          <div className="auth-form__row">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                name="username" 
                value={formik.values.username} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="coolbinger" 
                className={`form-input ${formik.touched.username && formik.errors.username ? 'form-input--error' : ''}`}
              />
              {formik.touched.username && formik.errors.username && (
                <span className="form-error">{formik.errors.username}</span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formik.values.email} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="you@example.com" 
                className={`form-input ${formik.touched.email && formik.errors.email ? 'form-input--error' : ''}`}
              />
              {formik.touched.email && formik.errors.email && (
                <span className="form-error">{formik.errors.email}</span>
              )}
            </div>
          </div>

          <div className="auth-form__row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                name="password" 
                value={formik.values.password} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Min. 6 characters" 
                className={`form-input ${formik.touched.password && formik.errors.password ? 'form-input--error' : ''}`}
              />
              {formik.touched.password && formik.errors.password && (
                <span className="form-error">{formik.errors.password}</span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input 
                type="password" 
                name="confirm" 
                value={formik.values.confirm} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Repeat password" 
                className={`form-input ${formik.touched.confirm && formik.errors.confirm ? 'form-input--error' : ''}`}
              />
              {formik.touched.confirm && formik.errors.confirm && (
                <span className="form-error">{formik.errors.confirm}</span>
              )}
            </div>
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? <><span className="spinner spinner-sm" /> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <div className="auth-card__footer">
          <p>Already have an account? <Link to="/login" className="auth-card__link">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
