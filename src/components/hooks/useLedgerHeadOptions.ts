// hooks/useLedgerHeadOptions.ts
"use client";

import { useSyncExternalStore } from "react";
import { ledgerHeadStore } from "@/utilis/Constants/ledgerLookupStore";

// Subscribing (mounting this hook anywhere) lazily triggers the one-time
// fetch; every other component using this hook — in any form, any page —
// shares the same result with zero extra network calls.
export function useLedgerHeadOptions() {
  return useSyncExternalStore(
    ledgerHeadStore.subscribe,
    ledgerHeadStore.getSnapshot,
    ledgerHeadStore.getSnapshot, // SSR snapshot — same default list until client fetch resolves
  );
}
