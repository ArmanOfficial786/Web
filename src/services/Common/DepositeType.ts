import { DepositTypeResponse } from "types/api/api";
import { apiClient } from "../apiClient";

const depositeTypeService = {
  getAll: async (): Promise<DepositTypeResponse[]> => {
    const response = await apiClient.api.depositeTypeGetDepositeTypeList({});
    return response.data.data ?? [];
  },
};

export default depositeTypeService;
