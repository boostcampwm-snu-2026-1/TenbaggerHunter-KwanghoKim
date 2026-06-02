/**
 * 캐싱 레이어 — 외부 API/AI 응답은 반드시 캐싱 (CLAUDE.md 원칙 #2).
 * TTL 정책은 PRD §4.3 기준.
 *
 * 개발(기본): in-memory. NEXT_PUBLIC_SUPABASE_URL 설정 시 Supabase 백엔드로 전환.
 */

/** TTL(초) 정책 — PRD §4.3. */
export const TTL = {
  financialsAnnual: 24 * 60 * 60, // 재무제표(연간) 24h
  quote: 60 * 60, // 주가/시총 1h
  aiAnalysis: 6 * 60 * 60, // AI 분석 결과 6h
  news: 2 * 60 * 60, // 뉴스 요약 2h
} as const;

export interface Cache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
}

/** 프로세스 메모리 캐시 (개발 기본값). 서버 재시작 시 휘발. */
class MemoryCache implements Cache {
  private store = new Map<string, { value: unknown; expiresAt: number }>();

  async get<T>(key: string): Promise<T | null> {
    const hit = this.store.get(key);
    if (!hit) return null;
    if (Date.now() > hit.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return hit.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    this.store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  }
}

let instance: Cache | null = null;

/** 환경에 맞는 캐시 싱글턴. (Supabase 백엔드는 lib/cache/supabase.ts 에서 추가 예정) */
export function getCache(): Cache {
  if (!instance) instance = new MemoryCache();
  return instance;
}

/** get → miss면 loader 실행 후 set 하는 헬퍼 (read-through). */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<T> {
  const cache = getCache();
  const hit = await cache.get<T>(key);
  if (hit !== null) return hit;
  const value = await loader();
  await cache.set(key, value, ttlSeconds);
  return value;
}
