import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-aurum-bg flex items-center justify-center">
      <div className="text-center space-y-6 px-6">
        <p className="text-xs font-mono tracking-[0.3em] uppercase text-aurum-text-dim">
          404 — Not Found
        </p>
        <h1 className="font-display text-7xl text-aurum-text-primary font-light">
          Signal lost.
        </h1>
        <p className="text-aurum-text-secondary max-w-sm mx-auto leading-relaxed">
          This page does not exist. The agent is watching other markets.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-aurum-bg-border text-aurum-text-secondary text-sm font-mono uppercase tracking-wide hover:text-aurum-text-primary hover:border-aurum-text-dim transition-all rounded-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Return home
        </Link>
      </div>
    </main>
  );
}
