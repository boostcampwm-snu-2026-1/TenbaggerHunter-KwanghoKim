# 디자인 시스템 — Bloomberg Terminal (classic GUI)

> Tenbagger Hunter의 모든 UI는 이 문서를 따른다.
> AI/사람 누가 작업하든 **이 규칙 밖으로 나가지 않는 것**이 컨셉 유지의 핵심이다.
> 토큰의 실제 값은 [app/globals.css](../app/globals.css) `:root`가 단일 소스(SSOT).

레퍼런스 이미지: **`docs/design/bloomberg-reference-3.png`** (이게 정본. 이 화면을 픽셀 단위로 모사한다.)

## 컨셉 한 줄
**Bloomberg Professional (2010년대 GUI)** — **Win95 입체(베벨) 위젯 + 네이비 타이틀바 + 검정 데이터 영역 + 주황 헤더/라벨 + 흰 값 + 초록/빨강 등락 + 시안 링크**. 상단 컬러 펑션키 툴바, 우측 라인차트(점선 그리드+거래량 바), 하단 번호 뉴스피드 + 초록 배너. 크리스프 LCD(글로우·스캔라인 **없음**), 초고밀도(10~11px).

## 절대 규칙 (어기면 컨셉이 깨진다)
1. **색은 토큰만.** raw hex·`bg-neutral-*`·`text-emerald-*` 금지 → `bg-term-*`, `text-term-*`만.
2. **모서리는 각짐.** `rounded-*` 금지 (radius 토큰이 전부 `0`).
3. **폰트는 모노스페이스.** body 기본 11px/`line-height 1.2`. sans로 덮지 말 것.
4. **입체는 베벨로만.** 깊이감은 `.bevel`(돌출) / `.bevel-in`(함몰) 유틸로. 임의 `box-shadow`/그라데이션/`blur` 금지. **글로우·CRT 스캔라인 금지(이 레퍼런스엔 없다).**
5. **패널 타이틀바는 네이비.** `<Panel>`이 `bg-term-navy` 헤더 + 주황 제목 + 시안 코드를 자동 적용. 직접 헤더를 다시 칠하지 말 것.
6. **초고밀도.** 패딩 `p-0.5`~`p-1`, gap `gap-px`~`gap-1`, 폰트 `text-[9px]`~`text-[11px]`. 여백은 사치.
7. **표 규칙.** 컬럼 헤더는 주황(`<ColHead>`), 라벨은 `term-muted`, 값은 흰색(`term-white`), 등락은 `<Delta>`(초록/빨강 +/-). 숫자엔 `tabular-nums`. 행 줄무늬는 `odd:bg-term-navy-dk/40`.

## 토큰 (= tailwind 클래스)
| 용도 | 클래스 | 색 |
|---|---|---|
| 데이터 바탕 | `bg-term-bg` / `bg-term-panel` | 검정 |
| 타이틀바/네비 | `bg-term-navy` | 로열 블루 |
| 강조 행/함몰 | `bg-term-navy-dk` | 진한 블루 |
| 툴바/데스크톱 | `bg-term-chrome` | 다크 그레이 |
| 베벨 하이라이트/그림자 | `--term-bevel-lt` / `--term-bevel-dk` | (box-shadow 전용) |
| 헤더·라벨·시그니처 | `text-term-accent` / `bg-term-accent` | **주황 #ff8c1a** |
| 값(기본 텍스트) | `text-term-white` (=`term-fg`) | 웜 화이트 |
| 보조 라벨 | `text-term-muted` | 밝은 회색 |
| 상승 | `text-term-up` | 초록 |
| 하락 | `text-term-down` | 빨강 |
| 링크/코드 | `text-term-info` | 시안 |
| 노랑 강조 | `text-term-warn` | 노랑 |
| 보조 강조 | `text-term-mag` | 마젠타 |
| 비활성/단위 | `text-term-faint` | |

## 컴포넌트 우선 (raw `<div>`보다 이걸 조립)
[components/terminal/index.tsx](../components/terminal/index.tsx):
- `<Panel title code>` — 네이비 타이틀바 + 베벨 + 검정 본문. 모든 창의 기본.
- `<DataRow label value tone>` — 라벨/값 한 줄.
- `<ColHead cols>` — 주황 컬럼 헤더 행.
- `<Delta value>` — 증감(초록/빨강 +/-).
- `<Tag tone>` — 베벨 컬러 칩.
- `<Cell tone>` — 히트맵 셀(`grid gap-px`로 매트릭스).
- `<Sparkline data>` — 블록문자 미니차트. `<Bar pct>` — 비율 바.
- `<TickerTape items>` — 스크롤 시세. `<NewsFeed items>` — 번호 뉴스 피드.

[components/terminal/chart.tsx](../components/terminal/chart.tsx):
- `<LineChartPanel series volume yLabels xLabels>` — SVG 라인차트(점선 그리드 + 거래량 바 + 축). 큰 차트는 이걸로.

[components/terminal/toolbar.tsx](../components/terminal/toolbar.tsx):
- `<TopToolbar>` — 상단 컬러 펑션키 그리드.

[components/terminal/command-line.tsx](../components/terminal/command-line.tsx):
- `<CommandLine>` — `CMD … <GO>` 입력.

전역 유틸: `.bevel` / `.bevel-in`(입체), `.term-cursor`(블링킹 커서), `.term-glow`(이 컨셉에선 no-op).

새 화면을 만들 땐 먼저 "Panel + DataRow + ColHead + Cell + LineChartPanel 조합으로 짤 수 있나?"를 자문한다. 없으면 프리미티브를 추가하고 재사용 (일회성 스타일 금지).

## 새 UI 작업 체크리스트
- [ ] raw hex / `neutral-*` / `*-400` 색 안 썼나? (term-* 토큰만)
- [ ] `rounded-*` 안 썼나?
- [ ] 깊이는 `.bevel`/`.bevel-in`만? (임의 box-shadow/글로우/그라데이션 없나)
- [ ] 패널은 `<Panel>`(네이비 헤더)로 감쌌나?
- [ ] 표는 `<ColHead>`+`<DataRow>`+`<Delta>`, 숫자 `tabular-nums`?
- [ ] 초고밀도(≤11px, p-1 이하) 유지?

## 검증
```bash
git grep -nE 'rounded-|neutral-[0-9]|emerald-|amber-[0-9]|#[0-9a-fA-F]{3,6}' -- 'app/**/*.tsx' 'components/**/*.tsx'
```
비어 있으면 OK (예외: globals.css/tailwind.config.ts 토큰 정의부).
