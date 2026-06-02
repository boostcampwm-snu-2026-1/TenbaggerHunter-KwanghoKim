import type { AIProvider, AICompleteOptions } from "../types";

/**
 * Mock provider — 외부 호출 0회, 비용 0, 결정적.
 *
 * 개발 초기/테스트 기본값. 실제 mock 응답은 추후 lib/data/mock/ 로 분리하고
 * 여기서 import 해서 매핑한다 (CLAUDE.md 원칙 #4).
 */
export const mockProvider: AIProvider = {
  name: "mock",

  async complete(prompt: string, _opts?: AICompleteOptions): Promise<string> {
    // TODO: lib/data/mock/ 의 시나리오별 고정 응답으로 교체.
    return JSON.stringify({
      _mock: true,
      note: "AI_PROVIDER=mock — 고정 응답입니다. 실 분석은 cli/api provider로 전환하세요.",
      promptPreview: prompt.slice(0, 120),
    });
  },
};
