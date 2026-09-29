"use client";
import { entityLookupCache } from "@/utilis/Constants/entityLookupCache";
import { useCallback, useSyncExternalStore } from "react";

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
