import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BRAND } from "@/config";

type Piece = {
  img: string;
  x: number;
  y: number;
  w: number;
  rot: number;
  mirror?: boolean;
  corner?: boolean;
};

type SlideDef = {
  id: string;
  word: string;
  bg: string;
  caption: string;
  sub: string;
  pieces: Piece[];
};

const S = "/slider";

const SLIDES: SlideDef[] = [
  {
    id: "castor",
    word: "Castor",
    bg: "#E5AC4B",
    caption: "Cold-pressed castor oil",
    sub: "100% pure · hexane free",
    pieces: [
      { img: `${S}/leaf.png`, x: 388, y: 168, w: 128, rot: -12 },
      { img: `${S}/drop.png`, x: 962, y: 232, w: 108, rot: 0 },
      { img: `${S}/seeds.png`, x: 292, y: 468, w: 152, rot: -8 },
      { img: `${S}/seeds.png`, x: 1236, y: 452, w: 134, rot: 16, mirror: true },
      { img: `${S}/leaf.png`, x: 952, y: 588, w: 122, rot: 28, mirror: true },
      { img: `${S}/seeds.png`, x: -18, y: 592, w: 258, rot: 0, corner: true },
      { img: `${S}/leaf.png`, x: 1284, y: 36, w: 208, rot: 12, corner: true },
    ],
  },
  {
    id: "coconut",
    word: "Coconut",
    bg: "#D3B489",
    caption: "Deep moisture blend",
    sub: "seals hydration without weight",
    pieces: [
      { img: `${S}/coconut.png`, x: 380, y: 158, w: 138, rot: -10 },
      { img: `${S}/drop.png`, x: 966, y: 226, w: 112, rot: 8 },
      { img: `${S}/coconut.png`, x: 296, y: 462, w: 158, rot: 12, mirror: true },
      { img: `${S}/leaf.png`, x: 1232, y: 448, w: 140, rot: -18 },
      { img: `${S}/drop.png`, x: 950, y: 584, w: 118, rot: -12, mirror: true },
      { img: `${S}/coconut.png`, x: -12, y: 578, w: 252, rot: 0, corner: true },
      { img: `${S}/drop.png`, x: 1290, y: 30, w: 196, rot: 0, corner: true },
    ],
  },
  {
    id: "herbal",
    word: "Herbal",
    bg: "#A6C48B",
    caption: "Ayurvedic herbal extracts",
    sub: "a botanical tradition for the scalp",
    pieces: [
      { img: `${S}/herb.png`, x: 382, y: 160, w: 142, rot: -14 },
      { img: `${S}/leaf.png`, x: 962, y: 222, w: 122, rot: 14 },
      { img: `${S}/herb.png`, x: 292, y: 458, w: 164, rot: 8, mirror: true },
      { img: `${S}/drop.png`, x: 1240, y: 446, w: 116, rot: 0 },
      { img: `${S}/herb.png`, x: 946, y: 580, w: 132, rot: -20, mirror: true },
      { img: `${S}/herb.png`, x: -14, y: 572, w: 262, rot: 0, corner: true },
      { img: `${S}/leaf.png`, x: 1282, y: 30, w: 206, rot: -10, corner: true },
    ],
  },
  {
    id: "hibiscus",
    word: "Hibiscus",
    bg: "#E59EAD",
    caption: "Shine & softness ritual",
    sub: "your crown, our care",
    pieces: [
      { img: `${S}/hibiscus.png`, x: 378, y: 152, w: 148, rot: -8 },
      { img: `${S}/drop.png`, x: 966, y: 228, w: 110, rot: 6 },
      { img: `${S}/leaf.png`, x: 290, y: 460, w: 146, rot: -16, mirror: true },
      { img: `${S}/hibiscus.png`, x: 1236, y: 440, w: 142, rot: 14, mirror: true },
      { img: `${S}/hibiscus.png`, x: 948, y: 576, w: 128, rot: -18 },
      { img: `${S}/hibiscus.png`, x: -16, y: 566, w: 258, rot: 8, corner: true },
      { img: `${S}/drop.png`, x: 1288, y: 28, w: 198, rot: 0, corner: true },
    ],
  },
];

/* measured coverage curve of the wipe (slow start, fast middle, soft settle) */
const COVER: ReadonlyArray<readonly [number, number]> = [
  [0, 0], [0.031, 0.006], [0.134, 0.012], [0.206, 0.023], [0.278, 0.047],
  [0.34, 0.07], [0.412, 0.105], [0.485, 0.158], [0.546, 0.246], [0.583, 0.55],
  [0.62, 0.825], [0.69, 0.9], [0.79, 0.94], [0.85, 0.956], [0.93, 0.975], [1, 1],
];

