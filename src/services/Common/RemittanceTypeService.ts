import type { RemittanceTypeResponse, RequestParams } from "types/api/api";
import { apiClient } from "../apiClient";

const remittanceTypeService = {
  getAll: async (params?: RequestParams): Promise<RemittanceTypeResponse[]> => {
    const response =
      await apiClient.api.remittanceTypeGetAllRemittanceTypesList(params);
    return response.data.data ?? [];
  },
};

export default remittanceTypeService;
