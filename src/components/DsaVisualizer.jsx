import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Sliders, Info, BarChart2 } from 'lucide-react';

export default function DsaVisualizer() {
  const [array, setArray] = useState([]);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState(100); // delay in ms
  const [arraySize, setArraySize] = useState(15);

  // Generate random array
  const generateArray = () => {
    if (isSorting) return;
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push(Math.floor(Math.random() * 85) + 15); // height 15 to 100
    }
    setArray(newArray);
    setComparing([]);
    setSwapping([]);
    setSorted([]);
  };

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  // Helper sleep function for animation delay
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Bubble Sort algorithm with animation hooks
  const runBubbleSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    const arr = [...array];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Highlight comparing elements in Cyan
        setComparing([j, j + 1]);
        await sleep(speed);

        if (arr[j] > arr[j + 1]) {
          // Highlight swapping elements in Pink
          setSwapping([j, j + 1]);
          
          // Swap operation
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          
          await sleep(speed);
          setSwapping([]);
        }
        setComparing([]);
      }
      // Add to sorted list indices (from right to left)
      setSorted((prev) => [...prev, n - i - 1]);
    }
    setSorted(Array.from({ length: n }, (_, k) => k));
    setIsSorting(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.layoutGrid}>
        {/* Visualizer Panel */}
        <div className="glass-panel" style={styles.vizCard}>
          <div style={styles.cardHeader}>
            <BarChart2 size={20} style={{ color: 'var(--neon-cyan)' }} />
            <h3 className="text-neon" style={styles.cardTitle}>DSA // BUBBLE_SORT_VISUALIZER</h3>
          </div>
          <p style={styles.cardDesc}>Data Structure array element comparisons and swap metrics</p>

          {/* Array bar display */}
          <div style={styles.barsContainer}>
            {array.map((value, idx) => {
              const isComparing = comparing.includes(idx);
              const isSwapping = swapping.includes(idx);
              const isSorted = sorted.includes(idx);
              
              let barColor = 'rgba(168, 85, 247, 0.4)'; // default purple transparent
              let borderGlow = 'rgba(168, 85, 247, 0.2)';
              
              if (isComparing) {
                barColor = 'var(--neon-cyan)';
                borderGlow = 'var(--neon-cyan)';
              } else if (isSwapping) {
                barColor = 'var(--neon-pink)';
                borderGlow = 'var(--neon-pink)';
              } else if (isSorted) {
                barColor = '#10b981'; // Green
                borderGlow = '#10b981';
              }

              return (
                <div key={idx} style={styles.barWrapper}>
                  <div 
                    style={{
                      ...styles.bar,
                      height: `${value * 2.2}px`,
                      backgroundColor: barColor,
                      boxShadow: `0 0 10px ${borderGlow}`,
                    }}
                  />
                  <span style={styles.barValue}>{value}</span>
                </div>
              );
            })}
          </div>

          {/* Controls Bar */}
          <div style={styles.controlsRow}>
            <button 
              onClick={generateArray} 
              className="btn-secondary" 
              style={styles.controlBtn}
              disabled={isSorting}
            >
              <RotateCcw size={16} /> Reset Array
            </button>

            <button 
              onClick={runBubbleSort} 
              className="btn-neon" 
              style={{ ...styles.controlBtn, flex: 2 }}
              disabled={isSorting}
            >
              <Play size={16} /> Sort (Bubble Sort)
            </button>
          </div>
        </div>

        {/* Algorithm Analytics Panel */}
        <div className="glass-panel" style={styles.analyticsCard}>
          <div style={styles.cardHeader}>
            <Sliders size={20} style={{ color: 'var(--neon-pink)' }} />
            <h3 className="text-neon" style={styles.cardTitle}>CONTROL ENGINE</h3>
          </div>
          <p style={styles.cardDesc}>Configure data inputs & sorting velocity</p>

          {/* Size slider */}
          <div style={styles.paramGroup}>
            <label style={styles.paramLabel}>Array Node Count: {arraySize}</label>
            <input
              type="range"
              min={10}
              max={25}
              step={1}
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              disabled={isSorting}
              style={styles.slider}
            />
          </div>

          {/* Speed slider */}
          <div style={styles.paramGroup}>
            <label style={styles.paramLabel}>
              Animation Interval: {speed} ms
            </label>
            <input
              type="range"
              min={20}
              max={500}
              step={20}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={styles.slider}
            />
          </div>

          {/* Analysis documentation */}
          <div style={styles.infoBox}>
            <div style={styles.infoHeader}>
              <Info size={16} style={{ color: 'var(--neon-cyan)' }} />
              <span>ALGORITHM COMPONENT PROFILE</span>
            </div>
            <div style={styles.infoRow}>
              <span>Average Complexity:</span>
              <strong style={{ color: 'var(--neon-pink)' }}>O(N²)</strong>
            </div>
            <div style={styles.infoRow}>
              <span>Space Complexity:</span>
              <strong style={{ color: 'var(--neon-cyan)' }}>O(1)</strong>
            </div>
            <div style={styles.infoRow}>
              <span>Sorting Class:</span>
              <strong>Comparison Sort</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    boxSizing: 'border-box',
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    alignItems: 'start',
  },
  vizCard: {
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    height: '480px',
  },
  analyticsCard: {
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    height: '480px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontFamily: 'var(--font-heading)',
    letterSpacing: '1.5px',
  },
  cardDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '20px',
  },
  barsContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '6px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '16px',
    border: '1px solid var(--border-light)',
    padding: '20px',
    minHeight: '260px',
    position: 'relative',
    overflow: 'hidden',
  },
  barWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    maxWidth: '24px',
  },
  bar: {
    width: '100%',
    borderRadius: '4px 4px 0 0',
    transition: 'all 0.15s ease',
  },
  barValue: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    marginTop: '6px',
    fontFamily: 'var(--font-heading)',
  },
  controlsRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  controlBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    padding: '10px 16px',
  },
  paramGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '24px',
  },
  paramLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-heading)',
    letterSpacing: '0.5px',
  },
  slider: {
    width: '100%',
    cursor: 'pointer',
    accentColor: 'var(--neon-purple)',
  },
  infoBox: {
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid var(--border-light)',
    borderRadius: '16px',
    padding: '18px',
    marginTop: 'auto',
  },
  infoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    marginBottom: '14px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    marginBottom: '10px',
    color: 'var(--text-primary)',
  },
};
