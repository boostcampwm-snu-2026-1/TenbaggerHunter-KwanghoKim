# AI Development Workflow
# Tenbagger Hunter × Claude Code

**Version:** 0.1  
**Last Updated:** 2026-05-31

---

## 1. 핵심 철학

**Claude Code는 코드 생성기가 아니라 시니어 페어프로그래머다.**

- 아키텍처 결정을 같이 한다
- 리팩토링 시점을 같이 판단한다
- 버그 추적을 같이 한다
- 프롬프트 이터레이션을 같이 한다

단순히 "이 함수 만들어줘" 로 쓰면 낭비. 컨텍스트를 충분히 주고, 판단을 요청하는 방식으로 활용한다.

---

## 2. 프로젝트 구조

```
tenbagger-hunter/
├── CLAUDE.md                        ← AI 컨텍스트 허브 (항상 최신화)
├── PRD.md                           ← 제품 요구사항
├── AI-WORKFLOW.md                   ← 이 파일
│
├── docs/
│   ├── architecture.md              ← 아키텍처 결정 기록 (ADR)
│   ├── prompts.md                   ← Claude API 프롬프트 버전 관리
│   └── data-sources.md              ← 외부 API 스펙 정리
│
├── .claude/
│   ├── mcp.json                     ← MCP 서버 설정
│   └── commands/                    ← 커스텀 슬래시 커맨드
│       ├── new-feature.md
│       ├── debug.md
│       ├── prompt-iteration.md
│       └── phase-review.md
│
├── app/                             ← Next.js App Router
│   ├── (main)/
│   │   ├── page.tsx
│   │   ├── explore/[theme]/
│   │   └── stock/[ticker]/
│   └── api/
│       ├── analyze/route.ts
│       ├── stock/[ticker]/route.ts
│       └── search/route.ts
│
├── lib/
│   ├── ai/
│   │   ├── analyzer.ts              ← Tenbagger Score 로직
│   │   ├── bull-bear.ts             ← Bull/Bear/Verdict 생성
│   │   └── prompts/                 ← 프롬프트 템플릿
│   │       ├── theme-search.ts
│   │       ├── score.ts
│   │       └── bull-bear.ts
│   ├── data/
│   │   ├── adapters/
│   │   │   ├── us-stock.ts          ← FMP API wrapper
│   │   │   └── kr-stock.ts          ← DART/KRX wrapper
│   │   └── cache.ts                 ← Supabase 캐싱 레이어
│   └── types/
│       └── stock.ts                 ← 공통 타입 정의
│
└── components/
    ├── score-card/
    ├── bull-bear/
    └── stock-chart/
```

---

## 3. CLAUDE.md — 컨텍스트 허브

프로젝트 루트의 `CLAUDE.md`는 Claude Code가 매 세션마다 읽는 살아있는 문서다.  
**개발할 때마다 반드시 업데이트한다.**

### 초기 CLAUDE.md 템플릿

```markdown
# Tenbagger Hunter — Project Context

## 앱 개요
AI 기반 글로벌 주식 Tenbagger 후보 탐색 도구.
한국주(DART/KRX) + 미국주(FMP/SEC) 통합.
자연어 테마 입력 → 기업 후보 발굴 → Bull/Bear/Verdict 분석.

## 기술 스택
- Frontend: Next.js 14 App Router, TypeScript, Tailwind, shadcn/ui
- AI: Claude API (claude-sonnet-4)
- DB: Supabase (PostgreSQL)
- 미국 재무: Financial Modeling Prep API
- 한국 재무: DART Open API + KRX

## 핵심 원칙
1. 모든 AI 분석 로직은 /lib/ai/ 아래 모듈로 분리
2. 외부 API 응답은 반드시 Supabase에 캐싱 (TTL 정책: docs/data-sources.md 참고)
3. 한국주/미국주 처리 로직은 Adapter 패턴으로 통일 (공통 타입: lib/types/stock.ts)
4. 개발 중에는 /lib/data/mock/ 의 mock data 우선 사용
5. 에러는 사용자에게 graceful하게 표시

## 환경변수 (키 이름만 기록, 값 절대 기록 금지)
ANTHROPIC_API_KEY
FMP_API_KEY
DART_API_KEY
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY

## 현재 진행 상황
### Phase 1 (미국주 MVP)
- [ ] 프로젝트 scaffold
- [ ] FMP API wrapper + 캐싱
- [ ] 테마 탐색 프롬프트 v1
- [ ] Tenbagger Score 알고리즘 v1
- [ ] Bull/Bear/Verdict UI

### Phase 2 (한국주)
- [ ] DART API wrapper
- [ ] KRX 주가 연동
- [ ] Watchlist DB 스키마

## 최근 결정 사항
(작업하면서 업데이트)

## 알려진 이슈
(작업하면서 업데이트)
```

