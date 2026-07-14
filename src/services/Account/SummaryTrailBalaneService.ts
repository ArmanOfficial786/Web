import { Api } from "types/api/api";
import {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
} from "../Interceptor";
import plAccountService from "./PLAccountService";
import plAccountService from "./PLAccountService";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const summaryTrailBalanceService = new Api({ baseURL: apiUrl });

const customRequestInterceptor = async (config: any) => {
  const configWithAuth = await requestInterceptor(config);
  configWithAuth.responseType = "blob";
  return configWithAuth;
};

summaryTrailBalanceService.instance.interceptors.request.use(
  customRequestInterceptor,
);
summaryTrailBalanceService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default summaryTrailBalanceService;
