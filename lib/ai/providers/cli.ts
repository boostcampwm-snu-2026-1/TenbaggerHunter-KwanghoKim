import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { AIProvider, AICompleteOptions } from "../types";
import { DEFAULT_MODEL } from "../config";

const execFileAsync = promisify(execFile);

/**
 * CLI provider — `claude -p` (headless/print 모드)로 로컬 Claude Code 세션에 위임.
 *
 * 핵심: 로컬에 구독(Pro/Max) 계정으로 로그인돼 있고 ANTHROPIC_API_KEY가 *비어있으면*
 * API 크레딧이 아니라 구독 quota를 사용한다.
 *
 * 제약:
 *   - 로컬 전용. 로그인 세션이 없는 배포 환경(Vercel 등)에선 동작하지 않는다 → 프로덕션은 api provider.
 *   - maxTokens/temperature 등 세밀한 파라미터는 print 모드에서 노출되지 않아 무시된다.
 *   - 소비자 구독으로 앱 트래픽을 서빙하는 건 약관 취지에 어긋난다. 개발/프로토타이핑 용도로만.
 */
export const cliProvider: AIProvider = {
  name: "cli",

  async complete(prompt: string, opts?: AICompleteOptions): Promise<string> {
    const args = ["-p", prompt, "--output-format", "json", "--model", opts?.model ?? DEFAULT_MODEL];
    if (opts?.system) {
      args.push("--append-system-prompt", opts.system);
    }

    // 구독 quota를 쓰도록 API 키를 자식 프로세스 env에서 제거한다.
    // (ANTHROPIC_API_KEY가 있으면 CLI가 그걸 우선 사용 → API 크레딧 소모)
    const env = { ...process.env };
    delete env.ANTHROPIC_API_KEY;

    let stdout: string;
    try {
      ({ stdout } = await execFileAsync("claude", args, {
        env,
        maxBuffer: 10 * 1024 * 1024,
      }));
    } catch (err) {
      throw new Error(
        `claude CLI 호출 실패. 로컬에 'claude'가 설치·로그인돼 있는지 확인하세요. (${
          err instanceof Error ? err.message : String(err)
        })`,
      );
    }

    // --output-format json → { type, subtype, result, ... } 형태. result에 텍스트가 담긴다.
    try {
      const parsed = JSON.parse(stdout) as { result?: string; is_error?: boolean };
      if (parsed.is_error || typeof parsed.result !== "string") {
        throw new Error(`예상치 못한 CLI 응답: ${stdout.slice(0, 200)}`);
      }
      return parsed.result;
    } catch (err) {
      throw new Error(
        `claude CLI 응답 파싱 실패: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  },
};
