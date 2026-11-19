import { RotateCw } from "lucide-react";
import { CurvedCarousel } from "@/components/CurvedCarousel";
import { GoldParticles } from "@/components/GoldParticles";
import { Reveal } from "@/components/Reveal";
import { BENEFITS } from "@/config";

export function Showcase() {
  const unique = [
    { image: "/pour.jpg", label: "Pure Gold", alt: "Golden castor oil being poured into a wooden bowl" },
    ...BENEFITS.map((b) => ({ image: b.image, label: b.title, alt: b.alt })),
    { image: "/benefits/ritual.jpg", label: "The Ritual", alt: "Cupped hands holding golden oil drops above a bottle" },
  ];
  // doubled so the wheel always shows a rich arc of cards
  const items = [...unique, ...unique];

  return (
    <section id="showcase" className="relative overflow-hidden py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 45%, hsl(43 82% 60% / 0.09), transparent 65%)," +
            "radial-gradient(45% 40% at 85% 15%, hsl(340 75% 55% / 0.08), transparent 60%)",
        }}
      />
      <GoldParticles density={36} />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <Reveal className="text-center">
          <p className="font-display text-xs font-semibold tracking-[0.3em] uppercase text-primary">
            The Clarity Experience
          </p>
          <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Spin the <span className="text-gold-gradient">golden ritual</span>
          </h2>
          <p className="mx-auto mt-4 flex max-w-xl items-center justify-center gap-2 text-base text-muted-foreground">
            <RotateCw className="size-4 shrink-0 text-primary" aria-hidden="true" />
            Drag the wheel — every side tells what this oil does for your hair.
          </p>
        </Reveal>

        <Reveal delay={150} className="mt-6">
          <CurvedCarousel items={items} />
        </Reveal>
      </div>
    </section>
  );
}
