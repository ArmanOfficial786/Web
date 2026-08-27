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
};

export default branchService;
