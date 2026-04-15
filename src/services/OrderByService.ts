// import { apiClient } from "./apiClient";

// export const orderByService = {
//   getAll: async () => {
//     const response = await apiClient.api.orderByGetAllOrderByList();
//     return response.data;
//   },
// };

import { AllReportOrderByResponseModel } from "../../types/api/api";
import { apiClient } from "./apiClient";

const orderByService = {
  getAll: async (): Promise<AllReportOrderByResponseModel> => {
    const response = await apiClient.api.orderByGetAllOrderByList({
      silentSuccess: true, // ✅ valid now that AxiosRequestConfig is augmented
    });
    // response.data = AllReportOrderByResponseModelGeneralResponse
    // response.data.data = AllReportOrderByResponseModel
    return response.data.data ?? {};
  },
};

export default orderByService;
