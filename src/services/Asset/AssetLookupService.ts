import { FamAssetNameLookupDto } from "types/api/api";
import { apiClient } from "../apiClient";

export const assetLookupService = {
  getAll: async (data: FamAssetNameLookupDto) => {
    const response = await apiClient.api.famAssetLookupGetByIdList(data);
    return response.data;
  },
};
