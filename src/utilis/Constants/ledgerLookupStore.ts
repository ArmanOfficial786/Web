// lib/ledgerLookupStore.ts
"use client";

import ledgerLookupService, {
  type LedgerHeadOption,
  type LedgerNameOption,
  type SubLedgerNameOption,
  type SecondSubLedgerNameOption,
  type ThirdSubLedgerNameOption,
  type FourthSubLedgerNameOption,
} from "@/services/Common/LedgerLookupService";

export type SelectOption = { id: string; name: string };

export const LEDGER_DEFAULT_OPTIONS: SelectOption[] = [
  { id: "", name: "-- Select --" },
];

// ============================================================================
// Ledger Head — one global list for the whole app, fetched at most once.
// ============================================================================

let ledgerHeadOptions: SelectOption[] = LEDGER_DEFAULT_OPTIONS;
let ledgerHeadPromise: Promise<void> | null = null;
const ledgerHeadListeners = new Set<() => void>();

function notifyLedgerHead() {
  ledgerHeadListeners.forEach((listener) => listener());
}

function ensureLedgerHeadsLoaded(): void {
  if (ledgerHeadPromise) return;

  ledgerHeadPromise = ledgerLookupService
    .getLedgerHeads()
    .then((heads: LedgerHeadOption[]) => {
      ledgerHeadOptions = [
        { id: "", name: "-- Select --" },
        ...heads.map((h) => ({
          id: String(h.acoAccountTypeId),
          name: h.accountType,
        })),
      ];
      notifyLedgerHead();
    })
    .catch(() => {
      // Clear the cached promise so the next subscriber's mount retries
      // instead of the whole app being stuck with an empty list forever.
      ledgerHeadPromise = null;
    });
}

export const ledgerHeadStore = {
  subscribe(listener: () => void) {
    ledgerHeadListeners.add(listener);
    ensureLedgerHeadsLoaded();
    return () => {
      ledgerHeadListeners.delete(listener);
    };
  },
  getSnapshot(): SelectOption[] {
    return ledgerHeadOptions;
  },
};

// ============================================================================
// Ledger Name — cached per (fromDate, toDate, branchId, accountTypeId) key.
// Concurrent requests for the same key share one in-flight promise; a key
// already resolved is served instantly from cache with no network call.
// ============================================================================

type LedgerNameKey = string;

function buildLedgerNameKey(
  fromDate: string,
  toDate: string,
  branchId: string,
  accountTypeId: number,
): LedgerNameKey {
  return `${fromDate}|${toDate}|${branchId}|${accountTypeId}`;
}

const ledgerNameCache = new Map<LedgerNameKey, SelectOption[]>();
const ledgerNameInFlight = new Map<LedgerNameKey, Promise<SelectOption[]>>();
const ledgerNameListeners = new Map<LedgerNameKey, Set<() => void>>();

function notifyLedgerName(key: LedgerNameKey) {
  ledgerNameListeners.get(key)?.forEach((listener) => listener());
}

function fetchLedgerNames(
  fromDate: string,
  toDate: string,
  branchId: string,
  accountTypeId: number,
): Promise<SelectOption[]> {
  const key = buildLedgerNameKey(fromDate, toDate, branchId, accountTypeId);

  const cached = ledgerNameCache.get(key);
  if (cached) return Promise.resolve(cached);

  const inFlight = ledgerNameInFlight.get(key);
  if (inFlight) return inFlight;

  const promise = ledgerLookupService
    .getLedgerNames({ fromDate, toDate, branchId, accountTypeId })
    .then((names: LedgerNameOption[]) => {
      const mapped: SelectOption[] = [
        { id: "", name: "-- Select --" },
        ...names.map((n) => ({ id: n.mainLedger, name: n.mainLedger })),
      ];
      ledgerNameCache.set(key, mapped);
      ledgerNameInFlight.delete(key);
      notifyLedgerName(key);
      return mapped;
    })
    .catch((err) => {
      ledgerNameInFlight.delete(key);
      throw err;
    });

  ledgerNameInFlight.set(key, promise);
  return promise;
}

export const ledgerNameStore = {
  getKey: buildLedgerNameKey,
  getSnapshot(key: LedgerNameKey): SelectOption[] | undefined {
    return ledgerNameCache.get(key);
  },
  isLoading(key: LedgerNameKey): boolean {
    return ledgerNameInFlight.has(key);
  },
  subscribe(key: LedgerNameKey, listener: () => void) {
    if (!ledgerNameListeners.has(key)) {
      ledgerNameListeners.set(key, new Set());
    }
    ledgerNameListeners.get(key)!.add(listener);
    return () => {
      ledgerNameListeners.get(key)?.delete(listener);
    };
  },
  fetch: fetchLedgerNames,
};

// ============================================================================
// Sub Ledger Name — cached per (fromDate, toDate, branchId, accountTypeId,
// mainLedger) key. Same dedupe/cache shape as Ledger Name, one extra key
// segment for the upstream Ledger Name selection it cascades from.
// ============================================================================

type SubLedgerNameKey = string;

function buildSubLedgerNameKey(
  fromDate: string,
  toDate: string,
  branchId: string,
  accountTypeId: number,
  mainLedger: string,
): SubLedgerNameKey {
  return `${fromDate}|${toDate}|${branchId}|${accountTypeId}|${mainLedger}`;
}

const subLedgerNameCache = new Map<SubLedgerNameKey, SelectOption[]>();
const subLedgerNameInFlight = new Map<
  SubLedgerNameKey,
  Promise<SelectOption[]>
