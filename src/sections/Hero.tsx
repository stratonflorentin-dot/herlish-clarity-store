import { lazy, Suspense } from "react";
import { BadgeCheck, Leaf, MapPin, MessageCircle, RotateCw } from "lucide-react";
import { GoldParticles } from "@/components/GoldParticles";
import { Reveal } from "@/components/Reveal";
import { BRAND } from "@/config";

const Bottle3D = lazy(() =>
  import("@/components/Bottle3D").then((m) => ({ default: m.Bottle3D }))
);

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-dvh items-center overflow-hidden pt-24 pb-16">
      {/* ambient background */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 30%, hsl(340 75% 55% / 0.14), transparent 65%)," +
            "radial-gradient(55% 45% at 20% 75%, hsl(43 82% 60% / 0.12), transparent 60%)," +
            "radial-gradient(90% 90% at 50% 50%, transparent 40%, hsl(320 30% 4%) 100%)",
        }}
      />
      <GoldParticles />
      {/* orbital rings */}
      <div
        aria-hidden="true"
        className="animate-spin-slower absolute -right-40 top-1/2 hidden size-[560px] -translate-y-1/2 rounded-full border border-primary/15 lg:block"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 top-1/2 hidden size-[380px] -translate-y-1/2 rounded-full border border-accent/20 lg:block"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-5 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Reveal>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-primary uppercase">
              <Leaf className="size-3.5" aria-hidden="true" />
              100% Pure &amp; Natural
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="font-display text-[2.6rem] leading-[1.05] font-bold sm:text-6xl lg:text-7xl">
              <span className="text-gold-gradient">Castor Oil</span>
              <span className="mt-3 block text-[1.35rem] font-medium tracking-normal text-foreground/90 sm:text-2xl lg:text-[1.7rem]">
                Nature&apos;s power for{" "}
                <span className="text-hibiscus-gradient">healthier hair</span>
              </span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="font-serif-italic mt-6 text-xl text-muted-foreground sm:text-2xl">
              For longer, stronger, healthier hair — {BRAND.tagline}
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:scale-[1.04] hover:glow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
              >
                <MessageCircle className="size-5" aria-hidden="true" />
                Order on WhatsApp
              </a>
              <a
                href="#benefits"
                className="inline-flex items-center gap-2 rounded-full border border-primary/35 px-7 py-3.5 text-base font-semibold text-primary transition-all hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
              >
                Explore benefits
              </a>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-sm">
              <div className="flex items-center gap-2.5">
                <BadgeCheck className="size-4.5 text-primary" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Sizes</dt>
                  <dd className="font-semibold tracking-wide">120 ml · 250 ml</dd>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Leaf className="size-4.5 text-primary" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Formula</dt>
                  <dd className="font-semibold tracking-wide">Ayurvedic herbal blend</dd>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="size-4.5 text-primary" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Origin</dt>
                  <dd className="font-semibold tracking-wide">{BRAND.origin}</dd>
                </div>
              </div>
            </dl>
          </Reveal>
        </div>

        {/* product visual */}
        <Reveal delay={200} className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="animate-float-slow relative">
            <div
              aria-hidden="true"
              className="animate-pulse-glow absolute inset-6 rounded-[2.5rem] bg-primary/25 blur-3xl"
            />
            <div className="glow-ring relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-primary/25 bg-gradient-to-b from-card/60 to-background">
              <Suspense
                fallback={
                  <img
                    src="/product.jpg"
                    alt="Elegant cork-stoppered glass bottle of golden Herlish Clarity castor oil beside castor seeds and fresh leaves"
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                }
              >
                <Bottle3D
                  poster="/product.jpg"
                  posterAlt="Elegant cork-stoppered glass bottle of golden Herlish Clarity castor oil beside castor seeds and fresh leaves"
                />
              </Suspense>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"
              />
              <div className="glass pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl px-5 py-3.5">
                <span className="font-display text-xs font-semibold tracking-[0.2em] uppercase text-primary">
                  Elixir No. 01
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <RotateCw className="size-3.5 text-primary" aria-hidden="true" />
                  Drag to spin
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
