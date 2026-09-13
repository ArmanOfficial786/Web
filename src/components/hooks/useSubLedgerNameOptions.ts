// hooks/useSubLedgerNameOptions.ts
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  subLedgerNameStore,
  LEDGER_DEFAULT_OPTIONS,
  type SelectOption,
} from "@/utilis/Constants/ledgerLookupStore";

interface UseSubLedgerNameOptionsParams {
  fromDate?: string | null;
  toDate?: string | null;
  branchId?: string | null;
  ledgerHeadId?: string | number | null;
  mainLedger?: string | null;
}

interface UseSubLedgerNameOptionsResult {
  options: SelectOption[];
  loading: boolean;
}

const NO_SUBSCRIBE = () => () => {};

export function useSubLedgerNameOptions({
  fromDate,
  toDate,
  branchId,
  ledgerHeadId,
  mainLedger,
}: UseSubLedgerNameOptionsParams): UseSubLedgerNameOptionsResult {
  const hasLedgerHead =
    ledgerHeadId !== undefined && ledgerHeadId !== null && ledgerHeadId !== "";
  // ⚠️ Gated on mainLedger too — SubLedgerName cannot resolve without an
  // upstream Ledger Name selection (backend requires MainLedger = @MainLedger).
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
    Number.isFinite(accountTypeId) &&
    mainLedger,
  );

  const key = ready
    ? subLedgerNameStore.getKey(
        fromDate!,
        toDate!,
        resolvedBranchId,
        accountTypeId,
        mainLedger!,
      )
    : null;

  const [loading, setLoading] = useState(false);
  const triggeredKeyRef = useRef<string | null>(null);

  const snapshot = useSyncExternalStore(
    key
      ? (listener) => subLedgerNameStore.subscribe(key, listener)
      : NO_SUBSCRIBE,
    () => (key ? subLedgerNameStore.getSnapshot(key) : undefined),
    () => (key ? subLedgerNameStore.getSnapshot(key) : undefined),
  );

  useEffect(() => {
    if (!key || !ready) return;
    if (subLedgerNameStore.getSnapshot(key)) return; // already cached — no fetch
    if (triggeredKeyRef.current === key) return; // this key's fetch already kicked off

    triggeredKeyRef.current = key;
    setLoading(true);
    subLedgerNameStore
      .fetch(fromDate!, toDate!, resolvedBranchId, accountTypeId, mainLedger!)
      .finally(() => setLoading(false));
  }, [
    key,
    ready,
    fromDate,
    toDate,
    resolvedBranchId,
    accountTypeId,
    mainLedger,
  ]);

  if (!ready) {
    return { options: LEDGER_DEFAULT_OPTIONS, loading: false };
  }

  return { options: snapshot ?? LEDGER_DEFAULT_OPTIONS, loading };
}
