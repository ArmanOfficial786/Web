import { BranchResponse } from "types/api/api";
import { apiClient } from "../apiClient";

const branchService = {
  getAll: async (): Promise<BranchResponse[]> => {
    const response = await apiClient.api.branchGetAllBranchesList({});
    return response.data.data ?? [];
  },
};

export default branchService;
