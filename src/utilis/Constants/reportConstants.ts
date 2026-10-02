import { Pagination } from "types/api/api";

export const PaginationHeader = "x-pagination";


export const DefaultPagination: Pagination = {
  currentPage: 1,
  totalPages: 1,
  totalRecord: 0,
  pageSize: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};


export type ReportFormat = "PDF" | "Word" | "Excel" | "Image";
export const ExportFormat: Record<ReportFormat, string[]> = {
  PDF: ["pdf"],
  Word: ["docx"],
  Excel: ["xlsx"],
  Image: ["png", "jpg", "jpeg"],
};

export const mimeTypes: Record<ReportFormat, string> = {
  PDF: "application/pdf",
  Word: "application/msword",
  Excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  Image: "image/png",
};
