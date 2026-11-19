import { Sparkle } from "lucide-react";

const ITEMS = [
  "100% Pure & Natural",
  "Nourishes Scalp",
  "Reduces Breakage",
  "Adds Shine & Softness",
  "Ayurvedic Herbs",
  "Made in Tanzania",
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y hairline bg-secondary/40 py-4">
      <div className="animate-marquee flex w-max items-center gap-10 pr-10">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-10 whitespace-nowrap font-display text-sm font-medium tracking-[0.22em] uppercase text-muted-foreground"
            aria-hidden={i >= ITEMS.length}
          >
            {item}
            <Sparkle className="size-3.5 text-primary" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
