import { apiClient } from "./apiClient";
import { CollectionCenterRequestDtos } from "../../types/api/api";

export const collectionCenterService = {
  getAll: async (data: CollectionCenterRequestDtos) => {
    const response =
      await apiClient.api.collectionCenterCollectionCentersCreate(data);
    return response.data;
  },
};
