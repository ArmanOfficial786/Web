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
    if (subLedgerNameStore.getSnapshot(key)) return;
    if (triggeredKeyRef.current === key) return;

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
