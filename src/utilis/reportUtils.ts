// import type {
//   ReportResponseDtos,
//   ReportResponseDtosGeneralResponse,
// } from "../../types/api/api";

// // ── Return types ──────────────────────────────────────────────────────────────
// export type ViewResult = { isView: true; report: ReportResponseDtos };
// export type DownloadResult = { isView: false; filename: string };
// export type ReportServiceResult = ViewResult | DownloadResult;

// // ── Extension map ─────────────────────────────────────────────────────────────
// const EXT_MAP: Record<string, string> = {
//   PDF: "pdf",
//   WORD: "docx",
//   XLSX: "xlsx",
//   Excel: "excel",
//   PNG: "png",
// };

// export const getFileExtension = (format: string): string =>
//   EXT_MAP[format.toUpperCase()] ?? format.toLowerCase();

// // ── Unwrap VIEW response ──────────────────────────────────────────────────────
// export const unwrapViewResponse = (data: unknown): ReportResponseDtos => {
//   const res = data as ReportResponseDtosGeneralResponse;
//   if (!res.isValid || res.statusCode !== 200 || !res.data?.pdfData) {
//     throw new Error();
//   }
//   return res.data;
// };

// // ── Trigger download from a Blob ──────────────────────────────────────────────
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

// // ── Stream download — chunks flow directly, no full buffer in memory ──────────
// export const streamDownload = async (
//   url: string,
//   body: unknown,
//   filename: string,
//   token: string,
//   onProgress?: (percent: number) => void,
// ): Promise<void> => {
//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(body),
//   });

//   if (!response.ok) {
//     const contentType = response.headers.get("content-type") ?? "";
//     if (contentType.includes("application/json")) {
//       const err = await response.json();
//       throw new Error(err?.message ?? `Download failed: ${response.status}`);
//     }
//     throw new Error(`Download failed: ${response.status}`);
//   }

//   // ── Prefer filename from Content-Disposition ──────────────────────────────
//   const disposition = response.headers.get("content-disposition") ?? "";
//   const headerName = disposition.match(/filename="([^"]+)"/)?.[1] ?? null;
//   const finalName = headerName ?? filename;

//   const contentLength = Number(response.headers.get("content-length") ?? 0);
//   const reader = response.body!.getReader();

//   // ✅ Fix 1: typed as Uint8Array<ArrayBuffer>[] — avoids SharedArrayBuffer mismatch
//   const chunks: Uint8Array<ArrayBuffer>[] = [];
//   let received = 0;

//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) break;

//     // ✅ Fix 1: slice() always returns Uint8Array<ArrayBuffer>, never SharedArrayBuffer
//     chunks.push(value.slice(0) as Uint8Array<ArrayBuffer>);
//     received += value.length;

//     if (contentLength && onProgress) {
//       onProgress(Math.round((received / contentLength) * 100));
//     }
//   }

//   // ✅ Fix 1: cast to BlobPart[] — TS accepts this safely after slice()
//   const blob = new Blob(chunks as BlobPart[]);
//   triggerFileDownload(blob, finalName);
// };

// import type {
//   ReportResponseDtos,
//   ReportResponseDtosGeneralResponse,
// } from "../../types/api/api";

// // ── Return types ──────────────────────────────────────────────────────────────
// export type ViewResult = { isView: true; report: ReportResponseDtos };
// export type DownloadResult = { isView: false; filename: string };
// export type ReportServiceResult = ViewResult | DownloadResult;

// // ── Extension map ─────────────────────────────────────────────────────────────
// const EXT_MAP: Record<string, string> = {
//   PDF: "pdf",
//   WORD: "docx",
//   XLSX: "xlsx",
//   PNG: "png",
// };

// export const getFileExtension = (format: string): string =>
//   EXT_MAP[format.toUpperCase()] ?? format.toLowerCase();

// // ── Unwrap VIEW JSON response ─────────────────────────────────────────────────
// export const unwrapViewResponse = (data: unknown): ReportResponseDtos => {
//   const res = data as ReportResponseDtosGeneralResponse;
//   if (!res.isValid || res.statusCode !== 200 || !res.data?.pdfData) {
//     throw new Error();
//   }
//   return res.data;
// };

