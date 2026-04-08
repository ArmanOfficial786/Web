import { apiClient } from "./apiClient";

export const memberLookUpService = {
  getAllWithFilters: async (params: any) => {
    const response = await apiClient.api.memberLookUpSearchList(params);
    return response.data;
  },
};
