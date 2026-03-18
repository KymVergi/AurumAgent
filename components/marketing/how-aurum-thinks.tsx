"use client";

import { motion } from "framer-motion";
import { BarChart2, Newspaper, Target, Shield, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: BarChart2,
    number: "01",
    label: "Chart Structure",
    title: "Read the market structure",
    body: "AURUM ingests OHLC data and identifies trend direction, key levels, support and resistance, and volatility regime. The chart provides the skeleton of every decision.",
    color: "text-aurum-blue-light",
    borderColor: "border-aurum-blue/20",
    bgColor: "bg-aurum-blue/5",
  },
  {
    icon: Newspaper,
    number: "02",
    label: "News Pulse",
    title: "Classify the narrative",
    body: "Every relevant headline is passed through the Anthropic classification layer. Sentiment is scored, macro implications are extracted, and noise is filtered from signal.",
    color: "text-aurum-purple-light",
    borderColor: "border-aurum-purple/20",
    bgColor: "bg-aurum-purple/5",
  },
  {
    icon: Target,
    number: "03",
    label: "Prediction Markets",
    title: "Read the crowd's conviction",
    body: "Polymarket odds on macro events — rate decisions, CPI prints, crypto milestones — provide real-money probability estimates that supplement the agent's own analysis.",
    color: "text-aurum-gold",
    borderColor: "border-aurum-gold/20",
    bgColor: "bg-aurum-gold/5",
  },
  {
    icon: Shield,
    number: "04",
    label: "Risk Framework",
    title: "Decide — or decide not to",
    body: "The composite signal engine combines all inputs against the treasury state and risk budget. If conviction doesn't clear the threshold, the agent does nothing. No trade is always valid.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    bgColor: "bg-emerald-500/5",
  },
];

export function HowAurumThinks() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-aurum-text-dim mb-4">
            Intelligence Architecture
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-aurum-text-primary font-light leading-none">
            How AURUM thinks
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-lg border ${step.borderColor} ${step.bgColor} p-6 group`}
              >
                {/* Number */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`font-mono text-xs tracking-[0.15em] ${step.color} opacity-60`}>
                    {step.number}
                  </span>
                  <div className={`p-2 rounded-sm border ${step.borderColor} ${step.bgColor}`}>
                    <Icon className={`w-4 h-4 ${step.color}`} />
                  </div>
                </div>

                {/* Label */}
                <p className={`text-xs font-mono tracking-[0.12em] uppercase mb-2 ${step.color} opacity-70`}>
                  {step.label}
                </p>

                {/* Title */}
                <h3 className="font-display text-xl text-aurum-text-primary font-light leading-snug mb-3">
                  {step.title}
                </h3>

                {/* Body */}
                <p className="text-sm text-aurum-text-secondary leading-relaxed">
                  {step.body}
                </p>

                {/* Connector arrow (not on last) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-6 rounded-full bg-aurum-bg-card border border-aurum-bg-border flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-aurum-text-dim" />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
