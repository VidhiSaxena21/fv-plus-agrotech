'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface PackagingModelProps {
  targetX?: number;
  targetRotY?: number;
  scale?: number;
  targetYOffset?: number;
}

export default function PackagingModel({
  targetX = 0,
  targetRotY = -0.28,
  scale = 12.0,
  targetYOffset = -1.2,
}: PackagingModelProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const targetXRef = useRef(targetX);
  const targetRotYRef = useRef(targetRotY);
  const scaleRef = useRef(scale);
  const targetYOffsetRef = useRef(targetYOffset);

  useEffect(() => { targetXRef.current = targetX; }, [targetX]);
  useEffect(() => { targetRotYRef.current = targetRotY; }, [targetRotY]);
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { targetYOffsetRef.current = targetYOffset; }, [targetYOffset]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.background = 'transparent';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 200);
    camera.position.set(0, 0, 6);

    scene.add(new THREE.AmbientLight(0xffffff, 2.0));
    const key = new THREE.DirectionalLight(0xfff4e6, 3.5);
    key.position.set(4, 6, 8);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x6ee7b7, 1.6);
    fill.position.set(-5, 2, 4);
    scene.add(fill);
    const rim = new THREE.PointLight(0xfbbf24, 3.0, 30);
    rim.position.set(0, 5, 6);
    scene.add(rim);

    let model: THREE.Group | null = null;
    let currentX = targetXRef.current;
    let currentRotY = targetRotYRef.current;

    const loader = new GLTFLoader();
    loader.load('/packaging3d/scene.gltf', (gltf) => {
      const raw = gltf.scene;

      const box = new THREE.Box3().setFromObject(raw);
      const center = box.getCenter(new THREE.Vector3());
      raw.position.sub(center);

      // Remove shadow base plane
      const toRemove: THREE.Object3D[] = [];
      raw.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const b = new THREE.Box3().setFromObject(child);
          const s = new THREE.Vector3();
          b.getSize(s);
          if (s.y < 0.12 && s.x > 0.3) toRemove.push(child);
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m) => {
            if (m instanceof THREE.MeshStandardMaterial) {
              m.roughness = 0.35;
              m.metalness = 0.1;
              m.needsUpdate = true;
            }
          });
        }
      });
      toRemove.forEach((o) => o.parent?.remove(o));

      raw.scale.setScalar(scaleRef.current);
      raw.rotation.x = 0.06;
      raw.rotation.z = 0.04;
      raw.position.y = targetYOffsetRef.current; // push down
      scene.add(raw);
      model = raw;
    });

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (model) model.scale.setScalar(scaleRef.current);
    };
    window.addEventListener('resize', onResize);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let raf = 0;
    let currentY = targetYOffsetRef.current;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (model) {
        currentX = lerp(currentX, targetXRef.current, 0.04);
        currentY = lerp(currentY, targetYOffsetRef.current, 0.04);
        currentRotY = lerp(currentRotY, targetRotYRef.current, 0.04);
        model.position.x = currentX;
        model.position.y = currentY + Math.sin(Date.now() * 0.0008) * 0.05;
        model.rotation.y = currentRotY;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    />
  );
}
