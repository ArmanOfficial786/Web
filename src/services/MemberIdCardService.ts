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

// import { getSession } from "next-auth/react";
// import { apiClient } from "./apiClient";
// import {
//   streamViewToNewTab,
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

// const getRequestMeta = async (format: string) => {
//   const session = await getSession();
//   const token = session?.accessToken ?? "";
//   const baseURL = apiClient.instance.defaults.baseURL ?? "";
//   const url = `${baseURL}/api/MemberIdCard/MemberIdCard?format=${format}`;
//   return { token, url };
// };

// export const memberIdCardService = {
//   // ── VIEW ──────────────────────────────────────────────────────────────────
//   // Backend: compressed images → PDF binary (inline)
//   // Frontend: blob URL → window.open → native browser PDF tab
//   // Same UX as old DevExpress ReportViewer
//   view: async (
//     payload: MemberIdCardRequest,
//     page: number,
//     size: number,
//     onProgress?: (percent: number) => void,
//   ): Promise<ReportServiceResult> => {
//     const { token, url } = await getRequestMeta("VIEW");

//     const { pagination } = await streamViewToNewTab(
//       url,
//       { ...payload, currentPage: page, pageSize: size },
//       token,
//       onProgress,
//     );

//     return { isView: true, pagination };
//   },

//   // ── EXPORT ────────────────────────────────────────────────────────────────
//   // Backend: binary blob + Content-Disposition filename
//   // Frontend: stream → Blob → triggerFileDownload
//   export: async (
//     payload: MemberIdCardRequest,
//     format: string,
//     onProgress?: (percent: number) => void,
//   ): Promise<ReportServiceResult> => {
//     const upperFormat = format.toUpperCase();
//     const { token, url } = await getRequestMeta(upperFormat);

//     const fallbackFilename = `MemberIdCard_${payload.fromDate}_${payload.toDate}.${getFileExtension(upperFormat)}`;

//     const filename = await streamDownload(
//       url,
//       payload,
//       fallbackFilename,
//       token,
//       onProgress,
//     );

//     return { isView: false, filename };
//   },
// };

import { getSession } from "next-auth/react";
import { apiClient } from "./apiClient";
import {
  streamViewToBase64,
  streamExportToNewTab,
  getFileExtension,
  type ReportServiceResult,
} from "@/utilis/reportUtils";
import type { MemberIdCardRequest } from "../../types/api/api";

export { triggerFileDownload } from "@/utilis/reportUtils";
export type {
  ReportServiceResult,
  ViewResult,
  DownloadResult,
} from "@/utilis/reportUtils";

const getRequestMeta = async (format: string) => {
  const session = await getSession();
  const token = session?.accessToken ?? "";
  const baseURL = apiClient.instance.defaults.baseURL ?? "";
  const url = `${baseURL}/api/MemberIdCard/MemberIdCard?format=${format}`;
  return { token, url };
};

export const memberIdCardService = {
  // ── VIEW: returns base64 PDF for inline PdfSlideViewer ───────────────────
  view: async (
    payload: MemberIdCardRequest,
    page: number,
    size: number,
    onProgress?: (percent: number) => void,
  ): Promise<ReportServiceResult> => {
    const { token, url } = await getRequestMeta("VIEW");
    const { base64, pagination } = await streamViewToBase64(
      url,
      { ...payload, currentPage: page, pageSize: size },
      token,
      onProgress,
    );
    return { isView: true, pagination, pdfData: base64 };
  },

  // ── EXPORT: opens result in a new browser tab ─────────────────────────────
  export: async (
    payload: MemberIdCardRequest,
    format: string,
    onProgress?: (percent: number) => void,
  ): Promise<ReportServiceResult> => {
    const upperFormat = format.toUpperCase();
    const { token, url } = await getRequestMeta(upperFormat);
    const fallbackFilename = `MemberIdCard_${payload.fromDate}_${payload.toDate}.${getFileExtension(upperFormat)}`;
    const filename = await streamExportToNewTab(
      url,
      payload,
      fallbackFilename,
      token,
      onProgress,
    );
    return { isView: false, filename };
  },
};
