// services/Account/MemberSummaryService.ts
import { Api } from "types/api/api";
import {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
} from "../Interceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const memberSummaryService = new Api({ baseURL: apiUrl });

// GenerateReport returns a raw payload (client type is `void`) — same
// pattern as BalanceSheet/CostOfFund/SavingTypeWiseBalance.
const customRequestInterceptor = async (config: any) => {
  const configWithAuth = await requestInterceptor(config);
  configWithAuth.responseType = "blob";
  return configWithAuth;
};

memberSummaryService.instance.interceptors.request.use(
  customRequestInterceptor,
);
memberSummaryService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default memberSummaryService;
