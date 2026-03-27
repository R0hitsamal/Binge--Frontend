import React, { useState, useEffect } from 'react';
import { authAPI } from '../../utils/api';
import './ManageUsers.css';
import '../admin/Admin.css';

const ManageUsers = () => {
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [profileRes, usersRes] = await Promise.all([
          authAPI.profile(),
          authAPI.getAll()
        ]);
        setProfile(profileRes.data.user || profileRes.data);
        setUsers(usersRes.data.users || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="admin-page manage-users">
      <div className="admin-page__container">
        <div className="admin-page__header animate-fadeInUp">
          <div>
            <div className="badge badge-gold" style={{ marginBottom: 10 }}>⚡ Admin</div>
            <h1 className="admin-page__title">Manage <span className="text-accent">Users</span></h1>
            <p className="admin-page__sub">View and manage platform members</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mu-stats animate-fadeInUp delay-100">
          <div className="mu-stat">
            <span className="mu-stat__num">{users.length}</span>
            <span className="mu-stat__label">Total Users</span>
          </div>
          <div className="mu-stat">
            <span className="mu-stat__num">{users.filter(u => u.role === 'admin').length}</span>
            <span className="mu-stat__label">Admins</span>
          </div>
          <div className="mu-stat">
            <span className="mu-stat__num">{users.length}</span>
            <span className="mu-stat__label">Active</span>
          </div>
          <div className="mu-stat">
            <span className="mu-stat__num">0</span>
            <span className="mu-stat__label">Suspended</span>
          </div>
        </div>

        {/* My Profile Card */}
        {profile && (
          <div className="mu-profile-card animate-fadeInUp delay-200">
            <div className="mu-profile-card__header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Your Profile
            </div>
            <div className="mu-profile-card__body">
              <div className="mu-profile-avatar">
                {(profile.username || profile.name || 'A')[0].toUpperCase()}
              </div>
              <div className="mu-profile-info">
                <span className="mu-profile-name">{profile.username || profile.name}</span>
                <span className="mu-profile-email">{profile.email}</span>
                <span className="badge badge-gold" style={{ marginTop: 6, alignSelf: 'flex-start' }}>⚡ {profile.role || 'Admin'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="animate-fadeInUp delay-300" style={{ marginTop: 32 }}>
          <div className="section-heading">
            <h2>All Users</h2>
            <div className="accent-line" />
          </div>

          <div className="mu-table">
            <div className="mu-table__header">
              <span>User</span>
              <span>Role</span>
              <span>Joined</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {users.length > 0 ? (
              users.map((u, i) => (
                <div key={u._id} className="mu-table__row animate-fadeInUp" style={{ animationDelay: `${i*0.05}s` }}>
                  <div className="mu-user-cell">
                    <div className="mu-user-avatar" style={{ background: u.role === 'admin' ? 'linear-gradient(135deg, var(--accent-gold), var(--accent-primary))' : 'linear-gradient(135deg, var(--accent-primary), var(--accent-purple))' }}>
                      {(u.username || u.name || 'U')[0].toUpperCase()}
                    </div>
                    <div className="mu-user-info">
                      <span className="mu-user-name">{u.username || u.name}</span>
                      <span className="mu-user-email">{u.email}</span>
                    </div>
                  </div>
                  <span>
                    <span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-purple'}`}>
                      {u.role === 'admin' ? '⚡ Admin' : '👤 User'}
                    </span>
                  </span>
                  <span className="mu-date">{new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  <span>
                    <span className="badge badge-green">active</span>
                  </span>
                  <div className="mu-actions">
                    <button className="btn-danger" style={{ padding: '5px 12px', fontSize: '0.75rem' }} onClick={() => alert('Suspend action (connect to backend)')}>Suspend</button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                {loading ? 'Loading users...' : 'No users found'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
