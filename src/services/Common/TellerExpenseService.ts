// src/services/Common/TellerExpenseService.ts
import { TellerLookupResponse } from "types/api/api";
import { apiClient } from "../apiClient";

const tellerExpenseService = {
  getAll: async (params?: {
    fromDateBs?: string;
    toDateBs?: string;
  }): Promise<TellerLookupResponse[]> => {
    const response = await apiClient.api.tellerExpenseListList(params ?? {});
    return response.data ?? [];
  },
};

export default tellerExpenseService;
