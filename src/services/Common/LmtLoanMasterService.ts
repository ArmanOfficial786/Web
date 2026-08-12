import { LmtLoanMaseterListResponse } from "types/api/api";
import { apiClient } from "../apiClient";

const lmtLoanMasterlistService = {
  getAll: async (): Promise<LmtLoanMaseterListResponse[]> => {
    const response = await apiClient.api.lmtLoanMaseterListList();
    // ⚠️ Confirm the real shape below — see debugging step first
    return response.data.data ?? [];
  },
};

export default lmtLoanMasterlistService;
