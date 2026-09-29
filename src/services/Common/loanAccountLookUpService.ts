import type { PaginationOfLoanAccountLookUpDtos } from "types/api/api";
import { apiClient } from "../apiClient";

export interface LoanAccountLookUpSearchParams {
  Page?: number;
  LoanIssueId?: number;
  AccountNo?: string;
  MemberId?: string;
  MemberName?: string;
  LoanStatus?: string;
  SortColumn?: string;
  SortDirection?: string;
}

export const loanAccountLookUpService = {
  getAllWithFilters: async (
    params: LoanAccountLookUpSearchParams,
  ): Promise<PaginationOfLoanAccountLookUpDtos> => {
    const response = await apiClient.api.loanAccountLookUpSearchList(params);
    return response.data;
  },
};
