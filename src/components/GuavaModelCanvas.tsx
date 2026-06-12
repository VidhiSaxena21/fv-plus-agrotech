'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { MotionValue } from 'framer-motion';
import { createWebGLRenderer, disposeWebGLRenderer } from '../utils/createWebGLRenderer';

interface GuavaModelCanvasProps {
  scrollYProgress: MotionValue<number>;
}

export default function GuavaModelCanvas({ scrollYProgress }: GuavaModelCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    // ── Scene ──────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ── Camera ─────────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
    camera.position.set(0, 0, 10);

    // ── Renderer ───────────────────────────────────────────────────────────────
    const renderer = createWebGLRenderer(canvas);
    if (!renderer) {
      console.warn('WebGL not available');
      return;
    }
    renderer.setSize(W, H);

    // ── Lights ─────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 2.0));

    const dir1 = new THREE.DirectionalLight(0xffffff, 3);
    dir1.position.set(5, 8, 5);
    scene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0xffffff, 1.5);
    dir2.position.set(-5, 3, -3);
    scene.add(dir2);

    // Pink inner light — simulates warm flesh tone from inside the fruit
    const pinkLight = new THREE.PointLight(0xff69b4, 4, 15);
    pinkLight.position.set(0, 0, 3);
    scene.add(pinkLight);

    // Green rim
    const rimLight = new THREE.PointLight(0x10b981, 2.5, 20);
    rimLight.position.set(-3, 0, 5);
    scene.add(rimLight);

    // ── State ──────────────────────────────────────────────────────────────────
    let model: THREE.Group | null = null;
    const mouse = { tx: 0, ty: 0, x: 0, y: 0 };
    let raf = 0;

    // ── Layout ─────────────────────────────────────────────────────────────────
    const getLayout = () => {
      const aspect = W / H;
      const mobile = aspect < 1.1;
      return {
        mobile,
        rightX: mobile ? 0 : 3.0,
        rightY: mobile ? -1.5 : -0.2,
        leftX:  mobile ? 0 : -3.0,
        leftY:  mobile ? 1.0 : -0.2,
        offX:   mobile ? 0 : -6.0,
        scale:  mobile ? 0.04 : 0.06,
      };
    };
    let layout = getLayout();

    // ── Load scene.gltf ────────────────────────────────────────────────────────
    const loader = new GLTFLoader();
    loader.load(
      '/3dmodel1/scene.gltf',
      (gltf) => {
        const raw = gltf.scene;

        // Centre the model at origin
        const box    = new THREE.Box3().setFromObject(raw);
        const center = box.getCenter(new THREE.Vector3());
        raw.position.sub(center);

        // ── Pink tint on inner / flesh-facing meshes ───────────────────────────
        // Strategy: meshes whose base-colour is warm (high R, lower G/B) or
        // whose name hints at "flesh"/"inner"/"pulp" get a pink emissive boost.
        // For meshes without those hints we still add a very subtle pink emissive
        // so everything reads slightly warmer from inside.
        raw.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          const mats = Array.isArray(child.material)
            ? child.material
            : [child.material];

          mats.forEach((mat) => {
            if (!(mat instanceof THREE.MeshStandardMaterial)) return;

            const name = (mat.name + child.name).toLowerCase();
            const isInner =
              name.includes('flesh') ||
              name.includes('inner') ||
              name.includes('pulp')  ||
              name.includes('inside') ||
              name.includes('meat');

            if (isInner) {
              // Strong pink emissive for explicit inner meshes
              mat.emissive     = new THREE.Color(0xff4da6);
              mat.emissiveIntensity = 0.55;
            } else {
              // Subtle warm-pink blush for everything else
              mat.emissive     = new THREE.Color(0xff2d78);
              mat.emissiveIntensity = 0.12;
            }
            mat.needsUpdate = true;
          });
        });

        // Wrap in pivot group
        const pivot = new THREE.Group();
        pivot.add(raw);
        pivot.scale.setScalar(layout.scale);
        pivot.position.set(layout.rightX, layout.rightY, 0);

        scene.add(pivot);
        model = pivot;

        console.log('✅ scene.gltf loaded with pink inner tint');
      },
      (progress) => {
        if (progress.total > 0)
          console.log(`Loading: ${Math.round((progress.loaded / progress.total) * 100)}%`);
      },
      (err) => console.error('❌ Failed to load scene.gltf:', err),
    );

    // ── Mouse tracking ─────────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / W - 0.5) * 2;
      mouse.ty = (e.clientY / H - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Resize ─────────────────────────────────────────────────────────────────
    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      layout = getLayout();
      if (model) model.scale.setScalar(layout.scale);
    };
    window.addEventListener('resize', onResize);

    // ── Lerp ───────────────────────────────────────────────────────────────────
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // ── Animate ────────────────────────────────────────────────────────────────
    const animate = () => {
      raf = requestAnimationFrame(animate);

      mouse.x = lerp(mouse.x, mouse.tx, 0.06);
      mouse.y = lerp(mouse.y, mouse.ty, 0.06);

      const p = scrollYProgress.get();

      // Opacity: visible in panels 0 & 1, fade during transition to panel 2
      let opacity = 1;
      if (p > 0.42 && p < 0.50) {
        opacity = 1 - (p - 0.42) / 0.08;
      } else if (p >= 0.50) {
        opacity = 0;
      }
      container.style.opacity    = String(opacity);
      container.style.pointerEvents = 'none';

      if (!model) {
        renderer.render(scene, camera);
        return;
      }

      // Position & spin driven by scroll
      let posX: number, posY: number;
      let spinY = 0;

      if (p < 0.20) {
        // Panel 0 — right side
        posX  = layout.rightX;
        posY  = layout.rightY;
        spinY = 0;
      } else if (p < 0.25) {
        // Transition 0 → 1: 360° roll + slide left
        const t    = (p - 0.20) / 0.05;
        const ease = t * t * (3 - 2 * t);
        posX  = lerp(layout.rightX, layout.leftX, ease);
        posY  = lerp(layout.rightY, layout.leftY, ease);
        spinY = ease * Math.PI * 2;
      } else if (p < 0.42) {
        // Panel 1 — left side
        posX  = layout.leftX;
        posY  = layout.leftY;
        spinY = Math.PI * 2;
      } else {
        // Fading off-screen
        const t    = Math.min(1, (p - 0.42) / 0.08);
        const ease = t * t * (3 - 2 * t);
        posX  = lerp(layout.leftX, layout.offX, ease);
        posY  = layout.leftY;
        spinY = Math.PI * 2 + ease * Math.PI;
      }

      const cursorOffsetX = mouse.x * 0.4;
      const cursorOffsetY = -mouse.y * 0.3;

      model.position.x = posX + cursorOffsetX;
      model.position.y = posY + cursorOffsetY;
      model.position.z = 0;

      // Rotation: scroll-driven + 180° offset + cursor tilt (no ambient spin)
      model.rotation.x = mouse.y * 0.2;
      model.rotation.y = spinY + Math.PI + mouse.x * 0.3;
      model.rotation.z = 0;

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ────────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      disposeWebGLRenderer(renderer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 30 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
