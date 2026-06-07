export default function CompanyLoading() {
  return (
    <div className="space-y-8 pt-8">
      <div className="flex items-center gap-2 text-sm text-neutral-400">
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-neutral-600 border-t-emerald-400" />
        기업을 분석하는 중… (Score · Bull/Bear/Verdict 생성)
      </div>
      <div className="flex items-start gap-5">
        <div className="h-20 w-20 shrink-0 animate-pulse rounded-xl bg-neutral-800" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-1/2 animate-pulse rounded bg-neutral-800" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-800" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-72 animate-pulse rounded-xl bg-neutral-900/50" />
        <div className="h-72 animate-pulse rounded-xl bg-neutral-900/50" />
      </div>
    </div>
  );
}
