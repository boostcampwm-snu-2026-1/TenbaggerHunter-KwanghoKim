import type {
  CompanyCandidate,
  CompanyDeepDive,
  Market,
  ScoreAxes,
  ThemeSearchResponse,
} from "@/lib/types/stock";
import { completeJSON } from "@/lib/ai";
import { resolveProviderName, DEFAULT_MODEL } from "@/lib/ai/config";
import { TTL, cached } from "@/lib/cache";
import { buildScore, computeFinancialScore, normalizeQualitative } from "@/lib/score";
import { getFinancials, getProfile } from "@/lib/data/fmp";
import { MOCK_COMPANIES, getMockCompany } from "@/lib/data/mock";
import {
  THEME_SEARCH_SYSTEM,
  buildThemeSearchUser,
  themeSearchSchema,
} from "@/lib/ai/prompts/theme-search";
import { criteriaKey, type SelectedCriteria } from "@/lib/discovery/criteria";
import {
  DEEPDIVE_SYSTEM,
  buildDeepDiveUser,
  deepDiveSchema,
} from "@/lib/ai/prompts/deepdive";

const isMock = () => resolveProviderName() === "mock";

/**
 * AI가 반환한 ticker의 형식 sanity 검증 (FMP 호출 0회 — 쿼터 소모 없음).
 * 거래소 심볼 규칙: 영문 대문자 1~5자, 클래스주 접미사(.A/.B) 허용.
 * AI 환각으로 섞여 들어오는 설명문·소문자·공백·과길이 심볼을 검색 단계에서 걸러낸다.
 * (실존 여부 검증은 비용이 드는 딥다이브의 getProfile에 위임 — 위 트레이드오프 주석 참고)
 */
function isValidTickerFormat(ticker: string): boolean {
  return /^[A-Z]{1,5}(\.[A-Z]{1,2})?$/.test(ticker.trim());
}

/** 정성 축(0~100) + 재무에서 5축 점수 구성. */
function axesFrom(qual: Omit<ScoreAxes, "financials">, financialsScore: number): ScoreAxes {
  return { ...qual, financials: financialsScore };
}

// ─────────────────────────── 테마 탐색 ───────────────────────────

export async function searchTheme(
  theme: string,
  market: Market | "ALL",
  criteria: SelectedCriteria = {},
): Promise<ThemeSearchResponse> {
  if (isMock()) {
    const pool = market === "KR" ? [] : MOCK_COMPANIES; // Phase 1은 미국주만
    const candidates: CompanyCandidate[] = pool.map((c) => ({
      profile: c.profile,
      score: buildScore(axesFrom(c.qualitativeAxes, computeFinancialScore(c.financials))),
      oneLiner: c.oneLiner,
    }));
    return { theme, candidates };
  }

  return cached(`search:${market}:${theme}:${criteriaKey(criteria)}`, TTL.aiAnalysis, async () => {
    const raw = await completeJSON<unknown>(buildThemeSearchUser(theme, market, criteria), {
      system: THEME_SEARCH_SYSTEM,
      model: DEFAULT_MODEL,
      temperature: 0.7,
    });
    const { candidates: rawCandidates } = themeSearchSchema.parse(raw);

    // AI 환각 ticker 거르기 (US 한정 — KR은 숫자 코드라 형식이 다름). FMP 호출 0회.
    const candidates =
      market === "KR"
        ? rawCandidates
        : rawCandidates.filter((c) => {
            const ok = isValidTickerFormat(c.ticker);
            if (!ok) console.warn(`[discovery] drop invalid ticker: ${JSON.stringify(c.ticker)}`);
            return ok;
          });

    // 트레이드오프: 리스트는 "예비 점수"만 계산한다.
    // 후보별 FMP 실 재무 호출(getFinancials)을 하지 않는다 — FMP 무료 티어 250 req/day인데
    // 후보당 3콜 × 5~8개면 검색 1회에 ~24콜이라 쿼터를 빠르게 소진하기 때문.
    // 따라서 재무 축은 computeFinancialScore({})(=50, 중립)로 두고, 정성 축(AI)만 반영한다.
    // 실 재무가 반영된 정밀 점수는 getDeepDive(기업 상세)에서만 계산한다.
    const resolved = candidates.map((c) => {
      const qual = {
        tam: normalizeQualitative(c.axes.tam),
        moat: normalizeQualitative(c.axes.moat),
        management: normalizeQualitative(c.axes.management),
        narrative: normalizeQualitative(c.axes.narrative),
      };
      const candidate: CompanyCandidate = {
        profile: {
          ticker: c.ticker,
          name: c.name,
          market: market === "KR" ? "KR" : "US",
          sector: c.sector,
        },
        score: buildScore(axesFrom(qual, computeFinancialScore({}))),
        oneLiner: c.oneLiner,
      };
      return candidate;
    });
    return { theme, candidates: resolved };
  });
}

// ─────────────────────────── 딥다이브 ───────────────────────────

export async function getDeepDive(ticker: string): Promise<CompanyDeepDive | null> {
  if (isMock()) {
    const c = getMockCompany(ticker);
    if (!c) return null;
    return {
      profile: c.profile,
      financials: c.financials,
      analysis: c.analysis,
      score: buildScore(axesFrom(c.qualitativeAxes, computeFinancialScore(c.financials))),
      oneLiner: c.oneLiner,
    };
  }

  return cached(`deepdive:${ticker}`, TTL.aiAnalysis, async () => {
    const profile = await getProfile(ticker);
    if (!profile) return null;
    const financials = (await getFinancials(ticker)) ?? {};

    // 정성 점수 + Bull/Bear/Verdict를 한 번의 AI 호출로 생성 (기존 2콜 → 1콜).
    const raw = await completeJSON<unknown>(buildDeepDiveUser(profile, financials), {
      system: DEEPDIVE_SYSTEM,
      temperature: 0.4,
    });
    const d = deepDiveSchema.parse(raw);

    const analysis = { bull: d.bull, bear: d.bear, verdict: d.verdict };
    const qual = {
      tam: normalizeQualitative(d.tam),
      moat: normalizeQualitative(d.moat),
      management: normalizeQualitative(d.management),
      narrative: normalizeQualitative(d.narrative),
    };

    return {
      profile,
      financials,
      analysis,
      score: buildScore(axesFrom(qual, computeFinancialScore(financials))),
      oneLiner: analysis.bull[0] ?? "",
    } satisfies CompanyDeepDive;
  });
}
