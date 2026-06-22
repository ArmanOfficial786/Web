import { defineOrderByOptions } from "../DefineOrderByOptions";
import type { OrderByOption } from "../DefineOrderByOptions";

// ── Report: member-all-details ──────────────────────────────────────────
export const savingWiseBalanceOrderByOptions = defineOrderByOptions([
  { key: "memberName", label: "Member Name" },
  { key: "memberId", label: "Member ID" },
  { key: "accountNo", label: "Account Number" },
  { key: "interestRate", label: "Interest Rate" },
  { key: "deposit", label: "Deposit" },
  { key: "withdrawl", label: "Withdrawal" },
  { key: "balance", label: "Withdrawal" },
] as const);

// ── Type for report keys and their options ──────────────────────────────
export type SavingWiseBalanceOrderByReportKey = "saving-wise-balance-report";

export const savingWiseBalanceOrderByOptionsMap: Record<
  SavingWiseBalanceOrderByReportKey,
  readonly OrderByOption[]
> = {
  "saving-wise-balance-report": savingWiseBalanceOrderByOptions,
};
