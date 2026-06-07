import type { CompanyProfile, Financials } from "@/lib/types/stock";
import { TTL, cached } from "@/lib/cache";
import { getMockCompany } from "@/lib/data/mock";

/**
 * 미국주 데이터 어댑터 (FMP stable API). CLAUDE.md 원칙 #2,#3,#4.
 *
 * FMP_API_KEY 미설정 시 mock 데이터로 폴백 → 개발 중 쿼터(250 req/day) 소모 0.
 * 모든 실 호출은 캐싱(read-through)으로 감싼다.
 *
 * 주의: 2025-08-31 이후 신규 키는 구(v3) 엔드포인트가 막혀 `stable` API만 사용 가능.
 * 엔드포인트는 `?symbol=` 쿼리 형식.
 */

const FMP_BASE = "https://financialmodelingprep.com/stable";
const useMock = () => !process.env.FMP_API_KEY;

async function fmpGet<T>(path: string): Promise<T> {
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${FMP_BASE}${path}${sep}apikey=${process.env.FMP_API_KEY}`);
  if (!res.ok) throw new Error(`FMP ${path} → ${res.status}`);
  return (await res.json()) as T;
}

export async function getProfile(ticker: string): Promise<CompanyProfile | null> {
  if (useMock()) {
    // FMP 키가 없을 때: mock 기업이면 그 프로필, 아니면 티커 기반 최소 프로필로 폴백.
    // (AI가 고른 임의 티커도 딥다이브가 열리도록 — 재무는 비고, 분석은 AI가 채운다)
    return (
      getMockCompany(ticker)?.profile ?? {
        ticker: ticker.toUpperCase(),
        name: ticker.toUpperCase(),
        market: "US" as const,
      }
    );
  }

  return cached(`fmp:profile:${ticker}`, TTL.quote, async () => {
    const [p] = await fmpGet<
      { symbol: string; companyName: string; sector?: string; marketCap?: number; description?: string }[]
    >(`/profile?symbol=${ticker}`);
    if (!p) return null;
    return {
      ticker: p.symbol,
      name: p.companyName,
      market: "US" as const,
      sector: p.sector,
      marketCap: p.marketCap,
      description: p.description,
    };
  });
}

export async function getFinancials(ticker: string): Promise<Financials | null> {
  if (useMock()) return getMockCompany(ticker)?.financials ?? null;

  return cached(`fmp:financials:${ticker}`, TTL.financialsAnnual, async () => {
    const [income, ratios, cashflow] = await Promise.all([
      fmpGet<{ fiscalYear: string; revenue: number; operatingIncome: number }[]>(
        `/income-statement?symbol=${ticker}&period=annual&limit=5`,
      ),
      fmpGet<{ debtToEquityRatioTTM?: number }[]>(`/ratios-ttm?symbol=${ticker}`),
      fmpGet<{ freeCashFlow?: number }[]>(
        `/cash-flow-statement?symbol=${ticker}&period=annual&limit=1`,
      ),
    ]);

    const latest = income[0];
    const prev = income[1];
    // 성장률은 별도 엔드포인트 대신 매출 2개년으로 계산 (쿼터 절약)
    const revenueGrowth =
      latest && prev && prev.revenue ? (latest.revenue - prev.revenue) / prev.revenue : undefined;

    return {
      revenueGrowth,
      debtToEquity: ratios[0]?.debtToEquityRatioTTM,
      freeCashFlow: cashflow[0]?.freeCashFlow,
      operatingMargin: latest && latest.revenue ? latest.operatingIncome / latest.revenue : undefined,
      revenueHistory: income
        .map((r) => ({ year: Number(r.fiscalYear), revenue: r.revenue }))
        .reverse(),
    };
  });
}
