import React, { useState, useEffect } from 'react';
import { LogOut, ShieldCheck, Terminal, Search, Eye, EyeOff, RefreshCw, Database } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function AdminConsole({ adminToken, onLogout }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([
    'Initializing Admin Console Secure Gate...',
    'Authorization token loaded successfully.',
    'System telemetry: OK.',
  ]);

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 14)]);
  };

  const fetchDatabase = async () => {
    setIsLoading(true);
    addLog('Fetching profiles from primary database...');
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        addLog(`Database read complete: ${data.length} profiles loaded.`);
      } else {
        addLog('Database read failed. Error code: 403 Forbidden.');
      }
    } catch (err) {
      addLog(`Network anomaly detected: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabase();
  }, [adminToken]);

  const togglePasswordVisibility = (username) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [username]: !prev[username],
    }));
  };

  // Filter users based on search
  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.consoleContainer}>
      {/* Admin Navbar */}
      <header className="glass-panel" style={styles.header}>
        <div style={styles.brand}>
          <ShieldCheck size={24} style={styles.brandIcon} />
          <span className="text-neon" style={styles.brandText}>NEXUS.ADMIN_CONSOLE</span>
        </div>
        <div style={styles.userInfo}>
          <span style={styles.statusDot}></span>
          <span style={styles.userTag}>ADMINISTRATOR</span>
          <button onClick={onLogout} className="btn-secondary" style={styles.logoutBtn}>
            <LogOut size={16} /> LOGOUT
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main style={styles.grid}>
        {/* User Database Table Card */}
        <section className="glass-panel" style={{ ...styles.card, gridColumn: 'span 2' }}>
          <div style={styles.cardHeader}>
            <Database size={20} style={styles.cardHeaderIcon} />
            <h2 className="text-neon" style={styles.cardTitle}>SECURE USER DATABASE</h2>
            
            <button 
              onClick={fetchDatabase} 
              style={styles.refreshBtn}
              disabled={isLoading}
              title="Refresh database"
            >
              <RefreshCw size={16} className={isLoading ? 'float-element' : ''} />
            </button>
          </div>
          <p style={styles.cardDesc}>Raw credentials database view (Admin clearance only)</p>

          {/* Search bar */}
          <div style={styles.searchContainer}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search database profiles by ID..."
              style={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Database Table */}
          <div style={styles.tableWrapper}>
            {filteredUsers.length === 0 ? (
              <div style={styles.emptyState}>No registered profiles found in the database.</div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>USER ID</th>
                    <th style={styles.th}>REGISTRATION TIMESTAMP</th>
                    <th style={styles.th}>DECRYPTED ACCESS TOKEN</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, index) => {
                    const isRevealed = !!revealedPasswords[u.username];
                    return (
                      <tr key={index} style={styles.tr}>
                        <td style={{ ...styles.td, fontWeight: '700', color: 'var(--neon-cyan)' }}>
                          {u.username}
                        </td>
                        <td style={styles.td}>
                          {new Date(u.createdAt).toLocaleString()}
                        </td>
                        <td style={{ ...styles.td, display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={styles.passText}>
                            {isRevealed ? u.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(u.username)}
                            style={styles.revealBtn}
                            title={isRevealed ? 'Hide Password' : 'Reveal Password'}
                          >
                            {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Hacker Terminal Logs Panel */}
        <section className="glass-panel" style={styles.card}>
          <div style={styles.cardHeader}>
            <Terminal size={18} style={styles.cardHeaderIcon} />
            <h3 className="text-neon" style={styles.cardTitleSmall}>GATEWAY TELEMETRY LOGS</h3>
          </div>
          <p style={styles.cardDesc}>Realtime authentication logs</p>

          <div style={styles.logsConsole}>
            {logs.map((log, idx) => (
              <div key={idx} style={styles.logLine}>
                <span style={styles.logTerminalSymbol}>&gt;</span> {log}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  consoleContainer: {
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
    color: '#ff007f',
    filter: 'drop-shadow(0 0 5px #ff007f)',
  },
  brandText: {
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#ff007f',
    borderRadius: '50%',
    boxShadow: '0 0 10px #ff007f',
  },
  userTag: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.85rem',
    color: '#ff007f',
    letterSpacing: '1px',
    fontWeight: '600',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    fontSize: '0.8rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  cardHeaderIcon: {
    color: 'var(--neon-purple)',
  },
  cardTitle: {
    fontSize: '1.4rem',
  },
  cardTitleSmall: {
    fontSize: '1.1rem',
    fontFamily: 'var(--font-heading)',
    letterSpacing: '1.5px',
  },
  cardDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '20px',
  },
  refreshBtn: {
    marginLeft: 'auto',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    color: 'var(--text-secondary)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-light)',
    borderRadius: '12px',
    padding: '12px 16px 12px 46px',
    color: '#fff',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    transition: 'all 0.3s ease',
  },
  tableWrapper: {
    overflowX: 'auto',
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  thRow: {
    borderBottom: '1px solid var(--border-light)',
  },
  th: {
    padding: '12px 16px',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    fontFamily: 'var(--font-heading)',
    fontWeight: '600',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    transition: 'background-color 0.2s ease',
  },
  td: {
    padding: '16px',
    fontSize: '0.9rem',
  },
  passText: {
    fontFamily: 'var(--font-heading)',
    letterSpacing: '0.5px',
  },
  revealBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  logsConsole: {
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid var(--border-light)',
    borderRadius: '12px',
    padding: '16px',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.8rem',
    color: '#34d399',
    height: '240px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column-reverse',
    gap: '8px',
  },
  logLine: {
    lineHeight: '1.4',
    wordBreak: 'break-all',
  },
  logTerminalSymbol: {
    color: '#ff007f',
  },
  emptyState: {
    padding: '30px 0',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
};
