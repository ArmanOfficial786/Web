import type { AxiosResponse } from "axios";
import { type Dispatch, type SetStateAction, useEffect } from "react";
import type { Pagination } from "types/api/api";

import { DefaultPagination } from "./reportConstants";

export interface ReportViewState {
  pdfData?: string;
  isHtml?: boolean;
  isLoading: boolean;
  pagination?: Pagination;
}

/** VIEW response (PDF or raw HTML blob) -> iframe url + type + pagination */
export const parseViewResponse = (res: AxiosResponse<Blob>) => {
  const blob = res.data;
  const isHtml = blob.type.includes("text/html");

  let pagination: Pagination = DefaultPagination;
  try {
    const raw = String(res.headers["x-pagination"] ?? "");
    if (raw) pagination = JSON.parse(raw) as Pagination;
  } catch {
    /* keep default */
  }

  const file = isHtml ? blob : new Blob([blob], { type: "application/pdf" });
  return { pdfData: URL.createObjectURL(file), isHtml, pagination };
};

/** Visual (HTML) reports tell us their real page count via postMessage */
export const useReportPages = (
  setState: Dispatch<SetStateAction<ReportViewState>>,
) => {
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type !== "REPORT_PAGES_READY") return;
      setState((p) => ({
        ...p,
        pagination: { ...p.pagination, totalPages: e.data.totalPages },
      }));
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [setState]);
};
