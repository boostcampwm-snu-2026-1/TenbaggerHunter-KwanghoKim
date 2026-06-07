import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { NewsFeed } from "@/components/terminal";
import { LiveTickerTape, LiveClock } from "@/components/terminal/live";
import { TopToolbar } from "@/components/terminal/toolbar";
import { CommandLine } from "@/components/terminal/command-line";
import "./globals.css";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "TENBAGGER HUNTER",
  description: "AI 기반 글로벌 주식 Tenbagger 후보 탐색 도구",
};

const TAPE = [
  { sym: "NVDA", px: "1204.18", chg: 3.42 },
  { sym: "PLTR", px: "28.91", chg: 5.17 },
  { sym: "SMCI", px: "812.40", chg: -2.31 },
  { sym: "ARM", px: "168.22", chg: 1.04 },
  { sym: "VRT", px: "94.55", chg: 4.88 },
  { sym: "005930.KS", px: "78,400", chg: -0.63 },
  { sym: "042700.KS", px: "212,500", chg: 2.95 },
  { sym: "TSLA", px: "248.50", chg: -1.12 },
  { sym: "CEG", px: "201.77", chg: 6.40 },
  { sym: "LLY", px: "812.93", chg: 0.88 },
];

const NEWS = [
  { n: 661, h: "하이퍼스케일러 CapEx 가이던스 상향 — 전력·냉각 인프라 수혜주 일제 급등", t: "10:30" },
  { n: 663, h: "美 의회, 차세대 원전 세액공제 확대안 통과… 우라늄·SMR 관련주 강세", t: "10:24" },
  { n: 659, h: "VRT 분기 가이던스 컨센서스 12% 상회, 데이터센터 수요 견조", t: "10:11" },
  { n: 642, h: "한화에어로 폴란드 K9 2차 계약 임박 보도 — K-방산 모멘텀 지속", t: "09:58" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={mono.variable}>
      <body>
        <div className="flex min-h-screen flex-col">
          {/* window title bar */}
          <div className="flex items-center gap-2 bg-term-navy px-2 py-0.5">
            <Link
              href="/"
              className="text-[11px] font-bold tracking-wide text-term-white"
            >
              <span className="text-term-accent">1)</span> TENBAGGER HUNTER —
              GLOBAL EQUITY DISCOVERY TERMINAL
            </Link>
            <div className="ml-auto flex gap-1">
              {["_", "▢", "✕"].map((s, i) => (
                <span
                  key={i}
                  className="bevel bg-term-chrome px-1.5 text-[9px] leading-tight text-term-white"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <TopToolbar />

          {/* security / command bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-term-bevel-dk bg-term-navy-dk px-2 py-0.5">
            <span className="text-[11px] font-bold text-term-accent">
              TENBAGGER HUNTER
            </span>
            <span className="bevel bg-term-chrome px-1 text-[10px] text-term-white">
              EQUITY
            </span>
            <span className="text-[10px] text-term-info underline">
              Related Functions
            </span>
            <span className="text-[10px] text-term-muted">
              <span className="text-term-accent">&lt;HELP&gt;</span> for
              explanation · <span className="text-term-info">200&lt;Go&gt;</span>{" "}
              to analyze securities
            </span>
            <span className="hidden text-[10px] text-term-faint sm:inline">
              <LiveClock /> EST
            </span>
            <div className="ml-auto min-w-[200px] flex-1 sm:max-w-xs">
              <CommandLine />
            </div>
          </div>

          <LiveTickerTape items={TAPE} />

          <main className="flex-1 bg-term-chrome p-1">{children}</main>

          {/* news feed */}
          <div className="border-t border-term-bevel-dk">
            <NewsFeed items={NEWS} />
          </div>

          {/* green promo banner + disclaimer */}
          <footer className="flex items-center gap-2 bg-term-up px-2 py-0.5 text-black">
            <span className="text-[11px] font-bold tracking-wide">
              TENBAGGER HUNTER — AI EQUITY DISCOVERY
            </span>
            <span className="bevel bg-term-down px-1.5 text-[10px] font-bold text-black">
              투자 참고용 · 금융조언 아님
            </span>
            <span className="ml-auto hidden truncate text-[10px] md:block">
              모든 투자 판단·책임은 본인에게 있습니다.
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}
