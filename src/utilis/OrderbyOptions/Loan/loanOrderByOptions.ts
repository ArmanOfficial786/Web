import type { OrderByOption } from "../DefineOrderByOptions";
import { defineOrderByOptions } from "../DefineOrderByOptions";

export const loanFollowUpOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "accountNo", label: "Account Number" },
  { key: "followUpPerson", label: "Follow Up Person" },
  { key: "followUpDate", label: "Follow Up Date" },
  { key: "followUpBy", label: "Follow Up By" },
] as const);

export const loanPenaltyDiscountOrderByOptions = defineOrderByOptions([
  { key: "transactionDate", label: "Transaction Date" },
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "loanType", label: "Loan Type" },
  { key: "loanAccountNo", label: "Loan Account Number" },
  { key: "amount", label: "Amount" },
] as const);

export const loanDefaultersOrderByOptions = defineOrderByOptions([
  { key: "transactionDate", label: "Transaction Date" },
  { key: "memberId", label: "Member Id" },
  { key: "fullName", label: "Full Name" },
  { key: "accountNo", label: "Account Number" },
  { key: "type", label: "Type" },
  { key: "date", label: "Date" },
  { key: "principalAmount", label: "Principal Amount" },
  { key: "interestAmount", label: "Interest Amount" },
  { key: "installmentAmount", label: "Installment Amount" },
] as const);

export const maturedLoanOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "maturityDate", label: "Maturity Date" },
  { key: "accountNo", label: "Account Number" },
  { key: "disburseAmount", label: "Disbursement Amount" },
  { key: "dueBalance", label: "Due Balance" },
] as const);

export const loanAccountClosedOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "accountNo", label: "Account Number" },
  { key: "loanType", label: "Loan Type" },
  { key: "loanCloseDate", label: "Loan Close Date" },
] as const);

export const loanSummaryOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "fullName", label: "Full Name" },
  { key: "loanAccountNo", label: "Loan Account Number" },
  { key: "loanTypeName", label: "Loan Type Name" },
  { key: "loanIssueAmount", label: "Loan Issue Amount" },
  { key: "loanIssueDate", label: "Loan Issue Date" },
  { key: "period", label: "Period" },
  { key: "interestRate", label: "Interest Rate" },
] as const);

export const loanRescheduleOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "fullName", label: "Full Name" },
  { key: "AccountNo", label: "Account Number" },
  { key: "loanType", label: "Loan Type" },
  { key: "loanIssueDate", label: "Loan Issue Date" },
  { key: "loanIssueAmount", label: "Loan Issue Amount" },
  { key: "interestRate", label: "Interest Rate" },
  { key: "duration", label: "Duration" },
] as const);

export const loanPaymentOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "AccountNo", label: "Account Number" },
  { key: "loanType", label: "Loan Type" },
  { key: "loanIssueDate", label: "Loan Issue Date" },
  { key: "loanIssueAmount", label: "Loan Issue Amount" },
  { key: "interestRate", label: "Interest Rate" },
  { key: "period", label: "Period" },
  { key: "amount", label: "Amount" },
] as const);

export const loanGuaranteerOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "loaneeId", label: "Loanee Id" },
  { key: "loaneeFullName", label: "Loanee Full Name" },
  { key: "loaneeAccountNo", label: "Loanee Account Number" },
  { key: "AccountNo", label: "Account Number" },
  { key: "guaranteeAmount", label: "Guarantee Amount" },
  { key: "guranteeShareAmount", label: "Guarantee Share Amount" },
  { key: "guranteeDate", label: "Guarantee Date" },
] as const);

export const loanInterestReceivableYearEndOrderByOptions = defineOrderByOptions(
  [
    { key: "memberId", label: "Member Id" },
    { key: "memberName", label: "Member Name" },
    { key: "AccountNo", label: "Account Number" },
    { key: "interestAmount", label: "Interest Amount" },
  ] as const,
);

export const loanInterestDiscountOrderByOptions = defineOrderByOptions([
  { key: "transactionDate", label: "Transaction Date" },
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "loanType", label: "Loan Type" },
  { key: "loanAccountNo", label: "Loan Account Number" },
  { key: "amount", label: "Amount" },
] as const);

export type LoanOrderByReportKey =
  | "loan-follow-up-report"
  | "loan-penalty-discount-report"
  | "loan-defaulters-report"
  | "matured-loan-report"
  | "loan-account-closed-report"
  | "loan-summary-report"
  | "loan-reschedule-report"
  | "loan-payment-report"
  | "loan-guaranteer-report"
  | "loan-interest-receivable-year-end-report"
  | "loan-interest-discount-report";

export const loanOrderByOptionsMap: Record<
  LoanOrderByReportKey,
  readonly OrderByOption[]
> = {
  "loan-follow-up-report": loanFollowUpOrderByOptions,
  "loan-penalty-discount-report": loanPenaltyDiscountOrderByOptions,
  "loan-defaulters-report": loanDefaultersOrderByOptions,
  "matured-loan-report": maturedLoanOrderByOptions,
  "loan-account-closed-report": loanAccountClosedOrderByOptions,
  "loan-summary-report": loanSummaryOrderByOptions,
  "loan-reschedule-report": loanRescheduleOrderByOptions,
  "loan-payment-report": loanPaymentOrderByOptions,
  "loan-guaranteer-report": loanPaymentOrderByOptions,
  "loan-interest-receivable-year-end-report":
    loanInterestReceivableYearEndOrderByOptions,
  "loan-interest-discount-report": loanInterestDiscountOrderByOptions,
};
