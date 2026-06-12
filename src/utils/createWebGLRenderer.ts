import * as THREE from 'three';

export function createWebGLRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer | null {
  try {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    return renderer;
  } catch {
    return null;
  }
}

export function disposeWebGLRenderer(renderer: THREE.WebGLRenderer) {
  const gl = renderer.getContext();
  renderer.dispose();
  gl.getExtension('WEBGL_lose_context')?.loseContext();
}
