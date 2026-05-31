---
name: commit
description: 변경 사항을 이 프로젝트의 커밋 규칙(Conventional Commits)에 맞춰 커밋한다. 사용자가 "커밋해줘", "commit", "변경분 정리해서 올려줘" 등 커밋을 요청할 때 사용한다.
---

# Commit Skill

변경 사항을 Tenbagger Hunter의 커밋 규칙에 맞춰 커밋한다.
규칙의 단일 소스는 [docs/commit-convention.md](../../../docs/commit-convention.md) — 항상 이를 따른다.

## 절차
1. `git status` + `git diff`로 변경 내용 파악
2. **관심사별로 분리** — 서로 다른 작업이면 `git add <path>`로 나눠 여러 커밋 (작업 단위 = 커밋 단위)
3. 각 커밋 메시지를 형식에 맞게 작성:
   ```
   <type>(<scope>): <subject>

   <body: 무엇을/왜>

   <footer: Closes #N, Co-Authored-By 등>
   ```
4. 관련 GitHub Issue가 있으면 footer에 `Closes #N` / `Refs #N` 연결
5. `feature/*` 브랜치에서 작업 중인지 확인 (main 직접 커밋 금지)

## Type 빠른 참조
`feat` 기능 · `fix` 버그 · `refactor` 구조 · `docs` 문서 · `style` 포맷 · `test` 테스트 · `chore` 설정/툴링 · `prompt` Claude 프롬프트(docs/prompts.md 버전 동반)

## Scope 권장값
`ui` `api` `ai` `data` `score` `bull-bear` `us` `kr` `cache` `db` `infra`

## 반드시 지킬 것
- subject는 명령형·50자 내외·마침표 없음, type은 영어 고정
- 한 커밋에 관심사 섞지 않기
- 비밀키/토큰/.env 값 커밋 금지
- Anthropic 커밋 푸터(`Co-Authored-By: Claude ...`)는 프로젝트 정책에 따라 유지

자세한 규칙·예시는 [docs/commit-convention.md](../../../docs/commit-convention.md) 참고.
