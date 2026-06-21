import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// --- NEURAL NETWORK BACKDROP (For Hub/Dashboard) ---
const NEURAL_LAYERS = [
  [-2.2, -1.2, 0], [-2.2, -0.4, 0.3], [-2.2, 0.4, -0.3], [-2.2, 1.2, 0],
  [-0.7, -1.4, 0.4], [-0.7, -0.7, -0.4], [-0.7, 0, 0.5], [-0.7, 0.7, -0.3], [-0.7, 1.4, 0.2],
  [0.8, -1.2, -0.3], [0.8, -0.4, 0.4], [0.8, 0.4, -0.4], [0.8, 1.2, 0.3],
  [2.2, -0.6, 0.1], [2.2, 0.6, -0.1]
];

const NEURAL_EDGES = [];
for (let i = 0; i < 4; i++) {
  for (let j = 4; j < 9; j++) NEURAL_EDGES.push([i, j]);
}
for (let i = 4; i < 9; i++) {
  for (let j = 9; j < 13; j++) NEURAL_EDGES.push([i, j]);
}
for (let i = 9; i < 13; i++) {
  for (let j = 13; j < 15; j++) NEURAL_EDGES.push([i, j]);
}

function MachineLearningNetwork() {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const pulsesRef = useRef([]);
  const { viewport } = useThree();

  // Shift neural network to the right side on desktop to prevent overlap with the dashboard
  const responsiveX = viewport.width > 6.5 ? viewport.width * 0.22 : 0;

  const pulsesData = useRef(
    Array.from({ length: 8 }).map(() => {
      const edge = NEURAL_EDGES[Math.floor(Math.random() * NEURAL_EDGES.length)];
      return {
        edgeIndex: edge,
        progress: Math.random(),
        speed: 0.015 + Math.random() * 0.02,
      };
    })
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * (hovered ? 0.2 : 0.08);
      groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }

    pulsesData.current.forEach((p, idx) => {
      p.progress += p.speed;
      if (p.progress >= 1) {
        p.progress = 0;
        p.edgeIndex = NEURAL_EDGES[Math.floor(Math.random() * NEURAL_EDGES.length)];
        p.speed = 0.015 + Math.random() * 0.02;
      }
      const mesh = pulsesRef.current[idx];
      if (mesh) {
        const startNode = NEURAL_LAYERS[p.edgeIndex[0]];
        const endNode = NEURAL_LAYERS[p.edgeIndex[1]];
        mesh.position.x = THREE.MathUtils.lerp(startNode[0], endNode[0], p.progress);
        mesh.position.y = THREE.MathUtils.lerp(startNode[1], endNode[1], p.progress);
        mesh.position.z = THREE.MathUtils.lerp(startNode[2], endNode[2], p.progress);
      }
    });
  });

  const nodeMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#a855f7',
    emissive: '#8a2be2',
    emissiveIntensity: 1.5,
    roughness: 0.1,
    metalness: 0.9,
  }), []);

  const nodeMaterialHover = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#00f0ff',
    emissive: '#00f0ff',
    emissiveIntensity: 2.0,
    roughness: 0.1,
    metalness: 0.9,
  }), []);

  const lineGeometries = useMemo(() => {
    return NEURAL_EDGES.map((edge) => {
      const start = NEURAL_LAYERS[edge[0]];
      const end = NEURAL_LAYERS[edge[1]];
      const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, []);

  return (
    <group 
      ref={groupRef} 
      position={[responsiveX, 0.2, 0]} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
    >
      {NEURAL_LAYERS.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <primitive object={hovered ? nodeMaterialHover : nodeMaterial} />
        </mesh>
      ))}

      {NEURAL_EDGES.map((edge, idx) => (
        <line key={idx} geometry={lineGeometries[idx]}>
          <lineBasicMaterial 
            color={hovered ? '#ff007f' : '#a855f7'} 
            transparent={true} 
            opacity={0.18} 
          />
        </line>
      ))}

      {Array.from({ length: 8 }).map((_, idx) => (
        <mesh key={idx} ref={(el) => (pulsesRef.current[idx] = el)}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      ))}
    </group>
  );
}

