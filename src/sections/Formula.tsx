import { FlaskConical } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { INGREDIENTS } from "@/config";

export function Formula() {
  return (
    <section id="formula" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          {/* full flyer visual */}
          <Reveal className="relative order-2 lg:order-1">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2.5rem] bg-accent/15 blur-3xl"
            />
            <div className="relative overflow-hidden rounded-[2rem] border border-accent/25">
              <img
                src="/flyer.jpg"
                alt="Full Herlish Clarity Store castor oil product flyer showing benefits, sizes and ordering details"
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="font-display flex items-center gap-2.5 text-xs font-semibold tracking-[0.3em] uppercase text-primary">
                <FlaskConical className="size-4" aria-hidden="true" />
                Inside the bottle
              </p>
              <h2 className="font-display mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Rich in natural oils &amp; <span className="text-hibiscus-gradient">Ayurvedic herbs</span>
              </h2>
            </Reveal>

            <div className="mt-10 space-y-4">
              {INGREDIENTS.map((ing, i) => (
                <Reveal key={ing.name} delay={i * 100}>
                  <div className="glass flex gap-5 rounded-2xl p-5 transition-colors hover:border-primary/40">
                    <span className="font-display mt-0.5 text-sm font-bold text-primary/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold">{ing.name}</h3>
                      <p className="mt-1 text-[0.95rem] leading-relaxed text-muted-foreground">
                        {ing.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
