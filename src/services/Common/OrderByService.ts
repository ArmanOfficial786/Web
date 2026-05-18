import { AllReportOrderByResponseModel } from "types/api/api";
import { apiClient } from "../apiClient";

const orderByService = {
  getAll: async (): Promise<AllReportOrderByResponseModel> => {
    const response = await apiClient.api.orderByGetAllOrderByList({});
    return response.data.data ?? {};
  },
};

export default orderByService;
