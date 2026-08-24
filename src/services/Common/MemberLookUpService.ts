import { apiClient } from "../apiClient";
import type { MemberLookUpDtosPagination } from "types/api/api";

export interface MemberLookUpSearchParams {
  Page?: number;
  MemberId?: string;
  MemberName?: string;
  GroupName?: string;
  CenterName?: string;
  Gender?: string;
  MobileNo?: string;
  OfficeName?: string;
  GroupCode?: string;
  CenterCode?: string;
  SortColumn?: string;
  SortDirection?: string;
}

export const memberLookUpService = {
  getAllWithFilters: async (
    params: MemberLookUpSearchParams,
  ): Promise<MemberLookUpDtosPagination> => {
    const response = await apiClient.api.memberLookUpSearchList(params);
    return response.data;
  },
};
