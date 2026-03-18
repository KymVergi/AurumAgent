"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { OHLCBar } from "@/types";

interface SparklineProps {
  data: OHLCBar[];
  color?: string;
  height?: number;
  showGradient?: boolean;
}

export function Sparkline({
  data,
  color = "#D4A843",
  height = 48,
  showGradient = true,
}: SparklineProps) {
  const chartData = data.map((bar) => ({ value: bar.close }));
  const gradientId = `gradient-${color.replace("#", "")}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={showGradient ? `url(#${gradientId})` : "none"}
          dot={false}
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Confidence Trend ──────────────────────────────────────────

interface ConfidenceTrendProps {
  data: number[]; // array of confidence values
  height?: number;
}

export function ConfidenceTrend({ data, height = 40 }: ConfidenceTrendProps) {
  const chartData = data.map((v, i) => ({ i, value: v }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke="#7B5EA7"
          strokeWidth={1.5}
          dot={false}
          animationDuration={600}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Score Bar Chart ───────────────────────────────────────────

interface ScoreGaugeProps {
  score: number; // -100 to 100
  size?: "sm" | "md" | "lg";
}

export function ScoreGauge({ score, size = "md" }: ScoreGaugeProps) {
  const isPositive = score >= 0;
  const absScore = Math.abs(score);
  const color = score > 35 ? "#34d399" : score < -35 ? "#f43f5e" : "#D4A843";
  const widthPercent = (absScore / 100) * 50;

  const heights = { sm: "h-1.5", md: "h-2", lg: "h-3" };

  return (
    <div className="flex items-center gap-1 w-full">
      {/* Left side (bearish) */}
      <div className="flex-1 flex justify-end">
        {!isPositive && (
          <div
            className={`${heights[size]} rounded-full bg-rose-400 transition-all duration-700`}
            style={{ width: `${widthPercent * 2}%` }}
          />
        )}
      </div>
      {/* Center line */}
      <div className="w-px h-4 bg-aurum-bg-border" />
      {/* Right side (bullish) */}
      <div className="flex-1">
        {isPositive && (
          <div
            className={`${heights[size]} rounded-full transition-all duration-700`}
            style={{ width: `${widthPercent * 2}%`, backgroundColor: color }}
          />
        )}
      </div>
    </div>
  );
}
