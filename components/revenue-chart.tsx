"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TICK = { fill: "var(--term-accent)", fontSize: 9, fontFamily: "var(--font-mono)" };

export function RevenueChart({ data }: { data: { year: number; revenue: number }[] }) {
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="1 2" stroke="var(--term-grid)" vertical={false} />
          <XAxis dataKey="year" tick={TICK} axisLine={false} tickLine={false} />
          <YAxis
            tick={TICK}
            axisLine={false}
            tickLine={false}
            width={28}
            tickFormatter={(v: number) => `${(v / 1_000_000_000).toFixed(0)}B`}
          />
          <Tooltip
            cursor={{ fill: "var(--term-navy-dk)" }}
            contentStyle={{
              background: "var(--term-navy)",
              border: "1px solid var(--term-border)",
              borderRadius: 0,
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: "var(--term-white)",
            }}
            formatter={(v: number) => [`$${(v / 1_000_000_000).toFixed(1)}B`, "REV"]}
          />
          <Bar dataKey="revenue" fill="var(--term-accent-dim)" radius={[0, 0, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
