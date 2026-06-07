import type { Financials, ScoreAxes, TenbaggerScore } from "@/lib/types/stock";

/**
 * Tenbagger Score 가중치 — PRD §3.1 F-02 와 일치해야 한다.
 * 합계 1.0. 변경 시 docs/agent-workflow.md 체크포인트 3.3 검증 필요.
 */
export const SCORE_WEIGHTS = {
  tam: 0.25,
  moat: 0.2,
  management: 0.15,
  financials: 0.25,
  narrative: 0.15,
} as const satisfies Record<keyof ScoreAxes, number>;

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

/** 정성 평가(AI 1~10) → 0~100 정규화. */
export function normalizeQualitative(score1to10: number): number {
  return clamp(Math.round((score1to10 / 10) * 100));
}

/**
 * 재무 건전성 축(0~100)을 정량 계산.
 * 4개 지표를 각각 0~100으로 매핑 후 평균. 값이 없으면 해당 지표는 중립(50)으로 본다.
 */
export function computeFinancialScore(f: Financials): number {
  const parts: number[] = [];

  // 매출 성장률: 0% → 30점, 40%+ → 100점
  if (f.revenueGrowth != null) parts.push(clamp(30 + (f.revenueGrowth / 0.4) * 70));
  // FCF: 양수면 70 기준 가점, 음수면 감점
  if (f.freeCashFlow != null) parts.push(f.freeCashFlow > 0 ? 80 : 35);
  // 부채비율: 0 → 100점, 2.0+ → 20점
  if (f.debtToEquity != null) parts.push(clamp(100 - (f.debtToEquity / 2) * 80));
  // 영업이익률: 0% → 40점, 30%+ → 100점
  if (f.operatingMargin != null) parts.push(clamp(40 + (f.operatingMargin / 0.3) * 60));

  if (parts.length === 0) return 50; // 데이터 없음 → 중립
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
}

/** 5개 축 점수 → 가중 합산 총점(0~100). */
export function computeTotal(axes: ScoreAxes): number {
  const total =
    axes.tam * SCORE_WEIGHTS.tam +
    axes.moat * SCORE_WEIGHTS.moat +
    axes.management * SCORE_WEIGHTS.management +
    axes.financials * SCORE_WEIGHTS.financials +
    axes.narrative * SCORE_WEIGHTS.narrative;
  return Math.round(total);
}

/** 축 점수 묶음을 받아 total 포함 TenbaggerScore 로 만든다. */
export function buildScore(axes: ScoreAxes): TenbaggerScore {
  return { axes, total: computeTotal(axes) };
}
