// services/Account/DepositWithdrawMaxAmountRangeService.ts
import { Api } from "types/api/api";
import {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
} from "../Interceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const depositWithdrawMaxAmountRangeService = new Api({ baseURL: apiUrl });

// GenerateReport returns a raw payload (client type is `void`) — same
// pattern as BalanceSheet/CostOfFund/RatioAnalysis.
const customRequestInterceptor = async (config: any) => {
  const configWithAuth = await requestInterceptor(config);
  configWithAuth.responseType = "blob";
  return configWithAuth;
};

depositWithdrawMaxAmountRangeService.instance.interceptors.request.use(
  customRequestInterceptor,
);
depositWithdrawMaxAmountRangeService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default depositWithdrawMaxAmountRangeService;
