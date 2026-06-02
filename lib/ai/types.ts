/**
 * AI provider 계약(contract).
 *
 * 모든 AI 분석 로직은 이 인터페이스에만 의존한다 (CLAUDE.md 원칙 #1).
 * 호출부는 mock | cli | api 중 무엇이 동작하는지 알 필요가 없다.
 */

export type AIProviderName = "mock" | "cli" | "api";

export interface AICompleteOptions {
  /** 시스템 프롬프트 (역할/규칙). provider에 따라 캐싱 대상이 된다. */
  system?: string;
  /** 최대 출력 토큰. cli provider에서는 무시될 수 있다. */
  maxTokens?: number;
  /** 0=결정적, 1=창의적. cli provider에서는 무시될 수 있다. */
  temperature?: number;
  /** 모델 override. 미지정 시 config의 DEFAULT_MODEL 사용. */
  model?: string;
}

export interface AIProvider {
  /** 디버깅/로깅용 식별자. */
  readonly name: AIProviderName;

  /**
   * 단일 프롬프트 → 텍스트 응답.
   * 에러는 throw 하고, 호출부(API route)에서 graceful 처리한다 (CLAUDE.md 원칙 #5).
   */
  complete(prompt: string, opts?: AICompleteOptions): Promise<string>;
}
