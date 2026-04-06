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

import type {
  ReportResponseDtos,
  ReportResponseDtosGeneralResponse,
} from "../../types/api/api";

// ── Return types ──────────────────────────────────────────────────────────────
export type ViewResult = { isView: true; report: ReportResponseDtos };
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

// ── Unwrap VIEW JSON response ─────────────────────────────────────────────────
export const unwrapViewResponse = (data: unknown): ReportResponseDtos => {
  const res = data as ReportResponseDtosGeneralResponse;
  if (!res.isValid || res.statusCode !== 200 || !res.data?.pdfData) {
    throw new Error();
  }
  return res.data;
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
// Handles all three formats backend may send:
// 1. filename=MemberIdCardReport_20260406.pdf          (unquoted)
// 2. filename="MemberIdCardReport_20260406.pdf"        (quoted)
// 3. filename*=UTF-8''MemberIdCardReport_20260406.pdf  (RFC 5987 encoded)
const extractFilename = (disposition: string): string | null => {
  // ✅ Try filename* first — most accurate, handles UTF-8 names
  const encodedMatch = disposition.match(/filename\*=UTF-8''([^\s;]+)/i);
  if (encodedMatch?.[1]) {
    return decodeURIComponent(encodedMatch[1]);
  }

  // ✅ Fallback — handles both quoted and unquoted plain filename
  const plainMatch = disposition.match(/filename\*?=(?:"([^"]+)"|([^\s;]+))/i);
  return plainMatch?.[1] ?? plainMatch?.[2] ?? null;
};

// ── Stream download ───────────────────────────────────────────────────────────
// Chunks flow directly to memory as they arrive — no full buffer wait
// fallbackFilename only used when backend sends no Content-Disposition
export const streamDownload = async (
  url: string,
  body: unknown,
  fallbackFilename: string,
  token: string,
  onProgress?: (percent: number) => void,
): Promise<void> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  // ── Error handling ────────────────────────────────────────────────────────
  if (!response.ok) {
    const ct = response.headers.get("content-type") ?? "";
    const contentLength = Number(response.headers.get("content-length") ?? 0);

    // ✅ Only parse JSON error if body is small — large bodies are never error messages
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

  // ── Filename — prefer backend header, fall back to frontend-built name ────
  const disposition = response.headers.get("content-disposition") ?? "";
  const finalName = extractFilename(disposition) ?? fallbackFilename;

  // ── Stream chunks ─────────────────────────────────────────────────────────
  const contentLength = Number(response.headers.get("content-length") ?? 0);
  const reader = response.body!.getReader();
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    // ✅ slice() ensures ArrayBuffer never SharedArrayBuffer — fixes TS error
    chunks.push(value.slice(0) as Uint8Array<ArrayBuffer>);
    received += value.length;
    if (contentLength && onProgress) {
      onProgress(Math.round((received / contentLength) * 100));
    }
  }

  triggerFileDownload(new Blob(chunks as BlobPart[]), finalName);
};
