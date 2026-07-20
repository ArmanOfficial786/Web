// services/Account/RatioAnalysisService.ts
import { Api } from "types/api/api";
import {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
} from "../Interceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const ratioAnalysisService = new Api({ baseURL: apiUrl });

const customRequestInterceptor = async (config: any) => {
  const configWithAuth = await requestInterceptor(config);
  configWithAuth.responseType = "blob";
  return configWithAuth;
};

ratioAnalysisService.instance.interceptors.request.use(
  customRequestInterceptor,
);
ratioAnalysisService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default ratioAnalysisService;
