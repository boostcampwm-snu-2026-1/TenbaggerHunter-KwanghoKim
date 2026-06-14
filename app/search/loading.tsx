import { Panel } from "@/components/terminal";
import { InvestorWisdom } from "@/components/terminal/wisdom";

/** 검색 결과 로딩 — 스켈레톤 행을 term 토큰/베벨로 채워 결과 화면과 동일한 레이아웃을 유지한다. */
function SkeletonRow() {
  return (
    <div className="bevel flex items-stretch gap-2 border border-term-border bg-term-panel p-1.5">
      <div className="h-10 w-10 shrink-0 animate-pulse bg-term-navy-dk" />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="h-3 w-1/3 animate-pulse bg-term-navy-dk" />
        <div className="h-2.5 w-3/4 animate-pulse bg-term-elevated" />
      </div>
      <div className="hidden w-24 shrink-0 items-center sm:flex">
        <div className="h-3 w-full animate-pulse bg-term-elevated" />
      </div>
    </div>
  );
}

export default function SearchLoading() {
  return (
    <div className="grid grid-cols-1 gap-1 xl:h-full xl:grid-cols-12">
      <div className="flex flex-col gap-1 xl:col-span-8">
        <Panel
          title="Results · Candidates"
          code="SCANNING…"
          className="flex-1"
          bodyClassName="space-y-1"
        >
          <div className="flex items-center gap-1.5 border-b border-term-grid pb-1 text-[11px] text-term-accent">
            <span className="term-cursor" />
            <span className="text-term-muted">
              AI가 테마에 맞는 기업을 탐색하는 중… (수십 초 걸릴 수 있어요)
            </span>
          </div>
          {[0, 1, 2, 3, 4].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </Panel>
      </div>

      <div className="flex flex-col gap-1 xl:col-span-4">
        <Panel title="Status" code="RT">
          <div className="space-y-px text-[11px]">
            <div className="flex justify-between">
              <span className="text-term-muted">PHASE</span>
              <span className="text-term-accent">THEME → CANDIDATES</span>
            </div>
            <div className="flex justify-between">
              <span className="text-term-muted">STATE</span>
              <span className="text-term-warn">RUNNING</span>
            </div>
          </div>
        </Panel>
        <InvestorWisdom className="flex-1" />
        <Panel title="Legend" code="HELP">
          <div className="space-y-0.5 text-[10px] text-term-muted">
            <div><span className="text-term-up">SCORE ≥ 75</span> — 강력 후보</div>
            <div><span className="text-term-accent">55–74</span> — 관찰 후보</div>
            <div><span className="text-term-muted">&lt; 55</span> — 약함</div>
            <div className="pt-1 text-term-faint">
              티커 클릭 → DES(딥다이브): 레이더·재무·Bull/Bear
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
