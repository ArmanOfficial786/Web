// // hooks/useEntityLookupCache.ts
// "use client";
// import { useCallback, useSyncExternalStore } from "react";
// import { entityLookupCache } from "@/utilis/Constants/entityLookupCache";

// export function useEntityLookupCache<T>(cacheKey: string) {
//   const snapshot = useSyncExternalStore(
//     (listener) => entityLookupCache.subscribe(cacheKey, listener),
//     () => entityLookupCache.getSnapshot<T>(cacheKey),
//     () => entityLookupCache.getSnapshot<T>(cacheKey), // SSR fallback
//   );

//   const ensure = useCallback(
//     (fetchFn: () => Promise<T[]>) =>
//       entityLookupCache.ensure<T>(cacheKey, fetchFn),
//     [cacheKey],
//   );

//   const refetch = useCallback(
//     (fetchFn: () => Promise<T[]>) =>
//       entityLookupCache.ensure<T>(cacheKey, fetchFn, true),
//     [cacheKey],
//   );

//   return {
//     data: snapshot.data as T[],
//     isLoading: snapshot.status === "loading",
//     error: snapshot.error,
//     status: snapshot.status,
//     ensure,
//     refetch,
//   };
// }

// hooks/useEntityLookupCache.ts
"use client";
import { useCallback, useSyncExternalStore } from "react";
import { entityLookupCache } from "@/utilis/Constants/entityLookupCache";

export function useEntityLookupCache<T>(cacheKey: string, ttlMs?: number) {
  const snapshot = useSyncExternalStore(
    (listener) => entityLookupCache.subscribe(cacheKey, listener),
    () => entityLookupCache.getSnapshot<T>(cacheKey),
    () => entityLookupCache.getSnapshot<T>(cacheKey),
  );

  const ensure = useCallback(
    (
      fetchPage: (
        page: number,
      ) => Promise<{ items: T[]; totalPages: number; currentPage: number }>,
    ) => entityLookupCache.ensure<T>(cacheKey, fetchPage, { ttlMs }),
    [cacheKey, ttlMs],
  );

  const refetch = useCallback(
    (
      fetchPage: (
        page: number,
      ) => Promise<{ items: T[]; totalPages: number; currentPage: number }>,
    ) =>
      entityLookupCache.ensure<T>(cacheKey, fetchPage, { force: true, ttlMs }),
    [cacheKey, ttlMs],
  );

  return {
    data: snapshot.data as T[],
    isLoading:
      snapshot.status === "loading-first-page" && snapshot.data.length === 0,
    isStreaming: snapshot.status === "streaming",
    pagesLoaded: snapshot.pagesLoaded,
    totalPages: snapshot.totalPages,
    error: snapshot.error,
    ensure,
    refetch,
  };
}
