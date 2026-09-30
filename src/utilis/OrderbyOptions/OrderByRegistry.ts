import {
  accountOrderByOptionsMap,
  type AccountOrderByReportKey,
} from "@/utilis/OrderbyOptions/account/accountOrderByOptions";
import {
  memberOrderByOptionsMap,
  type MemberOrderByReportKey,
} from "@/utilis/OrderbyOptions/member/MemberOrderByOptions";
import {
  savingWiseBalanceOrderByOptionsMap,
  SavingWiseBalanceOrderByReportKey,
} from "./memberAccount/savingWiseBalanceOrderByOptions";

import {
  assetOrderByOptionsMap,
  AssetOrderByReportKey,
} from "@/utilis/OrderbyOptions/asset/assetOrderByOptions";
import {
  microFinanceOrderByOptionsMap,
  MicroFinanceOrderByReportKey,
} from "@/utilis/OrderbyOptions/microFinance/microFinanceOrderByOptions";
import {
  remittancePaymentOrderByOptionsMap,
  RemittancePaymentOrderByReportKey,
} from "@/utilis/OrderbyOptions/remit/remitOrderByOptions";
import {
  loanOrderByOptionsMap,
  LoanOrderByReportKey,
} from "./Loan/loanOrderByOptions";
import {
  ShareOrderByReportKey,
  sharePurchaseOrderByOptionsMap,
} from "./share/shareOrderByOptions";

export type OrderByReportKey =
  | MemberOrderByReportKey
  | AccountOrderByReportKey
  | SavingWiseBalanceOrderByReportKey
  | LoanOrderByReportKey
  | ShareOrderByReportKey
  | RemittancePaymentOrderByReportKey
  | AssetOrderByReportKey
  | MicroFinanceOrderByReportKey;

export const orderByOptionsMap: Record<
  OrderByReportKey,
  readonly { key: string; label: string }[]
> = {
  ...memberOrderByOptionsMap,
  ...accountOrderByOptionsMap,
  ...savingWiseBalanceOrderByOptionsMap,
  ...loanOrderByOptionsMap,
  ...sharePurchaseOrderByOptionsMap,
  ...remittancePaymentOrderByOptionsMap,
  ...assetOrderByOptionsMap,
  ...microFinanceOrderByOptionsMap,
};
