
























import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import { toast } from "react-toastify";

declare module "axios" {
  interface AxiosRequestConfig {
    silentSuccess?: boolean;
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

export interface GeneralResponse<T = any> {
  isValid?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: T;
}

interface DotnetValidationError {
  status: number;
  title?: string;
  traceId?: string;
  type?: string;
  errors: Record<string, string[]>;
}

interface NoSessionRejection {
  __noSession: true;
  message: string;
  config: InternalAxiosRequestConfig;
}

const isNoSessionRejection = (err: unknown): err is NoSessionRejection =>
  typeof err === "object" && err !== null && (err as any).__noSession === true;

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

const readXMessage = (response: AxiosResponse): string | null => {
  const raw = response.headers["x-message"] as string | undefined;
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

const BINARY_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
]);

const PUBLIC_PATHS = ["/", "/register"];

const isOnPublicPage = (): boolean =>
  typeof window !== "undefined" &&
  PUBLIC_PATHS.includes(window.location.pathname);

let isHandlingUnauthorized = false;

const LOGIN_PATH = "/";

const handleUnauthorized = async (): Promise<void> => {
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
    await signOut({ redirect: false });
  } finally {
    if (typeof window !== "undefined") {
      window.location.href = LOGIN_PATH;
    }
  }
};

export const requestInterceptor = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  if (config.skipAuth) {
    return config;
  }

  const session = await getSession();

  if (!session?.accessToken) {
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

export const successResponseInterceptor = async (
  response: AxiosResponse,
): Promise<AxiosResponse> => {
  const data = response.data;
  const isSilent = response.config?.silentSuccess === true;

  if (data instanceof Blob) {
    if (BINARY_MIME_TYPES.has(data.type)) {
      if (!isSilent) {
        const message = readXMessage(response);
        if (message) showSuccess(message);
      }
      return response;
    }

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

export const errorResponseInterceptor = async (
  error: AxiosError | NoSessionRejection,
): Promise<never> => {
  if (isNoSessionRejection(error)) {
    return Promise.reject(error);
  }

  const axiosErr = error as AxiosError;
  const is401 = axiosErr.status === 401 || axiosErr.response?.status === 401;
  if (is401 && !axiosErr.config?.skipAuth) {
    void handleUnauthorized();
    return Promise.reject(error);
  }

  if (axiosErr.response) {
    const responseData = axiosErr.response.data;

    if (responseData instanceof Blob) {
      const parsed = await parseBlobAsGeneralResponse(responseData);
      if (parsed) {
        showError(parsed.message ?? "Request failed");
      } else {
        showError("An error occurred reading the response.");
      }
      return Promise.reject(error);
    }

    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "isValid" in responseData
    ) {
      showError((responseData as GeneralResponse).message ?? "Request failed");
      return Promise.reject(error);
    }

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
