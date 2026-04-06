// import type {
//   ReportResponseDtos,
//   ReportResponseDtosGeneralResponse,
// } from "../../types/api/api";

// // ── Extension map ─────────────────────────────────────────────────────────────
// export const EXT_MAP: Record<string, string> = {
//   PDF: "pdf",
//   WORD: "docx",
//   DOCX: "docx",
//   XLSX: "xlsx",
//   EXCEL: "xlsx",
//   PNG: "png",
//   IMAGE: "png",
// };

// export const getFileExtension = (format: string): string =>
//   EXT_MAP[format.toUpperCase()] ?? format.toLowerCase();

// // ── Generic return types ──────────────────────────────────────────────────────
// export type ViewResult = {
//   isView: true;
//   report: ReportResponseDtos;
// };

// export type DownloadResult = {
//   isView: false;
//   blob: Blob;
//   filename: string;
// };

// export type ReportServiceResult = ViewResult | DownloadResult;

// // ── Unwrap view response ──────────────────────────────────────────────────────
// // ✅ Interceptor already showed the toast — just throw so page catches it
// export const unwrapViewResponse = (data: unknown): ReportResponseDtos => {
//   const res = data as ReportResponseDtosGeneralResponse;

//   if (!res.isValid || res.statusCode !== 200) {
//     // Interceptor already toasted — throw silently to stop execution
//     throw new Error();
//   }

//   if (!res.data?.pdfData) {
//     throw new Error();
//   }

//   return res.data;
// };

// // ── Build blob ────────────────────────────────────────────────────────────────
// export const buildBlob = (data: unknown): Blob =>
//   data instanceof Blob
//     ? data
//     : new Blob([data as any], { type: "application/octet-stream" });

// // ── Trigger file download ─────────────────────────────────────────────────────
// export const triggerFileDownload = (blob: Blob, filename: string): void => {
//   const url = window.URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   window.URL.revokeObjectURL(url);
// };

// import type {
//   ReportResponseDtos,
//   ReportResponseDtosGeneralResponse,
// } from "../../types/api/api";

// // ── Extension map ─────────────────────────────────────────────────────────────
// export const EXT_MAP: Record<string, string> = {
//   PDF: "pdf",
//   WORD: "docx",
//   DOCX: "docx",
//   XLSX: "xlsx",
//   EXCEL: "xlsx",
//   PNG: "png",
//   IMAGE: "png",
// };

// export const getFileExtension = (format: string): string =>
//   EXT_MAP[format.toUpperCase()] ?? format.toLowerCase();

// // ── Return types ──────────────────────────────────────────────────────────────
// export type ViewResult = {
//   isView: true;
//   report: ReportResponseDtos;
// };

// export type DownloadResult = {
//   isView: false;
//   blob: Blob;
//   filename: string;
// };

// export type ReportServiceResult = ViewResult | DownloadResult;

// // ── Unwrap view response ──────────────────────────────────────────────────────
// // Interceptor already shows the toast — throw silently so the page catches it
// export const unwrapViewResponse = (data: unknown): ReportResponseDtos => {
//   const res = data as ReportResponseDtosGeneralResponse;

//   if (!res.isValid || res.statusCode !== 200 || !res.data?.pdfData) {
//     throw new Error();
//   }

//   return res.data;
// };

// // ── Build blob ────────────────────────────────────────────────────────────────
// export const buildBlob = (data: unknown): Blob =>
//   data instanceof Blob
//     ? data
//     : new Blob([data as BlobPart], { type: "application/octet-stream" });

// // ── Trigger file download ─────────────────────────────────────────────────────
// export const triggerFileDownload = (blob: Blob, filename: string): void => {
//   const url = URL.createObjectURL(blob);
//   const link = Object.assign(document.createElement("a"), {
//     href: url,
//     download: filename,
//   });

//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);
// };
import type {
  ReportResponseDtos,
  ReportResponseDtosGeneralResponse,
} from "../../types/api/api";

// ── Return types ──────────────────────────────────────────────────────────────
export type ViewResult = {
  isView: true;
  report: ReportResponseDtos;
};

export type DownloadResult = {
  isView: false;
  blob: Blob;
  filename: string;
};

export type ReportServiceResult = ViewResult | DownloadResult;

// ── Unwrap view response (JSON) ───────────────────────────────────────────────
// Interceptor already shows the toast — throw silently so page catches it
export const unwrapViewResponse = (data: unknown): ReportResponseDtos => {
  const res = data as ReportResponseDtosGeneralResponse;
  if (!res.isValid || res.statusCode !== 200 || !res.data?.pdfData) {
    throw new Error();
  }
  return res.data;
};

// ── Trigger browser file download ─────────────────────────────────────────────
export const triggerFileDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  });
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
