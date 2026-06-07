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
 * 텍스트 응답에서 JSON을 추출해 파싱.
 * 코드펜스 제거 후 그래도 안 되면 첫 `{`/`[` ~ 마지막 `}`/`]` 구간만 떼어 재시도한다.
 * (모델이 JSON 앞뒤에 설명 문장을 붙이는 경우 대비)
 */
export async function completeJSON<T>(prompt: string, opts?: AICompleteOptions): Promise<T> {
  const raw = await ai.complete(prompt, opts);

  const candidates: string[] = [];
  const fenced = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  candidates.push(fenced);

  // 잡설에 둘러싸인 JSON 본문만 추출
  const first = Math.min(
    ...[fenced.indexOf("{"), fenced.indexOf("[")].filter((i) => i >= 0),
  );
  const last = Math.max(fenced.lastIndexOf("}"), fenced.lastIndexOf("]"));
  if (Number.isFinite(first) && last > first) {
    candidates.push(fenced.slice(first, last + 1));
  }

  for (const c of candidates) {
    try {
      return JSON.parse(c) as T;
    } catch {
      // 다음 후보 시도
    }
  }
  throw new Error(`AI 응답을 JSON으로 파싱하지 못했습니다: ${raw.slice(0, 200)}`);
}

export type { AIProvider, AICompleteOptions, AIProviderName } from "./types";
