import React, { type CSSProperties, type ReactNode, useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface ThreeBackgroundProps {
  /** Number of floating particles */
  particleCount?: number;
  /** Particle color */
  color?: string;
  /** Background color */
  backgroundColor?: string;
  /** Particle size */
  particleSize?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Width of the canvas container */
  width?: CSSProperties['width'];
  /** Height of the canvas container */
  height?: CSSProperties['height'];
  /** Optional overlay content rendered above the canvas */
  children?: ReactNode;
}

/** Animated Three.js particle background */
export const ThreeBackground = ({
  particleCount = 200,
  color = '#6366f1',
  backgroundColor = '#0f0f0f',
  particleSize = 2,
  speed = 1,
  width = 600,
  height = 400,
  children,
}: ThreeBackgroundProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(backgroundColor);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 50;

    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: particleSize * 0.1,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const resize = () => {
      const nextWidth = mount.clientWidth;
      const nextHeight = mount.clientHeight;

      if (nextWidth === 0 || nextHeight === 0) return;

      renderer.setSize(nextWidth, nextHeight, false);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    let animFrameId: number;
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      particles.rotation.x += 0.0005 * speed;
      particles.rotation.y += 0.001 * speed;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [particleCount, color, backgroundColor, particleSize, speed, width, height]);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        display: 'block',
        overflow: 'hidden',
        borderRadius: 24,
      }}
    >
      <div
        ref={mountRef}
        style={{
          position: 'absolute',
          inset: 0,
        }}
      />
      {children ? (
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};