// --- MUSIC 3D BACKGROUND (Pulsing vinyl & audio equalizer) ---
function FloatingNote3D({ position, speed, scale = 0.5, color = '#ff007f' }) {
  const noteRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (noteRef.current) {
      noteRef.current.position.y = position[1] + Math.sin(time * speed) * 0.7;
      noteRef.current.rotation.y = time * 0.4;
      noteRef.current.rotation.x = Math.sin(time * 0.15) * 0.15;
    }
  });

  return (
    <group ref={noteRef} position={position} scale={scale}>
      {/* Note Head */}
      <mesh position={[-0.1, 0, 0]} rotation={[0.2, 0, 0.2]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshPhysicalMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={1.5} 
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      {/* Note Stem */}
      <mesh position={[0.02, 0.22, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.44, 8]} />
        <meshPhysicalMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={1.5} 
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      {/* Note Flag */}
      <mesh position={[0.1, 0.4, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.18, 0.05, 0.02]} />
        <meshPhysicalMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={1.5} 
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

function MusicVisualizer3D() {
  const groupRef = useRef();
  const vinylRef = useRef();
  const barsRef = useRef([]);
  const { viewport } = useThree();

  // Shift vinyl visualizer to the left side on desktop to prevent overlap
  const responsiveX = viewport.width > 6.5 ? -viewport.width * 0.22 : 0;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.05;
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
    }

    if (vinylRef.current) {
      vinylRef.current.rotation.y = time * 0.8;
    }

    barsRef.current.forEach((bar, i) => {
      if (bar) {
        const wave = Math.sin(time * 4.0 + i * 0.4) * 0.5 + 0.5;
        bar.scale.y = 0.2 + wave * 1.6;
        bar.position.y = -1.2 + (bar.scale.y * 0.1);
      }
    });
  });

  const barPositions = useMemo(() => {
    const positions = [];
    const count = 24;
    const radius = 1.8;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      positions.push([x, 0, z, angle]);
    }
    return positions;
  }, []);

  return (
    <group ref={groupRef} position={[responsiveX, 0, 0]}>
      {/* 3D Vinyl Record */}
      <group position={[0, 0.1, 0]} rotation={[0.4, 0, 0]}>
        <group ref={vinylRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[1.2, 1.2, 0.03, 64]} />
            <meshStandardMaterial 
              color="#0d0e15" 
              roughness={0.4} 
              metalness={0.7}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.018, 0]}>
            <torusGeometry args={[0.8, 0.015, 8, 48]} />
            <meshStandardMaterial color="#2d3748" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.018, 0]}>
            <torusGeometry args={[0.5, 0.01, 8, 48]} />
            <meshStandardMaterial color="#2d3748" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.01, 32]} />
            <meshStandardMaterial 
              color="#ff007f" 
              emissive="#ff007f" 
              emissiveIntensity={0.8}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
            <meshStandardMaterial color="#000" roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* 3D Equalizer Ring */}
      <group position={[0, 0.8, 0]} rotation={[0.2, 0, 0]}>
        {barPositions.map(([x, y, z, angle], i) => (
          <mesh 
            key={i} 
            position={[x, y, z]} 
            rotation={[0, -angle, 0]}
            ref={(el) => (barsRef.current[i] = el)}
          >
            <boxGeometry args={[0.08, 0.2, 0.08]} />
            <meshPhysicalMaterial 
              color="#ff007f" 
              emissive="#a855f7" 
              emissiveIntensity={1.4}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Floating 3D Music Notes */}
      <FloatingNote3D position={[-1.6, 0.8, 0.5]} speed={1.2} scale={0.45} color="#ff007f" />
      <FloatingNote3D position={[1.5, 0.9, -0.6]} speed={1.5} scale={0.4} color="#00f0ff" />
      <FloatingNote3D position={[-0.8, 1.4, -0.8]} speed={0.9} scale={0.35} color="#a855f7" />
      <FloatingNote3D position={[1.1, 1.3, 0.7]} speed={1.8} scale={0.35} color="#ff007f" />
    </group>
  );
}

