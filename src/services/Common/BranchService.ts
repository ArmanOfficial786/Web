import { BranchResponse, RequestParams } from "types/api/api";
import { apiClient } from "../apiClient";

const branchService = {
  getAll: async (params?: RequestParams): Promise<BranchResponse[]> => {
    const response = await apiClient.api.branchGetAllBranchesList(
      undefined,
      params,
    );
    return response.data.data ?? [];
  },

  // ✅ NEW — GET /api/Branch/GetCollectionBranch
  getCollectionBranches: async (
    params?: RequestParams,
  ): Promise<BranchResponse[]> => {
    const response = await apiClient.api.branchGetCollectionBranchList(
      undefined,
      params,
    );
    return response.data.data ?? [];
  },
};

export default branchService;
