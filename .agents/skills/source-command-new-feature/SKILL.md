---
name: "source-command-new-feature"
description: "새 기능을 표준 순서대로 추가한다"
---

# source-command-new-feature

Use this skill when the user asks to run the migrated source command `new-feature`.

## Command Template

새 기능을 추가할 때 다음 순서로 진행해:

1. `AGENTS.md` 읽고 현재 상태 파악
2. 관련 GitHub Issue 확인 (없으면 먼저 만들자고 제안)
3. `lib/types/stock.ts`에 필요한 타입 먼저 정의
4. API route 작성 (`app/api/` 아래, 에러 핸들링 필수)
5. 비즈니스 로직은 `lib/ai/` 또는 `lib/data/`에 분리
6. 컴포넌트 작성 (`components/` 아래)
7. 개발 중에는 `lib/data/mock/`의 mock data 사용 (실 API 호출 최소화)
8. `AGENTS.md` 진행 상황 업데이트
9. Conventional Commits로 커밋, `feature/*` 브랜치에서 작업

작업 단위 쪼개기·검증 체크포인트 기준은 `docs/agent-workflow.md` 참고.
