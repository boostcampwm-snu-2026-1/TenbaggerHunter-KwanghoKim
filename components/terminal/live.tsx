"use client";

/*
 * 라이브 갱신 컴포넌트 — mount 후 setInterval로 값을 흔들어 "살아있는" 단말기 느낌.
 * 하이드레이션 안전: 초기 렌더는 서버가 준 값 그대로. 갱신은 useEffect 안에서만.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { LineChartPanel } from "./chart";

function rnd() {
  return Math.random() - 0.5;
}

// "1,378.20" → { num: 1378.2, dec: 2 }
function parsePx(px: string) {
  const dec = px.includes(".") ? px.split(".")[1].length : 0;
  const num = parseFloat(px.replace(/,/g, "")) || 0;
  return { num, dec };
}
function fmtPx(num: number, dec: number) {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });
}

type TapeItem = { sym: string; px: string; chg: number };

/** 스크롤 + 주기적 가격/등락 흔들림 티커 테이프. */
export function LiveTickerTape({ items }: { items: TapeItem[] }) {
  const base = useRef(items.map((it) => ({ ...parsePx(it.px), chg: it.chg })));
  const [state, setState] = useState(items);

  useEffect(() => {
    const id = setInterval(() => {
      setState((prev) =>
        prev.map((it, i) => {
          const b = base.current[i];
          const d = rnd() * 0.18;
          b.num *= 1 + d / 100;
          b.chg = Math.max(-9.9, Math.min(9.9, b.chg + d));
          return { ...it, px: fmtPx(b.num, b.dec), chg: b.chg };
        }),
      );
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const doubled = [...state, ...state];
  return (
    <div className="overflow-hidden border-y border-term-border bg-term-bg py-0.5">
      <div className="ticker-track">
        {doubled.map((it, i) => (
          <span key={i} className="mx-3 inline-flex items-baseline gap-1.5 text-[11px]">
            <span className="font-bold text-term-accent">{it.sym}</span>
            <span className="tabular-nums text-term-white">{it.px}</span>
            <span
              className={cn(
                "tabular-nums",
                it.chg >= 0 ? "text-term-up" : "text-term-down",
              )}
            >
              {it.chg >= 0 ? "▲" : "▼"}
              {Math.abs(it.chg).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** 실시간 시계 (HH:MM:SS). */
export function LiveClock() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const tick = () =>
      setT(
        new Date().toLocaleTimeString("en-GB", { hour12: false }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums text-term-up">{t}</span>;
}

/** 라이브 라인차트 — 첫 시리즈를 랜덤워크로 한 칸씩 밀어넣는다. */
export function LiveLineChart({
  title,
  code,
  initial,
  volume: initialVol,
  yLabels,
  xLabels,
  className,
}: {
  title: string;
  code?: string;
  initial: number[];
  volume?: number[];
  yLabels?: string[];
  xLabels?: string[];
  className?: string;
}) {
  const [data, setData] = useState(initial);
  const [vol, setVol] = useState(initialVol);

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(
          last * 0.96,
          last * (1 + (rnd() * 2.4) / 100),
        );
        return [...prev.slice(1), next];
      });
      setVol((prev) =>
        prev ? [...prev.slice(1), Math.abs(rnd() * 18) + 3] : prev,
      );
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <LineChartPanel
      title={title}
      code={code}
      series={[{ data, tone: "accent" }]}
      volume={vol}
      yLabels={yLabels}
      xLabels={xLabels}
      className={className}
    />
  );
}

type Tick = { time: string; px: string; cond: string };

/** 라이브 Quote Recap — 새 체결을 위에 prepend. */
export function LiveQuoteRecap({
  symbol,
  initial,
  basePx,
  className,
}: {
  symbol: string;
  initial: Tick[];
  basePx: number;
  className?: string;
}) {
  const px = useRef(basePx);
  const [rows, setRows] = useState(initial);

  useEffect(() => {
    const id = setInterval(() => {
      const d = rnd() * 0.6;
      px.current = Math.max(1, px.current + d);
      const now = new Date().toLocaleTimeString("en-GB", { hour12: false });
      setRows((prev) =>
        [
          {
            time: now,
            px: px.current.toFixed(2),
            cond: (d >= 0 ? "+" : "") + d.toFixed(2),
          },
          ...prev,
        ].slice(0, 6),
      );
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className={cn(
        "bevel flex min-w-0 flex-col border border-term-border bg-term-panel",
        className,
      )}
    >
      <header className="flex items-center gap-2 bg-term-navy px-1.5 py-0.5">
        <h2 className="truncate text-[11px] font-bold text-term-accent">
          Quote Recap · {symbol}
        </h2>
        <span className="ml-auto text-[10px] text-term-info">QR</span>
      </header>
      <div className="flex-1 p-1">
        <div className="flex justify-between gap-2 border-b border-term-accent-dim pb-px text-[10px] font-bold uppercase text-term-accent">
          <span>TIME</span>
          <span>PRICE</span>
          <span>Δ</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={`${r.time}-${i}`}
            className="grid grid-cols-[1fr_4rem_3rem] gap-1 py-px text-[11px] tabular-nums odd:bg-term-navy-dk/40"
          >
            <span className="text-term-muted">{r.time}</span>
            <span className="text-right text-term-white">{r.px}</span>
            <span
              className={cn(
                "text-right",
                r.cond.startsWith("-") ? "text-term-down" : "text-term-up",
              )}
            >
              {r.cond}
            </span>
          </div>
        ))}
        <div className="mt-1 flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 animate-pulse bg-term-up" />
          <span className="text-[10px] text-term-faint">LIVE · MOCK FEED</span>
        </div>
      </div>
    </section>
  );
}
