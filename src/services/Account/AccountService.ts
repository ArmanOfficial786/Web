import { Api } from "types/api/api";
import {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
} from "../Interceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const accountService = new Api({ baseURL: apiUrl });

// ✅ Key fix: Configure request interceptor to set responseType based on format param
const originalRequestInterceptor = requestInterceptor;
const customRequestInterceptor = async (config: any) => {
  // Call original interceptor for auth headers, etc.
  const configWithAuth = await originalRequestInterceptor(config);

  // Report display and export responses are binary, except AccountStatement VIEW.
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

accountService.instance.interceptors.request.use(customRequestInterceptor);
accountService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default accountService;
