import { useEffect, useState } from "react";
import { Crown, Menu, X, MessageCircle } from "lucide-react";
import { BRAND } from "@/config";

const LINKS = [
  { label: "Benefits", href: "#benefits" },
  { label: "Formula", href: "#formula" },
  { label: "Order", href: "#order" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong py-3" : "bg-transparent py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 md:px-8">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full border border-primary/40 bg-primary/10 text-primary transition-shadow group-hover:glow-gold">
            <Crown className="size-4.5" aria-hidden="true" />
          </span>
          <span className="font-display text-sm font-semibold tracking-[0.18em] uppercase">
            Herlish <span className="text-gold-gradient">Clarity</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={BRAND.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.04] hover:glow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 md:inline-flex"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Order Now
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-strong mx-4 mt-3 rounded-2xl p-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:bg-primary/10 focus-visible:outline-none"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Order on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
