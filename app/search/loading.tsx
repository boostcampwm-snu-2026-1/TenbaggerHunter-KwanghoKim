export default function SearchLoading() {
  return (
    <div className="space-y-4 pt-8">
      <div className="flex items-center gap-2 text-sm text-neutral-400">
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-neutral-600 border-t-emerald-400" />
        AI가 테마에 맞는 기업을 탐색하는 중… (수십 초 걸릴 수 있어요)
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-start gap-4 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4"
        >
          <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-neutral-800" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-800" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
