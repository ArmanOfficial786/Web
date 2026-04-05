import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import { toast } from "react-toastify";

// ✅ Only change from your original — ErrorDTO now lives in the generated api.ts
// If your generated api.ts doesn't export ErrorDTO, the inline definition below is used
// import type { ErrorDTO } from '../types/api/api';

interface ErrorDTO {
  code?: string | null;
  message?: string | null;
  field?: string | null;
}

export interface ResponseType {
  success?: boolean;
  message?: string | null;
  errors?: ErrorDTO[] | null;
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

const requestInterceptor = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  config.headers.Authorization = `Bearer ${(await getSession())?.accessToken}`;
  return config;
};

const successResponseInterceptor = (response: AxiosResponse): AxiosResponse => {
  // Blob response that is actually a JSON error
  if (
    response.data &&
    response.data instanceof Blob &&
    response.data.type === "application/json"
  ) {
    response.data
      .text()
      .then((txt) => {
        const errs: ErrorDTO[] = JSON.parse(txt).errors ?? [];
        for (const err of errs) {
          // ✅ fixed: `of` not `in`
          toast.error(err.message, { position: "top-center" });
        }
      })
      .catch(() => {
        response.data = {};
      });
    return response; // ✅ early return — skip JSON path on Blob
  }

  // Normal JSON response
  const success: boolean | undefined = response.data.success;
  if (success === false) {
    const errs: ErrorDTO[] = response.data.errors;
    for (const err of errs) {
      toast.error(err.message, { position: "top-center" });
    }
  } else {
    const successMsg: string | null | undefined = response.data.message;
    if (successMsg) {
      toast.success(successMsg, { position: "top-center" });
    }
  }

  return response;
};

const errorResponseInterceptor = (error: AxiosError) => {
  if (error.status === 401 || error.response?.status === 401) {
    signOut();
    return;
  }

  if (!error.response) {
    toast.error(
      error.message ?? "An error has occurred. Please try again later.",
      { position: "top-center" },
    );
    return;
  }

  const responseData = error.response.data;

  if ((responseData as ResponseType).success !== undefined) {
    // Our own API error shape
    const errs = (responseData as ResponseType).errors ?? [];
    for (const err of errs) {
      toast.error(err.message, { position: "top-center" });
    }
  } else {
    // ASP.NET validation error shape
    const errs = (responseData as DotnetErrorResponseType).errors ?? {};
    for (const key of Object.keys(errs).filter((k) => !k.startsWith("$"))) {
      for (const msg of errs[key]) {
        toast.error(msg, { position: "top-center" });
      }
    }
  }
};

export {
  errorResponseInterceptor,
  requestInterceptor,
  successResponseInterceptor,
};
