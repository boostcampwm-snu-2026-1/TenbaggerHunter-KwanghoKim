# Commit Convention

> Ten Bagger Finder의 커밋 규칙. [Conventional Commits](https://www.conventionalcommits.org/) 기반.
> Agent(Claude Code)가 커밋할 때 자동 적용한다 → [.claude/skills/commit/SKILL.md](../.claude/skills/commit/SKILL.md)

## 1. 형식
```
<type>(<scope>): <subject>

<body (선택)>

<footer (선택)>
```
- **subject**: 한 줄 요약, 현재형/명령형, 끝에 마침표 없음, 50자 내외
- **body**: "무엇을/왜"를 설명 (어떻게는 코드가 말함). 한 줄당 72자 권장
- **footer**: 이슈 연결(`Closes #12`), 협업자(`Co-Authored-By:`) 등

## 2. Type
| type | 용도 |
|---|---|
| `feat` | 새 기능 (사용자가 인지하는 가치) |
| `fix` | 버그 수정 |
| `refactor` | 동작 변화 없는 구조 개선 |
| `docs` | 문서 (README, CLAUDE.md, ADR, wiki 등) |
| `style` | 포맷/세미콜론 등 비기능 변경 |
| `test` | 테스트 추가/수정 |
| `chore` | 설정·패키지·빌드·툴링 |
| `prompt` | Claude API 프롬프트 변경 (docs/prompts.md 버전 동반) |

## 3. Scope (선택, 이 프로젝트 권장값)
`ui` · `api` · `ai` · `data` · `score` · `bull-bear` · `us` · `kr` · `cache` · `db` · `infra`

예: `feat(score): TAM 침투율 계산 추가`, `fix(kr): DART 파서 빈 응답 처리`

## 4. 핵심 규칙
1. **작업 단위 = 커밋 단위.** 서로 다른 관심사는 한 커밋에 섞지 않는다. (작업 쪼개기 기준: [agent-workflow.md](./agent-workflow.md#1-작업-단위-쪼개기-기준))
2. **subject만 봐도 무엇을 바꿨는지** 알 수 있게.
3. 이슈가 있으면 footer에 연결: `Closes #N` / `Refs #N`
4. 한국어/영어 혼용 가능하되 **type은 영어** 고정.
5. 비밀키·토큰·`.env` 값은 절대 커밋하지 않는다.

## 5. 예시
```
feat(api): 테마 탐색 엔드포인트 추가

자연어 테마를 받아 기업 후보 5~8개를 반환한다.
개발 중에는 lib/data/mock 데이터를 사용.

Closes #4
```
```
prompt(theme-search): v2 — 선정 이유 필드 강제

v1 결과가 generic해 기업 선정 근거가 없었음. docs/prompts.md에 버전 기록.

Refs #4
```
