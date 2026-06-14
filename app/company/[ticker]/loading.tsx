import { Panel, ColHead } from "@/components/terminal";
import { InvestorWisdom } from "@/components/terminal/wisdom";

/** 딥다이브 로딩 — DES 화면과 동일한 패널 구조를 term 토큰 스켈레톤으로 채운다. */
export default function CompanyLoading() {
  return (
    <div className="flex flex-col gap-1">
      {/* DES header */}
      <Panel title="DES · LOADING" code="RT">
        <div className="flex items-center gap-1.5 border-b border-term-grid pb-1 text-[11px]">
          <span className="term-cursor" />
          <span className="text-term-muted">
            기업을 분석하는 중… (Score · Bull/Bear/Verdict 생성)
          </span>
        </div>
        <div className="mt-1 flex items-start gap-3">
          <div className="bevel-in h-16 w-16 shrink-0 animate-pulse bg-term-navy-dk" />
          <div className="min-w-0 flex-1 space-y-1.5 pt-1">
            <div className="h-4 w-1/2 animate-pulse bg-term-navy-dk" />
            <div className="h-2.5 w-3/4 animate-pulse bg-term-elevated" />
            <div className="h-2.5 w-2/3 animate-pulse bg-term-elevated" />
          </div>
        </div>
      </Panel>

      {/* 로딩 동안 투자 명언 회전 */}
      <InvestorWisdom />

      {/* radar + financials */}
      <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
        <Panel title="Tenbagger Score" code="GRADE">
          <div className="bevel-in flex h-60 items-center justify-center bg-term-bg">
            <span className="animate-pulse text-[11px] text-term-faint">
              RADAR LOADING…
            </span>
          </div>
        </Panel>

        <Panel title="Financials · FA" code="ANNUAL">
          <ColHead cols={["METRIC", "VALUE"]} />
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2 py-px"
            >
              <div className="h-2.5 w-1/3 animate-pulse bg-term-elevated" />
              <div className="h-2.5 w-12 animate-pulse bg-term-navy-dk" />
            </div>
          ))}
          <div className="mt-2 space-y-1">
            <div className="h-2.5 w-1/4 animate-pulse bg-term-elevated" />
            <div className="bevel-in h-44 w-full animate-pulse bg-term-bg" />
          </div>
        </Panel>
      </div>

      {/* analysis */}
      <div className="grid gap-1 md:grid-cols-2">
        {["▲ BULL CASE", "▼ BEAR CASE"].map((head) => (
          <Panel key={head} title={head} code="…">
            <ul className="space-y-1.5">
              {[0, 1, 2].map((i) => (
                <li
                  key={i}
                  className="h-2.5 animate-pulse bg-term-elevated"
                  style={{ width: `${90 - i * 12}%` }}
                />
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </div>
  );
}
