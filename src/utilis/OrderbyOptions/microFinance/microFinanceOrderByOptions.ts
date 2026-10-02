import type { OrderByOption } from "../DefineOrderByOptions";
import { defineOrderByOptions } from "../DefineOrderByOptions";

export const fundWithdrawlOrderByOptions = defineOrderByOptions([
  { key: "receiver", label: "Receiver" },
  { key: "sender", label: "Sender" },
  { key: "paymentAmount", label: "Payment Amount" },
  { key: "commission", label: "Commission" },
  { key: "date", label: "Date" },
  { key: "cashTeller", label: "Cash Teller" },
] as const);

export const groupWiseMemberAccountDetailsOrderByOptions = defineOrderByOptions(
  [
    { key: "memberId", label: "Member ID" },
    { key: "memberName", label: "Member Name" },
    { key: "accountNo", label: "Account Number" },
  ] as const,
);

export type MicroFinanceOrderByReportKey =
  | "fund-withdrawl-report"
  | "group-wise-member-account-details";

export const microFinanceOrderByOptionsMap: Record<
  MicroFinanceOrderByReportKey,
  readonly OrderByOption[]
> = {
  "fund-withdrawl-report": fundWithdrawlOrderByOptions,
  "group-wise-member-account-details":
    groupWiseMemberAccountDetailsOrderByOptions,
};
