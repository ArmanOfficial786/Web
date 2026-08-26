// components/layout/sidebar-menu.ts
import {
  Dashboard as DashboardIcon,
  Assignment as MasterIcon,
  CreditCard as MemberIcon,
  AccountBalanceWallet as MemberAcIcon,
  AccountBalance as AccountIcon,
  RequestQuote as LoanIcon,
  PieChart as ShareIcon,
} from "@mui/icons-material";
import type { SvgIconComponent } from "@mui/icons-material";

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
    ],
  },

  { type: "link", icon: LoanIcon, label: "Loan", route: "/loan" },
  { type: "link", icon: ShareIcon, label: "Share", route: "/share" },
];

// ── Dynamic folder derivation ────────────────────────────────────────────
// A report route is expected to look like: /<Parent>/<Folder>/<ReportName>
// The "folder" segment is derived directly from the route itself — never
// hardcoded — so adding a brand-new sub-folder under any parent (e.g.
// "/MemberAc/LoanAcWiseReport/...") is picked up automatically by both
// ParentWithReportsItem's grouping and the Navbar's breadcrumb without
// touching this file's MENU data.
export function getFolderSegment(route: string): string {
  const segments = route.split("/").filter(Boolean);
  // Need at least 3 segments (Parent / Folder / Report) to have a folder.
  if (segments.length < 3) return DEFAULT_FOLDER_LABEL;
  const folder = segments[segments.length - 2];
  if (!folder) return DEFAULT_FOLDER_LABEL;
  // Capitalize only the first letter so "reports" → "Reports" while an
  // already-PascalCase folder like "SavingAcWiseReport" stays untouched.
  return folder.charAt(0).toUpperCase() + folder.slice(1);
}
