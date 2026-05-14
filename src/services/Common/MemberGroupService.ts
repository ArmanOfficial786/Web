import { apiClient } from "../apiClient";
import { MemberGroupRequestDtos } from "types/api/api";

export const memberGroupService = {
  getAll: async (data: MemberGroupRequestDtos) => {
    const response = await apiClient.api.memberGroupMemberGroupsCreate(data);
    return response.data;
  },
};
