/*
 * TopToolbar — Bloomberg 상단 컬러 펑션키 그리드 재현.
 * Win95 베벨 컬러 타일 버튼. 대부분 장식, 일부만 라우팅.
 * 레퍼런스: docs/design/bloomberg-reference-3.png (상단 툴바)
 */
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type Tone = "red" | "green" | "amber" | "blue" | "mag" | "white" | "gray";

const FACE: Record<Tone, string> = {
  red: "bg-term-down text-black",
  green: "bg-term-up text-black",
  amber: "bg-term-accent text-black",
  blue: "bg-term-navy text-term-white",
  mag: "bg-term-mag text-black",
  white: "bg-term-white text-black",
  gray: "bg-term-chrome text-term-white",
};

// 레퍼런스 툴바를 모사한 라벨/색 (장식)
const ROWS: { label: string; tone: Tone; href?: string }[][] = [
  [
    { label: "CANCEL", tone: "red" },
    { label: "MSG", tone: "amber" },
    { label: "PRINT", tone: "green" },
    { label: "MENU", tone: "green" },
    { label: "SCREEN", tone: "amber", href: "/search" },
    { label: "DFLT", tone: "green" },
    { label: "PRQS", tone: "amber" },
    { label: "OUT", tone: "amber" },
    { label: "PASTE", tone: "blue" },
    { label: "TREQ", tone: "green" },
    { label: "CHKNW", tone: "amber" },
    { label: "FIXED", tone: "green" },
    { label: "OVER", tone: "amber" },
    { label: "HTEST", tone: "green" },
    { label: "QFIX", tone: "amber" },
  ],
  [
    { label: "HOME", tone: "green", href: "/" },
    { label: "SET2", tone: "green" },
    { label: "SET3", tone: "green" },
    { label: "T1", tone: "amber" },
    { label: "T2", tone: "amber" },
    { label: "T3", tone: "amber" },
    { label: "GTKI", tone: "amber" },
    { label: "GTKF", tone: "red" },
    { label: "DRQS", tone: "green" },
    { label: "FXTP", tone: "blue" },
    { label: "SKIN", tone: "amber" },
    { label: "FXFC", tone: "green" },
    { label: "FONTS", tone: "white" },
    { label: "WINLO", tone: "green" },
    { label: "REMAP", tone: "green" },
  ],
  [
    { label: "POPF", tone: "green" },
    { label: "DMSG", tone: "mag" },
    { label: "PNMGR", tone: "green" },
    { label: "AUTOC", tone: "green" },
    { label: "CASE", tone: "green" },
    { label: "NW1", tone: "green" },
    { label: "TOP", tone: "amber" },
    { label: "CONS", tone: "green" },
    { label: "OUT4", tone: "green" },
    { label: "FREEZE", tone: "amber" },
    { label: "GLF2", tone: "mag" },
    { label: "DLDA", tone: "green" },
    { label: "WEI", tone: "green" },
    { label: "HRA", tone: "amber" },
    { label: "IBFIX", tone: "green" },
  ],
];

export function TopToolbar() {
  return (
    <div className="border-b border-term-bevel-dk bg-term-chrome p-1">
      <div className="flex flex-col gap-0.5">
        {ROWS.map((row, ri) => (
          <div key={ri} className="flex flex-wrap gap-0.5">
            {row.map((b, bi) => {
              const cls = cn(
                "bevel px-1.5 py-0.5 text-[10px] font-bold leading-none tracking-tight",
                FACE[b.tone],
              );
              return b.href ? (
                <Link key={bi} href={b.href} className={cls}>
                  {b.label}
                </Link>
              ) : (
                <button key={bi} type="button" className={cls}>
                  {b.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