---

## 4. MCP 서버 설정

### .claude/mcp.json

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--supabase-url", "${SUPABASE_URL}",
        "--supabase-service-role-key", "${SUPABASE_SERVICE_ROLE_KEY}"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### MCP로 할 수 있는 것들

**Supabase MCP**
```
# Claude Code에게 직접 말하기
"캐시 테이블에 stock_analyses 추가해줘.
 ticker, market, theme, score, bull_bear, created_at 컬럼으로"

"오늘 캐시 히트율 조회해줘"

"watchlist 테이블 스키마 확인해줘"
```

**GitHub MCP**
```
"지금까지 작업한 내용 PR로 만들어줘.
 feat/phase1-us-stocks 브랜치로"

"최근 커밋 히스토리 보여줘"
```

---

## 5. 커스텀 슬래시 커맨드

### /new-feature
```markdown
# .claude/commands/new-feature.md
새 기능을 추가할 때 다음 순서로 진행해:

1. CLAUDE.md 읽고 현재 상태 파악
2. lib/types/stock.ts 에 필요한 타입 먼저 정의
3. API route 작성 (app/api/ 아래, 에러 핸들링 필수)
4. 비즈니스 로직은 lib/ai/ 또는 lib/data/ 에 분리
5. 컴포넌트 작성 (components/ 아래)
6. 개발 중에는 lib/data/mock/ mock data 사용
7. CLAUDE.md 진행 상황 업데이트
```

### /debug
```markdown
# .claude/commands/debug.md
버그를 디버깅할 때:

1. 에러 메시지와 스택 트레이스 분석
2. 관련 파일 탐색 (grep / read)
3. 가설 3개 세우고 가장 가능성 높은 것부터 검증
4. 수정 후 엣지케이스 확인
5. 재발 방지를 위한 코멘트 또는 타입 강화 제안
```

### /prompt-iteration
```markdown
# .claude/commands/prompt-iteration.md
Claude API 프롬프트를 개선할 때:

1. docs/prompts.md 에서 현재 버전 확인
2. 문제점 진단 (너무 generic / 구조 불명확 / 예시 없음 등)
3. 개선 버전 작성 + 변경 이유 설명
4. 이전 버전과 나란히 docs/prompts.md 에 기록
5. A/B 테스트 방법 제안
```

### /phase-review
```markdown
# .claude/commands/phase-review.md
Phase 완료 시 리뷰:

1. CLAUDE.md 체크리스트 완료 항목 확인
2. 실제 동작 확인이 필요한 항목 목록화
3. 다음 Phase 진입 전 정리해야 할 기술 부채
4. docs/architecture.md 에 이번 Phase 결정 사항 기록
5. CLAUDE.md 다음 Phase 체크리스트 활성화
```

---

## 6. 세션별 작업 패턴

### 6.1 Phase 킥오프 세션

```
"Phase 1 시작하자.
 CLAUDE.md 읽고 현재 상태 파악해줘.
 오늘 목표: FMP API wrapper + 캐싱 레이어까지.
 타입 정의부터 시작해서 순서대로 가자."
```

### 6.2 병렬 작업 요청 (Sub-agents)

```
"다음 세 가지를 병렬로 진행해줘:
 1. lib/data/adapters/us-stock.ts — FMP API wrapper
 2. lib/data/adapters/kr-stock.ts — DART/KRX wrapper
 3. lib/types/stock.ts — 두 API 응답을 통일하는 공통 타입

 각각 완료되면 리포트해줘."
```

### 6.3 프롬프트 이터레이션 세션

```
"/prompt-iteration

 Bull/Bear 분석 결과가 너무 generic해.
 예를 들어 NVDA 분석했을 때 결과 붙여줄게:
 [결과 붙여넣기]

 뭐가 문제인지 진단하고 v2 만들어줘."
```

### 6.4 리팩토링 세션

