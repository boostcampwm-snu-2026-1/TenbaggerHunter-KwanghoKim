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
  tam: "TAM 침투율",
  moat: "해자 강도",
  management: "경영진 신뢰",
  financials: "재무 건전성",
  narrative: "내러티브",
};

export function ScoreRadar({ axes }: { axes: ScoreAxes }) {
  const data = (Object.keys(LABELS) as (keyof ScoreAxes)[]).map((k) => ({
    axis: LABELS[k],
    value: axes[k],
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="#404040" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: "#a3a3a3", fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar dataKey="value" stroke="#34d399" fill="#34d399" fillOpacity={0.35} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
