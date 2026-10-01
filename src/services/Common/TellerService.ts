import type { TellerLookupResponse } from "types/api/api";
import { apiClient } from "../apiClient";

const tellerService = {
  getAll: async (params?: {
    fromDateBs?: string;
    toDateBs?: string;
  }): Promise<TellerLookupResponse[]> => {
    const response = await apiClient.api.tellerList(params ?? {});
    const body = response.data as unknown;
    if (Array.isArray(body)) return body as TellerLookupResponse[];
    const wrapped = (body as { data?: TellerLookupResponse[] | null })?.data;
    return Array.isArray(wrapped) ? wrapped : [];
  },
};

export default tellerService;
