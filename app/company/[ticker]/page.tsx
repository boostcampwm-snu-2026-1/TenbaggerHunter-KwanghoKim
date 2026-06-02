import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeepDive } from "@/lib/discovery";
import { ScoreBadge } from "@/components/score-badge";
import { ScoreRadar } from "@/components/score-radar";
import { BullBearVerdict } from "@/components/bull-bear-verdict";
import { RevenueChart } from "@/components/revenue-chart";
import { Panel, DataRow, ColHead, Tag } from "@/components/terminal";

export const dynamic = "force-dynamic";

function pct(v?: number) {
  return v == null ? "—" : `${(v * 100).toFixed(0)}%`;
}

export default async function CompanyPage({ params }: { params: { ticker: string } }) {
  const dd = await getDeepDive(params.ticker);
  if (!dd) notFound();

  const { profile, score, financials, analysis } = dd;

  const stats: { label: string; value: string; tone?: "up" | "down" | "default" }[] = [
    {
      label: "REV GROWTH",
      value: pct(financials.revenueGrowth),
      tone: (financials.revenueGrowth ?? 0) >= 0 ? "up" : "down",
    },
    { label: "OP MARGIN", value: pct(financials.operatingMargin) },
    { label: "DEBT/EQUITY", value: financials.debtToEquity?.toFixed(2) ?? "—" },
    {
      label: "FCF",
      value:
        financials.freeCashFlow != null
          ? `$${(financials.freeCashFlow / 1_000_000_000).toFixed(1)}B`
          : "—",
    },
  ];

  return (
    <div className="flex flex-col gap-1">
      {/* DES header */}
      <Panel
        title={`DES · ${profile.ticker}`}
        right={
          <Link href="/" className="text-term-info underline">
            ← HOME
          </Link>
        }
      >
        <div className="flex items-start gap-3">
          <ScoreBadge score={score.total} size="lg" />
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <h1 className="text-base font-bold text-term-white">{profile.name}</h1>
              <span className="text-[11px] font-bold text-term-accent">
                {profile.ticker}
              </span>
              {profile.sector && <Tag tone="info">{profile.sector}</Tag>}
            </div>
            {profile.description && (
              <p className="mt-1 max-w-2xl text-[11px] leading-snug text-term-muted">
                {profile.description}
              </p>
            )}
          </div>
        </div>
      </Panel>

      {/* radar + financials */}
      <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
        <Panel title="Tenbagger Score" code="GRADE">
          <ScoreRadar axes={score.axes} />
        </Panel>

        <Panel title="Financials · FA" code="ANNUAL">
          <ColHead cols={["METRIC", "VALUE"]} />
          {stats.map((s) => (
            <DataRow
              key={s.label}
              label={s.label}
              value={s.value}
              tone={s.tone ?? "default"}
            />
          ))}
          {financials.revenueHistory && financials.revenueHistory.length > 0 && (
            <div className="mt-2">
              <div className="mb-0.5 text-[10px] uppercase text-term-accent">
                Revenue (5Y) · $B
              </div>
              <RevenueChart data={financials.revenueHistory} />
            </div>
          )}
        </Panel>
      </div>

      {/* analysis */}
      <BullBearVerdict analysis={analysis} />
    </div>
  );
}
