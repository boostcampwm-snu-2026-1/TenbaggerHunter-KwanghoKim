"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Bloomberg "TICKER <GO>" 커맨드 라인. 입력 후 Enter → 탐색. */
export function CommandLine() {
  const router = useRouter();
  const [cmd, setCmd] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = cmd.trim();
    if (!q) return;
    router.push(`/search?theme=${encodeURIComponent(q)}&market=US`);
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-1 items-center gap-1.5 border border-term-accent-dim bg-term-bg px-1.5 py-0.5"
    >
      <span className="text-[11px] font-bold text-term-accent term-glow">CMD</span>
      <input
        value={cmd}
        onChange={(e) => setCmd(e.target.value)}
        placeholder="테마 / 키워드 입력"
        spellCheck={false}
        className="min-w-0 flex-1 bg-transparent text-[11px] text-term-fg outline-none placeholder:text-term-faint"
      />
      <button
        type="submit"
        className="bg-term-accent px-1.5 text-[10px] font-bold tracking-widest text-term-bg"
      >
        &lt;GO&gt;
      </button>
    </form>
  );
}
