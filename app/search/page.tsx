import Link from "next/link";
import type { Market } from "@/lib/types/stock";
import { searchTheme } from "@/lib/discovery";
import { CompanyCard } from "@/components/company-card";
import { ThemeSearchForm } from "@/components/theme-search-form";

export const dynamic = "force-dynamic";

function normalizeMarket(v?: string): Market | "ALL" {
  return v === "KR" || v === "ALL" ? v : "US";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { theme?: string; market?: string };
}) {
  const theme = searchParams.theme?.trim() ?? "";
  const market = normalizeMarket(searchParams.market);

  if (!theme) {
    return (
      <div className="pt-8">
        <ThemeSearchForm />
      </div>
    );
  }

  let candidates;
  let error: string | null = null;
  try {
    ({ candidates } = await searchTheme(theme, market));
  } catch (e) {
    console.error("[search page]", e);
    error = "탐색 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  return (
    <div className="space-y-6 pt-4">
      <div>
        <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300">
          ← 새 탐색
        </Link>
        <h1 className="mt-2 text-xl font-bold">
          “{theme}” <span className="text-sm font-normal text-neutral-500">— {market}</span>
        </h1>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </p>
      ) : candidates && candidates.length > 0 ? (
        <div className="space-y-3">
          {candidates.map((c) => (
            <CompanyCard key={c.profile.ticker} candidate={c} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-500">
          해당 테마/시장에서 후보를 찾지 못했습니다. (Phase 1은 미국주만 지원)
        </p>
      )}
    </div>
  );
}
