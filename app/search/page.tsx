import Link from "next/link";
import type { Market } from "@/lib/types/stock";
import { searchTheme } from "@/lib/discovery";
import { parseCriteria } from "@/lib/discovery/criteria";
import { CompanyCard } from "@/components/company-card";
import { ThemeSearchForm } from "@/components/theme-search-form";
import { Panel, Tag } from "@/components/terminal";

export const dynamic = "force-dynamic";

function normalizeMarket(v?: string): Market | "ALL" {
  return v === "KR" || v === "ALL" ? v : "US";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const theme = searchParams.theme?.trim() ?? "";
  const market = normalizeMarket(searchParams.market);
  const criteria = parseCriteria(searchParams);

  if (!theme) {
    return (
      <div className="mx-auto max-w-2xl">
        <Panel title="Theme Discovery" code="200) SCREEN">
          <ThemeSearchForm initialCriteria={criteria} />
        </Panel>
      </div>
    );
  }

  let candidates;
  let error: string | null = null;
  try {
    ({ candidates } = await searchTheme(theme, market, criteria));
  } catch (e) {
    console.error("[search page]", e);
    error = "탐색 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  return (
    <div className="grid grid-cols-1 gap-1 xl:h-full xl:grid-cols-12">
      <div className="flex flex-col gap-1 xl:col-span-8">
        <Panel
          title={`SCREEN · ${theme}`}
          right={
            <span className="flex items-center gap-1">
              <Tag tone="info">{market}</Tag>
              <Link href="/" className="text-term-info underline">
                ← NEW
              </Link>
            </span>
          }
        >
          <ThemeSearchForm initialTheme={theme} initialCriteria={criteria} />
        </Panel>

        <Panel
          title="Results · Candidates"
          code={candidates ? `${candidates.length} HITS` : "—"}
          className="flex-1"
          bodyClassName="space-y-1"
        >
          {error ? (
            <div className="bevel-in bg-term-down/15 p-2 text-[11px] text-term-down">
              {error}
            </div>
          ) : candidates && candidates.length > 0 ? (
            candidates.map((c) => (
              <CompanyCard key={c.profile.ticker} candidate={c} />
            ))
          ) : (
            <p className="p-1 text-[11px] text-term-muted">
              해당 테마/시장에서 후보를 찾지 못했습니다. (Phase 1은 미국주만 지원)
            </p>
          )}
        </Panel>
      </div>

      <div className="flex flex-col gap-1 xl:col-span-4">
        <Panel title="Score Model" code="v1">
          <div className="space-y-px text-[11px]">
            {[
              ["GROWTH", "25%"],
              ["VERDICT", "25%"],
              ["MOAT", "20%"],
              ["CATALYST", "15%"],
              ["RISK-ADJ", "15%"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-term-muted">{k}</span>
                <span className="tabular-nums text-term-accent">{v}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Legend" code="HELP" className="flex-1">
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
