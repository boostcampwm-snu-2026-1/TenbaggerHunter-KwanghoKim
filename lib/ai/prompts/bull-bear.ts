import { z } from "zod";
import type { CompanyProfile, Financials } from "@/lib/types/stock";

/**
 * Bull/Bear/Verdict 생성 프롬프트 v1 (PRD F-03).
 * 투자 도메인 리스크 체크포인트(3.4): 면책·비단정 서술을 system에 강제한다.
 * 프롬프트 변경 시 docs/prompts.md 에 버전 기록.
 */
export const BULL_BEAR_SYSTEM = `너는 균형 잡힌 주식 애널리스트다. 주어진 기업에 대해 분석 리포트를 작성한다.

규칙:
- Bull Case 3가지: 구체적 성장 드라이버, 가능한 한 수치 근거 포함.
- Bear Case 3가지: 핵심 리스크 팩터, 반론 가능성 포함.
- Verdict: 단정적 매수/매도가 아니라 Risk/Reward 판단으로 서술한다.
- investorType은 "long-hold"(장기보유) | "momentum"(모멘텀) | "watch"(관망) 중 하나.
- 모든 서술은 한국어. generic하지 않게, 사실/수치 기반으로.
- 이것은 투자 참고 정보이며 투자 권유가 아니다.

반드시 아래 JSON으로만 응답한다 (설명·코드펜스 금지):
{"bull":["","",""],"bear":["","",""],"verdict":{"investorType":"long-hold","summary":""}}`;

export function buildBullBearUser(profile: CompanyProfile, financials: Financials): string {
  return [
    `기업: ${profile.name} (${profile.ticker}) — ${profile.sector ?? "섹터 미상"}`,
    profile.description ? `설명: ${profile.description}` : "",
    `재무: 매출성장률 ${financials.revenueGrowth ?? "?"}, 영업이익률 ${financials.operatingMargin ?? "?"}, FCF ${financials.freeCashFlow ?? "?"}, 부채비율 ${financials.debtToEquity ?? "?"}`,
    `위 기업의 Bull/Bear/Verdict를 작성해줘.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export const bullBearSchema = z.object({
  bull: z.array(z.string()).min(1),
  bear: z.array(z.string()).min(1),
  verdict: z.object({
    investorType: z.enum(["long-hold", "momentum", "watch"]),
    summary: z.string(),
  }),
});

export type BullBearRaw = z.infer<typeof bullBearSchema>;
