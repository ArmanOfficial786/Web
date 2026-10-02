





import {
  ExportFormat,
  type ReportFormat,
} from "@/utilis/Constants/reportConstants";

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
      const rfc5987Match = contentDisposition.match(
        /filename\*=(?:UTF-8'')?(.+?)(?:;|$)/i,
      );
      if (rfc5987Match) {
        try {
          return decodeURIComponent(rfc5987Match[1]);
        } catch {
        }
      }

      const standardMatch = contentDisposition.match(
        /filename="?([^";\n]+)"?/i,
      );
      if (standardMatch) {
        return standardMatch[1];
      }
    }
  } catch {
  }

  const ext = ExportFormat[format]?.[0] ?? "pdf";
  return `${fallbackName}.${getDateStamp()}.${ext}`;
}
