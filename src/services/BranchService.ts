import { apiClient } from "./apiClient";

export const branchService = {
  getAll: async () => {
    const response = await apiClient.api.branchGetAllBranchesList();
    return response.data;
  },
};
