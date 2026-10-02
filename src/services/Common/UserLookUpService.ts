import { UserLookupResponse } from "types/api/api";
import { apiClient } from "../apiClient";

const userLookupService = {
  getAll: async (): Promise<UserLookupResponse[]> => {
    const response = await apiClient.api.userLookupList();
    return response.data ?? [];
  },
};

export default userLookupService;
