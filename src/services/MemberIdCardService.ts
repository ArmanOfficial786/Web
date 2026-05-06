// import { apiClient } from "./apiClient";
// import type { MemberIdCardRequest } from "../../types/api/api";
// import {
//   PaginationHeader,
//   DefaultPagination,
//   type PaginationMeta,
// } from "@/utilis/Constants/reportConstants";

// // ── Types ─────────────────────────────────────────────────────────────────────

// export interface ReportServiceResult {
//   isView: boolean;
//   pdfData?: string;
//   pagination?: PaginationMeta;
//   filename?: string;
// }

// // ── Private helpers ───────────────────────────────────────────────────────────

// const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
//   const bytes = new Uint8Array(buffer);
//   let binary = "";
//   for (let i = 0; i < bytes.byteLength; i++) {
//     binary += String.fromCharCode(bytes[i]);
//   }
//   return btoa(binary);
// };

// const parsePagination = (header: string | undefined): PaginationMeta => {
//   try {
//     return header ? JSON.parse(header) : DefaultPagination;
//   } catch {
//     return DefaultPagination;
//   }
// };

// const extractFilename = (disposition: string): string | null =>
//   disposition.match(/filename="?([^";\n]+)"?/)?.[1] ?? null;

// // ── Public helper — reused by page for PDF-from-cache download ────────────────

// export const triggerDownload = (
//   buffer: ArrayBuffer,
//   filename: string,
//   mimeType = "application/pdf",
// ): void => {
//   const blob = new Blob([buffer], { type: mimeType });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename;
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
//   URL.revokeObjectURL(url);
// };

// // ── Core request ──────────────────────────────────────────────────────────────

// const fetchReport = async (
//   payload: object,
//   format: string,
// ): Promise<{ buffer: ArrayBuffer; headers: Record<string, string> }> => {
//   const response = await apiClient.instance.post<ArrayBuffer>(
//     "/api/MemberIdCard/MemberIdCard",
//     payload,
//     {
//       params: { format },
//       responseType: "arraybuffer", // ✅ no blob, no JSON parse
//       headers: { "Content-Type": "application/json" },
//     },
//   );
//   return {
//     buffer: response.data,
//     headers: response.headers as Record<string, string>,
//   };
// };

// // ── Service ───────────────────────────────────────────────────────────────────

// export const memberIdCardService = {
//   // ── VIEW ──────────────────────────────────────────────────────────────────
//   view: async (
//     payload: MemberIdCardRequest,
//     page: number,
//     size: number,
//   ): Promise<ReportServiceResult> => {
//     const { buffer, headers } = await fetchReport(
//       { ...payload, currentPage: page, pageSize: size },
//       "VIEW",
//     );
//     const pdfData = arrayBufferToBase64(buffer);
//     const pagination = parsePagination(headers[PaginationHeader]);
//     return { isView: true, pdfData, pagination };
//   },

//   // ── EXPORT (Word / Excel / Image) ─────────────────────────────────────────
//   export: async (
//     payload: MemberIdCardRequest,
//     format: string,
//   ): Promise<ReportServiceResult> => {
//     const upperFormat = format.toUpperCase();
//     const { buffer, headers } = await fetchReport(payload, upperFormat);
//     const disposition = headers["content-disposition"] ?? "";
//     const filename =
//       extractFilename(disposition) ??
//       `MemberIdCard_${payload.fromDate}_${payload.toDate}.pdf`;
//     triggerDownload(buffer, filename);
//     return { isView: false, filename };
//   },
// };

import { Api } from "../../types/api/api";
import {
  requestInterceptor,
  successResponseInterceptor,
  errorResponseInterceptor,
} from "./Interceptor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ── API Instance ──────────────────────────────────────────────────────────────
const memberIdCardService = new Api({ baseURL: apiUrl });

// ✅ Key fix: Configure request interceptor to set responseType based on format param
// Both VIEW and EXPORT get blob response
const originalRequestInterceptor = requestInterceptor;
const customRequestInterceptor = async (config: any) => {
  // Call original interceptor for auth headers, etc.
  const configWithAuth = await originalRequestInterceptor(config);

  // ✅ If format is VIEW/PDF/WORD/EXCEL/IMAGE, set responseType to blob
  // This applies to BOTH view and export requests
  if (configWithAuth.params?.format) {
    const format = configWithAuth.params.format.toLowerCase();
    if (["pdf", "word", "excel", "image"].includes(format)) {
      configWithAuth.responseType = "blob";
    }
  }

  return configWithAuth;
};

memberIdCardService.instance.interceptors.request.use(customRequestInterceptor);
memberIdCardService.instance.interceptors.response.use(
  successResponseInterceptor,
  errorResponseInterceptor,
);

export default memberIdCardService;
