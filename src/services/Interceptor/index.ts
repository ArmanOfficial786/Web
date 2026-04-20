// import type {
//   AxiosError,
//   AxiosResponse,
//   InternalAxiosRequestConfig,
// } from "axios";
// import { getSession, signOut } from "next-auth/react";
// import { toast } from "react-toastify";

// //import { ReportContentType } from "@/utilis/Constants/reportConstants";

// // ✅ Augment all three so silentSuccess flows through RequestParams → axios config
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
// export interface ResponseType {
//   success?: boolean;
//   message?: string | null;
//   errors?: any[] | null;
//   data?: any;
// }

// interface DotnetErrorResponseType {
//   status: number;
//   title?: string;
//   traceId?: string;
//   type?: string;
//   errors: {
//     [key: string]: string[];
//   };
// }

// // ── Request interceptor ───────────────────────────────────────────────────────
// export const requestInterceptor = async (
//   config: InternalAxiosRequestConfig,
// ): Promise<InternalAxiosRequestConfig> => {
//   config.headers.Authorization = `Bearer ${(await getSession())?.accessToken}`;
//   return config;
// };

// // ── Success interceptor ───────────────────────────────────────────────────────
// export const successResponseInterceptor = (
//   response: AxiosResponse,
// ): AxiosResponse => {
//   const data = response.data;

//   // ── Blob response ─────────────────────────────────────────────────────
//   if (data instanceof Blob) {
//     if (data.type === "application/pdf") {
//       // ✅ Raw PDF binary — pass through silently, no toast
//       return response;
//     }

//     if (data.type === "application/json") {
//       // ⚠️ JSON error disguised as blob
//       data
//         .text()
//         .then((txt) => {
//           const parsed: ResponseType = JSON.parse(txt);
//           if (parsed.success === false) {
//             const errs: any[] = parsed.errors ?? [];
//             for (const err of errs) {
//               toast.error(err.message, { position: "top-right" });
//             }
//           }
//         })
//         .catch(() => {
//           toast.error("Unexpected error reading response", {
//             position: "top-right",
//           });
//         });
//     }

//     return response;
//   }

//   // ── Normal JSON response ──────────────────────────────────────────────
//   const success: boolean | undefined = data.success;
//   if (success === false) {
//     const errs: any[] = data.errors ?? [];
//     for (const err of errs) {
//       toast.error(err.message, { position: "top-right" });
//     }
//   } else {
//     // ✅ Skip success toast if the request was marked silent
//     const isSilent = response.config?.silentSuccess === true;
//     const successMsg: string | null | undefined = data.message;
//     if (successMsg && !isSilent) {
//       toast.success(successMsg, { position: "top-right" });
//     }
//   }

//   return response;
// };

// // ── Error interceptor ─────────────────────────────────────────────────────────
// export const errorResponseInterceptor = (error: AxiosError): Promise<never> => {
//   if (error.status === 401 || error.response?.status === 401) {
//     signOut();
//     return Promise.reject(error);
//   }

//   if (error.response) {
//     const responseData = error.response.data;

//     // ── Blob error (e.g. server returned PDF-type blob on error) ──────
//     if (responseData instanceof Blob) {
//       responseData.text().then((txt) => {
//         try {
//           const parsed: ResponseType = JSON.parse(txt);
//           const errs: any[] = parsed.errors ?? [];
//           for (const err of errs) {
//             toast.error(err.message, { position: "top-right" });
//           }
//         } catch {
//           toast.error("An error occurred reading the response.", {
//             position: "top-right",
//           });
//         }
//       });
//       return Promise.reject(error);
//     }

//     // ── ResponseType error ────────────────────────────────────────────
//     if (
//       typeof responseData === "object" &&
//       responseData !== null &&
//       "success" in responseData
//     ) {
//       const response = responseData as ResponseType;
//       if (response.success === false) {
//         const errs: any[] = response.errors ?? [];
//         for (const err of errs) {
//           toast.error(err.message, { position: "top-right" });
//         }
//       }
//       return Promise.reject(error);
//     }

//     // ── .NET model validation errors ──────────────────────────────────
//     if (
//       typeof responseData === "object" &&
//       responseData !== null &&
//       "errors" in responseData
//     ) {
//       const response = responseData as DotnetErrorResponseType;
//       const errorKeys = Object.keys(response.errors).filter(
//         (key) => !key.startsWith("$"),
//       );
//       for (const key of errorKeys) {
//         for (const errMsg of response.errors[key]) {
//           toast.error(errMsg, { position: "top-right" });
//         }
//       }
//       return Promise.reject(error);
//     }
//   }

//   // ── Network / no response ─────────────────────────────────────────────
//   toast.error(
//     error.message ?? "An error has occurred. Please try again later.",
//     { position: "top-right" },
//   );

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
  }
  interface InternalAxiosRequestConfig {
    silentSuccess?: boolean;
  }
  interface AxiosDefaults {
    silentSuccess?: boolean;
  }
}

// ── Matches your backend GeneralResponse<T> shape ─────────────────────────────
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

// Reads a Blob as text and parses it as GeneralResponse
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

const showGeneralResponseError = (res: GeneralResponse): void => {
  toast.error(res.message ?? "Request failed", { position: "top-right" });
};

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

  // ── Blob response (VIEW / EXPORT binary) ──────────────────────────────
  if (data instanceof Blob) {
    // ✅ Raw PDF/XLSX/DOCX binary — pass through silently
    if (
      data.type === "application/pdf" ||
      data.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      data.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      data.type === "image/png"
    ) {
      return response;
    }

    // ⚠️ JSON error disguised as blob (e.g. 404 with responseType: blob)
    // Axios puts it in success interceptor when status is 2xx — handle async
    if (data.type === "application/json") {
      parseBlobAsGeneralResponse(data).then((parsed) => {
        if (!parsed) {
          toast.error("Unexpected error reading response.", {
            position: "top-right",
          });
          return;
        }
        if (parsed.isValid === false) {
          showGeneralResponseError(parsed);
        }
      });
    }

    return response;
  }

  // ── Normal GeneralResponse<T> JSON ────────────────────────────────────
  if (typeof data === "object" && data !== null && "isValid" in data) {
    const res = data as GeneralResponse;

    if (res.isValid === false) {
      showGeneralResponseError(res);
      return response;
    }

    // ✅ Show success toast unless silenced
    const isSilent = response.config?.silentSuccess === true;
    const isReportView = response.config?.params?.format === "VIEW";

    if (res.message && !isSilent && !isReportView) {
      toast.success(res.message, { position: "top-right" });
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

    // ── Blob error — server returned JSON error but responseType was blob
    // ✅ This is the key fix: 404/500 with responseType:blob lands here as Blob
    if (responseData instanceof Blob) {
      const parsed = await parseBlobAsGeneralResponse(responseData);
      if (parsed) {
        showGeneralResponseError(parsed);
      } else {
        toast.error("An error occurred reading the response.", {
          position: "top-right",
        });
      }
      return Promise.reject(error);
    }

    // ── GeneralResponse JSON error (isValid: false) ───────────────────
    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "isValid" in responseData
    ) {
      const res = responseData as GeneralResponse;
      showGeneralResponseError(res);
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
