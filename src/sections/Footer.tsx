import { Crown, MessageCircle } from "lucide-react";
import { BRAND } from "@/config";

export function Footer() {
  return (
    <footer className="border-t hairline bg-secondary/30 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full border border-primary/40 bg-primary/10 text-primary">
            <Crown className="size-4.5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold tracking-[0.18em] uppercase">
              Herlish <span className="text-gold-gradient">Clarity</span>
            </p>
            <p className="font-serif-italic text-sm text-muted-foreground">{BRAND.tagline}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          100% pure &amp; natural castor oil · {BRAND.origin}
        </p>

        <a
          href={BRAND.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-primary/35 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          {BRAND.whatsappNumber}
        </a>
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground/70">
        © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
      </p>
    </footer>
  );
}
