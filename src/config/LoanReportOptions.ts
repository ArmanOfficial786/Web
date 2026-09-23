export const REPORT_TYPE_ALL_DELETED = "ViewAllDeleted";
export const REPORT_TYPE_BETWEEN_DATE = "ViewDeletedBetweenDate";
export const loanDeletedReportTypeOptions = [
  { value: REPORT_TYPE_ALL_DELETED, label: "View All Deleted Report" },
  {
    value: REPORT_TYPE_BETWEEN_DATE,
    label: "View Deleted Report Between Date",
  },
];

export const REPORT_TYPE_LOAN_ISSUE = "LoanIssueReport";
export const REPORT_TYPE_LOAN_ISSUE_RESCHEDULE = "LoanIssueReportReschedule";
export const loanIssueReportTypeOptions = [
  { value: REPORT_TYPE_LOAN_ISSUE, label: "Loan Issue Report" },
  {
    value: REPORT_TYPE_LOAN_ISSUE_RESCHEDULE,
    label: "Loan Issue Report (Reschedule)",
  },
];

export const REPORT_TYPE_LOAN_VERIFIED = "LoanVerified";
export const REPORT_TYPE_LOAN_UNVERIFIED = "LoanUnverified";
export const loanVerifiedReportTypeOptions = [
  { value: REPORT_TYPE_LOAN_VERIFIED, label: "Loan Verified Report" },
  { value: REPORT_TYPE_LOAN_UNVERIFIED, label: "Loan Unverified Report" },
];

export const REPORT_TYPE_SCHEDULE_WISE = "ScheduleWise";
export const REPORT_TYPE_REMAINING_PRINCIPAL = "RemainingPrincipal";
export const REPORT_TYPE_AFTER_MATURITY = "AfterMaturity";
export const loanAnalysisReportTypeOptions = [
  { value: REPORT_TYPE_SCHEDULE_WISE, label: "Schedule Wise" },
  { value: REPORT_TYPE_REMAINING_PRINCIPAL, label: "Remaining Principal" },
  { value: REPORT_TYPE_AFTER_MATURITY, label: "After Maturity" },
];

export const VIEW_TYPE_SUMMARY = "Summary";
export const VIEW_TYPE_DETAIL = "Detail";
export const viewTypeOptions = [
  { value: VIEW_TYPE_SUMMARY, label: "Summary" },
  { value: VIEW_TYPE_DETAIL, label: "Detail" },
];

export const DATE_TYPE_ISSUE_DATE = "IssueDate";
export const DATE_TYPE_CURRENT_RESCHEDULE = "CurrentRescheduleDate";
export const dateTypeOptions = [
  { value: DATE_TYPE_ISSUE_DATE, label: "Issue Date" },
  { value: DATE_TYPE_CURRENT_RESCHEDULE, label: "Current Reschedule Date" },
];

export const AGEING_ON_PRINCIPAL = "Principal";
export const AGEING_ON_PRINCIPAL_INTEREST = "PrincipalInterest";
export const ageingOnOptions = [
  { value: AGEING_ON_PRINCIPAL, label: "Principal" },
  { value: AGEING_ON_PRINCIPAL_INTEREST, label: "Principal + Interest" },
];

export const REPORT_TYPE_DETAIL = "Detail";
export const REPORT_TYPE_SUMMARY = "Summary";
export const detailReportTypeOptions = [
  { value: REPORT_TYPE_DETAIL, label: "Detail" },
  { value: REPORT_TYPE_SUMMARY, label: "Summary" },
];

export const STATUS_OPEN = "Open";
export const STATUS_CLOSE = "Close";
export const STATUS_WITH_BALANCE = "WithBalance";
export const statusOptions = [
  { value: STATUS_OPEN, label: "Open" },
  { value: STATUS_CLOSE, label: "Close" },
  { value: STATUS_WITH_BALANCE, label: "With Balance" },
];

export const REPORT_TYPE_PAYMENT = "Payment";
export const REPORT_TYPE_PAYMENT_SUMMARY = "PaymentSummary";
export const paymentReportTypeOptions = [
  { value: REPORT_TYPE_PAYMENT, label: "Payment" },
  { value: REPORT_TYPE_PAYMENT_SUMMARY, label: "Payment Summary" },
];
export const CASH_TYPE_ALL = "All";
export const CASH_TYPE_ONLY_CASH = "OnlyCash";
export const cashTypeOptions = [
  { value: CASH_TYPE_ALL, label: "All" },
  { value: CASH_TYPE_ONLY_CASH, label: "Only Cash" },
];

export const PROVISION_TYPE_SCHEDULE_WISE = "ScheduleWise";
export const PROVISION_TYPE_REMAINING_PRINCIPAL = "RemainingPrincipal";
export const PROVISION_TYPE_AFTER_MATURITY = "AfterMaturity";
export const provisionTypeOptions = [
  { value: PROVISION_TYPE_SCHEDULE_WISE, label: "Schedule Wise" },
  { value: PROVISION_TYPE_REMAINING_PRINCIPAL, label: "Remaining Principal" },
  { value: PROVISION_TYPE_AFTER_MATURITY, label: "After Maturity" },
];

export const AS_ON_DATE_YES = "Yes";
export const AS_ON_DATE_NO = "No";
export const asNoDateOptions = [
  { value: AS_ON_DATE_YES, label: "As On Date" },
  { value: AS_ON_DATE_NO, label: "Date Range" },
];
export const INTEREST_TYPE_PI = "PI";
export const INTEREST_TYPE_P = "P";
export const INTEREST_TYPE_I = "I";
export const interestTypeOptions = [
  { value: INTEREST_TYPE_PI, label: "P + I" },
  { value: INTEREST_TYPE_P, label: "P" },
  { value: INTEREST_TYPE_I, label: "I" },
];

export const SELECT_LOAN_ALL = "All";
export const SELECT_LOAN_NORMAL = "Normal";
export const SELECT_LOAN_OVER_DRAFT = "OverDraft";
export const selectLoanOptions = [
  { value: SELECT_LOAN_ALL, label: "All" },
  { value: SELECT_LOAN_NORMAL, label: "Normal" },
  { value: SELECT_LOAN_OVER_DRAFT, label: "Over Draft" },
];

export const LOAN_GUARANTEE_ALL = "All";
export const LOAN_GUARANTEE_GROUP = "GroupGuarantee";
export const LOAN_GUARANTEE_COLLATERAL = "Collateral";
export const loanGuaranteeOptions = [
  { value: LOAN_GUARANTEE_ALL, label: "All" },
  { value: LOAN_GUARANTEE_GROUP, label: "Group Guarantee" },
  { value: LOAN_GUARANTEE_COLLATERAL, label: "Collateral" },
];
export const SHARE_TYPE_ALL = "All";
export const SHARE_TYPE_PROMOTER = "Promoter";
export const SHARE_TYPE_SHARE_HOLDER = "ShareHolder";
export const shareTypeOptions = [
  { value: SHARE_TYPE_ALL, label: "All" },
  { value: SHARE_TYPE_PROMOTER, label: "Promoter Share" },
  { value: SHARE_TYPE_SHARE_HOLDER, label: "Share Holder" },
];
