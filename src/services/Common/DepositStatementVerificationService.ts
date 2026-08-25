// services/memberAccount/depositStatementVerifyService.ts
import type {
  DepositStatementVerifyRequestDto,
  DepositStatementVerificationDto,
  VerificationStatusDto,
} from "types/api/api";
import { apiClient } from "../apiClient";

const depositStatementVerifyService = {
  getStatus: async (
    mamAccountOpeningId: number,
  ): Promise<VerificationStatusDto | null> => {
    const response =
      await apiClient.api.depositStatementVerifyStatusDetail(
        mamAccountOpeningId,
      );
    return response.data.data ?? null;
  },

  getHistory: async (
    mamAccountOpeningId: number,
  ): Promise<DepositStatementVerificationDto[]> => {
    const response =
      await apiClient.api.depositStatementVerifyHistoryDetail(
        mamAccountOpeningId,
      );
    return response.data.data ?? [];
  },

  verify: async (
    payload: DepositStatementVerifyRequestDto,
  ): Promise<VerificationStatusDto | null> => {
    const response =
      await apiClient.api.depositStatementVerifyVerifyCreate(payload);
    return response.data.data ?? null;
  },
};

export default depositStatementVerifyService;
