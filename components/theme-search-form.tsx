"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Market } from "@/lib/types/stock";
import { cn } from "@/lib/utils/cn";

const SUGGESTED = [
  "AI 데이터센터 전력 인프라",
  "GLP-1 수혜 의료기기",
  "K-방산 수출 모멘텀",
  "Palantir처럼 B2G SaaS인데 아직 덜 알려진 곳",
];

const MARKETS: { value: Market | "ALL"; label: string }[] = [
  { value: "US", label: "US" },
  { value: "KR", label: "KR" },
  { value: "ALL", label: "ALL" },
];

export function ThemeSearchForm({ initialTheme = "" }: { initialTheme?: string }) {
  const router = useRouter();
  const [theme, setTheme] = useState(initialTheme);
  const [market, setMarket] = useState<Market | "ALL">("US");

  function go(t: string) {
    const q = t.trim();
    if (!q) return;
    router.push(`/search?theme=${encodeURIComponent(q)}&market=${market}`);
  }

  return (
    <div className="space-y-1.5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(theme);
        }}
        className="flex items-stretch gap-1"
      >
        <div className="bevel-in flex flex-1 items-stretch bg-term-bg">
          <span className="flex select-none items-center px-1.5 text-sm font-bold text-term-accent">
            {">"}
          </span>
          <input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="THEME / KEYWORD 입력 후 ENTER"
            spellCheck={false}
            className="flex-1 bg-transparent py-1.5 text-[12px] text-term-white outline-none placeholder:text-term-faint"
          />
        </div>
        <button
          type="submit"
          className="bevel bg-term-accent px-3 text-[11px] font-bold uppercase tracking-widest text-black active:translate-y-px"
        >
          RUN
        </button>
      </form>

      <div className="flex items-center gap-1 text-[10px]">
        <span className="text-term-faint">MKT</span>
        {MARKETS.map((m) => (
          <button
            key={m.value}
            onClick={() => setMarket(m.value)}
            className={cn(
              "bevel px-1.5 py-px font-bold uppercase tracking-widest",
              market === m.value
                ? "bg-term-accent text-black"
                : "bg-term-chrome text-term-muted hover:text-term-white",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1 pt-0.5">
        {SUGGESTED.map((s) => (
          <button
            key={s}
            onClick={() => {
              setTheme(s);
              go(s);
            }}
            className="border border-term-grid bg-term-bg px-1.5 py-0.5 text-left text-[10px] text-term-muted hover:border-term-accent-dim hover:text-term-fg"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
