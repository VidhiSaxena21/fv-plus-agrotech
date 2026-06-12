'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { MotionValue } from 'framer-motion';
import { createWebGLRenderer, disposeWebGLRenderer } from '../utils/createWebGLRenderer';

interface PackagingModelCanvasProps {
  scrollYProgress?: MotionValue<number>;
  getProgress?: () => number;
  mode?: 'window' | 'story' | 'horizontal' | 'standalone';
}

export default function PackagingModelCanvas({ scrollYProgress, getProgress, mode = 'window' }: PackagingModelCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 200);
    camera.position.set(0, 0, mode === 'horizontal' ? 6 : 9);

    const renderer = createWebGLRenderer(canvas);
    if (!renderer) return;
    renderer.setSize(W, H);

    scene.add(new THREE.AmbientLight(0xffffff, 1.4));

    const key = new THREE.DirectionalLight(0xfff4e6, 2.8);
    key.position.set(4, 6, 8);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x6ee7b7, 1.2);
    fill.position.set(-5, 2, 4);
    scene.add(fill);

    const rim = new THREE.PointLight(0xfbbf24, 2, 18);
    rim.position.set(0, 3, 6);
    scene.add(rim);

    let model: THREE.Group | null = null;
    let raf = 0;

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0.08;
    let currentRotationY = 0;
    let currentRotationX = 0.08;

    const autoRotateSpeed = 0.003;
    let lastActiveTime = Date.now();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      if (canvas) canvas.style.cursor = 'grabbing';
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      lastActiveTime = Date.now();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging && model) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
        lastActiveTime = Date.now();
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      if (canvas) canvas.style.cursor = 'grab';
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
        lastActiveTime = Date.now();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && model && e.touches.length > 0) {
        const deltaX = e.touches[0].clientX - prevMouseX;
        const deltaY = e.touches[0].clientY - prevMouseY;
        targetRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.01;
        targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
        lastActiveTime = Date.now();
      }
    };

    if (mode === 'standalone') {
      canvas.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      canvas.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onMouseUp);
      canvas.style.cursor = 'grab';
    }

    const loader = new GLTFLoader();
    loader.load('/packaging3d/scene.gltf', (gltf) => {
      const raw = gltf.scene;
      const box = new THREE.Box3().setFromObject(raw);
      const center = box.getCenter(new THREE.Vector3());
      raw.position.sub(center);

      raw.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          if (m instanceof THREE.MeshStandardMaterial) {
            m.roughness = 0.45;
            m.metalness = 0.12;
            m.needsUpdate = true;
          }
        });
      });

      const getScale = () => {
        const mobile = W / H < 1.05;
        if (mode === 'story') return mobile ? 3.2 : 5.0; // Make model extremely large for story mode
        if (mode === 'standalone') return mobile ? 2.4 : 3.6; // Standalone model scale
        if (mode === 'horizontal') return 2.2;
        return mobile ? 0.85 : 1.05;
      };

      const pivot = new THREE.Group();
      pivot.add(raw);
      pivot.scale.setScalar(getScale());
      scene.add(pivot);
      model = pivot;
    });

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      const getScale = () => {
        const mobile = W / H < 1.05;
        if (mode === 'story') return mobile ? 3.2 : 5.0;
        if (mode === 'standalone') return mobile ? 2.4 : 3.6;
        if (mode === 'horizontal') return 2.2;
        return mobile ? 0.85 : 1.05;
      };
      if (model) model.scale.setScalar(getScale());
    };
    window.addEventListener('resize', onResize);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const ease = (t: number) => t * t * (3 - 2 * t);

    const animate = () => {
      raf = requestAnimationFrame(animate);

      const p = getProgress ? getProgress() : scrollYProgress?.get() ?? 0;

      // Standalone: always visible, handled separately
      if (mode === 'standalone') {
        if (!model) { renderer.render(scene, camera); return; }
        const floatY = Math.sin(Date.now() * 0.0012) * 0.08;
        const idleTime = Date.now() - lastActiveTime;
        if (!isDragging && idleTime > 1500) targetRotationY += autoRotateSpeed;
        currentRotationY = lerp(currentRotationY, targetRotationY, 0.08);
        currentRotationX = lerp(currentRotationX, targetRotationX, 0.08);
        model.position.set(0, floatY, 0);
        model.rotation.x = currentRotationX;
        model.rotation.y = currentRotationY;
        model.rotation.z = 0;
        renderer.render(scene, camera);
        return;
      }

      let opacity = 0;
      if (mode === 'horizontal') {
        opacity = 1;
      } else if (mode === 'story') {
        if (p < 0.05) {
          opacity = ease(clamp01(p / 0.05));
        } else if (p <= 0.88) {
          opacity = 1;
        } else {
          opacity = 1 - ease(clamp01((p - 0.88) / 0.08));
        }
      } else if (p >= 0.4 && p < 0.5) {
        opacity = ease(clamp01((p - 0.4) / 0.1));
      } else if (p >= 0.5 && p <= 0.95) {
        opacity = 1;
      } else if (p > 0.95) {
        opacity = 1 - ease(clamp01((p - 0.95) / 0.05));
      }
      container.style.opacity = String(opacity);
      container.style.visibility = opacity > 0.02 ? 'visible' : 'hidden';

      if (opacity <= 0.02) return;

      if (!model) {
        renderer.render(scene, camera);
        return;
      }

      const mobile = W / H < 1.05;
      const leftX = mobile ? 0 : -2.0;
      const rightX = mobile ? 0 : 2.0;
      const centerY = mobile ? -0.45 : -0.2;

      let posX = leftX;
      let tiltZ = 0.22;
      let tiltY = -0.35;
      const posZ = 0;

      if (mode === 'horizontal') {
        // Travel from left side (panel 1) to right side (panel 2) as scroll progresses
        const t = ease(clamp01(p));
        posX = lerp(-2.2, 2.2, t);
        tiltZ = lerp(0.14, -0.14, t);
        tiltY = lerp(-0.55, 0.55, t);
      } else if (mode === 'story') {
        if (p < 0.35) {
          posX = rightX;
          tiltY = 0.35;
          tiltZ = -0.22;
        } else if (p < 0.6) {
          const t = ease(clamp01((p - 0.35) / 0.15));
          posX = lerp(rightX, leftX, t);
          tiltY = lerp(0.35, -0.35, t);
          tiltZ = lerp(-0.22, 0.22, t);
        } else if (p < 0.8) {
          const t = ease(clamp01((p - 0.6) / 0.15));
          posX = lerp(leftX, rightX, t);
          tiltY = lerp(-0.35, 0.35, t);
          tiltZ = lerp(0.22, -0.22, t);
        } else {
          posX = rightX;
          tiltY = 0.35;
          tiltZ = -0.22;
        }
      } else if (p < 0.52) {
        posX = leftX;
        tiltZ = 0.22;
        tiltY = -0.35;
      } else if (p < 0.72) {
        const t = ease(clamp01((p - 0.52) / 0.2));
        posX = lerp(leftX, leftX, t);
        tiltZ = lerp(0.22, 0.22, t);
        tiltY = lerp(-0.35, -0.35, t);
      } else if (p < 0.88) {
        const t = ease(clamp01((p - 0.72) / 0.16));
        posX = lerp(leftX, rightX, t);
        tiltZ = lerp(0.22, -0.22, t);
        tiltY = lerp(-0.35, 0.35, t);
      } else {
        posX = rightX;
        tiltZ = -0.22;
        tiltY = 0.35;
      }

      const floatY = Math.sin(Date.now() * 0.0012) * 0.06;

      model.position.x = posX;
      model.position.y = centerY + floatY;
      model.position.z = posZ;
      model.rotation.x = 0.08;
      model.rotation.y = tiltY;
      model.rotation.z = tiltZ;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      if (mode === 'standalone') {
        canvas.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        canvas.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onMouseUp);
      }
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      disposeWebGLRenderer(renderer);
    };
  // scrollYProgress is stable; read via .get() in the animation loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (mode === 'standalone') {
    return (
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          width: '100%', height: '100%',
          opacity: 1,
          visibility: 'visible',
          pointerEvents: 'auto',
          zIndex: 20,
        }}
      >
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', background: 'transparent' }} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none ${mode === 'horizontal' ? 'z-[1]' : 'z-[12]'}`}
      style={{ opacity: 0, visibility: 'hidden' }}
    >
      <canvas ref={canvasRef} className="w-full h-full" style={{ background: 'transparent' }} />
    </div>
  );
}
