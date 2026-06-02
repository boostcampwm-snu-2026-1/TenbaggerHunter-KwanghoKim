import Link from "next/link";
import type { CompanyCandidate } from "@/lib/types/stock";
import { ScoreBadge } from "./score-badge";

export function CompanyCard({ candidate }: { candidate: CompanyCandidate }) {
  const { profile, score, oneLiner } = candidate;
  return (
    <Link
      href={`/company/${profile.ticker}`}
      className="flex items-start gap-4 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 transition hover:border-neutral-600"
    >
      <ScoreBadge score={score.total} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold">{profile.name}</span>
          <span className="text-xs text-neutral-500">{profile.ticker}</span>
          {profile.sector && (
            <span className="ml-auto shrink-0 rounded bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-400">
              {profile.sector}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-neutral-400">{oneLiner}</p>
      </div>
    </Link>
  );
}
