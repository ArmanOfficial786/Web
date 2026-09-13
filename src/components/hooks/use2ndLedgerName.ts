"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  dependentSubLedgerStore,
  LEDGER_DEFAULT_OPTIONS,
  type DependentSubLedgerLevel,
  type SelectOption,
} from "@/utilis/Constants/ledgerLookupStore";

interface UseDependentSubLedgerOptionsParams {
  level: DependentSubLedgerLevel;
  fromDate?: string | null;
  toDate?: string | null;
  branchId?: string | null;
  ledgerHeadId?: string | number | null;
  parentLedger?: string | null;
}

interface UseDependentSubLedgerOptionsResult {
  options: SelectOption[];
  loading: boolean;
}

const NO_SUBSCRIBE = () => () => {};

export function use2ndLedgerName({
  level,
  fromDate,
  toDate,
  branchId,
  ledgerHeadId,
  parentLedger,
}: UseDependentSubLedgerOptionsParams): UseDependentSubLedgerOptionsResult {
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
    parentLedger,
  );

  const key = ready
    ? dependentSubLedgerStore.getKey(
        level,
        fromDate!,
        toDate!,
        resolvedBranchId,
        accountTypeId,
        parentLedger!,
      )
    : null;
  const [loading, setLoading] = useState(false);
  const triggeredKeyRef = useRef<string | null>(null);

  const snapshot = useSyncExternalStore(
    key
      ? (listener) => dependentSubLedgerStore.subscribe(key, listener)
      : NO_SUBSCRIBE,
    () => (key ? dependentSubLedgerStore.getSnapshot(key) : undefined),
    () => (key ? dependentSubLedgerStore.getSnapshot(key) : undefined),
  );

  useEffect(() => {
    if (!key || !ready) return;
    if (dependentSubLedgerStore.getSnapshot(key)) return;
    if (triggeredKeyRef.current === key) return;

    triggeredKeyRef.current = key;
    setLoading(true);
    dependentSubLedgerStore
      .fetch(
        level,
        fromDate!,
        toDate!,
        resolvedBranchId,
        accountTypeId,
        parentLedger!,
      )
      .finally(() => setLoading(false));
  }, [
    key,
    ready,
    level,
    fromDate,
    toDate,
    resolvedBranchId,
    accountTypeId,
    parentLedger,
  ]);

  if (!ready) {
    return { options: LEDGER_DEFAULT_OPTIONS, loading: false };
  }

  return { options: snapshot ?? LEDGER_DEFAULT_OPTIONS, loading };
}

export const use3rdLedgerName = use2ndLedgerName;
export const use4thLedgerName = use2ndLedgerName;
