import type { Analysis, CompanyProfile, Financials, ScoreAxes } from "@/lib/types/stock";

/**
 * 개발용 mock 기업 데이터 (미국주). CLAUDE.md 원칙 #4 — 실 API 호출 전 mock 우선.
 * 실 데이터 연동 시 FMP 어댑터 + AI provider가 동일 구조를 채운다.
 */
export interface MockCompany {
  profile: CompanyProfile;
  financials: Financials;
  /** AI가 산출할 정성 축 (재무 제외). 0~100 raw. */
  qualitativeAxes: Omit<ScoreAxes, "financials">;
  analysis: Analysis;
  oneLiner: string;
}

function revHistory(base: number, growth: number): { year: number; revenue: number }[] {
  const years = [2021, 2022, 2023, 2024, 2025];
  return years.map((year, i) => ({ year, revenue: Math.round(base * Math.pow(1 + growth, i)) }));
}

export const MOCK_COMPANIES: MockCompany[] = [
  {
    profile: {
      ticker: "VRT",
      name: "Vertiv Holdings",
      market: "US",
      sector: "전력/열관리 인프라",
      marketCap: 42_000_000_000,
      description: "데이터센터 전력·냉각 인프라 전문 기업.",
    },
    financials: {
      revenueGrowth: 0.17,
      freeCashFlow: 1_300_000_000,
      debtToEquity: 1.1,
      operatingMargin: 0.16,
      revenueHistory: revHistory(5_000_000_000, 0.13),
    },
    qualitativeAxes: { tam: 82, moat: 74, management: 70, narrative: 80 },
    analysis: {
      bull: [
        "AI 데이터센터 capex 급증으로 전력·냉각 수요가 구조적으로 확대 (백로그 YoY +40% 수준).",
        "액침냉각 등 고밀도 랙 솔루션으로 ASP 상승, 영업이익률 16%까지 개선.",
        "하이퍼스케일러 장기 계약 비중 증가로 매출 가시성 확보.",
      ],
      bear: [
        "데이터센터 capex 사이클이 둔화되면 수요가 급격히 후퇴할 수 있음.",
        "부채비율 1.1로 금리 환경에 민감.",
        "대형 고객 집중도가 높아 협상력 리스크 존재.",
      ],
      verdict: {
        investorType: "long-hold",
        summary:
          "AI 인프라 슈퍼사이클의 직접 수혜주로 Risk/Reward는 우호적이나, capex 사이클 의존도가 높아 변동성을 감안한 장기 분할 접근이 적합.",
      },
    },
    oneLiner: "AI 데이터센터 전력·냉각의 '곡괭이와 삽' — capex 슈퍼사이클 직접 수혜.",
  },
  {
    profile: {
      ticker: "GEV",
      name: "GE Vernova",
      market: "US",
      sector: "전력 장비/그리드",
      marketCap: 88_000_000_000,
      description: "전력 생성·그리드 솔루션 기업 (GE 분사).",
    },
    financials: {
      revenueGrowth: 0.11,
      freeCashFlow: 1_700_000_000,
      debtToEquity: 0.3,
      operatingMargin: 0.08,
      revenueHistory: revHistory(29_000_000_000, 0.08),
    },
    qualitativeAxes: { tam: 88, moat: 68, management: 66, narrative: 72 },
    analysis: {
      bull: [
        "전력 수요 증가 + 그리드 노후화 교체 사이클로 장기 수주 잔고 확대.",
        "가스터빈·그리드 부문 마진 개선 여력 (현 8% → 두 자릿수 목표).",
        "낮은 부채비율(0.3)로 재무 유연성 우수.",
      ],
      bear: [
        "풍력 부문 적자 지속이 전체 마진을 희석.",
        "대형 프로젝트 실행 리스크와 원가 변동.",
        "현 영업이익률(8%)은 동종 대비 낮음.",
      ],
      verdict: {
        investorType: "long-hold",
        summary:
          "전력 인프라 turn-around 스토리. 마진 개선이 확인되면 재평가 여지가 크나, 풍력 적자 해소 속도가 관건.",
      },
    },
    oneLiner: "전력화·그리드 교체 슈퍼사이클의 핵심 장비 공급자.",
  },
  {
    profile: {
      ticker: "POWL",
      name: "Powell Industries",
      market: "US",
      sector: "전력 배전 장비",
      marketCap: 3_200_000_000,
      description: "산업용·유틸리티 전력 배전 장비 제조.",
    },
    financials: {
      revenueGrowth: 0.44,
      freeCashFlow: 180_000_000,
      debtToEquity: 0.05,
      operatingMargin: 0.18,
      revenueHistory: revHistory(550_000_000, 0.22),
    },
    qualitativeAxes: { tam: 64, moat: 60, management: 72, narrative: 78 },
    analysis: {
      bull: [
        "데이터센터·LNG 수요로 매출 성장률 44%, 백로그 사상 최대.",
        "부채 거의 없음(D/E 0.05) + 영업이익률 18%로 재무 건전성 최상위.",
        "중소형주로 아직 시장 커버리지가 얇아 재평가 여지.",
      ],
      bear: [
        "프로젝트 기반 매출로 분기 변동성이 큼.",
        "수주 호황이 꺾이면 고성장 멀티플이 빠르게 디레이팅.",
        "특정 전방산업(데이터센터/에너지) 의존도 집중.",
      ],
      verdict: {
        investorType: "momentum",
        summary:
          "재무 건전성과 성장률이 모두 강한 스몰캡. 모멘텀이 살아있는 구간이나 사이클 피크 진입 여부를 주시해야 함.",
      },
    },
    oneLiner: "부채 없는 고성장 스몰캡 — 전력 배전 백로그 사상 최대.",
  },
  {
    profile: {
      ticker: "ETN",
      name: "Eaton Corporation",
      market: "US",
      sector: "전력 관리",
      marketCap: 130_000_000_000,
      description: "글로벌 전력 관리 솔루션 기업.",
    },
    financials: {
      revenueGrowth: 0.08,
      freeCashFlow: 3_400_000_000,
      debtToEquity: 0.5,
      operatingMargin: 0.21,
      revenueHistory: revHistory(20_000_000_000, 0.07),
    },
    qualitativeAxes: { tam: 76, moat: 80, management: 78, narrative: 60 },
    analysis: {
      bull: [
        "데이터센터·전동화 메가트렌드에 걸친 분산된 수요 노출.",
        "영업이익률 21%, FCF 34억 달러로 현금 창출력 강력.",
        "강한 해자(설치 기반 + 서비스)로 마진 방어력 우수.",
      ],
      bear: [
        "대형주로 10배 수익(tenbagger) 잠재력은 제한적.",
        "성장률(8%)이 순수 데이터센터 플레이 대비 완만.",
        "경기 민감 산업 부문 비중 존재.",
      ],
      verdict: {
        investorType: "long-hold",
        summary:
          "질 높은 컴파운더지만 tenbagger 관점보다는 안정 성장. 변동성 낮은 코어 보유 후보.",
      },
    },
    oneLiner: "전력 관리 메가캡 컴파운더 — 높은 마진과 해자.",
  },
  {
    profile: {
      ticker: "NVT",
      name: "nVent Electric",
      market: "US",
      sector: "전기 보호/연결",
      marketCap: 12_000_000_000,
      description: "전기 연결·보호 솔루션 기업.",
    },
    financials: {
      revenueGrowth: 0.14,
      freeCashFlow: 520_000_000,
      debtToEquity: 0.6,
      operatingMargin: 0.17,
      revenueHistory: revHistory(2_100_000_000, 0.1),
    },
    qualitativeAxes: { tam: 68, moat: 64, management: 68, narrative: 66 },
    analysis: {
      bull: [
        "데이터센터 액침냉각·전력 분배 솔루션 수요 증가.",
        "꾸준한 FCF와 17% 영업이익률로 안정적 재투자.",
        "M&A로 고성장 영역 포트폴리오 강화 중.",
      ],
      bear: [
        "차별화가 상대적으로 약해 경쟁 강도가 높음.",
        "부채비율 0.6으로 중간 수준의 레버리지.",
        "성장 드라이버가 일부 전방산업에 의존.",
      ],
      verdict: {
        investorType: "watch",
        summary:
          "방향성은 맞으나 차별화·성장 가속 신호 확인 전까지는 관망이 합리적.",
      },
    },
    oneLiner: "데이터센터 전력 분배·냉각 연결 솔루션 플레이어.",
  },
  {
    profile: {
      ticker: "CEG",
      name: "Constellation Energy",
      market: "US",
      sector: "원자력 발전",
      marketCap: 95_000_000_000,
      description: "미국 최대 원자력 발전 사업자.",
    },
    financials: {
      revenueGrowth: 0.06,
      freeCashFlow: 2_100_000_000,
      debtToEquity: 0.9,
      operatingMargin: 0.19,
      revenueHistory: revHistory(22_000_000_000, 0.05),
    },
    qualitativeAxes: { tam: 84, moat: 86, management: 70, narrative: 88 },
    analysis: {
      bull: [
        "AI 데이터센터의 24/7 무탄소 전력 수요로 원전 PPA 프리미엄 확대.",
        "기존 원전 설비라는 강력한 진입장벽(해자).",
        "하이퍼스케일러와의 장기 전력 공급 계약 내러티브.",
      ],
      bear: [
        "전력 도매가격 변동에 실적 민감.",
        "규제·안전 이슈는 꼬리 리스크.",
        "성장률(6%)은 발전 사업 특성상 완만.",
      ],
      verdict: {
        investorType: "long-hold",
        summary:
          "AI 전력 수요 내러티브의 최선호 수혜 중 하나. 강한 해자 대비 밸류에이션 부담 여부를 점검.",
      },
    },
    oneLiner: "AI 시대 무탄소 기저전력 — 원전 해자 + PPA 프리미엄.",
  },
];
