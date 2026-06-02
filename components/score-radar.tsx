"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { ScoreAxes } from "@/lib/types/stock";

const LABELS: Record<keyof ScoreAxes, string> = {
  tam: "TAM",
  moat: "MOAT",
  management: "MGMT",
  financials: "FIN",
  narrative: "NARR",
};

export function ScoreRadar({ axes }: { axes: ScoreAxes }) {
  const data = (Object.keys(LABELS) as (keyof ScoreAxes)[]).map((k) => ({
    axis: LABELS[k],
    value: axes[k],
  }));

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="var(--term-border)" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "var(--term-accent)", fontSize: 10, fontFamily: "var(--font-mono)" }}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="value"
            stroke="var(--term-up)"
            fill="var(--term-up)"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
