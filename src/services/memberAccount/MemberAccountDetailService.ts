// services/memberAccount/MemberAccountDetailService.ts
import { Api } from "types/api/api";
import {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
} from "../Interceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const memberAccountDetailService = new Api({ baseURL: apiUrl });

// GenerateReport returns a raw payload (client type is `void`) — same
// pattern as BalanceSheet/CostOfFund/MemberSummary.
const customRequestInterceptor = async (config: any) => {
  const configWithAuth = await requestInterceptor(config);
  configWithAuth.responseType = "blob";
  return configWithAuth;
};

memberAccountDetailService.instance.interceptors.request.use(
  customRequestInterceptor,
);
memberAccountDetailService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default memberAccountDetailService;
