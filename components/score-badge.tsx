import { cn } from "@/lib/utils/cn";

function tone(score: number): string {
  if (score >= 75) return "bg-term-up/15 text-term-up border-term-up/40";
  if (score >= 55) return "bg-term-accent/15 text-term-accent border-term-accent-dim";
  return "bg-term-elevated text-term-muted border-term-border";
}

export function ScoreBadge({ score, size = "md" }: { score: number; size?: "md" | "lg" }) {
  return (
    <div
      className={cn(
        "inline-flex flex-col items-center justify-center border font-bold tabular-nums term-glow",
        tone(score),
        size === "lg" ? "h-16 w-16 text-2xl" : "h-10 w-10 text-base",
      )}
    >
      {score}
      <span className={cn("font-normal tracking-widest", size === "lg" ? "text-[9px]" : "text-[7px]")}>
        SCR
      </span>
    </div>
  );
}
