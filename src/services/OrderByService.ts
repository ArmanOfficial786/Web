import { apiClient } from "./apiClient";

export const orderByService = {
  getAll: async () => {
    const response = await apiClient.api.orderByGetAllOrderByList();
    return response.data;
  },
};
