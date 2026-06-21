import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Users, Upload, Search, Cpu, CheckCircle, XCircle, Loader, Sparkles, AlertCircle, Layers } from 'lucide-react';
import * as faceapi from '@vladmandic/face-api';

const MODEL_URL = '/models/';

export default function FaceRecognizer() {
  // Model state
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [modelLoadProgress, setModelLoadProgress] = useState('');
  const [modelError, setModelError] = useState(null);

  // Image states
  const [referenceImage, setReferenceImage] = useState(null);
  const [searchImage, setSearchImage] = useState(null);
  const [refDescriptors, setRefDescriptors] = useState(null);

  // Processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  // Results
  const [matchResult, setMatchResult] = useState(null); // { matched, distance, confidence, refFaces, searchFaces, matchedIndices }

  // Log
  const [logs, setLogs] = useState([]);

  // Canvas refs for face overlay drawing
  const refCanvasRef = useRef(null);
  const searchCanvasRef = useRef(null);
  const refImgRef = useRef(null);
  const searchImgRef = useRef(null);

  const addLog = (msg) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Load face-api.js models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        setModelLoadProgress('Loading SSD MobileNet v1 face detector...');
        addLog('Loading SSD MobileNet v1 weights from local workspace...');
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);

        setModelLoadProgress('Loading 68-point face landmark model...');
        addLog('Loading face landmark 68-point model from local workspace...');
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

        setModelLoadProgress('Loading ResNet-34 face recognition model...');
        addLog('Loading ResNet-34 face descriptor model (ImageNet-derived) from local workspace...');
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

        setModelsLoaded(true);
        setModelLoadProgress('');
        addLog('✅ All neural network models loaded successfully!');
        addLog('Models: SSD MobileNet v1 + Landmark68 + ResNet-34 (128-dim descriptors)');
      } catch (err) {
        console.error('Model loading failed:', err);
        setModelError(err.message);
        addLog(`❌ Model loading failed: ${err.message}`);
      }
    };
    loadModels();
  }, []);

  // Handle image upload
  const handleImageUpload = useCallback((file, target) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (target === 'reference') {
        setReferenceImage(e.target.result);
        setRefDescriptors(null);
        setMatchResult(null);
        addLog(`Reference image loaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      } else {
        setSearchImage(e.target.result);
        setMatchResult(null);
        addLog(`Search image loaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback((e, target) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file, target);
    }
  }, [handleImageUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Detect faces in an image element and return detections with descriptors
  const detectFaces = async (imgElement) => {
    const detections = await faceapi
      .detectAllFaces(imgElement, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
      .withFaceLandmarks()
      .withFaceDescriptors();
    return detections;
  };

  // Draw face detections on a canvas
  const drawDetections = (canvas, imgElement, detections, matchedIndices = [], isSearch = false) => {
    if (!canvas || !imgElement) return;

    const displaySize = { width: imgElement.width, height: imgElement.height };
    faceapi.matchDimensions(canvas, displaySize);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    resizedDetections.forEach((det, i) => {
      const box = det.detection.box;
      const isMatched = matchedIndices.includes(i);

      // Draw box
      ctx.strokeStyle = isSearch
        ? (isMatched ? '#00ff88' : '#ff4466')
        : '#00f0ff';
      ctx.lineWidth = 3;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // Draw corner accents
      const cornerLen = 12;
      ctx.lineWidth = 4;
      // Top-left
      ctx.beginPath(); ctx.moveTo(box.x, box.y + cornerLen); ctx.lineTo(box.x, box.y); ctx.lineTo(box.x + cornerLen, box.y); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(box.x + box.width - cornerLen, box.y); ctx.lineTo(box.x + box.width, box.y); ctx.lineTo(box.x + box.width, box.y + cornerLen); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(box.x, box.y + box.height - cornerLen); ctx.lineTo(box.x, box.y + box.height); ctx.lineTo(box.x + cornerLen, box.y + box.height); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(box.x + box.width - cornerLen, box.y + box.height); ctx.lineTo(box.x + box.width, box.y + box.height); ctx.lineTo(box.x + box.width, box.y + box.height - cornerLen); ctx.stroke();

      // Label
      const label = isSearch
        ? (isMatched ? `MATCH ${((1 - matchedIndices._distances?.[matchedIndices.indexOf(i)] || 0) * 100).toFixed(1)}%` : 'NO MATCH')
        : `Face #${i + 1}`;
      
      const confidence = (det.detection.score * 100).toFixed(1);
      const text = isSearch ? label : `${label} (${confidence}%)`;

      ctx.fillStyle = isSearch
        ? (isMatched ? 'rgba(0, 255, 136, 0.85)' : 'rgba(255, 68, 102, 0.85)')
        : 'rgba(0, 240, 255, 0.85)';
      const textWidth = ctx.measureText(text).width;
      ctx.font = 'bold 12px "Space Grotesk", monospace';
      const tw = ctx.measureText(text).width;
      ctx.fillRect(box.x, box.y - 22, tw + 10, 20);

      ctx.fillStyle = '#000';
      ctx.fillText(text, box.x + 5, box.y - 7);

      // Draw landmarks
      if (det.landmarks) {
        const positions = det.landmarks.positions;
        ctx.fillStyle = isSearch
          ? (isMatched ? 'rgba(0, 255, 136, 0.5)' : 'rgba(255, 68, 102, 0.3)')
          : 'rgba(0, 240, 255, 0.5)';
        positions.forEach(pt => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    });
  };

  // Run face matching
  const runFaceMatch = async () => {
    if (!modelsLoaded || !referenceImage || !searchImage) return;

    setIsProcessing(true);
    setMatchResult(null);
    setLogs([]);
    
    const startTime = performance.now();

    try {
      // Phase 1: Detect faces in reference image
      setProcessingStep('Detecting faces in reference image...');
      addLog('Running SSD MobileNet v1 face detection on reference image...');
      
      await new Promise(r => setTimeout(r, 100)); // Let UI update

      const refDetections = await detectFaces(refImgRef.current);
      addLog(`Found ${refDetections.length} face(s) in reference image.`);

      if (refDetections.length === 0) {
        addLog('❌ No faces detected in reference image.');
        setMatchResult({ error: 'No faces detected in the reference image. Please upload a clear photo with a visible face.' });
        setIsProcessing(false);
        return;
      }

      // Draw detections on reference canvas
      drawDetections(refCanvasRef.current, refImgRef.current, refDetections);

      addLog('Extracting ResNet-34 face descriptors (128-dimensional vectors)...');
      setRefDescriptors(refDetections.map(d => d.descriptor));

      // Phase 2: Detect faces in search image
      setProcessingStep('Detecting faces in search image...');
      addLog('Running SSD MobileNet v1 face detection on search image...');
      
      await new Promise(r => setTimeout(r, 100));

      const searchDetections = await detectFaces(searchImgRef.current);
      addLog(`Found ${searchDetections.length} face(s) in search image.`);

      if (searchDetections.length === 0) {
        addLog('❌ No faces detected in search image.');
        drawDetections(refCanvasRef.current, refImgRef.current, refDetections);
        setMatchResult({ error: 'No faces detected in the search image. Please upload a clear photo with visible faces.' });
        setIsProcessing(false);
        return;
      }

      // Phase 3: Compare face descriptors
      setProcessingStep('Comparing face embeddings via Euclidean distance...');
      addLog('Computing Euclidean distances between face descriptor vectors...');
      
      await new Promise(r => setTimeout(r, 100));

      const refDescriptor = refDetections[0].descriptor; // Use first face from reference
      const THRESHOLD = 0.6;
      
      const matchedIndices = [];
      const distances = [];
      let bestDistance = Infinity;
      let bestIndex = -1;

      searchDetections.forEach((searchDet, i) => {
        const distance = faceapi.euclideanDistance(refDescriptor, searchDet.descriptor);
        distances.push(distance);
        addLog(`Face #${i + 1}: Euclidean distance = ${distance.toFixed(4)} ${distance < THRESHOLD ? '✅ MATCH' : '❌ NO MATCH'}`);
        
        if (distance < THRESHOLD) {
          matchedIndices.push(i);
        }
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = i;
        }
      });

      // Attach distances to matchedIndices for label rendering
      matchedIndices._distances = matchedIndices.map(i => distances[i]);

      // Draw detections on search canvas
      drawDetections(searchCanvasRef.current, searchImgRef.current, searchDetections, matchedIndices, true);

      const elapsedMs = (performance.now() - startTime).toFixed(0);
      const confidence = Math.max(0, ((1 - bestDistance) * 100)).toFixed(1);

      addLog(`\nInference completed in ${elapsedMs}ms.`);
      addLog(`Best match distance: ${bestDistance.toFixed(4)} (threshold: ${THRESHOLD})`);
      addLog(`Match confidence: ${confidence}%`);
      addLog(matchedIndices.length > 0
        ? `✅ PERSON FOUND! ${matchedIndices.length} matching face(s) identified.`
        : '❌ Person NOT found in the search image.'
      );

      setMatchResult({
        matched: matchedIndices.length > 0,
        distance: bestDistance,
        confidence: parseFloat(confidence),
        refFaceCount: refDetections.length,
        searchFaceCount: searchDetections.length,
        matchCount: matchedIndices.length,
        elapsedMs,
        distances,
        matchedIndices
      });

    } catch (err) {
      console.error('Face matching error:', err);
      addLog(`❌ Error: ${err.message}`);
      setMatchResult({ error: err.message });
    }

    setIsProcessing(false);
    setProcessingStep('');
  };

  // Auto-run matching when both images are ready
  useEffect(() => {
    if (modelsLoaded && referenceImage && searchImage && refImgRef.current && searchImgRef.current) {
      // Small delay to ensure images are rendered
      const timer = setTimeout(() => runFaceMatch(), 300);
      return () => clearTimeout(timer);
    }
  }, [referenceImage, searchImage, modelsLoaded]);

  return (
    <div className="face-recognizer-container" style={styles.container}>
      {/* Model Loading State */}
      {!modelsLoaded && !modelError && (
        <div style={styles.loadingPanel}>
          <div style={styles.loadingSpinner}>
            <Cpu size={32} style={{ color: 'var(--neon-cyan)', animation: 'spin 2s linear infinite' }} />
          </div>
          <h3 style={styles.loadingTitle}>Initializing Neural Networks</h3>
          <p style={styles.loadingText}>{modelLoadProgress}</p>
          <div style={styles.progressBar}>
            <div style={{
              ...styles.progressFill,
              width: modelLoadProgress.includes('ResNet') ? '80%' : modelLoadProgress.includes('landmark') ? '50%' : '25%'
            }} />
          </div>
          <div style={styles.modelInfo}>
            <span style={styles.modelTag}>SSD MobileNet v1</span>
            <span style={styles.modelTag}>Landmark 68pt</span>
            <span style={styles.modelTag}>ResNet-34</span>
          </div>
        </div>
      )}

      {modelError && (
        <div style={styles.errorPanel}>
          <AlertCircle size={32} style={{ color: 'var(--neon-pink)' }} />
          <h3 style={{ color: '#fff', margin: '12px 0 8px' }}>Model Loading Failed</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{modelError}</p>
        </div>
      )}

      {modelsLoaded && (
        <>
          {/* Header */}
          <div style={styles.headerRow}>
            <div style={styles.headerLeft}>
              <Layers size={16} style={{ color: 'var(--neon-cyan)' }} />
              <span style={styles.headerLabel}>RESNET-34 FACE MATCHING ENGINE</span>
            </div>
            <div style={styles.headerTags}>
              <span style={styles.techTag}>ImageNet</span>
              <span style={styles.techTag}>ResNet-34</span>
              <span style={styles.techTag}>128-dim</span>
            </div>
          </div>

          {/* Image Upload Grid */}
          <div className="face-image-grid" style={styles.imageGrid}>
            {/* Reference Image Panel */}
            <div className="face-image-panel" style={styles.imagePanel}>
              <div style={styles.panelHeader}>
                <Users size={14} style={{ color: 'var(--neon-cyan)' }} />
                <span style={styles.panelTitle}>IMAGE 1 — REFERENCE PERSON</span>
              </div>

              {!referenceImage ? (
                <div
                  style={styles.dropZone}
                  onDrop={(e) => handleDrop(e, 'reference')}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById('ref-upload').click()}
                >
                  <Upload size={36} style={{ color: 'var(--neon-cyan)', marginBottom: '12px' }} />
                  <p style={styles.dropText}>Drop an image here or click to upload</p>
                  <p style={styles.dropSubtext}>Upload a clear photo of the person to find</p>
                  <input
                    id="ref-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageUpload(e.target.files[0], 'reference')}
                  />
                </div>
              ) : (
                <div style={styles.imageContainer}>
                  <div style={styles.imageWrapper}>
                    <img
                      ref={refImgRef}
                      src={referenceImage}
                      alt="Reference"
                      style={styles.uploadedImage}
                      crossOrigin="anonymous"
                    />
                    <canvas ref={refCanvasRef} style={styles.overlayCanvas} />
                  </div>
                  <button
                    onClick={() => { setReferenceImage(null); setRefDescriptors(null); setMatchResult(null); }}
                    style={styles.removeBtn}
                  >
                    Change Image
                  </button>
                </div>
              )}
            </div>

            {/* Search Image Panel */}
            <div className="face-image-panel" style={styles.imagePanel}>
              <div style={styles.panelHeader}>
                <Search size={14} style={{ color: 'var(--neon-pink)' }} />
                <span style={{ ...styles.panelTitle, color: 'var(--neon-pink)' }}>IMAGE 2 — SEARCH TARGET</span>
              </div>

              {!searchImage ? (
                <div
                  style={{ ...styles.dropZone, borderColor: 'rgba(255, 0, 127, 0.2)' }}
                  onDrop={(e) => handleDrop(e, 'search')}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById('search-upload').click()}
                >
                  <Search size={36} style={{ color: 'var(--neon-pink)', marginBottom: '12px' }} />
                  <p style={styles.dropText}>Drop the search image here</p>
                  <p style={styles.dropSubtext}>Upload an image to find the reference person in</p>
                  <input
                    id="search-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageUpload(e.target.files[0], 'search')}
                  />
                </div>
              ) : (
                <div style={styles.imageContainer}>
                  <div style={styles.imageWrapper}>
                    <img
                      ref={searchImgRef}
                      src={searchImage}
                      alt="Search"
                      style={styles.uploadedImage}
                      crossOrigin="anonymous"
                    />
                    <canvas ref={searchCanvasRef} style={styles.overlayCanvas} />
                  </div>
                  <button
                    onClick={() => { setSearchImage(null); setMatchResult(null); }}
                    style={styles.removeBtn}
                  >
                    Change Image
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div style={styles.processingBar}>
              <Loader size={16} style={{ color: 'var(--neon-cyan)', animation: 'spin 1s linear infinite' }} />
              <span style={styles.processingText}>{processingStep}</span>
            </div>
          )}

          {/* Match Result */}
          {matchResult && !matchResult.error && (
            <div style={{
              ...styles.resultCard,
              borderColor: matchResult.matched ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 68, 102, 0.3)',
              background: matchResult.matched
                ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 240, 255, 0.03) 100%)'
                : 'linear-gradient(135deg, rgba(255, 68, 102, 0.05) 0%, rgba(255, 0, 127, 0.03) 100%)'
            }}>
              <div style={styles.resultHeader}>
                {matchResult.matched ? (
                  <CheckCircle size={28} style={{ color: '#00ff88' }} />
                ) : (
                  <XCircle size={28} style={{ color: '#ff4466' }} />
                )}
                <div>
                  <h3 style={{ ...styles.resultTitle, color: matchResult.matched ? '#00ff88' : '#ff4466' }}>
                    {matchResult.matched ? 'PERSON IDENTIFIED' : 'PERSON NOT FOUND'}
                  </h3>
                  <p style={styles.resultSubtitle}>
                    {matchResult.matched
                      ? `${matchResult.matchCount} matching face(s) found in the search image`
                      : 'The reference person was not found in the search image'}
                  </p>
                </div>
              </div>

              <div className="face-stats-grid" style={styles.statsGrid}>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>CONFIDENCE</span>
                  <span style={{ ...styles.statValue, color: matchResult.matched ? '#00ff88' : '#ff4466' }}>
                    {matchResult.confidence}%
                  </span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>EUCLIDEAN DIST</span>
                  <span style={styles.statValue}>{matchResult.distance.toFixed(4)}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>REF FACES</span>
                  <span style={styles.statValue}>{matchResult.refFaceCount}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>SEARCH FACES</span>
                  <span style={styles.statValue}>{matchResult.searchFaceCount}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>INFERENCE</span>
                  <span style={styles.statValue}>{matchResult.elapsedMs}ms</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>THRESHOLD</span>
                  <span style={styles.statValue}>0.6</span>
                </div>
              </div>
            </div>
          )}

          {/* Error result */}
          {matchResult?.error && (
            <div style={styles.errorResult}>
              <AlertCircle size={24} style={{ color: 'var(--neon-pink)', flexShrink: 0 }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{matchResult.error}</p>
            </div>
          )}

          {/* Inference Log */}
          <div style={styles.logBlock}>
            <div style={styles.logHeader}>
              <Sparkles size={14} style={{ color: 'var(--neon-cyan)' }} />
              <span style={styles.logTitle}>INFERENCE LOG</span>
            </div>
            <div style={styles.logContainer}>
              {logs.length === 0 ? (
                <div style={styles.emptyLog}>
                  &gt; Upload two images to begin face matching...
                  <br />
                  <span style={{ color: '#3b82f6', fontSize: '0.7rem', display: 'block', marginTop: '6px' }}>
                    * Models: SSD MobileNet v1 (detection) + ResNet-34 (recognition, ImageNet-derived)
                  </span>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} style={styles.logLine}>&gt; {log}</div>
                ))
              )}
            </div>
          </div>

          {/* Architecture Info */}
          <div style={styles.archInfo}>
            <div style={styles.archItem}>
              <span style={styles.archLabel}>DETECTION</span>
              <span style={styles.archValue}>SSD MobileNet v1</span>
            </div>
            <div style={styles.archDivider} />
            <div style={styles.archItem}>
              <span style={styles.archLabel}>LANDMARKS</span>
              <span style={styles.archValue}>68-point model</span>
            </div>
            <div style={styles.archDivider} />
            <div style={styles.archItem}>
              <span style={styles.archLabel}>RECOGNITION</span>
              <span style={styles.archValue}>ResNet-34 (128-dim)</span>
            </div>
            <div style={styles.archDivider} />
            <div style={styles.archItem}>
              <span style={styles.archLabel}>TRAINING</span>
              <span style={styles.archValue}>ImageNet / Face datasets</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    fontFamily: 'var(--font-heading)',
  },

  // Loading
  loadingPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 30px',
    textAlign: 'center',
  },
  loadingSpinner: {
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'rgba(0, 240, 255, 0.05)',
    border: '2px solid rgba(0, 240, 255, 0.15)',
    marginBottom: '20px',
  },
  loadingTitle: {
    color: '#fff',
    fontSize: '1.1rem',
    margin: '0 0 8px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  loadingText: {
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    margin: '0 0 20px',
  },
  progressBar: {
    width: '280px',
    height: '4px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))',
    borderRadius: '2px',
    transition: 'width 0.5s ease',
  },
  modelInfo: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  modelTag: {
    fontSize: '0.7rem',
    color: 'var(--neon-cyan)',
    border: '1px solid rgba(0, 240, 255, 0.2)',
    padding: '3px 10px',
    borderRadius: '12px',
    background: 'rgba(0, 240, 255, 0.04)',
  },

  // Error
  errorPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '50px 30px',
    textAlign: 'center',
  },

  // Header
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  headerLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },
  headerTags: {
    display: 'flex',
    gap: '6px',
  },
  techTag: {
    fontSize: '0.65rem',
    color: 'var(--neon-purple)',
    border: '1px solid rgba(168, 85, 247, 0.25)',
    padding: '2px 8px',
    borderRadius: '10px',
    background: 'rgba(168, 85, 247, 0.06)',
    fontWeight: '600',
  },

  // Image Grid
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  imagePanel: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    background: 'rgba(0, 0, 0, 0.2)',
  },
  panelTitle: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: 'var(--neon-cyan)',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },

  // Drop zone
  dropZone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px 20px',
    cursor: 'pointer',
    border: '2px dashed rgba(0, 240, 255, 0.15)',
    borderRadius: '0 0 14px 14px',
    margin: '12px',
    transition: 'all 0.3s ease',
    background: 'rgba(0, 240, 255, 0.02)',
  },
  dropText: {
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: '600',
    margin: '0 0 6px',
  },
  dropSubtext: {
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    margin: 0,
  },

  // Image container
  imageContainer: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: '10px',
    overflow: 'hidden',
    background: '#000',
  },
  uploadedImage: {
    width: '100%',
    display: 'block',
    maxHeight: '350px',
    objectFit: 'contain',
    background: '#0a0b16',
  },
  overlayCanvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  removeBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'var(--text-secondary)',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-heading)',
    textAlign: 'center',
    transition: 'all 0.2s',
  },

  // Processing
  processingBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    background: 'rgba(0, 240, 255, 0.04)',
    border: '1px solid rgba(0, 240, 255, 0.1)',
    borderRadius: '10px',
  },
  processingText: {
    color: 'var(--neon-cyan)',
    fontSize: '0.8rem',
    fontWeight: '600',
  },

  // Results
  resultCard: {
    padding: '20px',
    borderRadius: '14px',
    border: '1px solid',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '16px',
  },
  resultTitle: {
    margin: 0,
    fontSize: '1.05rem',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  resultSubtitle: {
    margin: '4px 0 0',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '10px 14px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
  },
  statLabel: {
    fontSize: '0.6rem',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    fontWeight: '600',
  },
  statValue: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#fff',
  },

  // Error result
  errorResult: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: 'rgba(255, 0, 127, 0.04)',
    border: '1px solid rgba(255, 0, 127, 0.15)',
    borderRadius: '10px',
  },

  // Log
  logBlock: {
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  logHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    background: 'rgba(0, 0, 0, 0.2)',
  },
  logTitle: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },
  logContainer: {
    padding: '12px 14px',
    maxHeight: '180px',
    overflowY: 'auto',
    fontSize: '0.72rem',
    fontFamily: '"Space Grotesk", monospace',
  },
  emptyLog: {
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    fontFamily: '"Space Grotesk", monospace',
    lineHeight: '1.6',
  },
  logLine: {
    color: '#94a3b8',
    padding: '2px 0',
    lineHeight: '1.5',
    wordBreak: 'break-word',
  },

  // Architecture info bar
  archInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    padding: '10px 16px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    flexWrap: 'wrap',
  },
  archItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  archLabel: {
    fontSize: '0.55rem',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    fontWeight: '600',
  },
  archValue: {
    fontSize: '0.72rem',
    color: 'var(--neon-cyan)',
    fontWeight: '600',
  },
  archDivider: {
    width: '1px',
    height: '28px',
    background: 'rgba(255, 255, 255, 0.08)',
  },
};
