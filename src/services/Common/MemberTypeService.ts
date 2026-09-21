// src/services/Common/MemberTypeService.ts
import type { MemberTypeResponse, RequestParams } from "types/api/api";
import { apiClient } from "../apiClient";

const memberTypeService = {
  getAllActive: async (
    params?: RequestParams,
  ): Promise<MemberTypeResponse[]> => {
    const response = await apiClient.api.memberTypeGetAllActiveList(params);
    return response.data.data ?? [];
  },
};

export default memberTypeService;
