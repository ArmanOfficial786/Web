export const PaginationHeader = "x-pagination";

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalRecord: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const DefaultPagination: PaginationMeta = {
  currentPage: 1,
  totalPages: 1,
  totalRecord: 0,
  pageSize: 15,
  hasNextPage: false,
  hasPreviousPage: false,
};

export interface ReportState {
  currentPage: number;
  totalPages: number;
  totalRecord: number;
  blobUrl: string;
  pageSize: number;
  loading: boolean;
  reportLoaded: boolean;
  error: string;
  pdfData: string;
}

export const InitialReportState: ReportState = {
  currentPage: 1,
  totalPages: 1,
  totalRecord: 0,
  pageSize: 15,
  blobUrl: "",
  loading: false,
  reportLoaded: false,
  error: "",
  pdfData: "",
};
//it is used in AccountStatementReport
export type ReportFormat = "PDF" | "Word" | "Excel" | "Image";
//it is used in MemberStatementReport
export const ExportFormat: Record<ReportFormat, string[]> = {
  PDF: ["pdf"],
  Word: ["docx"],
  Excel: ["xlsx"],
  Image: ["png", "jpg", "jpeg"],
};

export const mimeTypes: Record<ReportFormat, string> = {
  PDF: "application/pdf",
  Word: "application/msword", // or 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' for .docx
  Excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // or 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' for .xlsx
  Image: "image/png",
};
