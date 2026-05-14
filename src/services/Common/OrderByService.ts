import { AllReportOrderByResponseModel } from "types/api/api";
import { apiClient } from "../apiClient";

const orderByService = {
  getAll: async (): Promise<AllReportOrderByResponseModel> => {
    const response = await apiClient.api.orderByGetAllOrderByList({
      //silentSuccess: true, // ✅ valid now that AxiosRequestConfig is augmented
    });
    return response.data.data ?? {};
  },
};

export default orderByService;
