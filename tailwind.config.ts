import type { Config } from "tailwindcss";

/*
 * 색/폰트/모서리 토큰은 app/globals.css :root 가 단일 소스(SSOT).
 * 여기서는 그 CSS 변수를 tailwind 클래스로 노출만 한다.
 * 규칙: docs/DESIGN.md
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        term: {
          bg: "var(--term-bg)",
          panel: "var(--term-panel)",
          navy: "var(--term-navy)",
          "navy-dk": "var(--term-navy-dk)",
          chrome: "var(--term-chrome)",
          grid: "var(--term-grid)",
          border: "var(--term-border)",
          white: "var(--term-white)",
          accent: "var(--term-accent)",
          "accent-dim": "var(--term-accent-dim)",
          up: "var(--term-up)",
          down: "var(--term-down)",
          warn: "var(--term-warn)",
          info: "var(--term-info)",
          mag: "var(--term-mag)",
          fg: "var(--term-fg)",
          muted: "var(--term-muted)",
          faint: "var(--term-faint)",
        },
        // 하위호환 별칭 (기존 bull/bear 사용처)
        bull: "var(--term-up)",
        bear: "var(--term-down)",
      },
      fontFamily: {
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SF Mono",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      borderRadius: {
        // 터미널은 각진 모서리가 원칙 — 둥근 모서리 사용 금지
        none: "0",
        DEFAULT: "0",
        sm: "0",
        md: "0",
        lg: "0",
        xl: "0",
      },
    },
  },
  plugins: [],
};

export default config;
