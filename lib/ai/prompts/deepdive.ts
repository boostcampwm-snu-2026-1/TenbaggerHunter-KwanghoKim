import { z } from "zod";
import type { CompanyProfile, Financials } from "@/lib/types/stock";

/**
 * 딥다이브 통합 프롬프트 v1 — 정성 점수(PRD F-02) + Bull/Bear/Verdict(F-03)를 한 번에 생성.
 *
 * 기존 score.ts / bull-bear.ts 두 프롬프트를 통합한 것.
 * 동일 입력(profile+financials)으로 두 번 호출하던 것을 1회로 줄여 API 비용·지연을 절반으로.
 * 재무 건전성 축은 정량 계산(lib/score)으로 별도 산출하므로, AI는 정성 4축만 평가한다.
 * 프롬프트 변경 시 docs/prompts.md 에 버전 기록 (체크포인트 3.3).
 */
export const DEEPDIVE_SYSTEM = `너는 텐배거(10배 상승) 잠재력을 평가하는 균형 잡힌 주식 애널리스트다.
주어진 기업에 대해 (1) 정성 점수와 (2) 분석 리포트를 함께 작성한다.

[1] 정성 축 — 각 1~10 정수로 냉정하게 평가 (근거 없는 후한 점수 금지, 수치/사실 기반):
- tam: TAM 대비 현재 침투율이 낮아 성장 여력이 큰가
- moat: 경쟁 우위(해자)가 지속 가능한가
- management: 경영진의 오너십·트랙레코드 신뢰도
- narrative: 시장이 아직 충분히 반영하지 않은 스토리의 강도

[2] 분석 리포트:
- Bull Case 3가지: 구체적 성장 드라이버, 가능한 한 수치 근거 포함.
- Bear Case 3가지: 핵심 리스크 팩터, 반론 가능성 포함.
- Verdict: 단정적 매수/매도가 아니라 Risk/Reward 판단으로 서술한다.
- investorType은 "long-hold"(장기보유) | "momentum"(모멘텀) | "watch"(관망) 중 하나.

모든 서술은 한국어. generic하지 않게, 사실/수치 기반으로.
이것은 투자 참고 정보이며 투자 권유가 아니다.

반드시 아래 JSON으로만 응답한다 (설명·코드펜스 금지):
{"tam":0,"moat":0,"management":0,"narrative":0,"bull":["","",""],"bear":["","",""],"verdict":{"investorType":"long-hold","summary":""}}`;

export function buildDeepDiveUser(profile: CompanyProfile, financials: Financials): string {
  return [
    `기업: ${profile.name} (${profile.ticker}) — ${profile.sector ?? "섹터 미상"}`,
    profile.description ? `설명: ${profile.description}` : "",
    `시가총액: ${profile.marketCap ?? "?"}`,
    `재무: 매출성장률 ${financials.revenueGrowth ?? "?"}, 영업이익률 ${financials.operatingMargin ?? "?"}, FCF ${financials.freeCashFlow ?? "?"}, 부채비율 ${financials.debtToEquity ?? "?"}`,
    `위 기업의 정성 축 4개와 Bull/Bear/Verdict를 작성해줘.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export const deepDiveSchema = z.object({
  tam: z.number(),
  moat: z.number(),
  management: z.number(),
  narrative: z.number(),
  bull: z.array(z.string()).min(1),
  bear: z.array(z.string()).min(1),
  verdict: z.object({
    investorType: z.enum(["long-hold", "momentum", "watch"]),
    summary: z.string(),
  }),
});

export type DeepDiveRaw = z.infer<typeof deepDiveSchema>;
