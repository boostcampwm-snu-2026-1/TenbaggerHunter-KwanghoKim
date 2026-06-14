"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Market } from "@/lib/types/stock";
import {
  CRITERIA,
  selectedBlurbs,
  type CriterionId,
  type SelectedCriteria,
} from "@/lib/discovery/criteria";
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

export function ThemeSearchForm({
  initialTheme = "",
  initialCriteria = {},
}: {
  initialTheme?: string;
  initialCriteria?: SelectedCriteria;
}) {
  const router = useRouter();
  const [theme, setTheme] = useState(initialTheme);
  const [market, setMarket] = useState<Market | "ALL">("US");
  const [criteria, setCriteria] = useState<SelectedCriteria>(initialCriteria);

  function toggle(id: CriterionId, value: string) {
    setCriteria((prev) => ({ ...prev, [id]: prev[id] === value ? undefined : value }));
  }

  function go(t: string) {
    const q = t.trim();
    if (!q) return;
    const params = new URLSearchParams({ theme: q, market });
    for (const c of CRITERIA) {
      const v = criteria[c.id];
      if (v) params.set(c.id, v);
    }
    router.push(`/search?${params.toString()}`);
  }

  const blurbs = selectedBlurbs(criteria);

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
        <span className="w-9 shrink-0 text-term-faint">MKT</span>
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

      {CRITERIA.map((c) => (
        <div key={c.id} className="flex items-center gap-1 text-[10px]">
          <span className="w-9 shrink-0 text-term-faint">{c.code}</span>
          {c.options.map((o) => (
            <button
              key={o.value}
              type="button"
              title={o.blurb}
              onClick={() => toggle(c.id, o.value)}
              className={cn(
                "bevel px-1.5 py-px font-bold tracking-wide",
                criteria[c.id] === o.value
                  ? "bg-term-accent text-black"
                  : "bg-term-chrome text-term-muted hover:text-term-white",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      ))}

      {blurbs.length > 0 && (
        <div className="truncate pt-0.5 text-[10px] text-term-faint">
          <span className="text-term-accent">PROFILE</span> · {blurbs.join(" · ")}
        </div>
      )}

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
