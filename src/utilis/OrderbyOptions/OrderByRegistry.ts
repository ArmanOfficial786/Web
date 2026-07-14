import {
  memberOrderByOptionsMap,
  type MemberOrderByReportKey,
} from "@/utilis/OrderbyOptions/member/MemberOrderByOptions";
import {
  accountOrderByOptionsMap,
  
  type AccountOrderByReportKey,
} from "@/utilis/OrderbyOptions/account/accountOrderByOptions";
import {
  savingWiseBalanceOrderByOptionsMap,
  SavingWiseBalanceOrderByReportKey,
} from "./memberAccount/savingWiseBalanceOrderByOptions";

export type OrderByReportKey =
  | MemberOrderByReportKey
  | AccountOrderByReportKey
  | SavingWiseBalanceOrderByReportKey;

export const orderByOptionsMap: Record<
  OrderByReportKey,
  readonly { key: string; label: string }[]
> = {
  ...memberOrderByOptionsMap,
  ...accountOrderByOptionsMap,
  ...savingWiseBalanceOrderByOptionsMap,
};
