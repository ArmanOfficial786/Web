// import type {
//   AxiosError,
//   AxiosResponse,
//   InternalAxiosRequestConfig,
// } from "axios";
// import { getSession, signOut } from "next-auth/react";
// import { toast } from "react-toastify";

// // ── Augment Axios types ───────────────────────────────────────────────────────
// declare module "axios" {
//   interface AxiosRequestConfig {
//     silentSuccess?: boolean;
//   }
//   interface InternalAxiosRequestConfig {
//     silentSuccess?: boolean;
//   }
//   interface AxiosDefaults {
//     silentSuccess?: boolean;
//   }
// }

// // ── Matches backend GeneralResponse<T> ────────────────────────────────────────
// export interface GeneralResponse<T = any> {
//   isValid?: boolean;
//   statusCode?: number;
//   message?: string | null;
//   data?: T;
// }

// // ── .NET model validation error shape ─────────────────────────────────────────
// interface DotnetValidationError {
//   status: number;
//   title?: string;
//   traceId?: string;
//   type?: string;
//   errors: Record<string, string[]>;
// }

// // ── Helpers ───────────────────────────────────────────────────────────────────
// const parseBlobAsGeneralResponse = async (
//   blob: Blob,
// ): Promise<GeneralResponse | null> => {
//   try {
//     const text = await blob.text();
//     return JSON.parse(text) as GeneralResponse;
//   } catch {
//     return null;
//   }
// };

// const showError = (message: string): void => {
//   toast.error(message, { position: "top-right" });
// };

// const showSuccess = (message: string): void => {
//   toast.success(message, { position: "top-right" });
// };

// // ── Read X-Message header — backend sends it URL-encoded ──────────────────────
// // Response.Headers.Append("X-Message", Uri.EscapeDataString("Report generated successfully"))
// const readXMessage = (response: AxiosResponse): string | null => {
//   const raw = response.headers["x-message"] as string | undefined;
//   if (!raw) return null;
//   try {
//     return decodeURIComponent(raw);
//   } catch {
//     return raw; // fallback: return as-is if decoding fails
//   }
// };

// // ── Binary MIME types that come back as PDF/Office/image blobs ────────────────
// const BINARY_MIME_TYPES = new Set([
//   "application/pdf",
//   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   "image/png",
// ]);

// // ── Request interceptor ───────────────────────────────────────────────────────
// export const requestInterceptor = async (
//   config: InternalAxiosRequestConfig,
// ): Promise<InternalAxiosRequestConfig> => {
//   const session = await getSession();
//   config.headers.Authorization = `Bearer ${session?.accessToken}`;
//   return config;
// };

// // ── Success interceptor ───────────────────────────────────────────────────────
// export const successResponseInterceptor = async (
//   response: AxiosResponse,
// ): Promise<AxiosResponse> => {
//   const data = response.data;
//   const isSilent = response.config?.silentSuccess === true;

//   // ── Blob response (VIEW / EXPORT binary) ──────────────────────────────
//   if (data instanceof Blob) {
//     // ── Raw binary (PDF / XLSX / DOCX / PNG) ──────────────────────────
//     if (BINARY_MIME_TYPES.has(data.type)) {
//       // ✅ Read X-Message header — set by backend on binary responses
//       // e.g. Response.Headers.Append("X-Message", Uri.EscapeDataString("Report generated successfully"))
//       // JSON body is not available here (response IS the binary) so the
//       // header is the only channel for success messages on blob endpoints
//       if (!isSilent) {
//         const message = readXMessage(response);
//         if (message) showSuccess(message);
//       }
//       return response;
//     }

//     // ── JSON error wrapped in a blob (e.g. 400 with responseType:blob) ─
//     if (data.type === "application/json") {
//       const parsed = await parseBlobAsGeneralResponse(data);
//       if (parsed) {
//         response.data = parsed;
//         if (parsed.isValid === false) {
//           showError(parsed.message ?? "Request failed");
//         } else if (parsed.message && parsed.isValid === true && !isSilent) {
//           showSuccess(parsed.message);
//         }
//       }
//     }

//     return response;
//   }

//   // ── Normal GeneralResponse<T> JSON ────────────────────────────────────
//   if (typeof data === "object" && data !== null && "isValid" in data) {
//     const res = data as GeneralResponse;

//     if (res.isValid === false) {
//       showError(res.message ?? "Request failed");
//       return response;
//     }

//     if (res.message && !isSilent) {
//       showSuccess(res.message);
//     }
//   }

//   return response;
// };

// // ── Error interceptor ─────────────────────────────────────────────────────────
// export const errorResponseInterceptor = async (
//   error: AxiosError,
// ): Promise<never> => {
//   // ── 401 — force sign out ──────────────────────────────────────────────
//   if (error.status === 401 || error.response?.status === 401) {
//     signOut();
//     return Promise.reject(error);
//   }

//   if (error.response) {
//     const responseData = error.response.data;

//     // ── Blob error — server returned JSON error but responseType was blob ─
//     if (responseData instanceof Blob) {
//       const parsed = await parseBlobAsGeneralResponse(responseData);
//       if (parsed) {
//         showError(parsed.message ?? "Request failed");
//       } else {
//         showError("An error occurred reading the response.");
//       }
//       return Promise.reject(error);
//     }

