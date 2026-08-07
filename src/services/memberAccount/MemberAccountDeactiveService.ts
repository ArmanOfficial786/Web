// services/memberAccount/MemberAccountDeactiveService.ts
import { Api } from "types/api/api";
import {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
} from "../Interceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const memberAccountDeactiveService = new Api({ baseURL: apiUrl });

// GenerateReport returns a raw payload (client type is `void`) — same
// pattern as BalanceSheet/PLAccount/DepositUnverified.
const customRequestInterceptor = async (config: any) => {
  const configWithAuth = await requestInterceptor(config);
  configWithAuth.responseType = "blob";
  return configWithAuth;
};

memberAccountDeactiveService.instance.interceptors.request.use(
  customRequestInterceptor,
);
memberAccountDeactiveService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default memberAccountDeactiveService;
