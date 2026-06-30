'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface PackagingModelProps {
  targetX?: number;
  targetRotY?: number;
  scale?: number;
  targetYOffset?: number;
  /** Hex string like '#ff4500' — tints the model emissive on every frame */
  accentColor?: string;
}

export default function PackagingModel({
  targetX = 0,
  targetRotY = -0.28,
  scale = 12.0,
  targetYOffset = -1.2,
  accentColor = '#39ff14',
}: PackagingModelProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const targetXRef = useRef(targetX);
  const targetRotYRef = useRef(targetRotY);
  const scaleRef = useRef(scale);
  const targetYOffsetRef = useRef(targetYOffset);
  const accentColorRef = useRef(accentColor);

  useEffect(() => { targetXRef.current = targetX; }, [targetX]);
  useEffect(() => { targetRotYRef.current = targetRotY; }, [targetRotY]);
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { targetYOffsetRef.current = targetYOffset; }, [targetYOffset]);
  useEffect(() => { accentColorRef.current = accentColor; }, [accentColor]);

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

    scene.add(new THREE.AmbientLight(0xffffff, 2.2));
    const key = new THREE.DirectionalLight(0xffffff, 3.0);
    key.position.set(4, 6, 8);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 1.4);
    fill.position.set(-5, 2, 4);
    scene.add(fill);
    // Dynamic accent point light — colour matches accentColor
    const accentLight = new THREE.PointLight(0xffffff, 4.0, 25);
    accentLight.position.set(0, 2, 5);
    scene.add(accentLight);

    let model: THREE.Group | null = null;
    let currentX = targetXRef.current;
    let currentRotY = targetRotYRef.current;

    // Collect all mesh materials for live tinting
    // const colorMats: THREE.MeshStandardMaterial[] = [];
    // Collect all mesh materials with their names
const colorMats: {
  material: THREE.MeshStandardMaterial;
  name: string;
}[] = [];
    const currentEmissive = new THREE.Color(accentColorRef.current);
    const targetEmissive = new THREE.Color(accentColorRef.current);

    const loader = new GLTFLoader();
    loader.load('/fortnite_slurp_juice/scene.gltf', (gltf) => {
      const raw = gltf.scene;

      const box = new THREE.Box3().setFromObject(raw);
      const center = box.getCenter(new THREE.Vector3());
      raw.position.sub(center);

      // Normalize size so maximum dimension is 1.0
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) raw.scale.multiplyScalar(1.0 / maxDim);

      raw.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m) => {
            if (m instanceof THREE.MeshStandardMaterial) {
              m.roughness = 0.1;
              m.metalness = 0.05;
              m.emissive = currentEmissive.clone();
              m.emissiveIntensity = 0.55;
              m.needsUpdate = true;
              colorMats.push({
  material: m,
  name: m.name,
});
            }
          });
        }
      });

      raw.scale.multiplyScalar(scaleRef.current * 0.28);
      raw.rotation.x = 0.06;
      raw.rotation.z = 0.04;
      raw.position.y = targetYOffsetRef.current;
      scene.add(raw);
      model = raw;
    });

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let raf = 0;
    let currentY = targetYOffsetRef.current;

    const animate = () => {
      raf = requestAnimationFrame(animate);

      if (model) {
        // Position & rotation lerp
        currentX = lerp(currentX, targetXRef.current, 0.04);
        currentY = lerp(currentY, targetYOffsetRef.current, 0.04);
        currentRotY = lerp(currentRotY, targetRotYRef.current, 0.04);
        model.position.x = currentX;
        model.position.y = currentY + Math.sin(Date.now() * 0.0008) * 0.05;
        model.rotation.y = currentRotY;

        // Smooth colour transition
        targetEmissive.set(accentColorRef.current);
        currentEmissive.lerp(targetEmissive, 0.06);
        accentLight.color.copy(currentEmissive);

    colorMats.forEach(({ material, name }) => {

  // Don't change the bottle glass
  if (name === "shield") return;

  material.emissive.copy(currentEmissive);
  material.color.copy(currentEmissive);

  material.needsUpdate = true;
});
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
