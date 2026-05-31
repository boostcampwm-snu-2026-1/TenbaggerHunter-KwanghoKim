# Product Requirements Document
# Ten Bagger Finder

**Version:** 0.1  
**Last Updated:** 2026-05-31  
**Status:** Draft

---

## 1. Overview

### 1.1 Product Summary

Ten Bagger Finder는 AI 기반 글로벌 주식 리서치 어시스턴트다. 단순한 스크리너가 아니라, 사용자가 입력한 테마나 키워드를 바탕으로 10배 상승 가능성이 있는 기업 후보를 발굴하고, 왜 그 기업인지 내러티브와 데이터를 통합해 설명해주는 도구다.

### 1.2 핵심 차별점

| 기존 스크리너 (Finviz, HTS) | Ten Bagger Finder |
|---|---|
| 숫자 필터링 | 자연어 테마 탐색 |
| 결과 나열 | Bull/Bear/Verdict 스토리텔링 |
| 정적 데이터 | 최신 뉴스 + 재무 동적 반영 |
| 미국 또는 한국 | 글로벌 통합 (한국 + 미국) |

### 1.3 타겟 사용자

- **Primary:** 개인 투자자 (장기 성장주 발굴에 관심 있는 2030)
- **Secondary:** 투자 공부 중인 학생, 사이드 인컴 관심자

---

## 2. 목표 및 성공 지표

### 2.1 단기 목표 (Phase 1~2)
- 개인 학습용 툴로 실제 투자 리서치에 활용
- Claude Code + AI Native 개발 워크플로우 검증

### 2.2 중기 목표 (Phase 3~4)
- SNS 공유 가능한 데모 완성
- 사용자 피드백 기반 기능 우선순위 결정

### 2.3 성공 지표 (배포 후)
- DAU 100명 달성
- 분석 완료율 > 70% (테마 입력 후 딥다이브까지)
- Watchlist 저장률 > 30%

---

## 3. 기능 명세

### 3.1 P0 — 핵심 기능 (MVP)

#### F-01. 테마 기반 탐색
- 자연어 입력으로 테마/키워드 입력
- 추천 테마 칩(chip) 제공 (클릭 즉시 탐색 시작)
- AI가 테마를 해석하여 관련 기업 5~8개 후보 도출
- 한국주 / 미국주 / 전체 필터 선택 가능

**예시 입력:**
```
"AI 데이터센터 전력 인프라"
"GLP-1 수혜 의료기기"
"K-방산 수출 모멘텀"
"Palantir처럼 B2G SaaS인데 아직 덜 알려진 곳"
```

#### F-02. Ten Bagger Score 카드
기업당 5개 축으로 0~100 점수 산출 및 시각화:

| 축 | 설명 | 데이터 소스 |
|---|---|---|
| TAM 침투율 | 현재 시총 / 추정 TAM | AI 추정 + FMP |
| 해자 강도 | 경쟁 우위 지속성 | AI 분석 |
| 경영진 신뢰 | 오너십, 트랙레코드 | AI + 공시 |
| 재무 건전성 | FCF, 부채비율, 성장률 | FMP / DART |
| 내러티브 강도 | 시장이 아직 모르는 스토리 | AI 분석 |

**Score 산출 방식:**
- 재무 지표: 정량 계산 (FMP/DART 데이터 기반)
- 정성 지표: Claude API 분석 (1~10점 → 정규화)
- 가중치: TAM 25% / 해자 20% / 경영진 15% / 재무 25% / 내러티브 15%

#### F-03. Bull / Bear / Verdict
기업별 AI 생성 분석 리포트:

```
🟢 Bull Case (3가지)
   - 구체적인 성장 드라이버
   - 수치 근거 포함

🔴 Bear Case (3가지)
   - 핵심 리스크 팩터
   - 반론 가능성

⚖️ Verdict
   - 현재 Risk/Reward 판단
   - 투자 적합 유형 (장기보유 / 모멘텀 / 관망)
```

---

### 3.2 P1 — 고도화 기능

#### F-04. 기업 딥다이브 페이지
- 재무 차트: 매출 성장, 영업이익률, FCF, 부채비율 (5년)
- 최신 뉴스 요약 (Claude web_search 활용)
- 동종업계 비교 (시총, PER, PSR)
- 리스크 팩터 목록

#### F-05. Watchlist & 히스토리
- 기업 저장 및 폴더 구성
- Score 변화 타임라인 추적
- 메모 기능 (저장 이유, 투자 thesis)

#### F-06. 비교 모드
- 같은 테마 내 2개 기업 나란히 비교
- 지표별 승/패 하이라이트

---

### 3.3 P2 — 배포 시 추가

#### F-07. 데일리 픽 피드
- AI가 매일 1개 기업 발굴
- 테마, Score, 한줄 요약 카드 형태
- 푸시 알림 (웹 푸시 or 이메일)

