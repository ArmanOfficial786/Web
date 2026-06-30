import { apiClient } from "../apiClient";
import { SoleMemberGroupRequestDtos } from "types/api/api";

export const soleMemberGroupService = {
  getAll: async (data: SoleMemberGroupRequestDtos) => {
    const response = await apiClient.api.soleMemberGroupCreate(data);
    return response.data;
  },
};
