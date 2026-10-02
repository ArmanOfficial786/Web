import type { FamClearanceStatusLookupDto } from "types/api/api";
import { apiClient } from "../apiClient";

const famClearanceStatusService = {
  getAll: async (): Promise<FamClearanceStatusLookupDto[]> => {
    const response = await apiClient.api.famClearanceStatusLookupList({});
    return response.data.data ?? [];
  },
};

export default famClearanceStatusService;
