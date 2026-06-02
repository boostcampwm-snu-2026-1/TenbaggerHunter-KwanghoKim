import { z } from "zod";
import type { CompanyProfile, Financials } from "@/lib/types/stock";

/**
 * Tenbagger Score 정성 평가 프롬프트 v1 (PRD F-02).
 * 재무 건전성 축은 정량 계산(lib/score)으로 별도 산출하므로, AI는 나머지 4개 축만 평가한다.
 * 프롬프트 변경 시 docs/prompts.md 에 버전 기록.
 */
export const SCORE_SYSTEM = `너는 텐배거(10배 상승) 잠재력을 평가하는 주식 애널리스트다.
주어진 기업의 정성 축을 각 1~10 정수로 평가한다:
- tam: TAM 대비 현재 침투율이 낮아 성장 여력이 큰가
- moat: 경쟁 우위(해자)가 지속 가능한가
- management: 경영진의 오너십·트랙레코드 신뢰도
- narrative: 시장이 아직 충분히 반영하지 않은 스토리의 강도

근거 없는 후한 점수를 주지 말고, 수치/사실 기반으로 냉정하게 평가한다.
투자 권유가 아니다.

반드시 아래 JSON으로만 응답한다 (설명·코드펜스 금지):
{"tam":0,"moat":0,"management":0,"narrative":0}`;

export function buildScoreUser(profile: CompanyProfile, financials: Financials): string {
  return [
    `기업: ${profile.name} (${profile.ticker}) — ${profile.sector ?? "섹터 미상"}`,
    profile.description ? `설명: ${profile.description}` : "",
    `시가총액: ${profile.marketCap ?? "?"}`,
    `매출성장률: ${financials.revenueGrowth ?? "?"}, 영업이익률: ${financials.operatingMargin ?? "?"}, 부채비율: ${financials.debtToEquity ?? "?"}`,
    `위 기업의 정성 축 4개를 평가해줘.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export const scoreSchema = z.object({
  tam: z.number(),
  moat: z.number(),
  management: z.number(),
  narrative: z.number(),
});

export type ScoreRaw = z.infer<typeof scoreSchema>;
