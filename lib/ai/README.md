# lib/ai — AI Provider 추상화

모든 AI 분석 로직은 provider 인터페이스에만 의존한다 (CLAUDE.md 원칙 #1).
호출부는 `ai` 하나만 import 하고, 실제 백엔드(mock/cli/api)는 환경변수로 전환한다.

## 사용법

```ts
import { ai, completeJSON } from "@/lib/ai";

// 텍스트
const text = await ai.complete("애플 한 줄 요약", { system: "너는 투자 분석가다." });

// 구조화 출력 (코드펜스 자동 제거 + JSON 파싱)
type Verdict = { score: number; bull: string[]; bear: string[] };
const v = await completeJSON<Verdict>(prompt, { system, temperature: 0 });
```

## Provider 전환 (`AI_PROVIDER`)

| 값 | 백엔드 | 비용/인증 | 용도 |
|---|---|---|---|
| `mock` (기본) | 고정 응답 | 없음 | 개발 초기·테스트 |
| `cli` | `claude -p` headless | **로컬 구독 quota** (ANTHROPIC_API_KEY 미설정 시) | 로컬 개발 — 구독 활용 |
| `api` | Anthropic SDK | `ANTHROPIC_API_KEY` (API 크레딧) | 프로덕션 |

`AI_MODEL` 로 모델 override (기본 `claude-sonnet-4-6`).

## cli provider 주의사항
- **로컬 전용**: 로그인된 `claude` 세션이 있어야 동작. 배포 환경에선 불가 → 프로덕션은 `api`.
- 구독 quota를 쓰려면 `ANTHROPIC_API_KEY`를 **비워둬야** 한다 (있으면 CLI가 API 크레딧을 소모). cli provider는 자식 프로세스 env에서 이 키를 자동 제거한다.
- `maxTokens`/`temperature`는 print 모드에서 노출되지 않아 무시된다.
- 소비자 구독으로 앱 트래픽을 서빙하는 것은 약관 취지에 어긋난다. **개발/프로토타이핑 한정.**

## 동작시키려면 (현재 미충족)
이 디렉터리는 계약/스캐폴딩만 있고, 실행에는 다음이 필요하다:
1. Next.js + TypeScript scaffold (`package.json`, `tsconfig.json`, `@/*` path alias)
2. `npm i @anthropic-ai/sdk` (api provider용)
3. `claude` CLI 설치 + 로그인 (cli provider용)
