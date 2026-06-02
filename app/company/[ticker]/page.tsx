import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeepDive } from "@/lib/discovery";
import { ScoreBadge } from "@/components/score-badge";
import { ScoreRadar } from "@/components/score-radar";
import { BullBearVerdict } from "@/components/bull-bear-verdict";
import { RevenueChart } from "@/components/revenue-chart";

export const dynamic = "force-dynamic";

function pct(v?: number) {
  return v == null ? "—" : `${(v * 100).toFixed(0)}%`;
}

export default async function CompanyPage({ params }: { params: { ticker: string } }) {
  const dd = await getDeepDive(params.ticker);
  if (!dd) notFound();

  const { profile, score, financials, analysis } = dd;
  const stats = [
    { label: "매출성장률", value: pct(financials.revenueGrowth) },
    { label: "영업이익률", value: pct(financials.operatingMargin) },
    { label: "부채비율", value: financials.debtToEquity?.toFixed(2) ?? "—" },
    {
      label: "FCF",
      value:
        financials.freeCashFlow != null
          ? `$${(financials.freeCashFlow / 1_000_000_000).toFixed(1)}B`
          : "—",
    },
  ];

  return (
    <div className="space-y-8 pt-4">
      <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300">
        ← 홈으로
      </Link>

      <header className="flex items-start gap-5">
        <ScoreBadge score={score.total} size="lg" />
        <div>
          <h1 className="text-2xl font-bold">
            {profile.name} <span className="text-base font-normal text-neutral-500">{profile.ticker}</span>
          </h1>
          {profile.sector && <p className="text-sm text-neutral-400">{profile.sector}</p>}
          {profile.description && (
            <p className="mt-2 max-w-xl text-sm text-neutral-400">{profile.description}</p>
          )}
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <h2 className="mb-2 text-sm font-semibold text-neutral-300">Tenbagger Score</h2>
          <ScoreRadar axes={score.axes} />
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <h2 className="mb-3 text-sm font-semibold text-neutral-300">재무 요약</h2>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-lg bg-neutral-900 p-3">
                <div className="text-xs text-neutral-500">{s.label}</div>
                <div className="mt-1 text-lg font-semibold tabular-nums">{s.value}</div>
              </div>
            ))}
          </div>
          {financials.revenueHistory && financials.revenueHistory.length > 0 && (
            <div className="mt-4">
              <div className="mb-1 text-xs text-neutral-500">매출 추이 (5년)</div>
              <RevenueChart data={financials.revenueHistory} />
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-neutral-300">분석</h2>
        <BullBearVerdict analysis={analysis} />
      </section>
    </div>
  );
}
