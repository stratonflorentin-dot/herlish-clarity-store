import { CalendarCheck, MapPin, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { BRAND } from "@/config";

export function Order() {
  return (
    <section id="order" className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 60% at 50% 40%, hsl(43 82% 60% / 0.1), transparent 65%)," +
            "radial-gradient(40% 40% at 85% 90%, hsl(340 75% 55% / 0.1), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
        <Reveal>
          <p className="font-display text-xs font-semibold tracking-[0.3em] uppercase text-primary">
            Begin your ritual
          </p>
          <h2 className="font-display mt-4 text-3xl font-bold leading-tight sm:text-5xl">
            Your crown deserves <span className="text-gold-gradient">the purest care</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Choose your size and order directly on WhatsApp — fast, personal, and delivered with
            love anywhere in Tanzania.
          </p>
        </Reveal>

        <Reveal delay={140}>
          <div className="mx-auto mt-10 grid max-w-xl gap-4 sm:grid-cols-2">
            {BRAND.sizes.map((size, i) => (
              <a
                key={size}
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass group relative overflow-hidden rounded-3xl p-7 pt-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:glow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex h-28 items-end justify-center">
                  <img
                    src="/slider/bottle.png"
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="bob transition-transform duration-300 group-hover:scale-105"
                    style={{
                      width: i === 0 ? 62 : 76,
                      ["--rot" as string]: "0deg",
                      ["--u" as string]: "0.4px",
                      animationDuration: "4.2s",
                      animationDelay: `${-i * 1.6}s`,
                      filter: "drop-shadow(0 10px 16px rgba(0, 0, 0, 0.5))",
                    }}
                  />
                </div>
                <p className="font-display mt-3 text-3xl font-bold text-gold-gradient">{size}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">100% pure castor oil</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1">
                  Order this size
                  <MessageCircle className="size-4" aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={240}>
          <a
            href={BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-primary px-9 py-4 text-lg font-semibold text-primary-foreground transition-all hover:scale-[1.04] hover:glow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
          >
            <MessageCircle className="size-5.5" aria-hidden="true" />
            {BRAND.whatsappNumber}
          </a>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              {BRAND.origin}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarCheck className="size-4 text-primary" aria-hidden="true" />
              Expiry {BRAND.expiry}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
