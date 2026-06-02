import type { Analysis, InvestorType } from "@/lib/types/stock";

const INVESTOR_LABEL: Record<InvestorType, string> = {
  "long-hold": "장기보유",
  momentum: "모멘텀",
  watch: "관망",
};

function CaseList({ title, items, tone }: { title: string; items: string[]; tone: "bull" | "bear" }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
      <h3 className={tone === "bull" ? "font-semibold text-emerald-400" : "font-semibold text-red-400"}>
        {tone === "bull" ? "🟢 Bull Case" : "🔴 Bear Case"}
        <span className="ml-2 text-xs font-normal text-neutral-500">{title}</span>
      </h3>
      <ul className="mt-3 space-y-2 text-sm text-neutral-300">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-neutral-600">{i + 1}.</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BullBearVerdict({ analysis }: { analysis: Analysis }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <CaseList title="성장 드라이버" items={analysis.bull} tone="bull" />
        <CaseList title="리스크 팩터" items={analysis.bear} tone="bear" />
      </div>
      <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-4">
        <h3 className="font-semibold">
          ⚖️ Verdict
          <span className="ml-2 rounded bg-neutral-800 px-2 py-0.5 text-xs font-normal text-neutral-300">
            {INVESTOR_LABEL[analysis.verdict.investorType]}
          </span>
        </h3>
        <p className="mt-2 text-sm text-neutral-300">{analysis.verdict.summary}</p>
      </div>
    </div>
  );
}
