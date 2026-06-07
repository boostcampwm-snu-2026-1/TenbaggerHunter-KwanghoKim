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

/**
 * fmpGet의 graceful 버전 — 실패(402 premium-only 종목, 429 쿼터, 네트워크 등)면
 * throw 대신 null 반환. 무료 티어는 재무제표를 일부 인기 종목으로만 제한하므로,
 * 막힌 종목은 재무를 비워 두고 프로필+AI 분석은 계속 보이게 한다 (체크포인트 3.2).
 */
async function tryFmpGet<T>(path: string): Promise<T | null> {
  try {
    return await fmpGet<T>(path);
  } catch (err) {
    console.warn(`[fmp] skip: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

function minimalProfile(ticker: string): CompanyProfile {
  return { ticker: ticker.toUpperCase(), name: ticker.toUpperCase(), market: "US" };
}

export async function getProfile(ticker: string): Promise<CompanyProfile | null> {
  if (useMock()) {
    // FMP 키가 없을 때: mock 기업이면 그 프로필, 아니면 티커 기반 최소 프로필로 폴백.
    // (AI가 고른 임의 티커도 딥다이브가 열리도록 — 재무는 비고, 분석은 AI가 채운다)
    return getMockCompany(ticker)?.profile ?? minimalProfile(ticker);
  }

  return cached(`fmp:profile:${ticker}`, TTL.quote, async () => {
    const arr = await tryFmpGet<
      { symbol: string; companyName: string; sector?: string; marketCap?: number; description?: string }[]
    >(`/profile?symbol=${ticker}`);
    const p = arr?.[0];
    // 프로필 조회 실패/빈값이어도 최소 프로필로 폴백 → 딥다이브는 항상 열린다.
    if (!p) return minimalProfile(ticker);
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
    // 각 엔드포인트를 독립적으로 graceful 조회 — 일부가 막혀도(402 등) 나머지는 살린다.
    const [income, ratios, cashflow] = await Promise.all([
      tryFmpGet<{ fiscalYear: string; revenue: number; operatingIncome: number }[]>(
        `/income-statement?symbol=${ticker}&period=annual&limit=5`,
      ),
      tryFmpGet<{ debtToEquityRatioTTM?: number }[]>(`/ratios-ttm?symbol=${ticker}`),
      tryFmpGet<{ freeCashFlow?: number }[]>(
        `/cash-flow-statement?symbol=${ticker}&period=annual&limit=1`,
      ),
    ]);

    const latest = income?.[0];
    const prev = income?.[1];
    // 성장률은 별도 엔드포인트 대신 매출 2개년으로 계산 (쿼터 절약)
    const revenueGrowth =
      latest && prev && prev.revenue ? (latest.revenue - prev.revenue) / prev.revenue : undefined;

    return {
      revenueGrowth,
      debtToEquity: ratios?.[0]?.debtToEquityRatioTTM,
      freeCashFlow: cashflow?.[0]?.freeCashFlow,
      operatingMargin:
        latest && latest.revenue ? latest.operatingIncome / latest.revenue : undefined,
      revenueHistory: income
        ?.map((r) => ({ year: Number(r.fiscalYear), revenue: r.revenue }))
        .reverse(),
    };
  });
}
