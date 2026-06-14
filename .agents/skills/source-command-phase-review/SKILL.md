---
name: "source-command-phase-review"
description: "Phase 완료 시점에 진행 상황과 기술 부채를 점검한다"
---

# source-command-phase-review

Use this skill when the user asks to run the migrated source command `phase-review`.

## Command Template

Phase 완료 시 리뷰:

1. `AGENTS.md` 체크리스트 완료 항목 확인
2. 실제 동작 확인이 필요한 항목 목록화 (사람이 직접 검증할 것 = 체크포인트)
3. 다음 Phase 진입 전 정리해야 할 기술 부채 정리
4. `docs/architecture.md`에 이번 Phase 결정 사항(ADR) 기록
5. `AGENTS.md` 다음 Phase 체크리스트 활성화
6. 관련 GitHub Issue 닫고, 다음 Phase Issue 도출 제안
