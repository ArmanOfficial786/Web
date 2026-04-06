// import { apiClient } from "./apiClient";
// import { MemberIdCardRequest } from "../../types/api/api";

// export const memberIdCardService = {
//   getReport: async (payload: MemberIdCardRequest, format = "VIEW") => {
//     const response = await apiClient.api.memberIdCardMemberIdCardCreate(
//       payload,
//       { format },
//     );

//     return response.data;
//   },
// };

// import { apiClient } from "./apiClient";
// import { MemberIdCardRequest } from "../../types/api/api";

// export const memberIdCardService = {
//   getReport: async (payload: MemberIdCardRequest, format = "VIEW") => {
//     const isDownload = format.toUpperCase() !== "VIEW";

//     const response = await apiClient.api.memberIdCardMemberIdCardCreate(
//       payload,
//       { format },
//       // ✅ For download formats, tell axios to expect a binary Blob response.
//       // Without this, axios parses the binary as text/JSON and corrupts the file.
//       isDownload ? { format: "blob" } : {},
//     );

//     return response.data;
//   },
// };

// import { apiClient } from "./apiClient";
// // ✅ Request type  → generated file (auto-updated on regeneration)
// import { MemberIdCardRequest } from "../../types/api/api";
// // ✅ Response type → hand-written file (never overwritten by the generator)
// // import  MemberIdCardViewResponse  from "../../types/api/api";

// export const memberIdCardService = {
//   getReport: async (
//     payload: MemberIdCardRequest,
//     format = "VIEW",
//   ): Promise<MemberIdCardViewResponse | Blob> => {
//     const isDownload = format.toUpperCase() !== "VIEW";

//     const response = await apiClient.api.memberIdCardMemberIdCardCreate(
//       payload,
//       { format },
//       isDownload ? { format: "blob" } : {},
//     );

//     // generated return is `void` — single cast lives here and nowhere else
//     return response.data as unknown as MemberIdCardViewResponse | Blob;
//   },
// };

// import { apiClient } from "./apiClient";
// import type {
//   MemberIdCardRequest,
//   ReportResponseDtosGeneralResponse,
//   ReportResponseDtos,
// } from "../../types/api/api";

// export interface ReportServiceResult {
//   isView: true;
//   wrapper: ReportResponseDtosGeneralResponse;
//   report: ReportResponseDtos;
// }

// export interface DownloadServiceResult {
//   isView: false;
//   blob: Blob;
// }

// export type MemberIdCardServiceResult =
//   | ReportServiceResult
//   | DownloadServiceResult;

// export const memberIdCardService = {
//   getReport: async (
//     payload: MemberIdCardRequest,
//     format = "VIEW",
//   ): Promise<MemberIdCardServiceResult> => {
//     const isView = format.toUpperCase() === "VIEW";

//     const response = await apiClient.api.memberIdCardMemberIdCardCreate(
//       payload,
//       { format },
//       isView ? {} : { format: "blob" }, // ✅ format not responseType
//     );

//     // ── VIEW — unwrap GeneralResponse → ReportResponseDtos ────────────────
//     if (isView) {
//       const wrapper =
//         response.data as unknown as ReportResponseDtosGeneralResponse;
//       const report = wrapper.data as ReportResponseDtos;
//       return { isView: true, wrapper, report };
//     }

//     // ── DOWNLOAD — return raw blob ─────────────────────────────────────────
//     const blob =
//       response.data instanceof Blob
//         ? response.data
//         : new Blob([response.data as any], {
//             type: "application/octet-stream",
//           });

//     return { isView: false, blob };
//   },
// };

// import { apiClient } from "./apiClient";
// import {
//   unwrapViewResponse,
//   buildBlob,
//   getFileExtension,
//   type ReportServiceResult,
// } from "@/utilis/reportUtils";
// import type { MemberIdCardRequest } from "../../types/api/api";

// export const memberIdCardService = {
//   getReport: async (
//     payload: MemberIdCardRequest,
//     format = "VIEW",
//   ): Promise<ReportServiceResult> => {
//     const upperFormat = format.toUpperCase();
//     const isView = upperFormat === "VIEW";

//     const response = await apiClient.api.memberIdCardMemberIdCardCreate(
//       payload,
//       { format: upperFormat },
//       isView ? {} : ({ responseType: "blob" } as any), // ✅ responseType goes in axios config, not api params
//     );

//     if (isView) {
//       return { isView: true, report: unwrapViewResponse(response.data) };
//     }

//     return {
//       isView: false,
//       blob: buildBlob(response.data),
//       filename: `MemberIdCard_${payload.fromDate}_to_${payload.toDate}.${getFileExtension(upperFormat)}`,
//     };
//   },
// };

// import { apiClient } from "./apiClient";
// import {
//   unwrapViewResponse,
//   buildBlob,
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
//   view: async (
//     payload: MemberIdCardRequest,
//     page: number,
//     size: number,
//   ): Promise<ReportServiceResult> => {
//     const response = await apiClient.api.memberIdCardMemberIdCardCreate(
//       { ...payload, currentPage: page, pageSize: size },
//       { format: "VIEW" },
//     );
//     return { isView: true, report: unwrapViewResponse(response.data) };
//   },

//   export: async (
//     payload: MemberIdCardRequest,
//     format: string,
//   ): Promise<ReportServiceResult> => {
//     const upperFormat = format.toUpperCase();
//     const response = await apiClient.api.memberIdCardMemberIdCardCreate(
//       payload,
//       { format: upperFormat },
//       { responseType: "blob" } as any,
//     );
//     return {
//       isView: false,
//       blob: buildBlob(response.data),
//       filename: `MemberIdCard_${payload.fromDate}_to_${payload.toDate}.${getFileExtension(upperFormat)}`,
//     };
//   },
// };

import { apiClient } from "./apiClient";
import {
  unwrapViewResponse,
  triggerFileDownload,
  type ReportServiceResult,
} from "@/utilis/reportUtils";
import type { MemberIdCardRequest } from "../../types/api/api";

export { triggerFileDownload } from "@/utilis/reportUtils";
export type {
  ReportServiceResult,
  ViewResult,
  DownloadResult,
} from "@/utilis/reportUtils";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ENDPOINT = `${BASE_URL}/api/MemberIdCard/MemberIdCard`;

// Extension lookup — format param → file extension
const EXT: Record<string, string> = {
  PDF: "pdf",
  WORD: "docx",
  XLSX: "xlsx",
  PNG: "png",
};

export const memberIdCardService = {
  // ── VIEW — axios (JSON) → base64 pdfData for inline preview ─────────────
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

  // ── EXPORT — fetch (blob) → browser download ─────────────────────────────
  // Uses fetch directly (not axios) so interceptors don't corrupt the blob.
  // Filename is constructed simply — no content-disposition parsing needed.
  export: async (
    payload: MemberIdCardRequest,
    format: string,
  ): Promise<void> => {
    const upperFormat = format.toUpperCase();

    const response = await apiClient.api.memberIdCardMemberIdCardCreate(
      payload,
      { format: upperFormat },
      { responseType: "blob" } as any, // 👈 required workaround
    );

    // Extract blob safely
    const blob =
      response.data instanceof Blob
        ? response.data
        : new Blob([response.data as any], {
            type: "application/octet-stream",
          });

    const ext = EXT[upperFormat] ?? upperFormat.toLowerCase();
    const filename = `MemberIdCard_${payload.fromDate}_${payload.toDate}.${ext}`;

    triggerFileDownload(blob, filename);
  },
};
