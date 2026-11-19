import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/**
 * Interactive 3D castor-oil bottle — parametric lathe geometry, physical glass
 * material with transmission, golden liquid core and cork. Auto-rotates gently
 * and can be dragged. Falls back to the static product photo when WebGL is
 * unavailable. Decorative only (aria-hidden).
 */
export function Bottle3D({ poster, posterAlt }: { poster: string; posterAlt: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    camera.position.set(0, 1.9, 7.2);
    camera.lookAt(0, 1.55, 0);

    // ---- lighting: warm key + gold & hibiscus rims ----
    scene.add(new THREE.AmbientLight(0xfff3e0, 0.25));
    const key = new THREE.DirectionalLight(0xffe9c4, 2.2);
    key.position.set(3, 6, 4);
    scene.add(key);
    const goldRim = new THREE.PointLight(0xf0b43c, 30, 20);
    goldRim.position.set(-4, 2.5, -2.5);
    scene.add(goldRim);
    const magentaRim = new THREE.PointLight(0xd81b60, 18, 18);
    magentaRim.position.set(4, 1.4, -3);
    scene.add(magentaRim);

    // ---- bottle profile (lathe) ----
    const profile: [number, number][] = [
      [0.0, 0.03], [0.66, 0.03], [0.88, 0.08], [0.94, 0.22], [0.96, 0.5],
      [0.96, 1.6], [0.91, 1.82], [0.78, 2.06], [0.55, 2.3], [0.42, 2.44],
      [0.38, 2.52], [0.38, 2.92], [0.44, 2.94], [0.47, 3.0], [0.47, 3.08],
      [0.42, 3.12], [0.38, 3.14],
    ];
    const bottleGeo = new THREE.LatheGeometry(
      profile.map(([x, y]) => new THREE.Vector2(x, y)),
      72
    );
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5ead2,
      metalness: 0,
      roughness: 0.04,
      transmission: 0.96,
      thickness: 0.12,
      ior: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMapIntensity: 0.55,
      attenuationColor: new THREE.Color(0xe8c98a),
      attenuationDistance: 3.5,
    });
    const bottle = new THREE.Mesh(bottleGeo, glassMat);

    // ---- golden liquid core (solid amber so it shows through the glass) ----
    const liquidProfile: [number, number][] = [
      [0.0, 0.14], [0.6, 0.14], [0.8, 0.2], [0.86, 0.32], [0.87, 0.55],
      [0.87, 1.55], [0.82, 1.74], [0.66, 1.88], [0.0, 1.92],
    ];
    const liquidGeo = new THREE.LatheGeometry(
      liquidProfile.map(([x, y]) => new THREE.Vector2(x, y)),
      64
    );
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0xc07d0a,
      metalness: 0,
      roughness: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 0.55,
    });
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);

    // ---- cork ----
    const corkGeo = new THREE.CylinderGeometry(0.36, 0.4, 0.5, 32);
    const corkMat = new THREE.MeshStandardMaterial({
      color: 0xa5763f,
      roughness: 0.95,
      metalness: 0,
    });
    const cork = new THREE.Mesh(corkGeo, corkMat);
    cork.position.y = 3.22;
    const corkTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.36, 0.09, 32),
      new THREE.MeshStandardMaterial({ color: 0xb98a4e, roughness: 0.9 })
    );
    corkTop.position.y = 3.5;

    const group = new THREE.Group();
    group.add(bottle, liquid, cork, corkTop);
    scene.add(group);

    // floor glow disc
    const glow = new THREE.Mesh(
      new THREE.CircleGeometry(1.7, 48),
      new THREE.MeshBasicMaterial({ color: 0xf0b43c, transparent: true, opacity: 0.1 })
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = 0.01;
    scene.add(glow);

    // ---- sizing ----
    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // ---- interaction: auto-rotate + drag with inertia ----
    let angle = 0.6;
    let velocity = 0;
    let dragging = false;
    let lastX = 0;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      velocity = 0;
      host.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      const d = dx * 0.008;
      angle += d;
      velocity = d;
    };
    const onUp = () => {
      dragging = false;
    };
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerup", onUp);
    host.addEventListener("pointercancel", onUp);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      if (!dragging) {
        if (!reduced) angle += 0.00035 * dt;
        angle += velocity;
        velocity *= 0.94;
      }
      group.rotation.y = angle;
      if (!reduced) {
        group.position.y = Math.sin(now * 0.0012) * 0.06;
        glow.scale.setScalar(1 + Math.sin(now * 0.0012) * 0.04);
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
      bottleGeo.dispose();
      liquidGeo.dispose();
      corkGeo.dispose();
      glassMat.dispose();
      liquidMat.dispose();
      corkMat.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  if (failed) {
    return (
      <img src={poster} alt={posterAlt} className="h-full w-full object-cover" loading="eager" />
    );
  }

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
    />
  );
}
