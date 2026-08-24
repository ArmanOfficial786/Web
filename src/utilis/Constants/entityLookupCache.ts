// // lib/entityLookupCache.ts
// "use client";

// type FetchFn<T> = () => Promise<T[]>;
// type Listener = () => void;

// interface CacheEntry<T> {
//   data: T[];
//   status: "idle" | "loading" | "loaded" | "error";
//   error?: string;
//   promise?: Promise<void>;
// }

// /**
//  * Module-level singleton — instantiated once per browser tab, imported by
//  * every component that needs it. This is what makes caching independent of
//  * React's component tree / Context providers: it lives outside React
//  * entirely, so any report on any route reuses the same data.
//  */
// class EntityLookupCache {
//   private store = new Map<string, CacheEntry<any>>();
//   private listeners = new Map<string, Set<Listener>>();

//   private getEntry<T>(key: string): CacheEntry<T> {
//     if (!this.store.has(key)) {
//       this.store.set(key, { data: [], status: "idle" });
//     }
//     return this.store.get(key)!;
//   }

//   private notify(key: string) {
//     this.listeners.get(key)?.forEach((l) => l());
//   }

//   subscribe(key: string, listener: Listener): () => void {
//     if (!this.listeners.has(key)) this.listeners.set(key, new Set());
//     this.listeners.get(key)!.add(listener);
//     return () => this.listeners.get(key)?.delete(listener);
//   }

//   getSnapshot<T>(key: string): CacheEntry<T> {
//     return this.getEntry<T>(key);
//   }

//   /**
//    * Ensures data for `key` is loaded. If already loaded — or a fetch is
//    * already in flight from a *different* component/report — this resolves
//    * without hitting the network again.
//    */
//   async ensure<T>(
//     key: string,
//     fetchFn: FetchFn<T>,
//     force = false,
//   ): Promise<void> {
//     const entry = this.getEntry<T>(key);

//     if (!force && (entry.status === "loaded" || entry.status === "loading")) {
//       if (entry.promise) await entry.promise;
//       return;
//     }

//     entry.status = "loading";
//     entry.error = undefined;
//     this.notify(key);

//     const promise = (async () => {
//       try {
//         entry.data = await fetchFn();
//         entry.status = "loaded";
//       } catch (err: any) {
//         entry.status = "error";
//         entry.error = err?.message ?? "Failed to load data";
//       } finally {
//         entry.promise = undefined;
//         this.notify(key);
//       }
//     })();

//     entry.promise = promise;
//     await promise;
//   }

//   /** Force a re-fetch next time `ensure` runs (e.g. a manual refresh button). */
//   invalidate(key: string) {
//     this.store.delete(key);
//     this.notify(key);
//   }
// }

// export const entityLookupCache = new EntityLookupCache();

// lib/entityLookupCache.ts
"use client";

type FetchPageFn<T> = (
  page: number,
) => Promise<{ items: T[]; totalPages: number; currentPage: number }>;
type Listener = () => void;

interface CacheEntry<T> {
  data: T[];
  status: "idle" | "loading-first-page" | "streaming" | "loaded" | "error";
  error?: string;
  fetchedAt?: number;
  pagesLoaded: number;
  totalPages: number;
  inFlight?: Promise<void>;
}

interface PersistedEntry<T> {
  data: T[];
  fetchedAt: number;
  pagesLoaded: number;
  totalPages: number;
}

const STORAGE_PREFIX = "entity-lookup-cache:";
const DEFAULT_TTL_MS = 30 * 60 * 1000;
const MAX_BACKGROUND_PAGES = 200;

function readStorage<T>(key: string): PersistedEntry<T> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? (JSON.parse(raw) as PersistedEntry<T>) : null;
  } catch {
    return null;
  }
}

function writeStorage<T>(key: string, entry: PersistedEntry<T>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry));
  } catch {
    /* localStorage full/unavailable — in-memory cache still works this tab */
  }
}

function clearStorage(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    /* noop */
  }
}

class EntityLookupCache {
  private store = new Map<string, CacheEntry<any>>();
  private listeners = new Map<string, Set<Listener>>();

