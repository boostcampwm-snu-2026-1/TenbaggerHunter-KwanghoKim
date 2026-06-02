import {
  Panel,
  DataRow,
  Delta,
  Cell,
  ColHead,
  Sparkline,
  Bar,
} from "@/components/terminal";
import { LineChartPanel } from "@/components/terminal/chart";
import { LiveLineChart, LiveQuoteRecap } from "@/components/terminal/live";
import { ThemeSearchForm } from "@/components/theme-search-form";

// ── mock 데이터 ──────────────────────────────────────────────
const NDX = [182, 184, 181, 183, 188, 186, 191, 189, 194, 198, 195, 207, 204, 212, 218, 224];
const NDX_VOL = [4, 6, 5, 8, 12, 7, 9, 6, 11, 14, 8, 16, 10, 13, 9, 18];

const FLOW_A = [70, 72, 68, 74, 80, 76, 84, 88, 82, 90, 86, 94, 98, 92, 100, 108];
const FLOW_B = [88, 84, 86, 80, 78, 82, 76, 72, 74, 70, 66, 68, 64, 60, 62, 58];

const INDICES = [
  { name: "S&P 500", px: "5,847.21", c: 0.62 },
  { name: "NASDAQ", px: "18,914.4", c: 1.04 },
  { name: "DOW", px: "43,221.9", c: -0.18 },
  { name: "RUSSELL", px: "2,318.7", c: 1.41 },
  { name: "KOSPI", px: "2,712.34", c: -0.63 },
  { name: "KOSDAQ", px: "861.22", c: 0.27 },
  { name: "NIKKEI", px: "39,108.0", c: 0.88 },
  { name: "VIX", px: "13.84", c: -4.12 },
];

const FX = [
  { name: "USD/KRW", px: "1,378.20", c: 0.31 },
  { name: "WTI", px: "71.44", c: -1.22 },
  { name: "GOLD", px: "2,684.10", c: 0.74 },
  { name: "US10Y", px: "4.218", c: 0.06 },
  { name: "DXY", px: "104.32", c: 0.19 },
  { name: "BTC", px: "98,412", c: 2.81 },
];

const SECTORS = [
  { name: "AI/SEMI", v: 4.2 }, { name: "POWER", v: 6.4 },
  { name: "DEFENSE", v: 2.9 }, { name: "BIO", v: 1.1 },
  { name: "SAAS", v: -0.8 }, { name: "EV", v: -2.3 },
  { name: "URANIUM", v: 5.7 }, { name: "QUANTUM", v: -3.1 },
  { name: "ROBOT", v: 3.3 }, { name: "FINTECH", v: 0.4 },
  { name: "SPACE", v: 2.1 }, { name: "CYBER", v: 1.8 },
];

const WATCH = [
  { t: "CEG", s: 87, px: "201.77", c: 6.4, spark: [40, 44, 43, 50, 58, 64, 70, 78] },
  { t: "VRT", s: 81, px: "94.55", c: 4.88, spark: [60, 58, 62, 66, 64, 70, 75, 81] },
  { t: "PLTR", s: 78, px: "28.91", c: 5.17, spark: [50, 55, 53, 60, 65, 63, 72, 78] },
  { t: "NVDA", s: 74, px: "1204.18", c: 3.42, spark: [65, 68, 66, 70, 69, 72, 73, 74] },
  { t: "SMCI", s: 69, px: "812.40", c: -2.31, spark: [80, 78, 74, 76, 72, 70, 68, 69] },
  { t: "ARM", s: 67, px: "168.22", c: 1.04, spark: [55, 57, 60, 58, 62, 64, 63, 66] },
  { t: "042700", s: 66, px: "212,500", c: 2.95, spark: [55, 57, 60, 58, 62, 64, 63, 66] },
];

