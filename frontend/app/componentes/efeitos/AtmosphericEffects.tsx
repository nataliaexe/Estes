'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FogParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 500;
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      particlesRef.current.rotation.y = time * 0.02;
      
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(time + i) * 0.01;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={1}
        sizeAttenuation
        transparent
        opacity={0.3}
        color="#EAE5D8"
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingSpores() {
  const groupRef = useRef<THREE.Group>(null);
  const spores = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 20
      ] as [number, number, number],
      scale: 0.1 + Math.random() * 0.3,
      speed: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      spores.forEach((spore, i) => {
        const mesh = groupRef.current?.children[i];
        if (mesh) {
          mesh.position.y = spore.position[1] + Math.sin(state.clock.elapsedTime * spore.speed + spore.phase) * 0.3;
          mesh.position.x = spore.position[0] + Math.cos(state.clock.elapsedTime * spore.speed * 0.5 + spore.phase) * 0.2;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {spores.map((spore, i) => (
        <mesh key={i} position={spore.position} scale={spore.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color="#4BF98D"
            emissive="#4BF98D"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function LightBeams() {
  const beamsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (beamsRef.current) {
      beamsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={beamsRef}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} rotation={[0, (i * Math.PI) / 3, 0]} position={[0, 5, 0]}>
          <cylinderGeometry args={[0.1, 2, 20, 8, 1, true]} />
          <meshBasicMaterial
            color="#A68A42"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function AmbientGlow() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef} scale={[15, 15, 15]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#114224"
        transparent
        opacity={0.05}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

export function AtmosphericEffects() {
  return (
    <>
      <FogParticles />
      <FloatingSpores />
      <LightBeams />
      <AmbientGlow />
    </>
  );
}