function coverAt(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  for (let i = 1; i < COVER.length; i++) {
    if (t <= COVER[i][0]) {
      const [t0, c0] = COVER[i - 1];
      const [t1, c1] = COVER[i];
      const k = (t - t0) / (t1 - t0);
      const s = k * k * (3 - 2 * k);
      return c0 + (c1 - c0) * s;
    }
  }
  return 1;
}

const easeOutQuad = (k: number) => 1 - (1 - k) * (1 - k);
const LAYER_FACTORS = { word: 0.4, shadow: 0.3, bottle: 0.15, fruit: 0.55, corner: 0.75 } as const;
type LayerKey = keyof typeof LAYER_FACTORS;
const LAYER_KEYS = Object.keys(LAYER_FACTORS) as LayerKey[];

const SHADOWS = [
  { cx: 345, cy: 652, w: 170, h: 24 },
  { cx: 720, cy: 712, w: 330, h: 30 },
  { cx: 1300, cy: 640, w: 165, h: 22 },
];

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const layerRefs = useRef<Array<Partial<Record<LayerKey, HTMLDivElement | null>>>>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const currentRef = useRef(0);
  const busyRef = useRef(false);
  const lastInteractRef = useRef(0);
  const uRef = useRef(1);
  const [current, setCurrent] = useState(0);
  const [wordSizes, setWordSizes] = useState<number[]>(() => SLIDES.map(() => 220));
  const [underline, setUnderline] = useState({ x: 0, w: 0 });

  /* ---- scaling + word measurement ---- */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const canvas = document.createElement("canvas");

    const compute = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (!w || !h) return;
      const mobile = w <= 820 || h > w;
      const u = mobile ? Math.min(w / 640, (h - 200) / 620) : Math.min(w / 1440, h / 900);
      uRef.current = u;
      stage.style.setProperty("--u", `${u}px`);

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.font = '700 100px Unbounded, "Outfit", sans-serif';
        setWordSizes(
          SLIDES.map((s) => {
            const m = ctx.measureText(s.word);
            const ink =
              (m.actualBoundingBoxLeft ?? 0) + (m.actualBoundingBoxRight ?? 0) || m.width || 1;
            const target = mobile ? Math.min(1440, w / u) * 0.92 : 1330;
            return Math.min(340, (target / ink) * 100);
          })
        );
      }
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(stage);
    document.fonts?.ready.then(compute).catch(() => {});
    return () => ro.disconnect();
  }, []);

  /* ---- tab underline follows active tab ---- */
  useEffect(() => {
    const btn = tabRefs.current[current];
    if (btn) setUnderline({ x: btn.offsetLeft, w: btn.offsetWidth });
  }, [current, wordSizes]);

  /* ---- slide transition ---- */
  const goTo = (target: number, dir: 1 | -1) => {
    const from = currentRef.current;
    if (busyRef.current || target === from) return;
    lastInteractRef.current = Date.now();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const A = slideRefs.current[from];
    const B = slideRefs.current[target];
    if (!A || !B) return;

    setCurrent(target); // underline + tabs move immediately

    if (reduced) {
      A.style.visibility = "hidden";
      A.style.zIndex = "1";
      B.style.visibility = "visible";
      B.style.zIndex = "2";
      currentRef.current = target;
      return;
    }

    busyRef.current = true;
    B.style.visibility = "visible";
    B.style.zIndex = "1";
    A.style.zIndex = "2";

    const frameW = 1440 * uRef.current;
    const aLayers = layerRefs.current[from] ?? {};
    const bLayers = layerRefs.current[target] ?? {};
    const DUR = 970;
    const start = performance.now();

    const step = (now: number) => {
      const t = (now - start) / DUR;
      const c = coverAt(Math.min(t, 1));

      A.style.clipPath =
        dir > 0 ? `inset(0 ${c * 100}% 0 0)` : `inset(0 0 0 ${c * 100}% 0 0)`;
      const drift = -dir * c * 0.14 * frameW;
      for (const key of LAYER_KEYS) {
        const el = aLayers[key];
        if (el) el.style.transform = `translateX(${drift}px)`;
      }

      const k = Math.min(1, Math.max(0, (t - 0.5) / 0.42));
      const kk = easeOutQuad(k);
      for (const key of LAYER_KEYS) {
        const el = bLayers[key];
        if (el)
          el.style.transform = `translateX(${dir * (1 - kk) * LAYER_FACTORS[key] * frameW}px)`;
      }

      if (k < 1) {
        requestAnimationFrame(step);
      } else {
        A.style.clipPath = "";
        A.style.visibility = "hidden";
        A.style.zIndex = "1";
        B.style.zIndex = "2";
        for (const key of LAYER_KEYS) {
          const ea = aLayers[key];
          const eb = bLayers[key];
          if (ea) ea.style.transform = "";
          if (eb) eb.style.transform = "";
        }
        currentRef.current = target;
        busyRef.current = false;
      }
    };
    requestAnimationFrame(step);
  };

  const next = () => goTo((currentRef.current + 1) % SLIDES.length, 1);
  const prev = () => goTo((currentRef.current - 1 + SLIDES.length) % SLIDES.length, -1);
  const goToTab = (i: number) => {
    const from = currentRef.current;
    if (i === from) return;
    goTo(i, i > from ? 1 : -1);
  };

  /* ---- opening sequence ---- */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    const open = () => {
      if (cancelled) return;
      const layers = layerRefs.current[0] ?? {};
      const frameW = 1440 * uRef.current;
      for (const key of LAYER_KEYS) {
        const el = layers[key];
        el?.animate(
          [
            { transform: `translateX(${LAYER_FACTORS[key] * 0.9 * frameW}px)` },
            { transform: "none" },
          ],
          { duration: 900, easing: "cubic-bezier(0.22, 0.8, 0.3, 1)", fill: "backwards" }
        );
      }
    };
    document.fonts?.ready.then(open).catch(open);
    const failsafe = window.setTimeout(open, 3000);
    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
    };
  }, []);

  /* ---- autoplay ---- */
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden) return;
      if (busyRef.current) return;
      if (Date.now() - lastInteractRef.current < 6000) return;
      next();
    }, 2600);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- keyboard ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- swipe / drag ---- */
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    swipeStart.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = swipeStart.current;
    swipeStart.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  };

  return (
    <section id="top" aria-label="Featured product slider" className="relative">
      <div
        ref={stageRef}
        className="relative h-[100svh] min-h-[540px] w-full touch-pan-y overflow-hidden select-none"
        style={{ ["--u" as string]: "1px" }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="absolute inset-0 overflow-hidden"
            style={{
              background: s.bg,
              visibility: i === 0 ? "visible" : "hidden",
              zIndex: i === 0 ? 2 : 1,
            }}
            aria-hidden={i !== current}
          >
            <div
              className="absolute"
              style={{
                left: "calc(50% - 720 * var(--u))",
                top: "calc(50% - 450 * var(--u) + 8px)",
                width: "calc(1440 * var(--u))",
                height: "calc(900 * var(--u))",
              }}
            >
              {/* word layer */}
              <div
                ref={(el) => {
                  (layerRefs.current[i] ??= {})[("word" as LayerKey)] = el;
                }}
                className="absolute inset-0"
              >
                {i === 0 ? (
                  <h1
                    className="font-display absolute left-1/2 -translate-x-1/2 font-bold whitespace-nowrap text-white"
                    style={{
                      top: "calc(403 * var(--u))",
                      transform: "translate(-50%, -56%)",
                      fontSize: `calc(${wordSizes[i]} * var(--u))`,
                      lineHeight: 1,
                      textShadow: "0 2px 18px rgba(90, 60, 20, 0.22)",
                    }}
                  >
                    {s.word}
                  </h1>
                ) : (
                  <div
                    aria-hidden="true"
                    className="font-display absolute left-1/2 font-bold whitespace-nowrap text-white"
                    style={{
                      top: "calc(403 * var(--u))",
                      transform: "translate(-50%, -56%)",
                      fontSize: `calc(${wordSizes[i]} * var(--u))`,
                      lineHeight: 1,
                      textShadow: "0 2px 18px rgba(90, 60, 20, 0.22)",
                    }}
                  >
                    {s.word}
                  </div>
                )}
              </div>

              {/* shadow layer */}
              <div
                ref={(el) => {
                  (layerRefs.current[i] ??= {}).shadow = el;
                }}
                className="absolute inset-0"
              >
                {SHADOWS.map((sh, j) => (
                  <div
                    key={j}
                    className="absolute rounded-full"
                    style={{
                      left: `calc(${sh.cx - sh.w / 2} * var(--u))`,
                      top: `calc(${sh.cy - sh.h / 2} * var(--u))`,
                      width: `calc(${sh.w} * var(--u))`,
                      height: `calc(${sh.h} * var(--u))`,
                      background:
                        "radial-gradient(closest-side, rgba(60, 40, 80, 0.22), transparent)",
                      filter: "blur(calc(4 * var(--u)))",
                    }}
                  />
                ))}
              </div>

              {/* bottle layer */}
              <div
                ref={(el) => {
                  (layerRefs.current[i] ??= {}).bottle = el;
                }}
                className="absolute inset-0"
              >
                <img
                  src={`${S}/bottle.png`}
                  alt="Herlish Clarity 100% pure castor oil bottle with cork stopper"
                  draggable={false}
                  className="absolute"
                  style={{
                    left: "calc(518 * var(--u))",
                    top: "calc(128 * var(--u))",
                    width: "calc(372 * var(--u))",
                    filter: "drop-shadow(0 18px 30px rgba(60, 30, 10, 0.25))",
                  }}
                />
              </div>

              {/* fruit layer */}
              <div
                ref={(el) => {
                  (layerRefs.current[i] ??= {}).fruit = el;
                }}
                className="absolute inset-0"
              >
                {s.pieces
                  .filter((p) => !p.corner)
                  .map((p, j) => (
                    <PieceView key={j} piece={p} index={j} />
                  ))}
              </div>

              {/* corner layer (large, blurred) */}
              <div
                ref={(el) => {
                  (layerRefs.current[i] ??= {}).corner = el;
                }}
                className="absolute inset-0 hidden min-[821px]:block"
              >
                {s.pieces
                  .filter((p) => p.corner)
                  .map((p, j) => (
                    <PieceView key={j} piece={p} index={j + 10} blurred />
                  ))}
              </div>
            </div>

            {/* per-slide caption */}
            <div
              className="pointer-events-none absolute bottom-[13%] left-[6%] z-10 hidden sm:block"
              style={{ textShadow: "0 1px 6px rgba(90, 70, 40, 0.3)" }}
            >
              <p className="font-display text-xs font-semibold tracking-[0.28em] uppercase text-white/85">
                {s.caption}
              </p>
              <p className="mt-1.5 text-sm text-white/70">{s.sub}</p>
            </div>
          </div>
        ))}

        {/* top scrim keeps the fixed nav readable over pastel slides */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-36 bg-gradient-to-b from-black/50 via-black/25 to-transparent"
        />

        {/* ---- fixed UI ---- */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {/* flavour tabs */}
          <div className="absolute bottom-[86px] left-1/2 -translate-x-1/2 sm:bottom-[92px]">
            <div className="relative flex items-center gap-5 sm:gap-9">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  onClick={() => goToTab(i)}
                  aria-current={i === current}
                  className={`pointer-events-auto px-1 py-1.5 text-[0.8rem] font-medium tracking-wide transition-colors sm:text-sm ${
                    i === current ? "text-white" : "text-white/65 hover:text-white"
                  }`}
                  style={{ textShadow: "0 1px 6px rgba(90, 70, 40, 0.35)" }}
                >
                  {s.word}
                </button>
              ))}
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-white transition-all duration-[600ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
                style={{ transform: `translateX(${underline.x}px)`, width: underline.w }}
              />
            </div>
          </div>

          {/* order CTA */}
          <a
            href={BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto absolute bottom-7 left-1/2 -translate-x-1/2 rounded-full px-5 py-2.5 text-[0.8rem] font-semibold tracking-[0.2em] uppercase text-white transition-colors hover:bg-white/10 sm:text-sm"
            style={{ textShadow: "0 1px 6px rgba(90, 70, 40, 0.35)" }}
          >
            Order now
          </a>

          {/* arrows */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous flavour"
            className="pointer-events-auto absolute bottom-5 left-4 grid size-12 place-items-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:left-7"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next flavour"
            className="pointer-events-auto absolute right-4 bottom-5 grid size-12 place-items-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:right-7"
          >
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

function PieceView({
  piece,
  index,
  blurred = false,
}: {
  piece: Piece;
  index: number;
  blurred?: boolean;
}) {
  const dur = 3.2 + ((index * 1.37) % 1.8);
  const del = -((index * 0.83) % 4);
  return (
    <div
      className="absolute"
      style={{
        left: `calc(${piece.x} * var(--u))`,
        top: `calc(${piece.y} * var(--u))`,
        width: `calc(${piece.w} * var(--u))`,
        transform: piece.mirror ? "scaleX(-1)" : undefined,
      }}
    >
      <img
        src={piece.img}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="bob w-full"
        style={{
          ["--rot" as string]: `${piece.rot}deg`,
          animationDuration: `${dur}s`,
          animationDelay: `${del}s`,
          filter: blurred
            ? "blur(calc(9 * var(--u)))"
            : "drop-shadow(0 8px 14px rgba(60, 30, 10, 0.18))",
        }}
      />
    </div>
  );
}
