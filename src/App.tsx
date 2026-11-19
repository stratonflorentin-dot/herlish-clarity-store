import { Nav } from "@/sections/Nav";
import { Hero } from "@/sections/Hero";
import { Marquee } from "@/sections/Marquee";
import { Benefits } from "@/sections/Benefits";
import { Formula } from "@/sections/Formula";
import { Order } from "@/sections/Order";
import { Footer } from "@/sections/Footer";

export default function App() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Benefits />
        <Formula />
        <Order />
      </main>
      <Footer />
    </div>
  );
}
