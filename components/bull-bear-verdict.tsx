import type { Analysis, InvestorType } from "@/lib/types/stock";
import { Panel, Tag } from "@/components/terminal";

const INVESTOR_LABEL: Record<InvestorType, string> = {
  "long-hold": "장기보유",
  momentum: "모멘텀",
  watch: "관망",
};

const INVESTOR_TONE: Record<InvestorType, "up" | "warn" | "info"> = {
  "long-hold": "up",
  momentum: "warn",
  watch: "info",
};

function CaseList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "up" | "down";
}) {
  const head = tone === "up" ? "▲ BULL CASE" : "▼ BEAR CASE";
  const numColor = tone === "up" ? "text-term-up" : "text-term-down";
  return (
    <Panel title={head} code={title}>
      <ul className="space-y-1 text-[11px] leading-snug text-term-white">
        {items.map((it, i) => (
          <li key={i} className="flex gap-1.5">
            <span className={`shrink-0 font-bold tabular-nums ${numColor}`}>
              {i + 1})
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function BullBearVerdict({ analysis }: { analysis: Analysis }) {
  const vt = analysis.verdict.investorType;
  return (
    <div className="space-y-1">
      <div className="grid gap-1 md:grid-cols-2">
        <CaseList title="성장 드라이버" items={analysis.bull} tone="up" />
        <CaseList title="리스크 팩터" items={analysis.bear} tone="down" />
      </div>
      <Panel title="⚖ VERDICT" code="REC">
        <div className="flex items-center gap-2">
          <Tag tone={INVESTOR_TONE[vt]}>{INVESTOR_LABEL[vt]}</Tag>
          <span className="text-[10px] text-term-faint">INVESTOR PROFILE</span>
        </div>
        <p className="mt-1 text-[11px] leading-snug text-term-white">
          {analysis.verdict.summary}
        </p>
      </Panel>
    </div>
  );
}
