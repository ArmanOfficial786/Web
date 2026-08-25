import { Api } from "types/api/api";
import {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
} from "../Interceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authService = new Api({ baseURL: apiUrl });

authService.instance.interceptors.request.use(requestInterceptor);
authService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default authService;
