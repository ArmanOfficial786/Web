// import { getSession } from "next-auth/react";
// import { apiClient } from "./apiClient";
// import {
//   unwrapViewResponse,
//   streamDownload,
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

// export const memberIdCardService = {
//   // ── VIEW — axios JSON → base64 PDF for inline preview ────────────────────
//   // ✅ Fix 2: export no longer uses axios blob — no type clash with response.data
//   view: async (
//     payload: MemberIdCardRequest,
//     page: number,
//     size: number,
//   ): Promise<ReportServiceResult> => {
//     const response = await apiClient.api.memberIdCardMemberIdCardCreate(
//       { ...payload, currentPage: page, pageSize: size },
//       { format: "VIEW" },
//       // ✅ No responseType here — response.data is correctly typed as
//       //    ReportResponseDtosGeneralResponse (JSON), not Blob
//     );
//     return { isView: true, report: unwrapViewResponse(response.data) };
//   },

//   // ── EXPORT — fetch stream → chunks flow to browser as they arrive ─────────
//   // ✅ Fix 2: uses fetch, NOT axios — response.data typing issue is gone entirely
//   // ✅ payload MUST match last VIEW call so backend reportKey hits cache
//   export: async (
//     payload: MemberIdCardRequest,
//     format: string,
//     onProgress?: (percent: number) => void,
//   ): Promise<ReportServiceResult> => {
//     const upperFormat = format.toUpperCase();

//     const session = await getSession();
//     const token = session?.accessToken ?? "";
//     const baseURL = apiClient.instance.defaults.baseURL ?? "";
//     const url = `${baseURL}/api/MemberIdCard/MemberIdCard?format=${upperFormat}`;
//     const filename = `MemberIdCard_${payload.fromDate}_${payload.toDate}.${getFileExtension(upperFormat)}`;

//     await streamDownload(url, payload, filename, token, onProgress);

//     return { isView: false, filename };
//   },
// };

import { getSession } from "next-auth/react";
import { apiClient } from "./apiClient";
import {
  unwrapViewResponse,
  streamDownload,
  getFileExtension,
  type ReportServiceResult,
} from "@/utilis/reportUtils";
import type { MemberIdCardRequest } from "../../types/api/api";

// ── Re-exports so pages never import from utils directly ──────────────────────
export { triggerFileDownload } from "@/utilis/reportUtils";
export type {
  ReportServiceResult,
  ViewResult,
  DownloadResult,
} from "@/utilis/reportUtils";

// ── Shared: build export URL + get auth token ─────────────────────────────────
const getExportMeta = async (format: string) => {
  const session = await getSession();
  const token = session?.accessToken ?? "";
  const baseURL = apiClient.instance.defaults.baseURL ?? "";
  const url = `${baseURL}/api/MemberIdCard/MemberIdCard?format=${format}`;
  return { token, url };
};

export const memberIdCardService = {
  // ── VIEW — axios JSON → GeneralResponse<ReportResponseDtos> ──────────────
  // Returns base64 pdfData + pagination
  // Also caches rendered HTML on backend for subsequent exports
  // ✅ Axios interceptor handles auth + error toasting automatically
  view: async (
    payload: MemberIdCardRequest,
    page: number,
    size: number,
  ): Promise<ReportServiceResult> => {
    const response = await apiClient.api.memberIdCardMemberIdCardCreate(
      { ...payload, currentPage: page, pageSize: size },
      { format: "VIEW" },
    );
    return { isView: true, report: unwrapViewResponse(response.data) };
  },

  // ── EXPORT — fetch stream → binary file → browser download ───────────────
  // payload MUST match last VIEW call so backend reportKey hits cache
  // Backend returns filename in Content-Disposition header — we use that directly
  // fallback filename only used when backend sends no Content-Disposition
  export: async (
    payload: MemberIdCardRequest,
    format: string,
    onProgress?: (percent: number) => void,
  ): Promise<ReportServiceResult> => {
    const upperFormat = format.toUpperCase();
    const { token, url } = await getExportMeta(upperFormat);

    // ✅ Fallback only — backend filename from Content-Disposition takes priority
    const fallbackFilename = `MemberIdCard_${payload.fromDate}_${payload.toDate}.${getFileExtension(upperFormat)}`;

    await streamDownload(url, payload, fallbackFilename, token, onProgress);

    return { isView: false, filename: fallbackFilename };
  },
};
