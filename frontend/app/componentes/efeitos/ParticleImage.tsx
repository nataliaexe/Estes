"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface ParticleImageProps {
  imageUrl: string;
  width?: string | number;
  height?: string | number;
  particleCount?: number;
  particleSize?: number;
  speed?: number;
  cursorStrength?: number;
  cursorRadius?: number;
  className?: string;
  children?: React.ReactNode;
  /** Cor base quando não há imagem */
  fallbackColor?: string;
}

/**
 * Particle Image (custom, baseado em Three.js + GLSL)
 *
 * Uma imagem é amostrada em uma textura e reconstruída como partículas GPU
 * que respondem ao mouse. As partículas se afastam quando o cursor passa
 * e voltam à posição original (home) com mola.
 *
 * Inspirado no componente Particle Image do React Bits Pro, mas escrito
 * do zero — sem licença, sem dependência externa além do three.
 */
export function ParticleImage({
  imageUrl,
  width = "100%",
  height = "100%",
  particleCount = 8000,
  particleSize = 2.0,
  speed = 1.0,
  cursorStrength = 0.15,
  cursorRadius = 100,
  className = "",
  children,
  fallbackColor = "#4bf98d",
}: ParticleImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5, vx: 0, vy: 0, active: false });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let mounted = true;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Carrega a imagem como textura
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";

    loader.load(
      imageUrl,
      (texture) => {
        if (!mounted) return;

        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        // Pega dimensões reais
        const img = texture.image as HTMLImageElement;
        const aspect = img.width / img.height;

        function resize() {
          if (!container) return;
          const w = container.clientWidth;
          const h = container.clientHeight;
          renderer.setSize(w, h, false);
          canvas.width = w * renderer.getPixelRatio();
          canvas.height = h * renderer.getPixelRatio();

          // Ajusta uniforme de aspect
          if (material) {
            material.uniforms.uAspect.value = w / h;
            material.uniforms.uImageAspect.value = aspect;
          }
        }

        // ============================================================
        // GEOMETRIA — grid de partículas
        // ============================================================
        const count = Math.floor(Math.sqrt(particleCount)) ** 2; // quadrado perfeito
        const gridSize = Math.sqrt(count);
        const positions = new Float32Array(count * 3);
        const randoms = new Float32Array(count * 2);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
          const ix = i % gridSize;
          const iy = Math.floor(i / gridSize);
          // posições em [-1, 1]
          positions[i * 3] = (ix / (gridSize - 1)) * 2 - 1;
          positions[i * 3 + 1] = (iy / (gridSize - 1)) * 2 - 1;
          positions[i * 3 + 2] = 0;

          randoms[i * 2] = Math.random() * 2 - 1;
          randoms[i * 2 + 1] = Math.random() * 2 - 1;
          sizes[i] = particleSize * (0.5 + Math.random() * 0.8);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );
        geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 2));
        geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

        // ============================================================
        // SHADERS
        // ============================================================
        const vertexShader = `
          attribute vec2 aRandom;
          attribute float aSize;
          uniform float uTime;
          uniform float uAspect;
          uniform float uImageAspect;
          uniform vec2 uMouse;
          uniform float uMouseActive;
          uniform float uCursorRadius;
          uniform float uCursorStrength;
          varying vec2 vUv;
          varying float vDist;

          void main() {
            vUv = position.xy * 0.5 + 0.5;

            // Ajusta aspect
            vec3 pos = position;
            if (uAspect > uImageAspect) {
              pos.x /= uImageAspect / uAspect;
            } else {
              pos.y *= uImageAspect / uAspect;
            }

            // Calcula distância do mouse (normalizado)
            vec2 toMouse = pos.xy - uMouse;
            float dist = length(toMouse);
            vDist = dist;

            // Empurra partículas que estão perto do mouse
            float influence = smoothstep(uCursorRadius, 0.0, dist * uCursorRadius);
            influence *= uMouseActive * uCursorStrength;

            // Direção do empurrão
            vec2 dir = normalize(toMouse + vec2(0.001));
            pos.xy += dir * influence;

            // Adiciona movimento "idle" (respiração)
            pos.x += sin(uTime * 0.5 + aRandom.x * 6.28) * 0.002;
            pos.y += cos(uTime * 0.5 + aRandom.y * 6.28) * 0.002;

            gl_Position = vec4(pos.xy, 0.0, 1.0);
            gl_PointSize = aSize * (1.0 + influence * 3.0) * 2.0;
          }
        `;

        const fragmentShader = `
          precision mediump float;
          uniform sampler2D uTexture;
          uniform float uOpacity;
          uniform float uTime;
          varying vec2 vUv;
          varying float vDist;

          void main() {
            // Descarta pixels fora do círculo (partículas redondas)
            vec2 pc = gl_PointCoord - 0.5;
            float d = length(pc);
            if (d > 0.5) discard;

            // Amostra a cor da imagem
            vec4 texColor = texture2D(uTexture, vUv);

            // Brilho pulsante sutil
            float pulse = 0.9 + 0.1 * sin(uTime * 2.0);
            float glow = smoothstep(0.5, 0.0, d) * pulse;

            // Aumenta luminosidade perto do mouse (highlight)
            float mouseHighlight = smoothstep(0.3, 0.0, vDist) * 0.8;
            vec3 color = texColor.rgb + mouseHighlight * vec3(0.29, 0.97, 0.55);

            gl_FragColor = vec4(color, glow * texColor.a * uOpacity);
          }
        `;

        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uTime: { value: 0 },
            uAspect: { value: 1 },
            uImageAspect: { value: aspect },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uMouseActive: { value: 0 },
            uCursorRadius: { value: cursorRadius / 500 },
            uCursorStrength: { value: cursorStrength },
            uOpacity: { value: 0.9 },
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(container);

        // ============================================================
        // MOUSE TRACKING
        // ============================================================
        function onPointerMove(e: PointerEvent) {
          const rect = container!.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = 1 - (e.clientY - rect.top) / rect.height;
          mouseRef.current.x = x * 2 - 1;
          mouseRef.current.y = y * 2 - 1;
          mouseRef.current.active = true;
        }

        function onPointerLeave() {
          mouseRef.current.active = false;
        }

        container.addEventListener("pointermove", onPointerMove);
        container.addEventListener("pointerleave", onPointerLeave);

        // ============================================================
        // LOOP
        // ============================================================
        const clock = new THREE.Clock();
        let frameId = 0;

        function animate() {
          if (!mounted) return;
          const t = clock.getElapsedTime();

          material.uniforms.uTime.value = t * speed;
          material.uniforms.uMouse.value.lerp(
            new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
            0.1
          );
          material.uniforms.uMouseActive.value +=
            ((mouseRef.current.active ? 1 : 0) -
              material.uniforms.uMouseActive.value) *
            0.1;

          renderer.render(scene, camera);
          frameId = requestAnimationFrame(animate);
        }

        animate();
        setLoaded(true);

        return () => {
          cancelAnimationFrame(frameId);
          ro.disconnect();
          container.removeEventListener("pointermove", onPointerMove);
          container.removeEventListener("pointerleave", onPointerLeave);
          geometry.dispose();
          material.dispose();
          texture.dispose();
          renderer.dispose();
        };
      },
      undefined,
      () => {
        // fallback se imagem falhar
        setLoaded(true);
      }
    );

    return () => {
      mounted = false;
      renderer.dispose();
    };
  }, [imageUrl, particleCount, particleSize, speed, cursorStrength, cursorRadius]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-elfo-verde-vivo border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 1s" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
