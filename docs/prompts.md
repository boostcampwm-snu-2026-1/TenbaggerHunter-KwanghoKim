# 프롬프트 버전 로그

> AI 프롬프트는 코드(`lib/ai/prompts/`)가 단일 소스이며, 이 문서는 **변경 이력/의도**를 기록한다.
> 프롬프트 수정 시 여기에 버전을 추가한다 (docs/agent-workflow.md 체크포인트 3.3).

## theme-search (테마 → 기업 후보)
- **v1** (2026-06-02) — 최초. 자연어 테마 → 상장사 5~8개 + 정성 축(tam/moat/management/narrative, 1~10) + oneLiner(한국어, 수치 근거 지향). JSON-only. 대형주 편중 방지·비단정 서술 지시.
  - 파일: [lib/ai/prompts/theme-search.ts](../lib/ai/prompts/theme-search.ts)

## deepdive (정성 축 + Bull/Bear/Verdict 통합)
- **v1** (2026-06-14) — `score` v1 + `bull-bear` v1 통합. 동일 입력(profile+financials)으로 2회 호출하던 것을 1회로 합쳐 딥다이브당 API 비용·지연 절반. AI는 정성 4축(tam/moat/management/narrative, 1~10)과 Bull 3/Bear 3/Verdict를 한 JSON으로 반환. 재무 축은 여전히 정량 계산(`lib/score`)으로 분리. 단정적 매수·매도 금지·투자 권유 아님 유지 (체크포인트 3.4). temperature 0.4.
  - 파일: [lib/ai/prompts/deepdive.ts](../lib/ai/prompts/deepdive.ts)
- ~~score v1 / bull-bear v1~~ (2026-06-02) — deepdive v1로 통합되며 제거.

---

## Score 가중치 (참고)
TAM 25% / 해자 20% / 경영진 15% / 재무 25% / 내러티브 15% — PRD §3.1 F-02.
정성 축은 AI 1~10 → 0~100 정규화, 재무 축은 정량 계산. 코드: [lib/score/index.ts](../lib/score/index.ts).