// // ── Trigger browser download from Blob ────────────────────────────────────────
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

// // ── Extract filename from Content-Disposition header ─────────────────────────
// // Handles all three formats backend may send:
// // 1. filename=MemberIdCardReport_20260406.pdf          (unquoted)
// // 2. filename="MemberIdCardReport_20260406.pdf"        (quoted)
// // 3. filename*=UTF-8''MemberIdCardReport_20260406.pdf  (RFC 5987 encoded)
// const extractFilename = (disposition: string): string | null => {
//   // ✅ Try filename* first — most accurate, handles UTF-8 names
//   const encodedMatch = disposition.match(/filename\*=UTF-8''([^\s;]+)/i);
//   if (encodedMatch?.[1]) {
//     return decodeURIComponent(encodedMatch[1]);
//   }

//   // ✅ Fallback — handles both quoted and unquoted plain filename
//   const plainMatch = disposition.match(/filename\*?=(?:"([^"]+)"|([^\s;]+))/i);
//   return plainMatch?.[1] ?? plainMatch?.[2] ?? null;
// };

// // ── Stream download ───────────────────────────────────────────────────────────
// // Chunks flow directly to memory as they arrive — no full buffer wait
// // fallbackFilename only used when backend sends no Content-Disposition
// export const streamDownload = async (
//   url: string,
//   body: unknown,
//   fallbackFilename: string,
//   token: string,
//   onProgress?: (percent: number) => void,
// ): Promise<void> => {
//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(body),
//   });

//   // ── Error handling ────────────────────────────────────────────────────────
//   if (!response.ok) {
//     const ct = response.headers.get("content-type") ?? "";
//     const contentLength = Number(response.headers.get("content-length") ?? 0);

//     // ✅ Only parse JSON error if body is small — large bodies are never error messages
//     if (
//       ct.includes("application/json") &&
//       (contentLength === 0 || contentLength < 10_000)
//     ) {
//       try {
//         const err = await response.json();
//         throw new Error(
//           err?.message ?? err?.error ?? `Request failed: ${response.status}`,
//         );
//       } catch (e) {
//         if (e instanceof Error && !e.message.startsWith("Request failed"))
//           throw e;
//       }
//     }
//     throw new Error(
//       `Request failed: ${response.status} ${response.statusText}`,
//     );
//   }

//   // ── Filename — prefer backend header, fall back to frontend-built name ────
//   const disposition = response.headers.get("content-disposition") ?? "";
//   const finalName = extractFilename(disposition) ?? fallbackFilename;

//   // ── Stream chunks ─────────────────────────────────────────────────────────
//   const contentLength = Number(response.headers.get("content-length") ?? 0);
//   const reader = response.body!.getReader();
//   const chunks: Uint8Array<ArrayBuffer>[] = [];
//   let received = 0;

//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) break;
//     // ✅ slice() ensures ArrayBuffer never SharedArrayBuffer — fixes TS error
//     chunks.push(value.slice(0) as Uint8Array<ArrayBuffer>);
//     received += value.length;
//     if (contentLength && onProgress) {
//       onProgress(Math.round((received / contentLength) * 100));
//     }
//   }

//   triggerFileDownload(new Blob(chunks as BlobPart[]), finalName);
// };

// import type { ReportResponseDtos } from "../../types/api/api";

// // ── Return types ──────────────────────────────────────────────────────────────
// export type ViewResult = {
//   isView: true;
//   pagination: ReportResponseDtos["pagination"];
// };
// export type DownloadResult = { isView: false; filename: string };
// export type ReportServiceResult = ViewResult | DownloadResult;

// // ── Extension map ─────────────────────────────────────────────────────────────
// const EXT_MAP: Record<string, string> = {
//   PDF: "pdf",
//   WORD: "docx",
//   XLSX: "xlsx",
//   PNG: "png",
// };

// export const getFileExtension = (format: string): string =>
//   EXT_MAP[format.toUpperCase()] ?? format.toLowerCase();

