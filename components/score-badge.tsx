import { cn } from "@/lib/utils/cn";

function tone(score: number): string {
  if (score >= 75) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (score >= 55) return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  return "bg-neutral-500/15 text-neutral-400 border-neutral-500/30";
}

export function ScoreBadge({ score, size = "md" }: { score: number; size?: "md" | "lg" }) {
  return (
    <div
      className={cn(
        "inline-flex flex-col items-center justify-center rounded-xl border font-bold tabular-nums",
        tone(score),
        size === "lg" ? "h-20 w-20 text-3xl" : "h-12 w-12 text-lg",
      )}
    >
      {score}
      <span className={cn("font-normal", size === "lg" ? "text-[10px]" : "text-[8px]")}>
        SCORE
      </span>
    </div>
  );
}
