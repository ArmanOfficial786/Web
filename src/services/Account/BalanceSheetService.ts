import { Api } from "types/api/api";
import {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
} from "../Interceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const balanceSheetService = new Api({ baseURL: apiUrl });

const customRequestInterceptor = async (config: any) => {
  const configWithAuth = await requestInterceptor(config);
  configWithAuth.responseType = "blob";
  return configWithAuth;
};

balanceSheetService.instance.interceptors.request.use(customRequestInterceptor);
balanceSheetService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default balanceSheetService;
