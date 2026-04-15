// import type {
//   AxiosError,
//   AxiosResponse,
//   InternalAxiosRequestConfig,
// } from "axios";
// import { getSession, signOut } from "next-auth/react";
// import { toast } from "react-toastify";

// // ── Shapes ────────────────────────────────────────────────────────────────────

// // Your GeneralResponse shape from backend
// interface GeneralResponse {
//   isValid?: boolean;
//   statusCode?: number;
//   message?: string | null;
//   data?: any;
// }

// // .NET model validation error shape
// interface DotnetValidationError {
//   status: number;
//   title?: string;
//   traceId?: string;
//   type?: string;
//   errors: Record<string, string[]>;
// }

// // ── Request interceptor ───────────────────────────────────────────────────────
// export const requestInterceptor = async (
//   config: InternalAxiosRequestConfig,
// ): Promise<InternalAxiosRequestConfig> => {
//   const session = await getSession();
//   config.headers.Authorization = `Bearer ${session?.accessToken}`;
//   return config;
// };

// // ── Success interceptor ───────────────────────────────────────────────────────
// export const successResponseInterceptor = (
//   response: AxiosResponse,
// ): AxiosResponse => {
//   const data = response.data;

//   // ── Blob response — could be a JSON error disguised as blob ───────────
//   if (data instanceof Blob && data.type === "application/json") {
//     data
//       .text()
//       .then((txt) => {
//         const parsed: GeneralResponse = JSON.parse(txt);
//         if (!parsed.isValid) {
//           toast.error(parsed.message ?? "An error occurred", {
//             position: "top-right",
//           });
//         }
//       })
//       .catch(() => {
//         toast.error("Unexpected error reading response", {
//           position: "top-right",
//         });
//       });

//     return response;
//   }

//   // ── GeneralResponse shape ─────────────────────────────────────────────
//   if (typeof data === "object" && "isValid" in data) {
//     const res = data as GeneralResponse;

//     if (res.isValid === false) {
//       toast.error(res.message ?? "Request failed", { position: "top-right" });
//     } else if (res.message) {
//       // ✅ Only show success toast for mutations (POST/PUT/DELETE), not GET/VIEW
//       const method = response.config.method?.toUpperCase();
//       const isView =
//         response.config.params?.format === "VIEW" || method === "GET";

//       if (!isView) {
//         toast.success(res.message, { position: "top-right" });
//       }
//     }
//   }

//   return response;
// };

// // ── Error interceptor ─────────────────────────────────────────────────────────
// export const errorResponseInterceptor = (error: AxiosError): Promise<never> => {
//   // ── 401 — force sign out ──────────────────────────────────────────────
//   if (error.status === 401 || error.response?.status === 401) {
//     signOut();
//     return Promise.reject(error);
//   }

//   if (error.response) {
//     const responseData = error.response.data;

//     // ── GeneralResponse error (isValid: false with 4xx/5xx) ───────────
//     if (
//       typeof responseData === "object" &&
//       responseData !== null &&
//       "isValid" in responseData
//     ) {
//       const res = responseData as GeneralResponse;
//       toast.error(res.message ?? "Request failed", { position: "top-right" });
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
//   toast.error(error.message ?? "An error occurred. Please try again later.", {
//     position: "top-right",
//   });

//   return Promise.reject(error);
// };

import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import { toast } from "react-toastify";

//import { ReportContentType } from "@/utilis/Constants/reportConstants";

// ✅ Augment all three so silentSuccess flows through RequestParams → axios config
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
export interface ResponseType {
  success?: boolean;
  message?: string | null;
  errors?: any[] | null;
  data?: any;
}

interface DotnetErrorResponseType {
  status: number;
  title?: string;
  traceId?: string;
  type?: string;
  errors: {
    [key: string]: string[];
  };
}

// ── Request interceptor ───────────────────────────────────────────────────────
export const requestInterceptor = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  config.headers.Authorization = `Bearer ${(await getSession())?.accessToken}`;
  return config;
};

// ── Success interceptor ───────────────────────────────────────────────────────
export const successResponseInterceptor = (
  response: AxiosResponse,
): AxiosResponse => {
  const data = response.data;

  // ── Blob response ─────────────────────────────────────────────────────
  if (data instanceof Blob) {
    if (data.type === "application/pdf") {
      // ✅ Raw PDF binary — pass through silently, no toast
      return response;
    }

    if (data.type === "application/json") {
      // ⚠️ JSON error disguised as blob
      data
        .text()
        .then((txt) => {
          const parsed: ResponseType = JSON.parse(txt);
          if (parsed.success === false) {
            const errs: any[] = parsed.errors ?? [];
            for (const err of errs) {
              toast.error(err.message, { position: "top-right" });
            }
          }
        })
        .catch(() => {
          toast.error("Unexpected error reading response", {
            position: "top-right",
          });
        });
    }

    return response;
  }

  // ── Normal JSON response ──────────────────────────────────────────────
  const success: boolean | undefined = data.success;
  if (success === false) {
    const errs: any[] = data.errors ?? [];
    for (const err of errs) {
      toast.error(err.message, { position: "top-right" });
    }
  } else {
    // ✅ Skip success toast if the request was marked silent
    const isSilent = response.config?.silentSuccess === true;
    const successMsg: string | null | undefined = data.message;
    if (successMsg && !isSilent) {
      toast.success(successMsg, { position: "top-right" });
    }
  }

  return response;
};

// ── Error interceptor ─────────────────────────────────────────────────────────
export const errorResponseInterceptor = (error: AxiosError): Promise<never> => {
  if (error.status === 401 || error.response?.status === 401) {
    signOut();
    return Promise.reject(error);
  }

  if (error.response) {
    const responseData = error.response.data;

    // ── Blob error (e.g. server returned PDF-type blob on error) ──────
    if (responseData instanceof Blob) {
      responseData.text().then((txt) => {
        try {
          const parsed: ResponseType = JSON.parse(txt);
          const errs: any[] = parsed.errors ?? [];
          for (const err of errs) {
            toast.error(err.message, { position: "top-right" });
          }
        } catch {
          toast.error("An error occurred reading the response.", {
            position: "top-right",
          });
        }
      });
      return Promise.reject(error);
    }

    // ── ResponseType error ────────────────────────────────────────────
    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "success" in responseData
    ) {
      const response = responseData as ResponseType;
      if (response.success === false) {
        const errs: any[] = response.errors ?? [];
        for (const err of errs) {
          toast.error(err.message, { position: "top-right" });
        }
      }
      return Promise.reject(error);
    }

    // ── .NET model validation errors ──────────────────────────────────
    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "errors" in responseData
    ) {
      const response = responseData as DotnetErrorResponseType;
      const errorKeys = Object.keys(response.errors).filter(
        (key) => !key.startsWith("$"),
      );
      for (const key of errorKeys) {
        for (const errMsg of response.errors[key]) {
          toast.error(errMsg, { position: "top-right" });
        }
      }
      return Promise.reject(error);
    }
  }

  // ── Network / no response ─────────────────────────────────────────────
  toast.error(
    error.message ?? "An error has occurred. Please try again later.",
    { position: "top-right" },
  );

  return Promise.reject(error);
};
