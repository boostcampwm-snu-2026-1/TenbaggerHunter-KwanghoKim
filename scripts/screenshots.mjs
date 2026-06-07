// README용 화면 스크린샷 자동 캡처.
// mock 모드 서버(결정적 데이터)를 대상으로 3개 화면을 docs/screenshots/ 에 저장한다.
//
// 사용법:
//   AI_PROVIDER=mock PORT=3010 npm run dev   (별도 터미널)
//   BASE_URL=http://localhost:3010 node scripts/screenshots.mjs
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:3010";
const OUT = "docs/screenshots";

const shots = [
  { name: "landing", path: "/", waitFor: "text=Tenbagger" },
  {
    name: "search",
    path: `/search?theme=${encodeURIComponent("AI 데이터센터 전력 인프라")}&market=US`,
    waitFor: "text=Vertiv",
  },
  { name: "deepdive", path: "/company/VRT", waitFor: "svg" },
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

for (const s of shots) {
  await page.goto(`${BASE}${s.path}`, { waitUntil: "networkidle", timeout: 60000 });
  try {
    await page.waitForSelector(s.waitFor, { timeout: 15000 });
  } catch {
    console.warn(`[warn] selector "${s.waitFor}" not found for ${s.name}, capturing anyway`);
  }
  await page.waitForTimeout(1200); // 차트/애니메이션 안정화
  await page.screenshot({ path: `${OUT}/${s.name}.png`, fullPage: true });
  console.log(`captured ${s.name}.png`);
}

await browser.close();
console.log("done →", OUT);
