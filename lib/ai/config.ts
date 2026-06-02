import type { AIProviderName } from "./types";

/**
 * 기본 모델. 환경변수 AI_MODEL 로 override 가능.
 * CLAUDE.md 기준 Claude Sonnet 계열을 사용한다.
 */
export const DEFAULT_MODEL = process.env.AI_MODEL ?? "claude-sonnet-4-6";

/**
 * 어떤 provider를 쓸지 결정.
 *   - mock : 외부 호출 없음. 개발 초기/테스트 기본값 (CLAUDE.md 원칙 #4).
 *   - cli  : `claude -p` headless. 로컬 구독(Pro/Max) quota 사용. 로컬 개발 전용.
 *   - api  : Anthropic SDK. 프로덕션. ANTHROPIC_API_KEY 필요.
 *
 * AI_PROVIDER 미지정 시 mock 으로 안전하게 떨어진다.
 */
export function resolveProviderName(): AIProviderName {
  const v = process.env.AI_PROVIDER?.toLowerCase();
  if (v === "cli" || v === "api" || v === "mock") return v;
  return "mock";
}
