'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera,
  ContactShadows,
  MeshTransmissionMaterial,
  Icosahedron,
  Sphere
} from '@react-three/drei';

function SimpleFloatingElements() {
  const groupRef = useRef<THREE.Group>(null);
  const elements = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ] as [number, number, number],
      scale: 0.5 + Math.random() * 1,
      speed: 0.5 + Math.random() * 1,
      phase: Math.random() * Math.PI * 2
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      elements.forEach((element, i) => {
        const mesh = groupRef.current?.children[i];
        if (mesh) {
          mesh.position.y = element.position[1] + Math.sin(state.clock.elapsedTime * element.speed + element.phase) * 0.3;
          mesh.rotation.y = state.clock.elapsedTime * 0.15;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {elements.map((element, i) => (
        <Icosahedron
          key={i}
          args={[element.scale, 0]}
          position={element.position}
        >
          <MeshTransmissionMaterial
            backside
            samples={2}
            thickness={0.5}
            roughness={0.3}
            transmission={0.8}
            color="#4BF98D"
          />
        </Icosahedron>
      ))}
    </group>
  );
}

function SimpleParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 500;
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.08}
        color="#4BF98D"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CentralSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <Sphere args={[1.2, 32, 32]} ref={meshRef}>
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={1}
        roughness={0.1}
        transmission={0.9}
        color="#114224"
      />
    </Sphere>
  );
}

function SimpleLightRig() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[8, 8, 8]} intensity={1.5} color="#4BF98D" />
      <pointLight position={[-8, -8, -8]} intensity={1} color="#A68A42" />
    </>
  );
}

export function Environment3DMobile() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        gl={{ 
          antialias: false,
          alpha: true,
          powerPreference: 'low-power'
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
          autoRotate
          autoRotateSpeed={0.3}
        />
        
        <SimpleLightRig />
        <Environment preset="forest" />
        
        <SimpleParticles />
        <SimpleFloatingElements />
        <CentralSphere />
        
        <ContactShadows
          position={[0, -4, 0]}
          opacity={0.2}
          scale={15}
          blur={1.5}
          far={8}
        />
      </Canvas>
    </div>
  );
}