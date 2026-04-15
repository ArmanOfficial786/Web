// /**
//  * Extracts filename from Content-Disposition header in API response
//  * Supports both inline and attachment dispositions
//  *
//  * Example header: attachment; filename="AccountStatement.xlsx"
//  * Example header: attachment; filename*=UTF-8''AccountStatement%20Report.xlsx
//  */
// export function extractFilenameFromResponse(response: any): string | null {
//   try {
//     // Get from response headers
//     const contentDisposition =
//       response?.headers?.["content-disposition"] ||
//       response?.headers?.["Content-Disposition"];

//     if (!contentDisposition) {
//       return null;
//     }

//     // RFC 5987 format: filename*=UTF-8''encoded%20filename.xlsx
//     const rfc5987Match = contentDisposition.match(
//       /filename\*=(?:UTF-8'')?(.+?)(?:;|$)/i,
//     );
//     if (rfc5987Match) {
//       try {
//         return decodeURIComponent(rfc5987Match[1]);
//       } catch {
//         // Fallback if decoding fails
//       }
//     }

//     // Standard format: filename="filename.xlsx"
//     const standardMatch = contentDisposition.match(/filename="?([^";\n]+)"?/i);
//     if (standardMatch) {
//       return standardMatch[1];
//     }

//     return null;
//   } catch {
//     return null;
//   }
// }

// /**
//  * Extracts file extension from filename
//  */
// export function getExtensionFromFilename(filename: string): string {
//   const parts = filename.split(".");
//   return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
// }

import {
  ExportFormat,
  type ReportFormat,
} from "@/utilis/Constants/reportConstants";

/**
 * Returns a formatted datestamp string: YYYYMMDD_HHmmss
 * e.g. 20260415_143022
 */
function getDateStamp(): string {
  const now = new Date();
  const pad = (n: number, len = 2) => String(n).padStart(len, "0");

  const date = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
  ].join("");

  const time = [
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("");

  return `${date}_${time}`;
}

/**
 * Extracts filename from Content-Disposition header in API response.
 *
 * Supports:
 *  - RFC 5987 format : filename*=UTF-8''encoded%20name.xlsx
 *  - Standard format : filename="name.xlsx"
 *
 * Falls back to `${fallbackName}.${ext}` using the first extension
 * defined in ExportFormat[format] when no header is present.
 *
 * @param response     - Raw API response object (axios or fetch)
 * @param format       - ReportFormat key (PDF | Word | Excel | Image)
 * @param fallbackName - Base filename to use when header is absent e.g. "AccountStatement"
 * @returns            - Always returns a non-null filename string
 */
export function extractFilenameFromResponse(
  response: unknown,
  format: ReportFormat,
  fallbackName: string,
): string {
  try {
    const res = response as { headers?: Record<string, string> };
    const contentDisposition =
      res?.headers?.["content-disposition"] ||
      res?.headers?.["Content-Disposition"];

    if (contentDisposition) {
      // RFC 5987: filename*=UTF-8''encoded%20name.xlsx
      const rfc5987Match = contentDisposition.match(
        /filename\*=(?:UTF-8'')?(.+?)(?:;|$)/i,
      );
      if (rfc5987Match) {
        try {
          return decodeURIComponent(rfc5987Match[1]);
        } catch {
          // fall through to standard match
        }
      }

      // Standard: filename="name.xlsx" or filename=name.xlsx
      const standardMatch = contentDisposition.match(
        /filename="?([^";\n]+)"?/i,
      );
      if (standardMatch) {
        return standardMatch[1];
      }
    }
  } catch {
    // fall through to fallback
  }

  // Fallback: derive default extension from ExportFormat (first entry)
  // e.g. Image → ["png", "jpg", "jpeg"] → "png"
  const ext = ExportFormat[format]?.[0] ?? "pdf";
  return `${fallbackName}.${getDateStamp()}.${ext}`;
}
