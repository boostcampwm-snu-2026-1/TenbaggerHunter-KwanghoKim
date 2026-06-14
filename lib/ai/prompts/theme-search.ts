import { z } from "zod";
import type { Market } from "@/lib/types/stock";
import { buildCriteriaHints, type SelectedCriteria } from "@/lib/discovery/criteria";

/**
 * 테마 탐색 프롬프트 v1 — 자연어 테마 → 상장 기업 후보 5~8개 (PRD F-01).
 * 프롬프트 변경 시 docs/prompts.md 에 버전 기록 (체크포인트 3.3).
 */
export const THEME_SEARCH_SYSTEM = `너는 글로벌 주식 리서치 애널리스트다.
사용자가 제시한 투자 테마에 부합하는 **상장 기업** 5~8개를 발굴한다.

규칙:
- 실재하는 상장사만. ticker는 정확한 거래소 심볼.
- 각 기업의 oneLiner는 한국어로, 가능하면 수치 근거를 포함한다 (generic 금지).
- 정성 평가 축(tam/moat/management/narrative)은 각 1~10 정수로 평가한다.
- 너무 유명한 대형주에만 치우치지 말고, 덜 알려진 후보도 섞는다.
- 이것은 투자 참고 정보이며 투자 권유가 아니다. 단정적 매수/매도 표현을 쓰지 않는다.

반드시 아래 JSON 스키마로만 응답한다 (설명 문장·코드펜스 금지):
{"candidates":[{"ticker":"","name":"","sector":"","oneLiner":"","axes":{"tam":0,"moat":0,"management":0,"narrative":0}}]}`;

export function buildThemeSearchUser(
  theme: string,
  market: Market | "ALL",
  criteria: SelectedCriteria = {},
): string {
  const scope =
    market === "ALL" ? "한국주와 미국주 모두" : market === "US" ? "미국주" : "한국주";
  return `테마: "${theme}"\n대상 시장: ${scope}${buildCriteriaHints(criteria)}\n위 테마에 부합하는 기업 5~8개를 발굴해줘.`;
}

const qualAxes = z.object({
  tam: z.number(),
  moat: z.number(),
  management: z.number(),
  narrative: z.number(),
});

export const themeSearchSchema = z.object({
  candidates: z
    .array(
      z.object({
        ticker: z.string(),
        name: z.string(),
        sector: z.string().optional(),
        oneLiner: z.string(),
        axes: qualAxes,
      }),
    )
    .min(1),
});

export type ThemeSearchRaw = z.infer<typeof themeSearchSchema>;
