import { Api } from "types/api/api";
import {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
} from "../Interceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const accountService = new Api({ baseURL: apiUrl });

const originalRequestInterceptor = requestInterceptor;
const customRequestInterceptor = async (config: any) => {
  const configWithAuth = await originalRequestInterceptor(config);

  if (configWithAuth.params?.format) {
    const format = configWithAuth.params.format.toLowerCase();
    if (["view", "pdf", "excel", "word", "image"].includes(format)) {
      configWithAuth.responseType = "blob";
    }
  }

  return configWithAuth;
};

accountService.instance.interceptors.request.use(customRequestInterceptor);
accountService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default accountService;
