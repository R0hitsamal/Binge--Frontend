import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';
import Navbar  from './components/common/Navbar';
import Footer  from './components/common/Footer';

// Pages
import Home          from './pages/user/Home';
import Login         from './pages/auth/Login';
import Register      from './pages/auth/Register';
import Browse        from './pages/user/Browse';
import VideoPlayer   from './pages/user/VideoPlayer';
import WatchHistory  from './pages/user/WatchHistory';
import AdminDashboard from './pages/admin/AdminDashboard';
import UploadVideo   from './pages/admin/UploadVideo';
import ManageUsers   from './pages/admin/ManageUsers';
import Analytics     from './pages/admin/Analytics';

import './styles/global.css';

const Layout = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Navbar />
    <main style={{ flex: 1 }}>{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Public */}
            <Route path="/"          element={<Home />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />
            <Route path="/browse"    element={<Browse />} />
            <Route path="/watch/:videoId" element={<VideoPlayer />} />

            {/* Protected (user) */}
            <Route path="/history" element={
              <ProtectedRoute><WatchHistory /></ProtectedRoute>
            } />

            {/* Admin */}
            <Route path="/admin" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
            <Route path="/admin/upload" element={
              <AdminRoute><UploadVideo /></AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute><ManageUsers /></AdminRoute>
            } />
            <Route path="/admin/analytics" element={
              <AdminRoute><Analytics /></AdminRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
