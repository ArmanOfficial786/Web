import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import { toast } from "react-toastify";

// ── Shapes ────────────────────────────────────────────────────────────────────

// Your GeneralResponse shape from backend
interface GeneralResponse {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: any;
}

// .NET model validation error shape
interface DotnetValidationError {
  status: number;
  title?: string;
  traceId?: string;
  type?: string;
  errors: Record<string, string[]>;
}

// ── Request interceptor ───────────────────────────────────────────────────────
export const requestInterceptor = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  const session = await getSession();
  config.headers.Authorization = `Bearer ${session?.accessToken}`;
  return config;
};

// ── Success interceptor ───────────────────────────────────────────────────────
export const successResponseInterceptor = (
  response: AxiosResponse,
): AxiosResponse => {
  const data = response.data;

  // ── Blob response — could be a JSON error disguised as blob ───────────
  if (data instanceof Blob && data.type === "application/json") {
    data
      .text()
      .then((txt) => {
        const parsed: GeneralResponse = JSON.parse(txt);
        if (!parsed.isValid) {
          toast.error(parsed.message ?? "An error occurred", {
            position: "top-center",
          });
        }
      })
      .catch(() => {
        toast.error("Unexpected error reading response", {
          position: "top-center",
        });
      });

    return response;
  }

  // ── GeneralResponse shape ─────────────────────────────────────────────
  if (typeof data === "object" && "isValid" in data) {
    const res = data as GeneralResponse;

    if (res.isValid === false) {
      toast.error(res.message ?? "Request failed", { position: "top-center" });
    } else if (res.message) {
      // ✅ Only show success toast for mutations (POST/PUT/DELETE), not GET/VIEW
      const method = response.config.method?.toUpperCase();
      const isView =
        response.config.params?.format === "VIEW" || method === "GET";

      if (!isView) {
        toast.success(res.message, { position: "top-center" });
      }
    }
  }

  return response;
};

// ── Error interceptor ─────────────────────────────────────────────────────────
export const errorResponseInterceptor = (error: AxiosError): Promise<never> => {
  // ── 401 — force sign out ──────────────────────────────────────────────
  if (error.status === 401 || error.response?.status === 401) {
    signOut();
    return Promise.reject(error);
  }

  if (error.response) {
    const responseData = error.response.data;

    // ── GeneralResponse error (isValid: false with 4xx/5xx) ───────────
    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "isValid" in responseData
    ) {
      const res = responseData as GeneralResponse;
      toast.error(res.message ?? "Request failed", { position: "top-center" });
      return Promise.reject(error);
    }

    // ── .NET model validation errors ──────────────────────────────────
    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "errors" in responseData
    ) {
      const res = responseData as DotnetValidationError;
      const keys = Object.keys(res.errors ?? {}).filter(
        (k) => !k.startsWith("$"),
      );

      for (const key of keys) {
        for (const msg of res.errors[key]) {
          toast.error(msg, { position: "top-center" });
        }
      }

      return Promise.reject(error);
    }
  }

  // ── Network error / no response ───────────────────────────────────────
  toast.error(error.message ?? "An error occurred. Please try again later.", {
    position: "top-center",
  });

  return Promise.reject(error);
};
