import { Api } from "types/api/api";
import {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
} from "../Interceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const loanService = new Api({ baseURL: apiUrl });

const originalRequestInterceptor = requestInterceptor;
const customRequestInterceptor = async (config: any) => {
  const configWithAuth = await originalRequestInterceptor(config);

  if (configWithAuth.params?.format) {
    const format = configWithAuth.params.format.toLowerCase();
    const isAccountStatement =
      configWithAuth.url?.includes("/AccountStatement/");
    if (
      ["view", "pdf", "excel", "word", "image"].includes(format) &&
      !(format === "view" && isAccountStatement)
    ) {
      configWithAuth.responseType = "blob";
    }
  }

  return configWithAuth;
};

loanService.instance.interceptors.request.use(customRequestInterceptor);
loanService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default loanService;
