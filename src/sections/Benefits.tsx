import { Droplet, Droplets, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { BENEFITS } from "@/config";

const ICONS = {
  droplet: Droplet,
  droplets: Droplets,
  shield: ShieldCheck,
  sparkles: Sparkles,
  leaf: Leaf,
} as const;

export function Benefits() {
  return (
    <section id="benefits" className="relative py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 15% 20%, hsl(43 82% 60% / 0.07), transparent 60%)," +
            "radial-gradient(45% 40% at 90% 85%, hsl(340 75% 55% / 0.07), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="font-display text-xs font-semibold tracking-[0.3em] uppercase text-primary">
            Key benefits
          </p>
          <h2 className="font-display mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            One elixir. <span className="text-gold-gradient">Five powers</span> for your crown.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => {
            const Icon = ICONS[b.icon as keyof typeof ICONS];
            return (
              <Reveal key={b.title} delay={i * 80} className={i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}>
                <article className="glass group h-full overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:glow-gold">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={b.image}
                      alt={b.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent"
                    />
                    <span className="absolute bottom-3 left-5 grid size-11 place-items-center rounded-2xl border border-primary/40 bg-background/70 text-primary backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="p-6 pt-4">
                    <h3 className="font-display text-lg font-semibold leading-snug">{b.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{b.text}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}

          {/* ritual card fills the 6th slot */}
          <Reveal delay={420}>
            <article className="group relative h-full overflow-hidden rounded-3xl border border-accent/30 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60">
              <img
                src="/benefits/ritual.jpg"
                alt="Cupped hands holding golden oil drops above a glass bottle of castor oil"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/25"
              />
              <div className="relative flex h-full flex-col justify-end p-7">
                <p className="font-display text-xs font-semibold tracking-[0.25em] uppercase text-accent">
                  The ritual
                </p>
                <p className="font-serif-italic mt-3 text-xl leading-relaxed text-foreground/95">
                  Warm a few drops between your palms, massage into the scalp, and let nature do
                  the rest — two to three nights a week.
                </p>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
