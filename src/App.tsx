import { lazy, Suspense } from "react";
import { Nav } from "@/sections/Nav";
import { Hero } from "@/sections/Hero";
import { Marquee } from "@/sections/Marquee";
import { Showcase } from "@/sections/Showcase";
import { Benefits } from "@/sections/Benefits";
import { Formula } from "@/sections/Formula";
import { Order } from "@/sections/Order";
import { Footer } from "@/sections/Footer";

const NatureBackground3D = lazy(() =>
  import("@/components/NatureBackground3D").then((m) => ({ default: m.NatureBackground3D }))
);

export default function App() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Suspense fallback={null}>
        <NatureBackground3D />
      </Suspense>
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <Showcase />
          <Benefits />
          <Formula />
          <Order />
        </main>
        <Footer />
      </div>
    </div>
  );
}
