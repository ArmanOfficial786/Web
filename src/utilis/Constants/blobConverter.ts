// utils/blobConverter.ts

import { ReportFormat } from "@/components/reports/accountReport/AccountStatement";
import { mimeTypes } from "./reportConstants";

export function responseToBlob(data: unknown, format: ReportFormat): Blob {
  const mimeType = mimeTypes[format];

  // 1. Already a Blob
  if (data instanceof Blob) {
    console.log("Already a blob");
    return data;
  }

  // 2. Uint8Array / ArrayBuffer
  if (data instanceof Uint8Array) {
    // Extract the underlying ArrayBuffer (safe cast)
    return new Blob([(data as Uint8Array).buffer as ArrayBuffer], {
      type: mimeType,
    });
  }
  if (data instanceof ArrayBuffer) {
    console.log("Data is in ArrayByte");
    return new Blob([data], { type: mimeType });
  }

  // 3. String handling
  if (typeof data === "string") {
    const trimmed = data.trim();

    // 3a. Raw PDF / binary string
    if (trimmed.startsWith("%PDF")) {
      const len = trimmed.length;
      const byteArray = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        byteArray[i] = trimmed.charCodeAt(i) & 0xff;
      }
      console.log("Raw pdf/binary string");
      // Use buffer to avoid SharedArrayBuffer type issue
      return new Blob([byteArray.buffer as ArrayBuffer], { type: mimeType });
    }

    // 3b. Data URL
    const dataUrlMatch = trimmed.match(/^data:[^;]+;base64,(.*)$/i);
    if (dataUrlMatch) {
      const base64 = dataUrlMatch[1];
      return base64ToBlob(base64, mimeType);
    }

    // 3c. Base64 string
    let cleaned = trimmed.replace(/\s/g, "");
    cleaned = cleaned.replace(/-/g, "+").replace(/_/g, "/");
    while (cleaned.length % 4 !== 0) cleaned += "=";
    try {
      return base64ToBlob(cleaned, mimeType);
    } catch {
      // not valid base64
    }

    throw new Error(
      "String response is not a valid binary, Base64, or data URL.",
    );
  }

  // 4. Object – recursively extract data
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const possibleFields = [
      "data",
      "pdfData",
      "fileData",
      "base64",
      "pdf",
      "blob",
    ];
    for (const field of possibleFields) {
      if (obj[field] !== undefined) {
        return responseToBlob(obj[field], format);
      }
    }
    if (obj.data && typeof obj.data === "object") {
      return responseToBlob(obj.data, format);
    }
  }

  throw new Error(
    `Unsupported response type: ${typeof data}. Cannot create blob for ${format}.`,
  );
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const binary = atob(base64);
  const len = binary.length;
  const byteArray = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    byteArray[i] = binary.charCodeAt(i);
  }
  // Use buffer to avoid SharedArrayBuffer type issue
  return new Blob([byteArray.buffer as ArrayBuffer], { type: mimeType });
}
