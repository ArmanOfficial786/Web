import { Api } from "../../types/api/api";
import {
  requestInterceptor,
  successResponseInterceptor,
  errorResponseInterceptor,
} from "./Interceptor";

const apiClient = new Api({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
});

// ✅ Set default responseType for blob handling
apiClient.instance.defaults.responseType = "json";

apiClient.instance.interceptors.request.use(requestInterceptor);
apiClient.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export { apiClient };
