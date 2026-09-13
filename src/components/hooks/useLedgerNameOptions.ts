// hooks/useLedgerNameOptions.ts
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ledgerNameStore,
  LEDGER_DEFAULT_OPTIONS,
  type SelectOption,
} from "@/utilis/Constants/ledgerLookupStore";

interface UseLedgerNameOptionsParams {
  fromDate?: string | null;
  toDate?: string | null;
  branchId?: string | null;
  ledgerHeadId?: string | number | null;
}

interface UseLedgerNameOptionsResult {
  options: SelectOption[];
  loading: boolean;
}

const NO_SUBSCRIBE = () => () => {};

export function useLedgerNameOptions({
  fromDate,
  toDate,
  branchId,
  ledgerHeadId,
}: UseLedgerNameOptionsParams): UseLedgerNameOptionsResult {
  const hasLedgerHead =
    ledgerHeadId !== undefined && ledgerHeadId !== null && ledgerHeadId !== "";
  const accountTypeId = hasLedgerHead ? Number(ledgerHeadId) : -1;
  const resolvedBranchId =
    branchId !== undefined &&
    branchId !== null &&
    String(branchId).trim() !== ""
      ? String(branchId)
      : "";
  const ready = Boolean(
    fromDate &&
    toDate &&
    resolvedBranchId &&
    hasLedgerHead &&
    Number.isFinite(accountTypeId),
  );

  const key = ready
    ? ledgerNameStore.getKey(
        fromDate!,
        toDate!,
        resolvedBranchId,
        accountTypeId,
      )
    : null;

  const [loading, setLoading] = useState(false);
  const triggeredKeyRef = useRef<string | null>(null);

  const snapshot = useSyncExternalStore(
    key ? (listener) => ledgerNameStore.subscribe(key, listener) : NO_SUBSCRIBE,
    () => (key ? ledgerNameStore.getSnapshot(key) : undefined),
    () => (key ? ledgerNameStore.getSnapshot(key) : undefined),
  );

  useEffect(() => {
    if (!key || !ready) return;
    if (ledgerNameStore.getSnapshot(key)) return; // already cached — no fetch
    if (triggeredKeyRef.current === key) return; // this key's fetch already kicked off

    triggeredKeyRef.current = key;
    setLoading(true);
    ledgerNameStore
      .fetch(fromDate!, toDate!, resolvedBranchId, accountTypeId)
      .finally(() => setLoading(false));
  }, [key, ready, fromDate, toDate, resolvedBranchId, accountTypeId]);

  if (!ready) {
    return { options: LEDGER_DEFAULT_OPTIONS, loading: false };
  }

  return { options: snapshot ?? LEDGER_DEFAULT_OPTIONS, loading };
}
