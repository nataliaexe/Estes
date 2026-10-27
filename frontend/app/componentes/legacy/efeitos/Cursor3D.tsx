'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Cursor3D() {
  const { camera, mouse } = useThree();
  const cursorRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Group>(null);
  const trailPositions = useRef<THREE.Vector3[]>([]);

  useEffect(() => {
    trailPositions.current = Array.from({ length: 10 }, () => new THREE.Vector3());
  }, []);

  useFrame((state) => {
    if (cursorRef.current && trailRef.current) {
      // Convert mouse to 3D position
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance * 0.5));

      cursorRef.current.position.lerp(pos, 0.1);

      // Update trail
      trailPositions.current.unshift(pos.clone());
      trailPositions.current.pop();

      trailRef.current.children.forEach((mesh, i) => {
        const targetPos = trailPositions.current[i] || pos;
        mesh.position.lerp(targetPos, 0.3);
        mesh.scale.setScalar(1 - i * 0.08);
      });
    }
  });

  return (
    <>
      <mesh ref={cursorRef}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial
          color="#4BF98D"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <group ref={trailRef}>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial
              color="#A68A42"
              transparent
              opacity={0.4 - i * 0.04}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}