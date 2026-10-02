import type { AssetCategoryResponse, RequestParams } from "types/api/api";
import { apiClient } from "../apiClient";

const assetCategoryService = {
  getAllByType: async (
    type?: string,
    params?: RequestParams,
  ): Promise<AssetCategoryResponse[]> => {
    const response = await apiClient.api.assetCategoryGetAllByTypeList(
      { type },
      params,
    );
    return response.data.data ?? [];
  },
};

export default assetCategoryService;
