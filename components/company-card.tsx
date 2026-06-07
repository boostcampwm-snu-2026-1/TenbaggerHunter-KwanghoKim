import Link from "next/link";
import { Tag, Sparkline } from "@/components/terminal";
import type { CompanyCandidate } from "@/lib/types/stock";
import { ScoreBadge } from "./score-badge";

// 티커+스코어 기반 결정적 스파크라인 (SSR/CSR 일치, 시드 고정).
function seededSpark(seed: string, n = 12): number[] {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const out: number[] = [];
  let v = 50;
  for (let i = 0; i < n; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    v += ((h % 1000) / 1000 - 0.45) * 16;
    out.push(v);
  }
  return out;
}

export function CompanyCard({ candidate }: { candidate: CompanyCandidate }) {
  const { profile, score, oneLiner } = candidate;
  const spark = seededSpark(profile.ticker + score.total);
  return (
    <Link
      href={`/company/${profile.ticker}`}
      className="bevel flex items-stretch gap-2 border border-term-border bg-term-panel p-1.5 hover:bg-term-navy-dk/40"
    >
      <ScoreBadge score={score.total} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-term-accent">{profile.ticker}</span>
          <span className="truncate text-[11px] text-term-white">{profile.name}</span>
          {profile.sector && (
            <span className="ml-auto shrink-0">
              <Tag tone="info">{profile.sector}</Tag>
            </span>
          )}
        </div>
        <p className="mt-0.5 line-clamp-1 text-[10px] leading-snug text-term-muted">
          {oneLiner}
        </p>
      </div>
      <div className="hidden w-24 shrink-0 items-center sm:flex">
        <Sparkline data={spark} className="text-base" />
      </div>
    </Link>
  );
}
