import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

type LeafSpec = {
  pos: THREE.Vector3;
  rot: THREE.Euler;
  spin: number;
  sway: number;
  swayPhase: number;
  fallSpeed: number;
  scale: number;
  colorMix: number;
};

/** Parametric castor-style leaf: pointed blade with a center rib, gently cupped. */
function makeLeafGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.34, 0.12, 0.5, 0.42, 0.5, 0.72);
  shape.bezierCurveTo(0.5, 0.92, 0.26, 1.1, 0, 1.42);
  shape.bezierCurveTo(-0.26, 1.1, -0.5, 0.92, -0.5, 0.72);
  shape.bezierCurveTo(-0.5, 0.42, -0.34, 0.12, 0, 0);
  const geo = new THREE.ShapeGeometry(shape, 10);
  // cup the leaf: bend along its length
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, Math.sin((y / 1.42) * Math.PI) * 0.14 - Math.abs(x) * 0.18);
  }
  geo.computeVertexNormals();
  geo.translate(0, -0.71, 0); // pivot at leaf center
  return geo;
}

/**
 * Full-page 3D botanical backdrop: instanced leaves drifting on a gentle wind
 * over a deep forest-plum gradient with warm light. Purely decorative.
 */
export function NatureBackground3D() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // CSS gradient background remains
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x120616, 0.055);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 80);
    camera.position.set(0, 2.2, 16);
    camera.lookAt(0, 0.5, 0);

    // outdoor-style lighting: warm sun low on the horizon + cool fill
    const sun = new THREE.DirectionalLight(0xffc46b, 2.6);
    sun.position.set(-6, 4, 6);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x7a4a8a, 0.7);
    fill.position.set(5, 2, -4);
    scene.add(fill);
    scene.add(new THREE.AmbientLight(0x3a2a44, 0.8));

    // ---- instanced leaves ----
    const COUNT = 90;
    const leafGeo = makeLeafGeometry();
    const leafMat = new THREE.MeshStandardMaterial({
      roughness: 0.55,
      metalness: 0.05,
      side: THREE.DoubleSide,
      envMapIntensity: 0.5,
    });
    const mesh = new THREE.InstancedMesh(leafGeo, leafMat, COUNT);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const deepGreen = new THREE.Color(0x1d4a22);
    const midGreen = new THREE.Color(0x3f7a2e);
    const goldLeaf = new THREE.Color(0xa8761e);
    const leaves: LeafSpec[] = [];
    const tmpColor = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      const golden = Math.random() < 0.22;
      leaves.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          Math.random() * 16 - 6,
          (Math.random() - 0.5) * 14 - 2
        ),
        rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        spin: (Math.random() - 0.5) * 0.9,
        sway: 0.4 + Math.random() * 0.9,
        swayPhase: Math.random() * Math.PI * 2,
        fallSpeed: 0.25 + Math.random() * 0.5,
        scale: 0.5 + Math.random() * 0.9,
        colorMix: Math.random(),
      });
      tmpColor.copy(golden ? goldLeaf : deepGreen).lerp(golden ? midGreen : midGreen, 0);
      if (!golden) tmpColor.copy(deepGreen).lerp(midGreen, Math.random());
      mesh.setColorAt(i, tmpColor);
    }
    scene.add(mesh);

    // a few distant tree silhouettes (dark cones) for outdoor depth
    const treeMat = new THREE.MeshBasicMaterial({ color: 0x0d0511 });
    for (const [x, z, s] of [
      [-11, -12, 4.2],
      [10, -14, 5],
      [-4, -16, 6],
      [5.5, -11, 3.4],
    ] as const) {
      const tree = new THREE.Mesh(new THREE.ConeGeometry(s * 0.55, s * 2.6, 7), treeMat);
      tree.position.set(x, s * 0.6 - 4, z);
      scene.add(tree);
    }

    // ground haze disc
    const haze = new THREE.Mesh(
      new THREE.CircleGeometry(26, 40),
      new THREE.MeshBasicMaterial({ color: 0x1a0b1e, transparent: true, opacity: 0.85 })
    );
    haze.rotation.x = -Math.PI / 2;
    haze.position.y = -4;
    scene.add(haze);

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const dummy = new THREE.Object3D();
    let raf = 0;
    const tick = (now: number) => {
      const t = now * 0.001;
      for (let i = 0; i < COUNT; i++) {
        const L = leaves[i];
        if (!reduced) {
          L.pos.y -= L.fallSpeed * 0.016;
          L.pos.x += Math.sin(t * L.sway + L.swayPhase) * 0.012;
          L.rot.x += L.spin * 0.01;
          L.rot.z += L.spin * 0.013;
          if (L.pos.y < -6) {
            L.pos.y = 12 + Math.random() * 4;
            L.pos.x = (Math.random() - 0.5) * 30;
          }
        }
        dummy.position.copy(L.pos);
        dummy.rotation.copy(L.rot);
        dummy.scale.setScalar(L.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (!reduced) camera.position.x = Math.sin(t * 0.08) * 0.6;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      leafGeo.dispose();
      leafMat.dispose();
      treeMat.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 [&>canvas]:h-full [&>canvas]:w-full"
    />
  );
}
