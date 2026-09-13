import { apiClient } from "../apiClient";

interface LedgerNameRequest {
  fromDate?: string | null;
  toDate?: string | null;
  branchId?: string | null;
  accountTypeId?: number;
}

interface SubLedgerNameRequest extends LedgerNameRequest {
  mainLedger?: string | null;
}

interface DependentSubLedgerRequest extends LedgerNameRequest {
  parentLedger?: string | null;
}

export interface LedgerHeadOption {
  acoAccountTypeId: number;
  accountType: string;
}

export interface LedgerNameOption {
  mainLedger: string;
}

export interface SubLedgerNameOption {
  subLedger1: string;
}

export interface SecondSubLedgerNameOption {
  subLedger2: string;
}

export interface ThirdSubLedgerNameOption {
  subLedger3: string;
}

export interface FourthSubLedgerNameOption {
  subLedger4: string;
}

const ledgerLookupService = {
  getLedgerHeads: async (): Promise<LedgerHeadOption[]> => {
    const response = await apiClient.api.ledgerLookupLedgerHeadList();
    const raw = response.data as unknown as { data?: any[] };
    return (raw?.data ?? []).map((row) => ({
      acoAccountTypeId: row.acoAccountTypeId ?? row.AcoAccountTypeId ?? 0,
      accountType: row.accountType ?? row.AccountType ?? "",
    }));
  },

  getLedgerNames: async (
    request: LedgerNameRequest,
  ): Promise<LedgerNameOption[]> => {
    const response = await apiClient.api.ledgerLookupLedgerNameList({
      FromDate: request.fromDate ?? undefined,
      ToDate: request.toDate ?? undefined,
      BranchId: request.branchId ?? undefined,
      AccountTypeId: request.accountTypeId,
    });
    const raw = response.data as unknown as { data?: any[] };
    return (raw?.data ?? [])
      .map((row) => ({
        mainLedger: row.mainLedger ?? row.MainLedger ?? "",
      }))
      .filter((row) => Boolean(row.mainLedger));
  },

  getSubLedgerNames: async (
    request: SubLedgerNameRequest,
  ): Promise<SubLedgerNameOption[]> => {
    const response = await apiClient.api.ledgerLookupSubLedgerNameList({
      FromDate: request.fromDate ?? undefined,
      ToDate: request.toDate ?? undefined,
      BranchId: request.branchId ?? undefined,
      AccountTypeId: request.accountTypeId,
      MainLedger: request.mainLedger ?? undefined,
    });
    const raw = response.data as unknown as { data?: any[] };
    return (raw?.data ?? [])
      .map((row) => ({
        subLedger1: row.subLedger1 ?? row.SubLedger1 ?? "",
      }))
      .filter((row) => Boolean(row.subLedger1));
  },

  getSecondSubLedgerNames: async (
    request: DependentSubLedgerRequest,
  ): Promise<SecondSubLedgerNameOption[]> => {
    const response = await apiClient.api.ledgerLookupSecondSubLedgerNameList({
      FromDate: request.fromDate ?? undefined,
      ToDate: request.toDate ?? undefined,
      BranchId: request.branchId ?? undefined,
      AccountTypeId: request.accountTypeId,
      SubLedger1: request.parentLedger ?? undefined,
    });
    const raw = response.data as unknown as { data?: any[] };
    return (raw?.data ?? [])
      .map((row) => ({
        subLedger2: row.subLedger2 ?? row.SubLedger2 ?? "",
      }))
      .filter((row) => Boolean(row.subLedger2));
  },

  getThirdSubLedgerNames: async (
    request: DependentSubLedgerRequest,
  ): Promise<ThirdSubLedgerNameOption[]> => {
    const response = await apiClient.api.ledgerLookupThirdSubLedgerNameList({
      FromDate: request.fromDate ?? undefined,
      ToDate: request.toDate ?? undefined,
      BranchId: request.branchId ?? undefined,
      AccountTypeId: request.accountTypeId,
      SubLedger2: request.parentLedger ?? undefined,
    });
    const raw = response.data as unknown as { data?: any[] };
    return (raw?.data ?? [])
      .map((row) => ({
        subLedger3: row.subLedger3 ?? row.SubLedger3 ?? "",
      }))
      .filter((row) => Boolean(row.subLedger3));
  },

  getFourthSubLedgerNames: async (
    request: DependentSubLedgerRequest,
  ): Promise<FourthSubLedgerNameOption[]> => {
    const response = await apiClient.api.ledgerLookupFourthSubLedgerNameList({
      FromDate: request.fromDate ?? undefined,
      ToDate: request.toDate ?? undefined,
      BranchId: request.branchId ?? undefined,
      AccountTypeId: request.accountTypeId,
      SubLedger3: request.parentLedger ?? undefined,
    });
    const raw = response.data as unknown as { data?: any[] };
    return (raw?.data ?? [])
      .map((row) => ({
        subLedger4: row.subLedger4 ?? row.SubLedger4 ?? "",
      }))
      .filter((row) => Boolean(row.subLedger4));
  },
};

export default ledgerLookupService;
