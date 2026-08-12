// services/Account/MemberPenaltyDepositWithdrawService.ts
import { Api } from "types/api/api";
import {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
} from "../Interceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const memberPenaltyDepositWithdrawService = new Api({ baseURL: apiUrl });

// GenerateReport returns a raw payload (client type is `void`) — same
// pattern as DepositWithdrawMaxAmountRange/CostOfFund/RatioAnalysis.
const customRequestInterceptor = async (config: any) => {
  const configWithAuth = await requestInterceptor(config);
  configWithAuth.responseType = "blob";
  return configWithAuth;
};

memberPenaltyDepositWithdrawService.instance.interceptors.request.use(
  customRequestInterceptor,
);
memberPenaltyDepositWithdrawService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default memberPenaltyDepositWithdrawService;
