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

export const memberAccountDetailNoOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member ID" },
  { key: "memberName", label: "Member Name" },
  { key: "saving", label: "Saving" },
  { key: "share", label: "Share" },
  { key: "loan", label: "Loan" },
] as const);

export const depositWithdrawMaxAmountRangeOrderByOptions = defineOrderByOptions(
  [
    { key: "memberId", label: "Member ID" },
    { key: "memberName", label: "Member Name" },
    { key: "deposit", label: "Deposit" },
    { key: "withdraw", label: "Withdraw" },
    { key: "account", label: "Account" },
    { key: "date", label: "Date" },
  ] as const,
);

export const memberPenaltyDepositWithdrawOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member ID" },
  { key: "memberName", label: "Member Name" },
  { key: "plenty", label: "Plenty" },
  { key: "deposit", label: "Deposit" },
  { key: "withdraw", label: "Withdraw" },
  { key: "balance", label: "Balance" },
] as const);

export const memberSummaryOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member ID" },
  { key: "memberName", label: "Member Name" },
  { key: "address", label: "Address" },
  { key: "deposit", label: "Deposit" },
  { key: "shareAmount", label: "Share Amount" },
  { key: "normalSaving", label: "Normal Saving" },
  { key: "recurringSaving", label: "Recurring Saving" },
  { key: "fixedSaving", label: "Fixed Saving" },
  { key: "termSaving", label: "Term Saving" },
  { key: "regularSaving", label: "Regular Saving" },
  { key: "totalSaving", label: "Total Saving" },
  { key: "doubleDeposite", label: "Double Deposit" },
  { key: "loanAmount", label: "Loan Amount" },
] as const);

export const memberAccountDetailOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member ID" },
  { key: "memberName", label: "Member Name" },
  { key: "account", label: "Account No" },
  { key: "interest", label: "Interest Rate" },
  { key: "deposit", label: "Deposit" },
  { key: "withdraw", label: "Withdraw" },
  { key: "balance", label: "Balance" },
] as const);

// ── Type for report keys and their options ──────────────────────────────
export type SavingWiseBalanceOrderByReportKey =
  | "saving-wise-balance-report"
  | "saving-type-wise-balance-report"
  | "sms-category-report"
  | "deposit-unverified-report"
  | "member-account-deactive-report"
  | "member-account-detail-no-report"
  | "deposit-withdraw-max-amount-range-report"
  | "member-penalty-deposit-withdraw-report"
  | "member-summary-report"
  | "member-account-detail-report";

export const savingWiseBalanceOrderByOptionsMap: Record<
  SavingWiseBalanceOrderByReportKey,
  readonly OrderByOption[]
> = {
  "saving-wise-balance-report": savingWiseBalanceOrderByOptions,
  "saving-type-wise-balance-report": savingTypeWiseBalanceOrderByOptions,
  "sms-category-report": smsCategoryOrderByOptions,
  "deposit-unverified-report": depositUnverifiedOrderByOptions,
  "member-account-deactive-report": memberAccountDeactiveOrderByOptions,
  "member-account-detail-no-report": memberAccountDetailNoOrderByOptions,
  "deposit-withdraw-max-amount-range-report":
    depositWithdrawMaxAmountRangeOrderByOptions,
  "member-penalty-deposit-withdraw-report":
    memberPenaltyDepositWithdrawOrderByOptions,
  "member-summary-report": memberSummaryOrderByOptions,
  "member-account-detail-report": memberAccountDetailOrderByOptions,
};
