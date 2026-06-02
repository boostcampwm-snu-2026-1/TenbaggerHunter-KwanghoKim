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
import { SCORE_SYSTEM, buildScoreUser, scoreSchema } from "@/lib/ai/prompts/score";
import {
  BULL_BEAR_SYSTEM,
  buildBullBearUser,
  bullBearSchema,
} from "@/lib/ai/prompts/bull-bear";

const isMock = () => resolveProviderName() === "mock";

/** 정성 축(0~100) + 재무에서 5축 점수 구성. */
function axesFrom(qual: Omit<ScoreAxes, "financials">, financialsScore: number): ScoreAxes {
  return { ...qual, financials: financialsScore };
}

// ─────────────────────────── 테마 탐색 ───────────────────────────

export async function searchTheme(
  theme: string,
  market: Market | "ALL",
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

  return cached(`search:${market}:${theme}`, TTL.aiAnalysis, async () => {
    const raw = await completeJSON<unknown>(buildThemeSearchUser(theme, market), {
      system: THEME_SEARCH_SYSTEM,
      model: DEFAULT_MODEL,
      temperature: 0.7,
    });
    const { candidates } = themeSearchSchema.parse(raw);

    const resolved = await Promise.all(
      candidates.map(async (c) => {
        const financials = (await getFinancials(c.ticker)) ?? {};
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
          score: buildScore(axesFrom(qual, computeFinancialScore(financials))),
          oneLiner: c.oneLiner,
        };
        return candidate;
      }),
    );
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

    const [qualRaw, analysisRaw] = await Promise.all([
      completeJSON<unknown>(buildScoreUser(profile, financials), {
        system: SCORE_SYSTEM,
        temperature: 0.3,
      }),
      completeJSON<unknown>(buildBullBearUser(profile, financials), {
        system: BULL_BEAR_SYSTEM,
        temperature: 0.5,
      }),
    ]);

    const q = scoreSchema.parse(qualRaw);
    const analysis = bullBearSchema.parse(analysisRaw);
    const qual = {
      tam: normalizeQualitative(q.tam),
      moat: normalizeQualitative(q.moat),
      management: normalizeQualitative(q.management),
      narrative: normalizeQualitative(q.narrative),
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
