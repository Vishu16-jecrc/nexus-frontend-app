import React, { useState, useEffect } from 'react';
import Scene3D from './components/Scene3D';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminConsole from './components/AdminConsole';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [adminToken, setAdminToken] = useState('');

  const getParamView = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') || 'hub';
  };

  const [currentView, setCurrentView] = useState(getParamView);

  // Check if a session was previously saved in sessionStorage
  useEffect(() => {
    const cachedUser = sessionStorage.getItem('nexus_current_user');
    const cachedIsAdmin = sessionStorage.getItem('nexus_is_admin') === 'true';
    const cachedAdminToken = sessionStorage.getItem('nexus_admin_token');

    if (cachedUser) {
      setIsLoggedIn(true);
      setCurrentUser(cachedUser);
      setIsAdmin(cachedIsAdmin);
      if (cachedIsAdmin && cachedAdminToken) {
        setAdminToken(cachedAdminToken);
      }
    }
  }, []);

  // Sync state with browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getParamView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (viewName) => {
    setCurrentView(viewName);
    const newUrl = viewName === 'hub' ? window.location.pathname : `?view=${viewName}`;
    window.history.pushState({}, '', newUrl);
  };

  const handleLoginSuccess = ({ username, token, isAdmin }) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
    setIsAdmin(isAdmin);
    
    sessionStorage.setItem('nexus_current_user', username);
    sessionStorage.setItem('nexus_is_admin', isAdmin ? 'true' : 'false');

    if (isAdmin) {
      setAdminToken(token);
      sessionStorage.setItem('nexus_admin_token', token);
    }
    // Set view to url query parameter or default to hub
    setCurrentView(getParamView());
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentUser('');
    setAdminToken('');
    setCurrentView('hub');
    
    sessionStorage.removeItem('nexus_current_user');
    sessionStorage.removeItem('nexus_is_admin');
    sessionStorage.removeItem('nexus_admin_token');
  };

  return (
    <>
      {/* 3D ML & DSA Background Canvas - changes based on current workspace view */}
      <Scene3D view={isLoggedIn && !isAdmin ? currentView : 'hub'} />

      {/* Cyber Tech Grid Overlay */}
      <div className="cyber-grid" />

      {/* Neon Glow Bulbs */}
      <div className="ambient-glow" />
      <div className="ambient-glow-2" />

      {/* Main Content Router */}
      <div style={styles.mainContainer}>
        {!isLoggedIn ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : isAdmin ? (
          <AdminConsole adminToken={adminToken} onLogout={handleLogout} />
        ) : (
          <Dashboard 
            username={currentUser} 
            onLogout={handleLogout} 
            currentView={currentView}
            navigateTo={navigateTo}
          />
        )}
      </div>
    </>
  );
}

const styles = {
  mainContainer: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  },
};
