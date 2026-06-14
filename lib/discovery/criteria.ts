/**
 * 테마 탐색 기준(다이얼) 정의 — 클라이언트 폼과 서버 프롬프트가 공유한다.
 * (서버 전용 의존성 금지: theme-search-form.tsx 가 그대로 import 한다.)
 *
 * 각 옵션은 두 얼굴을 가진다:
 *  - blurb: 사용자에게 보여주는 "드립" 카피 (재미 요소)
 *  - hint : AI 프롬프트에 주입되는 실제 탐색 지시문
 */

export type CriterionId = "risk" | "size" | "horizon" | "hype";

export interface CriterionOption {
  value: string;
  /** 버튼에 박히는 짧은 라벨 */
  label: string;
  /** 위트 한 줄 (hover title + PROFILE 라인) */
  blurb: string;
  /** AI 프롬프트에 들어가는 실제 지시문 */
  hint: string;
}

export interface Criterion {
  id: CriterionId;
  /** 행 앞 4자 코드 */
  code: string;
  options: CriterionOption[];
}

export const CRITERIA: Criterion[] = [
  {
    id: "risk",
    code: "RISK",
    options: [
      {
        value: "safe",
        label: "안전빵",
        blurb: "잠은 자야지",
        hint: "변동성이 낮고 재무가 탄탄한 우량주 위주로 발굴해라.",
      },
      {
        value: "balanced",
        label: "밸런스",
        blurb: "적당히 스릴",
        hint: "리스크와 상승 여력이 균형 잡힌 후보 위주로 발굴해라.",
      },
      {
        value: "yolo",
        label: "한 방",
        blurb: "상폐 아니면 텐배거",
        hint: "고위험·고변동이라도 폭발적 상승 여력이 큰 후보 위주로 발굴해라.",
      },
    ],
  },
  {
    id: "size",
    code: "SIZE",
    options: [
      {
        value: "large",
        label: "대형",
        blurb: "이미 큰 코끼리",
        hint: "시가총액 대형주(라지캡) 위주로.",
      },
      {
        value: "mid",
        label: "중형",
        blurb: "애매한 사춘기",
        hint: "중형주(미드캡) 위주로.",
      },
      {
        value: "small",
        label: "소형",
        blurb: "흙 속 진주",
        hint: "시가총액이 작은 소형주(스몰캡), 덜 알려진 곳 위주로.",
      },
      {
        value: "micro",
        label: "마이크로",
        blurb: "검색하면 직원이 댓글 다는 곳",
        hint: "초소형주(마이크로캡), 거의 알려지지 않은 곳 위주로.",
      },
    ],
  },
  {
    id: "horizon",
    code: "TERM",
    options: [
      {
        value: "short",
        label: "단타",
        blurb: "지금 당장 뜨거운",
        hint: "단기 모멘텀·촉매가 임박한 후보 위주로.",
      },
      {
        value: "mid",
        label: "중기",
        blurb: "1~3년은 본다",
        hint: "1~3년 성장 스토리가 뚜렷한 후보 위주로.",
      },
      {
        value: "long",
        label: "장투",
        blurb: "손주에게 물려줄",
        hint: "장기 복리 성장이 기대되는 후보 위주로.",
      },
    ],
  },
  {
    id: "hype",
    code: "BUZZ",
    options: [
      {
        value: "hot",
        label: "핫템",
        blurb: "유튜버가 다 떰",
        hint: "이미 시장에서 화제인 인기 테마주도 적극 포함.",
      },
      {
        value: "contrarian",
        label: "역발상",
        blurb: "아무도 안 볼 때 줍줍",
        hint: "시장에서 소외·저평가된 역발상 후보 위주로.",
      },
    ],
  },
];

export type SelectedCriteria = Partial<Record<CriterionId, string>>;

/** URL searchParams → 검증된 선택값 (모르는 값은 버린다). */
export function parseCriteria(raw: Record<string, string | undefined>): SelectedCriteria {
  const out: SelectedCriteria = {};
  for (const c of CRITERIA) {
    const v = raw[c.id];
    if (v && c.options.some((o) => o.value === v)) out[c.id] = v;
  }
  return out;
}

function lookup(id: CriterionId, value: string): CriterionOption | undefined {
  return CRITERIA.find((c) => c.id === id)?.options.find((o) => o.value === value);
}

/** 선택된 옵션들의 blurb 리스트 (PROFILE 라인용). */
export function selectedBlurbs(selected: SelectedCriteria): string[] {
  return CRITERIA.map((c) => selected[c.id] && lookup(c.id, selected[c.id]!)?.blurb).filter(
    (b): b is string => Boolean(b),
  );
}

/** 선택된 기준을 AI 프롬프트 지시문으로 직렬화 (없으면 ""). */
export function buildCriteriaHints(selected: SelectedCriteria): string {
  const hints = CRITERIA.map(
    (c) => selected[c.id] && lookup(c.id, selected[c.id]!)?.hint,
  ).filter((h): h is string => Boolean(h));
  if (hints.length === 0) return "";
  return ["\n추가 선호 기준:", ...hints.map((h) => `- ${h}`)].join("\n");
}

/** 캐시 키용 안정적 직렬화. */
export function criteriaKey(selected: SelectedCriteria): string {
  return CRITERIA.map((c) => `${c.id}=${selected[c.id] ?? ""}`).join("&");
}