#### F-08. 소셜 공유 카드
- "오늘 내가 발견한 Ten Bagger 후보" 이미지 생성
- 트위터/인스타 최적화 비율 (1:1, 16:9)
- 브랜딩 포함 자동 생성

---

## 4. 데이터 소스

### 4.1 미국주
| 소스 | 용도 | 비용 |
|---|---|---|
| Financial Modeling Prep (FMP) | 재무제표, 주가, 시총 | 무료 티어 250 req/day |
| SEC EDGAR | 10-K/10-Q 원문 | 무료 |
| Claude web_search | 최신 뉴스, 애널리스트 코멘트 | Claude API 비용 |

### 4.2 한국주
| 소스 | 용도 | 비용 |
|---|---|---|
| DART Open API | 사업보고서, 재무공시 | 무료 |
| KRX 정보데이터시스템 | 주가, 시총, 거래량 | 무료 |
| Claude web_search | 최신 뉴스, IR 자료 | Claude API 비용 |

### 4.3 캐싱 정책
| 데이터 유형 | TTL | 이유 |
|---|---|---|
| 재무제표 (연간) | 24시간 | 분기별 업데이트 |
| 주가/시총 | 1시간 | 실시간 불필요 |
| AI 분석 결과 | 6시간 | 비용 절감 |
| 뉴스 요약 | 2시간 | 최신성 유지 |

---

## 5. 기술 스택

```
Frontend
  Next.js 14 (App Router)
  TypeScript
  Tailwind CSS + shadcn/ui
  Recharts (재무 차트)

Backend
  Next.js API Routes (초기)
  → 트래픽 증가 시 FastAPI 분리 검토

AI
  Claude API (claude-sonnet-4)
  - 테마 → 기업 탐색
  - Ten Bagger Score 정성 평가
  - Bull/Bear/Verdict 생성
  - 뉴스 요약 (web_search tool 활용)

Database
  Supabase (PostgreSQL)
  - 재무 데이터 캐싱
  - Watchlist / 분석 히스토리
  - Score 변화 이력

Infrastructure
  Vercel (프론트 + API Routes)
  → 배포 시 Railway or Fly.io 검토
```

---

## 6. 화면 구성 (UI Flow)

```
[랜딩 페이지]
  ↓ 테마 입력 or 추천 칩 클릭
[탐색 결과 페이지]
  - 기업 카드 5~8개 (Score + 한줄 요약)
  - 한국/미국 필터
  ↓ 기업 카드 클릭
[딥다이브 페이지]
  - Ten Bagger Score 레이더 차트
  - Bull / Bear / Verdict
  - 재무 차트
  - 최신 뉴스
  - Watchlist 저장 버튼
[Watchlist 페이지]
  - 저장한 기업 목록
  - Score 변화 히스토리
  - 메모
```

---

## 7. 개발 로드맵

### Phase 1 — MVP (미국주) `목표: 2주`
- [ ] 프로젝트 scaffold (Next.js + Supabase 연동)
- [ ] FMP API wrapper + 캐싱 레이어
- [ ] Claude API 테마 탐색 프롬프트 v1
- [ ] Ten Bagger Score 알고리즘 v1
- [ ] Bull/Bear/Verdict 생성 프롬프트 v1
- [ ] 기업 카드 + 딥다이브 UI

### Phase 2 — 한국주 추가 `목표: +1주`
- [ ] DART API wrapper
- [ ] KRX 주가 연동
- [ ] 한국/미국 Adapter 패턴 통일
- [ ] Watchlist + DB 스키마

### Phase 3 — 고도화 `목표: +1주`
- [ ] 재무 차트 (Recharts)
- [ ] 뉴스 통합 (Claude web_search)
- [ ] 비교 모드
- [ ] UI 디자인 고도화

### Phase 4 — 배포 준비 `필요시`
- [ ] 소셜 공유 카드 생성
- [ ] 데일리 픽 피드 + 스케줄러
- [ ] 인증 (Supabase Auth)
- [ ] 성능 최적화 + 모니터링

---

## 8. 제약 및 리스크

| 리스크 | 대응 방안 |
|---|---|
| FMP 무료 티어 한계 (250 req/day) | Supabase 캐싱으로 최소화, 초과 시 유료 전환 |
| Claude API 비용 | 분석 결과 캐싱 6시간, 개발 중 mock data 활용 |
| DART API 응답 구조 복잡 | 별도 파서 모듈 + 테스트 커버리지 |
| 투자 조언 법적 리스크 | 면책 조항 명시, "참고용 정보" 강조 |

---

## 9. 면책 조항 (필수)

> 본 서비스는 투자 참고 정보를 제공할 뿐이며, 투자 권유나 금융 조언이 아닙니다. 모든 투자 결정은 사용자 본인의 판단과 책임 하에 이루어져야 합니다.
