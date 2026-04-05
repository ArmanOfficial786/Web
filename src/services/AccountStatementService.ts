import { apiClient } from "./apiClient";
import { AccountStatementRequest } from "../../types/api/api";

export const accountStatementService = {
  getReport: async (payload: AccountStatementRequest, format = "VIEW") => {
    const response =
      await apiClient.api.accountStatementAccountStatementReportCreate(
        payload,
        { format },
      );

    return response.data;
  },
};
