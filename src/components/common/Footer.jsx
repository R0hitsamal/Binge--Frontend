import React from 'react';
import { Link } from 'react-router-dom';
import BingeLogo from './BingeLogo';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer__inner">
      <div className="footer__top">
        <div className="footer__brand">
          <BingeLogo size={32} />
          <p className="footer__tagline">Stream Everything Worth Watching</p>
          <p className="footer__desc">
            Your ultimate destination for unlimited video content. Discover, watch, and share the best videos from around the world.
          </p>
        </div>

        <div className="footer__links-group">
          <h4 className="footer__group-title">Platform</h4>
          <Link to="/browse" className="footer__link">Browse Videos</Link>
          <Link to="/login" className="footer__link">Sign In</Link>
          <Link to="/register" className="footer__link">Join Free</Link>
        </div>

        <div className="footer__links-group">
          <h4 className="footer__group-title">Admin</h4>
          <div style={{display:'flex', gap:4, alignItems : "center"}}>
         
            <a href="https://rohitkumarsamal.vercel.app/" target='blank' className="footer__link"> <p >Rohit Kumar Samal</p></a>
          </div>
          <h4 className="footer__group-title">Admin Access </h4>
          <Link to="/admin" className="footer__link">Dashboard</Link>
          <Link to="/admin/upload" className="footer__link">Upload Video</Link>
          <Link to="/admin/analytics" className="footer__link">Analytics</Link>
          <Link to="/admin/users" className="footer__link">Manage Users</Link>
        </div>

        <div className="footer__links-group">
          <h4 className="footer__group-title">Account</h4>
          <Link to="/history" className="footer__link">Watch History</Link>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copy">© {new Date().getFullYear()} Binge. All rights reserved.</p>
        <div className="footer__bottom-links">
          <span className="footer__bottom-link">Privacy Policy</span>
          <span className="footer__bottom-link">Terms of Service</span>
          <span className="footer__bottom-link">Cookie Policy</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
