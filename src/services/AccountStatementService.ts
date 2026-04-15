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

accountStatementService.instance.interceptors.request.use(requestInterceptor);
accountStatementService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default accountStatementService;