// --- IMAGE SCANNER 3D BACKGROUND (Camera lens array) ---
function ImageLensScanner3D() {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const scanLineRef = useRef();
  const { viewport } = useThree();

  // Shift image lens visualizer to the right side on desktop to prevent overlap
  const responsiveX = viewport.width > 6.5 ? viewport.width * 0.22 : 0;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.03;
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.03;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z = time * 0.4;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -time * 0.6;
    if (ring3Ref.current) ring3Ref.current.rotation.x = time * 0.5;
    if (scanLineRef.current) {
      scanLineRef.current.position.y = Math.sin(time * 1.6) * 1.2;
    }
  });

  return (
    <group ref={groupRef} position={[responsiveX, 0, 0]}>
      {/* Central Glassmorphic Camera Lens Sphere */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhysicalMaterial 
          color="#00f0ff" 
          emissive="#00f0ff"
          emissiveIntensity={0.2}
          transmission={0.9}
          thickness={1.2}
          roughness={0.15}
          metalness={0.1}
          clearcoat={1.0}
        />
      </mesh>

      {/* Inner Lens Core */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshPhysicalMaterial 
          color="#a855f7" 
          emissive="#a855f7"
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* Ring 1 (Outer target) */}
      <mesh ref={ring1Ref} position={[0, 0.1, 0]} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.3, 0.02, 8, 48]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.0} />
      </mesh>

      {/* Ring 2 (Middle bracket) */}
      <mesh ref={ring2Ref} position={[0, 0.1, 0.1]} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[0.95, 0.015, 8, 36]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.8} />
      </mesh>

      {/* Ring 3 (Inner bezel) */}
      <mesh ref={ring3Ref} position={[0, 0.1, -0.1]} rotation={[Math.PI / 2.2, 0.4, 0]}>
        <torusGeometry args={[0.7, 0.01, 8, 32]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.0} />
      </mesh>

      {/* Horizontal sweeping scan laser */}
      <mesh ref={scanLineRef} position={[0, 0, 0.3]}>
        <boxGeometry args={[2.8, 0.018, 0.018]} />
        <meshStandardMaterial 
          color="#00f0ff" 
          emissive="#00f0ff" 
          emissiveIntensity={2.0} 
        />
      </mesh>

      {/* Framing corners / HUD bounds */}
      <group position={[0, 0.1, 0]} scale={[1.4, 1.4, 1]}>
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([
                -0.8, 0.6, 0,  -0.5, 0.6, 0,
                -0.8, 0.6, 0,  -0.8, 0.3, 0,
                
                0.8, 0.6, 0,   0.5, 0.6, 0,
                0.8, 0.6, 0,   0.8, 0.3, 0,
                
                -0.8, -0.6, 0, -0.5, -0.6, 0,
                -0.8, -0.6, 0, -0.8, -0.3, 0,
                
                0.8, -0.6, 0,  0.5, -0.6, 0,
                0.8, -0.6, 0,  0.8, -0.3, 0
              ]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00f0ff" linewidth={1.5} opacity={0.6} transparent={true} />
        </line>
      </group>
    </group>
  );
}

