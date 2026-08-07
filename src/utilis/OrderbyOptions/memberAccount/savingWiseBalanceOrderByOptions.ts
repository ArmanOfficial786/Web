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

export const savingTypeWiseBalanceOrderByOptions = defineOrderByOptions([
  { key: "savingType", label: "Saving Type" },
  { key: "deposit", label: "Deposit" },
  { key: "withdrawl", label: "Withdrawal" },
  { key: "balance", label: "Withdrawal" },
] as const);

export const smsCategoryOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member ID" },
  { key: "memberName", label: "Member Name" },
  { key: "accountNo", label: "Account No" },
  { key: "accountOpenDate", label: "Account Open Date" },
  { key: "smsCriteria", label: "SMS Criteria" },
] as const);

export const depositUnverifiedOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member ID" },
  { key: "memberName", label: "Member Name" },
  { key: "accountNo", label: "Account No" },
  { key: "accountOpenDate", label: "Account Open Date" },
  { key: "accountType", label: "Account Type" },
  { key: "collector", label: "Collector" },
  { key: "verifiedTill", label: "Verified Till" },
  { key: "verifiedDate", label: "Verified Date" },
  { key: "verifiedBy", label: "Verified By" },
] as const);

export const memberAccountDeactiveOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member ID" },
  { key: "memberName", label: "Member Name" },
  { key: "accountNo", label: "Account No" },
  { key: "age", label: "Age" },
  { key: "accountType", label: "Account Type" },
  { key: "lastDate", label: "Last Date" },
] as const);

// ── Type for report keys and their options ──────────────────────────────
export type SavingWiseBalanceOrderByReportKey =
  | "saving-wise-balance-report"
  | "saving-type-wise-balance-report"
  | "sms-category-report"
  | "deposit-unverified-report"
  | "member-account-deactive-report";

export const savingWiseBalanceOrderByOptionsMap: Record<
  SavingWiseBalanceOrderByReportKey,
  readonly OrderByOption[]
> = {
  "saving-wise-balance-report": savingWiseBalanceOrderByOptions,
  "saving-type-wise-balance-report": savingTypeWiseBalanceOrderByOptions,
  "sms-category-report": smsCategoryOrderByOptions,
  "deposit-unverified-report": depositUnverifiedOrderByOptions,
  "member-account-deactive-report": memberAccountDeactiveOrderByOptions,
};
