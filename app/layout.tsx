import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tenbagger Hunter",
  description: "AI 기반 글로벌 주식 Tenbagger 후보 탐색 도구",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4">
          <header className="flex items-center justify-between py-5">
            <Link href="/" className="text-lg font-bold tracking-tight">
              🐅 Tenbagger Hunter
            </Link>
            <span className="text-xs text-neutral-500">AI 주식 리서치 어시스턴트</span>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
            본 서비스는 투자 참고 정보를 제공할 뿐이며, 투자 권유나 금융 조언이 아닙니다.
            모든 투자 결정은 사용자 본인의 판단과 책임 하에 이루어져야 합니다.
          </footer>
        </div>
      </body>
    </html>
  );
}
