"use client";

/*
 * 로딩 중 투자 대가 명언을 주기적으로 교체해 보여주는 패널.
 * 하이드레이션 안전: 초기 렌더는 서버가 준 고정 index(0). mount 후 useEffect에서만
 * 랜덤 셔플 + 주기 교체. fade 트랜지션으로 "살아있는" 단말기 느낌 유지.
 */
import { useEffect, useState } from "react";
import { INVESTING_QUOTES } from "@/lib/data/quotes";
import { Panel } from "./index";

const ROTATE_MS = 6000;

/** [0..n) 인덱스를 무작위로 섞은 순회 순서를 만든다. */
function shuffledOrder(n: number) {
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export function InvestorWisdom({ className }: { className?: string }) {
  // 서버/클라이언트 첫 렌더 동일하게 0번부터. mount 후에만 셔플.
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const order = shuffledOrder(INVESTING_QUOTES.length);
    let pos = 0;
    setIdx(order[0]);

    const id = setInterval(() => {
      // 페이드 아웃 → 교체 → 페이드 인
      setVisible(false);
      setTimeout(() => {
        pos = (pos + 1) % order.length;
        setIdx(order[pos]);
        setVisible(true);
      }, 280);
    }, ROTATE_MS);

    return () => clearInterval(id);
  }, []);

  const q = INVESTING_QUOTES[idx];

  return (
    <Panel title="Market Wisdom" code="QUOTE" className={className}>
      <div
        className="flex min-h-[5.5rem] flex-col justify-center gap-2 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <blockquote className="space-y-1">
          <p className="text-[12px] leading-snug text-term-white">
            <span className="mr-1 text-term-accent">“</span>
            {q.ko}
            <span className="ml-0.5 text-term-accent">”</span>
          </p>
          <p className="text-[10px] italic leading-snug text-term-faint">
            {q.en}
          </p>
        </blockquote>
        <div className="flex items-baseline gap-1.5 border-t border-term-grid pt-1 text-[10px]">
          <span className="text-term-accent">—</span>
          <span className="font-bold text-term-accent">{q.by}</span>
          <span className="text-term-muted">· {q.role}</span>
        </div>
      </div>
    </Panel>
  );
}
