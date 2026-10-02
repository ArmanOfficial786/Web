
















































import type { ReportResponseDtos } from "../../types/api/api";

export type ViewResult = {
  isView: true;
  pagination: ReportResponseDtos["pagination"];
  pdfData: string;
};
export type DownloadResult = { isView: false; filename: string };
export type ReportServiceResult = ViewResult | DownloadResult;

const EXT_MAP: Record<string, string> = {
  PDF: "pdf",
  WORD: "docx",
  XLSX: "xlsx",
  PNG: "png",
};

export const getFileExtension = (format: string): string =>
  EXT_MAP[format.toUpperCase()] ?? format.toLowerCase();

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

const extractFilename = (disposition: string): string | null => {
  const encodedMatch = disposition.match(/filename\*=UTF-8''([^\s;]+)/i);
  if (encodedMatch?.[1]) return decodeURIComponent(encodedMatch[1]);
  const plainMatch = disposition.match(/filename\*?=(?:"([^"]+)"|([^\s;]+))/i);
  return plainMatch?.[1] ?? plainMatch?.[2] ?? null;
};

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
      const base64 = dataUrl.split(",")[1] ?? "";
      resolve({ base64, pagination: unwrapPaginationHeader(headers) });
    };
    reader.onerror = () => reject(new Error("Failed to convert PDF to base64"));
    reader.readAsDataURL(blob);
  });
};

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

  setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);

  if (!tab) {
    triggerFileDownload(blob, finalName);
  }

  return finalName;
};