const RECAP = [
  { time: "10:31:02", px: "201.77", cond: "+0.41" },
  { time: "10:30:55", px: "201.36", cond: "+0.12" },
  { time: "10:30:48", px: "201.24", cond: "-0.08" },
  { time: "10:30:41", px: "201.32", cond: "+0.55" },
  { time: "10:30:33", px: "200.77", cond: "+0.21" },
];

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 gap-1 xl:h-full xl:grid-cols-12">
      {/* ── LEFT: 디스커버리 + 모니터 리스트 ── */}
      <div className="flex flex-col gap-1 xl:col-span-8">
        <Panel title="Theme Discovery" code="200) SCREEN">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[11px] text-term-accent">&lt;THEME&gt;</span>
            <span className="text-[11px] text-term-muted">
              자연어 테마 → AI 후보 발굴 → SCORE + BULL/BEAR/VERDICT
            </span>
            <span className="term-cursor ml-auto" />
          </div>
          <ThemeSearchForm />
        </Panel>

        <div className="grid flex-1 grid-cols-1 gap-1 md:grid-cols-2">
          {/* 후보 모니터 리스트 */}
          <Panel title="Monitor · Top Candidates" code="20)">
            <ColHead cols={["TICKER", "TREND", "SCR", "CHG%"]} />
            {WATCH.map((w) => (
              <div
                key={w.t}
                className="grid grid-cols-[3.2rem_1fr_2rem_3.4rem] items-center gap-1 py-px text-[11px] odd:bg-term-navy-dk/40"
              >
                <span className="font-bold text-term-accent">{w.t}</span>
                <Sparkline data={w.spark} />
                <span className="text-right text-term-warn">{w.s}</span>
                <span className="text-right">
                  <Delta value={w.c} />
                </span>
              </div>
            ))}
          </Panel>

          {/* 세계 지수 */}
          <Panel title="World Indices" code="WEI">
            <ColHead cols={["INDEX", "LAST / CHG%"]} />
            {INDICES.map((i) => (
              <DataRow
                key={i.name}
                label={i.name}
                value={
                  <span className="inline-flex items-center gap-2">
                    <span className="text-term-white">{i.px}</span>
                    <Delta value={i.c} className="w-14 text-right" />
                  </span>
                }
              />
            ))}
          </Panel>

          {/* FX / 원자재 */}
          <Panel title="FX · Commod · Rates" code="GLBL">
            <ColHead cols={["MKT", "LAST / CHG%"]} />
            {FX.map((f) => (
              <DataRow
                key={f.name}
                label={f.name}
                value={
                  <span className="inline-flex items-center gap-2">
                    <span className="text-term-white">{f.px}</span>
                    <Delta value={f.c} className="w-14 text-right" />
                  </span>
                }
              />
            ))}
            <div className="mt-1 space-y-0.5">
              <div className="flex justify-between text-[9px] text-term-faint">
                <span>ADV 312</span>
                <span>BREADTH</span>
                <span>DEC 188</span>
              </div>
              <Bar pct={62} tone="up" />
            </div>
          </Panel>

          {/* 섹터 히트맵 */}
          <Panel title="Sector Heat" code="1D %">
            <div className="grid grid-cols-3 gap-px">
              {SECTORS.map((s) => (
                <Cell
                  key={s.name}
                  tone={s.v >= 0 ? "up" : "down"}
                  className="flex-col gap-0 py-1"
                >
                  <span className="text-[9px] text-term-muted">{s.name}</span>
                  <span className="font-bold">
                    {s.v >= 0 ? "+" : ""}
                    {s.v.toFixed(1)}
                  </span>
                </Cell>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* ── RIGHT: 차트 + 퀘이트 리캡 ── */}
      <div className="flex flex-col gap-1 xl:col-span-4">
        <LiveLineChart
          title="Graph #1 · NDX INTRADAY"
          code="1)"
          initial={NDX}
          volume={NDX_VOL}
          yLabels={["224", "200", "182"]}
          xLabels={["09:30", "11:00", "13:00", "16:00"]}
        />
        <LineChartPanel
          title="Graph #2 · THEME FLOWS"
          code="2)"
          series={[
            { data: FLOW_A, tone: "up" },
            { data: FLOW_B, tone: "warn" },
          ]}
          yLabels={["110", "84", "58"]}
          xLabels={["Mon", "Wed", "Fri"]}
        />

        {/* Quote Recap (live) */}
        <LiveQuoteRecap
          symbol="CEG"
          initial={RECAP}
          basePx={201.77}
          className="flex-1"
        />
      </div>
    </div>
  );
}
