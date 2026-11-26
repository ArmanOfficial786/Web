import type { Pagination } from "./api/api";

export interface ReportResponseDtos {
  pdfData?: string;
  pagination?: Pagination;
}
