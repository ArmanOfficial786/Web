import { Api } from "types/api/api";
import {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
} from "../Interceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const plAccountService = new Api({ baseURL: apiUrl });

const customRequestInterceptor = async (config: any) => {
  const configWithAuth = await requestInterceptor(config);
  configWithAuth.responseType = "blob";
  return configWithAuth;
};

plAccountService.instance.interceptors.request.use(customRequestInterceptor);
plAccountService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default plAccountService;
