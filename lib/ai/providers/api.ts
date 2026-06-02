import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider, AICompleteOptions } from "../types";
import { DEFAULT_MODEL } from "../config";

/**
 * API provider — Anthropic SDK. 프로덕션 기본값.
 *
 * ANTHROPIC_API_KEY 환경변수 필요. 시스템 프롬프트는 prompt caching을 적용해
 * 반복 호출 비용을 줄인다 (테마 탐색/Bull-Bear 처럼 system은 고정, user만 바뀌는 패턴에 유효).
 */

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY가 설정되지 않았습니다 (api provider).");
    }
    client = new Anthropic();
  }
  return client;
}

export const apiProvider: AIProvider = {
  name: "api",

  async complete(prompt: string, opts?: AICompleteOptions): Promise<string> {
    const msg = await getClient().messages.create({
      model: opts?.model ?? DEFAULT_MODEL,
      max_tokens: opts?.maxTokens ?? 4096,
      temperature: opts?.temperature ?? 1,
      // 고정 system을 캐싱 → 후속 동일 system 호출에서 입력 토큰 비용 절감
      system: opts?.system
        ? [{ type: "text", text: opts.system, cache_control: { type: "ephemeral" } }]
        : undefined,
      messages: [{ role: "user", content: prompt }],
    });

    return msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
  },
};
