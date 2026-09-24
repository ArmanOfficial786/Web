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

//==========loan account wise=============

export const loanDeletedOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "fullName", label: "Full Name" },
  { key: "type", label: "Type" },
  { key: "accountNo", label: "Account Number" },
  { key: "interestRate", label: "Interest Rate" },
  { key: "issueAmount", label: "Issue Amount" },
  { key: "issueDate", label: "Issue Date" },
  { key: "period", label: "Period" },
  { key: "modifyDate", label: "Modify Date" },
] as const);

export const loanVerifiedUnverifiedOrderByOptions = defineOrderByOptions([
  { key: "transactionDate", label: "Transaction Date" },
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "loanType", label: "Loan Type" },
  { key: "loanAccountNo", label: "Loan Account Number" },
  { key: "amount", label: "Amount" },
] as const);

export const loanPrincipalPaymentOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "loanTypeName", label: "Loan Type Name" },
  { key: "accountNo", label: "Account Number" },
  { key: "paidamount", label: "Paid Amount" },
  { key: "date", label: "Date" },
] as const);

export const principalInterestFinePaymentOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "loanTypeName", label: "Loan Type Name" },
  { key: "accountNo", label: "Account Number" },
  { key: "fineAmount", label: "Fine Amount" },
  { key: "interestAmount", label: "Interes Amount" },
  { key: "principalAmount", label: "Principal Amount" },
  { key: "date", label: "Date" },
] as const);

export const loanStatementVerificationOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "accountNo", label: "Account Number" },
  { key: "verifiedTill", label: "Verified Till" },
  { key: "verifiedDate", label: "Verified Date" },
  { key: "verifiedBy", label: "Verified By" },
] as const);

//===========loan analysis==============

export const loanAgingRiskCalculationReportOrderByOptions =
  defineOrderByOptions([
    { key: "memberId", label: "Member Id" },
    { key: "memberName", label: "Member Name" },
    { key: "loanAccountNo", label: "Loan Account Number" },
    { key: "disburseAmount", label: "Disburse Amount" },
    { key: "outStandingAmt", label: "OutStanding Amt" },
    { key: "noOfDays", label: "No Of Days" },
  ] as const);

export const loanAgingArrealCalculationReportOrderByOptions =
  defineOrderByOptions([
    { key: "memberId", label: "Member Id" },
    { key: "memberName", label: "Member Name" },
    { key: "disburseAmount", label: "Disburse Amount" },
    { key: "balanceAmount", label: "Balance Amount" },
    { key: "loanAccountNo", label: "Loan Account No" },
    { key: "noOfDays", label: "No Of Days" },
  ] as const);

export const loanDetailPrincipalOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "loanType", label: "Loan Type" },
  { key: "loanAccount", label: "Loan A/C No. " },
] as const);

export const loanTypeWiseReportOrderByOptions = defineOrderByOptions([
  { key: "loanType", label: "Loan Type" },
  { key: "disburseAmount", label: "Disburse Amount" },
] as const);

export const loanAgeingReportOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "loanAccount", label: "Loan A/C No. " },
  { key: "disburseAmount", label: "Disburse Amount" },
] as const);

export const loanAgingTypeWiseReportOrderByOptions = defineOrderByOptions([
  { key: "loanType", label: "Loan Type" },
  { key: "disburseAmount", label: "Disburse Amount" },
  { key: "rapidAmount", label: "Rapid Amount" },
  { key: "overDueAmount", label: "OverDue Amount" },
] as const);

export const loanRegisterReportOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "type", label: "Type" },
  { key: "issueAmount", label: "Issue Amount" },
  { key: "issueDate", label: "Issue Date" },
  { key: "interestRate", label: "Interest Rate" },
  { key: "paymentCode", label: "Payment Code" },
] as const);

export const collectorWiseLoanAnalysisReportOrderByOptions =
  defineOrderByOptions([
    { key: "loanType", label: "Loan Type" },
    { key: "disburseAmount", label: "Disburse Amount" },
    { key: "balanceAmount", label: "Balance Amount" },
    { key: "goodAmount", label: "Good Amount" },
  ] as const);

export const loanCICReportOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "loanType", label: "Loan Type" },
  { key: "goodAmount", label: "Good Amount" },
] as const);

export const loanAllDetailsOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "loanTypeName", label: "Loan Type Name" },
  { key: "accountNo", label: "Account Number" },
  { key: "issueamount", label: "Issue Amount" },
  { key: "issueDate", label: "Issue Date" },
  { key: "interestRate", label: "Interest Rate" },
  { key: "paymentTypeCode", label: "Payment Type Code" },
  { key: "maturityDate", label: "Maturity Date" },
  { key: "totalBalance", label: "Total Balance" },
] as const);

//==================================
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
  | "loan-interest-discount-report"
  | "loan-deleted-report"
  | "loan-verified-unverified-report"
  | "loan-principal-payment-report"
  | "loan-principal-interest-fine-payment-report"
  | "loan-statement-verification-report"
  | "loan-aging-risk-calculation-report"
  | "loan-ageing-arrear-calculation-report"
  | "loan-detail-principal-report"
  | "loan-type-wise-report"
  | "loan-ageing-report"
  | "loan-ageing-type-wise-report"
  | "loan-register-report"
  | "collector-wise-loan-analysis-report"
  | "loan-cic-report"
  | "loan-all-details-report";

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
  "loan-deleted-report": loanDeletedOrderByOptions,
  "loan-verified-unverified-report": loanVerifiedUnverifiedOrderByOptions,
  "loan-principal-payment-report": loanPrincipalPaymentOrderByOptions,
  "loan-principal-interest-fine-payment-report":
    principalInterestFinePaymentOrderByOptions,
  "loan-statement-verification-report": loanStatementVerificationOrderByOptions,
  "loan-aging-risk-calculation-report":
    loanAgingRiskCalculationReportOrderByOptions,
  "loan-ageing-arrear-calculation-report":
    loanAgingArrealCalculationReportOrderByOptions,
  "loan-detail-principal-report": loanDetailPrincipalOrderByOptions,
  "loan-type-wise-report": loanTypeWiseReportOrderByOptions,
  "loan-ageing-report": loanAgeingReportOrderByOptions,
  "loan-ageing-type-wise-report": loanAgingTypeWiseReportOrderByOptions,
  "loan-register-report": loanRegisterReportOrderByOptions,
  "collector-wise-loan-analysis-report":
    collectorWiseLoanAnalysisReportOrderByOptions,
  "loan-cic-report": loanCICReportOrderByOptions,
  "loan-all-details-report": loanAllDetailsOrderByOptions,
};
