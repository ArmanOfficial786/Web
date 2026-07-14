import { defineOrderByOptions } from "../DefineOrderByOptions";
import type { OrderByOption } from "../DefineOrderByOptions";

// ── Report: member-all-details ──────────────────────────────────────────
export const accountStatementOrderByOptions = defineOrderByOptions([
  { key: "ledgername", label: "Ledger Name" },
  { key: "debitamount", label: "Debit Amount" },
  { key: "creditamount", label: "Credit Amount" },
  { key: "balance", label: "Balance" },
] as const);

export const plAccountOrderByOptions = defineOrderByOptions([
  { key: "ledgername", label: "Ledger Name" },
  { key: "balance", label: "Balance" },
] as const);

export const summaryTrailBalanceOrderByOptions = defineOrderByOptions([
  { key: "ledgername", label: "Ledger Name" },
  { key: "debitamount", label: "Debit Amount" },
  { key: "creditamount", label: "Credit Amount" },
  { key: "balance", label: "Balance" },
] as const);

export const costOfFundOrderByOptions = defineOrderByOptions([
  { key: "typeName", label: "Type Name" },
  { key: "noofAccount", label: "No of Accounts" },
  { key: "averageIntRate", label: "Average Interest Rate" },
  { key: "balance", label: "Balance" },
  { key: "wacc", label: "Weighted Average Cost of Capital" },
] as const);

export const cashFlowOrderByOptions = defineOrderByOptions([
  { key: "voucherDate", label: "Voucher Date" },
  { key: "voucherNo", label: "Voucher No" },
  { key: "narration", label: "Narration" },
  { key: "amount", label: "Amount" },
] as const);

export const detailTrailBalanceOrderByOptions = defineOrderByOptions([
  { key: "subledger", label: "Subledger" },
  { key: "debitamount", label: "Debit Amount" },
  { key: "creditamount", label: "Credit Amount" },
  { key: "balance", label: "Balance" },
] as const);

// ── Type for report keys and their options ──────────────────────────────
export type AccountOrderByReportKey =
  | "account-statement-report"
  | "pl-account-report"
  | "summary-trail-balance-report"
  | "cost-of-fund-report"
  | "cash-flow-report"
  | "detail-trail-balance-report";

export const accountOrderByOptionsMap: Record<
  AccountOrderByReportKey,
  readonly OrderByOption[]
> = {
  "account-statement-report": accountStatementOrderByOptions,
  "pl-account-report": plAccountOrderByOptions,
  "summary-trail-balance-report": summaryTrailBalanceOrderByOptions,
  "cost-of-fund-report": costOfFundOrderByOptions,
  "cash-flow-report": cashFlowOrderByOptions,
  "detail-trail-balance-report": detailTrailBalanceOrderByOptions,
};
