import type { AIProvider, AICompleteOptions } from "./types";
import { resolveProviderName } from "./config";
import { mockProvider } from "./providers/mock";
import { cliProvider } from "./providers/cli";
import { apiProvider } from "./providers/api";

const PROVIDERS: Record<string, AIProvider> = {
  mock: mockProvider,
  cli: cliProvider,
  api: apiProvider,
};

/**
 * 선택된 AI provider 단일 진입점.
 * 호출부는 항상 이 `ai`만 import 한다. provider 전환은 AI_PROVIDER 환경변수로.
 */
export const ai: AIProvider = PROVIDERS[resolveProviderName()];

/**
 * 텍스트 응답을 JSON으로 파싱. ```json ... ``` 코드펜스를 관대하게 벗겨낸다.
 * 모델/provider에 상관없이 한 곳에서만 파싱하도록 공통화.
 */
export async function completeJSON<T>(prompt: string, opts?: AICompleteOptions): Promise<T> {
  const raw = await ai.complete(prompt, opts);
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(`AI 응답을 JSON으로 파싱하지 못했습니다: ${raw.slice(0, 200)}`);
  }
}

export type { AIProvider, AICompleteOptions, AIProviderName } from "./types";
