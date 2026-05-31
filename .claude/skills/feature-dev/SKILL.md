---
name: feature-dev
description: Tenbagger Hunter의 기능을 표준 워크플로우로 개발한다. 사용자가 새 기능/컴포넌트/API를 추가하거나, 작업을 어떻게 쪼갤지, 어떤 순서로 진행할지 물을 때 사용한다.
---

# Feature Development Skill

Tenbagger Hunter의 기능을 일관된 흐름으로 개발하기 위한 스킬이다.
세부 기준은 [docs/agent-workflow.md](../../../docs/agent-workflow.md)를 단일 소스로 따른다.

## 언제 쓰나
- 새 기능/컴포넌트/API route를 추가할 때
- "이 작업 어떻게 쪼개지?" 판단이 필요할 때
- 기능 개발의 표준 순서를 따르고 싶을 때

## 진행 순서
1. **컨텍스트 로드** — `CLAUDE.md` + 관련 GitHub Issue 읽기
2. **작업 단위 결정** — 기능 단위 vs 컴포넌트 단위 (기준: `docs/agent-workflow.md`)
3. **타입 우선** — `lib/types/stock.ts`에 계약(타입)부터 정의
4. **레이어 순서대로** — 데이터/AI 로직(`lib/`) → API route(`app/api/`) → 컴포넌트(`components/`)
5. **mock 우선** — `lib/data/mock/`으로 먼저 동작 확인, 실 API 호출 최소화
6. **체크포인트 검증** — 사람이 직접 판단할 항목(`docs/agent-workflow.md`의 체크포인트 목록) 보고
7. **마무리** — `CLAUDE.md` 갱신 + Conventional Commit + `feature/*` → `dev` PR

## 프롬프트 패턴
요청할 때는 항상 **[맥락] + [목표] + [제약] + [출력 형태]** 4요소를 준다.
구체 패턴은 `docs/agent-workflow.md`의 "AI 요청 프롬프트 패턴" 참고.

## 하지 말 것
- 타입/계약 없이 구현부터 시작하지 않는다
- 실 외부 API를 검증 없이 반복 호출하지 않는다 (비용/쿼터)
- 체크포인트 항목을 사람 확인 없이 "완료"로 보고하지 않는다