// // ── Parse pagination from X-Pagination response header ───────────────────────
// export const unwrapPaginationHeader = (
//   headers: Headers,
// ): ReportResponseDtos["pagination"] => {
//   const raw = headers.get("x-pagination");
//   if (!raw) return undefined;
//   try {
//     return JSON.parse(raw);
//   } catch {
//     return undefined;
//   }
// };

// // ── Trigger browser download from Blob ────────────────────────────────────────
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

// // ── Extract filename from Content-Disposition header ─────────────────────────
// const extractFilename = (disposition: string): string | null => {
//   const encodedMatch = disposition.match(/filename\*=UTF-8''([^\s;]+)/i);
//   if (encodedMatch?.[1]) return decodeURIComponent(encodedMatch[1]);
//   const plainMatch = disposition.match(/filename\*?=(?:"([^"]+)"|([^\s;]+))/i);
//   return plainMatch?.[1] ?? plainMatch?.[2] ?? null;
// };

// // ── Core: stream binary response → Blob ──────────────────────────────────────
// const streamToBlob = async (
//   url: string,
//   body: unknown,
//   token: string,
//   onProgress?: (percent: number) => void,
// ): Promise<{ blob: Blob; filename: string | null; headers: Headers }> => {
//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(body),
//   });

//   if (!response.ok) {
//     const ct = response.headers.get("content-type") ?? "";
//     const contentLength = Number(response.headers.get("content-length") ?? 0);

//     if (
//       ct.includes("application/json") &&
//       (contentLength === 0 || contentLength < 10_000)
//     ) {
//       try {
//         const err = await response.json();
//         throw new Error(
//           err?.message ?? err?.error ?? `Request failed: ${response.status}`,
//         );
//       } catch (e) {
//         if (e instanceof Error && !e.message.startsWith("Request failed"))
//           throw e;
//       }
//     }
//     throw new Error(
//       `Request failed: ${response.status} ${response.statusText}`,
//     );
//   }

//   const contentLength = Number(response.headers.get("content-length") ?? 0);
//   const reader = response.body!.getReader();
//   const chunks: Uint8Array<ArrayBuffer>[] = [];
//   let received = 0;

//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) break;
//     chunks.push(value.slice(0) as Uint8Array<ArrayBuffer>);
//     received += value.length;
//     if (contentLength && onProgress) {
//       onProgress(Math.round((received / contentLength) * 100));
//     }
//   }

//   return {
//     blob: new Blob(chunks as BlobPart[]),
//     filename: extractFilename(
//       response.headers.get("content-disposition") ?? "",
//     ),
//     headers: response.headers,
//   };
// };

// // ── VIEW: stream → Blob → open in NEW TAB ────────────────────────────────────
// // Matches old DevExpress ReportViewer behaviour:
// //   user sees native browser PDF viewer → can print, zoom, save as PDF
// // No iframe — no memory leak — browser handles the PDF natively
// export const streamViewToNewTab = async (
//   url: string,
//   body: unknown,
//   token: string,
//   onProgress?: (percent: number) => void,
// ): Promise<{ pagination: ReportResponseDtos["pagination"] }> => {
//   const { blob, headers } = await streamToBlob(url, body, token, onProgress);

//   // ✅ Create object URL and open in new tab — same as old project's new tab PDF
//   const objectUrl = URL.createObjectURL(blob);
//   const tab = window.open(objectUrl, "_blank");

//   // ✅ Revoke after tab has loaded — short delay is enough
//   // Tab holds its own reference; revoking the URL does not close the tab
//   setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);

//   if (!tab) {
//     // Popup blocked — fallback: download instead
//     triggerFileDownload(blob, "MemberIdCardReport.pdf");
//   }

//   return { pagination: unwrapPaginationHeader(headers) };
// };

// // ── EXPORT: stream → Blob → immediate download ────────────────────────────────
// export const streamDownload = async (
//   url: string,
//   body: unknown,
//   fallbackFilename: string,
//   token: string,
//   onProgress?: (percent: number) => void,
// ): Promise<string> => {
//   const { blob, filename } = await streamToBlob(url, body, token, onProgress);
//   const finalName = filename ?? fallbackFilename;
//   triggerFileDownload(blob, finalName);
//   return finalName;
// };

import type { ReportResponseDtos } from "../../types/api/api";

