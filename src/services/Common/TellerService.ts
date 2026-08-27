import type { TellerLookupResponse } from "types/api/api";
import { apiClient } from "../apiClient";

const tellerService = {
  getAll: async (params?: {
    fromDateBs?: string;
    toDateBs?: string;
  }): Promise<TellerLookupResponse[]> => {
    const response = await apiClient.api.tellerList(params ?? {});
    return response.data ?? [];
  },
};

export default tellerService;
