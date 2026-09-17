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

import { loanOrderByOptionsMap, LoanOrderByReportKey } from "./Loan/loanOrderByOptions";

export type OrderByReportKey =
  | MemberOrderByReportKey
  | AccountOrderByReportKey
  | SavingWiseBalanceOrderByReportKey
  | LoanOrderByReportKey;

export const orderByOptionsMap: Record<
  OrderByReportKey,
  readonly { key: string; label: string }[]
> = {
  ...memberOrderByOptionsMap,
  ...accountOrderByOptionsMap,
  ...savingWiseBalanceOrderByOptionsMap,
  ...loanOrderByOptionsMap,
};
