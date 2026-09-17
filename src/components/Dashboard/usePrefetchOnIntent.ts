"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Prefetches a route on hover/focus/touch — NOT via <Link prefetch="auto">,
 * because that fires for every link that scrolls into view. Expanding
 * "Member A/C" would fire ~50 RSC requests at once for reports nobody opened.
 * This fires exactly one, ~100-300ms before the click actually lands.
 */
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
