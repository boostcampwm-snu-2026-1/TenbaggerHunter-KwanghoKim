/*
 * LineChartPanel — Bloomberg 차트 창 재현 (SVG, 의존성 없음).
 * 검정 플롯 + 점선 그리드 + 멀티컬러 라인 + 하단 거래량 바 + 축 라벨.
 * 레퍼런스: docs/design/bloomberg-reference-3.png (Graph #2 / #3)
 */
import { cn } from "@/lib/utils/cn";

type Tone = "accent" | "up" | "down" | "info" | "warn" | "mag" | "default";

const STROKE: Record<Tone, string> = {
  accent: "var(--term-accent)",
  up: "var(--term-up)",
  down: "var(--term-down)",
  info: "var(--term-info)",
  warn: "var(--term-warn)",
  mag: "var(--term-mag)",
  default: "var(--term-white)",
};

type Series = { data: number[]; tone: Tone };

const VB_W = 300;
const VB_H = 120;
const PLOT_H = 92; // 라인 영역
const PAD_L = 2;
const PAD_R = 2;

function pointsFor(data: number[], min: number, max: number) {
  const span = max - min || 1;
  const innerW = VB_W - PAD_L - PAD_R;
  const step = innerW / (data.length - 1 || 1);
  return data
    .map((v, i) => {
      const x = PAD_L + i * step;
      const y = PLOT_H - ((v - min) / span) * (PLOT_H - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function LineChartPanel({
  title,
  code,
  series,
  volume,
  yLabels,
  xLabels,
  className,
}: {
  title: string;
  code?: string;
  series: Series[];
  volume?: number[];
  yLabels?: string[];
  xLabels?: string[];
  className?: string;
}) {
  const all = series.flatMap((s) => s.data);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const vMax = volume ? Math.max(...volume) || 1 : 1;
  const gridYs = [0.0, 0.25, 0.5, 0.75, 1.0];

  return (
    <section
      className={cn(
        "bevel flex min-w-0 flex-col border border-term-border bg-term-panel",
        className,
      )}
    >
      <header className="flex items-center gap-2 bg-term-navy px-1.5 py-0.5">
        <h2 className="truncate text-[11px] font-bold text-term-white">{title}</h2>
        <span className="ml-auto text-[10px] text-term-info">
          {code} · <span className="underline">Graph Options</span>
        </span>
      </header>

      <div className="flex flex-1 gap-1 p-1">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          className="h-32 w-full bg-term-bg"
        >
          {/* dotted horizontal gridlines */}
          {gridYs.map((g, i) => (
            <line
              key={i}
              x1={0}
              x2={VB_W}
              y1={g * PLOT_H}
              y2={g * PLOT_H}
              stroke="var(--term-grid)"
              strokeWidth={0.5}
              strokeDasharray="1 2"
            />
          ))}
          {/* volume bars */}
          {volume &&
            volume.map((v, i) => {
              const innerW = VB_W - PAD_L - PAD_R;
              const bw = innerW / volume.length;
              const h = (v / vMax) * (VB_H - PLOT_H - 4);
              return (
                <rect
                  key={i}
                  x={PAD_L + i * bw}
                  y={VB_H - h}
                  width={Math.max(0.6, bw - 0.6)}
                  height={h}
                  fill="var(--term-accent-dim)"
                />
              );
            })}
          {/* series polylines */}
          {series.map((s, i) => (
            <polyline
              key={i}
              points={pointsFor(s.data, min, max)}
              fill="none"
              stroke={STROKE[s.tone]}
              strokeWidth={0.9}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {/* y axis labels */}
        {yLabels && (
          <div className="flex w-8 shrink-0 flex-col justify-between py-px text-right text-[9px] text-term-accent">
            {yLabels.map((l, i) => (
              <span key={i} className="tabular-nums">
                {l}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* x axis labels */}
      {xLabels && (
        <div className="flex justify-between border-t border-term-grid px-1 pb-0.5 text-[9px] text-term-muted">
          {xLabels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      )}
    </section>
  );
}
