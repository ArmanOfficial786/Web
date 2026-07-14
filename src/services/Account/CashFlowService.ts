import { Api } from "types/api/api";
import {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
} from "../Interceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const cashFlowService = new Api({ baseURL: apiUrl });

const customRequestInterceptor = async (config: any) => {
  const configWithAuth = await requestInterceptor(config);
  configWithAuth.responseType = "blob";
  return configWithAuth;
};

cashFlowService.instance.interceptors.request.use(customRequestInterceptor);
cashFlowService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default cashFlowService;
