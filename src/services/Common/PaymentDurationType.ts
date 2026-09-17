import type { PaymentDurationTypeResponse, RequestParams } from "types/api/api";
import { apiClient } from "../apiClient";

const paymentDurationTypeService = {
  getAll: async (
    params?: RequestParams,
  ): Promise<PaymentDurationTypeResponse[]> => {
    const response = await apiClient.api.paymentDurationTypeList(params);
    return response.data ?? [];
  },
};

export default paymentDurationTypeService;
