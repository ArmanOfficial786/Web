// import { apiClient } from "./apiClient";
// import { AccountStatementRequest } from "../../types/api/api";

// export const accountStatementService = {
//   getReport: async (payload: AccountStatementRequest, format = "VIEW") => {
//     const response =
//       await apiClient.api.accountStatementAccountStatementReportCreate(
//         payload,
//         { format },
//       );

//     return response.data;
//   },
// };

import { Api } from "../../types/api/api";
import {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
} from "../services/Interceptor"; // mutual fund interceptors

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const accountStatementService = new Api({ baseURL: apiUrl });

// ✅ Key fix: Configure request interceptor to set responseType based on format param
const originalRequestInterceptor = requestInterceptor;
const customRequestInterceptor = async (config: any) => {
  // Call original interceptor for auth headers, etc.
  const configWithAuth = await originalRequestInterceptor(config);

  // ✅ If format is PDF/EXCEL/WORD, set responseType to blob
  if (configWithAuth.params?.format) {
    const format = configWithAuth.params.format.toLowerCase();
    if (["pdf", "excel", "word", "image"].includes(format)) {
      configWithAuth.responseType = "blob";
    }
  }

  return configWithAuth;
};

accountStatementService.instance.interceptors.request.use(
  customRequestInterceptor,
);
accountStatementService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default accountStatementService;
