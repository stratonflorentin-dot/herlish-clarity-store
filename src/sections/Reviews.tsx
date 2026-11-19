import { BadgeCheck, MessageCircle, Quote, Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { BRAND, REVIEWS } from "@/config";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`size-4 ${
            i < rating ? "fill-primary text-primary" : "fill-muted/40 text-muted/40"
          }`}
        />
      ))}
    </div>
  );
}

export function Reviews() {
  const avg = REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length;

  return (
    <section id="reviews" className="relative overflow-hidden py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 50% at 20% 25%, hsl(340 75% 55% / 0.09), transparent 65%)," +
            "radial-gradient(50% 45% at 80% 80%, hsl(43 82% 60% / 0.09), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <Reveal className="text-center">
          <p className="font-display text-xs font-semibold tracking-[0.3em] uppercase text-primary">
            Crowned by our customers
          </p>
          <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Loved across <span className="text-gold-gradient">Tanzania</span>
          </h2>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-primary/25 bg-primary/5 px-5 py-2.5">
            <Stars rating={Math.round(avg)} />
            <span className="font-display text-sm font-bold text-primary">{avg.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">· {REVIEWS.length} verified reviews</span>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 110}>
              <figure className="glass group relative flex h-full flex-col rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:glow-gold">
                <Quote
                  aria-hidden="true"
                  className="absolute right-6 top-6 size-8 text-primary/15 transition-colors group-hover:text-primary/30"
                />
                <Stars rating={r.rating} />
                <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-foreground/90">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/15 font-display text-sm font-bold text-primary"
                  >
                    {r.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{r.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{r.location}</p>
                  </div>
                  <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-[0.68rem] font-medium text-primary/80">
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    Verified
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-12 text-center">
          <a
            href={BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-primary/35 px-7 py-3.5 text-base font-semibold text-primary transition-all hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Share your experience on WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}
