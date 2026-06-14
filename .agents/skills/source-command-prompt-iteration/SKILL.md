---
name: "source-command-prompt-iteration"
description: "Codex API 프롬프트를 진단하고 버전 관리하며 개선한다"
---

# source-command-prompt-iteration

Use this skill when the user asks to run the migrated source command `prompt-iteration`.

## Command Template

Codex API 프롬프트를 개선할 때:

1. `docs/prompts.md`에서 현재 버전 확인
2. 문제점 진단 (너무 generic / 구조 불명확 / 예시 없음 / 출력 형식 불안정 등)
3. 개선 버전 작성 + 변경 이유 설명
4. 이전 버전과 나란히 `docs/prompts.md`에 기록 (버전 번호 + 날짜 + 상태)
5. A/B 테스트 방법 제안 (같은 입력으로 v_old vs v_new 비교)

커밋은 `prompt:` 타입 사용.
