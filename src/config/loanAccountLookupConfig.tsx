import { loanAccountLookUpService } from "@/services/Common/loanAccountLookUpService";
import type { FieldValues } from "react-hook-form";
import type { LoanAccountLookUpDtos } from "types/api/api";
import type { EntityLookupConfig, LookupPage } from "types/lookup";

export interface LoanAccountFilter {
  accountNo: string;
  memberId: string;
  memberName: string;
  loanStatus: string;
}

export const createLoanAccountLookupConfig = <
  TForm extends FieldValues,
>(): EntityLookupConfig<LoanAccountLookUpDtos, LoanAccountFilter, TForm> => ({
  cacheKey: "loan-account-od-lookup",
  title: "OD Loan Account Directory",
  rowKey: "loanIssueId",

  fetchPage: async (
    page: number,
  ): Promise<LookupPage<LoanAccountLookUpDtos>> => {
    const res = await loanAccountLookUpService.getAllWithFilters({
      Page: page,
      SortColumn: "AccountNo",
      SortDirection: "DESC",
    });
    return {
      items: res.items ?? [],
      totalPages: res.totalPages ?? 1,
      currentPage: res.currentPage ?? page,
      totalRecord: res.totalRecord ?? undefined,
    };
  },

  searchField: {
    name: "accountNo" as any,
    label: "Account No",
    placeholder: "Account No",
  },

  autofillFields: [
    { name: "memberId" as any, label: "Member Id", placeholder: "Member Id" },
    {
      name: "memberName" as any,
      label: "Member Name",
      placeholder: "Member Name",
    },
  ],

  mapToFormValues: (row) =>
    ({
      accountNo: row.accountNo ?? "",
      memberId: row.memberId ?? "",
      memberName: row.memberName ?? "",
    }) as any,

  filterDefaults: {
    accountNo: "",
    memberId: "",
    memberName: "",
    loanStatus: "",
  },

  columns: [
    { key: "accountNo", label: "Account No", filterKey: "accountNo" },
    { key: "memberId", label: "Member Id", filterKey: "memberId" },
    { key: "memberName", label: "Member Name", filterKey: "memberName" },
    { key: "loanStatus", label: "Loan Status", filterKey: "loanStatus" },
  ],
});