>();
const subLedgerNameListeners = new Map<SubLedgerNameKey, Set<() => void>>();

function notifySubLedgerName(key: SubLedgerNameKey) {
  subLedgerNameListeners.get(key)?.forEach((listener) => listener());
}

function fetchSubLedgerNames(
  fromDate: string,
  toDate: string,
  branchId: string,
  accountTypeId: number,
  mainLedger: string,
): Promise<SelectOption[]> {
  const key = buildSubLedgerNameKey(
    fromDate,
    toDate,
    branchId,
    accountTypeId,
    mainLedger,
  );

  const cached = subLedgerNameCache.get(key);
  if (cached) return Promise.resolve(cached);

  const inFlight = subLedgerNameInFlight.get(key);
  if (inFlight) return inFlight;

  const promise = ledgerLookupService
    .getSubLedgerNames({
      fromDate,
      toDate,
      branchId,
      accountTypeId,
      mainLedger,
    })
    .then((subLedgers: SubLedgerNameOption[]) => {
      const mapped: SelectOption[] = [
        { id: "", name: "-- Select --" },
        ...subLedgers.map((s) => ({ id: s.subLedger1, name: s.subLedger1 })),
      ];
      subLedgerNameCache.set(key, mapped);
      subLedgerNameInFlight.delete(key);
      notifySubLedgerName(key);
      return mapped;
    })
    .catch((err) => {
      subLedgerNameInFlight.delete(key);
      throw err;
    });

  subLedgerNameInFlight.set(key, promise);
  return promise;
}

export const subLedgerNameStore = {
  getKey: buildSubLedgerNameKey,
  getSnapshot(key: SubLedgerNameKey): SelectOption[] | undefined {
    return subLedgerNameCache.get(key);
  },
  isLoading(key: SubLedgerNameKey): boolean {
    return subLedgerNameInFlight.has(key);
  },
  subscribe(key: SubLedgerNameKey, listener: () => void) {
    if (!subLedgerNameListeners.has(key)) {
      subLedgerNameListeners.set(key, new Set());
    }
    subLedgerNameListeners.get(key)!.add(listener);
    return () => {
      subLedgerNameListeners.get(key)?.delete(listener);
    };
  },
  fetch: fetchSubLedgerNames,
};

export type DependentSubLedgerLevel = 2 | 3 | 4;
type DependentSubLedgerKey = string;

function buildDependentSubLedgerKey(
  level: DependentSubLedgerLevel,
  fromDate: string,
  toDate: string,
  branchId: string,
  accountTypeId: number,
  parentLedger: string,
): DependentSubLedgerKey {
  return `${level}|${fromDate}|${toDate}|${branchId}|${accountTypeId}|${parentLedger}`;
}

const dependentSubLedgerCache = new Map<
  DependentSubLedgerKey,
  SelectOption[]
>();
const dependentSubLedgerInFlight = new Map<
  DependentSubLedgerKey,
  Promise<SelectOption[]>
>();
const dependentSubLedgerListeners = new Map<
  DependentSubLedgerKey,
  Set<() => void>
>();

function fetchDependentSubLedgers(
  level: DependentSubLedgerLevel,
  fromDate: string,
  toDate: string,
  branchId: string,
  accountTypeId: number,
  parentLedger: string,
): Promise<SelectOption[]> {
  const key = buildDependentSubLedgerKey(
    level,
    fromDate,
    toDate,
    branchId,
    accountTypeId,
    parentLedger,
  );
  const cached = dependentSubLedgerCache.get(key);
  if (cached) return Promise.resolve(cached);

  const inFlight = dependentSubLedgerInFlight.get(key);
  if (inFlight) return inFlight;

  const request = { fromDate, toDate, branchId, accountTypeId, parentLedger };
  const promise = (
    level === 2
      ? ledgerLookupService.getSecondSubLedgerNames(request)
      : level === 3
        ? ledgerLookupService.getThirdSubLedgerNames(request)
        : ledgerLookupService.getFourthSubLedgerNames(request)
  )
    .then((rows) => {
      const mapped: SelectOption[] = [
        { id: "", name: "-- Select --" },
        ...rows.map((row) => {
          const value =
            level === 2
              ? (row as SecondSubLedgerNameOption).subLedger2
              : level === 3
                ? (row as ThirdSubLedgerNameOption).subLedger3
                : (row as FourthSubLedgerNameOption).subLedger4;
          return { id: value, name: value };
        }),
      ];
      dependentSubLedgerCache.set(key, mapped);
      dependentSubLedgerInFlight.delete(key);
      dependentSubLedgerListeners.get(key)?.forEach((listener) => listener());
      return mapped;
    })
    .catch((error) => {
      dependentSubLedgerInFlight.delete(key);
      throw error;
    });

  dependentSubLedgerInFlight.set(key, promise);
  return promise;
}

export const dependentSubLedgerStore = {
  getKey: buildDependentSubLedgerKey,
  getSnapshot(key: DependentSubLedgerKey): SelectOption[] | undefined {
    return dependentSubLedgerCache.get(key);
  },
  subscribe(key: DependentSubLedgerKey, listener: () => void) {
    if (!dependentSubLedgerListeners.has(key)) {
      dependentSubLedgerListeners.set(key, new Set());
    }
    dependentSubLedgerListeners.get(key)!.add(listener);
    return () => dependentSubLedgerListeners.get(key)?.delete(listener);
  },
  fetch: fetchDependentSubLedgers,
};
