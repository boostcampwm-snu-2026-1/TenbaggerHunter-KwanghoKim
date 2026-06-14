# Tenbagger Hunter — Project Context

> 이 문서는 Codex가 매 세션마다 읽는 살아있는 컨텍스트 허브다.
> 작업할 때마다 "현재 진행 상황 / 최근 결정 사항 / 알려진 이슈"를 업데이트한다.

## 앱 개요
AI 기반 글로벌 주식 Tenbagger 후보 탐색 도구.
한국주(DART/KRX) + 미국주(FMP/SEC) 통합.
자연어 테마 입력 → 기업 후보 발굴 → Tenbagger Score + Bull/Bear/Verdict 분석.

상세 명세: [PRD.md](./PRD.md) · 개발 워크플로우: [AI-WORKFLOW.md](./AI-WORKFLOW.md) · [docs/agent-workflow.md](./docs/agent-workflow.md)

## 기술 스택
- Frontend: Next.js 14 App Router, TypeScript, Tailwind, shadcn/ui, Recharts
- AI: Codex API (Codex-sonnet-4)
- DB: Supabase (PostgreSQL)
- 미국 재무: Financial Modeling Prep (FMP) API
- 한국 재무: DART Open API + KRX

## 핵심 원칙
1. 모든 AI 분석 로직은 `lib/ai/` 아래 모듈로 분리
2. 외부 API 응답은 반드시 Supabase에 캐싱 (TTL 정책: `docs/data-sources.md`)
3. 한국주/미국주 처리 로직은 Adapter 패턴으로 통일 (공통 타입: `lib/types/stock.ts`)
4. 개발 중에는 `lib/data/mock/`의 mock data 우선 사용
5. 에러는 사용자에게 graceful하게 표시
6. **모든 UI는 Bloomberg Terminal 디자인 시스템([docs/DESIGN.md](./docs/DESIGN.md))을 따른다.**
   색/여백/폰트/모서리는 `term-*` 토큰만 사용 — raw hex·`neutral-*`·`rounded-*` 금지.
   화면은 `components/terminal/` 프리미티브(`Panel`/`DataRow`/`Delta`/`Tag`)를 우선 조립한다.

## 개발 관리 규칙
- 브랜치: `main` ← `dev` ← `feature/*` (feature → dev PR, 직접 main push 금지)
- 커밋: Conventional Commits — 규칙 단일 소스 [docs/commit-convention.md](./docs/commit-convention.md) (Agent는 `commit` Skill로 자동 적용)
- Task: GitHub Issue로 등록·관리
- 문서: 기획/워크플로우는 GitHub Wiki, 코드 관련 결정은 `docs/`

## 환경변수 (키 이름만 기록, 값 절대 기록 금지)
```
ANTHROPIC_API_KEY
FMP_API_KEY
DART_API_KEY
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

## 현재 진행 상황
### Week 1 — 기획 & 워크플로우 세팅
- [x] 저장소 연결 + README + .gitignore
- [x] 브랜치 구조 (main/dev/feature)
- [x] AGENTS.md 컨텍스트 허브
- [x] .Codex 커스텀 커맨드 + Agent Skill
- [x] Agent 워크플로우 가이드 (작업 단위 / 프롬프트 패턴 / 체크포인트)
- [ ] GitHub Wiki 기획서·워크플로우 정리
- [ ] GitHub Issue로 Task 등록

### Phase 1 — 미국주 MVP (진행 중, branch: feature/phase-1-mvp)
- [x] 프로젝트 scaffold (Next.js 14 App Router + TS + Tailwind)
- [x] FMP API wrapper + 캐싱 레이어 (mock 우선, TTL 정책 `lib/cache`)
- [x] 테마 탐색 프롬프트 v1 (`lib/ai/prompts`, 버전 로그 `docs/prompts.md`)
- [x] Tenbagger Score 알고리즘 v1 (`lib/score`, 가중치 25/20/15/25/15)
- [x] Bull/Bear/Verdict 프롬프트 v1 + 딥다이브 UI (레이더/재무/분석)
- [x] AI provider 추상화 (`lib/ai`: mock|cli|api 스위칭)
- [ ] Supabase 실연동 (현재 in-memory mock 캐시)
- [ ] 실 API(FMP/Codex) 응답 스키마 실데이터 검증 (체크포인트 3.2)

> mock으로 end-to-end 동작 확인 완료 (`AI_PROVIDER=mock`): 랜딩 → `/search` → `/company/[ticker]`.
> typecheck/build 통과. 실행: `AI_PROVIDER=mock npm run dev`

## 최근 결정 사항
- 2026-05-31: 한국/미국 주식은 Adapter 패턴으로 통합 (ADR-001 예정)
- 2026-06-02: AI 호출은 provider 추상화(`lib/ai`)로 mock|cli|api 전환. 개발은 `cli`(Codex -p, 구독 quota) 또는 `mock`, 프로덕션은 `api`.
- 2026-06-02: 캐싱은 read-through(`lib/cache`), TTL은 PRD §4.3. Supabase 백엔드는 미연동(in-memory).
- 2026-06-02: UI는 Bloomberg Terminal(classic GUI) 컨셉으로 전면 통일. 규칙·토큰 단일소스 [docs/DESIGN.md](./docs/DESIGN.md), 정본 레퍼런스 `docs/design/bloomberg-reference-3.png`. 프리미티브 `components/terminal/*`(Panel/DataRow/ColHead/Delta/Tag/Cell/Sparkline/Bar/LineChartPanel/TopToolbar/CommandLine). 전 화면(랜딩·검색·딥다이브) 적용 완료, 토큰 위반 0.

## 알려진 이슈
- `@anthropic-ai/sdk`는 prompt caching GA 위해 ^0.100 사용 (초기 0.30 → 업그레이드).
- Supabase/FMP/Codex 실연동 미검증 — 현재 전 구간 mock 경로만 실행됨.
