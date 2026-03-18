"use client";

import { cn } from "@/lib/utils";
import type { AgentDecision, SignalStrength, TrendDirection, RiskLevel } from "@/types";
import { decisionBg, decisionLabel, signalColor, trendColor, riskColor } from "@/lib/utils";

// ─── Badge ─────────────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gold" | "purple" | "green" | "red" | "orange";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  const variants = {
    default: "border-aurum-bg-border text-aurum-text-secondary bg-aurum-bg-elevated",
    gold: "border-aurum-gold/30 text-aurum-gold bg-aurum-gold/10",
    purple: "border-aurum-purple/30 text-aurum-purple-light bg-aurum-purple/10",
    green: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    red: "border-rose-500/30 text-rose-400 bg-rose-500/10",
    orange: "border-orange-500/30 text-orange-400 bg-orange-500/10",
  };
  return (
    <span className={cn("badge", variants[variant], className)}>
      {children}
    </span>
  );
}

// ─── Decision Badge ────────────────────────────────────────────

export function DecisionBadge({ decision }: { decision: AgentDecision }) {
  return (
    <span className={cn("badge border", decisionBg(decision))}>
      {decisionLabel(decision)}
    </span>
  );
}

// ─── Confidence Bar ────────────────────────────────────────────

interface ConfidenceBarProps {
  value: number; // 0–100
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function ConfidenceBar({
  value,
  label,
  showValue = true,
  size = "md",
  className,
}: ConfidenceBarProps) {
  const color =
    value >= 70
      ? "bg-emerald-400"
      : value >= 50
      ? "bg-aurum-gold"
      : value >= 30
      ? "bg-orange-400"
      : "bg-rose-400";

  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-xs font-mono text-aurum-text-dim tracking-wide uppercase">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-xs font-mono text-aurum-text-secondary">
              {value}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-aurum-bg-border rounded-full overflow-hidden",
          size === "sm" ? "h-1" : "h-1.5"
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// ─── Card ──────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "gold" | "purple" | "none";
  hover?: boolean;
}

export function Card({ children, className, glow = "none", hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg card-glass p-5",
        glow === "gold" && "card-gold-border",
        glow === "purple" && "card-purple-border",
        glow === "none" && "border border-aurum-bg-border",
        hover && "hover:border-aurum-bg-border/80 transition-all duration-300 hover:shadow-card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Card Header ───────────────────────────────────────────────

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

export function CardHeader({ title, subtitle, icon, action, badge }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 text-aurum-text-dim">{icon}</div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-mono tracking-[0.12em] uppercase text-aurum-text-dim">
              {title}
            </h3>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs text-aurum-text-dim mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="text-aurum-text-dim">{action}</div>}
    </div>
  );
}

// ─── Stat ──────────────────────────────────────────────────────

interface StatProps {
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  mono?: boolean;
  large?: boolean;
}

export function Stat({ label, value, change, changePositive, mono, large }: StatProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-mono tracking-[0.1em] uppercase text-aurum-text-dim">{label}</p>
      <p className={cn(
        large ? "text-2xl" : "text-lg",
        mono ? "font-mono" : "font-display",
        "text-aurum-text-primary font-medium leading-tight"
      )}>
        {value}
      </p>
      {change && (
        <p className={cn(
          "text-xs font-mono",
          changePositive ? "text-emerald-400" : "text-rose-400"
        )}>
          {change}
        </p>
      )}
    </div>
  );
}

// ─── Section Divider ───────────────────────────────────────────

export function SectionDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 my-8">
      <div className="flex-1 h-px bg-aurum-bg-border" />
      {label && (
        <span className="text-xs font-mono tracking-[0.15em] uppercase text-aurum-text-dim px-2">
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-aurum-bg-border" />
    </div>
  );
}

// ─── Live Dot ──────────────────────────────────────────────────

export function LiveDot({ color = "emerald" }: { color?: "emerald" | "gold" | "red" }) {
  const colors = {
    emerald: "bg-emerald-400",
    gold: "bg-aurum-gold",
    red: "bg-rose-400",
  };
  return (
    <span className="relative flex h-2 w-2">
      <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-50", colors[color])} />
      <span className={cn("relative inline-flex rounded-full h-2 w-2", colors[color])} />
    </span>
  );
}

// ─── Signal Row ────────────────────────────────────────────────

interface SignalRowProps {
  label: string;
  value: string;
  color?: string;
  mono?: boolean;
}

export function SignalRow({ label, value, color, mono }: SignalRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-aurum-bg-border/50 last:border-0">
      <span className="text-xs font-mono text-aurum-text-dim tracking-wide">{label}</span>
      <span className={cn("text-xs", mono && "font-mono", color ?? "text-aurum-text-secondary")}>
        {value}
      </span>
    </div>
  );
}
