import { apiClient } from "../apiClient";
import { MemberDetailRequest } from "types/api/api";

export const memberDetailService = {
  getReport: async (payload: MemberDetailRequest, format = "VIEW") => {
    const response = await apiClient.api.memberDetailMemberDetailReportCreate(
      payload,
      { format },
    );

    return response.data;
  },
};
