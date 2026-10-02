"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

export function usePrefetchOnIntent(href: string) {
  const router = useRouter();
  const prefetch = useCallback(() => router.prefetch(href), [router, href]);
  return useMemo(
    () => ({
      onMouseEnter: prefetch,
      onFocus: prefetch,
      onTouchStart: prefetch,
    }),
    [prefetch],
  );
}