// --- WAVY TECH GRID LANDSCAPE (Responsive styling) ---
function DataLandscape({ view = 'hub' }) {
  const terrainRef = useRef();
  const coordCache = useRef(null);

  let color = "#a855f7";
  let emissive = "#581c87";
  let speedFactor = 1.0;
  
  if (view === 'music') {
    color = "#ff007f";
    emissive = "#9d174d";
    speedFactor = 1.8; // Faster waves for music visualizer
  } else if (view === 'lens') {
    color = "#00f0ff";
    emissive = "#0369a1";
    speedFactor = 0.5; // Technical slow scanner grid
  }

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (terrainRef.current) {
      const posAttr = terrainRef.current.geometry.attributes.position;
      const count = posAttr.count;

      if (!coordCache.current || coordCache.current.length !== count * 2) {
        const cache = new Float32Array(count * 2);
        for (let i = 0; i < count; i++) {
          cache[i * 2] = posAttr.getX(i);
          cache[i * 2 + 1] = posAttr.getY(i);
        }
        coordCache.current = cache;
      }

      const cache = coordCache.current;
      const array = posAttr.array;

      for (let i = 0; i < count; i++) {
        const x = cache[i * 2];
        const y = cache[i * 2 + 1];
        array[i * 3 + 2] = 
          Math.sin(x * 0.45 + time * 1.0 * speedFactor) * Math.cos(y * 0.45 + time * 0.7 * speedFactor) * 0.4 +
          Math.cos(x * 0.9 - time * 0.8 * speedFactor) * 0.12;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <mesh 
      ref={terrainRef} 
      rotation={[-Math.PI / 2.3, 0, 0]} 
      position={[0, -2.2, -2.5]}
    >
      <planeGeometry args={[18, 18, 14, 14]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        wireframe={true}
        transparent={true}
        opacity={0.3}
      />
    </mesh>
  );
}

// --- FLOATING DATA DUST ---
function DataConstellation({ view = 'hub' }) {
  const pointsRef = useRef();
  const { mouse } = useThree();

  useFrame(() => {
    if (pointsRef.current) {
      const targetX = mouse.x * 2.5;
      const targetY = mouse.y * 2.5;
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, targetX, 0.04);
      pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, targetY, 0.04);
    }
  });

  const count = 350;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 18;
      pos[i + 1] = (Math.random() - 0.5) * 14;
      pos[i + 2] = (Math.random() - 0.5) * 12 - 2;
    }
    return pos;
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={view === 'music' ? '#ff007f' : view === 'lens' ? '#00f0ff' : '#a855f7'}
        transparent={true}
        opacity={0.45}
        sizeAttenuation={true}
      />
    </points>
  );
}

// --- MAIN 3D CANVAS WRAPPER ---
export default function Scene3D({ view = 'hub' }) {
  const renderCore = () => {
    switch (view) {
      case 'music':
        return <MusicVisualizer3D />;
      case 'lens':
        return <ImageLensScanner3D />;
      case 'hub':
      default:
        return <MachineLearningNetwork />;
    }
  };

  let lightColor1 = "#a855f7";
  let lightColor2 = "#00f0ff";
  let lightColor3 = "#ff007f";
  
  if (view === 'music') {
    lightColor1 = "#ff007f";
    lightColor2 = "#c084fc";
    lightColor3 = "#e879f9";
  } else if (view === 'lens') {
    lightColor1 = "#00f0ff";
    lightColor2 = "#38bdf8";
    lightColor3 = "#22d3ee";
  }

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 4.0], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        
        <pointLight position={[8, 5, 5]} intensity={1.5} color={lightColor1} />
        <pointLight position={[-8, -5, 5]} intensity={1.5} color={lightColor2} />
        <pointLight position={[0, -2, 4]} intensity={1.0} color={lightColor3} />

        <DataLandscape view={view} />

        {renderCore()}

        <DataConstellation view={view} />

        <Sparkles 
          count={70} 
          scale={[10, 8, 8]} 
          size={1.5} 
          speed={view === 'music' ? 0.8 : 0.45} 
          color={view === 'music' ? '#ff007f' : view === 'lens' ? '#00f0ff' : '#a855f7'} 
          opacity={0.35} 
        />
        
        <Stars 
          radius={70} 
          depth={35} 
          count={600} 
          factor={4} 
          saturation={0.5} 
          fade={true} 
          speed={view === 'music' ? 2.0 : 1.0} 
        />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={view === 'music' ? 0.65 : 0.25}
        />
      </Canvas>
    </div>
  );
}
