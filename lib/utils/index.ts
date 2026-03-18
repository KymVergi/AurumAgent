import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AgentDecision, SignalStrength, TrendDirection, RiskLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, decimals = 2): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(decimals)}`;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(0);
}

export function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatPrice(value: number): string {
  if (value < 0.01) return value.toFixed(6);
  if (value < 1) return value.toFixed(4);
  if (value < 100) return value.toFixed(2);
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function decisionLabel(decision: AgentDecision): string {
  const map: Record<AgentDecision, string> = {
    no_trade: "NO TRADE",
    watch: "WATCH",
    long_bias: "LONG BIAS",
    short_bias: "SHORT BIAS",
    reduce_risk: "REDUCE RISK",
    thesis_update: "THESIS UPDATE",
  };
  return map[decision];
}

export function decisionColor(decision: AgentDecision): string {
  const map: Record<AgentDecision, string> = {
    no_trade: "text-aurum-text-secondary",
    watch: "text-aurum-gold",
    long_bias: "text-emerald-400",
    short_bias: "text-rose-400",
    reduce_risk: "text-orange-400",
    thesis_update: "text-aurum-purple-light",
  };
  return map[decision];
}

export function decisionBg(decision: AgentDecision): string {
  const map: Record<AgentDecision, string> = {
    no_trade: "bg-aurum-bg-border/50 text-aurum-text-secondary",
    watch: "bg-aurum-gold/10 text-aurum-gold border-aurum-gold/20",
    long_bias: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    short_bias: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    reduce_risk: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    thesis_update: "bg-aurum-purple/10 text-aurum-purple-light border-aurum-purple/20",
  };
  return map[decision];
}

export function signalColor(strength: SignalStrength): string {
  const map: Record<SignalStrength, string> = {
    strong: "text-emerald-400",
    moderate: "text-aurum-gold",
    weak: "text-orange-400",
    neutral: "text-aurum-text-secondary",
  };
  return map[strength];
}

export function trendColor(trend: TrendDirection): string {
  const map: Record<TrendDirection, string> = {
    bullish: "text-emerald-400",
    bearish: "text-rose-400",
    neutral: "text-aurum-text-secondary",
    mixed: "text-aurum-gold",
  };
  return map[trend];
}

export function riskColor(level: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    low: "text-emerald-400",
    medium: "text-aurum-gold",
    high: "text-orange-400",
    critical: "text-rose-400",
  };
  return map[level];
}

export function confidenceLabel(confidence: number): string {
  if (confidence >= 80) return "HIGH";
  if (confidence >= 60) return "MODERATE";
  if (confidence >= 40) return "LOW";
  return "VERY LOW";
}
