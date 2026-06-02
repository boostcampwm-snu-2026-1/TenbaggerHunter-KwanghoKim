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
  { value: "US", label: "미국주" },
  { value: "KR", label: "한국주" },
  { value: "ALL", label: "전체" },
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
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(theme);
        }}
        className="flex gap-2"
      >
        <input
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="테마나 키워드를 자유롭게 입력하세요"
          className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm outline-none focus:border-neutral-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-neutral-100 px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-white"
        >
          탐색
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {MARKETS.map((m) => (
          <button
            key={m.value}
            onClick={() => setMarket(m.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              market === m.value
                ? "border-neutral-100 bg-neutral-100 text-neutral-900"
                : "border-neutral-700 text-neutral-400 hover:border-neutral-500",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {SUGGESTED.map((s) => (
          <button
            key={s}
            onClick={() => {
              setTheme(s);
              go(s);
            }}
            className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-600"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
