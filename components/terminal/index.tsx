/*
 * ─────────────────────────────────────────────────────────────
 * TERMINAL UI PRIMITIVES — Bloomberg classic GUI 재현
 * 레퍼런스: docs/design/bloomberg-reference-3.png
 * 모든 화면은 raw <div> 대신 이 프리미티브를 조립한다. (docs/DESIGN.md)
 * ─────────────────────────────────────────────────────────────
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "default" | "accent" | "up" | "down" | "info" | "warn" | "mag";

const TEXT_TONE: Record<Tone, string> = {
  default: "text-term-white",
  accent: "text-term-accent",
  up: "text-term-up",
  down: "text-term-down",
  info: "text-term-info",
  warn: "text-term-warn",
  mag: "text-term-mag",
};

const SOLID_TONE: Record<Tone, string> = {
  default: "bg-term-chrome text-term-white",
  accent: "bg-term-accent text-black",
  up: "bg-term-up text-black",
  down: "bg-term-down text-black",
  info: "bg-term-info text-black",
  warn: "bg-term-warn text-black",
  mag: "bg-term-mag text-black",
};

/**
 * 데이터 패널. 네이비 타이틀바(주황 글자) + Win95 베벨 + 검정 본문.
 * 레퍼런스의 모든 창이 이 형태다.
 */
export function Panel({
  title,
  code,
  right,
  className,
  bodyClassName,
  children,
}: {
  title?: ReactNode;
  /** 타이틀바 우측 코드/식별자 (예: "RT" "1)") */
  code?: ReactNode;
  /** 타이틀바 우측 커스텀 노드 (code 대신) */
  right?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "bevel flex min-w-0 flex-col border border-term-border bg-term-panel",
        className,
      )}
    >
      {(title || code || right) && (
        <header className="flex items-center gap-2 bg-term-navy px-1.5 py-0.5">
          {title && (
            <h2 className="truncate text-[11px] font-bold text-term-accent">
              {title}
            </h2>
          )}
          <div className="ml-auto text-[10px] text-term-info">
            {right ?? code}
          </div>
        </header>
      )}
      <div className={cn("flex-1 p-1", bodyClassName)}>{children}</div>
    </section>
  );
}

/** 라벨(좌) — 값(우). 초고밀도 한 줄. */
export function DataRow({
  label,
  value,
  tone = "default",
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-2 py-px text-[11px] leading-tight",
        className,
      )}
    >
      <span className="truncate text-term-muted">{label}</span>
      <span className={cn("shrink-0 tabular-nums", TEXT_TONE[tone])}>
        {value}
      </span>
    </div>
  );
}

/** 컬럼 헤더 행 (주황). 표 상단. */
export function ColHead({ cols }: { cols: string[] }) {
  return (
    <div className="flex justify-between gap-2 border-b border-term-accent-dim pb-px text-[10px] font-bold uppercase text-term-accent">
      {cols.map((c, i) => (
        <span key={i} className={i === 0 ? "" : "text-right"}>
          {c}
        </span>
      ))}
    </div>
  );
}

/** 증감 값 — green/red, +/- 부호. */
export function Delta({
  value,
  suffix = "",
  withSign = true,
  className,
}: {
  value: number;
  suffix?: string;
  withSign?: boolean;
  className?: string;
}) {
  const up = value >= 0;
  const sign = withSign ? (up ? "+" : "-") : up ? "" : "-";
  return (
    <span
      className={cn(
        "tabular-nums",
        up ? "text-term-up" : "text-term-down",
        className,
      )}
    >
      {sign}
      {Math.abs(value).toFixed(2)}
      {suffix}
    </span>
  );
}

/** 작은 베벨 태그/칩. 상태·시장 라벨. */
export function Tag({
  children,
  tone = "accent",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bevel inline-block px-1 text-[10px] font-bold uppercase leading-tight",
        SOLID_TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** 히트맵 셀 — 값 강도에 따라 색 블록. */
export function Cell({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const bg: Record<Tone, string> = {
    default: "bg-term-elevated text-term-white",
    accent: "bg-term-accent/25 text-term-accent",
    up: "bg-term-up/25 text-term-up",
    down: "bg-term-down/25 text-term-down",
    info: "bg-term-info/25 text-term-info",
    warn: "bg-term-warn/25 text-term-warn",
    mag: "bg-term-mag/25 text-term-mag",
  };
  return (
    <span
      className={cn(
        "flex items-center justify-center px-1 py-0.5 text-center text-[10px] tabular-nums",
        bg[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** ASCII 스파크라인 — 블록 문자 미니차트. */
const SPARK = "▁▂▃▄▅▆▇█";
export function Sparkline({
  data,
  tone,
  className,
}: {
  data: number[];
  tone?: Tone;
  className?: string;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const chars = data
    .map((v) => SPARK[Math.round(((v - min) / span) * (SPARK.length - 1))])
    .join("");
  const auto = data[data.length - 1] >= data[0] ? "up" : "down";
  return (
    <span className={cn("tracking-tighter", TEXT_TONE[tone ?? (auto as Tone)], className)}>
      {chars}
    </span>
  );
}

/** 비율 바 — 0~100% 채움. */
export function Bar({
  pct,
  tone = "up",
  className,
}: {
  pct: number;
  tone?: Tone;
  className?: string;
}) {
  const bg: Record<Tone, string> = {
    default: "bg-term-white",
    accent: "bg-term-accent",
    up: "bg-term-up",
    down: "bg-term-down",
    info: "bg-term-info",
    warn: "bg-term-warn",
    mag: "bg-term-mag",
  };
  return (
    <span className={cn("bevel-in flex h-2 w-full bg-term-elevated", className)}>
      <span
        className={cn("h-full", bg[tone])}
        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </span>
  );
}

/** 스크롤 티커 테이프. */
export function TickerTape({
  items,
}: {
  items: { sym: string; px: string; chg: number }[];
}) {
  const doubled = [...items, ...items];
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

/** 하단 번호 뉴스 피드 — 주황 번호 + 헤드라인. */
export function NewsFeed({
  items,
}: {
  items: { n: number; h: string; t: string }[];
}) {
  return (
    <div className="bg-term-bg">
      {items.map((it) => (
        <div
          key={it.n}
          className="flex items-baseline gap-2 border-b border-term-grid px-1 py-px text-[11px] leading-tight last:border-0"
        >
          <span className="shrink-0 font-bold tabular-nums text-term-accent">
            {it.n}
          </span>
          <span className="min-w-0 flex-1 truncate text-term-white">{it.h}</span>
          <span className="shrink-0 tabular-nums text-term-faint">{it.t}</span>
        </div>
      ))}
    </div>
  );
}

/** 프롬프트 라벨. */
export function Prompt({ children }: { children: ReactNode }) {
  return (
    <span className="text-term-accent">
      <span className="text-term-faint">{">"}</span> {children}
    </span>
  );
}
