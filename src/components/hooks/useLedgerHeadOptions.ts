"use client";

import { useSyncExternalStore } from "react";
import { ledgerHeadStore } from "@/utilis/Constants/ledgerLookupStore";

export function useLedgerHeadOptions() {
  return useSyncExternalStore(
    ledgerHeadStore.subscribe,
    ledgerHeadStore.getSnapshot,
    ledgerHeadStore.getSnapshot,
  );
}
