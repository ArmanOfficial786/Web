import { ShareTypeResponse } from "types/api/api";
import { apiClient } from "../apiClient";

const shareTypeService = {
  getAll: async (): Promise<ShareTypeResponse[]> => {
    const response = await apiClient.api.shareTypeList();
    // ⚠️ Confirm the real shape below — see debugging step first
    return response.data.data ?? [];
  },
};

export default shareTypeService;
