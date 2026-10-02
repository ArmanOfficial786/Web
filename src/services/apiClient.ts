import { Api } from "types/api/api";
import {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
} from "./Interceptor";

const apiClient = new Api({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
});

apiClient.instance.defaults.responseType = "json";

apiClient.instance.interceptors.request.use(requestInterceptor);
apiClient.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export { apiClient };