// ── Return types ──────────────────────────────────────────────────────────────
export type ViewResult = {
  isView: true;
  pagination: ReportResponseDtos["pagination"];
  pdfData: string;
};
export type DownloadResult = { isView: false; filename: string };
export type ReportServiceResult = ViewResult | DownloadResult;

// ── Extension map ─────────────────────────────────────────────────────────────
const EXT_MAP: Record<string, string> = {
  PDF: "pdf",
  WORD: "docx",
  XLSX: "xlsx",
  PNG: "png",
};

export const getFileExtension = (format: string): string =>
  EXT_MAP[format.toUpperCase()] ?? format.toLowerCase();

// ── Parse pagination from X-Pagination response header ───────────────────────
export const unwrapPaginationHeader = (
  headers: Headers,
): ReportResponseDtos["pagination"] => {
  const raw = headers.get("x-pagination");
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
};

// ── Trigger browser download from Blob ────────────────────────────────────────
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

// ── Extract filename from Content-Disposition header ─────────────────────────
const extractFilename = (disposition: string): string | null => {
  const encodedMatch = disposition.match(/filename\*=UTF-8''([^\s;]+)/i);
  if (encodedMatch?.[1]) return decodeURIComponent(encodedMatch[1]);
  const plainMatch = disposition.match(/filename\*?=(?:"([^"]+)"|([^\s;]+))/i);
  return plainMatch?.[1] ?? plainMatch?.[2] ?? null;
};

// ── Core: stream binary response → Blob ──────────────────────────────────────
const streamToBlob = async (
  url: string,
  body: unknown,
  token: string,
  onProgress?: (percent: number) => void,
): Promise<{ blob: Blob; filename: string | null; headers: Headers }> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const ct = response.headers.get("content-type") ?? "";
    const contentLength = Number(response.headers.get("content-length") ?? 0);

    if (
      ct.includes("application/json") &&
      (contentLength === 0 || contentLength < 10_000)
    ) {
      try {
        const err = await response.json();
        throw new Error(
          err?.message ?? err?.error ?? `Request failed: ${response.status}`,
        );
      } catch (e) {
        if (e instanceof Error && !e.message.startsWith("Request failed"))
          throw e;
      }
    }
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`,
    );
  }

  const contentLength = Number(response.headers.get("content-length") ?? 0);
  const reader = response.body!.getReader();
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value.slice(0) as Uint8Array<ArrayBuffer>);
    received += value.length;
    if (contentLength && onProgress) {
      onProgress(Math.round((received / contentLength) * 100));
    }
  }

  return {
    blob: new Blob(chunks as BlobPart[]),
    filename: extractFilename(
      response.headers.get("content-disposition") ?? "",
    ),
    headers: response.headers,
  };
};

// ── VIEW: stream → Blob → base64 (for inline PdfSlideViewer) ─────────────────
export const streamViewToBase64 = async (
  url: string,
  body: unknown,
  token: string,
  onProgress?: (percent: number) => void,
): Promise<{
  base64: string;
  pagination: ReportResponseDtos["pagination"];
}> => {
  const { blob, headers } = await streamToBlob(url, body, token, onProgress);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      // strip the "data:application/pdf;base64," prefix
      const base64 = dataUrl.split(",")[1] ?? "";
      resolve({ base64, pagination: unwrapPaginationHeader(headers) });
    };
    reader.onerror = () => reject(new Error("Failed to convert PDF to base64"));
    reader.readAsDataURL(blob);
  });
};

// ── EXPORT: stream → Blob → open in new browser tab ──────────────────────────
export const streamExportToNewTab = async (
  url: string,
  body: unknown,
  fallbackFilename: string,
  token: string,
  onProgress?: (percent: number) => void,
): Promise<string> => {
  const { blob, filename } = await streamToBlob(url, body, token, onProgress);
  const finalName = filename ?? fallbackFilename;

  const objectUrl = URL.createObjectURL(blob);
  const tab = window.open(objectUrl, "_blank");

  // Revoke after tab has loaded — tab holds its own reference
  setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);

  if (!tab) {
    // Popup blocked — fallback: download instead
    triggerFileDownload(blob, finalName);
  }

  return finalName;
};
