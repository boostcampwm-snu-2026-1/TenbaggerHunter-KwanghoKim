/**
 * 공통 주식 도메인 타입 — 한국주/미국주를 Adapter 패턴으로 통일하기 위한 단일 계약.
 * (CLAUDE.md 원칙 #3. Phase 1은 미국주만, Phase 2에서 한국주 어댑터가 이 타입을 구현한다.)
 */

export type Market = "US" | "KR";

/** 기업 식별/기본 정보. */
export interface CompanyProfile {
  ticker: string;
  name: string;
  market: Market;
  sector?: string;
  /** 시가총액 (USD 기준 정규화). */
  marketCap?: number;
  description?: string;
}

/** 정량 재무 지표 — FMP/DART에서 어댑터가 채운다. */
export interface Financials {
  /** 매출 성장률 (YoY, 0.25 = 25%). */
  revenueGrowth?: number;
  /** 잉여현금흐름 (USD). */
  freeCashFlow?: number;
  /** 부채비율 (총부채/자기자본). */
  debtToEquity?: number;
  /** 영업이익률 (0.2 = 20%). */
  operatingMargin?: number;
  /** 최근 5년 매출 (차트용, 과거→최근 순). */
  revenueHistory?: { year: number; revenue: number }[];
}

/** Tenbagger Score 5개 축 (각 0~100). */
export interface ScoreAxes {
  tam: number; // TAM 침투율
  moat: number; // 해자 강도
  management: number; // 경영진 신뢰
  financials: number; // 재무 건전성
  narrative: number; // 내러티브 강도
}

export interface TenbaggerScore {
  axes: ScoreAxes;
  /** 가중 합산 총점 (0~100). */
  total: number;
}

/** Bull/Bear/Verdict 분석 리포트. */
export type InvestorType = "long-hold" | "momentum" | "watch";

export interface Analysis {
  bull: string[]; // 3가지 성장 드라이버 (수치 근거 포함)
  bear: string[]; // 3가지 리스크 팩터
  verdict: {
    investorType: InvestorType;
    /** Risk/Reward 판단 — 단정적 매수/매도가 아닌 판단형 서술. */
    summary: string;
  };
}

/** 탐색 결과 카드 1개 (목록용, 경량). */
export interface CompanyCandidate {
  profile: CompanyProfile;
  score: TenbaggerScore;
  /** 한 줄 요약 (왜 이 테마에 부합하는지). */
  oneLiner: string;
}

/** 딥다이브 (상세) — 카드 + 재무 + 분석. */
export interface CompanyDeepDive extends CompanyCandidate {
  financials: Financials;
  analysis: Analysis;
}

/** 테마 탐색 요청/응답 계약. */
export interface ThemeSearchRequest {
  theme: string;
  market: Market | "ALL";
}

export interface ThemeSearchResponse {
  theme: string;
  candidates: CompanyCandidate[];
}
