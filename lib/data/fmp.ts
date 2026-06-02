import type { CompanyProfile, Financials } from "@/lib/types/stock";
import { TTL, cached } from "@/lib/cache";
import { getMockCompany } from "@/lib/data/mock";

/**
 * 미국주 데이터 어댑터 (FMP). CLAUDE.md 원칙 #2,#3,#4.
 *
 * FMP_API_KEY 미설정 시 mock 데이터로 폴백 → 개발 중 쿼터(250 req/day) 소모 0.
 * 모든 실 호출은 캐싱(read-through)으로 감싼다.
 */

const FMP_BASE = "https://financialmodelingprep.com/api/v3";
const useMock = () => !process.env.FMP_API_KEY;

async function fmpGet<T>(path: string): Promise<T> {
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${FMP_BASE}${path}${sep}apikey=${process.env.FMP_API_KEY}`);
  if (!res.ok) throw new Error(`FMP ${path} → ${res.status}`);
  return (await res.json()) as T;
}

export async function getProfile(ticker: string): Promise<CompanyProfile | null> {
  if (useMock()) return getMockCompany(ticker)?.profile ?? null;

  return cached(`fmp:profile:${ticker}`, TTL.quote, async () => {
    const [p] = await fmpGet<
      { symbol: string; companyName: string; sector?: string; mktCap?: number; description?: string }[]
    >(`/profile/${ticker}`);
    if (!p) return null;
    return {
      ticker: p.symbol,
      name: p.companyName,
      market: "US" as const,
      sector: p.sector,
      marketCap: p.mktCap,
      description: p.description,
    };
  });
}

export async function getFinancials(ticker: string): Promise<Financials | null> {
  if (useMock()) return getMockCompany(ticker)?.financials ?? null;

  return cached(`fmp:financials:${ticker}`, TTL.financialsAnnual, async () => {
    const income = await fmpGet<
      { calendarYear: string; revenue: number; operatingIncome: number }[]
    >(`/income-statement/${ticker}?period=annual&limit=5`);
    const [ratios] = await fmpGet<
      { freeCashFlowPerShare?: number; debtEquityRatio?: number }[]
    >(`/ratios-ttm/${ticker}`);
    const [growth] = await fmpGet<{ revenueGrowth?: number }[]>(
      `/financial-growth/${ticker}?period=annual&limit=1`,
    );

    const latest = income[0];
    return {
      revenueGrowth: growth?.revenueGrowth,
      debtToEquity: ratios?.debtEquityRatio,
      operatingMargin: latest ? latest.operatingIncome / latest.revenue : undefined,
      revenueHistory: income
        .map((r) => ({ year: Number(r.calendarYear), revenue: r.revenue }))
        .reverse(),
    };
  });
}
