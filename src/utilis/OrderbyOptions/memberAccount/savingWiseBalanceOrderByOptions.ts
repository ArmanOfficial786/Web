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

export const tellerWiseCollectionOrderByOptions = defineOrderByOptions([
  { key: "accountNo", label: "Account No" },
  { key: "billNo", label: "Bill No" },
  { key: "savingsWidthrawl", label: "Savings Withdrawl" },
  { key: "shareReturn", label: "Share Return" },
  { key: "loanIssue", label: "Loan Issue" },
  { key: "misscellaneousAtm", label: "Miscellaneous ATM" },
] as const);

export const dataEditedOrderByOptions = defineOrderByOptions([
  { key: "accountNo", label: "Account No" },
  { key: "memberId", label: "Member Id" },
  { key: "description", label: "Description" },
  { key: "actualAmount", label: "Actual Amount" },
  { key: "editedDate", label: "Edited Date" },
  { key: "editedBy", label: "Edited By" },
] as const);

export const branchToBranchCollectionOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "member Name" },
  { key: "accountNo", label: "Account No" },
  { key: "Amount", label: "Amount" },
] as const);

export const savingTransferOrderByOptions = defineOrderByOptions([
  { key: "accountNo", label: "Account No" },
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "member Name" },
  { key: "type", label: "Type" },
  { key: "Amount", label: "Amount" },
  { key: "Date", label: "Date" },
  { key: "operator", label: "Operator" },
] as const);

export const miscellaneousIncomeOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "member Name" },
  { key: "particulars", label: "Particulars" },
  { key: "Amount", label: "Amount" },
  { key: "Date", label: "Date" },
] as const);

export const savingDepositAmountMemberOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "member Name" },
  { key: "accountNo", label: "Account No" },
  { key: "Amount", label: "Amount" },
  { key: "Date", label: "Date" },
] as const);

export const savingDepositAmountDateOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "member Name" },
  { key: "accountNo", label: "Account No" },
  { key: "Amount", label: "Amount" },
] as const);

export const salaryTransactionOrderByOptions = defineOrderByOptions([
  { key: "staffname", label: "Staff Name" },
  { key: "accountNo", label: "Account No" },
  { key: "salaryAmount", label: "Salary Amount" },
  { key: "overtimeSalary", label: "Overtime Salary" },
  { key: "tdsAmount", label: "Tds Amount" },
  { key: "allowanceAmount", label: "Allowance Amount" },
  { key: "providentFundFromOffice", label: "Provident Fund From Office" },
  { key: "providentFundFromSalary", label: "Provident Fund From Salary" },
  { key: "leaveDeduction", label: "Leave Deduction" },
  { key: "advanceDeduction", label: "Advance Deduction" },
  { key: "netAmount", label: "Net Amount" },
] as const);

export const savingAccountRewenedOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "member Name" },
  { key: "accountNo", label: "Account No" },
  { key: "a/cOpenedDate", label: "A/C Opened Date" },
  { key: "a/cRenewedDate", label: "A/C Rewened Date" },
] as const);

export const savingAccountDeletedOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "member Name" },
  { key: "accountNo", label: "Account No" },
  { key: "a/cOpenedDate", label: "A/C Opened Date" },
] as const);

export const savingIssueOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "member Name" },
  { key: "accountNo", label: "Account No" },
  { key: "a/cOpenedDate", label: "A/C Opened Date" },
  { key: "interestRate", label: "Interest Rate" },
  { key: "smsCategory", label: "SMS Category" },
] as const);

export const savingAccountClosedOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "member Name" },
  { key: "accountNo", label: "Account No" },
  { key: "a/cOpenedDate", label: "A/C Opened Date" },
  { key: "closeAmount", label: "Close Amount" },
] as const);

// ── Interest Expense Reports ──────────────────────────────────────────

export const fixedDepositInterestTransferOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "member Name" },
  { key: "accountNo", label: "Account No" },
  { key: "interestDate", label: "Interest Date" },
  { key: "interest", label: "Interest" },
  { key: "tax", label: "Tax" },
  { key: "remarks", label: "Remarks" },
] as const);

export const interestAndTaxTypeWiseOrderByOptions = defineOrderByOptions([
  { key: "date", label: "Date" },
  { key: "interest", label: "Interest" },
  { key: "tax", label: "Tax" },
  { key: "percentTax", label: "Percent Tax" },
] as const);

export const interestAndTaxDetailOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "member Name" },
  { key: "accountNo", label: "Account No" },
  { key: "particulars", label: "Particulars" },
  { key: "interest", label: "Interest" },
  { key: "tax", label: "Tax" },
  { key: "date", label: "Date" },
] as const);

export const interestAndTaxPostedOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "member Name" },
  { key: "accountNo", label: "Account No" },
  { key: "interestDate", label: "Interest Date" },
  { key: "interestRate", label: "Interest Rate" },
  { key: "interest", label: "Interest" },
  { key: "tax", label: "Tax" },
  { key: "netBalance", label: "Net Balance" },
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
  | "member-account-detail-report"
  | "teller-wise-collection-report"
  | "branch-to-branch-collection-report"
  | "data-edited-report"
  | "saving-transfer-report"
  | "miscellaneous-income-report"
  | "saving-deposit-member-wise-report"
  | "saving-deposit-date-wise-report"
  | "salary-transfer-report"
  | "saving-account-renewed-report"
  | "saving-account-deleted-report"
  | "saving-issue-report"
  | "saving-account-closed-report"
  | "fixed-deposit-interest-transfer-report"
  | "interest-and-tax-type-wise-report"
  | "interest-and-tax-detail-report"
  | "interest-and-tax-posted-report";

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
  "teller-wise-collection-report": tellerWiseCollectionOrderByOptions,
  "branch-to-branch-collection-report": branchToBranchCollectionOrderByOptions,
  "data-edited-report": dataEditedOrderByOptions,
  "saving-transfer-report": savingTransferOrderByOptions,
  "miscellaneous-income-report": miscellaneousIncomeOrderByOptions,
  "saving-deposit-member-wise-report": savingDepositAmountMemberOrderByOptions,
  "saving-deposit-date-wise-report": savingDepositAmountDateOrderByOptions,
  "salary-transfer-report": salaryTransactionOrderByOptions,
  "saving-account-renewed-report": savingAccountRewenedOrderByOptions,
  "saving-account-deleted-report": savingAccountDeletedOrderByOptions,
  "saving-issue-report": savingIssueOrderByOptions,
  "saving-account-closed-report": savingAccountClosedOrderByOptions,
  "fixed-deposit-interest-transfer-report":
    fixedDepositInterestTransferOrderByOptions,
  "interest-and-tax-type-wise-report": interestAndTaxTypeWiseOrderByOptions,
  "interest-and-tax-detail-report": interestAndTaxDetailOrderByOptions,
  "interest-and-tax-posted-report": interestAndTaxPostedOrderByOptions,
};
