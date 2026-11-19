import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import * as THREE from "three";

type Strand = {
  base: THREE.Vector3;
  tip: THREE.Vector3;
};

type Drop = {
  strand: number;
  t: number; // 1.15 (above tip) -> -0.5 (deep in follicle)
  speed: number;
  mesh: THREE.Mesh;
};

/**
 * Interactive 3D visualization: golden oil droplets travel down hair strands
 * and absorb into the follicle beneath the scalp. Drag to orbit.
 */
function FollicleScene({ host }: { host: HTMLDivElement }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
  camera.position.set(0, 1.9, 5.6);
  camera.lookAt(0, 0.9, 0);

  scene.add(new THREE.AmbientLight(0x4a3348, 0.9));
  const key = new THREE.DirectionalLight(0xffd9a0, 2.4);
  key.position.set(4, 6, 5);
  scene.add(key);
  const gold = new THREE.PointLight(0xf0b43c, 24, 16);
  gold.position.set(-3, 1.5, 3);
  scene.add(gold);

  // ---- scalp surface (gentle dome) ----
  const scalpGeo = new THREE.SphereGeometry(7, 48, 24, 0, Math.PI * 2, 0, Math.PI / 3.2);
  const scalpMat = new THREE.MeshStandardMaterial({
    color: 0x4a2b1e,
    roughness: 0.85,
    metalness: 0,
  });
  const scalp = new THREE.Mesh(scalpGeo, scalpMat);
  scalp.position.y = -3.85;
  scalp.scale.set(1, 0.55, 1);
  scene.add(scalp);

  // ---- hair strands (slightly curved, glossy dark) ----
  const strands: Strand[] = [];
  const hairMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a0f0a,
    roughness: 0.3,
    clearcoat: 0.8,
    clearcoatRoughness: 0.25,
  });
  const strandDefs = [
    [0, 0, 3.1, 0.18],
    [-1.0, 0.45, 2.6, -0.34],
    [1.05, -0.35, 2.8, 0.38],
    [-0.6, -0.9, 2.3, -0.16],
    [0.65, 0.95, 2.45, 0.24],
  ] as const;
  for (const [x, z, h, bend] of strandDefs) {
    const base = new THREE.Vector3(x, 0.02, z);
    const tip = new THREE.Vector3(x + bend, h, z + bend * 0.4);
    const mid = base.clone().lerp(tip, 0.55).add(new THREE.Vector3(bend * 0.35, 0, 0));
    const curve = new THREE.QuadraticBezierCurve3(base, mid, tip);
    const geo = new THREE.TubeGeometry(curve, 20, 0.08, 10, false);
    scene.add(new THREE.Mesh(geo, hairMat));
    strands.push({ base, tip });

    // follicle tube below the surface
    const fol = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.05, 0.9, 10, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x6b4030,
        roughness: 0.7,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      })
    );
    fol.position.set(x, -0.44, z);
    scene.add(fol);
  }

  // ---- oil droplets ----
  const dropGeo = new THREE.SphereGeometry(0.075, 12, 12);
  const drops: Drop[] = [];
  for (let i = 0; i < 22; i++) {
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xeaa216,
      roughness: 0.1,
      clearcoat: 1,
      transparent: true,
      opacity: 1,
      emissive: 0x7a4a00,
      emissiveIntensity: 0.55,
    });
    const mesh = new THREE.Mesh(dropGeo, mat);
    scene.add(mesh);
    drops.push({
      strand: i % strands.length,
      t: Math.random() * 1.6 - 0.3,
      speed: 0.0028 + Math.random() * 0.0022,
      mesh,
    });
  }

  // absorption glow at follicle base
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xf0b43c,
    transparent: true,
    opacity: 0.0,
  });
  const glow = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), glowMat);
  scene.add(glow);
  let glowPulse = 0;

  const group = new THREE.Group();
  scene.children.slice().forEach((c) => {
    if (c !== group && !(c instanceof THREE.Light)) group.add(c);
  });
  scene.add(group);

  // interaction: drag orbit
  let rotY = 0.4;
  let rotX = 0.12;
  let vel = 0;
  let dragging = false;
  let lastX = 0;
  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    host.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    const d = dx * 0.006;
    rotY += d;
    vel = d;
  };
  const onUp = () => {
    dragging = false;
  };
  host.addEventListener("pointerdown", onDown);
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerup", onUp);
  host.addEventListener("pointercancel", onUp);

  const resize = () => {
    renderer.setSize(host.clientWidth, host.clientHeight, false);
    camera.aspect = host.clientWidth / host.clientHeight;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tmp = new THREE.Vector3();
  let raf = 0;
  const tick = () => {
    if (!dragging) {
      rotY += vel;
      vel *= 0.94;
      if (!reduced) rotY += 0.0022;
    }
    group.rotation.y = rotY;
    group.rotation.x = rotX;

    if (!reduced) {
      for (const d of drops) {
        d.t -= d.speed;
        if (d.t < -0.5) {
          d.t = 1.1 + Math.random() * 0.3;
          d.strand = Math.floor(Math.random() * strands.length);
        }
        const s = strands[d.strand];
        if (d.t >= 0) {
          // sliding down the strand
          tmp.lerpVectors(s.base, s.tip, Math.min(d.t, 1));
          const mat = d.mesh.material as THREE.MeshPhysicalMaterial;
          mat.opacity = Math.min(1, (1.15 - d.t) * 4);
        } else {
          // sinking into the follicle
          tmp.set(s.base.x, d.t * 1.6, s.base.z);
          const mat = d.mesh.material as THREE.MeshPhysicalMaterial;
          mat.opacity = Math.max(0, 1 + d.t * 2.2);
          if (d.t > -0.35 && d.t - d.speed <= -0.35) glowPulse = 1;
        }
        d.mesh.position.copy(tmp);
      }
      if (glowPulse > 0) {
        glowPulse = Math.max(0, glowPulse - 0.02);
        glowMat.opacity = glowPulse * 0.5;
        glow.position.copy(strands[0].base).setY(-0.5);
        glow.scale.setScalar(1 + (1 - glowPulse) * 1.6);
      }
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
    renderer.dispose();
    renderer.domElement.remove();
    scalpGeo.dispose();
    dropGeo.dispose();
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        const m = o.material;
        (Array.isArray(m) ? m : [m]).forEach((mm) => mm.dispose());
      }
    });
  };
}

export function FollicleModal({
  title,
  text,
  onClose,
}: {
  title: string;
  text: string;
  onClose: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cleanup: (() => void) | undefined;
    try {
      cleanup = FollicleScene({ host });
    } catch {
      /* WebGL unavailable — modal still shows text */
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cleanup?.();
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — 3D oil absorption view`}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="glass-strong glow-ring relative w-full max-w-3xl overflow-hidden rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 p-6 pb-0">
          <div>
            <p className="font-display text-[0.65rem] font-semibold tracking-[0.28em] uppercase text-primary">
              Live 3D · Oil absorption
            </p>
            <h3 className="font-display mt-1.5 text-xl font-bold sm:text-2xl">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close 3D view"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-5" />
          </button>
        </div>

        <div
          ref={hostRef}
          className="h-[320px] w-full cursor-grab touch-pan-y active:cursor-grabbing sm:h-[400px] [&>canvas]:h-full [&>canvas]:w-full"
        />

        <div className="p-6 pt-0">
          <p className="text-[0.95rem] leading-relaxed text-muted-foreground">{text}</p>
          <p className="mt-2 text-xs text-muted-foreground/70">
            Drag to orbit · golden droplets show oil travelling down the strand into the follicle
          </p>
        </div>
      </div>
    </div>
  );
}
