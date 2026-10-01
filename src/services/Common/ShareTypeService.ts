import { ShareTypeResponse } from "types/api/api";
import { apiClient } from "../apiClient";

const shareTypeService = {
  getAll: async (): Promise<ShareTypeResponse[]> => {
    const response = await apiClient.api.shareTypeList();

    return response.data.data ?? [];
  },
};

export default shareTypeService;
