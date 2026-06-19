import { Api } from "types/api/api";
import {
  requestInterceptor,
  successResponseInterceptor,
  errorResponseInterceptor,
} from "../Interceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ── API Instance ──────────────────────────────────────────────────────────────
const memberAllDetailsService = new Api({ baseURL: apiUrl });

const originalRequestInterceptor = requestInterceptor;
const customRequestInterceptor = async (config: any) => {
  const configWithAuth = await originalRequestInterceptor(config);
  if (configWithAuth.params?.format) {
    const format = configWithAuth.params.format.toLowerCase();
    if (["view", "pdf", "word", "excel", "image"].includes(format)) {
      configWithAuth.responseType = "blob";
    }
  }

  return configWithAuth;
};

memberAllDetailsService.instance.interceptors.request.use(
  customRequestInterceptor,
);
memberAllDetailsService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default memberAllDetailsService;
