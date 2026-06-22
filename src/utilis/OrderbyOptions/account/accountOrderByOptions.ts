import { defineOrderByOptions } from "../DefineOrderByOptions";
import type { OrderByOption } from "../DefineOrderByOptions";

// ── Report: member-all-details ──────────────────────────────────────────
export const accountStatementOrderByOptions = defineOrderByOptions([
  { key: "ledgername", label: "Ledger Name" },
  { key: "debitamount", label: "Debit Amount" },
  { key: "creditamount", label: "Credit Amount" },
  { key: "balance", label: "Balance" },
] as const);

// ── Type for report keys and their options ──────────────────────────────
export type AccountOrderByReportKey = "account-statement-report";

export const accountOrderByOptionsMap: Record<
  AccountOrderByReportKey,
  readonly OrderByOption[]
> = {
  "account-statement-report": accountStatementOrderByOptions,
};
