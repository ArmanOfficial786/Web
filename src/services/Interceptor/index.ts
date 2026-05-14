import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import { toast } from "react-toastify";

// ── Augment Axios types ───────────────────────────────────────────────────────
declare module "axios" {
  interface AxiosRequestConfig {
    silentSuccess?: boolean;
  }
  interface InternalAxiosRequestConfig {
    silentSuccess?: boolean;
  }
  interface AxiosDefaults {
    silentSuccess?: boolean;
  }
}

// ── Matches backend GeneralResponse<T> ────────────────────────────────────────
export interface GeneralResponse<T = any> {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: T;
}

// ── .NET model validation error shape ─────────────────────────────────────────
interface DotnetValidationError {
  status: number;
  title?: string;
  traceId?: string;
  type?: string;
  errors: Record<string, string[]>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const parseBlobAsGeneralResponse = async (
  blob: Blob,
): Promise<GeneralResponse | null> => {
  try {
    const text = await blob.text();
    return JSON.parse(text) as GeneralResponse;
  } catch {
    return null;
  }
};

const showError = (message: string): void => {
  toast.error(message, { position: "top-right" });
};

const showSuccess = (message: string): void => {
  toast.success(message, { position: "top-right" });
};

// ── Read X-Message header — backend sends it URL-encoded ──────────────────────
// Response.Headers.Append("X-Message", Uri.EscapeDataString("Report generated successfully"))
const readXMessage = (response: AxiosResponse): string | null => {
  const raw = response.headers["x-message"] as string | undefined;
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw; // fallback: return as-is if decoding fails
  }
};

// ── Binary MIME types that come back as PDF/Office/image blobs ────────────────
const BINARY_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
]);

// ── Request interceptor ───────────────────────────────────────────────────────
export const requestInterceptor = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  const session = await getSession();
  config.headers.Authorization = `Bearer ${session?.accessToken}`;
  return config;
};

// ── Success interceptor ───────────────────────────────────────────────────────
export const successResponseInterceptor = async (
  response: AxiosResponse,
): Promise<AxiosResponse> => {
  const data = response.data;
  const isSilent = response.config?.silentSuccess === true;

  // ── Blob response (VIEW / EXPORT binary) ──────────────────────────────
  if (data instanceof Blob) {
    // ── Raw binary (PDF / XLSX / DOCX / PNG) ──────────────────────────
    if (BINARY_MIME_TYPES.has(data.type)) {
      // ✅ Read X-Message header — set by backend on binary responses
      // e.g. Response.Headers.Append("X-Message", Uri.EscapeDataString("Report generated successfully"))
      // JSON body is not available here (response IS the binary) so the
      // header is the only channel for success messages on blob endpoints
      if (!isSilent) {
        const message = readXMessage(response);
        if (message) showSuccess(message);
      }
      return response;
    }

    // ── JSON error wrapped in a blob (e.g. 400 with responseType:blob) ─
    if (data.type === "application/json") {
      const parsed = await parseBlobAsGeneralResponse(data);
      if (parsed) {
        response.data = parsed;
        if (parsed.isValid === false) {
          showError(parsed.message ?? "Request failed");
        } else if (parsed.message && parsed.isValid === true && !isSilent) {
          showSuccess(parsed.message);
        }
      }
    }

    return response;
  }

  // ── Normal GeneralResponse<T> JSON ────────────────────────────────────
  if (typeof data === "object" && data !== null && "isValid" in data) {
    const res = data as GeneralResponse;

    if (res.isValid === false) {
      showError(res.message ?? "Request failed");
      return response;
    }

    if (res.message && !isSilent) {
      showSuccess(res.message);
    }
  }

  return response;
};

// ── Error interceptor ─────────────────────────────────────────────────────────
export const errorResponseInterceptor = async (
  error: AxiosError,
): Promise<never> => {
  // ── 401 — force sign out ──────────────────────────────────────────────
  if (error.status === 401 || error.response?.status === 401) {
    signOut();
    return Promise.reject(error);
  }

  if (error.response) {
    const responseData = error.response.data;

    // ── Blob error — server returned JSON error but responseType was blob ─
    if (responseData instanceof Blob) {
      const parsed = await parseBlobAsGeneralResponse(responseData);
      if (parsed) {
        showError(parsed.message ?? "Request failed");
      } else {
        showError("An error occurred reading the response.");
      }
      return Promise.reject(error);
    }

    // ── GeneralResponse JSON error ────────────────────────────────────
    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "isValid" in responseData
    ) {
      showError((responseData as GeneralResponse).message ?? "Request failed");
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
          toast.error(msg, { position: "top-right" });
        }
      }
      return Promise.reject(error);
    }
  }

  // ── Network error / no response ───────────────────────────────────────
  toast.error(error.message ?? "An error occurred. Please try again later.", {
    position: "top-right",
  });

  return Promise.reject(error);
};
