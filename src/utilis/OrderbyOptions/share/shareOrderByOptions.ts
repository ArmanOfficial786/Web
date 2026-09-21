import type { OrderByOption } from "../DefineOrderByOptions";
import { defineOrderByOptions } from "../DefineOrderByOptions";

export const sharePurchaseOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "totalNoShare", label: "Total Number of Shares" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
] as const);

export const shareHoldingOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "holdingPeriodFrom", label: "Holding Period From" },
  { key: "totalNo", label: "Date" },
  { key: "amount", label: "Amount" },
] as const);

export const shareTransferOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "previousMemberId", label: "Previous Member Id" },
  { key: "previousMemberName", label: "Previous Member Name" },
  { key: "holdingPeriodFrom", label: "Holding Period From" },
  { key: "totalNo", label: "Date" },
  { key: "amount", label: "Amount" },
] as const);

export const shareDividendOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "purchaseDate", label: "Purchase Date" },
  { key: "purchaseAmount", label: "Purchase Amount" },
  { key: "holdingdays", label: "Holding Days" },
  { key: "aggregateAmount", label: "Aggregate Amount" },
] as const);

export const shareReturnOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "purchaseDate", label: "Purchase Date" },
  { key: "returnDate", label: "Return Date" },
  { key: "totalNoshare", label: "Total Number of Shares" },
  { key: "amount", label: "Amount" },
] as const);

export const compomisReportOrderByOptions = defineOrderByOptions([
  { key: "memberId", label: "Member Id" },
  { key: "memberName", label: "Member Name" },
  { key: "shareNo", label: "Share Number" },
  { key: "amount", label: "Amount" },
  { key: "registrationDate", label: "Registration Date" },
] as const);

export type ShareOrderByReportKey =
  | "share-purchase-report"
  | "share-holding-report"
  | "share-transfer-report"
  | "share-dividend-report"
  | "share-return-report"
  | "copomis-report";

export const sharePurchaseOrderByOptionsMap: Record<
  ShareOrderByReportKey,
  readonly OrderByOption[]
> = {
  "share-purchase-report": sharePurchaseOrderByOptions,
  "share-holding-report": shareHoldingOrderByOptions,
  "share-transfer-report": shareTransferOrderByOptions,
  "share-dividend-report": shareDividendOrderByOptions,
  "share-return-report": shareReturnOrderByOptions,
  "copomis-report": compomisReportOrderByOptions,
};
