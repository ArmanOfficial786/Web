import { AllReportOrderByResponseModel } from "types/api/api";
import { apiClient } from "../apiClient";

const orderByService = {
  getAll: async (): Promise<AllReportOrderByResponseModel> => {
    const response = await apiClient.api.orderByGetAllOrderByList({});
    return response.data.data ?? {};
  },
};

export default orderByService;
//don't need it by calling api i have done it using client side
