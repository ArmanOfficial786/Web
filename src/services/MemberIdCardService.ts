// import { getSession } from "next-auth/react";
// import { apiClient } from "./apiClient";
// import {
//   streamViewToBase64,
//   streamExportToNewTab,
//   getFileExtension,
//   type ReportServiceResult,
// } from "@/utilis/reportUtils";
// import type { MemberIdCardRequest } from "../../types/api/api";

// export { triggerFileDownload } from "@/utilis/reportUtils";
// export type {
//   ReportServiceResult,
//   ViewResult,
//   DownloadResult,
// } from "@/utilis/reportUtils";

// const getRequestMeta = async (format: string) => {
//   const session = await getSession();
//   const token = session?.accessToken ?? "";
//   const baseURL = apiClient.instance.defaults.baseURL ?? "";
//   const url = `${baseURL}/api/MemberIdCard/MemberIdCard?format=${format}`;
//   return { token, url };
// };

// export const memberIdCardService = {
//   // ── VIEW: returns base64 PDF for inline PdfSlideViewer ───────────────────
//   view: async (
//     payload: MemberIdCardRequest,
//     page: number,
//     size: number,
//     onProgress?: (percent: number) => void,
//   ): Promise<ReportServiceResult> => {
//     const { token, url } = await getRequestMeta("VIEW");
//     const { base64, pagination } = await streamViewToBase64(
//       url,
//       { ...payload, currentPage: page, pageSize: size },
//       token,
//       onProgress,
//     );
//     return { isView: true, pagination, pdfData: base64 };
//   },

//   // ── EXPORT: opens result in a new browser tab ─────────────────────────────
//   export: async (
//     payload: MemberIdCardRequest,
//     format: string,
//     onProgress?: (percent: number) => void,
//   ): Promise<ReportServiceResult> => {
//     const upperFormat = format.toUpperCase();
//     const { token, url } = await getRequestMeta(upperFormat);
//     const fallbackFilename = `MemberIdCard_${payload.fromDate}_${payload.toDate}.${getFileExtension(upperFormat)}`;
//     const filename = await streamExportToNewTab(
//       url,
//       payload,
//       fallbackFilename,
//       token,
//       onProgress,
//     );
//     return { isView: false, filename };
//   },
// };


import { apiClient } from "./apiClient";
import type { MemberIdCardRequest } from "../../types/api/api";
import {
  PaginationHeader,
  DefaultPagination,
  type PaginationMeta,
} from "@/utilis/Constants/reportConstants";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ReportServiceResult {
  isView: boolean;
  pdfData?: string;
  pagination?: PaginationMeta;
  filename?: string;
}

// ── Private helpers ───────────────────────────────────────────────────────────

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const parsePagination = (header: string | undefined): PaginationMeta => {
  try {
    return header ? JSON.parse(header) : DefaultPagination;
  } catch {
    return DefaultPagination;
  }
};

const extractFilename = (disposition: string): string | null =>
  disposition.match(/filename="?([^";\n]+)"?/)?.[1] ?? null;

// ── Public helper — reused by page for PDF-from-cache download ────────────────

export const triggerDownload = (
  buffer: ArrayBuffer,
  filename: string,
  mimeType = "application/pdf",
): void => {
  const blob = new Blob([buffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ── Core request ──────────────────────────────────────────────────────────────

const fetchReport = async (
  payload: object,
  format: string,
): Promise<{ buffer: ArrayBuffer; headers: Record<string, string> }> => {
  const response = await apiClient.instance.post<ArrayBuffer>(
    "/api/MemberIdCard/MemberIdCard",
    payload,
    {
      params: { format },
      responseType: "arraybuffer", // ✅ no blob, no JSON parse
      headers: { "Content-Type": "application/json" },
    },
  );
  return {
    buffer: response.data,
    headers: response.headers as Record<string, string>,
  };
};

// ── Service ───────────────────────────────────────────────────────────────────

export const memberIdCardService = {
  // ── VIEW ──────────────────────────────────────────────────────────────────
  view: async (
    payload: MemberIdCardRequest,
    page: number,
    size: number,
  ): Promise<ReportServiceResult> => {
    const { buffer, headers } = await fetchReport(
      { ...payload, currentPage: page, pageSize: size },
      "VIEW",
    );
    const pdfData = arrayBufferToBase64(buffer);
    const pagination = parsePagination(headers[PaginationHeader]);
    return { isView: true, pdfData, pagination };
  },

  // ── EXPORT (Word / Excel / Image) ─────────────────────────────────────────
  export: async (
    payload: MemberIdCardRequest,
    format: string,
  ): Promise<ReportServiceResult> => {
    const upperFormat = format.toUpperCase();
    const { buffer, headers } = await fetchReport(payload, upperFormat);
    const disposition = headers["content-disposition"] ?? "";
    const filename =
      extractFilename(disposition) ??
      `MemberIdCard_${payload.fromDate}_${payload.toDate}.pdf`;
    triggerDownload(buffer, filename);
    return { isView: false, filename };
  },
};