  private getEntry<T>(key: string): CacheEntry<T> {
    if (!this.store.has(key)) {
      const persisted = readStorage<T>(key);
      this.store.set(
        key,
        persisted
          ? {
              data: persisted.data,
              status: "loaded",
              fetchedAt: persisted.fetchedAt,
              pagesLoaded: persisted.pagesLoaded,
              totalPages: persisted.totalPages,
            }
          : { data: [], status: "idle", pagesLoaded: 0, totalPages: 1 },
      );
    }
    return this.store.get(key)!;
  }

  private notify(key: string) {
    this.listeners.get(key)?.forEach((l) => l());
  }

  subscribe(key: string, listener: Listener): () => void {
    if (!this.listeners.has(key)) this.listeners.set(key, new Set());
    this.listeners.get(key)!.add(listener);
    return () => this.listeners.get(key)?.delete(listener);
  }

  getSnapshot<T>(key: string): CacheEntry<T> {
    return this.getEntry<T>(key);
  }

  private isFresh(entry: CacheEntry<any>, ttlMs: number): boolean {
    return !!entry.fetchedAt && Date.now() - entry.fetchedAt < ttlMs;
  }

  private persist<T>(key: string, entry: CacheEntry<T>) {
    entry.fetchedAt = Date.now();
    writeStorage(key, {
      data: entry.data,
      fetchedAt: entry.fetchedAt,
      pagesLoaded: entry.pagesLoaded,
      totalPages: entry.totalPages,
    });
  }

  private async loadFirstPageThenStream<T>(
    key: string,
    entry: CacheEntry<T>,
    fetchPage: FetchPageFn<T>,
  ) {
    entry.status = "loading-first-page";
    this.notify(key);

    try {
      const first = await fetchPage(1);
      entry.data = first.items;
      entry.pagesLoaded = 1;
      entry.totalPages = first.totalPages;
      entry.status = entry.totalPages > 1 ? "streaming" : "loaded";
      this.persist(key, entry);
      this.notify(key);
    } catch (err: any) {
      entry.status = "error";
      entry.error = err?.message ?? "Failed to load data";
      this.notify(key);
      return;
    }

    void this.streamRemainingPages(key, entry, fetchPage);
  }

  private async streamRemainingPages<T>(
    key: string,
    entry: CacheEntry<T>,
    fetchPage: FetchPageFn<T>,
  ) {
    const cap = Math.min(entry.totalPages, MAX_BACKGROUND_PAGES);
    for (let page = entry.pagesLoaded + 1; page <= cap; page++) {
      try {
        const next = await fetchPage(page);
        entry.data = entry.data.concat(next.items);
        entry.pagesLoaded = page;
        this.persist(key, entry);
        this.notify(key);
      } catch {
        break;
      }
    }
    entry.status = "loaded";
    this.notify(key);
  }

  async ensure<T>(
    key: string,
    fetchPage: FetchPageFn<T>,
    opts?: { force?: boolean; ttlMs?: number },
  ): Promise<void> {
    const ttlMs = opts?.ttlMs ?? DEFAULT_TTL_MS;
    const entry = this.getEntry<T>(key);

    if (opts?.force) {
      entry.pagesLoaded = 0;
      entry.inFlight = this.loadFirstPageThenStream(key, entry, fetchPage);
      await entry.inFlight;
      return;
    }

    if (entry.status === "loading-first-page" || entry.status === "streaming") {
      if (entry.inFlight) await entry.inFlight;
      return;
    }

    if (entry.status === "loaded" && this.isFresh(entry, ttlMs)) {
      return;
    }

    if (entry.status === "loaded" && entry.data.length > 0) {
      entry.inFlight = this.loadFirstPageThenStream(key, entry, fetchPage);
      void entry.inFlight;
      return;
    }

    entry.inFlight = this.loadFirstPageThenStream(key, entry, fetchPage);
    await entry.inFlight;
  }

  invalidate(key: string) {
    this.store.delete(key);
    clearStorage(key);
    this.notify(key);
  }
}

export const entityLookupCache = new EntityLookupCache();
