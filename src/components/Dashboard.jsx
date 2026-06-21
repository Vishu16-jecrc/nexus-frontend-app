import React, { useState, useEffect } from 'react';
import { LogOut, Music, Cpu, Camera, ExternalLink, ArrowLeft, Users } from 'lucide-react';
import ImageRecognizer from './ImageRecognizer';
import SongRecognizer from './SongRecognizer';
import FaceRecognizer from './FaceRecognizer';

export default function Dashboard({ username, onLogout, currentView, navigateTo }) {
  const openInNewTab = (viewName) => {
    window.open(`?view=${viewName}`, '_blank');
  };

  return (
    <div className="dashboard-container" style={styles.dashboardContainer}>
      {/* Top Navbar */}
      <header className="glass-panel dashboard-header" style={styles.header}>
        <div className="dashboard-brand" onClick={() => navigateTo('hub')} style={{ ...styles.brand, cursor: 'pointer' }}>
          <Cpu size={24} style={styles.brandIcon} />
          <span className="text-neon" style={styles.brandText}>NEXUS.WORKSPACE</span>
        </div>
        
        {currentView !== 'hub' && (
          <button onClick={() => navigateTo('hub')} className="btn-secondary back-to-hub-btn" style={styles.backBtn}>
            <ArrowLeft size={16} /> Back to Hub
          </button>
        )}

        <div className="user-info-bar" style={styles.userInfo}>
          <span style={styles.statusDot}></span>
          <span className="user-tag" style={styles.userTag}>USER: {username.toUpperCase()}</span>
          <button onClick={onLogout} className="btn-secondary logout-btn" style={styles.logoutBtn}>
            <LogOut size={16} /> LOGOUT
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="dashboard-tab-content" style={styles.tabContent}>
        {currentView === 'hub' && (
          <div className="hub-container" style={styles.hubContainer}>
            <div className="hub-header" style={styles.hubHeader}>
              <h2 className="text-neon hub-title" style={styles.hubTitle}>CHOOSE YOUR WORKSPACE GATEWAY</h2>
              <p className="hub-desc" style={styles.hubDesc}>
                Welcome, <span className="text-neon-pink" style={{ fontWeight: '700' }}>{username}</span>. Select a high-tech AI modules workspace below to launch it as a full webpage.
              </p>
            </div>

            <div className="gateway-grid" style={styles.gatewayGrid}>
              {/* Gateway 1: Google Lens */}
              <div className="glass-panel gateway-card" style={styles.gatewayCard}>
                <div style={{ ...styles.iconBadge, color: 'var(--neon-cyan)', boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)' }}>
                  <Camera size={36} />
                </div>
                <h3 className="text-neon gateway-card-title" style={styles.gatewayTitle}>NEXUS // IMAGE_LENS</h3>
                <span className="gateway-card-subtitle" style={styles.gatewaySubtitle}>Visual Intelligence Search</span>
                <p className="gateway-card-text" style={styles.gatewayText}>
                  Upload local images to run client-side neural networks. Discover entities, extract developer use cases, study data structure connections, and read fun facts.
                </p>
                <div className="card-actions" style={styles.cardActions}>
                  <button onClick={() => navigateTo('lens')} className="btn-neon" style={styles.cardBtn}>
                    Launch Workspace
                  </button>
                  <button onClick={() => openInNewTab('lens')} className="btn-secondary" style={styles.cardBtnSecondary}>
                    Open in New Webpage <ExternalLink size={14} />
                  </button>
                </div>
              </div>

              {/* Gateway 2: Song Recognizer */}
              <div className="glass-panel gateway-card" style={styles.gatewayCard}>
                <div style={{ ...styles.iconBadge, color: 'var(--neon-pink)', boxShadow: '0 0 20px rgba(255, 0, 127, 0.15)' }}>
                  <Music size={36} />
                </div>
                <h3 className="text-neon-pink gateway-card-title" style={styles.gatewayTitle}>NEXUS // AUDIOLENS</h3>
                <span className="gateway-card-subtitle" style={styles.gatewaySubtitle}>Acoustic Sound & Lyric Recognition</span>
                <p className="gateway-card-text" style={styles.gatewayText}>
                  Record ambient audio using the Web Audio API to identify songs with live frequency canvas visuals, or query the local lyrics database with a Spotify timeline controller.
                </p>
                <div className="card-actions" style={styles.cardActions}>
                  <button onClick={() => navigateTo('music')} className="btn-neon" style={{ ...styles.cardBtn, background: 'linear-gradient(135deg, var(--neon-pink) 0%, var(--neon-purple) 100%)', boxShadow: '0 4px 15px rgba(255, 0, 127, 0.3)' }}>
                    Launch Workspace
                  </button>
                  <button onClick={() => openInNewTab('music')} className="btn-secondary" style={styles.cardBtnSecondary}>
                    Open in New Webpage <ExternalLink size={14} />
                  </button>
                </div>
              </div>

              {/* Gateway 3: Face Recognition */}
              <div className="glass-panel gateway-card" style={styles.gatewayCard}>
                <div style={{ ...styles.iconBadge, color: '#00ff88', boxShadow: '0 0 20px rgba(0, 255, 136, 0.15)' }}>
                  <Users size={36} />
                </div>
                <h3 style={{ ...styles.gatewayTitle, color: '#00ff88' }} className="gateway-card-title">NEXUS // FACE_MATCH</h3>
                <span className="gateway-card-subtitle" style={styles.gatewaySubtitle}>ResNet Person Recognition</span>
                <p className="gateway-card-text" style={styles.gatewayText}>
                  Upload two images to find a person using ResNet-34 face descriptors with ImageNet-derived neural networks. Supports multi-face detection and Euclidean distance comparison.
                </p>
                <div className="card-actions" style={styles.cardActions}>
                  <button onClick={() => navigateTo('face')} className="btn-neon" style={{ ...styles.cardBtn, background: 'linear-gradient(135deg, #00ff88 0%, var(--neon-cyan) 100%)', boxShadow: '0 4px 15px rgba(0, 255, 136, 0.3)', color: '#000' }}>
                    Launch Workspace
                  </button>
                  <button onClick={() => openInNewTab('face')} className="btn-secondary" style={styles.cardBtnSecondary}>
                    Open in New Webpage <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'lens' && (
          <div className="glass-panel active-workspace-card" style={styles.workspaceCard}>
            <div style={styles.workspaceHeader}>
              <Camera size={18} style={{ color: 'var(--neon-cyan)' }} />
              <span style={styles.workspaceLabel}>IMAGE_LENS WORKSPACE // ACTIVE</span>
            </div>
            <ImageRecognizer />
          </div>
        )}

        {currentView === 'music' && (
          <div className="glass-panel active-workspace-card" style={styles.workspaceCard}>
            <div style={styles.workspaceHeader}>
              <Music size={18} style={{ color: 'var(--neon-pink)' }} />
              <span style={styles.workspaceLabel}>AUDIOLENS WORKSPACE // ACTIVE</span>
            </div>
            <SongRecognizer />
          </div>
        )}

        {currentView === 'face' && (
          <div className="glass-panel active-workspace-card" style={styles.workspaceCard}>
            <div style={styles.workspaceHeader}>
              <Users size={18} style={{ color: '#00ff88' }} />
              <span style={styles.workspaceLabel}>FACE_MATCH WORKSPACE // ACTIVE</span>
            </div>
            <FaceRecognizer />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  dashboardContainer: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    zIndex: 10,
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    gap: '24px',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 28px',
    borderRadius: '16px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  brandIcon: {
    color: 'var(--neon-purple)',
  },
  brandText: {
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    fontSize: '0.8rem',
    marginLeft: '20px',
    marginRight: 'auto',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    boxShadow: '0 0 10px #10b981',
  },
  userTag: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    letterSpacing: '1px',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    fontSize: '0.8rem',
  },
  tabContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  // Hub styling
  hubContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    width: '100%',
    padding: '10px 0',
  },
  hubHeader: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  hubTitle: {
    fontSize: '1.8rem',
    letterSpacing: '2px',
  },
  hubDesc: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
  },
  gatewayGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    marginTop: '10px',
  },
  gatewayCard: {
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '16px',
  },
  iconBadge: {
    width: '80px',
    height: '80px',
    borderRadius: '24px',
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
  },
  gatewayTitle: {
    fontSize: '1.4rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: '700',
    letterSpacing: '1.5px',
  },
  gatewaySubtitle: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    fontWeight: '600',
    marginTop: '-8px',
  },
  gatewayText: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    minHeight: '80px',
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
    marginTop: '10px',
  },
  cardBtn: {
    width: '100%',
    padding: '12px 24px',
    fontSize: '0.85rem',
  },
  cardBtnSecondary: {
    width: '100%',
    padding: '11px 24px',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  // Workspace active panel styles
  workspaceCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    flex: 1,
  },
  workspaceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: '12px',
  },
  workspaceLabel: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
  }
};