```
"lib/ai/analyzer.ts 읽어봐.
 Tenbagger Score 계산 로직이 너무 길어진 것 같아.
 어떻게 분리하면 좋을지 제안해줘.
 성능 영향은 없어야 해."
```

### 6.5 세션 마무리

```
"오늘 작업 마무리하자.
 1. 변경된 내용 conventional commits 형식으로 커밋해줘
 2. CLAUDE.md 진행 상황 업데이트해줘
 3. 다음 세션에 이어서 할 것 CLAUDE.md 에 기록해줘"
```

---

## 7. 프롬프트 버전 관리

`docs/prompts.md` 에 모든 Claude API 프롬프트를 버전 관리한다.

### 형식

```markdown
# Prompts

## theme-search

### v1 (2026-05-31)
**목적:** 테마 키워드 → 기업 후보 5~8개 도출
**상태:** 현재 사용 중

[프롬프트 내용]

---

### v0 (2026-05-28)
**목적:** 동일
**상태:** deprecated — 결과가 너무 generic함
**문제점:** 기업 선정 이유가 없었음

[프롬프트 내용]
```

---

## 8. 아키텍처 결정 기록 (ADR)

`docs/architecture.md` 에 중요한 기술 결정을 기록한다.  
나중에 "왜 이렇게 했지?" 를 방지하기 위함.

### 형식

```markdown
# Architecture Decision Records

## ADR-001: Adapter 패턴으로 한국/미국 주식 통합
**날짜:** 2026-05-31
**상태:** 결정됨

**배경:** 한국주(DART)와 미국주(FMP)는 API 구조가 전혀 다름.
**결정:** 공통 인터페이스(StockData 타입)를 정의하고,
         각 시장별 Adapter가 변환 담당.
**결과:** 상위 레이어(AI 분석, UI)는 시장 구분 없이 동일 인터페이스 사용.
**트레이드오프:** Adapter 구현 초기 비용 있으나 장기 유지보수 유리.
```

---

## 9. 비용 관리 원칙

### Claude API
- 개발 중에는 `lib/data/mock/` mock data 사용, 실 API 호출 최소화
- 분석 결과 Supabase에 캐싱 (TTL 6시간)
- 스트리밍 응답 사용 (UX + 지각된 속도 개선)
- 배포 후 월 비용 모니터링 (Anthropic Console에서 확인)

### FMP API (무료 티어: 250 req/day)
- 재무제표 24시간 캐싱
- 주가/시총 1시간 캐싱
- 개발 중 불필요한 호출 금지

### Supabase (무료 티어)
- 500MB DB, 2GB bandwidth
- 초과 시 캐싱 TTL 늘리거나 데이터 정리

---

## 10. Git 전략

### 브랜치 구조

```
main
└── dev
    ├── feat/phase1-us-stocks
    ├── feat/phase2-kr-stocks
    ├── feat/score-algorithm
    └── fix/dart-parser
```

### 커밋 컨벤션 (Claude Code에게 맡기기)

```
feat: 새 기능
fix: 버그 수정
refactor: 리팩토링
docs: 문서 업데이트 (CLAUDE.md, ADR 등)
chore: 설정, 패키지 등
prompt: Claude API 프롬프트 변경
```

```
# 세션 마무리 때 Claude Code에게
"지금까지 변경사항 conventional commits 형식으로 커밋해줘.
 feat/phase1-us-stocks 브랜치에."
```

---

## 11. 개발 시작 체크리스트

### 환경 세팅 (최초 1회)

```bash
# 1. Claude Code 설치
npm install -g @anthropic-ai/claude-code

# 2. 프로젝트 생성
npx create-next-app@latest tenbagger-hunter --typescript --tailwind --app

# 3. 의존성 설치
npm install @anthropic-ai/sdk @supabase/supabase-js recharts
npx shadcn@latest init

# 4. 환경변수 설정
cp .env.example .env.local
# ANTHROPIC_API_KEY, FMP_API_KEY, DART_API_KEY, SUPABASE_* 입력

# 5. Claude Code 실행
cd tenbagger-hunter
claude
```

### 매 세션 시작 시

```
1. claude 실행
2. "CLAUDE.md 읽고 현재 상태 파악해줘. 오늘 [목표] 진행하자."
3. 작업 시작
```

### 매 세션 종료 시

```
1. "오늘 작업 커밋해줘 (conventional commits)"
2. "CLAUDE.md 업데이트해줘"
3. "다음 세션 시작할 때 이어서 할 것 기록해줘"
```
