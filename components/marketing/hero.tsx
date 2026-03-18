"use client";

import Link from "next/link";
import { ArrowRight, Activity, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { DecisionBadge } from "@/components/shared/ui";
import { mockAgentStatus } from "@/lib/mock-data";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">
      {/* Background layers */}
      <div className="absolute inset-0 bg-aurum-hero pointer-events-none" />
      <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" />

      {/* Subtle scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-aurum-gold/10 to-transparent"
          style={{ animation: "scanLine 8s linear infinite", top: 0 }}
        />
      </div>

      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-aurum-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-aurum-gold/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-aurum-blue/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-4xl">
          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 border border-aurum-bg-border rounded-sm bg-aurum-bg-card/60 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-xs font-mono text-aurum-text-dim tracking-widest uppercase">
                Agent Active
              </span>
            </div>
            <DecisionBadge decision={mockAgentStatus.decision} />
            <span className="text-xs font-mono text-aurum-text-dim">
              Confidence: {mockAgentStatus.confidence}%
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl font-light leading-none tracking-tight mb-6"
          >
            <span className="text-aurum-text-primary">The self-funding</span>
            <br />
            <span className="text-gradient-gold italic">macro agent.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-lg md:text-xl text-aurum-text-secondary font-body font-light leading-relaxed max-w-2xl mb-10"
          >
            AURUM studies charts, classifies news, reads prediction markets,
            and decides whether to act — publicly, transparently, autonomously.
            <span className="text-aurum-text-primary"> Token-powered intelligence for macro markets.</span>
          </motion.p>

          {/* Signal summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap items-center gap-3 mb-10 font-mono text-xs text-aurum-text-dim"
          >
            {["Charts", "News", "Odds", "Conviction"].map((item, i) => (
              <span key={item} className="flex items-center gap-3">
                <span className="text-aurum-text-secondary tracking-widest uppercase">{item}</span>
                {i < 3 && <span className="text-aurum-bg-border">—</span>}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/dashboard"
              className="group flex items-center gap-3 px-6 py-3.5 bg-aurum-gold text-aurum-bg font-mono text-sm tracking-[0.08em] uppercase rounded-sm hover:bg-aurum-gold-light transition-all duration-200"
            >
              <Activity className="w-4 h-4" />
              Open Terminal
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/agent/aurum"
              className="flex items-center gap-3 px-6 py-3.5 border border-aurum-bg-border text-aurum-text-secondary font-mono text-sm tracking-[0.08em] uppercase rounded-sm hover:border-aurum-text-dim hover:text-aurum-text-primary transition-all duration-200 backdrop-blur-sm"
            >
              View Agent
            </Link>

            <a
              href="https://x.com/AurumAgent"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3.5 text-aurum-text-dim hover:text-aurum-text-secondary transition-colors"
              aria-label="Follow on X"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Hero preview card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-24 max-w-3xl"
        >
          <HeroTerminalPreview />
        </motion.div>
      </div>
    </section>
  );
}

function HeroTerminalPreview() {
  const lines = [
    { t: 20, text: "→ Ingesting chart structure: BTC/USD 4H", color: "text-aurum-text-dim" },
    { t: 40, text: "→ Higher lows intact. Resistance at 72,400.", color: "text-aurum-text-secondary" },
    { t: 60, text: "→ Classifying 8 news items via Anthropic...", color: "text-aurum-text-dim" },
    { t: 80, text: "→ Net sentiment: MIXED (4 bullish / 3 bearish / 1 neutral)", color: "text-aurum-text-secondary" },
    { t: 100, text: "→ Fetching Polymarket signals...", color: "text-aurum-text-dim" },
    { t: 120, text: "→ Fed cut probability: 38% — below long-bias threshold", color: "text-orange-400" },
    { t: 140, text: "→ Building composite signal...", color: "text-aurum-text-dim" },
    { t: 160, text: "→ Composite score: +22 | Confidence: 58%", color: "text-aurum-gold" },
    { t: 180, text: "─".repeat(48), color: "text-aurum-bg-border" },
    { t: 200, text: "⬡ DECISION: WATCH — conviction threshold not met", color: "text-aurum-gold" },
    { t: 220, text: "  Preserving risk budget. Monitoring 72,400 breakout.", color: "text-aurum-text-secondary" },
  ];

  return (
    <div className="relative rounded-lg border border-aurum-bg-border bg-aurum-bg-card/80 backdrop-blur-sm overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-aurum-bg-border">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <span className="text-xs font-mono text-aurum-text-dim tracking-widest">
          AURUM // SIGNAL PIPELINE
        </span>
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span className="text-xs font-mono text-emerald-400">LIVE</span>
        </div>
      </div>

      {/* Terminal content */}
      <div className="p-5 space-y-1.5 min-h-[200px]">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
            className={`text-xs font-mono leading-relaxed ${line.color}`}
          >
            {line.text}
          </motion.p>
        ))}

        {/* Cursor */}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="inline-block w-2 h-3 bg-aurum-gold/60 ml-1 align-middle"
        />
      </div>

      {/* GIF placeholder area */}
      <div className="mx-5 mb-5 h-2 rounded-full bg-aurum-bg-border/30 overflow-hidden">
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-full w-1/3 bg-gradient-to-r from-transparent via-aurum-gold/30 to-transparent"
        />
      </div>
    </div>
  );
}
