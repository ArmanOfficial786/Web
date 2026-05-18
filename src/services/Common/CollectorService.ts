import { apiClient } from "../apiClient";
import { CollectorResponse } from "types/api/api";

const collectorService = {
  getCollectors: async (userId: number): Promise<CollectorResponse[]> => {
    const response = await apiClient.api.collectorGetCollectorList({ userId });
    return response.data.data ?? [];
  },
};

export default collectorService;
