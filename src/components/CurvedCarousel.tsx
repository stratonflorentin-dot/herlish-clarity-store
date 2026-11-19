import { useEffect, useRef, useState } from "react";

export type CarouselItem = {
  image: string;
  label: string;
  alt: string;
};

/**
 * Curved 3D product carousel — a rotating wheel of cards (CSS preserve-3d ring).
 * Auto-rotates slowly; drag / swipe to spin with inertia; arrow keys rotate.
 * Auto-rotation is disabled for prefers-reduced-motion.
 */
export function CurvedCarousel({ items }: { items: CarouselItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const [radius, setRadius] = useState(340);
  const [cardW, setCardW] = useState(210);

  // responsive geometry
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = () => {
      const w = el.clientWidth;
      const cw = Math.max(140, Math.min(230, w * 0.42));
      setCardW(cw);
      const step = (2 * Math.PI) / items.length;
      setRadius(Math.round((cw * 0.85) / Math.tan(step / 2)));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length]);

  // rotation loop: auto-spin + inertia + per-card depth dimming
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    const step = 360 / items.length;
    const tick = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      if (!draggingRef.current) {
        if (!reduced) angleRef.current += 0.004 * dt; // slow auto-spin
        angleRef.current += velocityRef.current;
        velocityRef.current *= 0.95; // inertia decay
      }
      const ring = ringRef.current;
      if (ring) {
        ring.style.transform = `translateZ(-${radius}px) rotateX(-7deg) rotateY(${angleRef.current}deg)`;
        const cards = ring.children;
        for (let i = 0; i < cards.length; i++) {
          const a = ((angleRef.current + i * step) * Math.PI) / 180;
          const frontness = (Math.cos(a) + 1) / 2; // 1 = facing viewer
          (cards[i] as HTMLElement).style.opacity = String(0.22 + 0.78 * Math.pow(frontness, 1.6));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [radius, items.length]);

  // drag handling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onDown = (e: PointerEvent) => {
      draggingRef.current = true;
      lastXRef.current = e.clientX;
      velocityRef.current = 0;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      const delta = dx * 0.25;
      angleRef.current += delta;
      velocityRef.current = delta;
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const nudge = (deg: number) => {
    velocityRef.current += deg;
  };

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Product gallery carousel. Drag or use arrow keys to rotate."
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") nudge(360 / items.length / 3);
        if (e.key === "ArrowRight") nudge(-360 / items.length / 3);
      }}
      className="relative h-[380px] w-full cursor-grab touch-pan-y select-none overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing sm:h-[440px]"
      style={{ perspective: "1100px" }}
    >
      <div
        ref={ringRef}
        className="absolute left-1/2 top-1/2"
        style={{
          transformStyle: "preserve-3d",
          transform: `translateZ(-${radius}px) rotateX(-7deg)`,
        }}
      >
        {items.map((item, i) => {
          const step = 360 / items.length;
          return (
            <figure
              key={`${item.label}-${i}`}
              className="absolute overflow-hidden rounded-2xl border border-primary/25 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.8)]"
              style={{
                width: cardW,
                height: Math.round(cardW * 1.32),
                left: -cardW / 2,
                top: -Math.round(cardW * 1.32) / 2,
                transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
                backfaceVisibility: "hidden",
              }}
            >
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent"
              />
              <figcaption className="font-display absolute inset-x-3 bottom-3 text-[0.7rem] font-semibold tracking-[0.16em] uppercase text-primary">
                {item.label}
              </figcaption>
            </figure>
          );
        })}
      </div>
      {/* floor glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-6 mx-auto h-16 w-2/3 rounded-full bg-primary/15 blur-3xl"
      />
    </div>
  );
}
