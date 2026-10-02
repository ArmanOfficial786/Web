import { LmtLoanMaseterListResponse } from "types/api/api";
import { apiClient } from "../apiClient";

const lmtLoanMasterlistService = {
  getAll: async (): Promise<LmtLoanMaseterListResponse[]> => {
    const response = await apiClient.api.lmtLoanMaseterListList();
    return response.data.data ?? [];
  },
};

export default lmtLoanMasterlistService;
