// src/services/Common/UserLookupService.ts
import { UserLookupResponse } from "types/api/api";
import { apiClient } from "../apiClient";

const userLookupService = {
  /** Raw API call — returns the untransformed response list. */
  getAll: async (): Promise<UserLookupResponse[]> => {
    const response = await apiClient.api.userLookupList();
    return response.data ?? [];
  },
};

export default userLookupService;
