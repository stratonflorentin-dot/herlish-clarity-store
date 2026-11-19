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
                <article className="glass group h-full rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:glow-gold">
                  <span className="mb-5 grid size-12 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    <Icon className="size-5.5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-lg font-semibold leading-snug">{b.title}</h3>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted-foreground">{b.text}</p>
                </article>
              </Reveal>
            );
          })}

          {/* ritual card fills the 6th slot */}
          <Reveal delay={420}>
            <article className="group relative h-full overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/15 via-card to-card p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60">
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-10 size-36 rounded-full bg-accent/20 blur-2xl transition-opacity group-hover:opacity-100"
              />
              <p className="font-display text-xs font-semibold tracking-[0.25em] uppercase text-accent">
                The ritual
              </p>
              <p className="font-serif-italic mt-4 text-xl leading-relaxed text-foreground/90">
                Warm a few drops between your palms, massage into the scalp, and let nature do the
                rest — two to three nights a week.
              </p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