//     // ── GeneralResponse JSON error ────────────────────────────────────
//     if (
//       typeof responseData === "object" &&
//       responseData !== null &&
//       "isValid" in responseData
//     ) {
//       showError((responseData as GeneralResponse).message ?? "Request failed");
//       return Promise.reject(error);
//     }

//     // ── .NET model validation errors ──────────────────────────────────
//     if (
//       typeof responseData === "object" &&
//       responseData !== null &&
//       "errors" in responseData
//     ) {
//       const res = responseData as DotnetValidationError;
//       const keys = Object.keys(res.errors ?? {}).filter(
//         (k) => !k.startsWith("$"),
//       );
//       for (const key of keys) {
//         for (const msg of res.errors[key]) {
//           toast.error(msg, { position: "top-right" });
//         }
//       }
//       return Promise.reject(error);
//     }
//   }

//   // ── Network error / no response ───────────────────────────────────────
//   if (!toast.isActive("network-error")) {
//     toast.error(error.message ?? "An error occurred. Please try again later.", {
//       position: "top-right",
//       toastId: "network-error",
//     });
//   }

//   return Promise.reject(error);
// };

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
    /**
     * Mark a request as not requiring authentication (e.g. branch list on
     * the public login page). requestInterceptor skips the session check
     * and won't attach an Authorization header. A 401 from the server on
     * such a request is treated as a normal error, not a "session expired"
     * event.
     */
    skipAuth?: boolean;
  }
  interface InternalAxiosRequestConfig {
    silentSuccess?: boolean;
    skipAuth?: boolean;
  }
  interface AxiosDefaults {
    silentSuccess?: boolean;
    skipAuth?: boolean;
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

// ── Sentinel for requests deliberately blocked in requestInterceptor ──────────
// (missing/expired session on a protected route). Lets
// errorResponseInterceptor know "this was already decided" and skip
// showing its own generic error toast for it.
interface NoSessionRejection {
  __noSession: true;
  message: string;
  config: InternalAxiosRequestConfig;
}

const isNoSessionRejection = (err: unknown): err is NoSessionRejection =>
  typeof err === "object" && err !== null && (err as any).__noSession === true;

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

// ── Public routes — no session is expected/normal here, never treat as error ──
// Add every route that should be reachable without being logged in.
const PUBLIC_PATHS = ["/", "/register"];

const isOnPublicPage = (): boolean =>
  typeof window !== "undefined" &&
  PUBLIC_PATHS.includes(window.location.pathname);

// ── 401 / unauthorized handling guard ──────────────────────────────────────────
// Prevents multiple concurrent 401s from each independently triggering
// signOut(), and prevents signOut's own redirect from re-triggering the
// same failing request and looping forever.
let isHandlingUnauthorized = false;

const LOGIN_PATH = "/";

const handleUnauthorized = async (): Promise<void> => {
  // Already on a public page? There's no session to sign out of and no
  // useful redirect to make — not being logged in here is expected.
  if (isOnPublicPage()) return;

  if (isHandlingUnauthorized) return;
  isHandlingUnauthorized = true;

  if (!toast.isActive("session-expired")) {
    toast.error("Your session has expired. Please sign in again.", {
      position: "top-right",
      toastId: "session-expired",
    });
  }

  try {
    // redirect: false — we control navigation ourselves, once, deliberately.
    await signOut({ redirect: false });
  } finally {
    if (typeof window !== "undefined") {
      window.location.href = LOGIN_PATH;
    }
  }
};

// ── Request interceptor ───────────────────────────────────────────────────────
export const requestInterceptor = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  // ── Explicitly public request (e.g. branch list on the login page) ──────
  // Never fetch a session, never attach a token, never treat "no session"
  // as an error for these — the caller has already told us this endpoint
  // doesn't need auth.
  if (config.skipAuth) {
    return config;
  }

  const session = await getSession();

  if (!session?.accessToken) {
    // On a public page, having no session yet is expected — not an error.
    // On a protected page, this IS the "tried to access without login" case.
    if (!isOnPublicPage()) {
      void handleUnauthorized();
    }

    const rejection: NoSessionRejection = {
      __noSession: true,
      message: "No active session",
      config,
    };
    return Promise.reject(rejection) as never;
  }

  config.headers.Authorization = `Bearer ${session.accessToken}`;
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
  error: AxiosError | NoSessionRejection,
): Promise<never> => {
  // ── Already handled in requestInterceptor — never show a second message ──
  if (isNoSessionRejection(error)) {
    return Promise.reject(error);
  }

  // ── 401 — force sign out (guarded against loops / concurrent triggers) ──
  // Skip this for requests explicitly marked skipAuth — a 401 there is a
  // normal request error, not a "your session expired" event.
  const axiosErr = error as AxiosError;
  const is401 = axiosErr.status === 401 || axiosErr.response?.status === 401;
  if (is401 && !axiosErr.config?.skipAuth) {
    void handleUnauthorized();
    return Promise.reject(error);
  }

  if (axiosErr.response) {
    const responseData = axiosErr.response.data;

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
  if (!toast.isActive("network-error")) {
    toast.error(
      axiosErr.message ?? "An error occurred. Please try again later.",
      {
        position: "top-right",
        toastId: "network-error",
      },
    );
  }

  return Promise.reject(error);
};
