// components/layout/sidebar-menu.ts
import type { SvgIconComponent } from "@mui/icons-material";
import {
  AccountBalance as AccountIcon,
  Dashboard as DashboardIcon,
  RequestQuote as LoanIcon,
  Assignment as MasterIcon,
  AccountBalanceWallet as MemberAcIcon,
  CreditCard as MemberIcon,
  PieChart as ShareIcon,
} from "@mui/icons-material";

const DEFAULT_FOLDER_LABEL = "Reports"; // fallback when a route has no folder segment

// ── Data model ──────────────────────────────────────────────────────────
export interface LeafReport {
  label: string;
  route: string;
}
export interface ParentWithReports {
  type: "parent-reports";
  icon: SvgIconComponent;
  label: string;
  reports: LeafReport[];
}
export interface PlainLink {
  type: "link";
  icon: SvgIconComponent;
  label: string;
  route: string;
}
export type MenuNode = PlainLink | ParentWithReports;

export const MENU: MenuNode[] = [
  {
    type: "link",
    icon: DashboardIcon,
    label: "Dashboard",
    route: "/dashboard",
  },
  { type: "link", icon: MasterIcon, label: "Master", route: "/master" },

  {
    type: "parent-reports",
    icon: MemberIcon,
    label: "Member",
    reports: [
      { label: "Member ID Card", route: "/Member/reports/MemberIDCardDetail" },
      {
        label: "Member Registration",
        route: "/Member/reports/MemberRegistrationReport",
      },
      {
        label: "MemberAllDetailsReport",
        route: "/Member/reports/MemberAllDetailsReport",
      },
      {
        label: "MemberDetailSummaryReport",
        route: "/Member/reports/MemberDetailSummaryReport",
      },
      {
        label: "MemberBloodGroupReport",
        route: "/Member/reports/MemberBloodGroupReport",
      },
      {
        label: "MemberBasicDetailReport",
        route: "/Member/reports/MemberBasicDetailReport",
      },
    ],
  },

  {
    type: "parent-reports",
    icon: MemberAcIcon,
    label: "Member A/C",
    reports: [
      // ========== SavingAcWiseReport Section==============
      {
        label: "DepositStatementReport",
        route: "/MemberAc/SavingAcWiseReport/DepositStatementReport",
      },
      {
        label: "SavingAcWiseBalanceReport",
        route: "/MemberAc/SavingAcWiseReport/SavingAcWiseBalanceReport",
      },
      {
        label: "SavingTypeWiseBalanceReport",
        route: "/MemberAc/SavingAcWiseReport/SavingTypeWiseBalance",
      },
      {
        label: "SavingTypeWiseIndividualBalance",
        route: "/MemberAc/SavingAcWiseReport/SavingTypeWiseIndividualBalance",
      },
      {
        label: "SMSCategoryReport",
        route: "/MemberAc/SavingAcWiseReport/SMSCategoryReport",
      },
      {
        label: "DepositeUnverifiedReport",
        route: "/MemberAc/SavingAcWiseReport/DepositeUnverifiedReport",
      },
      {
        label: "MemberAccountDeactiveReport",
        route: "/MemberAc/SavingAcWiseReport/MemberAccountDeactiveReport",
      },
      {
        label: "Active/Inactive Member List Report",
        route: "/MemberAc/SavingAcWiseReport/MemberAccountDetailNoReport",
      },
      {
        label: "DepositWithdrawMaximumAmountRangeReport",
        route:
          "/MemberAc/SavingAcWiseReport/DepositWithdrawMaximumAmountRangeReport",
      },
      {
        label: "MemberPenaltyDepositWithdrawReport",
        route:
          "/MemberAc/SavingAcWiseReport/MemberPenaltyDepositWithdrawReport",
      },
      {
        label: "MemberSummaryReport",
        route: "/MemberAc/SavingAcWiseReport/MemberSummaryReport",
      },
      {
        label: "MemberAccountDetailReport",
        route: "/MemberAc/SavingAcWiseReport/MemberAccountDetailReport",
      },

      //===============Other Reports Section================
      {
        label: "Teller Wise Collection Report",
        route: "/MemberAc/OtherReports/TellerWiseCollectionReport",
      },
      {
        label: "Teller Wise Expense Report",
        route: "/MemberAc/OtherReports/TellerWiseExpenseReport",
      },
      {
        label: "Data Edited Report",
        route: "/MemberAc/OtherReports/DataEditedReport",
      },
      {
        label: "BranchToBranch Collection Report",
        route: "/MemberAc/OtherReports/BranchToBranchCollectionReport",
      },
      {
        label: "BranchToBranch Expense Report",
        route: "/MemberAc/OtherReports/BranchToBranchExpenseReport",
      },
      {
        label: "Saving Transfer Report",
        route: "/MemberAc/OtherReports/SavingTransferReport",
      },
      {
        label: "Loan Payment Through Saving Report",
        route: "/MemberAc/OtherReports/LoanPaymentThroughSavingReport",
      },
      {
        label: "Miscellaneous Income Report",
        route: "/MemberAc/OtherReports/MiscellaneousIncomeReport",
      },
      {
        label: "Deposit/Withdrawal Member Wise Report",
        route: "/MemberAc/OtherReports/SavingDepositAmountMemberReport",
      },
      {
        label: "Depoiste/Widhdrawl Date Wise Report",
        route: "/MemberAc/OtherReports/SavingDepositAmountDateReport",
      },
      {
        label: "Salary Transaction Report",
        route: "/MemberAc/OtherReports/SalaryTransactionReport",
      },
      {
        label: "Saving Account Renewed Report",
        route: "/MemberAc/OtherReports/SavingAccountRenewedReport",
      },
      {
        label: "Saving Account Deleted Report",
        route: "/MemberAc/OtherReports/SavingAccountDeletedReport",
      },
      {
        label: "Saving Issue Report",
        route: "/MemberAc/OtherReports/SavingAccountIssueReport",
      },
      {
        label: "Saving Account Closed Report",
        route: "/MemberAc/OtherReports/SavingAccountClosedReport",
      },
      {
        label: "Cheque Clearance Report",
        route: "/MemberAc/OtherReports/ChequeClearanceReport",
      },
      {
        label: "Saving Interest Log Report",
        route: "/MemberAc/OtherReports/SavingInterestLogReport",
      },

      //===============Interest Expense Reports Section================

      {
        label: "Fixed Deposit Interest Transfer Report",
        route:
          "/MemberAc/InterestExpenseReport/FixedDepositInterestTransferReport",
      },
      {
        label: "Interest & Tax Type Wise Report",
        route: "/MemberAc/InterestExpenseReport/InterestAndTaxTypeWiseReport",
      },
      {
        label: "Interest & Tax Detail Report",
        route: "/MemberAc/InterestExpenseReport/InterestAndTaxDetailReport",
      },
      {
        label: "Interest & Tax Posted Report",
        route: "/MemberAc/InterestExpenseReport/InterestAndTaxPostedReport",
      },
      {
        label: "Saving Interest Transfer Payable Report",
        route:
          "/MemberAc/InterestExpenseReport/PayableInterestTransferredReport",
      },

      //===============Interest Payable Reports Section================
      {
        label: "Saving Interest Payable Report",
        route: "/MemberAc/InterestPayableReport/SavingInterestPayableReport",
      },
      {
        label: "Saving Account Maturity Report",
        route: "/MemberAc/InterestPayableReport/SavingAccountMaturityReport",
      },
      {
        label: "Saving Account Next Interest Transfer Report",
        route:
          "/MemberAc/InterestPayableReport/SavingsAccountNextInterestTransferReport",
      },
      {
        label: "PayableTransactionTransfer Report",
        route:
          "/MemberAc/InterestPayableReport/PayableTransactionTransferReport",
      },
      {
        label: "FixedDepositCertificateAndScheduleReport",
        route:
          "/MemberAc/InterestPayableReport/FixedDepositCertificateAndScheduleReport",
      },

      //===============Collector Detail Reports Section================
      {
        label: "CollectorWiseCommission Report",
        route: "/MemberAc/CollectorDetailReport/CollectorWiseCommissionReport",
      },
      {
        label: "CollectorWiseWithdrawl Report",
        route: "/MemberAc/CollectorDetailReport/CollectorWiseWithdrawlReport",
      },
      {
        label: "CollectorWiseAccountCloseReport",
        route:
          "/MemberAc/CollectorDetailReport/CollectorWiseAccountCloseReport",
      },

      {
        label: "CollectorWiseCommissionSummaryReport",
        route:
          "/MemberAc/CollectorDetailReport/CollectorWiseCommissionSummaryReport",
      },
      {
        label: "CollectorWiseVisitReport",
        route: "/MemberAc/CollectorDetailReport/CollectorWiseVisitReport",
      },

      //===============Cheque Book Reports Section================

      {
        label: "ChequeBookIssueReport",
        route: "/MemberAc/ChequeBookReport/ChequeBookIssueReport",
      },
      {
        label: "ChequeBookLostReport",
        route: "/MemberAc/ChequeBookReport/ChequeBookLostReport",
      },
      {
        label: "ChequeBookWithdrawalReport",
        route: "/MemberAc/ChequeBookReport/ChequeBookWithdrawalReport",
      },
    ],
  },

  {
    type: "parent-reports",
    icon: AccountIcon,
    label: "Account",
    reports: [
      {
        label: "AccountStatementReport",
        route: "/Account/AccountReports/AccountStatementReport",
      },
      {
        label: "BalanceSheetReport",
        route: "/Account/AccountReports/BalanceSheetReport",
      },
      {
        label: "ProfitLossAccountReport",
        route: "/Account/AccountReports/ProfitLossAccountReport",
      },
      {
        label: "SummaryTrailBalanceReport",
        route: "/Account/AccountReports/SummaryTrailBalanceReport",
      },
      {
        label: "CashFlowDetailsReport",
        route: "/Account/AccountReports/CashFlowDetailsReport",
      },
      {
        label: "CostOfFundAnalysis Report",
        route: "/Account/AccountReports/CostOfFundAnalysisReport",
      },
      {
        label: "Cash Day Book Report",
        route: "/Account/AccountReports/CashDayBookReport",
      },
      {
        label: "DetailTrailBalanceReport",
        route: "/Account/AccountReports/DetailTrailBalanceReport",
      },
      {
        label: "MonthlyReport",
        route: "/Account/AccountReports/MonthlyReport",
      },
      {
        label: "RatioAnalysis Report",
        route: "/Account/AccountReports/RatioAnalysisReport",
      },

      //===============Other Reports Section================
      {
        label: "TellerToTellerCashTransferReport",
        route: "/Account/OtherReports/TellerToTellerCashTransferReport",
      },
      {
        label: "PEARLSAnalysisReport",
        route: "/Account/OtherReports/PEARLSAnalysisReport",
      },
      {
        label: "AccountDayOpenAndCloseReport",
        route: "/Account/OtherReports/AccountDayOpenAndCloseReport",
      },
      {
        label: "TellerCashVaultReport",
        route: "/Account/OtherReports/TellerCashVaultReport",
      },
      {
        label: "DayBookLedgerWiseReport",
        route: "/Account/OtherReports/DayBookLedgerWiseReport",
      },
      {
        label: "DayBookVoucherWiseReport",
        route: "/Account/OtherReports/DayBookVoucherWiseReport",
      },
      {
        label: "AccountYearClosingReport",
        route: "/Account/OtherReports/AccountYearClosingReport",
      },
      {
        label: "VoucherDetailReport",
        route: "/Account/OtherReports/VoucherDetailReport",
      },
      {
        label: "DailyIncomeReport",
        route: "/Account/OtherReports/DailyIncomeReport",
      },
      {
        label: "DailyExpenseReport",
        route: "/Account/OtherReports/DailyExpenseReport",
      },
      {
        label: "ReserveMasterReport",
        route: "/Account/OtherReports/ReserveMasterReport",
      },
      {
        label: "Cash And BankBalance Report",
        route: "/Account/OtherReports/CashAndBankBalanceReport",
      },
      {
        label: "Teller Cash Balance Report",
        route: "/Account/OtherReports/TellerCashBalanceReport",
      },
      {
        label: "Teller Cash Detail Report",
        route: "/Account/OtherReports/TellerCashDetailReport",
      },
      {
        label: "Bank Received Payment Report",
        route: "/Account/OtherReports/BankReceivedPaymentReport",
      },

      {
        label: "Payment Through Saving Report",
        route: "/Account/OtherReports/PaymentThroughSavingReport",
      },

      //==========Maini ledger Reports Section================
      {
        label: "Ledger Details Report",
        route: "/Account/MainLedger/LedgerDetailsReport",
      },
      {
        label: "1st Ledger Details Report",
        route: "/Account/MainLedger/1stLedgerDetailsReport",
      },
      {
        label: "2nd Ledger Details Report",
        route: "/Account/MainLedger/2ndLedgerDetailsReport",
      },
      {
        label: "3rd Ledger Details Report",
        route: "/Account/MainLedger/3rdLedgerDetailsReport",
      },
      {
        label: "4th Ledger Details Report",
        route: "/Account/MainLedger/4thLedgerDetailsReport",
      },

      //==============Main Ledger Reports Section================
      {
        label: "IBT Transaction Report",
        route: "/Account/IBTReport/IBTTransactionReport",
      },
      {
        label: "IBT Statement Branchwise",
        route: "/Account/IBTReport/IBTStatementBranchwiseReport",
      },
    ],
  },

  {
    type: "parent-reports",
    icon: LoanIcon,
    label: "Loan",
    reports: [
      {
        label: "Loan Follow Up Report",
        route: "/Loan/OtherReports/LoanFollowUpReport",
      },
      {
        label: "Loan Penalty Discount Report",
        route: "/Loan/OtherReports/LoanPenaltyDiscountReport",
      },
      {
        label: "Loan Defaulter Due Summary Report",
        route: "/Loan/OtherReports/LoanDefaulterDueSummaryReport",
      },
      {
        label: "Loan Due Installment Report",
        route: "/Loan/OtherReports/LoanDueInstallmentReport",
      },
      {
        label: "Miscellaneous Income Report",
        route: "/Loan/OtherReports/MiscellaneousIncomeReport",
      },
      {
        label: "Matured Loan Report",
        route: "/Loan/OtherReports/MaturedLoanReport",
      },
      {
        label: "Loan Account Closed Report",
        route: "/Loan/OtherReports/LoanAccountClosedReport",
      },
      {
        label: "Loan Summary Report",
        route: "/Loan/OtherReports/LoanSummaryReport",
      },
      {
        label: "Loan ReSchedule Report",
        route: "/Loan/OtherReports/LoanReScheduleReport",
      },
      {
        label: "Loan Payment Report",
        route: "/Loan/OtherReports/LoanPaymentReport",
      },
      {
        label: "Loan Appraisal Report",
        route: "/Loan/OtherReports/LoanAppraisalReport",
      },
      {
        label: "Loan Guaranteer Report",
        route: "/Loan/OtherReports/LoanGuaranteerReport",
      },
      {
        label: "Loan Commission Report",
        route: "/Loan/OtherReports/LoanCommissionReport",
      },
      {
        label: "Loan Interest Receivable Year Report",
        route: "/Loan/OtherReports/LoanInterestReceivableYear",
      },
      {
        label: "Loan Interest Receivable Monthly Report",
        route: "/Loan/OtherReports/LoanInterestReceivableMonthly",
      },
      {
        label: "Loan Interest DiscountReport Report",
        route: "/Loan/OtherReports/LoanInterestDiscountReport",
      },
      {
        label: "Loan Repayment Report",
        route: "/Loan/OtherReports/LoanRepaymentReport",
      },
    ],
  },

  //============sahare section================

  {
    type: "parent-reports",
    icon: ShareIcon,
    label: "Share",
    reports: [
      {
        label: "SharePurchaseReport",
        route: "/Share/SharePurchaseReport",
      },
      {
        label: "Share Holding Report",
        route: "/Share/ShareHoldingReport",
      },
      {
        label: "Share Transfer Report",
        route: "/Share/ShareTransferReport",
      },
      {
        label: "Share eDividend Report",
        route: "/Share/ShareDividendReport",
      },
      {
        label: "Share Return Report",
        route: "/Share/ShareReturnReport",
      },
      {
        label: "Share Statement Reports",
        route: "/Share/ShareStatementReports",
      },
      {
        label: "Copomis Report",
        route: "/Share/CopomisReport",
      },
      {
        label: "ShareDividend/PatronizeTransferredReport",
        route: "/Share/ShareDividendAndPatronizeTransferredReport",
      },
    ],
  },
];

