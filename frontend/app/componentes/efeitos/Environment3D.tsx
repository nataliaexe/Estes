'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { 
  OrbitControls, 
  Environment, 
  Float, 
  PerspectiveCamera,
  ContactShadows,
  MeshTransmissionMaterial,
  Icosahedron,
  Sphere,
  Torus
} from '@react-three/drei';
import { gsap } from 'gsap';
import { AtmosphericEffects } from './AtmosphericEffects';
import { Cursor3D } from './Cursor3D';
import { OrganicShapes } from './OrganicShapes';

function FloatingPlants() {
  const groupRef = useRef<THREE.Group>(null);
  const plants = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ] as [number, number, number],
      scale: 0.5 + Math.random() * 1.5,
      rotation: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      plants.forEach((plant, i) => {
        const mesh = groupRef.current?.children[i];
        if (mesh) {
          mesh.position.y = plant.position[1] + Math.sin(state.clock.elapsedTime * plant.speed + plant.phase) * 0.5;
          mesh.rotation.y = plant.rotation + state.clock.elapsedTime * 0.2;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {plants.map((plant, i) => (
        <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <Icosahedron
            args={[plant.scale, 1]}
            position={plant.position}
            rotation={[plant.rotation, plant.rotation * 0.5, 0]}
          >
            <MeshTransmissionMaterial
              backside
              samples={4}
              thickness={0.5}
              roughness={0.2}
              transmission={0.9}
              chromaticAberration={0.1}
              anisotropy={0.3}
              distortion={0.3}
              distortionScale={0.5}
              temporalDistortion={0.2}
              iridescence={1}
              iridescenceIOR={1.5}
              iridescenceThicknessRange={[0, 1400]}
              color="#4BF98D"
            />
          </Icosahedron>
        </Float>
      ))}
    </group>
  );
}

function GlowingParticles({ particleCount = 2000 }: { particleCount?: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = particleCount;
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      const color = new THREE.Color();
      color.setHSL(0.35 + Math.random() * 0.1, 0.8, 0.6);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function OrganicShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.x = time * 0.3 + mouse.y * 0.5;
      meshRef.current.rotation.y = time * 0.2 + mouse.x * 0.5;
      
      // Pulsing effect
      const scale = 1 + Math.sin(time * 0.5) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.3} floatIntensity={0.5}>
      <Torus args={[3, 0.8, 16, 100]} ref={meshRef}>
        <MeshTransmissionMaterial
          backside
          samples={8}
          thickness={1}
          roughness={0.1}
          transmission={0.95}
          chromaticAberration={0.15}
          anisotropy={0.5}
          distortion={0.5}
          distortionScale={0.8}
          temporalDistortion={0.3}
          iridescence={1}
          iridescenceIOR={2}
          iridescenceThicknessRange={[0, 2000]}
          color="#A68A42"
        />
      </Torus>
    </Float>
  );
}

function CentralElement({ samples = 16 }: { samples?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: hovered ? 1.2 : 1,
        y: hovered ? 1.2 : 1,
        z: hovered ? 1.2 : 1,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [hovered]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.6;
    }
  });

  return (
    <Sphere args={[1.5, 64, 64]} ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <MeshTransmissionMaterial
        backside
        samples={samples}
        thickness={2}
        roughness={0.05}
        transmission={0.98}
        chromaticAberration={0.2}
        anisotropy={0.8}
        distortion={0.8}
        distortionScale={1}
        temporalDistortion={0.5}
        iridescence={1}
        iridescenceIOR={2.5}
        iridescenceThicknessRange={[0, 2500]}
        color="#114224"
      />
    </Sphere>
  );
}

function LightRig() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#4BF98D" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#A68A42" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        color="#EAE5D8"
      />
    </>
  );
}

export function Environment3D({ quality = 'high' }: { quality?: 'high' | 'medium' | 'low' }) {
  const qualitySettings = {
    high: { antialias: true, dpr: [1, 2] as [number, number], particles: 2000, samples: 16 },
    medium: { antialias: true, dpr: [1, 1.5] as [number, number], particles: 1000, samples: 8 },
    low: { antialias: false, dpr: [1, 1] as [number, number], particles: 500, samples: 4 }
  };

  const settings = qualitySettings[quality];

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        gl={{ 
          antialias: settings.antialias,
          alpha: true,
          powerPreference: quality === 'low' ? 'low-power' : 'high-performance'
        }}
        dpr={settings.dpr}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
            autoRotate
            autoRotateSpeed={0.5}
          />
          
          <LightRig />
          <Environment preset="forest" />
          
          {quality !== 'low' && <Cursor3D />}
          <AtmosphericEffects />
          {quality !== 'low' && <OrganicShapes />}
          <GlowingParticles particleCount={settings.particles} />
          <FloatingPlants />
          <OrganicShape />
          <CentralElement samples={settings.samples} />
          
          <ContactShadows
            position={[0, -5, 0]}
            opacity={0.3}
            scale={20}
            blur={2}
            far={10}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}