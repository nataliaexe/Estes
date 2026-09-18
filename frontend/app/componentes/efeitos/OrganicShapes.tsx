'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';

function OrganicBlob({ position, scale, color, speed }: { position: [number, number, number], scale: number, color: string, speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * speed;
      meshRef.current.position.y = position[1] + Math.sin(time) * 0.5;
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.3;
      meshRef.current.rotation.y = time * 0.2;
      
      // Deform geometry slightly
      const geometry = meshRef.current.geometry;
      const positions = geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        const noise = Math.sin(x * 2 + time) * Math.cos(y * 2 + time) * 0.1;
        positions.setZ(i, z + noise);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          thickness={1.5}
          roughness={0.15}
          transmission={0.95}
          chromaticAberration={0.12}
          anisotropy={0.6}
          distortion={0.6}
          distortionScale={0.9}
          temporalDistortion={0.4}
          iridescence={1}
          iridescenceIOR={2.2}
          iridescenceThicknessRange={[0, 2200]}
          color={color}
        />
      </mesh>
    </Float>
  );
}

function CrystallineStructure() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI) / 3) * 4,
            Math.sin((i * Math.PI) / 3) * 2,
            Math.sin((i * Math.PI) / 3) * 4
          ]}
          rotation={[i * 0.5, i * 0.3, 0]}
        >
          <octahedronGeometry args={[0.8, 0]} />
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={0.8}
            roughness={0.2}
            transmission={0.9}
            chromaticAberration={0.1}
            iridescence={1}
            iridescenceIOR={1.8}
            iridescenceThicknessRange={[0, 1800]}
            color="#A68A42"
          />
        </mesh>
      ))}
    </group>
  );
}

function VineNetwork() {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pts = [];
    for (let i = 0; i < 20; i++) {
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 20
      );
      const end = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 20
      );
      pts.push(start, end);
    }
    
    const positions = new Float32Array(pts.flatMap(p => [p.x, p.y, p.z]));
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.05;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        color="#4BF98D"
        transparent
        opacity={0.3}
        linewidth={1}
      />
    </lineSegments>
  );
}

function FloatingLeaves() {
  const groupRef = useRef<THREE.Group>(null);
  const leaves = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 18
      ] as [number, number, number],
      rotation: Math.random() * Math.PI * 2,
      scale: 0.3 + Math.random() * 0.5,
      speed: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      leaves.forEach((leaf, i) => {
        const mesh = groupRef.current?.children[i];
        if (mesh) {
          mesh.position.y = leaf.position[1] + Math.sin(state.clock.elapsedTime * leaf.speed + leaf.phase) * 0.4;
          mesh.rotation.x = leaf.rotation + state.clock.elapsedTime * 0.3;
          mesh.rotation.y = leaf.rotation * 0.5 + state.clock.elapsedTime * 0.2;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {leaves.map((leaf, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
          <mesh position={leaf.position} rotation={[leaf.rotation, leaf.rotation * 0.5, 0]} scale={leaf.scale}>
            <coneGeometry args={[0.3, 1, 4]} />
            <meshStandardMaterial
              color="#114224"
              emissive="#4BF98D"
              emissiveIntensity={0.2}
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function OrganicShapes() {
  return (
    <>
      <OrganicBlob position={[-5, 2, -3]} scale={2} color="#4BF98D" speed={0.8} />
      <OrganicBlob position={[6, -1, 2]} scale={1.5} color="#A68A42" speed={1.2} />
      <OrganicBlob position={[0, 4, -5]} scale={1.8} color="#114224" speed={0.6} />
      <CrystallineStructure />
      <VineNetwork />
      <FloatingLeaves />
    </>
  );
}