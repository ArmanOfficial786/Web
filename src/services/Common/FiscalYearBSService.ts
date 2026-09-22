import type { FiscalYearResponse, RequestParams } from "types/api/api";
import { apiClient } from "../apiClient";

const fiscalYearBsService = {
  getAllActive: async (
    params?: RequestParams,
  ): Promise<FiscalYearResponse[]> => {
    const response = await apiClient.api.fiscalYearGetFiscalYearsBsList(params);
    return response.data.data ?? [];
  },
};

export default fiscalYearBsService;
