import { Api } from "../../types/api/api";
import {
  requestInterceptor,
  successResponseInterceptor,
  errorResponseInterceptor,
} from "./Interceptor";

const apiClient = new Api({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
});

apiClient.instance.interceptors.request.use(requestInterceptor);
apiClient.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export { apiClient };
