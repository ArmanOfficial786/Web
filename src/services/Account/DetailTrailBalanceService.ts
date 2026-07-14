// services/Account/deatialTrailBalanceService.ts
import { Api } from "types/api/api";
import {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
} from "../Interceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const deatialTrailBalanceService = new Api({ baseURL: apiUrl });

// GenerateReport returns a raw payload (client type is `void`, no
// GeneralResponse<T> JSON wrapper) — same pattern as BalanceSheet/CashFlowDetails.
const customRequestInterceptor = async (config: any) => {
  const configWithAuth = await requestInterceptor(config);
  configWithAuth.responseType = "blob";
  return configWithAuth;
};

deatialTrailBalanceService.instance.interceptors.request.use(
  customRequestInterceptor,
);
deatialTrailBalanceService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default deatialTrailBalanceService;
