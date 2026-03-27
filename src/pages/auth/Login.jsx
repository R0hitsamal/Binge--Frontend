import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import BingeLogo from "../../components/common/BingeLogo";
import "./Auth.css";

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      setError("");
      try {
        const user = await login(values);
        navigate(user?.role === "admin" ? "/admin" : "/browse");
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Invalid credentials. Please try again.",
        );
      }
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg__orb auth-bg__orb--1" />
        <div className="auth-bg__orb auth-bg__orb--2" />
      </div>

      <div className="auth-card animate-scaleIn">
        <div className="auth-card__logo">
          <BingeLogo size={42} animate />
        </div>

        <div className="auth-card__header">
          <h1 className="auth-card__title">Welcome back</h1>
          <p className="auth-card__subtitle">Sign in to continue your binge</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="auth-form">
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

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
              className={`form-input ${formik.touched.password && formik.errors.password ? 'form-input--error' : ''}`}
            />
            {formik.touched.password && formik.errors.password && (
              <span className="form-error">{formik.errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <>
                <span className="spinner spinner-sm" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-card__footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-card__link">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
