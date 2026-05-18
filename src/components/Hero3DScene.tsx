import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Hero3DScene — the full 3D landing-page hero in one component.
 *
 * Extracted from LandingPage.tsx so it can be lazy-loaded. This pulls
 * Three.js + @react-three/fiber + @react-three/drei out of the initial
 * bundle (~720 kB gzipped) onto a code-split chunk that only loads
 * when the landing page mounts. LCP improvement target: > 0.5s on the
 * homepage.
 */

function DotGlobe() {
  const groupRef = useRef<THREE.Group>(null);

  // Fibonacci sphere — evenly-distributed points on a sphere surface
  const positions = useMemo(() => {
    const count = 1800;
    const arr = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      arr[i * 3] = Math.cos(theta) * r * 4.8;
      arr[i * 3 + 1] = y * 4.8;
      arr[i * 3 + 2] = Math.sin(theta) * r * 4.8;
    }
    return arr;
  }, []);

  // Smooth constant rotation — no hover boost. Previous behaviour ramped the
  // Y-spin from 0.14 to 0.7 rad/s when the pointer entered the canvas, which
  // felt janky because the speed jumped discontinuously crossing the canvas
  // edge. Now: single constant Y-rotation + gentle X-oscillation. The hover
  // state and onPointerOver/Out handlers are gone — pointer events on the
  // canvas were also briefly intercepting clicks meant for the hero CTAs
  // (already mitigated by `relative z-10` on the text container, but removing
  // the listeners makes the canvas fully passive).
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#ffffff"
          transparent
          opacity={0.75}
          sizeAttenuation
        />
      </points>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.8, 0.012, 8, 200]} />
        <meshBasicMaterial color="#A8E6CF" transparent opacity={0.55} />
      </mesh>

      <mesh rotation={[Math.PI / 3, 0, Math.PI / 5]}>
        <torusGeometry args={[5.4, 0.009, 8, 200]} />
        <meshBasicMaterial color="#A1C9F1" transparent opacity={0.35} />
      </mesh>

      <mesh rotation={[Math.PI / 6, Math.PI / 4, 0]}>
        <torusGeometry args={[5.9, 0.007, 8, 200]} />
        <meshBasicMaterial color="#FFB7B2" transparent opacity={0.25} />
      </mesh>

      <mesh>
        <sphereGeometry args={[4.7, 32, 32]} />
        <meshBasicMaterial color="#4F46E5" transparent opacity={0.06} />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.1, 24, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

export default function Hero3DScene() {
  return (
    <Canvas camera={{ position: [0, 0, 7] }}>
      <ambientLight intensity={1.6} />
      <directionalLight position={[8, 10, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, -5, 5]} intensity={0.8} color="#A1C9F1" />
      <pointLight position={[5, 5, -5]} intensity={0.6} color="#FFB7B2" />

      <DotGlobe />

      <Sparkles count={120} scale={18} size={1.8} speed={0.15} opacity={0.5} color="#ffffff" />
      <Sparkles count={60} scale={14} size={2.5} speed={0.3} opacity={0.4} color="#A8E6CF" />
      <Sparkles count={60} scale={14} size={2.5} speed={0.25} opacity={0.4} color="#A1C9F1" />
    </Canvas>
  );
}