// ── Dynamic folder derivation ────────────────────────────────────────────

export function getFolderSegment(route: string): string {
  const segments = route.split("/").filter(Boolean);
  if (segments.length < 3) return DEFAULT_FOLDER_LABEL;
  const folder = segments[segments.length - 2];
  if (!folder) return DEFAULT_FOLDER_LABEL;
  return folder.charAt(0).toUpperCase() + folder.slice(1);
}

export interface FolderGroup {
  folder: string;
  key: string; // `${parentLabel}::${folder}`
  reports: LeafReport[];
}
export interface ParentItem extends Omit<ParentWithReports, "reports"> {
  folders: FolderGroup[];
}
export type MenuItem = PlainLink | ParentItem;

export const MENU_TREE: MenuItem[] = MENU.map((node): MenuItem => {
  if (node.type === "link") return node;

  const order: string[] = [];
  const groups = new Map<string, LeafReport[]>();
  for (const report of node.reports) {
    const folder = getFolderSegment(report.route);
    if (!groups.has(folder)) {
      groups.set(folder, []);
      order.push(folder);
    }
    groups.get(folder)!.push(report);
  }

  return {
    type: "parent-reports",
    icon: node.icon,
    label: node.label,
    folders: order.map((folder) => ({
      folder,
      key: `${node.label}::${folder}`,
      reports: groups.get(folder)!,
    })),
  };
});

export const NO_FOLDERS: Readonly<Record<string, boolean>> = Object.freeze({});
