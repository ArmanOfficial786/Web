import { TellerLookupResponse } from "types/api/api";
import { apiClient } from "../apiClient";

const tellerService = {
  getAll: async (params?: {
    fromDateBs?: string;
    toDateBs?: string;
  }): Promise<TellerLookupResponse[]> => {
    const response = await apiClient.api.tellerTellersList(params ?? {});
    return response.data.data ?? [];
  },
};

export default tellerService;
