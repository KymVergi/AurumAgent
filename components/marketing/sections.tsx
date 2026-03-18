"use client";

import { motion } from "framer-motion";
import { Coins, Cpu, Eye, Zap, RefreshCw, TrendingUp } from "lucide-react";
import { ConfidenceBar } from "@/components/shared/ui";
import { mockAgentStatus, mockCompositeSignal } from "@/lib/mock-data";

// ─── Signal Stack Section ─────────────────────────────────────

export function SignalStack() {
  const signals = [
    {
      label: "Chart Structure",
      weight: mockCompositeSignal.chartWeight * 100,
      score: 62,
      description: "BTC higher lows, ETH range-bound, DXY softening",
      color: "bg-aurum-blue",
    },
    {
      label: "News Pulse",
      weight: mockCompositeSignal.newsWeight * 100,
      score: 48,
      description: "Mixed — ETF inflows positive, Fed patience negative",
      color: "bg-aurum-purple",
    },
    {
      label: "Polymarket Signals",
      weight: mockCompositeSignal.polymarketWeight * 100,
      score: 38,
      description: "38% Fed cut odds, 44% BTC >80K odds by April",
      color: "bg-aurum-gold",
    },
    {
      label: "Risk Budget",
      weight: 10,
      score: mockAgentStatus.treasuryHealth,
      description: "Treasury healthy, no open exposure, full budget available",
      color: "bg-emerald-500",
    },
  ];

  return (
    <section className="py-32 border-t border-aurum-bg-border/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-aurum-text-dim mb-4">
              Signal Architecture
            </p>
            <h2 className="font-display text-5xl text-aurum-text-primary font-light leading-none mb-6">
              A composite view,<br />
              <span className="text-gradient-gold italic">not a single bet</span>
            </h2>
            <p className="text-aurum-text-secondary leading-relaxed mb-8">
              AURUM&apos;s composite signal engine weights four independent
              signals before forming a view. No single input can force a decision.
              Conviction must emerge from convergence.
            </p>

            <div className="space-y-2 font-mono text-xs text-aurum-text-dim">
              <div className="flex items-center gap-3">
                <Eye className="w-3.5 h-3.5 text-aurum-text-dim" />
                Long bias threshold: composite ≥ +35 with confidence ≥ 65%
              </div>
              <div className="flex items-center gap-3">
                <Eye className="w-3.5 h-3.5 text-aurum-text-dim" />
                Short bias threshold: composite ≤ −35 with confidence ≥ 65%
              </div>
              <div className="flex items-center gap-3">
                <Eye className="w-3.5 h-3.5 text-aurum-text-dim" />
                Below thresholds → Watch or No Trade
              </div>
            </div>
          </motion.div>

          {/* Right: signal bars */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-lg border border-aurum-bg-border bg-aurum-bg-card p-6 space-y-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono tracking-[0.15em] uppercase text-aurum-text-dim">
                Signal Weights — Current Cycle
              </span>
              <span className="text-xs font-mono text-aurum-gold">
                Score: {mockCompositeSignal.score > 0 ? "+" : ""}{mockCompositeSignal.score}
              </span>
            </div>

            {signals.map((sig) => (
              <div key={sig.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-aurum-text-primary font-medium">{sig.label}</p>
                    <p className="text-xs text-aurum-text-dim mt-0.5">{sig.description}</p>
                  </div>
                  <span className="text-xs font-mono text-aurum-text-secondary ml-4">
                    {sig.weight.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-aurum-bg-border rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${sig.score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={`h-full rounded-full ${sig.color} opacity-70`}
                  />
                </div>
              </div>
            ))}

            {/* Composite */}
            <div className="pt-4 border-t border-aurum-bg-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono text-aurum-text-dim tracking-wide uppercase">
                  Composite Signal
                </span>
                <span className="text-xs font-mono text-aurum-gold">
                  Decision: WATCH
                </span>
              </div>
              <ConfidenceBar value={mockAgentStatus.confidence} showValue size="md" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Fee Flywheel Section ─────────────────────────────────────

const flywheelSteps = [
  {
    icon: Coins,
    label: "Token",
    desc: "AURUM token holders fund the treasury through fees on volume.",
  },
  {
    icon: Zap,
    label: "Fees",
    desc: "Transaction fees accumulate in the treasury, visible on-chain.",
  },
  {
    icon: Cpu,
    label: "Intelligence",
    desc: "Treasury pays for compute: Anthropic API, data feeds, infrastructure.",
  },
  {
    icon: TrendingUp,
    label: "Execution",
    desc: "Funded intelligence enables disciplined market participation via Bankr.",
  },
  {
    icon: RefreshCw,
    label: "Public Proof",
    desc: "Every decision is logged publicly. Performance builds trust and attention.",
  },
];

export function FeeFlywheelSection() {
  return (
    <section className="py-32 border-t border-aurum-bg-border/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-aurum-text-dim mb-4">
            Token Economics
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-aurum-text-primary font-light leading-none mb-6">
            The fee flywheel
          </h2>
          <p className="text-aurum-text-secondary max-w-xl mx-auto leading-relaxed">
            AURUM is designed to eventually fund itself. Token fees pay for intelligence.
            Intelligence generates proof. Proof attracts attention. Attention generates fees.
          </p>
        </motion.div>

        {/* Flywheel steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-aurum-bg-border to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {flywheelSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative mb-5">
                    <div className="w-10 h-10 rounded-full bg-aurum-bg-card border border-aurum-bg-border flex items-center justify-center relative z-10">
                      <Icon className="w-4 h-4 text-aurum-gold" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-aurum-gold/10 blur-md" />
                  </div>
                  <p className="text-sm font-display text-aurum-text-primary mb-2">{step.label}</p>
                  <p className="text-xs text-aurum-text-dim leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-xs font-mono text-aurum-text-dim mt-16 max-w-lg mx-auto leading-relaxed"
        >
          Bankr integration is live on roadmap. The product architecture is designed
          for execution from day one. All interfaces and adapters are in place.
        </motion.p>
      </div>
    </section>
  );
}
