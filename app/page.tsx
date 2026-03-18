import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/marketing/hero";
import { HowAurumThinks } from "@/components/marketing/how-aurum-thinks";
import { SignalStack, FeeFlywheelSection } from "@/components/marketing/sections";
import { PublicTerminalPreview } from "@/components/marketing/terminal-preview";
import { TickerTape } from "@/components/shared/ticker";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-aurum-bg">
      <Nav />
      <Hero />
      <TickerTape />
      <HowAurumThinks />
      <SignalStack />
      <PublicTerminalPreview />
      <FeeFlywheelSection />
      <Footer />
    </main>
  );
}
