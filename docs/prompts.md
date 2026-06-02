# 프롬프트 버전 로그

> AI 프롬프트는 코드(`lib/ai/prompts/`)가 단일 소스이며, 이 문서는 **변경 이력/의도**를 기록한다.
> 프롬프트 수정 시 여기에 버전을 추가한다 (docs/agent-workflow.md 체크포인트 3.3).

## theme-search (테마 → 기업 후보)
- **v1** (2026-06-02) — 최초. 자연어 테마 → 상장사 5~8개 + 정성 축(tam/moat/management/narrative, 1~10) + oneLiner(한국어, 수치 근거 지향). JSON-only. 대형주 편중 방지·비단정 서술 지시.
  - 파일: [lib/ai/prompts/theme-search.ts](../lib/ai/prompts/theme-search.ts)

## score (정성 축 평가)
- **v1** (2026-06-02) — 최초. 재무 축은 정량 계산(`lib/score`)으로 분리하고, AI는 tam/moat/management/narrative 4개 축만 1~10로 평가. 근거 기반 냉정 평가 지시.
  - 파일: [lib/ai/prompts/score.ts](../lib/ai/prompts/score.ts)

## bull-bear (Bull/Bear/Verdict)
- **v1** (2026-06-02) — 최초. Bull 3 / Bear 3 / Verdict(investorType + Risk-Reward 서술). 단정적 매수·매도 금지, 투자 권유 아님 명시 (체크포인트 3.4).
  - 파일: [lib/ai/prompts/bull-bear.ts](../lib/ai/prompts/bull-bear.ts)

---

## Score 가중치 (참고)
TAM 25% / 해자 20% / 경영진 15% / 재무 25% / 내러티브 15% — PRD §3.1 F-02.
정성 축은 AI 1~10 → 0~100 정규화, 재무 축은 정량 계산. 코드: [lib/score/index.ts](../lib/score/index.ts).
