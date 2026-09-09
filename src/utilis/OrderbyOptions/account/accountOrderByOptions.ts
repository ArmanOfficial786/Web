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

//==========Other Reports OrderBy Options========================

export const tellerToTellerCashTransferOrderByOptions = defineOrderByOptions([
  { key: "tellerFrom", label: "Teller From" },
  { key: "tellerTo", label: "Teller To" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "issuedBy", label: "Issued By" },
] as const);

export const accountDayOpenCloseOrderByOptions = defineOrderByOptions([
  { key: "openedDate", label: "Opened Date" },
  { key: "openedBy", label: "Opened By" },
  { key: "openedOn", label: "Opened On" },
  { key: "closedBy", label: "Closed By" },
  { key: "closedOn", label: "Closed On" },
  { key: "status", label: "Status" },
] as const);

export const tellerCashVaultOrderByOptions = defineOrderByOptions([
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "issuedBy", label: "Issued By" },
  { key: "returnedBy", label: "Returned By" },
] as const);

export const dayBookLedgerWiseOrderByOptions = defineOrderByOptions([
  { key: "subledger", label: "Subledger" },
  { key: "subledger1", label: "Subledger1" },
  { key: "subledger2", label: "Subledger2" },
  { key: "balance", label: "Balance" },
] as const);

export const dayBookVoucherWiseOrderByOptions = defineOrderByOptions([
  { key: "voucherNo", label: "Voucher No" },
  { key: "narration", label: "Narration" },
  { key: "type", label: "Type" },
  { key: "amount", label: "Amount" },
] as const);

export const accountYearClosingOrderByOptions = defineOrderByOptions([
  { key: "accountYear", label: "Account Year" },
  { key: "closedYear", label: "Closed Year" },
  { key: "voucherNo", label: "Voucher No" },
  { key: "status", label: "Status" },
  { key: "closedBy", label: "Closed By" },
] as const);

export const dailyIncomeOrderByOptions = defineOrderByOptions([
  { key: "subledger", label: "Subledger" },
  { key: "debitAmount", label: "Debit Amount" },
  { key: "creditAmount", label: "Credit Amount" },
  { key: "balance", label: "Balance " },
] as const);

export const reserveMasterOrderByOptions = defineOrderByOptions([
  { key: "title", label: "Title" },
  { key: "Percentage", label: "Percentage" },
  { key: "amount", label: "Amount" },
] as const);

export const voucherDetailOrderByOptions = defineOrderByOptions([
  { key: "mainledger", label: "Main Ledger" },
  { key: "debitAmount", label: "Debit Amount" },
  { key: "creditAmount", label: "Credit Amount" },
] as const);

export const tellerCashBalanceOrderByOptions = defineOrderByOptions([
  { key: "tellerName", label: "Teller Name" },
  { key: "date", label: "Date" },
] as const);

export const tellerCashDetaileOrderByOptions = defineOrderByOptions([
  { key: "tellerName", label: "Teller Name" },
  { key: "date", label: "Date" },
] as const);

export const bankReceivedPaymentOrderByOptions = defineOrderByOptions([
  { key: "transactionDate", label: "Transaction Date" },
  { key: "memberId", label: "Member ID" },
] as const);

// ── Type for report keys and their options ──────────────────────────────
export type AccountOrderByReportKey =
  | "account-statement-report"
  | "pl-account-report"
  | "summary-trail-balance-report"
  | "cost-of-fund-report"
  | "cash-flow-report"
  | "detail-trail-balance-report"
  | "account-day-open-close-report"
  | "teller-to-teller-cash-transfer-report"
  | "teller-cash-vault-report"
  | "day-book-ledger-wise-report"
  | "day-book-voucher-wise-report"
  | "account-year-closing-report"
  | "daily-income-report"
  | "reserve-master-report"
  | "voucher-details-report"
  | "teller-cash-balance-report"
  | "teller-cash-detail-report"
  | "bank-received-payment-report";

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
  "account-day-open-close-report": accountDayOpenCloseOrderByOptions,
  "teller-to-teller-cash-transfer-report":
    tellerToTellerCashTransferOrderByOptions,
  "teller-cash-vault-report": tellerCashVaultOrderByOptions,
  "day-book-ledger-wise-report": dayBookLedgerWiseOrderByOptions,
  "day-book-voucher-wise-report": dayBookVoucherWiseOrderByOptions,
  "account-year-closing-report": accountYearClosingOrderByOptions,
  "daily-income-report": dailyIncomeOrderByOptions,
  "reserve-master-report": reserveMasterOrderByOptions,
  "voucher-details-report": voucherDetailOrderByOptions,
  "teller-cash-balance-report": tellerCashBalanceOrderByOptions,
  "teller-cash-detail-report": tellerCashDetaileOrderByOptions,
  "bank-received-payment-report": bankReceivedPaymentOrderByOptions,
};
